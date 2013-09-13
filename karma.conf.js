'use strict';

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: './',

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
    },

    // list of files / patterns to load in the browser
    files: [
      // jQuery is used when testing directives
      'components/jquery/jquery.js',

      // Vendor
      'components/bower-angular/angular.js',
      'components/bower-angular-mocks/angular-mocks.js',

      // Specs helpers
      'components/jasmine-helpers/*.js',

      // app & specs
      'src/**/*.js',

      // templates
      'src/**/*.html'
    ],

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['dots', 'growl'],

    reportSlowerThan: 50,

    // enable / disable watching file and executing tests
    // whenever any file changes
    autoWatch: true,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
