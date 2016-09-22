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

        return gulp.src('./templates/index.ts', {base: './templates'})
        .pipe($.foreach(function(stream: any, f: any){
            files.forEach(function(gfile: any){
                stream
                    .pipe($.file(gfile.name, gfile.content))
                    .pipe($.template({name: _.upperFirst(gfile.type), selector: gfile.type}))
                    .pipe(gulp.dest('./tmp'));
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
            .pipe($.header('/** Cobe.io - style.css' +
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
        .pipe(gulp.dest('./src/app/' + this.argName.value))
        .pipe( $.print());
    }

    @Task('generate-clean')
    generateClean() {
        return del(config.template.clean);
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
        return gulp.src(['./src/app/environment.ts'])
        .pipe($.if(args.env === 'production', $.replace('false', 'true')))
        .pipe($.if(args.env === 'development', $.replace('true', 'false')))
        .pipe(gulp.dest('./', {cwd: './src/app'}));
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
        return $.file('./src/main.ts', importFile, { src: true })
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

        return gulp.src('./src/index.html')
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src(config.dependencies_js.input, {read: false}), injectOptions))
            .pipe($.inject(gulp.src(config.dependencies_angularjs.input, {read: false}) ,
                {starttag: '<!-- inject:head:{{ext}} -->'}, injectOptions))
            .pipe($.inject(gulp.src(config.dependencies_css.input, {read: false}), injectOptions))
            .pipe(gulp.dest('./dist'));
    }


    /* Watch Html files */
    @Task('watch')
    watch() {
        gulp.watch(config.styles.input, ['sass']);
    }

    @Task('run-aot')
    runAot() {
        return gulp.src(['.'])
        .pipe($.exec('touch ./src/app/app.module.ngfactory.ts'))
        .pipe($.exec('node_modules/.bin/ngc -p ./src/tsconfig.aot.json'))
        .pipe($.exec.reporter(reportOptions));
    }

    @Task('run-rollup')
    runRollup() {
        return gulp.src(['.'])
        .pipe($.exec('node_modules/.bin/rollup -c rollup.js'))
        .pipe($.exec.reporter(reportOptions));
    }

    @Task('del-typings')
    delTypings() {
        return del(config.node_modules.typings).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    }

    @Task('images')
    images() {
        return gulp.src('./public/images/**/*')
            .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
            .pipe(gulp.dest('./dist/public/images/'));
    }

    @Task()
    styles() {
        return gulp.src('./public/css/*')
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cleancss())
        .pipe($.gzip( {append: false}))
        .pipe(gulp.dest('./dist/public/css/'));
    }

    @Task()
    minify() {
    return gulp.src('./dist/*.html')
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'));
    }

    @Task('connect')
    connect() {
        $.connect.server({
            root: config.base,
            port: config.port,
            https: false,
            livereload: true
        });
    }

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

    @SequenceTask('build-dev')
    buildDev() {
        return [
                ['clean-all', 'replace-env', 'update-main'],
                ['watch',
                'sass']
                ];
    }

    @Task()
    default() {
        return ['replace-env', 'update-main'];
    }

}
