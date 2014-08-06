require.config({
    paths: {
        test20: 'test.html'
    }
});

define('test0', ['test.css', 'require'], function(_, require){
    $(require('./test.png')).appendTo('div');
    return '0000';
});

/*
 require(['test3'], function(test3){
 alert(test3);
 })
 require(['test2'], function(test2){
 alert(test2);
 });

 require(['test7'], function(test7){
 alert(test7)
 })
 */      // 命名空间测试
define('common:test9', ['domready!', 'test7', 'test8'], function(_, ts7, ts8){
    return ts7 + ts8 + '9999'
});

define('test19', ['test.jpg', 'test.gif'], function(jpg, gif){
    $('div').append(jpg).append(gif);
    return 'KKK'
});

define('test9', ['require', 'http://underscorejs.org/underscore.js'], function(require, _){
    console.log(_)
    console.log(require('test20'))
    return ''
});
define(['test0', 'test1','test2','test3', 'common:test9', 'test9', 'inner/test10', 'test19'], function(){
    alert([].slice.call(arguments).join(''));
});