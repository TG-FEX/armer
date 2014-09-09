// 合并测试
define('test17', function(){
    return "IIII"
});
define(function(require, exports, module){
    module.exports = 'GGGG' + require('test16') + require('test18');
});
define('test18', function(require, exports, module){
    //console.log(require);
    //console.log(exports);
    //console.log(module);
    module.exports = 'JJJJ'
});
define('test16', function(require, exports, module){
    module.exports = "HHHH" + require('test17')
});
