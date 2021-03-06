require.config({
    paths: {
        test20: 'test.html'
    }
});

define('test0', ['require', 'test.css'], function(require, _){
    $(require('./test.png')).appendTo('div');
    return '0000';
});
// 命名空间测试，插件测试
define('common:test9', ['css!test.css', 'domready!', 'test7', 'test8'], function(__, _, ts7, ts8){
    return ts7 + ts8 + '9999'
});

define('test19', ['test.jpg', 'test.gif'], function(jpg, gif){
    $('div').append(jpg).append(gif);
    return 'KKK'
});

// 混合模式测试
define('test9', ['require', 'http://underscorejs.org/underscore.js'], function(require, _){
    console.log(_)
    console.log(require('test20'))
    return ''
});
define(['test0', 'test1','test2','test3', 'common:test9', 'test9', 'inner/test10', 'test19'], function(){
    return [].slice.call(arguments).join('');
});