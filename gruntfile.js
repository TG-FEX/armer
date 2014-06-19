module.exports = function(grunt) {
    var options = {
        package: grunt.file.readJSON('package.json')
    };

    grunt.file.defaultEncoding = 'gb2312';

    options.concat = {
        options: {
            stripBanners: true,
            banner: '/*!\n * <%= package.title || package.name %> - v<%= package.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                '<%= package.homepage ? "* " + package.homepage + "\\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= package.author.name %>;' +
                ' Licensed <%= package.license.type + "(" + package.license.url + ")" %> \n */\n'
        },
        'jq': {
            /* (���������)���������ļ�
             * jquery.1.x ���Ŀ��
             * armer ��չ��ܺ���
             * armer.polyfill �޸�ģ��
             * armer.mvvm ģ��
             * armer.lang ������չģ��
             */
            src: ['../jquery.js', 'src/armer.js', 'src/polyfill.js', 'src/mvvm.js', 'src/lang.js', 'src/io.js', 'src/css.js', 'src/effects.js', 'src/event.js', 'src/util.js', 'src/ui.js', 'src/ui/modal.js'],
            dest: '../jq<%= package.name %>.js',
            nonull: true
        },
        '2.X': {
            /* (�߼������)���������ļ�
             * jquery.2.x ���Ŀ��
             * armer ��չ��ܺ���
             * armer.mvvm ģ��
             * armer.lang ������չģ��
             */
            src: ['../jquery/2.x.js', 'src/armer.js', 'src/mvvm.js', 'src/lang.js'],
            dest: '../jq<%= package.name %>.2.x.js',
            nonull: true
        },
        z: {
            /* (�ƶ���)���������ļ�
             * zepto ���Ŀ��
             * fastclick �Ż����
             * zepto.adapter ������
             * armer ��չ��ܺ���
             * armer.mvvm ģ��
             */
            src: ['../zepto.js', '../zepto/src/adapter.js', '../fastclick.js', 'src/armer.js', 'src/mvvm.js'],
            dest: '../z<%= package.name %>.js',
            nonull: true
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