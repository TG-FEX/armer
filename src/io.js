// TODO(wuhf): ǿ��$.ajax����֧��style����(��ʱ��֧��onerror)image���ͺ��޸�script.onerror
// ʹ��ǰ�������޸�jQһ��bug������IE6����Ч
// ���� dataType[0] === "+" �޸�Ϊ dataType.charAt(0) === "+"
;(function ($) {
    var DOC = document, script,
        HEAD = document.head || document.getElementsByTagName('head')[0];
    var injectScript = function(src, beforeInject, charset){
        var script = document.createElement('script');
        if (charset) script.scriptCharset = charset;
        script.async = true;
        beforeInject.call(script);
        script.src = src;
        HEAD.insertBefore(script, HEAD.firstChild);
        return script;
    };
    // ����script��ǩ
    var destoryScript = function(s){
        s.onerror = s.onreadystatechange = s.onload = null;
        if (s.parentNode) {
            s.parentNode.removeChild(s)
        }
    };
    // �������
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


    // ����predictType����
    var rExt = /\.([^.?#/]*)(?:[?#]|$)/;
    function getType(url){
        if (rExt.test(url)) return $.ajax.ext2Type[RegExp.$1];
        else return undefined;
    }
    $.ajaxPrefilter(function(s){
        if (s.predictType && s.dataType == null) {
            //���Ϊtrue��dataTypeΪ�����url������Ԥ������
            return getType(s.url);
        }
    });

    // ��style���д���
    $.ajaxPrefilter('style', function(s) {
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    });
    $.ajaxTransport('style', function(s) {
        if (s.crossDomain) {
            var style;
            return {
                send: function(_, callback) {
                    style = document.createElement("link");
                    style.rel = 'stylesheet';
                    if (s.scriptCharset) {
                        style.charset = s.scriptCharset;
                    }
                    style.onload = style.onreadystatechange = function(_, isAbort) {
                        if (isAbort || !style.readyState || style.readyState == 'complete') {
                            style.onload = style.onreadystatechange = null;
                            style = null;
                            if (!isAbort) {
                                callback( 200, "success" );
                            }
                        }
                    };
                    style.href = s.url;
                    HEAD.appendChild(style);
                },
                abort: function() {
                    if (style) {
                        style.onload(undefined, true);
                    }
                }
            };
        }
    });
    $.ajaxPrefilter('file', function(s){
        s.mimeType = 'text/plain; charset=x-user-defined';
    });
    // ��image ���д���
    $.ajaxTransport('image', function(s){
        var image;
        //if (s.crossDomain)
        return {
            send: function(response, done){
                image = new Image();
                var error = 'error';
                var load = 'load';
                var a, b;
                if (image.addEventListener) {
                    a = 'addEventListener';
                    b = 'removeEventListener';
                }
                else {
                    a = 'attachEvent';
                    b = 'detachEvent';
                    error = 'on' + error;
                    load = 'on' + load;
                }
                image[a](load, function(){
                    done(200, 'success', {image: image});
                    image[b](load, arguments.callee);
                });
                image[a](error, function(){
                    done(404, 'fail', {image: image});
                    image[b](error, arguments.callee);
                });
                image.src = s.url;
            },
            abort: function(){
                if (image) image.onload = image.onerror = null;
            }
        }
    });

    // �޸�script onload��bug
    $.ajaxTransport('+script', function(s){
        var src = s.url;
        if (s.crossDomain) {
            return {
                send: function(_, complete){
                    var handler;
                    if (DOC.dispatchEvent) {
                        // ����w3c��׼�����������onerror��onload�жϽű��������
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
                    } else {
                        // ���ڶ��ĵ�IE8-������ͨ��һ��vbscriptԪ�أ������ű��Ƿ���سɹ�
                        handler = function(){
                            var vbtest = this, flag = 0;
                            vbtest.language = 'vbscript';
                            var errorHandler = function(){
                                // ����ʱ���жϽű��Ƿ����ڽ��ͣ������־���سɹ�
                                if (vbtest.readyState == 'interactive') {
                                    flag = 1;
                                }
                            };
                            vbtest.onreadystatechange = function(_, isAbort){
                                if (isAbort || /loaded|complete/.test(this.readyState)) {
                                    // ��־λ�������سɹ�����1��
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
                                            });
                                        else {
                                            complete(404, 'fail');
                                        }
                                    }
                                    window.detachEvent('onerror', errorHandler);
                                    destoryScript(vbtest);
                                    vbtest = null;
                                }
                            };
                            // Ϊwindow��һ�����󣬵�js������س�vb��ʱ�򣬻ᷢ���������ж��Ƿ���سɹ�
                            window.attachEvent('onerror', errorHandler);
                        };
                    }
                    script = injectScript(src, handler, s.scriptCharset);
                },
                abort: function(){
                    if (script) {
                        script['on' + (DOC.dispatchEvent ? 'load' : 'readystatechange')](undefined, true);
                    }
                }
            }
        }

    });
})(jQuery);