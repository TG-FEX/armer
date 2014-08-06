module.exports = function(grunt) {
    var options = {
        package: grunt.file.readJSON('package.json')
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
        'armer': {
            src: ['src/armer.js', 'src/polyfill.js', 'src/mvvm.js', 'src/lang.js', 'src/io.js', 'src/css.js', 'src/effects.js', 'src/event.js', 'src/util.js', 'src/ui.js', 'src/ui/modal.js'],
            dest: 'dist/armer.js'
        },
        'jq': {
            /* (所有浏览器)包含如下文件
             * jquery.1.x 核心框架
             * armer 扩展框架核心
             * armer.polyfill 修复模块
             * armer.mvvm 模块
             * armer.lang 语言扩展模块
             */
            src: ['bower_components/jquery/dist/jquery.js', 'src/armer.js', 'src/polyfill.js', 'src/mvvm.js', 'src/lang.js', 'src/io.js', 'src/css.js', 'src/effects.js', 'src/event.js', 'src/util.js', 'src/ui.js', 'src/ui/modal.js'],
            dest: 'dist/jq<%= package.name %>.js'
        },
        z: {
            /* (移动端)包含如下文件
             * zepto 核心框架
             * fastclick 优化点击
             * zepto.adapter 适配器
             * armer 扩展框架核心
             * armer.mvvm 模块
             */
            src: ['bower_components/zepto/zepto.js', '../fastclick.js', '/src/zepto/adapter.js', 'src/armer.js', 'src/mvvm.js'],
            dest: 'dist/z<%= package.name %>.js'
        }
    };

    options.uglify = {
        '2.X': {
            src: '../jq<%= package.name %>.2.x.js',
            dest: '../jq<%= package.name %>.2.x.min.js'
        },
        z: {
            src: '../z<%= package.name %>.js',
            dest: '../z<%= package.name %>.min.js'
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
    grunt.initConfig(options);
    // Default task.
    grunt.registerTask('default', ['concat']);
    //grunt.registerTask('default', ['concat']);

};