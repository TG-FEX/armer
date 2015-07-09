var DOC = document,
    HEAD = document.head || document.getElementsByTagName('head')[0];
var injectScript = function(src, beforeInject, charset){
    var script = document.createElement('script');
    if (charset) script.charset = charset;
    script.async = true;
    beforeInject.call(script);
    script.src = src;
    HEAD.insertBefore(script, HEAD.firstChild);
    return script;
};
// 销毁script标签
var destoryScript = function(s){
    s.onerror = s.onreadystatechange = s.onload = null;
    if (s.parentNode) {
        s.parentNode.removeChild(s)
    }
};
function Loader(type, url) {
    this.url = url;
    this.type = type;
    this.send = function(){
        return new Promise(this.constructor[type].send.bind(this))
    };
    this.abort = this.constructor[type].abort;
}
Loader.transports = {
    style: {

    },
    script: {
        send: function(success, fail, context){
            context = context || this;
            var src = context.url;
            var handler;
            // 对于w3c标准浏览器，采用onerror和onload判断脚本加载情况
            if (DOC.dispatchEvent)
                handler = function(){
                    var s = this;
                    s.onload = function(){
                        destoryScript(s);
                        s = null;
                        success(200);
                    };
                    s.onerror = function(){
                        destoryScript(s);
                        s = null;
                        fail(404);
                    };
                };
            else
            // 对于恶心的IE8-，我们通过一个vbscript元素，来检测脚本是否加载成功
                handler = function(){
                    var vbtest = this, flag = 0;
                    vbtest.language = 'vbscript';
                    var errorHandler = function(){
                        // 错误时，判断脚本是否正在解释，是则标志加载成功
                        if (vbtest.readyState == 'interactive') {
                            flag = 1;
                            // IE恶心怪经常停不下错误
                            return false;
                        }
                    };
                    vbtest.onreadystatechange = function(_, isAbort){
                        if (isAbort || /loaded|complete/.test(this.readyState)) {
                            // 标志位，当加载成功，置1；
                            if (!isAbort) {
                                if (flag == 1)
                                    injectScript(src, function(){
                                        var s = this;
                                        s.onreadystatechange = function(){
                                            if (/loaded|complete/.test(s.readyState)) {
                                                destoryScript(s);
                                                success(200, 'success');
                                            }
                                        };
                                    }, context.scriptCharset);
                                else {
                                    fail(404);
                                }
                            }
                            window.detachEvent('onerror', errorHandler);
                            destoryScript(vbtest);
                            vbtest = null;
                        }
                    };
                    // 为window绑定一个错误，当js被误加载成vb的时候，会发生错误，来判断是否加载成功
                    window.attachEvent('onerror', errorHandler);
                };
            context.script = injectScript(src, handler, context.scriptCharset);
        },
        abort: function(context){
            context = context || this;
            if (context.script) {
                context.script['on' + (DOC.dispatchEvent ? 'load' : 'readystatechange')](undefined, true);
            }
        }
    }
};