import { Gulpclass, Task, SequenceTask  } from 'gulpclass/Decorators';
import { ensureImport, setTemplateFiles }  from './templates/';

const _ = require('lodash');

const yaml = require('read-yaml');

const gulp = require('gulp');

const del = require('del');

const args = require('yargs')
    .option('c', {
        alias: 'component',
        describe: 'Create a new component',
        type: 'string'
    })
    .option('s', {
        alias: 'service',
        describe: 'Create a new service',
        type: 'string'
    })
    .option('d', {
        alias: 'directive',
        describe: 'Create a new directive',
        type: 'string'
    })
    .option('cl', {
        alias: 'class',
        describe: 'Create a new class',
        type: 'string'
    })
    .option('i', {
        alias: 'interface',
        describe: 'Create a new interface',
        type: 'string'
    })
    .option('p', {
        alias: 'class',
        describe: 'Create a new pipe',
        type: 'string'
    })
    .option('path', {
        describe: 'Change the default path',
        type: 'string'
    }).argv;

const $ = require('gulp-load-plugins')
        ({
            lazy: true,
            rename: {
                'gulp-add-src': 'src',
                'gulp-clean-css': 'cleancss'
            }
        });

const wiredep = require('wiredep').stream;

// Set config from JSON file 
const config = yaml.sync('./config.yml');

// $.exec report options
const reportOptions = {
    err: true,
    stderr: true,
    stdout: true
  };

/**
 * Log Message function (params:any)
 * Used in Gulp tasks to output custom messages
 */
function log(msg: any) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}


/** 
 * Main Gulp Tasks - Will move to sepaerate folder
 */
@Gulpclass()
export class Gulpfile {

    // Used for setting current generate file name
    // See generate-files
    argName = {
        value: ''
    };

    // This Task is used to generate new Angular files
    // This will create files in ./src/gallery
    @Task('generate-files')
    generateFiles() {
        // Create an Array of files
        let files = setTemplateFiles(args).files;
        this.argName = setTemplateFiles(args).argName;

        return gulp.src(config.template.src, {base: config.template.base})
        .pipe($.foreach(function(stream: any, f: any){
            files.forEach(function(gfile: any){
                stream
                    .pipe($.file(gfile.name, gfile.content))
                    .pipe($.template({name: _.upperFirst(gfile.type), selector: gfile.type}))
                    .pipe(gulp.dest(config.template.output));
            });
            return stream;
        }));

    }

    // Lightweight scaffolding task for Angular
    // gulp generate --component --service --pipe --directive --interface --enum --class name
    @SequenceTask()
    generate() {
        return ['generate-files', 'generate-copy', 'generate-clean'];
    }

    // Sass task for files stored in ./src/assets/sass
    @Task('sass')
    sass() {
        log('Compiling Sass files');
        return gulp.src(config.styles.input)
            .pipe($.plumber())
            .pipe($.changed(config.styles.output))
            .pipe($.if(args.verbose, $.print()))
            .pipe($.sass.sync({outputStyle: 'expanded'}))
            .pipe($.sass().on('error', $.sass.logError))
            .pipe($.autoprefixer())
            .pipe($.header('/** ' + config.company + ' - style.css' +
            '\n *' +
            '\n' + ' * Author: ' + config.author +
            '\n' + ' * Last Updated:' + $.util.date('mmm d, yyyy h:MM:ss TT') +
            '\n *' +
            '*/\n' +
            '\n'))
            .pipe(gulp.dest(config.styles.output));
    }

    // Copies Angular Libraries to Dist folder on compilation
    @Task('copy-libs')
    copyLibs() {
     log('Copying Angular library files');
      return gulp.src(config.node_modules.input, {base: config.node_modules.base})
        .pipe(gulp.dest(config.node_modules.output));
    }

    // Copies Angular Libraries to Dist folder on compilation
    @Task('copy-bower')
    copyBower() {
     log('Copying Bower library files');
      return gulp.src(config.bower_components.input, {base: config.bower_components.base})
        .pipe(gulp.dest(config.bower_components.output));
    }

    // Copies Js dependencies
    @Task('copy-js')
    copyJs() {
      return gulp.src(config.javascript.input)
        .pipe(gulp.dest(config.base));
    }

   // Copies html files
    @Task('copy-html')
    copyHtml() {
      return gulp.src(config.html.input)
        .pipe(gulp.dest(config.base))
        .pipe($.connect.reload());
    }

    // copy html files
    @Task('generate-copy', ['generate-files'])
    generateCopy() {
      return gulp.src(config.template.input)
        .pipe($.plumber())
        .pipe(gulp.dest(config.app + this.argName.value))
        .pipe( $.print());
    }

