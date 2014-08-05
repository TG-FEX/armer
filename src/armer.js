/**
 * =========================================
 * TODO(wuhf): Core模块
 * 【说明】
 *  框架的整体布局以及配置
 *
 * 【依赖以下文件】
 * 1. jQuery
 *
 * 【包含以下内容】
 * 1. 强化jQuery核心方法，增加通用工具集$.slice, $.oneObject, $.nextTick等
 * 2. $.factory 类工厂
 * 3. $.URL URL分析器
 * 4. AMD模块加载引擎
 * ==========================================
 */
armer = window.jQuery || window.Zepto;
(function ($, global, DOC) {
    // TODO(wuhf): 核心工具集
    // ========================================================
    (function(){
        var rword = /[^, |]+/g; //用于分割单词
        var html = DOC.documentElement; //HTML元素
        var head = DOC.head || DOC.getElementsByTagName("head")[0]; //HEAD元素
        var W3C = DOC.dispatchEvent; //IE9开始支持W3C的事件模型与getComputedStyle取样式值
        var hasOwn = Object.prototype.hasOwnProperty;
        var emptyObj = {};
        var rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig,
            rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/
        if (!global.console)
            global.console = { log: $.noop };
        'group,groupCollapsed,info,warn,error'.replace(rword, function(word){
            global.console[word] = global.console[word] || global.console.log
        })
        'groupEnd'.replace(rword, function(word){
            global.console[word] = global.console[word] || $.noop
        });


            /**
         * 判断对象类型
         * @param obj
         * @param [type]
         * @returns {boolean|string}
         */
        function toStringType(obj, type){
            var result = emptyObj.toString.call(obj).slice(8, -1);
            if (type) result = !!result.match(RegExp(type, 'gi'));
            return result;
        }

        function oneObject(array, val) {
            if (typeof array === "string") {
                array = array.match($.rword) || [];
            }
            var result = {},
                value = val !== void 0 ? val : 1;
            for (var i = 0, n = array.length; i < n; i++) {
                result[array[i]] = value;
            }
            return result;
        }

        /**
         * 计算类似array[-1]为最后一位的算法
         * 用于模拟slice, splice的效果
         * @param a 下标值
         * @param [n] 总长度
         * @param [end] 非整数的处理方式，如果为true则取n值
         * @returns {number}
         */
        function resetNumber(a, n, end) {
            if ((a === +a) && !(a % 1)) { //如果是整数
                if (a < 0) {
                    a = a * -1 >= n ? 0 : a + n
                } else {
                    a = a > n ? n : a
                }
            } else {
                a = end ? n : 0
            }
            return a
        }

        /**
         *
         * @type {Function}
         */
        $.stringType = toStringType;

        /**
         * 数组化
         * @param {ArrayLike} nodes 要处理的类数组对象
         * @param {number} start 可选。要抽取的片断的起始下标。如果是负数，从后面取起
         * @param {number} end  可选。规定从何处结束选取
         * @returns {array}
         */
        $.slice = W3C ? function(nodes, start, end) {
            return [].slice.call(nodes, start, end);
        } : function(nodes, start, end) {
            var ret = [],
                n = nodes.length;
            start = resetNumber(start, n);
            end = resetNumber(end, n, 1);
            for (var i = start; i < end; ++i) {
                ret[i - start] = nodes[i]
            }
            return ret
        };
        $.resetNumber = resetNumber
        $.slice.resetNumber = resetNumber;
        $.fn.mix = $.mix = $.extend;

        $.extend($, {
            // ---补充一些全局变量---

            // 规定那些方法不被列举
            DONT_ENUM: "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
            // HTML元素和HEAD元素
            html: html,
            head: head,
            // 两个正则
            rword: rword,
            rmapper: /(\w+)_(\w+)/g,

            // ---补充一些工具方法---
            //生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            /**
             * 生成一个全局唯一ID
             * @returns {string}
             */
            generateID: function () {
                return "armer" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            },
            /**
             * 生成随机数
             * @param {Number} upper 上限值
             * @param {Number} [lower] 下限值
             * @returns {Number}
             */
            random: function(upper, lower){
                lower = lower || 0;
                return parseInt(Math.random() * (upper - lower + 1)+ lower);
            },
            /**
             * 生成键值统一的对象，用于高速化判定
             * @param {array|string} array 如果是字符串，请用","或空格分开
             * @param {number} [val] 默认为1
             * @returns {Object}
             */
            oneObject: oneObject,
            config: function(settings) {
                var kernel = arguments.callee;
                for (var p in settings) {
                    if (!hasOwn.call(settings, p))
                        continue;
                    var val = settings[p];
                    if (typeof kernel.plugin[p] === "function") {
                        kernel.plugin[p](val);
                    } else {
                        kernel[p] = val;
                    }
                }
                return this;
            },
            /**
             *  将调试信息打印到控制台或页面
             *  $.trace(str, page, level )
             *  @param {*} str 用于打印的信息，不是字符串将转换为字符串
             *  @param {Boolean} page ? 是否打印到页面
             *  @param {number} level ? 通过它来过滤显示到控制台的日志数量。
             *          0为最少，只显示最致命的错误；7，则连普通的调试消息也打印出来。
             *          显示算法为 level <= $.config.level。
             *          这个$.config.level默认为9。下面是level各代表的含义。
             *          0 EMERGENCY 致命错误,框架崩溃
             *          1 ALERT 需要立即采取措施进行修复
             *          2 CRITICAL 危急错误
             *          3 ERROR 异常
             *          4 WARNING 警告
             *          5 NOTICE 通知用户已经进行到方法
             *          6 INFO 更一般化的通知
             *          7 DEBUG 调试消息
             *  @returns {string}
             *  @api public
             */
            trace: function(str, page, level) {
                for (var i = 1, show = true; i < arguments.length; i++) {
                    level = arguments[i];
                    if (typeof level === "number") {
                        show = level <= arguments.callee.level;
                    } else if (level === true) {
                        page = true;
                    }
                }
                if (show) {
                    if (page === true) {
                        $(function() {
                            var div = DOC.createElement("pre");
                            div.className = "mass_sys_log";
                            div.innerHTML = str + ""; //确保为字符串
                            DOC.body.appendChild(div);
                        });
                    } else if (global.opera) {
                        opera.postError(str);
                        //http://www.cnblogs.com/zoho/archive/2013/01/31/2886651.html
                        //http://www.dotblogs.com.tw/littlebtc/archive/2009/04/06/ie8-ajax-2-debug.aspx
                    } else if (global.console && console.info && console.log) {
                        console.log(str);
                    }

                }
                return str;
            },
            serializeNodes: function(obj, separator, ignoreAttrChecked){
                if (obj.length == 1 && obj[0].tagName == 'FORM')
                    obj = $(obj).find('input,select,textarea');
                var result = {}
                for (var i = 0; i <= obj.length; i++) {
                    if ('object' != typeof obj[i] || !('value' in obj[i]) || !obj[i].name)
                        continue
                    // 不允许一般数组
                    result[obj[i].name] = result[obj[i].name] || [];
                    if (ignoreAttrChecked || (obj[i].type != 'checkbox' && obj[i].type != 'radio' || obj[i].checked)) {
                        result[obj[i].name].push(obj[i].value);
                    }
                }
                if (separator) {
                    for (var i in result) {
                        result[i] = result[i].join(separator);
                    }
                }
                return result
            },
            /**
             * 序列化通过对象或数组产生类似cookie、get等字符串
             * @param {Object|Array.Object} obj
             * @param {string} [separator] 分割符，默认&
             * @param {string} [assignment] 赋值符，默认=
             * @param {boolean} [encode] 是否进行编码, 默认true
             * @returns {string}
             */
            serialize: function(){
                // 猜测值返回不同结果
                function assume(value){
                    if ('undefined' == typeof value) return;
                    else if (null == value) return '';
                    else if ('object' != typeof value) return value;
                    else return JSON.stringify(value);
                }

                function buildParams(i, value, arrSeparator, add, encode) {
                    arrSeparator = arrSeparator || ','
                    var s = [], k;
                    if ($.isArray(value)) {
                        $.each(value, function(i, value) {
                            k = assume(value);
                            if (k !== void 0) s.push(encode ? encodeURIComponent(k) : k);
                        });
                        add(i, s.join(arrSeparator));
                    } else if ($.isPlainObject(value)) {
                        var k = assume(value);
                        if (k !== void 0) add(i, encode ? encodeURIComponent(k) : k);
                    } else if ($.isFunction(value)){
                        return;
                    } else if ('object' != typeof value) {
                        add(i, value);
                    }
                }

                return function(obj, separator, assignment, arrSeparator, encode){
                    separator = separator || '&';
                    assignment = assignment || '=';
                    arrSeparator = arrSeparator || ',';
                    encode = encode == undefined ? true : encode;
                    var s = [],
                        add = function(key, value){
                            value = value == null ? '' : value;
                            s.push(key + assignment + value)
                        };
                    if (typeof obj == 'string' && obj == '' || obj == null) return '';
                    else if ($.isArrayLike(obj)) {
                        return arguments.callee.call(this, $.serializeNodes(obj, separator), separator, assignment);
                    } else if ('object' == typeof obj) {
                        $.each(obj, function(i, value){
                            buildParams(i, value, arrSeparator, add, encode);
                        })
                    } else {
                        throw new TypeError;
                    }
                    return s.join(separator);
                }
            }(),
            /**
             * 反序列化通过对象
             * @param {String} str
             * @param {String} [separator] 分割符，默认&
             * @param {String} [assignment] 赋值符，默认=
             * @returns {Object|Array}
             */
            unserialize: function () {
                var r = /[\n\r\s]/g
                function assume (value){
                    if (value.indexOf('{') == 0) {
                        // 预测是对象或者数组
                        return decodeURIComponent(JSON.parse(value));
                    } else if (value == '') {
                        //为空
                        return null
                    }/* else if (!isNaN(Number(value).valueOf())) {
                        //数字
                        return Number(value).valueOf();
                    }*/ else if (value == 'true') {
                        return true
                    } else if (value == 'false') {
                        return false
                    } else {
                        try {
                            return decodeURIComponent(value)
                        } catch(e) {
                            return value;
                        }
                    }
                }
                return function(str, separator, assignment, arrSeparator){
                    if (str == '' || str == null) return {};
                    separator = separator || '&';
                    assignment = assignment || '=';
                    arrSeparator = arrSeparator || ',';
                    str = str.replace(r, '');
                    var group = str.split(separator),
                        result = {};
                    $.each(group, function(__, str){
                        var splits = str.split(assignment),
                            key = splits[0],
                            value = splits[1];
                        var aSplits, aResult = [];
                        if (!value) return;
                        else if (value.indexOf(arrSeparator) > -1) {
                            aSplits = value.split(arrSeparator);
                            $.each(aSplits, function(__, value){
                                aResult.push(assume(value));
                            });
                            result[key] = aResult;
                        } else {
                            result[key] = assume(value);
                        }
                    });
                    return result;
                }
            }(),
            // 判断一个对象是不是jQuery.Deferred
            isDeferred : function(obj){
                return typeof obj == 'object' && typeof obj.done == 'function' && typeof obj.fail == 'function';
            },
            /**
             * 是否为类数组（Array, Arguments, NodeList与拥有非负整数的length属性的Object对象）
             * 如果第二个参数为true,则包含有字符串
             * @param {Object} obj
             * @param {Boolean} [includeString]
             * @returns {Boolean}
             */
            isArrayLike: function(obj, includeString) { //是否包含字符串
                var type = $.stringType(obj);
                if (includeString && type === "String") {
                    return true;
                }
                switch(type) {
                    case "Array" :
                    case "Arguments":
                    case "NodeList":
                    case "Collection":
                    case "StaticNodeList":
                    case "HTMLCollection": return true;
                }
                if (type === "Object") {
                    var i = obj.length;
                    return typeof obj.callee == 'function' || obj.namedItem || (i >= 0) && (i % 1 === 0) && hasOwn.call(obj, '0'); //非负整数
                }
                return false;
            },

            /**
             * 生成一个整数数组
             * @param {number} [start] 默认为0
             * @param {number} [end] 默认为0
             * @param {number} [step] 默认为1
             * @returns {array}
             */
            range: function(start, end, step) {
                step || (step = 1);
                if (end == null) {
                    end = start || 0;
                    start = 0;
                }
                var index = -1,
                    length = Math.max(0, Math.ceil((end - start) / step)),
                    result = Array(length);

                while (++index < length) {
                    result[index] = start;
                    start += step;
                }
                return result;
            },
            parseFragment: function(html){return $.buildFragment([html], document)},
            /**
             * 修改node的innerHTML（确保老式IE使用）
             * @param node
             * @param html
             */
            innerHTML: function(node, html) {
                if (!W3C && (!rcreate.test(html) && !rnest.test(html))) {
                    try {
                        node.innerHTML = html;
                        return
                    } catch (e) {
                    }
                }
                var a = $.parseFragment(html);
                this.clearChild(node).appendChild(a)
            },
            /**
             * 清除node里边所有子元素
             * @param node
             * @returns {*}
             */
            clearChild: function(node) {
                while (node.firstChild) {
                    node.removeChild(node.firstChild)
                }
                return node
            },
            /**
             * 计算默认display
             * @param {string} nodeName 节点名字
             * @returns {string}
             */
            defaultDisplay: (function(){
                var cacheDisplay = oneObject("a,abbr,b,span,strong,em,font,i,kbd", "inline")
                $.extend(cacheDisplay, oneObject("div,h1,h2,h3,h4,h5,h6,section,p", "block"))

                return function parseDisplay(nodeName, val) {
                    //用于取得此类标签的默认display值
                    nodeName = nodeName.toLowerCase()
                    if (!cacheDisplay[nodeName]) {
                        var node = DOC.createElement(nodeName)
                        html.appendChild(node)
                        if (global.getComputedStyle) {
                            val = global.getComputedStyle(node, null).display
                        } else {
                            val = node.currentStyle.display
                        }
                        html.removeChild(node)
                        cacheDisplay[nodeName] = val
                    }
                    return cacheDisplay[nodeName]
                }

            })()
        });

        // TODO(wuhf): 缓存器
        //视浏览器情况采用最快的异步回调
        $.nextTick = global.setImmediate ? setImmediate.bind(global) : function(callback) {
            setTimeout(callback, 0)//IE10-11 or W3C
        };

    })();

    // TODO(wuhf): 增加ajax文件后缀与类型的映射
    // ========================================================
    $.ajax.ext2Type = {
        js: 'script',
        json: 'json',
        css: 'style',
        jpg: 'image',
        jpeg: 'image',
        gif: 'image',
        png: 'image',
        bmp: 'image',
        swf: 'flash'
    };

    // TODO(wuhf): URL解释器
    // ========================================================
    (function(){
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
            'https:': '443',
            'file:': ''
        };
        var setProtocol = function(parent, self){
            parent = parent.replace(rProtocol, function(protocol){
                //设置protocol;
                self._protocol = protocol;
                return '';
            });
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
            var URL = arguments.callee;
            // 先将parent路径转行为绝对路径
            parent = parent ? URL.absolutize(parent) : null;
            if (!(this instanceof URL)) return new URL(url, parent);
            // 分析url
            this.init(url, parent);
        };
        $.URL.prototype = {
            constructor: $.URL,
            init: function(path, parent){
                //alert(basePath);
                var self = this, tmp;
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
                if ($.isPlainObject(key)) this._search = $.unserialize($.extend({}, this._search, key));
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
                this._port = value.replace(':', '');
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
                } else {
                    if (typeof index == 'object') {
                        for(var i = 0; i < index.length; i++) {
                            this._hostname[i] = index[i] || this._hostname[i];
                        }
                    } else {
                        this._hostname[index] = value;
                    }
                    r = this;
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
            extension : function(value){
                var p = this._pathname;
                p = p[p.length - 1];
                var i = p.lastIndexOf('.');
                if (value == null) return i < 0 ? '' : p.substr(i + 1);
                else {
                    this._pathname[this._pathname.length - 1] = (i < 0 ? p : p.substr(0, i - 1)) + '.' + value.replace('.', '');
                    return this;
                }
            },
            toString: function(){
                return this._protocol + '//' + this.host() + this._pathname + this._search + this._hash;
            },
            href: function(url){},
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
    })();

    // TODO(wuhf): AMD/CMD加载器
    // ========================================================
    (function () {

        var modules = {
            armer: {
                exports: $
            },
            require: {exports: require},
            exports: {exports: {}},
            module: {exports: {}}
        };


        var currentParent = null;
        var currentUrl = null;
        // 这个变量用于储存require的时候当前请求的位置来确定依赖的位置
        var requesting = {};
        // 通过require正在请求的模块
        var defaults = {
            baseUrl : location.href,
            ext : 'js',
            paths : {},
            shim: {},
            map: {},
            method: 'auto',
            namespace: 'default',
            plusin: {
                auto: {
                    config: function(config){
                        var url = $.URL(this.url, this.parent);
                        if (url.extension() == '') url.extension(defaults.ext);
                        url.search('callback', 'define');
                        this.url = url.toString();
                        this.type = $.ajax.ext2Type[url.extension()]
                    },
                    callback: function(){
                        var that = this;

                        if (this.type !== 'script'){
                            this.exports = this.originData;
                        } else if (this.factory) {
                            var exports = this.factory.apply(this, getExports(arguments))
                            this.exports = exports || this.exports || modules.exports.exports;
                        }

                        this.dfd.resolveWith(this, [this]);
                    }
                }
            }
        };

        // 构造模块
        require.Model = function Model(config){
            $.extend(this, config);
            modules[this.fullname] = this;
            //if (this.url) modules[this.method + this.url] = this;
            //else if (this.id) modules[this.id] = this;
        };
        require.Model.prototype = {
            // 处理模块
            fire: function(data){
                // 使用shim模式
                var mod = this;
                var shim = defaults.shim[mod.id] || {};
                if ($.isArray(shim))
                    shim = {
                        deps: shim
                    }
                mod.deps = mod.deps || shim.deps
                mod.originData = data;
                var success = function(){
                    modules.module.exports = mod;
                    modules.exports.exports = {};
                    currentParent = mod.url;
                    if (shim.exports)
                        modules.exports.exports = modules.exports.exports || eval('(function(){return ' + shim.exports + '})')
                    defaults.plusin[mod.method].callback.apply(mod, arguments);
                    modules.module.exports = null;
                    currentParent = null;
                }
                if (mod.deps && mod.deps.length) {
                    currentParent = mod.url;
                    innerRequire(mod.deps).done(success).fail(function(){
                        mod.dfd.rejectWith(mod, [data]);
                    });
                    currentParent = null;
                } else success();

                // 这两个是为CMD服务的，只读
                mod.dependencies = mod.deps;
                mod.uri = mod.url;
            },
            resolve: function(url){
                url = $.URL(url, this.url);
                if (url.extension() == '') url.extension(defaults.ext);
                return url.toString();
            }
        }


        function getExports(mods){
            var arr = [], i;
            for (i = 0; i < mods.length; i++) {
                arr.push(mods[i].exports);
            }
            return arr;
        }

        function parseDep(config) {
            var mod;
            if (typeof config == 'string') {
                // 存在同名模块
                if (!(mod = modules[config] || modules[(config = id2Config(config)).fullname])) {
                    // 不存在则是新的模块
                    config = idOrUrl2Config(config);
                }
            }
            if (mod) {
                1;
                //如果有mod证明已经通过同名模块的if分支
            } else if ($.isDeferred(config)) {
                var id;
                if (config.modelName && modules[config.modelName])
                    mod = modules[config.modelName];
                else {
                    // 如果是一个dfd，则通过dfd产生一个匿名模块
                    id = 'anonymousModel' + $.now();
                    mod = new require.Model({dfd: config, id: id});
                    config.modelName = id;
                }
            }
            else if (typeof config == 'object') {
                // 处理同样地址同样方式加载但不同id的模块
                if (!(mod = modules[config.fullname]))
                    mod = new require.Model(config);
                // 模块作为参数情况
            } else if (typeof config == 'string')
                mod = new require.Model({url: config})

            return mod;
        }
        /**
         * 请求模块
         * @param deps 依赖列表
         * @param callback 依赖加载成功后执行的回调函数
         * @returns {$.Deferred.promise}
         */

        function innerRequire(deps) {
            if (!$.isArray(deps)) deps = [deps];
            var mDps = [], mod;
            for (var i = 0; i < deps.length; i++) {
                mod = parseDep(deps[i]);
                // 当不存在dfd的时候证明这个模块没有初始化
                if (!mod.dfd) {
                    mod.dfd = $.Deferred();
                    // 如果factory或者exports没有定义，那么可以判断出是通过异步加载已存在但未请求成功的模块
                    // TODO:这个判断貌似不太准确
                    if (!mod.factory  && !('exports' in mod))
                        (function(mod){
                            requesting[mod.url] = mod;
                            var options = {
                                url: mod.url,
                                cache: true,
                                crossDomain: defaults.charset ? true : undefined,
                                dataType: mod.type || $.ajax.ext2Type[defaults.ext],
                                scriptCharset: defaults.charset,
                                success: function(data) {
                                    var bmod;
                                    if (requesting[mod.url]) {
                                        if (bmod = requesting[mod.url].bmod) {
                                            mod.deps = bmod.deps;
                                            mod.factory = bmod.factory;
                                            mod.exports = bmod.exports;
                                            mod.type = bmod.type;
                                        }
                                        delete requesting[mod.url]
                                    }
                                    mod.fire(data);
                                },
                                error: function(){
                                    mod.dfd.rejectWith(mod);
                                    delete requesting[mod.url];
                                },
                                converters: {
                                    "text script": function(text) {
                                        currentUrl = mod.url;
                                        jQuery.globalEval(text);
                                        currentUrl = null;
                                        return text;
                                    }
                                }
                            };
                            $.ajax(options);
                        })(mod);
                    // 如果factory或者exports已经定义过，那么就直接处理该模块
                    else if (mod.fire)
                        mod.fire();
                    else mod.dfd.resolveWith(mod, [mod])
                }
                mDps.push(mod.dfd);
            }
            return $.when.apply($, mDps);
        }

        function require(deps, callback, errorCallback){
            // 兼容CMD模式
            if (!callback) {
                var mod,
                    config = id2Config(deps);
                if (mod = modules[config.fullname] || modules[idOrUrl2Config(config).fullname])
                    return mod.exports;
                else {
                    throw Error('this module is not define');
                }
            }
            return innerRequire(deps).done(function(){
                callback.apply(this, getExports(arguments))
            }).fail(errorCallback).promise();

        }
        /**
         *
         * @param id 模块id用于记录缓存这个模块
         * @param [deps] 依赖列表，这个模块需要依赖那些模块
         * @param factory 工厂，用于处理返回的模块
         * @returns {Model}
         */
        function define(id, deps, factory){
            if (typeof id != 'string') {
                factory = deps;
                deps = id;
                id = null;
            }
            if (factory === undefined) {
                factory = deps;
                deps = ['require', 'exports', 'module'];
            }
            var mod, url;

            url = currentUrl || currentScriptURL();
            // 如果正在请求这个js
            if (mod = requesting[url]) {
                if (id && id !== mod.id) {
                    // 如果define的名字不一样，记录bmod作为后备模块，当文件请求完毕仍然没有同名模块，则最后一个后备模块为该模块
                    mod = new require.Model(id2Config(id), url);
                    requesting[url].bmod = mod;
                } else {
                    // define()这种形式默认是这个模块
                    delete mod.bmod;
                    delete requesting[url]
                }
            } else //如果没有请求这个js
                mod = new require.Model(id2Config(id), url);
            var withCMD = -1, i;
            for (i = 0; i < deps.length; i++) {
                // 看deps里是否有require，是则找出其index
                if (deps[i] == 'require') {
                    withCMD = i;
                }
            }

            mod.deps = deps;
            mod.type = 'script';

            // CMD分析require
            if (typeof factory == "function" && !!~withCMD) {
                var fn = factory.toString(), requireS;
                var args = fn.match(/^function[^(]*\(([^)]*)\)/)[1].split(',');
                requireS = $.trim(args[withCMD]);
                fn.replace(RegExp('[^\\w\\d$_]' + requireS + '\\s*\\(([^)]*)\\)', 'g'), function(_, dep){
                    dep = eval.call(null, dep);
                    if (typeof dep == 'string') mod.deps.push(dep);
                })
            }

            if (typeof factory == 'function')
                mod.factory = factory;
            else
                mod.exports = factory;
            return mod;
        }

        /**
         * 获取运行此代码所在的js的url
         * @returns {string}
         */
        function currentScriptURL(){
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
        function id2Config(idOrPath) {
            var c = {id: idOrPath};
            idOrPath = idOrPath.split('!');
            // 分析处理方法
            if (idOrPath.length == 2) {
                c.method = idOrPath[0];
                c.url = idOrPath[1];
            } else {
                c.method = defaults.method;
                c.url = idOrPath[0];
            }
            idOrPath = c.url.split(':');
            if (idOrPath.length > 1)
                c.namespace = idOrPath.shift();
            else
                c.namespace = defaults.namespace;
            c.url = idOrPath.join(':');
            c.fullname = c.method + '!' + c.namespace + ':' + c.id
            return c;
        }
        function idOrUrl2Config(c, url) {
            if (url) {
                c.url = url;
            } else {
                c.parent = currentParent;
                if (defaults.paths[c.id]) {
                    //别名机制
                    c.url = defaults.paths[c.id];
                    if (typeof c.url === "object") {
                        //paths
                        c.url = c.url.src;
                    }
                }
                c = defaults.plusin[c.method].config.call(c) || c;
            }
            c.fullname = c.method + '!' + c.namespace + ':' + c.url
            return c
        }
        define.amd = define.cmd = modules;
        require.defaults = defaults;
        require.config = function(options){
            $.extend(require.defaults, options)
        };
        // CMD的async方法实际是就是AMD的require
        require.async = require;
        require.resolve = function(url){
            return modules.module.exports.resolve(url);
        };
        require.requesting = requesting;
        global.require = require;
        global.define = define;

        // domready 插件
        defaults.plusin['domready'] = {
            config: function(){
                var mod = {
                    dfd: $.Deferred(),
                    exports: $
                };
                $(function(){
                    mod.dfd.resolveWith(mod, [mod]);
                });
                return mod;
            }

        };


        var nodes = document.getElementsByTagName("script")
        var dataMain = $(nodes[nodes.length - 1]).data('main')
        if (dataMain) require([dataMain], $.noop);
    })();

    // 基本语言扩充
    $.Array = {
        sortBy: function(target, fn, scope, trend) {
            //根据指定条件进行排序，通常用于对象数组。
            trend = typeof trend === "boolean" ? trend : false;
            var array = target.map(function(item, index) {
                return {
                    el: item,
                    re: fn.call(scope, item, index)
                }
            }).sort(function(left, right) {
                    var a = left.re,
                        b = right.re
                    var ret = a < b ? -1 : a > b ? 1 : 0;
                    return trend ? ret : ret * -1
                });
            return $.Array.pluck(array, 'el');
        },
        /**
         * 取得对象数组的每个元素的指定属性，组成数组返回。
         * @param {Array} target 目标数组
         * @param {string} name 需要抽取的值的键名
         * @returns {Array}
         */
        pluck: function(target, name) {
            return target.filter(function(item) {
                return item[name] !== undefined;
            });
        },
        /**
         * 只有当前数组不存在此元素时只添加它
         * @param {Array} target 目标数组
         * @param {*} el 元素
         * @returns {Array}
         */
        ensure: function(target, el) {
            var args = [].slice.call(arguments, 1);
            args.forEach(function(el) {
                if (!~target.indexOf(el)) {
                    target.push(el)
                }
            });
            return target;
        },
        /**
         * 移除数组指定下标的成员
         * @param target 目标数组
         * @param index 下标
         * @returns {boolean} 是否移除成功
         */
        removeAt: function(target, index) {
            return !!target.splice(index, 1).length
        },
        /**
         * 移除数组里对应元素
         * @param target 目标数组
         * @param item 对应的元素
         * @returns {boolean} 是否删除成功
         */
        remove: function(target, item) {
            //移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否。
            var index = target.indexOf(item);
            if (~index)
                return $.Array.removeAt(target, index);
            return false;
        }
    }
    $.String = {
        /**
         * 截取字符串
         * @param target 目标字符串
         * @param length 新字符串长度
         * @param [truncation] 新字符串的结尾的字段
         * @returns {string}
         */
        truncate: function(target, length, truncation) {
            length = length || 30;
            truncation = truncation === void(0) ? "..." : truncation;
            return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target);
        },
        /**
         * 将字符串经过 html 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt;
         * @param target 目标字符串
         * @returns {string}
         */
        escapeHTML: function(target) {
            return target.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        }
    };
    $.Number = {
        /**
         * 与PHP的number_format完全兼容
         * @param number 要格式化的数字
         * @param [decimals] 规定多少个小数位
         * @param [decPoint] 规定用作小数点的字符串（默认为 . ）
         * @param [thousandsSep] 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的
         * @returns {string}
         * http://kevin.vanzonneveld.net
         */
        format: function(number, decimals, decPoint, thousandsSep) {
            number = (number + "").replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = thousandsSep || ",",
                dec = decPoint || ".",
                s = '',
                toFixedFix = function(n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0')
            }
            return s.join(dec)
        }
    };

    $.support.customeTag = (function(){
        var div = document.createElement('div'), support;
        div.innerHTML = '<customeTagTest></customeTagTest>';
        support = !!div.getElementsByTagName('customeTagTest')[0];
        return support;
    })();

    if (!$.support.customeTag){
        var e = 'abbr,article,aside,audio,canvas,datalist,details,dialog,eventsource,figcaption,figure,footer,header,hgroup,main,mark,meter,nav,output,progress,section,time,video'.split(',');
        var i = e.length;
        while (i--) document.createElement(e[i]);
    }

})(armer, window, window.document);







