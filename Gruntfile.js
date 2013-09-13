'use strict';

var BROWSERS = [
  'PhantomJS',
  'Opera',
  'Firefox',
  'Chrome',
  'ChromeCanary',
  'Safari'
];

var config = {
  src: 'src/',
  build: 'tmp/'
};

module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    config: config,
    pkg: require('./package.json'),
    bower: require('./bower.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= config.src %>/**/*.js'
      ]
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      watch: {
        options: {
          autoWatch: true,
          singleRun: false
        }
      },
      ci: {
        options: {
          browsers: ['Firefox', 'Chrome']
        }
      },
      unit: {
        options: {
          browsers: BROWSERS
        }
      },
      coverage: {
        options: {
          reporters: ['coverage'],
        }
      }
    },
    copy: {
      build: {
        files: [{
          expand: true,
          flatten: true,
          cwd: '<%= config.src %>',
          dest: '<%= config.build %>',
          src: [
            '**/*.js',
            '!**/*spec.js'
          ]
        }]
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '/**\n' +
          ' * @license <%= pkg.name %> v<%= pkg.version %>\n' +
          ' * (c) 2013-<%= grunt.template.today("yyyy") %> GoCardless, Ltd.\n' +
          ' * <%= pkg.repository.url %>\n' +
          ' * License: MIT\n' +
          ' */',
      },
      build: {
        src: ['<%= config.build %>/*.js'],
        dest: '<%= bower.main %>'
      }
    },
    clean: {
      build: {
        files: [{
          dot: true,
          src: [
            '<%= config.build %>'
          ]
        }]
      }
    },
    ngtemplatecache: {
      options: {
        stripPrefix: '<%= config.build %>'
      },
      build: {
        files: [{
          src: ['<%= config.build %>/**/*.html'],
          dest: '<%= config.build %>/directive-template.js'
        }]
      }
    },
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= config.src %>/**/*.html'],
          dest: '<%= config.build %>'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= bower.name %>.min.js': ['<%= bower.main %>']
        }
      }
    },
    'ddescribe-iit': {
      files: [
        'src/**/*.js',
      ]
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('citest', [
    'jshint',
    'ddescribe-iit',
    'karma:ci'
  ]);

  grunt.registerTask('build', [
    // 'test',
    'htmlmin',
    'ngtemplatecache',
    'copy:build',
    'concat',
    'clean:build',
    'uglify'
  ]);
};