    @Task('generate-clean')
    generateClean() {
        return del(config.template.output);
    }

    /* Clean Dist folder */
    @Task('clean-all')
    cleanAll() {
        return del(config.clean.input).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    }

    /* Replace env variable ./src/app/environment.ts */
    @Task('replace-env')
    replaceEnv() {
        return gulp.src([config.app + 'environment.ts'])
        .pipe($.if(args.env === 'production', $.replace('false', 'true')))
        .pipe($.if(args.env === 'development', $.replace('true', 'false')))
        .pipe(gulp.dest('./', {cwd: config.app}));
    }

    /* Update ./src/maint.ts based on the ENV variable  */
    @Task('update-main')
    updateMain() {
        let importFile;

        if (args.env === 'production') {
            importFile = ensureImport.mainProductionTemplate;
        } else if (args.env === 'development') {
            importFile = ensureImport.mainDevelopmentTemplate;
        }
        return $.file(config.src + 'main.ts', importFile, { src: true })
            .pipe(gulp.dest('.'));
    }

    /* Open Task in Chrome Browser  */
    @Task('open-browser')
    open() {
        return gulp.src(config.root)
            .pipe($.open({uri: config.url + ':' + config.port}));
    }

    /**
     * Inject CSS/JS into index.html
     */
    @Task('inject', ['sass'])
    inject() {
        let injectOptions = {
            ignorePath: config.bower_components.ignore
        };

        let options = {
            bowerjson: 'bower.json',
            directory: config.bower_components.base,
            ignorePath: '..'
        };

        return gulp.src(config.src + 'index.html')
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src(config.dependencies_js.input, {read: false}), injectOptions))
            .pipe($.inject(gulp.src(config.dependencies_angularjs.input, {read: false}) ,
                {starttag: '<!-- inject:head:{{ext}} -->'}, injectOptions))
            .pipe($.inject(gulp.src(config.dependencies_css.input, {read: false}), injectOptions))
            .pipe(gulp.dest(config.base));
    }


    /* Watch Html files */
    @Task('watch')
    watch() {
        gulp.watch(config.styles.input, ['sass']);
    }

    // Run Ahead of Time compilation prior to prodution build
    @Task('run-aot')
    runAot() {
        return gulp.src(['.'])
        .pipe($.exec(config.commands.factory))
        .pipe($.exec(config.commands.aot))
        .pipe($.exec.reporter(reportOptions));
    }

    // Run rollup.js build task for production
    @Task('run-rollup')
    runRollup() {
        return gulp.src(['.'])
        .pipe($.exec(config.commands.rollup))
        .pipe($.exec.reporter(reportOptions));
    }

    // Delete /node_modules/@types on production build
    // This is needed as there is a current bug with Angular 2 Webpack build
    @Task('del-typings')
    delTypings() {
        return del(config.node_modules.typings).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    }

    // Optimize images on production build
    @Task('images')
    images() {
        return gulp.src(config.images.input)
            .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
            .pipe(gulp.dest(config.images.output));
    }

    // Minify and Gzip css file on production build
    @Task()
    styles() {
        return gulp.src(config.css.input)
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cleancss())
        .pipe($.gzip( {append: false}))
        .pipe(gulp.dest(config.css.output));
    }

    // Minify Html file on production build
    @Task()
    minify() {
    return gulp.src(config.base + '*.html')
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.base));
    }

    // Run a local development server on localhost:8080
    // THis is run with build-aot to display the final build
    @Task('connect')
    connect() {
        $.connect.server({
            root: config.base,
            port: config.port,
            https: false,
            livereload: true
        });
    }

    // Run a test server on localhost:5000
    // The port can be configured in .config.yml
    // This task is used to display the Istanbul coverage reports
    @Task('connect-test')
    connectTest() {
        $.connect.server({
            root: config.test,
            port: config.test_port,
            https: false,
            livereload: false
        });
    }

    // Builds out the Appliation for production
    @SequenceTask('build-prod')
    buildProd() {
        return [
                ['clean-all', 'replace-env', 'update-main'],
                ['del-typings'],
                ['run-aot'],
                ['run-rollup'],
                ['copy-libs', 'copy-bower', 'styles', 'images'],
                ['inject'],
                ['minify', 'connect', 'open-browser']
                ];
    }

    // Build and run development server using Webpack
    @SequenceTask('build-dev')
    buildDev() {
        return [
                ['clean-all', 'replace-env', 'update-main'],
                ['watch',
                'sass']
                ];
    }

    // Default gulp task
    // Used to reset ENV variable
    @Task()
    default() {
        return ['replace-env', 'update-main'];
    }

}

