import { Gulpclass, Task, SequenceTask  } from 'gulpclass/Decorators';
import { classTemplate }  from './templates/class_template';
import { componentTemplate }  from './templates/component_template';
import { directiveTemplate }  from './templates/directive_template';
import { interfaceTemplate }  from './templates/interface_template';
import { serviceTemplate }  from './templates/service_template';
import { pipeTemplate }  from './templates/pipe_template';
import { mainDevelopmentTemplate }  from './templates/main-development_template';
import { mainProductionTemplate }  from './templates/main-production_template';

const _ = require('lodash');

/** Main gulp imports will be moved */
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

const $ = require('gulp-load-plugins')({lazy: true,  rename: {
    'gulp-add-src': 'src',
    'gulp-clean-css': 'cleancss'
  }
});
const wiredep = require('wiredep').stream;



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
 * Set Config function
 * Used to set the configuration variabels for the Gulp Tasks
 */
function  setConfig() {
    console.log('am i running');
    gulp.src('./config.yml')
        .pipe($.yaml())
        .pipe($.print())
        .pipe(gulp.dest('.'));
}

/* Run Configuration */
setConfig();

/* Set config from JSON file */
const config = require('./config.json');

const reportOptions = {
    err: true, // default = true, false means don't write err 
    stderr: true, // default = true, false means don't write stderr 
    stdout: true // default = true, false means don't write stdout 
}

/** 
 * Main Gulp Tasks - Will move to sepaerate folder
 */
@Gulpclass()
export class Gulpfile {

    /* ToDos */
    // Build Task
    // Unit test Task
    // Deploy Task
    // E2E Task
    // Image Task
    // Update ENV from CLI
    /* Compile Sass files */
    argName = {
        value: ''
    };

    @Task('generate-files')
    generateFiles() {
        let files: any;
        // gulp generate --component gallery
        if (_.has(args, 'component')) {
            this.argName.value = _.get(args, 'component');
            files = [
            {name: this.argName.value + '.component.ts', content: componentTemplate.component, type: this.argName.value},
            {name: this.argName.value + '.component.css', content: componentTemplate.css, type: this.argName.value},
            {name: this.argName.value + '.component.html', content: componentTemplate.html, type: this.argName.value},
            {name: this.argName.value + '.component.spec.ts', content: componentTemplate.test, type: this.argName.value}
            ];
        } else if (_.has(args, 'service')) {
            this.argName.value = _.get(args, 'service');
            files = [
            {name: this.argName.value + '.service.ts', content: serviceTemplate.component, type: this.argName.value},
            {name: this.argName.value + '.service.spec.ts', content: serviceTemplate.test, type: this.argName.value}
            ];
        } else if (_.has(args, 'class')) {
            this.argName.value = _.get(args, 'class');
            files = [
            {name: this.argName.value + '.class.ts', content: classTemplate.component, type: this.argName.value},
            {name: this.argName.value + '.class.spec.ts', content: classTemplate.test, type: this.argName.value}
            ];
        } else if (_.has(args, 'directive')) {
            this.argName.value = _.get(args, 'directive');
            files = [
            {name: this.argName.value + '.directive.ts', content: directiveTemplate.component, type: this.argName.value},
            {name: this.argName.value + '.directive.spec.ts', content: directiveTemplate.test, type: this.argName.value}
            ];
        } else if (_.has(args, 'interface')) {
            this.argName.value = _.get(args, 'interface');
            files = [
            {name: this.argName.value + '.interface.ts', content: interfaceTemplate.component, type: this.argName.value}
            ];
        } else if (_.has(args, 'pipe')) {
            this.argName.value = _.get(args, 'pipe');
            files = [
            {name: this.argName.value + '.pipe.ts', content: pipeTemplate.component, type: this.argName.value},
            {name: this.argName.value + '.pipe.spec.ts', content: pipeTemplate.test, type: this.argName.value}
            ];
        }
        return gulp.src('./tmp/index.ts', {base: './tmp'})
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

    @SequenceTask()
    generate() {
        return ['generate-files', 'generate-copy', 'generate-clean'];
    }

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
            .pipe($.header('/** Cobe.io - main.css' +
            '\n *' +
            '\n' + ' * Author: Howard Panton' +
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

    // copy dependencies
    @Task('copy-js')
    copyJs() {
      return gulp.src(config.javascript.input)
        .pipe(gulp.dest(config.base));
    }

   // copy html files
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
        return del(config.template.input);
    }


    /* Clean Dist folder */
    @Task('clean-all')
    cleanAll() {
        return del(config.clean.input).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    }

    /* Clean Dist folder */
    @Task('replace-env')
    replaceEnv() {
        return gulp.src(['./src/app/'])
        .pipe($.if(args.env === 'production', 
            $.exec("sed -i.bak 's/false/true/g' ./src/app/environment.ts; touch ./src/app/app.module.ngfactory.ts")))
        .pipe($.if(args.env === 'development', 
            $.exec("sed -i.bak 's/true/false/g' ./src/app/environment.ts")))
        .pipe($.exec.reporter(reportOptions))
        .pipe($.if(args.env === 'production', 
            $.file('./src/main.ts', mainProductionTemplate)))
        .pipe($.if(args.env === 'development', 
            $.file('./src/main.ts', mainDevelopmentTemplate)))
        .pipe(gulp.dest('./', {cwd: './'}));
    }


    /* Open Task in Chrome as  */
    @Task('open-browser')
    open() {
        return gulp.src(config.root)
            .pipe($.open({uri: config.url + config.port}));
    }


/**
 * Inject 
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
        .pipe($.inject(gulp.src(config.dependencies_angularjs.input, {read: false}) ,{starttag: '<!-- inject:head:{{ext}} -->'}, injectOptions))
        .pipe($.inject(gulp.src(config.dependencies_css.input, {read: false}), injectOptions))
        .pipe(gulp.dest('./dist'));
}


    /* Watch Html files */
    @Task('watch')
    watch() {
        // gulp.watch(config.typescript.input, ['compile-ts']);
        gulp.watch(config.styles.input, ['sass']);
        // gulp.watch(config.html.input, ['copy-html']);
    }

    @Task('run-aot')
    runAot() {
        return gulp.src(['.'])
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

    // Builds out the Appliation for production
    // Cleans and previous Factory files
    // Set ENv to prod
    // Copy files
    // Inject Html
    // Minify
    // Gzip
    // Start server Prod
    @SequenceTask('build-prod')
    buildProd() {
        return [
                ['clean-all', 'replace-env'],
                ['del-typings'],
                ['run-aot'],
                ['run-rollup'],
                ['copy-libs', 'copy-bower', 'styles', 'images'],
                ['inject'],
                ['minify','connect', 'open-browser']
                ];
    } 

    @SequenceTask('build-dev')
    buildDev() {
        return [
                ['clean-all', 'replace-env'],
                ['watch',
                'sass']
                ];
    } 

}
