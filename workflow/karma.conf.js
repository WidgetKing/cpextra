// Karma configuration
// Generated on Fri Sep 25 2015 20:30:23 GMT+0800 (W. Australia Standard Time)

// const puppeteer = require('puppeteer');

// process.env.CHROME_BIN = puppeteer.executablePath();
process.env.CHROME_BIN = "/usr/bin/chromium-browser"

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'components/scripts/js/tests/testsSetup.js',
      'components/scripts/js/dev/main.js',
      'components/scripts/js/dev/**/*.js',
      'components/scripts/js/tests/testsTeardown.js',
      'components/scripts/js/tests/**/*.js',
      'components/scripts/js/tests/main.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        "components/scripts/js/dev/**/*.js":['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
        type:'html',
        'dir': 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    usePolling: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],
    browsers: ['ChromeHeadless'],
    //browsers: ['IE'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
