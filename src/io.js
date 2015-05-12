// TODO(wuhf): 强化$.ajax让它支持style类型(暂时不支持onerror)image类型和修复script.onerror
;(function ($) {
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
    // 添加配置
    jQuery.ajaxSetup({
        predictType: true,
        retry: 5,
        accepts: {
            style: 'text/css',
            image: 'image/png, image/gif, image/jpeg'
        },
        contents: {
            style: /css/,
            image: /image/
        },
        converters: {
            "text style": function(text) {
                $.parseCSS(text);
                return text;
            },
            '* file' : function(text){
                return $.parseBase64(text);
            },
            'file image': function(base64){
                var img = new Image();
                img.src = base64
                return img;
            }
        }
    });


    // 增加predictType参数
    var rExt = /\.([^.?#/]*)(?:[?#]|$)/;
    function getType(url){
        if (rExt.test(url)) return $.ajax.ext2Type[RegExp.$1];
        else return undefined;
    }
    $.ajaxPrefilter(function(s){
        if (s.predictType && s.dataType == null) {
            //如果为true且dataType为空则对url分析并预测类型
            return getType(s.url);
        }
    });

    // 对style进行处理
    $.ajaxPrefilter('style', function(s) {
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    });
    $.ajaxTransport('style', function(s) {
        if (s.crossDomain) {
            return {
                send: function(_, callback) {
                    s.style = document.createElement("link");
                    s.style.rel = 'stylesheet';
                    if (s.scriptCharset) {
                        s.style.charset = s.scriptCharset;
                    }
                    s.style.onload = s.style.onreadystatechange = function(_, isAbort) {
                        if (isAbort || !s.style.readyState || s.style.readyState == 'complete') {
                            s.style.onload = s.style.onreadystatechange = null;
                            s.style = null;
                            if (!isAbort) {
                                callback( 200, "success" );
                            }
                        }
                    };
                    s.style.href = s.url;
                    HEAD.appendChild(s.style);
                },
                abort: function() {
                    if (s.style) {
                        s.style.onload(undefined, true);
                    }
                }
            };
        }
    });
    $.ajaxPrefilter('file', function(s){
        s.mimeType = 'text/plain; charset=x-user-defined';
    });
    // 对image 进行处理
    $.ajaxTransport('image', function(s){
        //if (s.crossDomain)
        return {
            send: function(response, done){
                s.image = new Image();
                var error = 'error';
                var load = 'load';
                var a, b;
                if (s.image.addEventListener) {
                    a = 'addEventListener';
                    b = 'removeEventListener';
                }
                else {
                    a = 'attachEvent';
                    b = 'detachEvent';
                    error = 'on' + error;
                    load = 'on' + load;
                }
                s.image[a](load, function(){
                    done(200, 'success', {image: s.image});
                    s.image[b](load, arguments.callee);
                });
                s.image[a](error, function(){
                    done(404, 'fail', {image: s.image});
                    s.image[b](error, arguments.callee);
                });
                s.image.src = s.url;
            },
            abort: function(){
                if (s.image) s.image.onload = s.image.onerror = null;
            }
        }
    });

    // 修复script onload的bug
    $.ajaxTransport('+script', function(s){
        if (s.crossDomain) {
            return {
                send: function(_, complete){
                    var src = s.url;
                    var handler;
                    // 对于w3c标准浏览器，采用onerror和onload判断脚本加载情况
                    if (DOC.dispatchEvent)
                        handler = function(){
                            var s = this;
                            s.onload = function(){
                                destoryScript(s);
                                s = null;
                                complete(200, 'success');
                            };
                            s.onerror = function(){
                                destoryScript(s);
                                s = null;
                                complete(404, 'fail');
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
                                                        complete(200, 'success');
                                                    }
                                                };
                                            }, s.scriptCharset);
                                        else {
                                            complete(404, 'fail');
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
                    s.script = injectScript(src, handler, s.scriptCharset);
                },
                abort: function(){
                    if (s.script) {
                        s.script['on' + (DOC.dispatchEvent ? 'load' : 'readystatechange')](undefined, true);
                    }
                }
            }
        }

    });
})(jQuery);