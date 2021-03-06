'use strict';

module.exports = function(grunt) {

  /**
   * Dynamically load npm tasks
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /**
     * Project info
     */
    project: {
      src: 'src',
      dist: 'dist',
      css: ['<%= project.src %>/less/style.less'],
      scss: ['<%= project.src %>/sass/style.scss'],
      js: ['<%= project.src %>/js/*.js'],
      jsDep: [
        'bower_components/cookieconsent2/cookieconsent.js',
        'bower_components/bootstrap/js/dropdown.js',
      ],
    },

    /**
     * Project banner
     * Dynamically appended to CSS and JS files
     * Inherits text from package.json
     */
    tag: {
      banner:
        '/*!\n' +
        ' * <%= pkg.title %> <%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * Copyright <%= pkg.copyright %> <%= pkg.author.name %> (<%= pkg.author.url %>)\n' +
        ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
        ' */\n',
      wordpress:
        '/*\n' +
        'Theme Name: <%= pkg.title %>\n' +
        'Theme URI: <%= pkg.homepage %>\n' +
        'Author: <%= pkg.author.name %>\n' +
        'Author URI: <%= pkg.author.url %>\n' +
        'Description: <%= pkg.description %>\n' +
        'Version: <%= pkg.version %>\n' +
        'License: <%= pkg.license.type %>\n' +
        'License URI: <%= pkg.license.url %>\n' +
        '*/\n',
    },

    /**
     * Clean files and folders
     * https://github.com/gruntjs/grunt-contrib-clean
     * Remove generated files for clean deploy
     */
    clean: {
      prod: [
        '<%= project.dist %>/style.unprefixed.css',
        '<%= project.dist %>/style2.unprefixed.css',
        '<%= project.dist %>/style.prefixed.css',
        '<%= project.dist %>/style.min.css',
      ]
    },

    /**
     * Copy static PHP files
     * https://github.com/gruntjs/grunt-contrib-copy
     */
    copy: {
      php: {
        expand: true,
        cwd: '<%= project.src %>/',
        src: '**.php',
        dest: '<%= project.dist %>/',
      },
      header: {
        expand: true,
        cwd: '<%= project.src %>/',
        src: 'img/header.jpg',
        dest: '<%= project.dist %>/',
      },
    },

    /**
     * Add the livereload script to the footer
     * https://github.com/yoniholmes/grunt-text-replace
     */
    replace: {
      livereload: {
        src: '<%= project.dist %>/footer.php',
        overwrite: true,
        replacements: [{
          from: '</body>',
          to: function() {
            return '<script src="http://localhost:35729/livereload.js"></script></body>';
          }
        }],
      },
    },

    /**
     * JSHint
     * https://github.com/gruntjs/grunt-contrib-jshint
     * Manage the options inside .jshintrc file
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      files: [
        '<%= project.js %>',
        'Gruntfile.js',
      ],
    },

    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      dev: {
        options: {
          stripBanners: true,
          nonull: true,
          banner: '<%= tag.banner %>',
        },
        files: {
          '<%= project.dist %>/js/scripts.min.js': [
            '<%= project.js %>',
            '<%= project.jsDep %>',
          ],
        },
      },
      css: {
        files: {
          '<%= project.dist %>/style.unprefixed.css': [
            '<%= project.dist %>/style.unprefixed.css',
            '<%= project.dist %>/style2.unprefixed.css',
          ],
        },
      },
    },

    /**
     * Minify JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      prod: {
        files: {
          '<%= project.dist %>/js/scripts.min.js': [
            '<%= project.js %>',
            '<%= project.jsDep %>',
          ],
        },
      },
    },

    /**
     * Compile Less files
     * https://github.com/gruntjs/grunt-contrib-less
     */
    less: {
      dev: {
        options: {
          banner: '<%= tag.wordpress %>',
        },
        files: {
          '<%= project.dist %>/style.unprefixed.css': '<%= project.css %>',
          '<%= project.dist %>/editor-style.css': '<%= project.src %>/less/editor-style.less',
        },
      },
      prod: {
        files: {
          '<%= project.dist %>/style.unprefixed.css': '<%= project.css %>',
          '<%= project.dist %>/editor-style.css': '<%= project.src %>/less/editor-style.less',
        },
      },
    },

    /**
     * Compile SCSS
     */
    sass: {
      prod: {
        files: {
          '<%= project.dist %>/style2.unprefixed.css': '<%= project.scss %>',
        },
      },
    },

    /**
     * Remove unused CSS
     * https://github.com/addyosmani/grunt-uncss
     */
    uncss: {
      prod: {
        options: {
          stylesheets: ['style.unprefixed.css'],
          ignore: [
            /#header.*/,
            /#site-navigation.*/,
            /#content.*/,
            /#sidebar.*/,
            /#footer.*/,
            /\.entry-header.*/,
            /\.entry-content.*/,
            /\.entry-meta.*/,
            /\.archive-header.*/,
            /.*\.toggled-on/,
            /\.aligncenter/,
            /\.pager/,
            /\.cc_.*/,
            'embed',
            'iframe',
            'object',
            'video',
            /\.dropdown-menu.*/,
          ],
          urls: [
            'http://localhost/wordpress',
            'http://localhost/wordpress/?p=1',
            'http://localhost/wordpress/?page_id=2',
          ],
        },
        files: {
          '<%= project.dist %>/style.unprefixed.css': [
            'dist/*.php',
          ],
        },
      },
    },

    /**
     * Add and remove CSS vendor prefixes
     * https://github.com/nDmitry/grunt-autoprefixer
     */
    autoprefixer: {
      options: {
        browsers: [
          'last 2 version',
          'safari 7',
          'ie 9',
          'ios 7',
          'android 4',
        ],
      },
      dev: {
        src: '<%= project.dist %>/style.unprefixed.css',
        dest: '<%= project.dist %>/style.css',
      },
      prod: {
        src: '<%= project.dist %>/style.unprefixed.css',
        dest: '<%= project.dist %>/style.prefixed.css',
      },
    },

    /**
     * CSS minification
     * https://github.com/gruntjs/grunt-contrib-cssmin
     */
    cssmin: {
      prod: {
        src: '<%= project.dist %>/style.prefixed.css',
        dest: '<%= project.dist %>/style.css',
      },
    },

    /**
     * Add banners
     */
    usebanner: {
      options: {
        position: 'top',
        linebreak: true,
      },
      css: {
        options: {
          banner: '<%= tag.wordpress %>',
        },
        files: {
          src: '<%= project.dist %>/style.css',
        },
      },
      js: {
        options: {
          banner: '<%= tag.banner %>',
        },
        files: {
          src: '<%= project.dist %>/js/scripts.min.js',
        },
      },
    },

    /**
     * Compile the language PO file to MO
     * https://github.com/MicheleBertoli/grunt-po2mo
     */
    po2mo: {
      prod: {
        src: '<%= project.src %>/languages/sv_SE.po',
        dest: '<%= project.dist %>/languages/sv_SE.mo',
      },
    },

    /**
     * Opens the web server in the browser
     * https://github.com/jsoverson/grunt-open
     */
    open: {
      server: {
        path: 'http://localhost/wordpress',
      },
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint'],
      },
      js: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['jshint', 'concat:dev', 'usebanner:js'],
      },
      less: {
        files: '<%= project.src %>/less/{,*/}*.less',
        tasks: ['less:dev', 'concat:css', 'autoprefixer:dev', 'usebanner:css'],
      },
      sass: {
        files: '<%= project.src %>/sass/{,*/}*.scss',
        tasks: ['sass:prod', 'concat:css', 'autoprefixer:dev',
                'usebanner:css'],
      },
      php: {
        files: '<%= project.src %>/**.php',
        tasks: ['copy:php', 'replace:livereload'],
      },
      header: {
        files: '<%= project.src %>/img/header.jpg',
        tasks: ['copy:header'],
      },
      lang: {
        files: '<%= project.src %>/languages/*.po',
        tasks: ['po2mo'],
      },
      livereload: {
        options: {
          livereload: true,
        },
        files: [
          '<%= project.dist %>/{,*/}*.php',
          '<%= project.dist %>/css/style.min.css',
          '<%= project.dist %>/js/scripts.min.js',
          '<%= project.dist %>/languages/*.mo',
          '<%= project.dist %>/{,*/}*.{png,jpg,gif,svg}',
        ],
      },
    },
  });

  /**
   * Development task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'copy',
    'replace:livereload',
    'less:dev',
    'sass:prod',
    'concat:css',
    'autoprefixer:dev',
    'jshint',
    'concat:dev',
    'usebanner',
    'po2mo',
    'open',
    'watch',
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   */
  grunt.registerTask('build', [
    'copy',
    'less:prod',
    'sass:prod',
    'concat:css',
    'uncss:prod',
    'autoprefixer:prod',
    'cssmin:prod',
    'clean:prod',
    'jshint',
    'uglify',
    'usebanner',
    'po2mo',
  ]);

};
