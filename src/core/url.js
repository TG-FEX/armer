// TODO(wuhf): URL解释器
// ========================================================
;(function($){
    // url解释规范
    // 参考RFC3986 http://tools.ietf.org/html/rfc3986
    var rHash = /#[^#?]*/;
    var rSearch = /\?[^#?]*/;
    var rProtocol = /^\w*:/;
    var rSuffix = /\.((?:com|co|cn|net|org|gov|info|la|cc|edu)(?:\.(?:cn|jp))?)/;
    var rPort = /:(\d{2,5})/;
    var protocol2port = {
        'ftp:': '21',
        'ssh:': '22',
        'http:': '80',
        'ws': '80',
        'https:': '443',
        'file:': '445'

    };
    var setProtocol = function(parent, self){
        parent = parent.replace(rProtocol, function(protocol){
            //设置protocol;
            self._protocol = protocol;
            return '';
        });
        var i = parent.indexOf('?');
        if (!!~i) {
            parent = parent.substr(0, i)
        }
        parent = parent.substr(0, parent.lastIndexOf('/'));
        return parent;
    };
    var setHost = function(str, self){
        var tmp;
        if (str == '') {
            self._hostname = [];
            self._port = protocol2port[self._protocol];
        } else {
            if (tmp = str.match(rPort)) {
                // 如果有端口号
                self._hostname = str.substr(0, str.indexOf(tmp[0]));
                self._port = tmp[1];
            } else {
                self._hostname = str;
                self._port = protocol2port[self._protocol];
            }
            self._hostname = self._hostname.split('.');
        }
        self._hostname.toString = function(){
            return this.join('.')
        }
    };
    /**
     * 生成一个URL对象
     * @param url 一个绝对地址或者一个相对地址
     * @param [parent] 相对地址的情况，可以设置它的父路径
     * @param [basePath]
     * @returns {URL}
     * @constructor
     */
    $.URL = function(url, parent){
        var callee = arguments.callee;
        // 先将parent路径转行为绝对路径
        if (!(this instanceof callee)) return new callee(url, parent);
        // 分析url
        this._init(url, parent);
    };
    $.URL.prototype = {
        constructor: $.URL,
        _init: function(path, parent){
            parent = parent ? this.constructor.absolutize(parent) : null;
            //alert(basePath);
            var self = this, tmp;
            if (!path) path = location.href;
            // 获取 search
            path = path.replace(rSearch, function(search){
                search = search.replace('?', '');
                search = $.unserialize(search);
                self._search = search;
                return '';
            });
            self._search = self._search || {};
            self._search.toString = function(){var s = $.serialize(this); return s == '' ? '' : '?' + s};
            // 获取 hash
            path = path.replace(rHash, function(hash){
                self._hash = hash;
                return '';
            });
            self._hash = self._hash || '';
            // 获取 protocol
            path = path.replace(rProtocol, function(protocol){
                self._protocol = protocol;
                return '';
            });
            // 如果木有协议
            if (!self._protocol) {
                // 如果没有parent那么parent就是location
                parent = parent || location.href;
                //http://p.tgnet.com/Office/MyInfo.aspx
                var basePath = parent.match(/\w+:\/\/[^/]*/)[0] + '/';
                parent.replace(rProtocol, function(protocol){
                    self._protocol = protocol
                })
                //basePath = basePath || location.protocol + '//' + location.hostname + (location.port ? (':' + location.port) : '');
                // 则获取协议
                // 如果木有域名后缀，则判断为相对地址
                if (!rSuffix.test(path)) {
                    /*
                     alert(path)
                     alert(parent)
                     alert(basePath)
                     */
                    tmp = path.charAt(0);
                    // ./css css 这种情况 相对于【当前路径】的兄弟路径
                    // /css 这两种情况 相对于【根路径】
                    // ../css 这种情况 相对于【当前路径】的父路径

                    if (path.slice(0, 2) === './') {
                        //相对于兄弟路径
                        path = setProtocol(parent, self) + path.slice(1);
                    } else if (tmp !== "." && tmp !== '/') {
                        //相对于兄弟路径
                        path = setProtocol(parent, self) + '/' + path;
                    } else if (tmp == "/") {
                        path = setProtocol(basePath, self) + path;
                    } else if (path.slice(0, 2) === '..') {
                        //相对于父路径
                        var arr = setProtocol(parent, self).split('/');
                        tmp = path.replace(/\.\.\//g, function() {
                            arr.pop();
                            return '';
                        });
                        path = arr.join("/") + "/" + tmp;
                    }
                }
            } else {
                self._pathname = path
            }
            self._pathname = path.substr(2).split('/');
            self._pathname.toString = function(){
                return '/' + this.join('/');
            };
            setHost(self._pathname.shift(), self);
        },
        search: function(key, value){
            if (!key) return $.extend({}, this._search);
            if ($.isPlainObject(key) || $.type(value) == 'boolean') {
                if ($.type(key) == 'string') key = $.unserialize(key);
                this._search = $.extend({}, value ? {} : this._search, key);
            }
            if (value === undefined) return this._search[key];
            this._search[key] = value;
            return this;
        },
        hash: function(value){
            if (!value) return this._hash;
            this._hash = '#' + value.replace('#', '');
        },
        /*
         suffix: function(value){
         var lIndex = this._hostname.length - 1;
         if (value == null) return this._hostname[lIndex];
         this._hostname[lIndex] = value.replace(/$\./, '');
         return this;
         },
         */
        port: function(value){
            if (!value) return this._port;
            this._port = $.type(value) == 'number' ? value : value.replace(':', '');
            return this;
        },
        host: function(value){
            if (!value) return this._hostname + (this._port == protocol2port[this._protocol] ? '' : (':' + this._port));
            setHost(value, this);
            return this;
        },
        hostname: function(index, value){
            var r;
            if (index == undefined) {
                r = [].slice.call(this._hostname);
                r.toString = this._hostname.toString;
            } else if ($.type(index) != 'number') {
                if ($.type(index) != 'object') {
                    index = index.split('.')
                }
                for(var i = 0; i < index.length; i++) {
                    this._hostname[i] = index[i] || this._hostname[i];
                }
                r = this;
            } else if (value) {
                this._hostname[index] = value;
                r = this
            } else {
                return this._hostname[index];
            }
            return r;
        },
        /**
         * 获取路径，返回
         * @param index
         * @param value
         * @returns {*}
         */
        pathname: function(index, value){
            var r;
            if (index == null) {
                r = [].slice.call(this._pathname);
                r.toString = this._pathname.toString;
            } else if (typeof index == 'object') {
                for (var i = 0; i < index.length; i++) {
                    this._pathname[i] = index[i] || this._pathname[i];
                }
                r = this;
            } else if (value === undefined) r = this._pathname[index];
            else {
                this._pathname[index] = value;
                r = this;
            }
            return r;
        },
        fileName : function(value){
            var p = this._pathname;
            p = p[p.length - 1];
            if (value) this._pathname[this._pathname.length - 1] = value;
            else return p;
        },
        fileNameWithoutExt: function(value){
            var p = this._pathname;
            p = p[p.length - 1];
            var i = p.lastIndexOf('.');
            if (value == null) return i < 0 ? p : p.substring(0, i);
            else
                this._pathname[this._pathname.length - 1] = i < 0 ? value : value + '.' + p.substr(i + 1)

        },
        extension : function(value, add){
            var p = this._pathname;
            p = p[p.length - 1];
            var i = p.lastIndexOf('.');
            if (value == null) return i < 0 ? '' : p.substr(i + 1);
            else {
                value = value.replace('.', '');
                if (add || i < 0) {
                    this._pathname[this._pathname.length - 1] = p + '.' + value
                } else
                    this._pathname[this._pathname.length - 1] = p.substr(0, i) + '.' + value;
                return this;
            }
        },
        toString: function(){
            return this._protocol + '//' + this.host() + this._pathname + this._search + this._hash;
        },
        /**
         * 将URL对象转换为一个HTMLAnchorElement对象
         * @param {string=} innerHTML 作为anchor元素的innerHTML内容
         * @returns {HTMLElement}
         */
        anchor: function(innerHTML){
            var a = document.createElement('a');
            if (innerHTML) a.innerHTML = innerHTML;
            a.href = this.toString();
            return a;
        },
        relativize: function(baseURL){

        }
    };

    $.URL.absolutize = function(url){
        var a = document.createElement('a');
        a.href = url;
        return !a.hasAttribute ? a.getAttribute("href", 4) : a.href
    }

    $.URL.query = function(){
        var url = $.URL(location.href);
        return url.search.apply(url, arguments);
    };
    /**
     * 获取运行此代码所在的js的url
     * @returns {string}
     */
    $.URL.current = function(){
        //取得正在解析的script节点
        if(document.currentScript) { //firefox 4+
            return document.currentScript.src || location.href;
        }
        //只在head标签中寻找
        var nodes = document.getElementsByTagName("script");
        for(var i = 0, node; node = nodes[i++];) {
            if(node.readyState === "interactive") {
                if (node.src)
                    return node.src;
                else return location.href
            }
        }
        // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
        var stack;
        try {
            //强制报错,以便捕获e.stack
            throw new Error();
        } catch(e) {
            //safari的错误对象只有line,sourceId,sourceURL
            stack = e.stack;

            if(!stack && window.opera){
                //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
        }
        if(stack) {
            /**e.stack最后一行在所有支持的浏览器大致如下:
             *chrome23:
             * at http://113.93.50.63/data.js:4:1
             *firefox17:
             *@http://113.93.50.63/query.js:4
             *opera12:
             *@http://113.93.50.63/data.js:4
             *IE10:
             *  at Global code (http://113.93.50.63/data.js:4:1)
             */
                //取得最后一行,最后一个空格或@之后的部分
            stack = stack.split( /[@ ]/g).pop();
            stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
            //去掉行号与或许存在的出错字符起始位置
            return stack.replace(/(:\d+)?:\d+$/i, "");
        }
    }
})(armer);
