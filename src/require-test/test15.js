define('test17', function(){
    return "IIII"

});
define(function(require, exports, module){
    alert(11);
    module.exports = 'GGGG' + require('test16')
});

define('test16', function(require, exports, module){
    $(require('./test.png')).appendTo('body');
    module.exports = "HHHH" + require('test17')
});
