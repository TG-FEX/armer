module.exports = function(grunt) {
    var options = {
        package: grunt.file.readJSON('bower.json')
    };

    //grunt.file.defaultEncoding = 'utf-8';

    options.concat = {
        options: {
            stripBanners: true,
            banner: '/*!\n * <%= package.title || package.name %> - v<%= package.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                '<%= package.homepage ? "* " + package.homepage + "\\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= package.author.name %>;' +
                ' Licensed <%= package.license.type + "(" + package.license.url + ")" %> \n */\n'
        },
        'core': {
            src: [
                'src/core/main.js',
                'src/core/url.js',
                'src/core/define.js'
            ],
            dest: 'dist/armer.core.js'
        },
        'lang': {
            src: [
                'src/lang/main.js',
                'src/lang/string.js',
                'src/lang/object.js',
                'src/lang/array.js',
                'src/lang/date.js',
                'src/lang/function.js',
                'src/lang/number.js',
            ],
            dest: 'tmp/lang.js'
        },
        'util': {
            src: [
                'src/util/main.js',
                'src/util/store.js',
                'src/util/timer.js',
                'src/util/cookie.js'
            ],
            dest: 'tmp/util.js'
        },
        'ui': {
            src: [
                'src/ui/main.js',
                'src/ui/switcher.js',
                'src/ui/dialog.js',
                'src/ui/spinner.js'
            ],
            dest: 'dist/armer.ui.js'
        },
        'armer': {
            src: [
                'dist/armer.core.js',
                'src/polyfill.js',
                'tmp/lang.js',
                'src/mvvm.js',
                'src/io.js',
                'src/css.js',
                'src/effects.js',
                'src/event.js',
                'src/factory.js',
                'tmp/util.js',
                'dist/armer.ui.js'
            ],
            dest: 'dist/armer.js'
        },
        'jq': {
            src: [
                'bower_components/jquery/dist/jquery.js',
                'dist/armer.js',

            ],
            dest: 'dist/jqarmer.js'
        },
        z: {
            src: [
                'bower_components/zepto/zepto.js',
                '../fastclick.js',
                '/src/zepto/adapter.js',
                'dist/armer.core.js',
                'src/mvvm.js'],
            dest: 'dist/zarmer.js'
        }
    };

    options.uglify = {
        '1.X': {
            src: 'dist/jqarmer.js',
            dest: 'dist/jqarmer.min.js'
        },
        '2.X': {
            src: 'dist/jqarmer.2.x.js',
            dest: 'dist/jqarmer.2.x.min.js'
        },
        z: {
            src: 'dist/zarmer.js',
            dest: 'dist/zarmer.min.js'
        }
    }
    /*
    options.qunit = {
        all: {
            urls: ['/']
        }
    };
    */
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.initConfig(options);
    // Default task.
    grunt.registerTask('default', ['concat', 'uglify']);
    //grunt.registerTask('default', ['concat']);

};