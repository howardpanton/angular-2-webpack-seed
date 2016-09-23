# Angular 2 Webpack Seed

![Image of Angular Logo](public/images/angular.png)

[![Build Status](https://travis-ci.org/howardpanton/angular-2-webpack-seed.svg?branch=master)](https://travis-ci.org/howardpanton/angular-2-webpack-seed)
[![Code Climate](https://codeclimate.com/github/howardpanton/angular-2-webpack-seed/badges/gpa.svg)](https://codeclimate.com/github/howardpanton/angular-2-webpack-seed)
[![Test Coverage](https://codeclimate.com/github/howardpanton/angular-2-webpack-seed/badges/coverage.svg)](https://codeclimate.com/github/howardpanton/angular-2-webpack-seed/coverage)

This project provides an [Angular 2](https://angular.io/) front-end and build system using [Webpack](https://webpack.github.io/) , [Rollup](http://rollupjs.org/) and [AoT](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html).
It was developed for the new [Cobe.io](https:cobeio) UI, and open sourced to provide a template for people starting out on Angular 2.

[Demo](https://howardpanton.github.io/angular-2-webpack-seed/)

## Getting started

To get up and running you need to fork the [UI Repository](https://github.com/howardpanton/angular-2-webpack-seed/) on Bitbucket.

The clone the repo locally.

` git clone https://github.com/howardpanton/angular-2-webpack-seed/`

This will download the following files into your directory.

```
├── README.md
├── bower.json
├── config
│   ├── helpers.js
│   ├── karma-test-shim.js
│   ├── karma.conf.js
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   ├── webpack.prod.js
│   └── webpack.test.js
├── config.yml
├── e2e
│   ├── app.e2e-spec.ts
│   ├── app.po.ts
│   └── tsconfig.json
├── gulpfile.ts
├── karma.conf.js
├── package.json
├── protractor.conf.js
├── public
│   ├── css
│   └── images
├── rollup.js
├── src
│   ├── app
│   ├── assets
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── tsconfig.aot.json
│   ├── tsconfig.json
│   └── vendor.ts
├── templates
│   ├── class_template.ts
│   ├── component_template.ts
│   ├── directive_template.ts
│   ├── index.ts
│   ├── interface_template.ts
│   ├── main-development_template.ts
│   ├── main-production_template.ts
│   ├── pipe_template.ts
│   └── service_template.ts
├── tsconfig.json
├── tslint.json
├── typings.json
└── webpack.config.js
```

`bower.json` can  be used to add any [Bower](https://bower.io/) dependencies.

`config/` directory contains the [Karma](https://karma-unner.github.io/)  and [Webpack](https://webpack.github.io/) configuration files. Changing these files is liable to break tests and build.

`config.yml` contains all of the Gulp file settings and paths. THis file can be editied if you need to change server settings or output paths.

`e2e/` directory contains the spec file for end to end testing using [protractor.js](http://www.protractortest.org/).

`gulpfile.ts` contains all of the [Gulp](http://gulpjs.com/) tasks required for the project.

`karma.conf.js` is the entrypoint for  [karma.js](https://karma-runner.github.io) testing framework.

`package.json` is the configuration file for [NPM](https://nodejs.org/). It identifies npm package dependencies for the project.

`protractor.conf.js` is the entrypoint and main configuration file for [protractor.js](http://www.protractortest.org/) testing framework.

`public/` directory contains `css/` and `images/`, you can add css files here or if you are using `sass`, the Gulp build will output files in `css/`. Anything stored in `public/` is coped accross into `dist/` on application build.

`rollup.js` is the main configuration file for [rollup.js](http://rollupjs.org/), and it is required for building a production ready application.

`src/` directory contains the main Angular application, the `app/` folder is the root of the Angular application. There is also a separate `tsconfig` for AoT compiliation used for the production build.
`assets/` folder contains any `sass` files required for the project. The `sass` files will be outputted to `./public/css` on build.

`templates/` directory stores the Gulp generate task templates files, the template files are used by the task to auto generate any Angular templates.

`tsconfig.json` defines how the TypeScript compiler generates JavaScript from the project's files.

`tsclint.json` defines how the TypeScript linter settings for the project, please note that this project is using [codelyzer](https://github.com/mgechev/codelyzer).

`typings.json` provides additional definition files for libraries that the TypeScript compiler doesn't natively recognize.

`webpack.config.js` is the entrypoint for [Webpack](https://webpack.github.io/) build framework.



## Prerequisites

* node v5.x.x or higher and npm 3 or higher.

To get up and running with the UI repo you need the latest version of Node JS and NPM.
 
Make sure, that you have the supported versions of Node and NPM. If you have the older versions, uninstall node, download and install the required version.

NPM is already integrated in the Node installer, so you don’t have to worry about manually upgrading it.

[Node JS](https://nodejs.org/) is a Node.js is a platform built on [Chrome's JavaScript runtime](http://code.google.com/p/v8/). 
You can install Node from [here](http://nodejs.org/dist/v0.12.5/node-v0.12.5.pkg).

Once Node has been installed you can check the version of Node JS by entering the following into terminal/iterm

```
node -v
```

Install [Typescript](https://www.typescriptlang.org/) globally

```
npm install -g typescript
```


## Usage

Next we need to install the `package.json` dependencies, enter the following command into Terminal/Iterm.

```bash

cd angular-2-webpack-seed

# Install the project's dependencies
npm install

# Install any Bower dependencies
bower install

# Starts webpack development build and watches your files for changes
# This will create a local devlopment server at http://locahost:8080
npm start

# Run karma tests with code coverage
# Coverage is run using istanbul-remap, you can view the coverage report at http://locahost:5000
npm test && npm run test-server

# End to End tests with protractor
# Run npm start first to create a local development server
npm run e2e

# Webpack build
npm run build-webpack

# Webpack build and open build in browser on port 8080
npm run build-webpack && gulp-connect && gulp-open

# AoT compilation and Rollup build, the build will open in browser on port 8080
npm run build-aot


```


## Options

You can scaffold Angular files and change the development environment

```bash

# Create a new component
# This will create a new Angular component in ./src/app/foo/foo.component.ts
# It will also create the corresponding html, css and spec files.
gulp generate --component foo

# Create a new service
# This will create a new Angular service in ./src/app/foo/foo.service.ts
# It will also create the corresponding spec files.
gulp generate --service foo

# create a new class
# This will create a new Angular class in ./src/app/foo/foo.class.ts
# It will also create the corresponding spec files.
gulp generate --class foo

# create a new directive
# This will create a new Angular directive in ./src/app/foo/foo.directive.ts
# It will also create the corresponding spec files.
gulp generate --directive foo

# create a new interface
# This will create a new Angular interface in ./src/app/foo/foo.interface.ts
gulp generate --interface foo

# create a new enum
# This will create a new Angular enum in ./src/app/foo/foo.enum.ts
# It will also create the corresponding spec files.
gulp generate --enum foo

# create a new pipe
# This will create a new Angular pipe in ./src/app/foo/foo.pipe.ts
# It will also create the corresponding spec files.
gulp generate --pipe foo

# Change the ENV variable to development
gulp --env=development

# Change the ENV variable to development
gulp --env=production

```


## Tests

Tests have been setup with Jasmine, Karma and Istanbul. Unit test should be stored in `/src/app/` within the corresponding folders.

End to End tests have been setup using protractor and should be stored in `./e2e/`


## Builds

The UI uses two build systems, Webpack and Rollup, you could also builds using SystemJs and gulp, but this will need some modifications to the Gulp file.
You can run a build by typing the command `npm run build-webpack` or `npm run build-aot` this will start off the build process and clean up any unecessary files.

The main difference in the build systems is that webpack chunks the files as it processes the build and creates 3 files `app.js' `vendor.js` and `pollyfill.js`.
Webpack will also package any assets the application requires such as css or images.

The rollup build uses es2015 tree-shaking to remove any unecessary modules and it creates a single build file in `./dist`. AoT compilation will also be doe pre-build.

All builds can be viewed by running `gulp connect open`, this will run a server at `localhost:8080`.

If you need to change any port or path settings you can edit `./comfig.yml`.


## Issues

There is currently an issue with Angular 2 webpack and the NPM `@types` module. To get around this bug, the `node_modules/@types` directory is removed at build time.
