Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');
require('reflect-metadata');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

require('ts-helpers');

var appContext = require.context('../src/app/', true, /\.spec\.ts/);

//var coverageContext = require.context('../src/app/', true, /\.ts/);

appContext.keys().forEach(appContext);

//coverageContext.keys().forEach(coverageContext);

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
