/*!
 * ArmerJS - v0.1.0 - 2014-06-30 
 * Copyright (c) 2014 Alphmega; Licensed MIT() 
 */
armer = window.jQuery || window.Zepto;
(function ($, global, DOC) {
    // TODO(wuhf): ���Ĺ��߼�
    // ========================================================
    (function(){
        var rword = /[^, |]+/g; //���ڷָ��
        var html = DOC.documentElement; //HTMLԪ��
        var head = DOC.head || DOC.getElementsByTagName("head")[0]; //HEADԪ��
        var W3C = DOC.dispatchEvent; //IE9��ʼ֧��W3C���¼�ģ����getComputedStyleȡ��ʽֵ
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
         * �ж϶�������
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
         * ��������array[-1]Ϊ���һλ���㷨
         * ����ģ��slice, splice��Ч��
         * @param a �±�ֵ
         * @param [n] �ܳ���
         * @param [end] �������Ĵ���ʽ�����Ϊtrue��ȡnֵ
         * @returns {number}
         */
        function resetNumber(a, n, end) {
            if ((a === +a) && !(a % 1)) { //���������
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
         * ���黯
         * @param {ArrayLike} nodes Ҫ��������������
         * @param {number} start ��ѡ��Ҫ��ȡ��Ƭ�ϵ���ʼ�±ꡣ����Ǹ������Ӻ���ȡ��
         * @param {number} end  ��ѡ���涨�Ӻδ�����ѡȡ
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
            // ---����һЩȫ�ֱ���---

            // �涨��Щ���������о�
            DONT_ENUM: "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
            // HTMLԪ�غ�HEADԪ��
            html: html,
            head: head,
            // ��������
            rword: rword,
            rmapper: /(\w+)_(\w+)/g,

            // ---����һЩ���߷���---
            //����UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
            /**
             * ����һ��ȫ��ΨһID
             * @returns {string}
             */
            generateID: function () {
                return "armer" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            },
            /**
             * ���������
             * @param {Number} upper ����ֵ
             * @param {Number} [lower] ����ֵ
             * @returns {Number}
             */
            random: function(upper, lower){
                lower = lower || 0;
                return parseInt(Math.random() * (upper - lower + 1)+ lower);
            },
            /**
             * ���ɼ�ֵͳһ�Ķ������ڸ��ٻ��ж�
             * @param {array|string} array ������ַ���������","��ո�ֿ�
             * @param {number} [val] Ĭ��Ϊ1
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
             *  ��������Ϣ��ӡ������̨��ҳ��
             *  $.trace(str, page, level )
             *  @param {*} str ���ڴ�ӡ����Ϣ�������ַ�����ת��Ϊ�ַ���
             *  @param {Boolean} page ? �Ƿ��ӡ��ҳ��
             *  @param {number} level ? ͨ������������ʾ������̨����־������
             *          0Ϊ���٣�ֻ��ʾ�������Ĵ���7��������ͨ�ĵ�����ϢҲ��ӡ������
             *          ��ʾ�㷨Ϊ level <= $.config.level��
             *          ���$.config.levelĬ��Ϊ9��������level������ĺ��塣
             *          0 EMERGENCY ��������,��ܱ���
             *          1 ALERT ��Ҫ������ȡ��ʩ�����޸�
             *          2 CRITICAL Σ������
             *          3 ERROR �쳣
             *          4 WARNING ����
             *          5 NOTICE ֪ͨ�û��Ѿ����е�����
             *          6 INFO ��һ�㻯��֪ͨ
             *          7 DEBUG ������Ϣ
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
                            div.innerHTML = str + ""; //ȷ��Ϊ�ַ���
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
                    // ������һ������
                    result[obj[i].name] = result[obj[i].name] || [];
                    result[obj[i].name].push(ignoreAttrChecked || (obj[i].type != 'checkbox' && obj[i].type != 'radio' || obj[i].checked) ? obj[i].value : '');
                }
                if (separator) {
                    for (var i in result) {
                        result[i] = result[i].join(separator);
                    }
                }
                return result
            },
            /**
             * ���л�ͨ������������������cookie��get���ַ���
             * @param {Object|Array.Object} obj
             * @param {string} [separator] �ָ����Ĭ��&
             * @param {string} [assignment] ��ֵ����Ĭ��=
             * @param {boolean} [encode] �Ƿ���б���, Ĭ��true
             * @returns {string}
             */
            serialize: function(){
                // �²�ֵ���ز�ͬ���
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
             * �����л�ͨ������
             * @param {String} str
             * @param {String} [separator] �ָ����Ĭ��&
             * @param {String} [assignment] ��ֵ����Ĭ��=
             * @returns {Object|Array}
             */
            unserialize: function () {
                var r = /[\n\r\s]/g
                function assume (value){
                    if (value.indexOf('{') == 0) {
                        // Ԥ���Ƕ����������
                        return decodeURIComponent(JSON.parse(value));
                    } else if (value == '') {
                        //Ϊ��
                        return null
                    }/* else if (!isNaN(Number(value).valueOf())) {
                        //����
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
                        if (value.indexOf(arrSeparator) > -1) {
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
            // �ж�һ�������ǲ���jQuery.Deferred
            isDeferred : function(obj){
                return typeof obj == 'object' && typeof obj.done == 'function' && typeof obj.fail == 'function';
            },
            /**
             * �Ƿ�Ϊ�����飨Array, Arguments, NodeList��ӵ�зǸ�������length���Ե�Object����
             * ����ڶ�������Ϊtrue,��������ַ���
             * @param {Object} obj
             * @param {Boolean} [includeString]
             * @returns {Boolean}
             */
            isArrayLike: function(obj, includeString) { //�Ƿ�����ַ���
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
                    return typeof obj.callee == 'function' || obj.namedItem || (i >= 0) && (i % 1 === 0) && hasOwn.call(obj, '0'); //�Ǹ�����
                }
                return false;
            },

            /**
             * ����һ����������
             * @param {number} [start] Ĭ��Ϊ0
             * @param {number} [end] Ĭ��Ϊ0
             * @param {number} [step] Ĭ��Ϊ1
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
             * �޸�node��innerHTML��ȷ����ʽIEʹ�ã�
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
             * ���node���������Ԫ��
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
             * ����Ĭ��display
             * @param {string} nodeName �ڵ�����
             * @returns {string}
             */
            defaultDisplay: (function(){
                var cacheDisplay = oneObject("a,abbr,b,span,strong,em,font,i,kbd", "inline")
                $.extend(cacheDisplay, oneObject("div,h1,h2,h3,h4,h5,h6,section,p", "block"))

                return function parseDisplay(nodeName, val) {
                    //����ȡ�ô����ǩ��Ĭ��displayֵ
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

        // TODO(wuhf): ������
        //�������������������첽�ص�
        $.nextTick = global.setImmediate ? setImmediate.bind(global) : function(callback) {
            setTimeout(callback, 0)//IE10-11 or W3C
        };

    })();

    // TODO(wuhf): ����ajax�ļ���׺�����͵�ӳ��
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

    // TODO(wuhf): URL������
    // ========================================================
    (function(){
        // url���͹淶
        // �ο�RFC3986 http://tools.ietf.org/html/rfc3986
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
                //����protocol;
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
                    // ����ж˿ں�
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
         * ����һ��URL����
         * @param url һ�����Ե�ַ����һ����Ե�ַ
         * @param [parent] ��Ե�ַ������������������ĸ�·��
         * @param [basePath]
         * @returns {URL}
         * @constructor
         */
        $.URL = function(url, parent){
            var URL = arguments.callee;
            // �Ƚ�parent·��ת��Ϊ����·��
            parent = parent ? URL.absolutize(parent) : null;
            if (!(this instanceof URL)) return new URL(url, parent);
            // ����url
            this.init(url, parent);
        };
        $.URL.prototype = {
            constructor: $.URL,
            init: function(path, parent){
                //alert(basePath);
                var self = this, tmp;
                // ��ȡ search
                path = path.replace(rSearch, function(search){
                    search = search.replace('?', '');
                    search = $.unserialize(search);
                    self._search = search;
                    return '';
                });
                self._search = self._search || {};
                self._search.toString = function(){var s = $.serialize(this); return s == '' ? '' : '?' + s};
                // ��ȡ hash
                path = path.replace(rHash, function(hash){
                    self._hash = hash;
                    return '';
                });
                self._hash = self._hash || '';
                // ��ȡ protocol
                path = path.replace(rProtocol, function(protocol){
                    self._protocol = protocol;
                    return '';
                });
                // ���ľ��Э��
                if (!self._protocol) {
                    // ���û��parent��ôparent����location
                    parent = parent || location.href;
                    //http://p.tgnet.com/Office/MyInfo.aspx
                    var basePath = parent.match(/\w+:\/\/[^/]*/)[0] + '/';
                    //basePath = basePath || location.protocol + '//' + location.hostname + (location.port ? (':' + location.port) : '');
                    // ���ȡЭ��
                    // ���ľ��������׺�����ж�Ϊ��Ե�ַ
                    if (!rSuffix.test(path)) {
                        /*
                         alert(path)
                         alert(parent)
                         alert(basePath)
                         */
                        tmp = path.charAt(0);
                        // ./css css ������� ����ڡ���ǰ·�������ֵ�·��
                        // /css ��������� ����ڡ���·����
                        // ../css ������� ����ڡ���ǰ·�����ĸ�·��

                        if (path.slice(0, 2) === './') {
                            //������ֵ�·��
                            path = setProtocol(parent, self) + path.slice(1);
                        } else if (tmp !== "." && tmp !== '/') {
                            //������ֵ�·��
                            path = setProtocol(parent, self) + '/' + path;
                        } else if (tmp == "/") {
                            path = setProtocol(basePath, self) + path;
                        } else if (path.slice(0, 2) === '..') {
                            //����ڸ�·��
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
             * ��ȡ·��������
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
             * ��URL����ת��Ϊһ��HTMLAnchorElement����
             * @param {string=} innerHTML ��ΪanchorԪ�ص�innerHTML����
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

    // TODO(wuhf): AMD/CMD������
    // ========================================================
    (function () {
        var modules = {
            'armer': {
                exports: $
            }
        };
        var currentMod = null;
        var currentParent = null;
        var currentUrl = null;
        // ����������ڴ���require��ʱ��ǰ�����λ����ȷ��������λ��
        var requesting = {};
        // ͨ��require���������ģ��
        var defaults = {
            baseUrl : location.href,
            ext : 'js',
            paths : {},
            shim: {},
            map: {},
            defaultMethod: 'auto',
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
                        // û��factory ֤��û��ͨ��define������ԭʼ����;
                        if (!this.factory) this.factory = function(){return that.originData};
                        var fn = this.factory.toString(), ret;
                        // ���factory����function
                        if (typeof this.factory !== 'function') {
                            //JSONP ��ʽ
                            this.exports = this.factory;
                        } else if (!!~fn.indexOf('exports') || !!~fn.indexOf('require')) {
                            // CMD ���factory����exports
                            ret = this.factory.apply(this, [require, this.exports, this]);
                            if (ret)
                                this.exports = ret;
                        } else {
                            // AMD
                            this.exports = this.factory.apply(this, getExports(arguments));
                        }
                        this.dfd.resolveWith(this, [this]);
                    }
                }
            }
        };

        // ����ģ��
        require.Model = function Model(config){
            $.extend(this, config);
            if (this.id) modules[this.id] = this;
            if (this.url) modules[this.method + this.url] = this;
            this.exports = {};
        };
        require.Model.prototype = {
            // ����factory
            fire: function(data){
                // ʹ��shimģʽ
                var mod = this;
                var shim = defaults.shim[mod.id] || {};
                if ($.isArray(shim))
                    shim = {
                        deps: shim
                    }
                mod.deps = mod.deps || shim.deps
                mod.originData = data;
                if (shim.exports)
                    mod.factory = mod.factory || eval('(function(){return ' + shim.exports + '})')
                var success = function(){
                    currentMod = mod;
                    defaults.plusin[mod.method].callback.apply(mod, arguments);
                    currentMod = null;
                }
                if (mod.deps && mod.deps.length) {
                    currentParent = mod.url;
                    innerRequire(mod.deps).done(success).fail(function(){
                        mod.dfd.rejectWith(mod, [data]);
                    });
                    currentParent = null;
                } else success();

                // ��������ΪCMD����ģ�ֻ��
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
            return $.map(mods, function(item){return item.exports})
        }

        function parseDep(config) {
            var mod;
            if (typeof config == 'string') {
                // ����ͬ��ģ��
                if (!(mod = modules[config])) {
                    // �����������µ�ģ��
                    config = analysisPath(config, currentParent || defaults.baseUrl);
                }
            }
            if (mod) {
                1;
                //�����mod֤���Ѿ�ͨ��ͬ��ģ���if��֧
            } else if ($.isDeferred(config)) {
                var id;
                if (config.modelName && modules[config.modelName])
                    mod = modules[config.modelName];
                else {
                    // �����һ��dfd����ͨ��dfd����һ������ģ��
                    id = 'anonymousModel' + $.now();
                    mod = new require.Model({dfd: config, id: id});
                    config.modelName = id;
                }
            }
            else if (typeof config == 'object') {
                // ����ͬ����ַͬ����ʽ���ص���ͬid��ģ��
                if (!(mod = modules[config.method + config.url]))
                    mod = new require.Model(config);
                // ģ����Ϊ�������
            } else if (typeof config == 'string')
                mod = new require.Model({url: config})

            return mod;
        }
        /**
         * ����ģ��
         * @param deps �����б�
         * @param callback �������سɹ���ִ�еĻص�����
         * @returns {$.Deferred.promise}
         */

        function innerRequire(deps) {
            if (!$.isArray(deps)) deps = [deps];
            var mDps = [], mod;
            for (var i = 0; i < deps.length; i++) {
                mod = parseDep(deps[i]);
                if (!mod.dfd) {
                    // �����½���ģ��
                    mod.dfd = $.Deferred();
                    requesting[mod.url] = mod;
                    // ���ģ��factoryû�ж��壬��ô�����жϳ���ͨ���첽�����Ѵ��ڵ�δ����ɹ���ģ��
                    if (!mod.factory)
                        (function(mod){
                            var options = {
                                url: mod.url,
                                cache: true,
                                //crossDomain: true,
                                dataType: mod.type || $.ajax.ext2Type[defaults.ext],
                                scriptCharset: defaults.charset,
                                success: function(data) {
                                    var bmod
                                    if (requesting[mod.url]) {
                                        if (bmod = requesting[mod.url].bmod) {
                                            mod.deps = bmod.deps;
                                            mod.factory = bmod.factory;
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
                    // ���factory�Ѿ����������ô��ֱ�Ӵ����ģ��
                    else mod.fire();
                }
                mDps.push(mod.dfd);
            }
            return $.when.apply($, mDps);
        }

        function require(deps, callback, errorCallback){
            // ����CMDģʽ
            if (!callback) {
                if (typeof modules[deps] == 'object')
                    return modules[deps].exports;
                else {
                    throw Error('this modules is not define');
                }
            }
            return innerRequire(deps).done(function(){
                callback.apply(this, getExports(arguments))
            }).fail(errorCallback).promise();

        }
        /**
         *
         * @param id ģ��id���ڼ�¼�������ģ��
         * @param [deps] �����б����ģ����Ҫ������Щģ��
         * @param factory ���������ڴ����ص�ģ��
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
                deps = [];
            }
            var mod, url;

            url = currentUrl || currentScriptURL();
            // ��������������js
            if (mod = requesting[url]) {
                if (id && id !== mod.id) {
                    // ���define�����ֲ�һ������¼bmod��Ϊ��ģ�飬���ļ����������Ȼû��ͬ��ģ�飬�����һ����ģ��Ϊ��ģ��
                    mod = new require.Model(config(id, url));
                    requesting[url].bmod = mod;
                } else {
                    delete mod.bmod;
                    delete requesting[url]
                }
            } else //���û���������js
                mod = new require.Model(config(id, url));

            mod.deps = deps;
            mod.factory = factory;
            return mod;
        }

        /**
         * ��ȡ���д˴������ڵ�js��url
         * @returns {string}
         */
        function currentScriptURL(){
            //ȡ�����ڽ�����script�ڵ�
            if(document.currentScript) { //firefox 4+
                return document.currentScript.src || location.href;
            }
            //ֻ��head��ǩ��Ѱ��
            var nodes = document.getElementsByTagName("script");
            for(var i = 0, node; node = nodes[i++];) {
                if(node.readyState === "interactive") {
                    if (node.src)
                        return node.src;
                    else return location.href
                }
            }
            // �ο� https://github.com/samyk/jiagra/blob/master/jiagra.js
            var stack;
            try {
                //ǿ�Ʊ���,�Ա㲶��e.stack
                throw new Error();
            } catch(e) {
                //safari�Ĵ������ֻ��line,sourceId,sourceURL
                stack = e.stack;

                if(!stack && window.opera){
                    //opera 9û��e.stack,����e.Backtrace,������ֱ��ȡ��,��Ҫ��e����ת�ַ������г�ȡ
                    stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
                }
            }
            if(stack) {
                /**e.stack���һ��������֧�ֵ��������������:
                 *chrome23:
                 * at http://113.93.50.63/data.js:4:1
                 *firefox17:
                 *@http://113.93.50.63/query.js:4
                 *opera12:
                 *@http://113.93.50.63/data.js:4
                 *IE10:
                 *  at Global code (http://113.93.50.63/data.js:4:1)
                 */
                    //ȡ�����һ��,���һ���ո��@֮��Ĳ���
                stack = stack.split( /[@ ]/g).pop();
                stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
                //ȥ���к��������ڵĳ����ַ���ʼλ��
                return stack.replace(/(:\d+)?:\d+$/i, "");
            }
        }
        function config(id, url, mod){
            if (url) return {id: id, url: url == location.href ? null : url, method: mod || defaults.defaultMethod};
            var c = {id: id};
            c.url = id.split('!');
            // ����������
            if (c.url.length == 2) {
                c.method = c.url[0];
                c.url = c.url[1];
            } else {
                c.method = defaults.defaultMethod;
                c.url = c.url[0];
            }
            return c;
        }
        function analysisPath(id, parent) {
            var c = $.extend({parent: parent}, config(id))
            if (defaults.paths[id]) {
                //��������
                c.url = defaults.paths[id];
                if (typeof c.url === "object") {
                    //paths
                    c.url = c.url.src;
                }
                return c;
            }
            return defaults.plusin[c.method].config.call(c) || c;

        }

        define.amd = define.cmd = modules;
        require.defaults = defaults;
        require.config = function(options){
            $.extend(require.defaults, options)
        };
        // CMD��async����ʵ���Ǿ���AMD��require
        require.async = require;
        require.resolve = function(url){
            return currentMod.resolve(url);
        };
        require.requesting = requesting;
        global.require = require;
        global.define = define;

        // domready ���
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

    // ������������
    $.Array = {
        sortBy: function(target, fn, scope, trend) {
            //����ָ��������������ͨ�����ڶ������顣
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
         * ȡ�ö��������ÿ��Ԫ�ص�ָ�����ԣ�������鷵�ء�
         * @param {Array} target Ŀ������
         * @param {string} name ��Ҫ��ȡ��ֵ�ļ���
         * @returns {Array}
         */
        pluck: function(target, name) {
            return target.filter(function(item) {
                return item[name] !== undefined;
            });
        },
        /**
         * ֻ�е�ǰ���鲻���ڴ�Ԫ��ʱֻ�����
         * @param {Array} target Ŀ������
         * @param {*} el Ԫ��
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
         * �Ƴ�����ָ���±�ĳ�Ա
         * @param target Ŀ������
         * @param index �±�
         * @returns {boolean} �Ƿ��Ƴ��ɹ�
         */
        removeAt: function(target, index) {
            return !!target.splice(index, 1).length
        },
        /**
         * �Ƴ��������ӦԪ��
         * @param target Ŀ������
         * @param item ��Ӧ��Ԫ��
         * @returns {boolean} �Ƿ�ɾ���ɹ�
         */
        remove: function(target, item) {
            //�Ƴ������е�һ��ƥ�䴫�ε��Ǹ�Ԫ�أ����ز�����ʾ�ɹ����
            var index = target.indexOf(item);
            if (~index)
                return $.Array.removeAt(target, index);
            return false;
        }
    }
    $.String = {
        /**
         * ��ȡ�ַ���
         * @param target Ŀ���ַ���
         * @param length ���ַ�������
         * @param [truncation] ���ַ����Ľ�β���ֶ�
         * @returns {string}
         */
        truncate: function(target, length, truncation) {
            length = length || 30;
            truncation = truncation === void(0) ? "..." : truncation;
            return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target);
        },
        /**
         * ���ַ������� html ת��õ��ʺ���ҳ������ʾ������, �����滻 < Ϊ &lt;
         * @param target Ŀ���ַ���
         * @returns {string}
         */
        escapeHTML: function(target) {
            return target.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        }
    };
    $.Number = {
        /**
         * ��PHP��number_format��ȫ����
         * @param number Ҫ��ʽ��������
         * @param [decimals] �涨���ٸ�С��λ
         * @param [decPoint] �涨����С������ַ�����Ĭ��Ϊ . ��
         * @param [thousandsSep] ��ѡ���涨����ǧλ�ָ������ַ�����Ĭ��Ϊ , ������������˸ò�������ô���������������Ǳ����
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








;(function(){
    //fix ie for..in bug
    var DONT_ENUM = $.DONT_ENUM,
        P = "prototype",
        hasOwn = ({}).hasOwnProperty;
    for (var i in {
        toString: 1
    }) {
        DONT_ENUM = false;
    }
    //IE8��Object.definePropertyֻ��DOM��Ч
    // �ж��Ƿ�֧��defineProperty
    var defineProperty = Object.defineProperty;
    try {
        defineProperty({}, 'a', {
            get: function() {
            }
        });
        $.support.objectProperty = true;
    } catch(e) {
        $.support.objectProperty = false;
    }
    var method = $.support.objectProperty ? function(obj, name, val) {
        if (!obj[name]) {
            defineProperty(obj, name, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: val
            });
        }
    } : function(obj, name, method) {
        if (!obj[name]) {
            obj[name] = method;
        }
    };

    var mix = function (obj, map) {
        for (var name in map) {
            !(name in obj) &&  method(obj, name, map[name]);
        }
    };

    if (!Array.isArray) {

        //=====================
        // TODO: �޸�����bug
        //=====================
        //------------------------------------------------
        //����IE67��unshift���������鳤�ȵ�����
        //http://www.cnblogs.com/rubylouvre/archive/2010/01/14/1647751.html
        if ([].unshift(1) !== 1) {
            var _unshift = Array[P].unshift;
            Array[P].unshift = function () {
                _unshift.apply(this, arguments);
                return this.length; //����������ĳ���
            }
        }

        //�޸�IE splice�����еڶ���������bug
        //http://www.zhuwenbo.net/?p=52
        if ([1, 2, 3].splice(1).length === 0) {
            var _splice = Array[P].splice;
            Array[P].splice = function (a) {
                if (arguments.length === 1) {
                    return _splice.call(this, a, this.length)
                } else {
                    return _splice.apply(this, arguments);
                }
            }
        }

        // �޸� Date.get/setYear() (IE5-7)
        if ((new Date).getYear() > 1900) {
            //http://stackoverflow.com/questions/5763107/javascript-date-getyear-returns-different-result-between-ie-and-firefox-how-to
            Date[P].getYear = function () {
                return this.getFullYear() - 1900;
            };
            Date[P].setYear = function (year) {
                return this.setFullYear(year); //+ 1900
            };
        }

        // �޸�IE6 toFixed Bug
        // http://stackoverflow.com/questions/10470810/javascript-tofixed-bug-in-ie6
        if (0.9.toFixed(0) !== '1') {
            Number.prototype.toFixed = function (n) {
                var power = Math.pow(10, n);
                var fixed = (Math.round(this * power) / power).toString();
                if (n == 0)
                    return fixed;
                if (fixed.indexOf('.') < 0)
                    fixed += '.';
                var padding = n + 1 - (fixed.length - fixed.indexOf('.'));
                for (var i = 0; i < padding; i++)
                    fixed += '0';
                return fixed;
            };
        }

        //  string.substr(start, length)�ο� start
        //  Ҫ��ȡ���Ӵ�����ʼ�±ꡣ�����һ����������ô�ò����������ַ�����β����ʼ�����λ�á�Ҳ����˵��-1ָ���ַ����е����һ���ַ���-2ָ�����ڶ����ַ����Դ����ơ�
        var substr = String.prototype.substr;
        if ('ab'.substr(-1) != 'b') {
            String.prototype.substr = function (start, length) {
                start = start < 0 ? Math.max(this.length + start, 0) : start;
                return substr.call(this, start, length);
            }
        }
        //    var testString = "0123456789";
        //    alert(testString.substr(2));
        //    // Output: 23456789
        //    alert(testString.substr(2, 5));
        //    // Output: 23456
        //    alert(testString.substr(-3));
        //    // Output: 789 IE:0123456789
        //    alert(testString.substr(-5, 2));
        //// Output: 56  IE:01
        //------------------------------------------------

        function fixContains(a, b) {
            if (b) {
                while ((b = b.parentNode)) {
                    if (b === a) {
                        return true;
                    }
                }
            }
            return false;
        }

        //safari5+�ǰ�contains��������Element.prototype�϶�����Node.prototype
        if (!document.documentElement) {
            Node.prototype.contains = function(arg) {
                return !!(this.compareDocumentPosition(arg) & 16)
            }
        }
        if (!document.contains) { //IE6-11���ĵ�����û��contains
            document.contains = function(b) {
                return fixContains(this, b)
            }
        }


        //=====================================
        // TODO: ES5���䲿��
        //=====================================

        //=====================
        // TODO: Object
        //=====================
        //�ڶ����������������֧��Object.definePropertiesʱ����
        mix(Object, {
            create: function (o) {
                if (arguments.length > 1) {
                    $.trace(" Object.create implementation only accepts the first parameter.");
                }

                function bridge() {
                }

                bridge.prototype = o;
                return new bridge();
            },
            //ȡ�������м�����������ʽ����
            keys: function (obj) { //ecma262v5 15.2.3.14
                var result = [];
                for (var key in obj)
                    if (hasOwn.call(obj, key)) {
                        result.push(key)
                    }
                if (DONT_ENUM && obj) {
                    for (var i = 0; key = DONT_ENUM[i++];) {
                        if (hasOwn.call(obj, key)) {
                            result.push(key);
                        }
                    }
                }
                return result;
            },
            getPrototypeOf: typeof P.__proto__ === "object" ?
                function (obj) {
                    return obj.__proto__;
                } : function (obj) {
                return obj.constructor[P];
            }

        });

        //=====================
        // TODO: Array
        //=====================

        //���ڴ���javascript1.6 Array�ĵ�����

        function iterator(vars, body, ret) {
            var fun = 'for(var ' + vars + 'i=0,n = this.length;i < n;i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret;
            return Function("fn,scope", fun);
        }

        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) == "[object Array]";
        };

        mix(Array[P], {
            //��λ���������������е�һ�����ڸ���������Ԫ�ص�����ֵ��
            indexOf: function (item, index) {
                var n = this.length,
                    i = ~~index;
                if (i < 0)
                    i += n;
                for (; i < n; i++)
                    if (this[i] === item)
                        return i;
                return -1;
            },
            //��λ��������ͬ�ϣ������ǴӺ������
            lastIndexOf: function (item, index) {
                var n = this.length,
                    i = index == null ? n - 1 : index;
                if (i < 0)
                    i = Math.max(0, n + i);
                for (; i >= 0; i--)
                    if (this[i] === item)
                        return i;
                return -1;
            },
            //�����������������Ԫ�ذ���������һ��������ִ�С�Ptototype.js�Ķ�Ӧ����Ϊeach��
            forEach: iterator('', '_', ''),
            //������ �������е�ÿ����������һ������������˺�����ֵΪ�棬���Ԫ����Ϊ�������Ԫ���ռ�������������������
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //�ռ��������������Ԫ�ذ���������һ��������ִ�У�Ȼ������ǵķ���ֵ���һ�������鷵�ء�Ptototype.js�Ķ�Ӧ����Ϊcollect��
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //ֻҪ��������һ��Ԫ�������������Ž�������������true������ô���ͷ���true��Ptototype.js�Ķ�Ӧ����Ϊany��
            some: iterator('', 'if(_)return true', 'return false'),
            //ֻ�������е�Ԫ�ض������������Ž�������������true�������ŷ���true��Ptototype.js�Ķ�Ӧ����Ϊall��
            every: iterator('', 'if(!_)return false', 'return true'),
            //�黯�� javascript1.8  ���������ÿ��Ԫ�غ�ǰһ�ε��õĽ������һ���������������Ľ����
            reduce: function (fn, lastResult, scope) {
                if (this.length == 0)
                    return lastResult;
                var i = lastResult !== undefined ? 0 : 1;
                var result = lastResult !== undefined ? lastResult : this[0];
                for (var n = this.length; i < n; i++)
                    result = fn.call(scope, result, this[i], i, this);
                return result;
            },
            //�黯�� javascript1.8 ͬ�ϣ�����������ִ�С�
            reduceRight: function (fn, lastResult, scope) {
                var array = this.concat().reverse();
                return array.reduce(fn, lastResult, scope);
            }
        });

        Date.now = function () {
            return +new Date;
        };

        //=====================
        // TODO: String
        //=====================

        //String��չ
        mix(String[P], {
            //ecma262v5 15.5.4.20
            //http://www.cnblogs.com/rubylouvre/archive/2009/09/18/1568794.html
            //'      dfsd '.trim() === 'dfsd'
            trim: function () {
                return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, '')
            }
        });

        //=====================
        // TODO: Function
        //=====================

        mix(Function[P], {
            //ecma262v5 15.3.4.5
            bind: function (scope) {
                if (arguments.length < 2 && scope === void 0)
                    return this;
                var fn = this,
                    argv = arguments;
                return function () {
                    var args = [],
                        i;
                    for (i = 1; i < argv.length; i++)
                        args.push(argv[i]);
                    for (i = 0; i < arguments.length; i++)
                        args.push(arguments[i]);
                    return fn.apply(scope, args);
                };
            }
        });

    }


    if (!String[P].repeat) {

        //=====================================
        // TODO: ES6���䲿��
        //=====================================
        mix(String[P], {
            repeat: function (n) {
                //���ַ����ظ�n��
                var result = "",
                    target = this;
                while (n > 0) {
                    if (n & 1)
                        result += target;
                    target += target;
                    n >>= 1;
                }
                return result;
            },
            startsWith: function (str) {
                //�ж��Ƿ��Ը����ַ�����ͷ
                return this.indexOf(str) === 0;
            },
            endsWith: function (str) {
                //�ж��Ƿ��Ը����ַ�����β
                return this.lastIndexOf(str) === this.length - str.length;
            },
            contains: function (s, position) {
                //�ж�һ���ַ����Ƿ������һ���ַ�
                return ''.indexOf.call(this, s, position >> 0) !== -1;
            }
        });
        mix(Number[p], {
            isFinite: function(num){
                if (typeof num != 'number') return false;
                else if (!isFinite(num)) return false;
                else return true;
            },
            isNaN: function(num){
                if (typeof num != 'number') return false;
                else if (!isNaN(num)) return false;
                else return true;
            },
            parseInt: function(){
                return parseInt.apply(null, arguments)
            },
            parseFloat: function(){
                return parseFloat.apply(null, arguments);
            }
        });
        mix(Array, {
            form: function(arrayLike){
                return [].slice.call(arguments);
            },
            of: function(){
                return [].slice.call(arguments);
            }
        });
        mix(Math, {
            trunc: function(x){
                return ~~ x;
            },
            cbrt: function(x){
                return x*x*x
            }
        });
        mix(Object, {
            is: function(a, b){
                if (a === b) return a !== 0 || 1 / a == 1 / b;
                else return isNaN(a) && isNaN(b);
            },
            assign: $.extend
        });
        window.Set = function(array){};
        window.Set.prototype = {
            size: function(){},
            add: function(){},
            delete: function(){},
            has: function(){},
            clear: function(){}
        }
    }


    //TODO: fix localStorage
    // ���ش洢�ļ��ݷ���
    // http://www.cnblogs.com/zjcn/archive/2012/07/03/2575026.html#2607520
    // https://github.com/marcuswestin/store.js
    (function (win, doc) {
        if(!($.support.localStorage = !!win.localStorage) && doc.documentElement.addBehavior){
            var storage, store, box, container;
            //�洢�ļ��������ļ�С��128k���㹻��ͨ�����ʹ���ˣ�
            //cookie��С4096, 0.4K X 50�����20K���ɼ�userdata��Ķ�
            var FILENAME = win.location.hostname || 'localStorage';
            try{
                //����#userData�Ĵ洢���������ض���·����
                //������Ҫ��ĳ�ַ�ʽ�������ǵ����ݵ�һ���ض���·��������ѡ��/favicon.ico��Ϊһ���ǳ���ȫ��Ŀ�꣬
                //��Ϊ���е���������������URL���󣬶����������ʹ��404Ҳ������Σ�ա�
                //���ǿ���ͨ��һ��ActiveXObject(htmlfile)������ĵ��������¡�
                //(�μ�:http://msdn.microsoft.com/en-us/library/aa752574(v = VS.85). aspx)
                //��Ϊiframe�ķ��ʹ�������ֱ�ӷ��ʺͲ����ĵ��е�Ԫ�أ���ʹ��404��
                //���ĵ������������浱ǰ�ĵ����ⱻ�����ڵ�ǰ·����ִ��#userData�Ĵ洢��
                container = new ActiveXObject('htmlfile');
                container.open();
                container.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>');
                container.close();
                //container���ص���htmlfile��document
                box = doc = container.w.frames[0].document;
            } catch(e) {
                box = document.body || document.getElementsByTagName("head")[0] || document.documentElement
                doc = document;
            }
            storage = doc.createElement('input');
            storage.type = "hidden";
            function withIEStorage(storeFunction) {
                return function() {
                    var args = [].slice.call(arguments);
                    args.unshift(storage);
                    //  http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                    box.appendChild(storage);
                    storage.addBehavior('#default#userData');
                    storage.load(FILENAME);
                    var result = storeFunction.apply(store, args);
                    box.removeChild(storage);
                    return result
                }
            }
            var getAttr = function(storage){
                return storage.XMLDocument.documentElement.attributes;
            };
            store = {
                setItem: withIEStorage(function(storage, key, val) {
                    if (val === undefined || val === null) throw Error();
                    storage.setAttribute(key, val + "");
                    this.length = getAttr(storage).length;
                    storage.save(FILENAME);
                }),
                getItem : withIEStorage(function(storage, key){
                    return storage.getAttribute(key) || null;
                }),
                removeItem : withIEStorage(function(storage, key){
                    storage.removeAttribute(key);
                    this.length = getAttr(storage).length;
                    storage.save(FILENAME);
                }),
                clear : withIEStorage(function(storage){
                    var attrs = getAttr(storage);
                    for (var i = 0, attr; attr = attrs[i]; ++i){
                        this.removeItem(attr.name);
                    }
                    this.length = 0;
                }),
                key : withIEStorage(function(storage, i){return getAttr(storage)[i].name;})
            };
            store.length = withIEStorage(getAttr)().length;
            win.localStorage = store;
        }
    })(window, document);

    //TODO(wuhf): Fix JSON
    if (!window.JSON) {
        var es = ['t', 'r', 'n', 'f', 'v'];
        var er = {};
        for (var i = 0; i < es.length; i++) {
            er[es[i]] = {r: RegExp('\\' + es[i], 'g'), s: '\\' + es[i]};
        }
        er['"'] = {r: /"/g, s: '\\"'};
        var rvalidchars = /^[\],:{}\s]*$/,
            rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
            rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
        var typeOf = function(obj){return obj === null ? "null" : obj === void 0 ? "undefined" : er.toString.call(obj).slice(8, -1).toLowerCase()};
        window.JSON = {
            stringify : function(feed){
                var r = [], s = '', type;
                type = typeOf(feed);
                if ('undefined' == type) {
                    return feed;
                } else if ('null' == type || feed !== feed) { // NaN
                    return 'null';
                } else if (feed === '') {
                    return '""';
                } else if (type == 'boolean'){
                    return feed ? 'true' : 'false';
                } else if (type == 'number'){
                    return '' + feed;
                } else if (type == 'regexp') {
                    return '{}';
                } else if(type == 'array'){
                    r.push('[');
                    for(var i = 0, len = feed.length; i < len; i++){
                        r.push(s);
                        r.push(arguments.callee(feed[i]));
                        s = ',';
                    }
                    r.push(']');
                } else if(type == 'object') {
                    r.push('{');
                    var t;
                    for (var k in feed){
                        t = arguments.callee(feed[k]);
                        if ('undefined' == typeof t) continue;
                        r = r.concat([s, arguments.callee(k), ':', t]);
                        s = ',';
                    }
                    r.push('}');
                } else if (type == 'string') {
                    for (var i in er) {
                        feed = feed.replace(er[i].r, er[i].s);
                    }
                    r.push('"' + feed + '"');
                } else {
                    throw new Error('Can not convert this object to JSON')
                }
                return r.join('');
            },
            //�ðɣ����︴����һ��jQ�ģ�����ݹ����
            parse : function(data){
                if (typeof data != 'string') data = data.toString();
                if ( data === null ) {
                    return data;
                }
                if ( typeof data === "string" ) {
                    data = $.trim( data );
                    if ( data ) {
                        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                            .replace( rvalidtokens, "]" )
                            .replace( rvalidbraces, "")) ) {
                            return ( new Function( "return " + data ) )();
                        }
                    }
                }
                $.error( "Invalid JSON: " + data );
            }
        };
    }

    //TODO: fix hashchange


    (function(DOC){
        var hashchange = 'hashchange';
        $.support.hashchange = ('on' + hashchange) in window && ( document.documentMode === void 0 || document.documentMode > 7 );

        $.fn[ hashchange ] = function(callback){
            return callback?  this.bind(hashchange, callback ) : this.fire( hashchange);
        };

        $.fn[ hashchange ].delay = 50;

        if(!$.support.hashChange){
            var iframe, timeoutID, html = '<!doctype html><html><body>#{0}</body></html>'
            if( $.fn[ hashchange ].domain){
                html = html.replace("<body>","<script>document.domain ="+
                    $.fn[ hashchange ].domain +"</script><body>" )
            }

            function getHash ( url) {//����ȡ�õ�ǰ���ڻ�iframe���ڵ�hashֵ
                url = url || DOC.URL
                return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
            }
            function getHistory(){
                return getHash(iframe.location);
            }
            function setHistory(hash, history_hash){
                var doc = iframe.document;
                if (  hash !== history_hash ) {//ֻ�е���hash������iframe�е�hash����д
                    //���ڲ�����ʷ
                    doc.open();
                    doc.write($.format(html, hash));
                    doc.close();
                }
            }
            var last_hash = getHash(), history_hash, hash = "#";

            $.event.special[ hashchange ] = {
                setup: function(desc) {
                    $(function(){
                        if (!iframe) {
                            //����һ�����ص�iframe��ʹ���ⲩ���ṩ�ļ��� http://www.paciellogroup.com/blog/?p=604.
                            //iframe��ֱ�Ӽ��ظ�ҳ�棬Ϊ�˷�ֹ��ѭ������DOM��δ����֮ǰ�Ͳ����µ�����
                            var el = $('<iframe tabindex="-1" style="display:none" widht=0 height=0 title="empty" />').appendTo( document.body )[0], fn
                            iframe = el.contentWindow
                            $.event.add(el, "load", fn = function(){
                                $.event.remove(el, "load", fn)
                                var doc = iframe.document
                                doc.open();
                                doc.write($.format(html, hash))
                                doc.close();
                                timeoutID = setInterval(poll,  $.fn[ hashchange ].delay)
                            });
                            function poll() {
                                var hash = getHash(),//ȡ���������е�hash
                                    history_hash = iframe.document.body.innerText;//ȡ������iframe�е�hash
                                if(hash !== last_hash){//����������ڵ�hash�����仯
                                    setHistory(last_hash = hash, history_hash )
                                    $(desc.currentTarget).fire(hashchange)
                                }else if(history_hash !== last_hash){//������»��˼���
                                    location.href = location.href.replace( /#.*/, '' ) + history_hash;
                                }
                            }
                        }

                    });
                },
                teardown: function(){
                    if(!iframe){
                        clearTimeout(timeoutID);
                        $(iframe).remove();
                        iframe = 0;
                    }
                }
            };
        }
    })(document);
})();

;(function(DOC, $) {
    var Registry = {} //�������ع⵽�˶����ϣ�����������ռ�����
    var expose = new Date - 0
    var subscribers = "$" + expose
    var window = this || (0, eval)('this')
    //var otherRequire = window.require
    //var otherDefine = window.define
    var stopRepeatAssign = false
    //var rword = /[^, ]+/g //�и��ַ���Ϊһ����С�飬�Կո�򶹺ŷֿ����ǣ����replaceʵ���ַ�����forEach
    //var class2type = {}
    var oproto = Object.prototype
    var ohasOwn = oproto.hasOwnProperty
    var prefix = "vm-"
    var W3C = window.dispatchEvent
    var root = DOC.documentElement
    //var serialize = oproto.toString
    var ap = Array.prototype
    var aslice = ap.slice
    var head = DOC.head || DOC.getElementsByTagName("head")[0] //HEADԪ��
    var documentFragment = DOC.createDocumentFragment()
    //var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(",")
    /*
    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function(name) {
        class2type["[object " + name + "]"] = name.toLowerCase()
    })
    */

    //var rnative = /\[native code\]/
    var rchecktype = /^(?:object|array)$/
    //var rwindow = /^\[object (Window|DOMWindow|global)\]$/

    var rword = $.rword;
    var noop = $.noop;
    var log = $.trace;

/*
    function noop() {
    }

    function log(a) {
        window.console && console.log(W3C ? a : a + "")
    }
*/

    /*********************************************************************
     *                    �����ռ��빤�ߺ���                               *
     **********************************************************************/
    var getType = $.type;
    var resetNumber = $.slice.resetNumber;
    var oneObject = $.oneObject;
    var generateID = $.generateID;

    window.avalon = function(el) {
        return $(el);
    }
    $.extend(avalon, {
        isWindow: $.isWindow,
        isPlainObject: $.isPlainObject,
        slice: $.slice,
        range: $.range,
        error: $.error,
        noop: noop,
        ui: {},
        nextTick: $.nextTick,
        bind: $.event.add,
        unbind: $.event.remove,
        parseDisplay: $.defaultDisplay,
        parseHTML: $.parseFragment,
        innerHTML: $.innerHTML,
        clearChild: $.clearChild,
        contains: $.contains,
        ready: $,
        log: $.trace
    })
    avalon.Array = $.Array;

/*
    avalon = function(el) { //����jQueryʽ����new ʵ�����ṹ
        return new avalon.init(el)
    }

    avalon.init = function(el) {
        this[0] = this.element = el
    }
    avalon.fn = avalon.prototype = avalon.init.prototype
    //������������ж����͵ķ���

    function getType(obj) { //ȡ������
        if (obj == null) {
            return String(obj)
        }
        // ���ڵ�webkit�ں������ʵ�����ѷ�����ecma262v4��׼�����Խ�������������������ʹ�ã����typeof���ж�����ʱ�᷵��function
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[serialize.call(obj)] || "object" :
            typeof obj
    }
    avalon.type = getType

    avalon.isWindow = function(obj) {
        if (!obj)
            return false
        // ����IE678 window == documentΪtrue,document == window��ȻΪfalse����������
        // ��׼�������IE9��IE10��ʹ�� ������
        return obj == obj.document && obj.document != obj
    }

    function isWindow(obj) {
        return rwindow.test(serialize.call(obj))
    }
    if (isWindow(window)) {
        avalon.isWindow = isWindow
    }
    //�ж��Ƿ���һ�����ص�javascript����Object��������DOM���󣬲���BOM���󣬲����Զ������ʵ����
    avalon.isPlainObject = function(obj) {
        if (getType(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
            return false
        }
        try {
            if (obj.constructor && !ohasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false
            }
        } catch (e) {
            return false
        }
        return true
    }
    if (rnative.test(Object.getPrototypeOf)) {
        avalon.isPlainObject = function(obj) {
            return !!obj && typeof obj === "object" && Object.getPrototypeOf(obj) === oproto
        }
    }
    */
    avalon.mix = /* avalon.fn.mix = */ function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false

        // �����һ������Ϊ����,�ж��Ƿ����
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1] || {}
            i++
        }

        //ȷ�����ܷ�Ϊһ�����ӵ���������
        if (typeof target !== "object" && getType(target) !== "function") {
            target = {}
        }

        //���ֻ��һ����������ô�³�Ա�����mix���ڵĶ�����
        if (i === length) {
            target = this
            i--
        }

        for (; i < length; i++) {
            //ֻ����ǿղ���
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    copy = options[name]

                    // ��ֹ������
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                            clone = clone.$model || clone

                        } else {
                            clone = src && avalon.isPlainObject(src) ? src : {}
                        }

                        target[name] = avalon.mix(deep, clone, copy)
                    } else if (copy !== void 0) {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    }

    avalon.getWidgetData = function(elem, prefix) {
        var raw = avalon(elem).data()
        var result = {}
        for (var i in raw) {
            if (i.indexOf(prefix) === 0) {
                result[i.replace(prefix, "").replace(/\w/, function(a) {
                    return a.toLowerCase()
                })] = raw[i]
            }
        }
        return result
    }

    /*
    var eventMap = avalon.eventMap = {}

    function resetNumber(a, n, end) { //����ģ��slice, splice��Ч��
        if ((a === +a) && !(a % 1)) { //���������
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

    function oneObject(array, val) {
        if (typeof array === "string") {
            array = array.match(rword) || []
        }
        var result = {},
            value = val !== void 0 ? val : 1
        for (var i = 0, n = array.length; i < n; i++) {
            result[array[i]] = value
        }
        return result
    }
    */
    /*
    avalon.mix({
        rword: rword,
        subscribers: subscribers,
        ui: {},
        log: log,
        slice: W3C ? function(nodes, start, end) {
            return aslice.call(nodes, start, end)
        } : function(nodes, start, end) {
            var ret = [],
                n = nodes.length
            start = resetNumber(start, n)
            end = resetNumber(end, n, 1)
            for (var i = start; i < end; ++i) {
                ret[i - start] = nodes[i]
            }
            return ret
        },
        noop: noop,
        error: function(str, e) { //�������Error�����װһ�£�str�ڿ���̨�¿��ܻ�����
            throw new (e || Error)(str)
        },
        oneObject: oneObject,
        // avalon.range(10)
        // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        // avalon.range(1, 11)
        // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        // avalon.range(0, 30, 5)
        // => [0, 5, 10, 15, 20, 25]
        // avalon.range(0, -10, -1)
        // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
        // avalon.range(0)
        // => []
        range: function(start, end, step) { // ����������������
            step || (step = 1)
            if (end == null) {
                end = start || 0
                start = 0
            }
            var index = -1,
                length = Math.max(0, Math.ceil((end - start) / step)),
                result = Array(length)
            while (++index < length) {
                result[index] = start
                start += step
            }
            return result
        },
        bind: function(el, type, fn, phase) { // ���¼�
            var callback = W3C ? fn : function(e) {
                return fn.call(el, fixEvent(e))
            }
            if (W3C) {
                el.addEventListener(eventMap[type] || type, callback, !!phase)
            } else {
                el.attachEvent("on" + type, callback)
            }
            return callback
        },
        unbind: W3C ? function(el, type, fn, phase) { //ж���¼�
            el.removeEventListener(eventMap[type] || type, fn || noop, !!phase)
        } : function(el, type, fn) {
            el.detachEvent("on" + type, fn || noop)
        },
        css: function(node, name, value) {
            if (node instanceof avalon) {
                node = node[0]
            }
            var prop = /[_-]/.test(name) ? camelize(name) : name
            name = avalon.cssName(prop) || prop
            if (value === void 0 || typeof value === "boolean") { //��ȡ��ʽ
                var fn = cssHooks[prop + ":get"] || cssHooks["@:get"]
                var val = fn(node, name)
                return value === true ? parseFloat(val) || 0 : val
            } else if (value === "") { //�����ʽ
                node.style[name] = ""
            } else { //������ʽ
                if (value == null || value !== value) {
                    return
                }
                if (isFinite(value) && !avalon.cssNumber[prop]) {
                    value += "px"
                }
                fn = cssHooks[prop + ":set"] || cssHooks["@:set"]
                fn(node, name, value)
            }
        },
        each: function(obj, fn) {
            if (obj) { //�ų�null, undefined
                var i = 0
                if (isArrayLike(obj)) {
                    for (var n = obj.length; i < n; i++) {
                        fn(i, obj[i])
                    }
                } else {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            fn(i, obj[i])
                        }
                    }
                }
            }
        },
        Array: {
            ensure: function(target, item) {
                //ֻ�е�ǰ���鲻���ڴ�Ԫ��ʱֻ�����
                if (target.indexOf(item) === -1) {
                    target.push(item)
                }
                return target
            },
            removeAt: function(target, index) {
                //�Ƴ�������ָ��λ�õ�Ԫ�أ����ز�����ʾ�ɹ����
                return !!target.splice(index, 1).length
            },
            remove: function(target, item) {
                //�Ƴ������е�һ��ƥ�䴫�ε��Ǹ�Ԫ�أ����ز�����ʾ�ɹ����
                var index = target.indexOf(item)
                if (~index)
                    return avalon.Array.removeAt(target, index)
                return false
            }
        }
    })

    function generateID() {
        //����UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return "avalon" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    //ֻ�ýڵ㼯�ϣ������飬arguments��ӵ�зǸ�������length���ԵĴ�JS����ͨ��

    function isArrayLike(obj) {
        if (obj && typeof obj === "object" && !avalon.isWindow(obj)) {
            var n = obj.length
            if (+n === n && !(n % 1) && n >= 0) { //���length�����Ƿ�Ϊ�Ǹ�����
                try {
                    if ({}.propertyIsEnumerable.call(obj, "length") === false) { //�����ԭ������
                        return Array.isArray(obj) || /^\s?function/.test(obj.item || obj.callee)
                    }
                    return true
                } catch (e) { //IE��NodeListֱ���״�
                    return true
                }
            }
        }
        return false
    }
    //�������������������첽�ص�(��avalon.ready�����һ����֧�����ڴ���IE6-9)
    avalon.nextTick = window.setImmediate ? setImmediate.bind(window) : function(callback) {
        setTimeout(callback, 0) //IE10-11 or W3C
    }

    /*********************************************************************
     *                           modelFactory                             *
     **********************************************************************/
    var VMODELS = avalon.vmodels = {}
    avalon.define = function(name, factory) {
        if (typeof name !== "string") {
            avalon.error("����ָ��ID")
        }
        if (typeof factory !== "function") {
            avalon.error("factory�����Ǻ���")
        }
        var scope = {
            $watch: noop
        }
        factory(scope) //�õ����ж���
        var model = modelFactory(scope) //͵�컻�գ���scope��Ϊmodel
        stopRepeatAssign = true
        factory(model)
        stopRepeatAssign = false
        model.$id = name
        return VMODELS[name] = model
    }

    function modelFactory(scope, model) {
        if (Array.isArray(scope)) {
            var arr = scope.concat() //ԭ�������Ϊ�����ɵļ�������$model������
            scope.length = 0
            var collection = Collection(scope)
            collection.push.apply(collection, arr)
            return collection
        }
        if (typeof scope.nodeType === "number") {
            return scope
        }
        var vmodel = {} //Ҫ���صĶ���
        model = model || {} //����$model�ϵ�����
        var accessingProperties = {} //�������
        var normalProperties = {} //��ͨ����
        var computedProperties = [] //��������
        var watchProperties = arguments[2] || {} //ǿ��Ҫ����������
        var skipArray = scope.$skipArray //Ҫ���Լ�ص�����
        for (var i = 0, name; name = skipProperties[i++]; ) {
            delete scope[name]
            normalProperties[name] = true
        }
        if (Array.isArray(skipArray)) {
            for (var i = 0, name; name = skipArray[i++]; ) {
                normalProperties[name] = true
            }
        }
        for (var i in scope) {
            loopModel(i, scope[i], model, normalProperties, accessingProperties, computedProperties, watchProperties)
        }
        vmodel = defineProperties(vmodel, descriptorFactory(accessingProperties), normalProperties) //����һ���յ�ViewModel
        for (var name in normalProperties) {
            vmodel[name] = normalProperties[name]
        }
        watchProperties.vmodel = vmodel
        vmodel.$model = model
        vmodel.$events = {}
        vmodel.$id = generateID()
        vmodel.$accessors = accessingProperties
        vmodel[subscribers] = []
        for (var i in Observable) {
            var fn = Observable[i]
            if (!W3C) { //��IE6-8�£�VB����ķ������this����ָ��������Ҫ��bind����һ��
                fn = fn.bind(vmodel)
            }
            vmodel[i] = fn
        }
        vmodel.hasOwnProperty = function(name) {
            return name in vmodel.$model
        }
        for (var i = 0, fn; fn = computedProperties[i++]; ) { //���ǿ�Ƽ������� �����Լ���ֵ
            Registry[expose] = fn
            fn()
            collectSubscribers(fn)
            delete Registry[expose]
        }
        return vmodel
    }

    var skipProperties = String("$id,$watch,$unwatch,$fire,$events,$model,$skipArray,$accessors," + subscribers).match(rword)

    var isEqual = Object.is || function(v1, v2) {
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2
        } else if (v1 !== v1) {
            return v2 !== v2
        } else {
            return v1 === v2
        }
    }

    function safeFire(a, b, c, d) {
        if (a.$events) {
            Observable.$fire.call(a, b, c, d)
        }
    }
    var descriptorFactory = W3C ? function(obj) {
        var descriptors = {}
        for (var i in obj) {
            descriptors[i] = {
                get: obj[i],
                set: obj[i],
                enumerable: true,
                configurable: true
            }
        }
        return descriptors
    } : function(a) {
        return a
    }

    function loopModel(name, val, model, normalProperties, accessingProperties, computedProperties, watchProperties) {
        model[name] = val
        if (normalProperties[name] || (val && val.nodeType)) { //�����ָ�����ü�ص�ϵͳ���Ի�Ԫ�ؽڵ㣬��ŵ� $skipArray����
            return normalProperties[name] = val
        }
        if (name.charAt(0) === "$" && !watchProperties[name]) { //�����$��ͷ�����Ҳ���watchMore�����
            return normalProperties[name] = val
        }
        var valueType = getType(val)
        if (valueType === "function") { //����Ǻ�����Ҳ���ü��
            return normalProperties[name] = val
        }
        var accessor, oldArgs
        if (valueType === "object" && typeof val.get === "function" && Object.keys(val).length <= 2) {
            var setter = val.set,
                getter = val.get
            accessor = function(newValue) { //�����������ԣ��������������������������Դ�����ı�
                var vmodel = watchProperties.vmodel
                var value = model[name],
                    preValue = value
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (typeof setter === "function") {
                        var backup = vmodel.$events[name]
                        vmodel.$events[name] = [] //��ջص�����ֹ�ڲ�ð�ݶ��������$fire
                        setter.call(vmodel, newValue)
                        vmodel.$events[name] = backup
                    }
                    if (!isEqual(oldArgs, newValue)) {
                        oldArgs = newValue
                        newValue = model[name] = getter.call(vmodel)//ͬ��$model
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue)//ͬ��ѭ�����еĴ���VM
                        notifySubscribers(accessor) //֪ͨ����ı�
                        safeFire(vmodel, name, newValue, preValue)//����$watch�ص�
                    }
                } else {
                    if (avalon.openComputedCollect) { // �ռ���ͼˢ�º���
                        collectSubscribers(accessor)
                    }
                    newValue = model[name] = getter.call(vmodel)
                    if (!isEqual(value, newValue)) {
                        oldArgs = void 0
                        safeFire(vmodel, name, newValue, preValue)
                    }
                    return newValue
                }
            }
            computedProperties.push(accessor)
        } else if (rchecktype.test(valueType)) {
            accessor = function(newValue) { //��ViewModel��������
                var realAccessor = accessor.$vmodel, preValue = realAccessor.$model
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (!isEqual(preValue, newValue)) {
                        newValue = accessor.$vmodel = updateVModel(realAccessor, newValue, valueType)
                        var fn = rebindings[newValue.$id]
                        fn && fn()//������ͼ
                        var parent = watchProperties.vmodel
                        // withProxyCount && updateWithProxy(parent.$id, name, newValue)//ͬ��ѭ�����еĴ���VM
                        model[name] = newValue.$model//ͬ��$model
                        notifySubscribers(realAccessor)   //֪ͨ����ı�
                        safeFire(parent, name, model[name], preValue)   //����$watch�ص�
                    }
                } else {
                    collectSubscribers(realAccessor) //�ռ���ͼ����
                    return realAccessor
                }
            }
            accessor.$vmodel = val.$model ? val : modelFactory(val, val)
            model[name] = accessor.$vmodel.$model
        } else {
            accessor = function(newValue) { //�򵥵���������
                var preValue = model[name]
                if (arguments.length) {
                    if (!isEqual(preValue, newValue)) {
                        model[name] = newValue //ͬ��$model
                        var vmodel = watchProperties.vmodel
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue)//ͬ��ѭ�����еĴ���VM
                        notifySubscribers(accessor) //֪ͨ����ı�
                        safeFire(vmodel, name, newValue, preValue)//����$watch�ص�
                    }
                } else {
                    collectSubscribers(accessor) //�ռ���ͼ����
                    return preValue
                }
            }
            model[name] = val
        }
        accessor[subscribers] = [] //����������
        accessingProperties[name] = accessor
    }
    //with�����ɵĴ�����󴢴��
    var withProxyPool = {}
    var withProxyCount = 0
    var rebindings = {}

    function updateWithProxy($id, name, val) {
        var pool = withProxyPool[$id]
        if (pool && pool[name]) {
            pool[name].$val = val
        }
    }

    function updateVModel(a, b, valueType) {
        //aΪԭ����VM�� bΪ��������¶���
        if (valueType === "array") {
            if (!Array.isArray(b)) {
                return a //fix https://github.com/RubyLouvre/avalon/issues/261
            }
            var bb = b.concat()
            a.clear()
            a.push.apply(a, bb)
            return a
        } else {
            var iterators = a[subscribers]
            if (withProxyPool[a.$id]) {
                withProxyCount--
                delete withProxyPool[a.$id]
            }
            iterators.forEach(function(data) {
                data.rollback && data.rollback() //��ԭ vm-with vm-on
            })
            var ret = modelFactory(b)
            rebindings[ret.$id] = function(data) {
                while (data = iterators.shift()) {
                    (function(el) {
                        if (el.type) { //���°�
                            avalon.nextTick(function() {
                                bindingHandlers[el.type](el, el.vmodels)
                            })
                        }
                    })(data)
                }
                delete rebindings[ret.$id]
            }
            return ret
        }
    }

    //===================�޸��������Object.defineProperties��֧��=================
    var defineProperty = Object.defineProperty
    //����������֧��ecma262v5��Object.defineProperties���ߴ���BUG������IE8
    //��׼�����ʹ��__defineGetter__, __defineSetter__ʵ��
    try {
        defineProperty({}, "_", {
            value: "x"
        })
        var defineProperties = Object.defineProperties
    } catch (e) {
        if ("__defineGetter__" in avalon) {
            defineProperty = function(obj, prop, desc) {
                if ('value' in desc) {
                    obj[prop] = desc.value
                }
                if ("get" in desc) {
                    obj.__defineGetter__(prop, desc.get)
                }
                if ('set' in desc) {
                    obj.__defineSetter__(prop, desc.set)
                }
                return obj
            }
            defineProperties = function(obj, descs) {
                for (var prop in descs) {
                    if (descs.hasOwnProperty(prop)) {
                        defineProperty(obj, prop, descs[prop])
                    }
                }
                return obj
            }
        }
    }
    //IE6-8ʹ��VBScript���set get���ʵ��
    if (!defineProperties && window.VBArray) {
        window.execScript([
            "Function parseVB(code)",
            "\tExecuteGlobal(code)",
            "End Function"
        ].join("\n"), "VBScript")

        function VBMediator(accessingProperties, name, value) {
            var accessor = accessingProperties[name]
            if (arguments.length === 3) {
                accessor(value)
            } else {
                return accessor()
            }
        }
        defineProperties = function(name, accessingProperties, normalProperties) {
            var className = "VBClass" + setTimeout("1"),
                buffer = []
            buffer.push(
                "Class " + className,
                "\tPrivate [__data__], [__proxy__]",
                "\tPublic Default Function [__const__](d, p)",
                "\t\tSet [__data__] = d: set [__proxy__] = p",
                "\t\tSet [__const__] = Me", //��ʽ����
                "\tEnd Function")
            //�����ͨ����,��ΪVBScript��������JS����������ɾ���ԣ�����������Ԥ�ȶ����
            for (name in normalProperties) {
                buffer.push("\tPublic [" + name + "]")
            }
            buffer.push("\tPublic [" + 'hasOwnProperty' + "]")
            //��ӷ��������� 
            for (name in accessingProperties) {
                if (!(name in normalProperties)) { //��ֹ�ظ�����
                    buffer.push(
                        //���ڲ�֪�Է��ᴫ��ʲô,���set, let������
                        "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Get [" + name + "]", //getter
                        "\tOn Error Resume Next", //��������ʹ��set���,�������������鵱�ַ�������
                        "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tIf Err.Number <> 0 Then",
                        "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tEnd If",
                        "\tOn Error Goto 0",
                        "\tEnd Property")
                }
            }
            buffer.push("End Class") //�ඨ�����
            buffer.push(
                "Function " + className + "Factory(a, b)", //����ʵ�������������ؼ��Ĳ���
                "\tDim o",
                "\tSet o = (New " + className + ")(a, b)",
                "\tSet " + className + "Factory = o",
                "End Function")
            window.parseVB(buffer.join("\r\n")) //�ȴ���һ��VB�๤��
            return window[className + "Factory"](accessingProperties, VBMediator) //�õ����Ʒ
        }
    }
    /*********************************************************************
     *                           ecma262 v5�﷨����                   *
     **********************************************************************/
    /*
    if (!"˾ͽ����".trim) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        String.prototype.trim = function() {
            return this.replace(rtrim, "")
        }
    }
    for (var i in {
        toString: 1
    }) {
        DONT_ENUM = false
    }
    if (!Object.keys) {
        Object.keys = function(obj) { //ecma262v5 15.2.3.14
            var result = []
            for (var key in obj)
                if (obj.hasOwnProperty(key)) {
                    result.push(key)
                }
            if (DONT_ENUM && obj) {
                for (var i = 0; key = DONT_ENUM[i++]; ) {
                    if (obj.hasOwnProperty(key)) {
                        result.push(key)
                    }
                }
            }
            return result
        }
    }
    if (!Array.isArray) {
        Array.isArray = function(a) {
            return a && getType(a) === "array"
        }
    }

    if (!noop.bind) {
        Function.prototype.bind = function(scope) {
            if (arguments.length < 2 && scope === void 0)
                return this
            var fn = this,
                argv = arguments
            return function() {
                var args = [],
                    i
                for (i = 1; i < argv.length; i++)
                    args.push(argv[i])
                for (i = 0; i < arguments.length; i++)
                    args.push(arguments[i])
                return fn.apply(scope, args)
            }
        }
    }

    function iterator(vars, body, ret) {
        var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret
        return Function("fn,scope", fun)
    }
    if (!rnative.test([].map)) {
        avalon.mix(ap, {
            //��λ���������������е�һ�����ڸ���������Ԫ�ص�����ֵ��
            indexOf: function(item, index) {
                var n = this.length,
                    i = ~~index
                if (i < 0)
                    i += n
                for (; i < n; i++)
                    if (this[i] === item)
                        return i
                return -1
            },
            //��λ��������ͬ�ϣ������ǴӺ������
            lastIndexOf: function(item, index) {
                var n = this.length,
                    i = index == null ? n - 1 : index
                if (i < 0)
                    i = Math.max(0, n + i)
                for (; i >= 0; i--)
                    if (this[i] === item)
                        return i
                return -1
            },
            //�����������������Ԫ�ذ���������һ��������ִ�С�Ptototype.js�Ķ�Ӧ����Ϊeach��
            forEach: iterator("", '_', ""),
            //������ �������е�ÿ����������һ������������˺�����ֵΪ�棬���Ԫ����Ϊ�������Ԫ���ռ�������������������
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //�ռ��������������Ԫ�ذ���������һ��������ִ�У�Ȼ������ǵķ���ֵ���һ�������鷵�ء�Ptototype.js�Ķ�Ӧ����Ϊcollect��
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //ֻҪ��������һ��Ԫ�������������Ž�������������true������ô���ͷ���true��Ptototype.js�Ķ�Ӧ����Ϊany��
            some: iterator("", 'if(_)return true', 'return false'),
            //ֻ�������е�Ԫ�ض������������Ž�������������true�������ŷ���true��Ptototype.js�Ķ�Ӧ����Ϊall��
            every: iterator("", 'if(!_)return false', 'return true')
        })
    }

    function fixContains(a, b) {
        if (b) {
            while ((b = b.parentNode)) {
                if (b === a) {
                    return true;
                }
            }
        }
        return false;
    }
    if (!root.contains) { //safari5+�ǰ�contains��������Element.prototype�϶�����Node.prototype
        Node.prototype.contains = function(arg) {
            return !!(this.compareDocumentPosition(arg) & 16)
        }
    }
    if (!DOC.contains) { //IE6-11���ĵ�����û��contains
        DOC.contains = function(b) {
            return fixContains(this, b)
        }
    }
    if (!root.outerHTML && window.HTMLElement) {//firefox ��11ʱ����outerHTML
        HTMLElement.prototype.__defineGetter__("outerHTML", function() {
            domParser.textContent = ""
            domParser.appendChild(this)
            var str = this.innerHTML
            domParser.textContent = ""
            return str
        });
    }
    /*********************************************************************
     *                           ����ģ��                                  *
     **********************************************************************/

    function kernel(settings) {
        for (var p in settings) {
            if (!ohasOwn.call(settings, p))
                continue
            var val = settings[p]
            if (typeof kernel.plugins[p] === "function") {
                kernel.plugins[p](val)
            } else if (typeof kernel[p] === "object") {
                avalon.mix(kernel[p], val)
            } else {
                kernel[p] = val
            }
        }
        return this
    }
    var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g

    function escapeRegExp(target) {
        //http://stevenlevithan.com/regex/xregexp/
        //���ַ�����ȫ��ʽ��Ϊ������ʽ��Դ��
        return (target + "").replace(rregexp, "\\$&")
    }
    /*
    var plugins = {
        alias: function(val) {
            log("Warning: alias�����ѷ���������paths, shim������")
            for (var c in val) {
                if (ohasOwn.call(val, c)) {
                    var currValue = val[c]
                    switch (getType(currValue)) {
                        case "string":
                            kernel.paths[c] = currValue
                            break;
                        case "object":
                            if (currValue.src) {
                                kernel.paths[c] = currValue.src
                                delete currValue.src
                            }
                            kernel.shim[c] = currValue
                            break;
                    }
                }
            }
        },
        loader: function(bool) {
            if (bool) {
                window.define = innerRequire.define
                window.require = innerRequire
            } else {
                window.define = otherDefine
                window.require = otherRequire
            }
        },
        interpolate: function(array) {
            if (Array.isArray(array) && array[0] && array[1] && array[0] !== array[1]) {
                openTag = array[0]
                closeTag = array[1]
                var o = escapeRegExp(openTag),
                    c = escapeRegExp(closeTag)
                rexpr = new RegExp(o + "(.*?)" + c)
                rexprg = new RegExp(o + "(.*?)" + c, "g")
                rbind = new RegExp(o + ".*?" + c + "|\\svm-")
            }
        }
    }

    kernel.plugins = plugins
    kernel.plugins['interpolate'](["{{", "}}"])
    kernel.paths = {}
    kernel.shim = {}
    avalon.config = kernel
    */
    var config = {
        interpolate: function(array) {
            if (Array.isArray(array) && array[0] && array[1] && array[0] !== array[1]) {
                openTag = array[0]
                closeTag = array[1]
                var o = escapeRegExp(openTag),
                    c = escapeRegExp(closeTag)
                rexpr = new RegExp(o + "(.*?)" + c)
                rexprg = new RegExp(o + "(.*?)" + c, "g")
                rbind = new RegExp(o + ".*?" + c + "|\\s" + prefix);
            }
        }
    }
    /*********************************************************************
     *                      DOM API�ĸ߼���װ                           *
     **********************************************************************/

    /*
    function hyphen(target) {
        //ת��Ϊ���ַ��߷��
        return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase()
    }

    function camelize(target) {
        //ת��Ϊ�շ���
        if (target.indexOf("-") < 0 && target.indexOf("_") < 0) {
            return target //��ǰ�жϣ����getStyle�ȵ�Ч��
        }
        return target.replace(/[-_][^-_]/g, function(match) {
            return match.charAt(1).toUpperCase()
        })
    }

    var rnospaces = /\S+/g

    avalon.fn.mix({
        hasClass: function(cls) {
            var node = this[0] || {}
            if (node.nodeType === 1 && node.className) {
                return (" " + node.className + " ").indexOf(" " + cls + " ") > -1
            }
            return false
        },
        addClass: function(cls) {
            var node = this[0] || {}
            if (cls && typeof cls === "string" && node.nodeType === 1) {
                if (!node.className) {
                    node.className = cls
                } else {
                    var arr = node.className.match(rnospaces)
                    cls.replace(rnospaces, function(a) {
                        if (arr.indexOf(a) === -1) {
                            arr.push(a)
                        }
                    })
                    node.className = arr.join(" ")
                }
            }
            return this
        },
        removeClass: function(cls) {
            var node = this[0] || {}
            if (cls && typeof cls > "o" && node.nodeType === 1 && node.className) {
                var classNames = (cls || "").match(rnospaces) || []
                var cl = classNames.length
                var set = " " + node.className.match(rnospaces).join(" ") + " "
                for (var c = 0; c < cl; c++) {
                    set = set.replace(" " + classNames[c] + " ", " ")
                }
                node.className = set.slice(1, set.length - 1)
            }
            return this
        },
        toggleClass: function(value, stateVal) {
            var state = stateVal,
                className, i = 0
            var classNames = value.match(rnospaces) || []
            var isBool = typeof stateVal === "boolean"
            while ((className = classNames[i++])) {
                state = isBool ? state : !this.hasClass(className)
                this[state ? "addClass" : "removeClass"](className)
            }
            return this
        },
        attr: function(name, value) {
            if (arguments.length === 2) {
                this[0].setAttribute(name, value)
                return this
            } else {
                return this[0].getAttribute(name)
            }
        },
        data: function(name, value) {
            name = "data-" + hyphen(name || "")
            switch (arguments.length) {
                case 2:
                    this.attr(name, value)
                    return this
                case 1:
                    var val = this.attr(name)
                    return parseData(val)
                case 0:
                    var attrs = this[0].attributes,
                        ret = {}
                    for (var i = 0, attr; attr = attrs[i++]; ) {
                        name = attr.name
                        if (!name.indexOf("data-")) {
                            name = camelize(name.slice(5))
                            ret[name] = parseData(attr.value)
                        }
                    }
                    return ret
            }
        },
        removeData: function(name) {
            name = "data-" + hyphen(name)
            this[0].removeAttribute(name)
            return this
        },
        css: function(name, value) {
            if (avalon.isPlainObject(name)) {
                for (var i in name) {
                    avalon.css(this, i, name[i])
                }
            } else {
                var ret = avalon.css(this, name, value)
            }
            return ret !== void 0 ? ret : this
        },
        position: function() {
            var offsetParent, offset,
                elem = this[0],
                parentOffset = {
                    top: 0,
                    left: 0
                }
            if (!elem) {
                return
            }
            if (this.css("position") === "fixed") {
                offset = elem.getBoundingClientRect()
            } else {
                offsetParent = this.offsetParent() //�õ�������offsetParent
                offset = this.offset() // �õ���ȷ��offsetParent
                if (offsetParent[0].tagName !== "HTML") {
                    parentOffset = offsetParent.offset()
                }
                parentOffset.top += avalon.css(offsetParent[0], "borderTopWidth", true)
                parentOffset.left += avalon.css(offsetParent[0], "borderLeftWidth", true)
            }
            return {
                top: offset.top - parentOffset.top - avalon.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - avalon.css(elem, "marginLeft", true)
            }
        },
        offsetParent: function() {
            var offsetParent = this[0].offsetParent || root
            while (offsetParent && (offsetParent.tagName !== "HTML") && avalon.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent
            }
            return avalon(offsetParent || root)
        },
        bind: function(type, fn, phase) {
            if (this[0]) { //�˷���������
                return avalon.bind(this[0], type, fn, phase)
            }
        },
        unbind: function(type, fn, phase) {
            if (this[0]) {
                avalon.unbind(this[0], type, fn, phase)
            }
            return this
        },
        val: function(value) {
            var node = this[0]
            if (node && node.nodeType === 1) {
                var get = arguments.length === 0
                var access = get ? ":get" : ":set"
                var fn = valHooks[getValType(node) + access]
                if (fn) {
                    var val = fn(node, value)
                } else if (get) {
                    return (node.value || "").replace(/\r/g, "")
                } else {
                    node.value = value
                }
            }
            return get ? val : this
        }
    })

    function parseData(data) {
        try {
            data = data === "true" ? true :
                data === "false" ? false :
                    data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? parseJSON(data) : data
        } catch (e) {
        }
        return data
    }
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
    var parseJSON = window.JSON ? JSON.parse : function(data) {
        if (typeof data === "string") {
            data = data.trim();
            if (data) {
                if (rvalidchars.test(data.replace(rvalidescape, "@")
                    .replace(rvalidtokens, "]")
                    .replace(rvalidbraces, ""))) {
                    return (new Function("return " + data))();
                }
            }
            avalon.error("Invalid JSON: " + data);
        }
    }

    //����avalon.fn.scrollLeft, avalon.fn.scrollTop����
    avalon.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        avalon.fn[method] = function(val) {
            var node = this[0] || {}, win = getWindow(node),
                top = method === "scrollTop"
            if (!arguments.length) {
                return win ? (prop in win) ? win[prop] : root[method] : node[method]
            } else {
                if (win) {
                    win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
                } else {
                    node[method] = val
                }
            }
        }
    })

    function getWindow(node) {
        return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
    }
    //=============================css���=======================
    var cssHooks = avalon.cssHooks = {}
    var prefixes = ["", "-webkit-", "-o-", "-moz-", "-vm-"]
    var cssMap = {
        "float": "cssFloat",
        background: "backgroundColor"
    }
    avalon.cssNumber = oneObject("columnCount,order,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom")

    avalon.cssName = function(name, host, camelCase) {
        if (cssMap[name]) {
            return cssMap[name]
        }
        host = host || root.style
        for (var i = 0, n = prefixes.length; i < n; i++) {
            camelCase = camelize(prefixes[i] + name)
            if (camelCase in host) {
                return (cssMap[name] = camelCase)
            }
        }
        return null
    }
    cssHooks["@:set"] = function(node, name, value) {
        try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine �ھ�ʽIE�»����쳣
            node.style[name] = value
        } catch (e) {
        }
    }
    if (window.getComputedStyle) {
        cssHooks["@:get"] = function(node, name) {
            var ret, styles = window.getComputedStyle(node, null)
            if (styles) {
                ret = name === "filter" ? styles.getPropertyValue(name) : styles[name]
                if (ret === "") {
                    ret = node.style[name] //�����������Ҫ�����ֶ�ȡ������ʽ
                }
            }
            return ret
        }
        cssHooks["opacity:get"] = function(node) {
            var ret = cssHooks["@:get"](node, "opacity")
            return ret === "" ? "1" : ret
        }
    } else {
        var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
        var rposition = /^(top|right|bottom|left)$/
        var ie8 = !!window.XDomainRequest
        var salpha = "DXImageTransform.Microsoft.Alpha"
        var border = {
            thin: ie8 ? '1px' : '2px',
            medium: ie8 ? '3px' : '4px',
            thick: ie8 ? '5px' : '6px'
        }
        cssHooks["@:get"] = function(node, name) {
            //ȡ�þ�ȷֵ���������п����Ǵ�em,pc,mm,pt,%�ȵ�λ
            var currentStyle = node.currentStyle
            var ret = currentStyle[name]
            if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
                //�٣�����ԭ�е�style.left, runtimeStyle.left,
                var style = node.style,
                    left = style.left,
                    rsLeft = node.runtimeStyle.left
                //�����ڢ۴���style.left = xxx��Ӱ�쵽currentStyle.left��
                //��˰���currentStyle.left�ŵ�runtimeStyle.left��
                //runtimeStyle.leftӵ��������ȼ�������style.leftӰ��
                node.runtimeStyle.left = currentStyle.left
                //�۽���ȷֵ������style.left��Ȼ��ͨ��IE����һ��˽������ style.pixelLeft
                //�õ���λΪpx�Ľ����fontSize�ķ�֧��http://bugs.jquery.com/ticket/760
                style.left = name === 'fontSize' ? '1em' : (ret || 0)
                ret = style.pixelLeft + "px"
                //�ܻ�ԭ style.left��runtimeStyle.left
                style.left = left
                node.runtimeStyle.left = rsLeft
            }
            if (ret === "medium") {
                name = name.replace("Width", "Style")
                //border width Ĭ��ֵΪmedium����ʹ��Ϊ0"
                if (currentStyle[name] === "none") {
                    ret = "0px"
                }
            }
            return ret === "" ? "auto" : border[ret] || ret
        }
        cssHooks["opacity:set"] = function(node, name, value) {
            node.style.filter = 'alpha(opacity=' + value * 100 + ')'
            node.style.zoom = 1
        }
        cssHooks["opacity:get"] = function(node) {
            //�������Ļ�ȡIE͸��ֵ�ķ�ʽ������Ҫ���������ˣ�
            var alpha = node.filters.alpha || node.filters[salpha],
                op = alpha ? alpha.opacity : 100
            return (op / 100) + "" //ȷ�����ص����ַ���
        }
        //��ʽIE�޷�ͨ��currentStyleȡ��û�ж�������ʽ���е�width, heightֵ
        "width,height".replace(rword, function(name) {
            cssHooks[name + ":get"] = function(node) {
                if (name === "width") {
                    return node.clientWidth - avalon.css(node, "paddingLeft", true) - avalon.css(node, "paddingRight", true)
                } else {
                    return node.clientHeight - avalon.css(node, "paddingTop", true) - avalon.css(node, "paddingBottom", true)
                }
            }
        })
    }

    "top,left".replace(rword, function(name) {
        cssHooks[name + ":get"] = function(node) {
            var computed = cssHooks["@:get"](node, name)
            return /px$/.test(computed) ? computed :
                avalon(node).position()[name] + "px"
        }
    })
    var cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }

    var rdisplayswap = /^(none|table(?!-c[ea]).+)/

    function showHidden(node, array) {
        //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
        if (node.offsetWidth <= 0) { //opera.offsetWidth����С��0
            if (rdisplayswap.test(cssHooks["@:get"](node, "display"))) {
                var obj = {
                    node: node
                }
                for (var name in cssShow) {
                    obj[name] = node.style[name]
                    node.style[name] = cssShow[name]
                }
                array.push(obj)
            }
            var parent = node.parentNode
            if (parent && parent.nodeType == 1) {
                showHidden(parent, array)
            }
        }
    }
    "Width,Height".replace(rword, function(name) {
        var method = name.toLowerCase(),
            clientProp = "client" + name,
            scrollProp = "scroll" + name,
            offsetProp = "offset" + name
        cssHooks[method + "::get"] = function(node) {
            var hidden = [];
            showHidden(node, hidden);
            var val = avalon.css(node, method, true)
            for (var i = 0, obj; obj = hidden[i++]; ) {
                node = obj.node
                for (var n in obj) {
                    if (typeof obj[n] === "string") {
                        node.style[n] = obj[n]
                    }
                }
            }
            return val;
        }
        avalon.fn[method] = function(value) {
            var node = this[0]
            if (arguments.length === 0) {
                if (node.setTimeout) { //ȡ�ô��ڳߴ�,IE9�������node.innerWidth /innerHeight����
                    return node["inner" + name] || node.document.documentElement[clientProp]
                }
                if (node.nodeType === 9) { //ȡ��ҳ��ߴ�
                    var doc = node.documentElement
                    //FF chrome    html.scrollHeight< body.scrollHeight
                    //IE ��׼ģʽ : html.scrollHeight> body.scrollHeight
                    //IE ����ģʽ : html.scrollHeight �����ڿ��Ӵ��ڶ�һ�㣿
                    return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
                }
                return cssHooks[method + "::get"](node)
            } else {
                return this.css(method, value)
            }
        }

    })
    avalon.fn.offset = function() { //ȡ�þ���ҳ�����ҽǵ�����
        var node = this[0],
            doc = node && node.ownerDocument
        var pos = {
            left: 0,
            top: 0
        }
        if (!doc) {
            return pos
        }
        //http://hkom.blog1.fc2.com/?mode=m&no=750 body��ƫ�����ǲ�����margin��
        //���ǿ���ͨ��getBoundingClientRect�����Ԫ�������client��rect.
        //http://msdn.microsoft.com/en-us/library/ms536433.aspx
        var box = node.getBoundingClientRect(),
        //chrome1+, firefox3+, ie4+, opera(yes) safari4+
            win = doc.defaultView || doc.parentWindow,
            root = (navigator.vendor || doc.compatMode === "BackCompat") ? doc.body : doc.documentElement,
            clientTop = root.clientTop >> 0,
            clientLeft = root.clientLeft >> 0,
            scrollTop = win.pageYOffset || root.scrollTop,
            scrollLeft = win.pageXOffset || root.scrollLeft
        // �ѹ�������ӵ�left,top��ȥ��
        // IEһЩ�汾�л��Զ�ΪHTMLԪ�ؼ���2px��border��������Ҫȥ����
        // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
        pos.top = box.top + scrollTop - clientTop
        pos.left = box.left + scrollLeft - clientLeft
        return pos
    }

    //==================================val���============================

    function getValType(el) {
        var ret = el.tagName.toLowerCase()
        return ret === "input" && /checkbox|radio/.test(el.type) ? "checked" : ret
    }
    var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
    var valHooks = {
        "option:get": function(node) {
            //��IE11��W3C�����û��ָ��value����ônode.valueĬ��Ϊnode.text������trim��������IE9-10����ȡinnerHTML(ûtrim����)
            if (node.hasAttribute) {
                return node.hasAttribute("value") ? node.value : node.text
            }
            //specified�����ɿ������ͨ������outerHTML�ж��û���û����ʾ����value
            return roption.test(node.outerHTML) ? node.value : node.text
        },
        "select:get": function(node, value) {
            var option, options = node.options,
                index = node.selectedIndex,
                getter = valHooks["option:get"],
                one = node.type === "select-one" || index < 0,
                values = one ? null : [],
                max = one ? index + 1 : options.length,
                i = index < 0 ? max : one ? index : 0
            for (; i < max; i++) {
                option = options[i]
                //��ʽIE��reset�󲻻�ı�selected����Ҫ����i === index�ж�
                //���ǹ�������disabled��optionԪ�أ�����safari5�£��������selectΪdisable����ô�����к��Ӷ�disable
                //��˵�һ��Ԫ��Ϊdisable����Ҫ������Ƿ���ʽ������disable���丸�ڵ��disable���
                if ((option.selected || i === index) && !option.disabled) {
                    value = getter(option)
                    if (one) {
                        return value
                    }
                    //�ռ�����selectedֵ������鷵��
                    values.push(value)
                }
            }
            return values
        },
        "select:set": function(node, values, optionSet) {
            values = [].concat(values) //ǿ��ת��Ϊ����
            var getter = valHooks["option:get"]
            for (var i = 0, el; el = node.options[i++]; ) {
                if ((el.selected = values.indexOf(getter(el)) >= 0)) {
                    optionSet = true
                }
            }
            if (!optionSet) {
                node.selectedIndex = -1
            }
        }
    }
    */

    /************************************************************************
     *                                parseHTML                              *
     ************************************************************************/
    /*
    var rtagName = /<([\w:]+)/,
    //ȡ����tagName
        rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig,
        scriptTypes = oneObject("text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript", "text/vbscript"),
    //��Ҫ������Ƕ��ϵ�ı�ǩ
        rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/
    //parseHTML�ĸ�������
    var tagHooks = {
        area: [1, "<map>"],
        param: [1, "<object>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</table>"],
        legend: [1, "<fieldset>"],
        option: [1, "<select multiple='multiple'>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>"],
        td: [3, "<table><tbody><tr>"],
        //IE6-8����innerHTML���ɽڵ�ʱ������ֱ�Ӵ���no-scopeԪ����HTML5���±�ǩ
        _default: W3C ? [0, ""] : [1, "X<div>"] //div���Բ��ñպ�
    }
    tagHooks.optgroup = tagHooks.option
    tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead
    tagHooks.th = tagHooks.td

    var script = DOC.createElement("script")
    avalon.parseHTML = function(html) {
        if (typeof html !== "string") {
            html = html + ""
        }
        html = html.replace(rxhtml, "<$1></$2>").trim()
        var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase(),
        //ȡ�����ǩ��
            wrap = tagHooks[tag] || tagHooks._default,
            fragment = documentFragment.cloneNode(false),
            wrapper = domParser,
            firstChild, neo
        if (!W3C) { //fix IE
            html = html.replace(rcreate, "<br class=msNoScope>$1") //��link style script�ȱ�ǩ֮ǰ���һ������
        }
        wrapper.innerHTML = wrap[1] + html + (wrap[2] || "")
        var els = wrapper.getElementsByTagName("script")
        if (els.length) { //ʹ��innerHTML���ɵ�script�ڵ㲻�ᷢ��������ִ��text����
            for (var i = 0, el; el = els[i++]; ) {
                if (!el.type || scriptTypes[el.type]) { //���script�ڵ��MIME������ִ�нű�
                    neo = script.cloneNode(false) //FF����ʡ�Բ���
                    for (var j = 0, attr; attr = el.attributes[j++]; ) {
                        if (attr.specified) { //����������
                            neo[attr.name] = attr.value
                        }
                    }
                    neo.text = el.text //����ָ��,��Ϊ�޷���attributes�б�������
                    el.parentNode.replaceChild(neo, el) //�滻�ڵ�
                }
            }
        }
        //�Ƴ�����Ϊ�˷�����Ƕ��ϵ����ӵı�ǩ
        for (i = wrap[0]; i--; wrapper = wrapper.lastChild) {
        }
        if (!W3C) { //fix IE
            for (els = wrapper["getElementsByTagName"]("br"), i = 0; el = els[i++]; ) {
                if (el.className && el.className === "vmNoScope") {
                    el.parentNode.removeChild(el)
                }
            }
        }
        while (firstChild = wrapper.firstChild) { // ��wrapper�ϵĽڵ�ת�Ƶ��ĵ���Ƭ�ϣ�
            fragment.appendChild(firstChild)
        }
        return fragment
    }
    avalon.innerHTML = function(node, html) {
        if (!W3C && (!rcreate.test(html) && !rnest.test(html))) {
            try {
                node.innerHTML = html
                return
            } catch (e) {
            }
        }
        var a = this.parseHTML(html)
        this.clearHTML(node).appendChild(a)
    }
    avalon.clearHTML = function(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild)
        }
        return node
    }
    */
    /*********************************************************************
     *                           Observable                              *
     **********************************************************************/
    var Observable = {
        $watch: function(type, callback) {
            if (typeof callback === "function") {
                var callbacks = this.$events[type]
                if (callbacks) {
                    callbacks.push(callback)
                } else {
                    this.$events[type] = [callback]
                }
            } else { //���¿�ʼ������VM�ĵ�һ�ؼ����Եı䶯
                this.$events = this.$watch.backup
            }
            return this
        },
        $unwatch: function(type, callback) {
            var n = arguments.length
            if (n === 0) { //�ô�VM������$watch�ص���Ч��
                this.$watch.backup = this.$events
                this.$events = {}
            } else if (n === 1) {
                this.$events[type] = []
            } else {
                var callbacks = this.$events[type] || []
                var i = callbacks.length
                while (~--i < 0) {
                    if (callbacks[i] === callback) {
                        return callbacks.splice(i, 1)
                    }
                }
            }
            return this
        },
        $fire: function(type) {
            var callbacks = this.$events[type] || []
            var all = this.$events.$all || []
            var args = aslice.call(arguments, 1)
            for (var i = 0, callback; callback = callbacks[i++]; ) {
                callback.apply(this, args)
            }
            for (var i = 0, callback; callback = all[i++]; ) {
                callback.apply(this, arguments)
            }
        }
    }

    /*********************************************************************
     *                           �����ռ��봥��                                *
     **********************************************************************/

    function registerSubscriber(data) {
        Registry[expose] = data //����˺���,����collectSubscribers�ռ�
        avalon.openComputedCollect = true
        var fn = data.evaluator
        if (fn) { //�������ֵ����
            if (data.type === "duplex") {
                data.handler()
            } else {
                data.handler(fn.apply(0, data.args), data.element, data)
            }
        } else { //����Ǽ������Ե�accessor
            data()
        }
        avalon.openComputedCollect = false
        delete Registry[expose]
    }

    function collectSubscribers(accessor) { //�ռ�����������������Ķ�����
        if (Registry[expose]) {
            var list = accessor[subscribers]
            list && avalon.Array.ensure(list, Registry[expose]) //ֻ�����鲻���ڴ�Ԫ�ز�push��ȥ
        }
    }

    function notifySubscribers(accessor) { //֪ͨ����������������Ķ����߸�������
        var list = accessor[subscribers]
        if (list && list.length) {
            var args = aslice.call(arguments, 1)
            for (var i = list.length, fn; fn = list[--i]; ) {
                var el = fn.element,
                    remove
                if (el && !avalon.contains(ifSanctuary, el)) {
                    if (typeof el.sourceIndex == "number") { //IE6-IE11
                        remove = el.sourceIndex === 0
                    } else {
                        remove = !avalon.contains(root, el)
                    }
                    if (remove) { //�����û����DOM��
                        list.splice(i, 1)
                        log("Debug: remove " + fn.name)
                    }
                }
                if (typeof fn === "function") {
                    fn.apply(0, args) //ǿ�����¼�������
                } else if (fn.getter) {
                    fn.handler.apply(fn, args) //����������ķ���
                } else {
                    fn.handler(fn.evaluator.apply(0, fn.args || []), el, fn)
                }
            }
        }
    }

    /*********************************************************************
     *                           ɨ��ϵͳ                                 *
     **********************************************************************/
    avalon.scan = function(elem, vmodel) {
        elem = elem || root
        var vmodels = vmodel ? [].concat(vmodel) : []
        scanTag(elem, vmodels)
    }

    //http://www.w3.org/TR/html5/syntax.html#void-elements
    var stopScan = oneObject("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea".toUpperCase())

    //ȷ��Ԫ�ص����ݱ���ȫɨ����Ⱦ��ϲŵ��ûص�
    var interval = W3C ? 15 : 50

    function checkScan(elem, callback) {
        var innerHTML = NaN,
            id = setInterval(function() {
                var currHTML = elem.innerHTML
                if (currHTML === innerHTML) {
                    clearInterval(id)
                    callback()
                } else {
                    innerHTML = currHTML
                }
            }, interval)
    }


    function scanTag(elem, vmodels, node) {
        //ɨ��˳��  vm-skip(0) --> vm-important(1) --> vm-controller(2) --> vm-if(10) --> vm-repeat(100) 
        //--> vm-if-loop(110) --> vm-attr(970) ...--> vm-each(1400)-->vm-with(1500)--��vm-duplex(2000)���
        var a = elem.getAttribute(prefix + "skip")
        var b = elem.getAttributeNode(prefix + "important")
        var c = elem.getAttributeNode(prefix + "controller")
        if (typeof a === "string") {
            return
        } else if (node = b || c) {
            var newVmodel = VMODELS[node.value]
            if (!newVmodel) {
                return
            }
            //vm-important��������VM��vm-controller�෴
            vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
            elem.removeAttribute(node.name) //removeAttributeNode����ˢ��[vm-controller]��ʽ����
            avalon(elem).removeClass(node.name) //����IE6
        }
        scanAttr(elem, vmodels) //ɨ�����Խڵ�
    }

    function scanNodes(parent, vmodels) {
        var node = parent.firstChild

        while (node) {
            var nextNode = node.nextSibling
            if (node.nodeType === 1) {
                scanTag(node, vmodels) //ɨ��Ԫ�ؽڵ�
            } else if (node.nodeType === 3 && rexpr.test(node.nodeValue)) {
                scanText(node, vmodels) //ɨ���ı��ڵ�
            }
            node = nextNode
        }
    }

    function scanText(textNode, vmodels) {
        var bindings = [],
            tokens = scanExpr(textNode.nodeValue)
        if (tokens.length) {
            for (var i = 0, token; token = tokens[i++]; ) {
                var node = DOC.createTextNode(token.value) //���ı�ת��Ϊ�ı��ڵ㣬���滻ԭ�����ı��ڵ�
                if (token.expr) {
                    var filters = token.filters
                    var binding = {
                        type: "text",
                        node: node,
                        nodeType: 3,
                        value: token.value,
                        filters: filters
                    }
                    if (filters && filters.indexOf("html") !== -1) {
                        avalon.Array.remove(filters, "html")
                        binding.type = "html"
                        binding.replaceNodes = [node]
                        if (!filters.length) {
                            delete bindings.filters
                        }
                    }
                    bindings.push(binding) //�ռ����в�ֵ���ʽ���ı�
                }
                documentFragment.appendChild(node)
            }
            textNode.parentNode.replaceChild(documentFragment, textNode)
            if (bindings.length)
                executeBindings(bindings, vmodels)
        }
    }

    var rmsAttr = /vm-(\w+)-?(.*)/
    var priorityMap = {
        "if": 10,
        "repeat": 100,
        "each": 1400,
        "with": 1500,
        "duplex": 2000
    }

    function scanAttr(elem, vmodels) {
        var attributes = getAttributes ? getAttributes(elem) : elem.attributes
        var bindings = [],
            msData = {},
            match
        for (var i = 0, attr; attr = attributes[i++]; ) {
            if (attr.specified) {
                if (match = attr.name.match(rmsAttr)) {
                    //�������ָ��ǰ׺������
                    var type = match[1]
                    msData[attr.name] = attr.value
                    if (typeof bindingHandlers[type] === "function") {
                        var param = match[2] || ""
                        var binding = {
                            type: type,
                            param: param,
                            element: elem,
                            name: match[0],
                            value: attr.value,
                            priority: type in priorityMap ? priorityMap[type] : type.charCodeAt(0) * 10 + (Number(param) || 0)
                        }

                        if (type === "if" && param.indexOf("loop") > -1) {
                            binding.priority += 100
                        }
                        if (type === "widget") {
                            bindings.push(binding)
                            elem.msData = elem.msData || msData
                        } else if (vmodels.length) {
                            bindings.push(binding)
                        }
                    }
                }
            }
        }
        bindings.sort(function(a, b) {
            return a.priority - b.priority
        })
        if (msData["vm-checked"] && msData["vm-duplex"]) {
            log("warning!һ��Ԫ���ϲ���ͬʱ����vm-checked��vm-duplex")
        }
        var firstBinding = bindings[0] || {}
        switch (firstBinding.type) {
            case "if":
            case "repeat":
                executeBindings([firstBinding], vmodels)
                break
            default:
                executeBindings(bindings, vmodels)
                if (!stopScan[elem.tagName] && rbind.test(elem.innerHTML)) {
                    scanNodes(elem, vmodels) //ɨ������Ԫ��
                }
                break;
        }

        if (elem.patchRepeat) {
            elem.patchRepeat()
            elem.patchRepeat = null
        }

    }
    //IE67�£���ѭ�����У�һ���ڵ������ͨ��cloneNode�õ����Զ������Ե�specifiedΪfalse���޷���������ķ�֧��
    //���������ȥ��scanAttr�е�attr.specified��⣬һ��Ԫ�ػ���80+�����Խڵ㣨��Ϊ�������ֹ����������Զ������ԣ��������׿���ҳ��
    if (!"1" [0]) {
        var cacheAttr = createCache(512)
        var rattrs = /\s+(vm-[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
            rquote = /^['"]/,
            rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i
        var getAttributes = function(elem) {
            if (elem.outerHTML.slice(0, 2) == "</") { //�����ʽIEģ��HTML5��Ԫ�ش�����α��ǩ
                return []
            }
            var str = elem.outerHTML.match(rtag)[0]
            var attributes = [],
                match,
                k, v;
            if (cacheAttr[str]) {
                return cacheAttr[str]
            }
            while (k = rattrs.exec(str)) {
                v = k[2]
                var name = k[1].toLowerCase()
                match = name.match(rmsAttr)
                var binding = {
                    name: name,
                    specified: true,
                    value: v ? rquote.test(v) ? v.slice(1, -1) : v : ""
                }
                attributes.push(binding)
            }
            return cacheAttr(str, attributes)
        }
    }

    function executeBindings(bindings, vmodels) {
        for (var i = 0, data; data = bindings[i++]; ) {
            data.vmodels = vmodels
            bindingHandlers[data.type](data, vmodels)

            if (data.evaluator && data.name) { //�Ƴ����ݰ󶨣���ֹ�����ν���
                //chromeʹ��removeAttributeNode�Ƴ������ڵ����Խڵ�ʱ�ᱨ�� https://github.com/RubyLouvre/avalon/issues/99
                data.element.removeAttribute(data.name)
            }
        }
        bindings.length = 0
    }


    var rfilters = /\|\s*(\w+)\s*(\([^)]*\))?/g,
        r11a = /\|\|/g,
        r11b = /U2hvcnRDaXJjdWl0/g

    function scanExpr(str) {
        var tokens = [],
            value, start = 0,
            stop
        do {
            stop = str.indexOf(openTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { // {{ ��ߵ��ı�
                tokens.push({
                    value: value,
                    expr: false
                })
            }
            start = stop + openTag.length
            stop = str.indexOf(closeTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { //����{{ }}��ֵ���ʽ
                var leach = []
                if (value.indexOf("|") > 0) { // ��ȡ������ ���滻�����ж�·��
                    value = value.replace(r11a, "U2hvcnRDaXJjdWl0") //btoa("ShortCircuit")
                    value = value.replace(rfilters, function(c, d, e) {
                        leach.push(d + (e || ""))
                        return ""
                    })
                    value = value.replace(r11b, "||") //��ԭ��·��
                }
                tokens.push({
                    value: value,
                    expr: true,
                    filters: leach.length ? leach : void 0
                })
            }
            start = stop + closeTag.length
        } while (1)
        value = str.slice(start)
        if (value) { //}} �ұߵ��ı�
            tokens.push({
                value: value,
                expr: false
            })
        }

        return tokens
    }
    /*********************************************************************
     *                          ����ģ��                                  *
     **********************************************************************/

    var keywords =
        // �ؼ���
        "break,case,catch,continue,debugger,default,delete,do,else,false" + ",finally,for,function,if,in,instanceof,new,null,return,switch,this" + ",throw,true,try,typeof,var,void,while,with"
            // ������
            + ",abstract,boolean,byte,char,class,const,double,enum,export,extends" + ",final,float,goto,implements,import,int,interface,long,native" + ",package,private,protected,public,short,static,super,synchronized" + ",throws,transient,volatile"

            // ECMA 5 - use strict
            + ",arguments,let,yield"

            + ",undefined"
    var rrexpstr = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g
    var rsplit = /[^\w$]+/g
    var rkeywords = new RegExp(["\\b" + keywords.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g')
    var rnumber = /\b\d[^,]*/g
    var rcomma = /^,+|,+$/g
    var getVariables = function(code) {
        code = code
            .replace(rrexpstr, "")
            .replace(rsplit, ",")
            .replace(rkeywords, "")
            .replace(rnumber, "")
            .replace(rcomma, "")

        return code ? code.split(/,+/) : []
    }

    //��Ӹ�ֵ���

    function addAssign(vars, scope, name, duplex) {
        var ret = [],
            prefix = " = " + name + "."
        for (var i = vars.length, prop; prop = vars[--i]; ) {
            if (scope.hasOwnProperty && scope.hasOwnProperty(prop)) { //IE6�½ڵ�û��hasOwnProperty
                ret.push(prop + prefix + prop)
                if (duplex === "duplex") {
                    vars.get = name + "." + prop
                }
                vars.splice(i, 1)
            }
        }
        return ret
    }

    function uniqArray(arr, vm) {
        var length = arr.length
        if (length <= 1) {
            return arr
        } else if (length === 2) {
            return arr[0] !== arr[1] ? arr : [arr[0]]
        }
        var uniq = {}
        return arr.filter(function(el) {
            var key = vm ? el && el.$id : el
            if (!uniq[key]) {
                uniq[key] = 1
                return true
            }
            return false
        })
    }
    //������ֵ�������Ա�������

    function createCache(maxLength) {
        var keys = []

        function cache(key, value) {
            if (keys.push(key) > maxLength) {
                delete cache[keys.shift()]
            }
            return cache[key] = value;
        }
        return cache;
    }
    var cacheExpr = createCache(256)
    //ȡ����ֵ�������䴫��
    var rduplex = /\w\[.*\]|\w\.\w/
    var rproxy = /(\$proxy\$[a-z]+)\d+$/
    function parseExpr(code, scopes, data, four) {
        var dataType = data.type
        var filters = dataType == "html" || dataType === "text" ? data.filters : ""
        var exprId = scopes.map(function(el) {
            return el.$id.replace(rproxy, "$1")
        }) + code + dataType + filters
        var vars = getVariables(code),
            assigns = [],
            names = [],
            args = [],
            prefix = ""
        //args ��һ���������飬 names �ǽ�Ҫ���ɵ���ֵ�����Ĳ���
        vars = uniqArray(vars), scopes = uniqArray(scopes, 1)
        for (var i = 0, sn = scopes.length; i < sn; i++) {
            if (vars.length) {
                var name = "vm" + expose + "_" + i
                names.push(name)
                args.push(scopes[i])
                assigns.push.apply(assigns, addAssign(vars, scopes[i], name, four))
            }
        }
        //---------------args----------------
        if (filters) {
            args.push(avalon.filters)
        }
        data.args = args
        //---------------cache----------------
        var fn = cacheExpr[exprId] //ֱ�Ӵӻ��棬����ظ�����
        if (fn) {
            data.evaluator = fn
            return
        }
        var prefix = assigns.join(", ")
        if (prefix) {
            prefix = "var " + prefix
        }
        if (filters) {//�ı��󶨣�˫���󶨲��й�����
            code = "\nvar ret" + expose + " = " + code
            var textBuffer = [],
                fargs
            textBuffer.push(code, "\r\n")
            for (var i = 0, fname; fname = data.filters[i++]; ) {
                var start = fname.indexOf("(")
                if (start !== -1) {
                    fargs = fname.slice(start + 1, fname.lastIndexOf(")")).trim()
                    fargs = "," + fargs
                    fname = fname.slice(0, start).trim()
                } else {
                    fargs = ""
                }
                textBuffer.push(" if(filters", expose, ".", fname, "){\n\ttry{\nret", expose,
                    " = filters", expose, ".", fname, "(ret", expose, fargs, ")\n\t}catch(e){} \n}\n")
            }
            code = textBuffer.join("")
            code += "\nreturn ret" + expose
            names.push("filters" + expose)
        } else if (dataType === "duplex") {//˫����
            var _body = "'use strict';\nreturn function(vvv){\n\t" +
                prefix +
                ";\n\tif(!arguments.length){\n\t\treturn " +
                code +
                "\n\t}\n\t" + (!rduplex.test(code) ? vars.get : code) +
                "= vvv;\n} "
            try {
                fn = Function.apply(noop, names.concat(_body))
                data.evaluator = cacheExpr(exprId, fn)
            } catch (e) {
            }
            return
        } else if (dataType === "on") {//�¼���
            code = code.replace("(", ".call(this,")
            if (four === "$event") {
                names.push(four)
            }
            code = "\nreturn " + code + ";" //IEȫ�� Function("return ")������ҪFunction("return ;")
            var lastIndex = code.lastIndexOf("\nreturn")
            var header = code.slice(0, lastIndex)
            var footer = code.slice(lastIndex)
            code = header + "\nif(avalon.openComputedCollect) return ;" + footer
        } else {//������
            code = "\nreturn " + code + ";" //IEȫ�� Function("return ")������ҪFunction("return ;")
        }
        try {
            fn = Function.apply(noop, names.concat("'use strict';\n" + prefix + code))
            if (data.type !== "on") {
                fn.apply(fn, args)
            }
            data.evaluator = cacheExpr(exprId, fn)
        } catch (e) {
            log("Debug:" + e.message)
        } finally {
            vars = textBuffer = names = null //�ͷ��ڴ�
        }
    }

    //parseExpr���������ô���

    function parseExprProxy(code, scopes, data, tokens) {
        if (Array.isArray(tokens)) {
            var array = tokens.map(function(token) {
                var tmpl = {}
                return token.expr ? parseExpr(token.value, scopes, tmpl) || tmpl : token.value
            })
            data.evaluator = function() {
                var ret = ""
                for (var i = 0, el; el = array[i++]; ) {
                    ret += typeof el === "string" ? el : el.evaluator.apply(0, el.args)
                }
                return ret
            }
            data.args = []
        } else {
            parseExpr(code, scopes, data, tokens)
        }
        if (data.evaluator) {
            data.handler = bindingExecutors[data.handlerName || data.type]
            data.evaluator.toString = function() {
                return data.type + " binding to eval(" + code + ")"
            }
            //�������
            //����ǳ���Ҫ,����ͨ���ж���ͼˢ�º�����element�Ƿ���DOM������
            //�����Ƴ��������б�
            registerSubscriber(data)
        }
    }
    avalon.parseExprProxy = parseExprProxy
    /*********************************************************************
     *��ģ�飨ʵ�֡��������ݼ�����DOM���Ĺؼ�����DOM���������ǰ�˿�����Ա����Ұ���������ɿ�����д���������Աר����ҵ���� *                                 *
     **********************************************************************/
    /*
    var cacheDisplay = oneObject("a,abbr,b,span,strong,em,font,i,kbd", "inline")
    avalon.mix(cacheDisplay, oneObject("div,h1,h2,h3,h4,h5,h6,section,p", "block"))

    function parseDisplay(nodeName, val) {
        //����ȡ�ô����ǩ��Ĭ��displayֵ
        nodeName = nodeName.toLowerCase()
        if (!cacheDisplay[nodeName]) {
            var node = DOC.createElement(nodeName)
            root.appendChild(node)
            if (window.getComputedStyle) {
                val = window.getComputedStyle(node, null).display
            } else {
                val = node.currentStyle.display
            }
            root.removeChild(node)
            cacheDisplay[nodeName] = val
        }
        return cacheDisplay[nodeName]
    }
    avalon.parseDisplay = parseDisplay
    */
    var parseDisplay = avalon.parseDisplay
    var supportDisplay = (function(td) {
        return window.getComputedStyle ?
            window.getComputedStyle(td, null).display === "table-cell" : true
    })(DOC.createElement("td"))
    var domParser = DOC.createElement("div")
    domParser.setAttribute("className", "t")
    var fuckIEAttr = domParser.className === "t"
    var propMap = {
        "class": "className",
        "for": "htmlFor"
    }
    var rdash = /\(([^)]*)\)/

    var styleEl = '<style id="avalonStyle">.avalonHide{ display: none!important }</style>'
    styleEl = avalon.parseHTML(styleEl).firstChild //IE6-8 head��ǩ��innerHTML��ֻ����
    head.insertBefore(styleEl, null) //����IE6 base��ǩBUG
    var rnoscripts = /<noscript.*?>(?:[\s\S]+?)<\/noscript>/img
    var rnoscriptText = /<noscript.*?>([\s\S]+?)<\/noscript>/im

    var getXHR = function() {
        return new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP")
    }
    var getBindingCallback = function(elem, name, vmodels) {
        var callback = elem.getAttribute(name)
        if (callback) {
            for (var i = 0, vm; vm = vmodels[i++]; ) {
                if (vm.hasOwnProperty(callback) && typeof vm[callback] === "function") {
                    return vm[callback]
                }
            }
        }
    }
    var includeContents = {}
    var ifSanctuary = DOC.createElement("div")
    ifSanctuary.innerHTML = "a"
/*
    try {
        ifSanctuary.contains(ifSanctuary.firstChild)
        avalon.contains = function(a, b) {
            return a.contains(b)
        }
    } catch (e) {
        avalon.contains = fixContains
    }
*/
    //����ĺ���ÿ��VM�����ı�󣬶��ᱻִ�У�������ΪnotifySubscribers��
    var bindingExecutors = avalon.bindingExecutors = {
        "attr": function(val, elem, data) {
            var method = data.type,
                attrName = data.param
            if (method === "css") {
                avalon(elem).css(attrName, val)
            } else if (method === "attr") {
                // vm-attr-class="xxx" vm.xxx="aaa bbb ccc"��Ԫ�ص�className����Ϊaaa bbb ccc
                // vm-attr-class="xxx" vm.xxx=false  ���Ԫ�ص���������
                // vm-attr-name="yyy"  vm.yyy="ooo" ΪԪ������name����
                var toRemove = (val === false) || (val === null) || (val === void 0)
                if (toRemove)
                    elem.removeAttribute(attrName)
                if (fuckIEAttr && attrName in propMap) {
                    attrName = propMap[attrName]
                    if (toRemove) {
                        elem.removeAttribute(attrName)
                    } else {
                        elem[attrName] = val
                    }
                } else if (!toRemove) {
                    elem.setAttribute(attrName, val)
                }
            } else if (method === "include" && val) {
                var vmodels = data.vmodels
                var rendered = getBindingCallback(elem, "data-include-rendered", vmodels)
                var loaded = getBindingCallback(elem, "data-include-loaded", vmodels)

                function scanTemplate(text) {
                    if (loaded) {
                        text = loaded.apply(elem, [text].concat(vmodels))
                    }
                    avalon.innerHTML(elem, text)
                    scanNodes(elem, vmodels)
                    rendered && checkScan(elem, function() {
                        rendered.call(elem)
                    })
                }
                if (data.param === "src") {
                    if (includeContents[val]) {
                        scanTemplate(includeContents[val])
                    } else {
                        var xhr = getXHR()
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                var s = xhr.status
                                if (s >= 200 && s < 300 || s === 304 || s === 1223) {
                                    scanTemplate(includeContents[val] = xhr.responseText)
                                }
                            }
                        }
                        xhr.open("GET", val, true)
                        if ("withCredentials" in xhr) {
                            xhr.withCredentials = true
                        }
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
                        xhr.send(null)
                    }
                } else {
                    //IEϵ���빻�µı�׼�����֧��ͨ��IDȡ��Ԫ�أ�firefox14+��
                    //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
                    var el = val && val.nodeType == 1 ? val : DOC.getElementById(val)
                    if (el) {
                        if (el.tagName === "NOSCRIPT" && !(el.innerHTML || el.fixIE78)) { //IE7-8 innerText,innerHTML���޷�ȡ�������ݣ�IE6��ȡ����innerHTML
                            var xhr = getXHR() //IE9-11��chrome��innerHTML��õ�ת������ݣ����ǵ�innerText����
                            xhr.open("GET", location, false) //ллNodejs ����Ⱥ ����-�����鹹
                            xhr.send(null)
                            //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
                            var noscripts = DOC.getElementsByTagName("noscript")
                            var array = (xhr.responseText || "").match(rnoscripts) || []
                            var n = array.length
                            for (var i = 0; i < n; i++) {
                                var tag = noscripts[i]
                                if (tag) { //IE6-8��noscript��ǩ��innerHTML,innerText��ֻ����
                                    tag.style.display = "none" //http://haslayout.net/css/noscript-Ghost-Bug
                                    tag.fixIE78 = (array[i].match(rnoscriptText) || ["", "&nbsp;"])[1]
                                }
                            }
                        }
                        avalon.nextTick(function() {
                            scanTemplate(el.fixIE78 || el.innerText || el.innerHTML)
                        })
                    }
                }
            } else {
                if (!root.hasAttribute && typeof val === "string" && (method === "src" || method === "href")) {
                    val = val.replace(/&amp;/g, "&") //����IE67�Զ�ת�������
                }
                elem[method] = val
            }
        },
        "class": function(val, elem, data) {
            var $elem = avalon(elem),
                method = data.type
            if (method === "class" && data.param) { //����Ǿɷ��
                $elem.toggleClass(data.param, !!val)
            } else {
                var toggle = data._evaluator ? !!data._evaluator.apply(elem, data._args) : true
                var className = data._class || val
                switch (method) {
                    case "class":
                        if (toggle && data.oldClass) {
                            $elem.removeClass(data.oldClass)
                        }
                        $elem.toggleClass(className, toggle)
                        data.oldClass = className
                        break;
                    case "hover":
                    case "active":
                        if (!data.init) { //ȷ��ֻ��һ��
                            if (method === "hover") { //���Ƴ�����ʱ�л�����
                                var event1 = "mouseenter",
                                    event2 = "mouseleave"
                            } else { //�ھ۽�ʧ�����л�����
                                elem.tabIndex = elem.tabIndex || -1
                                event1 = "mousedown", event2 = "mouseup"
                                $elem.bind("mouseleave", function() {
                                    toggle && $elem.removeClass(className)
                                })
                            }
                            $elem.bind(event1, function() {
                                toggle && $elem.addClass(className)
                            })
                            $elem.bind(event2, function() {
                                toggle && $elem.removeClass(className)
                            })
                            data.init = 1
                        }
                        break;
                }
            }
        },
        "data": function(val, elem, data) {
            var key = "data-" + data.param
            if (val && typeof val === "object") {
                elem[key] = val
            } else {
                elem.setAttribute(key, String(val))
            }
        },
        "checked": function(val, elem, data) {
            var name = data.type;
            if (name === "enabled") {
                elem.disabled = !val
            } else {
                var propName = name === "readonly" ? "readOnly" : name
                elem[propName] = !!val
            }
        },
        "each": function(method, pos, el) {
            if (method) {
                var data = this
                var group = data.group
                var pp = data.startRepeat && data.startRepeat.parentNode
                if (pp) { //fix  #300 #307
                    data.parent = pp
                }
                var parent = data.parent
                var proxies = data.proxies
                if (method === "del" || method === "move") {
                    var locatedNode = getLocatedNode(parent, data, pos)
                }
                switch (method) {
                    case "add": //��posλ�ú����el���飨posΪ���֣�elΪ���飩
                        var arr = el
                        var last = data.getter().length - 1
                        var transation = documentFragment.cloneNode(false)
                        var spans = [],
                            lastFn = {}
                        for (var i = 0, n = arr.length; i < n; i++) {
                            var ii = i + pos
                            var proxy = createEachProxy(ii, arr[i], data, last)
                            proxies.splice(ii, 0, proxy)
                            lastFn = shimController(data, transation, spans, proxy)
                        }
                        locatedNode = getLocatedNode(parent, data, pos)
                        lastFn.node = locatedNode
                        lastFn.parent = parent
                        parent.insertBefore(transation, locatedNode)
                        for (var i = 0, node; node = spans[i++]; ) {
                            scanTag(node, data.vmodels)
                        }
                        spans = null
                        break
                    case "del": //��pos���el��Ԫ��ɾ��(pos, el��������)
                        proxies.splice(pos, el) //�Ƴ���Ӧ����VM
                        removeFromSanctuary(removeView(locatedNode, group, el))
                        break
                    case "index": //��proxies�еĵ�pos���������Ԫ������������posΪ���֣�el����ѭ��������
                        var last = proxies.length - 1
                        for (; el = proxies[pos]; pos++) {
                            el.$index = pos
                            el.$first = pos === 0
                            el.$last = pos === last
                        }
                        break
                    case "clear":
                        var deleteFragment = documentFragment.cloneNode(false)
                        if (data.startRepeat) {
                            while (true) {
                                var node = data.startRepeat.nextSibling
                                if (node && node !== data.endRepeat) {
                                    deleteFragment.appendChild(node)
                                } else {
                                    break
                                }
                            }
                        } else {
                            while (parent.firstChild) {
                                deleteFragment.appendChild(parent.firstChild)
                            }
                        }
                        removeFromSanctuary(deleteFragment)
                        proxies.length = 0
                        break
                    case "move": //��proxies�еĵ�pos��Ԫ���ƶ�elλ����(pos, el��������)
                        var t = proxies.splice(pos, 1)[0]
                        if (t) {
                            proxies.splice(el, 0, t)
                            var moveNode = removeView(locatedNode, group)
                            locatedNode = getLocatedNode(parent, data, el)
                            parent.insertBefore(moveNode, locatedNode)
                        }
                        break
                    case "set": //��proxies�еĵ�pos��Ԫ�ص�VM����Ϊel��posΪ���֣�el���⣩
                        var proxy = proxies[pos]
                        if (proxy) {
                            proxy[proxy.$itemName] = el
                        }
                        break
                    case "append": //��pos�ļ�ֵ�Դ�el��ȡ����posΪһ����ͨ����elΪԤ�����ɺõĴ���VM����أ�
                        var pool = el
                        var transation = documentFragment.cloneNode(false)
                        var callback = getBindingCallback(data.callbackElement, "data-with-sorted", data.vmodels)
                        var keys = [],
                            spans = [],
                            lastFn = {}
                        for (var key in pos) { //�õ����м���
                            if (pos.hasOwnProperty(key) && key !== "hasOwnProperty") {
                                keys.push(key)
                            }
                        }
                        if (callback) { //����лص���������������
                            var keys2 = callback.call(parent, keys)
                            if (keys2 && Array.isArray(keys2) && keys2.length) {
                                keys = keys2
                            }
                        }
                        for (var i = 0, key; key = keys[i++]; ) {
                            if (key !== "hasOwnProperty") {
                                lastFn = shimController(data, transation, spans, pool[key])
                            }
                        }
                        lastFn.parent = parent
                        lastFn.node = data.endRepeat || null
                        parent.insertBefore(transation, lastFn.node)
                        for (var i = 0, el; el = spans[i++]; ) {
                            scanTag(el, data.vmodels)
                        }
                        spans = null
                        break
                }
                iteratorCallback.call(data, arguments)
            }
        },
        "html": function(val, elem, data) {
            val = val == null ? "" : val
            if (!elem) {
                elem = data.element = data.node.parentNode
            }
            if (data.replaceNodes) {
                var fragment, nodes
                if (val.nodeType === 11) {
                    fragment = val
                } else if (val.nodeType === 1 || val.item) {
                    nodes = val.nodeType === 1 ? val.childNodes : val.item ? val : []
                    fragment = documentFragment.cloneNode(true)
                    while (nodes[0]) {
                        fragment.appendChild(nodes[0])
                    }
                } else {
                    fragment = avalon.parseHTML(val)
                }
                var replaceNodes = avalon.slice(fragment.childNodes)
                elem.insertBefore(fragment, data.replaceNodes[0] || null) //fix IE6-8 insertBefore�ĵ�2������ֻ��Ϊ�ڵ��null
                for (var i = 0, node; node = data.replaceNodes[i++]; ) {
                    elem.removeChild(node)
                }
                data.replaceNodes = replaceNodes
            } else {
                avalon.innerHTML(elem, val)
            }
            avalon.nextTick(function() {
                scanNodes(elem, data.vmodels)
            })
        },
        "if": function(val, elem, data) {
            var placehoder = data.placehoder
            if (val) { //���DOM��
                if (!data.msInDocument) {
                    data.msInDocument = true
                    try {
                        placehoder.parentNode.replaceChild(elem, placehoder)
                    } catch (e) {
                        avalon.log("Debug: vm-if  " + e.message)
                    }
                }
                if (rbind.test(elem.outerHTML)) {
                    scanAttr(elem, data.vmodels)
//                    if (data.param.indexOf("once") >= 0) {
//                        data.handler = noop
//                    }
                }
            } else { //�Ƴ�DOM�����Ž�ifSanctuary DIV�У�����ע�ͽڵ�ռ��ԭλ��

                if (data.msInDocument) {
                    data.msInDocument = false
                    elem.parentNode.replaceChild(placehoder, elem)
                    placehoder.elem = elem
                    ifSanctuary.appendChild(elem)
                }
            }
        },
        "on": function(callback, elem, data) {
            var fn = data.evaluator
            var args = data.args
            var vmodels = data.vmodels
            if (!data.hasArgs) {
                callback = function(e) {
                    return fn.apply(0, args).call(this, e)
                }
            } else {
                callback = function(e) {
                    return fn.apply(this, args.concat(e))
                }
            }
            elem.$vmodel = vmodels[0]
            elem.$vmodels = vmodels
            if (typeof data.specialBind === "function") {
                data.specialBind(elem, callback)
            } else {
                var removeFn = avalon.bind(elem, data.param, callback)
            }
            data.rollback = function() {
                if (typeof data.specialUnbind === "function") {
                    data.specialUnbind()
                } else {
                    avalon.unbind(elem, data.param, removeFn)
                }
            }
            data.evaluator = data.handler = noop
        },
        "text": function(val, elem, data) {
            val = val == null ? "" : val //����ҳ������ʾundefined null
            if (data.nodeType === 3) { //�����ı��ڵ���
                data.node.data = val
            } else { //�������Խڵ���
                if (!elem) {
                    elem = data.element = data.node.parentNode
                }
                if ("textContent" in elem) {
                    elem.textContent = val
                } else {
                    elem.innerText = val
                }
            }
        },
        "visible": function(val, elem, data) {
            elem.style.display = val ? data.display : "none"
        },
        "widget": noop
    }
    var rwhitespace = /^\s+$/
    //����ĺ���ֻ���ڵ�һ�α�ɨ���ִ��һ�Σ����Ž��ж�ӦVM���Ե�subscribers�����ڣ�������ΪregisterSubscriber��
    var bindingHandlers = avalon.bindingHandlers = {
        //����һ���ַ������԰󶨵ķ���, ��������title, alt,  src, href, include, css��Ӳ�ֵ���ʽ
        //<a vm-href="{{url.hostname}}/{{url.pathname}}.html">
        "attr": function(data, vmodels) {
            var text = data.value.trim(),
                simple = true
            if (text.indexOf(openTag) > -1 && text.indexOf(closeTag) > 2) {
                simple = false
                if (rexpr.test(text) && RegExp.rightContext === "" && RegExp.leftContext === "") {
                    simple = true
                    text = RegExp.$1
                }
            }
            data.handlerName = "attr" //handleName���ڴ�����ְ󶨹���ͬһ��bindingExecutor�����
            parseExprProxy(text, vmodels, data, (simple ? null : scanExpr(data.value)))
        },
        "checked": function(data, vmodels) {
            data.handlerName = "checked"
            parseExprProxy(data.value, vmodels, data)
        },
        //����VM������ֵ����ʽ��ֵ�л�������vm-class="xxx yyy zzz:flag" 
        //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
        "class": function(data, vmodels) {
            var oldStyle = data.param,
                text = data.value,
                rightExpr
            data.handlerName = "class"
            if (!oldStyle || isFinite(oldStyle)) {
                data.param = "" //ȥ������
                var noExpr = text.replace(rexprg, function(a) {
                    return Math.pow(10, a.length - 1) //����ֵ���ʽ����10��N-1�η���ռλ
                })
                var colonIndex = noExpr.indexOf(":") //ȡ�õ�һ��ð�ŵ�λ��
                if (colonIndex === -1) { // ���� vm-class="aaa bbb ccc" �����
                    var className = text
                } else { // ���� vm-class-1="ui-state-active:checked" ����� 
                    className = text.slice(0, colonIndex)
                    rightExpr = text.slice(colonIndex + 1)
                    parseExpr(rightExpr, vmodels, data) //��������ӻ���ɾ��
                    if (!data.evaluator) {
                        log("Debug: vm-class '" + (rightExpr || "").trim() + "' ��������VM��")
                        return false
                    } else {
                        data._evaluator = data.evaluator
                        data._args = data.args
                    }
                }
                var hasExpr = rexpr.test(className) //����vm-class="width{{w}}"�����
                if (!hasExpr) {
                    data._class = className
                }
                parseExprProxy("", vmodels, data, (hasExpr ? scanExpr(className) : null))
            } else if (data.type === "class") {
                parseExprProxy(text, vmodels, data)
            }
        },
        "duplex": function(data, vmodels) {
            var elem = data.element,
                tagName = elem.tagName
            if (typeof modelBinding[tagName] === "function") {
                data.changed = getBindingCallback(elem, "data-duplex-changed", vmodels) || noop
                //����������⣬���پ���parseExprProxy
                parseExpr(data.value, vmodels, data, "duplex")
                if (data.evaluator && data.args) {
                    var form = elem.form
                    if (form && form.msValidate) {
                        form.msValidate(elem)
                    }
                    modelBinding[elem.tagName](elem, data.evaluator.apply(null, data.args), data)
                }
            }
        },
        "each": function(data, vmodels) {
            var type = data.type,
                elem = data.element,
                list
            parseExpr(data.value, vmodels, data)
            data.getter = function() {
                return this.evaluator.apply(0, this.args || [])
            }
            data.handler = bindingExecutors.each
            data.callbackName = "data-" + (type || "each") + "-rendered"
            if (type !== "repeat") {
                avalon.log("Warning:����ʹ��vm-repeat����vm-each, vm-with, vm-repeatֻռ��һ����ǩ�������ܸ���")
            }
            data.callbackElement = data.parent = elem
            var freturn = true
            try {
                list = data.getter()
                if (rchecktype.test(getType(list))) {
                    freturn = false
                }
            } catch (e) {
            }
            var check0 = "$key",
                check1 = "$val"
            if (Array.isArray(list)) {
                check0 = "$first"
                check1 = "$last"
            }
            for (var i = 0, p; p = vmodels[i++]; ) {
                if (p.hasOwnProperty(check0) && p.hasOwnProperty(check1)) {
                    data.$outer = p
                    break
                }
            }
            data.$outer = data.$outer || {}
            var template = documentFragment.cloneNode(false)
            if (type === "repeat") {
                var startRepeat = DOC.createComment("vm-repeat-start")
                var endRepeat = DOC.createComment("vm-repeat-end")
                data.element = data.parent = elem.parentNode
                data.startRepeat = startRepeat
                data.endRepeat = endRepeat
                elem.removeAttribute(data.name)
                data.parent.replaceChild(endRepeat, elem)
                data.parent.insertBefore(startRepeat, endRepeat)
                template.appendChild(elem)
            } else {
                var node
                while (node = elem.firstChild) {
                    if (node.nodeType === 3 && rwhitespace.test(node.data)) {
                        elem.removeChild(node)
                    } else {
                        template.appendChild(node)
                    }
                }
            }
            data.proxies = []
            data.template = template
            node = template.firstChild
            data.fastRepeat = node.nodeType === 1 && template.lastChild === node && !node.attributes["vm-controller"] && !node.attributes["vm-important"]
            if (freturn) {
                return
            }
            list[subscribers] && list[subscribers].push(data)
            if (!Array.isArray(list) && type !== "each") {
                var pool = withProxyPool[list.$id]
                if (!pool) {
                    withProxyCount++
                    pool = withProxyPool[list.$id] = {}
                    for (var key in list) {
                        if (list.hasOwnProperty(key) && key !== "hasOwnProperty") {
                            (function(k, v) {
                                pool[k] = createWithProxy(k, v, data.$outer)
                                pool[k].$watch("$val", function(val) {
                                    list[k] = val //#303
                                })
                            })(key, list[key])
                        }
                    }
                }
                data.rollback = function() {
                    bindingExecutors.each.call(data, "clear")
                    var endRepeat = data.endRepeat
                    var parent = data.parent
                    parent.insertBefore(data.template, endRepeat || null)
                    if (endRepeat) {
                        parent.removeChild(endRepeat)
                        parent.removeChild(data.startRepeat)
                        data.element = data.callbackElement
                    }
                }
                data.handler("append", list, pool)
            } else {
                data.handler("add", 0, list)
            }
        },
        "html": function(data, vmodels) {
            parseExprProxy(data.value, vmodels, data)
        },
        "if": function(data, vmodels) {
            var elem = data.element
            elem.removeAttribute(data.name)
            if (!data.placehoder) {
                data.msInDocument = data.placehoder = DOC.createComment("vm-if")
            }
            data.vmodels = vmodels
            parseExprProxy(data.value, vmodels, data)

        },
        "on": function(data, vmodels) {
            var value = data.value,
                four = "$event"
            if (value.indexOf("(") > 0 && value.indexOf(")") > -1) {
                var matched = (value.match(rdash) || ["", ""])[1].trim()
                if (matched === "" || matched === "$event") { // aaa() aaa($event)����aaa����
                    four = void 0
                    value = value.replace(rdash, "")
                }
            } else {
                four = void 0
            }
            data.type = "on"
            data.hasArgs = four
            data.handlerName = "on"
            parseExprProxy(value, vmodels, data, four)
        },
        "visible": function(data, vmodels) {
            var elem = data.element
            if (!supportDisplay && !root.contains(elem)) { //fuck firfox ȫ�ң�
                var display = parseDisplay(elem.tagName)
            }
            display = display || avalon(elem).css("display")
            data.display = display === "none" ? parseDisplay(elem.tagName) : display
            parseExprProxy(data.value, vmodels, data)
        },
        "widget": function(data, vmodels) {
            var args = data.value.match(rword),
                element = data.element,
                widget = args[0],
                vmOptions = {}

            if (args[1] === "$") {
                args[1] = void 0
            }
            if (!args[1]) {
                args[1] = widget + setTimeout("1")
            }
            data.value = args.join(",")
            var constructor = avalon.ui[widget]
            if (typeof constructor === "function") { //vm-widget="tabs,tabsAAA,optname"
                vmodels = element.vmodels || vmodels
                for (var i = 0, v; v = vmodels[i++]; ) {
                    if (VMODELS[v.$id]) { //ȡ������������û������VM
                        var nearestVM = v
                        break
                    }
                }
                var optName = args[2] || widget //���Ի������������֣�û����ȡwidget������
                if (nearestVM && typeof nearestVM[optName] === "object") {
                    vmOptions = nearestVM[optName]
                    vmOptions = vmOptions.$model || vmOptions
                    var id = vmOptions[widget + "Id"]
                    if (typeof id === "string") {
                        args[1] = id
                    }
                }
                var widgetData = avalon.getWidgetData(element, args[0]) //��ȡdata-tooltip-text��data-tooltip-attr���ԣ����һ�����ö���
                data[widget + "Id"] = args[1]
                data[widget + "Options"] = avalon.mix({}, constructor.defaults, vmOptions, widgetData)
                element.removeAttribute("vm-widget")
                var widgetVM = constructor(element, data, vmodels)
                data.evaluator = noop
                var callback = getBindingCallback(element, "data-widget-defined", vmodels)
                if (callback) {
                    callback.call(element, widgetVM)
                }
            } else if (vmodels.length) { //����������û�м��أ���ô���浱ǰ��vmodels
                element.vmodels = vmodels
            }
            return true
        }
    }



    //============================ class preperty binding  =======================
    "hover,active".replace(rword, function(method) {
        bindingHandlers[method] = bindingHandlers["class"]
    })
    "with,repeat".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.each
    })
    //============================= boolean preperty binding =======================
    "disabled,enabled,readonly,selected".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.checked
    })
    bindingHandlers.data = bindingHandlers.text = bindingHandlers.html
    //============================= string preperty binding =======================
    //��href���� �÷����������ַ������Եİ���
    //���鲻Ҫֱ����src�������޸ģ������ᷢ����Ч��������ʹ��vm-src
    "title,alt,src,value,css,include,href".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.attr
    })
    //============================= model binding =======================
    //��ģ���е��ֶ���input, textarea��valueֵ������һ��
    var modelBinding = bindingHandlers.duplex
    //���һ��input��ǩ�����model�󶨡���ô����Ӧ���ֶν���Ԫ�ص�value������һ��
    //�ֶα䣬value�ͱ䣻value�䣬�ֶ�Ҳ���ű䡣Ĭ���ǰ�input�¼���
    modelBinding.INPUT = function(element, evaluator, data) {
        var fixType = data.param,
            type = element.type,
            callback = data.changed,
            $elem = avalon(element),
            removeFn

        if (type === "checkbox" && fixType === "radio") {
            type = "radio"
        }
        //��value�仯ʱ�ı�model��ֵ
        var updateVModel = function() {
            var val = element.oldValue = element.value
            if ($elem.data("duplex-observe") !== false) {
                evaluator(val)
                callback.call(element, val)
            }
        }
        //��model�仯ʱ,���ͻ�ı�value��ֵ
        data.handler = function() {
            var val = evaluator()
            if (val !== element.value) {
                element.value = val + ""
            }
        }
        if (type === "radio") {
            data.handler = function() {
                //IE6��ͨ��defaultChecked��ʵ�ִ�Ч��
                element.defaultChecked = (element.checked = /bool|text/.test(fixType) ? evaluator() + "" === element.value : !!evaluator())
            }
            updateVModel = function() {
                if ($elem.data("duplex-observe") !== false) {
                    var val = element.value
                    if (fixType === "text") {
                        evaluator(val)
                    } else if (fixType === "bool") {
                        val = val === "true"
                        evaluator(val)
                    } else {
                        val = !element.defaultChecked
                        evaluator(val)
                        element.checked = val
                    }
                    callback.call(element, val)
                }
            }
            removeFn = $elem.bind("click", updateVModel)
            data.rollback = function() {
                $elem.unbind("click", removeFn)
            }
        } else if (type === "checkbox") {
            updateVModel = function() {
                if ($elem.data("duplex-observe") !== false) {
                    var method = element.checked ? "ensure" : "remove"
                    var array = evaluator()
                    if (Array.isArray(array)) {
                        avalon.Array[method](array, element.value)
                    } else {
                        avalon.error("vm-duplexλ��checkboxʱҪ���Ӧһ������")
                    }
                    callback.call(element, array)
                }
            }
            data.handler = function() {
                var array = [].concat(evaluator()) //ǿ��ת��Ϊ����
                element.checked = array.indexOf(element.value) >= 0
            }
            removeFn = $elem.bind("click", updateVModel) //IE6-8
            data.rollback = function() {
                $elem.unbind("click", removeFn)
            }
        } else {
            var event = element.attributes["data-duplex-event"] || element.attributes["data-event"] || {}
            event = event.value
            if (event === "change") {
                avalon.bind(element, event, updateVModel)
            } else {
                if (W3C) { //��ִ��W3C
                    element.addEventListener("input", updateVModel)
                    data.rollback = function() {
                        element.removeEventListener("input", updateVModel)
                    }
                } else {
                    removeFn = function(e) {
                        if (e.propertyName === "value") {
                            updateVModel()
                        }
                    }
                    element.attachEvent("onpropertychange", removeFn)
                    data.rollback = function() {
                        element.detachEvent("onpropertychange", removeFn)
                    }
                }

                if (DOC.documentMode === 9) { // IE9 �޷����м���ͬ��VM
                    var selectionchange = function(e) {
                        if (e.type === "focus") {
                            DOC.addEventListener("selectionchange", updateVModel)
                        } else {
                            DOC.removeEventListener("selectionchange", updateVModel)
                        }
                    }
                    element.addEventListener("focus", selectionchange)
                    element.addEventListener("blur", selectionchange)
                    var rollback = data.rollback
                    data.rollback = function() {
                        rollback()
                        element.removeEventListener("focus", selectionchange)
                        element.removeEventListener("blur", selectionchange)
                    }
                }
            }
        }
        element.oldValue = element.value
        launch(element)
        registerSubscriber(data)
    }
    var TimerID, ribbon = [],
        launch = noop

    function ticker() {
        for (var n = ribbon.length - 1; n >= 0; n--) {
            var el = ribbon[n]
            if (avalon.contains(root, el)) {
                if (el.oldValue !== el.value) {
                    var event = DOC.createEvent("Event")
                    event.initEvent("input", true, true)
                    el.dispatchEvent(event)
                }
            } else {
                ribbon.splice(n, 1)
            }
        }
        if (!ribbon.length) {
            clearInterval(TimerID)
        }
    }

    function launchImpl(el) {
        if (ribbon.push(el) === 1) {
            TimerID = setInterval(ticker, 30)
        }
    }
    //http://msdn.microsoft.com/en-us/library/dd229916(VS.85).aspx
    //https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
    if (Object.getOwnPropertyNames) { //����IE8
        try {
            var inputProto = HTMLInputElement.prototype,
                oldSetter

            function newSetter(newValue) {
                oldSetter.call(this, newValue)
                if (newValue !== this.oldValue) {
                    var event = DOC.createEvent("Event")
                    event.initEvent("input", true, true)
                    this.dispatchEvent(event)
                }
            }
            oldSetter = Object.getOwnPropertyDescriptor(inputProto, "value").set //����chrome, safari,opera
            Object.defineProperty(inputProto, "value", {
                set: newSetter
            })
        } catch (e) {
            launch = launchImpl
        }
    }
    modelBinding.SELECT = function(element, evaluator, data, oldValue) {
        var $elem = avalon(element)
        function updateVModel() {
            if ($elem.data("duplex-observe") !== false) {
                var val = $elem.val() //�ַ������ַ�������
                if (val + "" !== oldValue) {
                    evaluator(val)
                    oldValue = val + ""
                }
                data.changed.call(element, val)
            }
        }
        data.handler = function() {
            var curValue = evaluator()
            curValue = curValue && curValue.$model || curValue
            curValue = Array.isArray(curValue) ? curValue.map(String) : curValue + ""
            if (curValue + "" !== oldValue) {
                $elem.val(curValue)
                oldValue = curValue + ""
            }
        }
        var removeFn = $elem.bind("change", updateVModel)
        data.rollback = function() {
            $elem.unbind("change", removeFn)
        }
        var innerHTML = NaN
        var id = setInterval(function() {
            var currHTML = element.innerHTML
            if (currHTML === innerHTML) {
                clearInterval(id)
                //�ȵȵ�select���optionԪ�ر�ɨ��󣬲Ÿ���model����selected����  
                registerSubscriber(data)
            } else {
                innerHTML = currHTML
            }
        }, 20)
    }
    modelBinding.TEXTAREA = modelBinding.INPUT
    //============================= event binding =======================

    /*
    var eventName = {
        AnimationEvent: 'animationend',
        WebKitAnimationEvent: 'webkitAnimationEnd'
    }
    for (var name in eventName) {
        if (/object|function/.test(typeof window[name])) {
            eventMap.animationend = eventName[name]
            break
        }
    }

    function fixEvent(event) {
        var ret = {}
        for (var i in event) {
            ret[i] = event[i]
        }
        var target = ret.target = event.srcElement
        if (event.type.indexOf("key") === 0) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode
        } else if (/mouse|click/.test(event.type)) {
            var doc = target.ownerDocument || DOC
            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
        }
        ret.timeStamp = new Date - 0
        ret.originalEvent = event
        ret.preventDefault = function() { //��ֹĬ����Ϊ
            event.returnValue = false
        }
        ret.stopPropagation = function() { //��ֹ�¼���DOM���еĴ���
            event.cancelBubble = true
        }
        return ret
    }
    */
    "animationend,blur,change,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scroll".
        replace(rword, function(name) {
            bindingHandlers[name] = function(data) {
                data.param = name
                bindingHandlers.on.apply(0, arguments)
            }
        })
    /*
    var oldBind = avalon.bind
    if (!("onmouseenter" in root)) { //fix firefox, chrome
        var events = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }
        avalon.bind = function(elem, type, fn) {
            if (events[type]) {
                return oldBind(elem, events[type], function(e) {
                    var t = e.relatedTarget
                    if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
                        delete e.type
                        e.type = type
                        return fn.call(elem, e)
                    }
                })
            } else {
                return oldBind(elem, type, fn)
            }
        }
    }
    if (!("oninput" in document.createElement("input"))) { //fix IE6-8
        avalon.bind = function(elem, type, fn) {
            if (type === "input") {
                return oldBind(elem, "propertychange", function(e) {
                    if (e.propertyName === "value") {
                        e.type = "input"
                        return fn.call(elem, e)
                    }
                })
            } else {
                return oldBind(elem, type, fn)
            }
        }
    }
    /*********************************************************************
     *          ������飨��vm-each, vm-repeat���ʹ�ã�                     *
     **********************************************************************/

    function Collection(model) {
        var array = []
        array.$id = generateID()
        array[subscribers] = []
        array.$model = model // model.concat()
        array.$events = {} //VB����ķ������this����ָ��������Ҫʹ��bind����һ��
        array._ = modelFactory({
            length: model.length
        })
        array._.$watch("length", function(a, b) {
            array.$fire("length", a, b)
        })
        for (var i in Observable) {
            array[i] = Observable[i]
        }
        avalon.mix(array, CollectionPrototype)
        return array
    }

    var _splice = ap.splice
    var CollectionPrototype = {
        _splice: _splice,
        _add: function(arr, pos) { //�ڵ�pos��λ���ϣ����һ��Ԫ��
            var oldLength = this.length
            pos = typeof pos === "number" ? pos : oldLength
            var added = []
            for (var i = 0, n = arr.length; i < n; i++) {
                added[i] = convert(arr[i])
            }
            _splice.apply(this, [pos, 0].concat(added))
            notifySubscribers(this, "add", pos, added)
            if (!this._stopFireLength) {
                return this._.length = this.length
            }
        },
        _del: function(pos, n) { //�ڵ�pos��λ���ϣ�ɾ��N��Ԫ��
            var ret = this._splice(pos, n)
            if (ret.length) {
                notifySubscribers(this, "del", pos, n)
                if (!this._stopFireLength) {
                    this._.length = this.length
                }
            }
            return ret
        },
        push: function() {
            ap.push.apply(this.$model, arguments)
            var n = this._add(arguments)
            notifySubscribers(this, "index", n > 2 ? n - 2 : 0)
            return n
        },
        unshift: function() {
            ap.unshift.apply(this.$model, arguments)
            var ret = this._add(arguments, 0) //���س���
            notifySubscribers(this, "index", arguments.length)
            return ret
        },
        shift: function() {
            var el = this.$model.shift()
            this._del(0, 1)
            notifySubscribers(this, "index", 0)
            return el //���ر��Ƴ���Ԫ��
        },
        pop: function() {
            var el = this.$model.pop()
            this._del(this.length - 1, 1)
            return el //���ر��Ƴ���Ԫ��
        },
        splice: function(a, b) {
            // ������ڵ�һ����������Ҫ����-1, Ϊ��ӻ�ɾ��Ԫ�صĻ���
            a = resetNumber(a, this.length)
            var removed = _splice.apply(this.$model, arguments),
                ret = []
            this._stopFireLength = true //ȷ������������� , $watch("length",fn)ֻ����һ��
            if (removed.length) {
                ret = this._del(a, removed.length)
                if (arguments.length <= 2) { //���û��ִ����Ӳ�������Ҫ�ֶ�resetIndex
                    notifySubscribers(this, "index", a)
                }
            }
            if (arguments.length > 2) {
                this._add(aslice.call(arguments, 2), a)
            }
            this._stopFireLength = false
            this._.length = this.length
            return ret //���ر��Ƴ���Ԫ��
        },
        contains: function(el) { //�ж��Ƿ����
            return this.indexOf(el) !== -1
        },
        size: function() { //ȡ�����鳤�ȣ������������ͬ����ͼ��length����
            return this._.length
        },
        remove: function(el) { //�Ƴ���һ�����ڸ���ֵ��Ԫ��
            var index = this.indexOf(el)
            if (index >= 0) {
                return this.removeAt(index)
            }
        },
        removeAt: function(index) { //�Ƴ�ָ�������ϵ�Ԫ��
            this.splice(index, 1)
        },
        clear: function() {
            this.$model.length = this.length = this._.length = 0 //�������
            notifySubscribers(this, "clear", 0)
            return this
        },
        removeAll: function(all) { //�Ƴ�N��Ԫ��
            if (Array.isArray(all)) {
                all.forEach(function(el) {
                    this.remove(el)
                }, this)
            } else if (typeof all === "function") {
                for (var i = this.length - 1; i >= 0; i--) {
                    var el = this[i]
                    if (all(el, i)) {
                        this.splice(i, 1)
                    }
                }
            } else {
                this.clear()
            }
        },
        ensure: function(el) {
            if (!this.contains(el)) { //ֻ�в����ڲ�push
                this.push(el)
            }
            return this
        },
        set: function(index, val) {
            if ( index >= 0 ) {
                var valueType = getType(val)
                if (val && val.$model) {
                    val = val.$model
                }
                var target = this[index]
                if (valueType === "object") {
                    for (var i in val) {
                        if (target.hasOwnProperty(i)) {
                            target[i] = val[i]
                        }
                    }
                } else if (valueType === "array") {
                    target.clear().push.apply(target, val)
                } else if (target !== val) {
                    this[index] = val
                    notifySubscribers(this, "set", index, val)
                }
            }
            return this
        }
    }
    "sort,reverse".replace(rword, function(method) {
        CollectionPrototype[method] = function() {
            var aaa = this.$model,
                bbb = aaa.slice(0),
                sorted = false
            ap[method].apply(aaa, arguments) //���ƶ�model
            for (var i = 0, n = bbb.length; i < n; i++) {
                var a = aaa[i],
                    b = bbb[i]
                if (!isEqual(a, b)) {
                    sorted = true
                    var index = getIndex(a, bbb, i)
                    var remove = this._splice(index, 1)[0]
                    var remove2 = bbb.splice(index, 1)[0]
                    this._splice(i, 0, remove)
                    bbb.splice(i, 0, remove2)
                    notifySubscribers(this, "move", index, i)
                }
            }
            bbb = void 0
            if (sorted) {
                notifySubscribers(this, "index", 0)
            }
            return this
        }
    })

    function convert(val) {
        var type = getType(val)
        if (rchecktype.test(type)) {
            val = val.$id ? val : modelFactory(val, val)
        }
        return val
    }

    //ȡ��el��array��λ��

    function getIndex(a, array, start) {
        for (var i = start, n = array.length; i < n; i++) {
            if (isEqual(a, array[i])) {
                return i
            }
        }
        return -1
    }
    //============ each/repeat/with binding �õ��ĸ������������ ======================
    //�õ�ĳһԪ�ؽڵ���ĵ���Ƭ�����µ�����ע�ͽڵ�
    var queryComments = DOC.createTreeWalker ? function(parent) {
        var tw = DOC.createTreeWalker(parent, NodeFilter.SHOW_COMMENT, null, null),
            comment, ret = []
        while (comment = tw.nextNode()) {
            ret.push(comment)
        }
        return ret
    } : function(parent) {
        return parent.getElementsByTagName("!")
    }
    //��ͨ��vm-if�Ƴ�DOM���Ž�ifSanctuary��Ԫ�ؽڵ��Ƴ������Ա���������

    function removeFromSanctuary(parent) {
        var comments = queryComments(parent)
        for (var i = 0, comment; comment = comments[i++]; ) {
            if (comment.nodeValue == "vm-if") {
                var msIfEl = comment.elem
                if (msIfEl.parentNode) {
                    msIfEl.parentNode.removeChild(msIfEl)
                }
            }
        }
        parent.textContent = ""
    }

    function iteratorCallback(args) {
        var callback = getBindingCallback(this.callbackElement, this.callbackName, this.vmodels)
        if (callback) {
            var parent = this.parent
            checkScan(parent, function() {
                callback.apply(parent, args)
            })
        }
    }
    //Ϊvm-each, vm-with, vm-repeatҪѭ����Ԫ�����һ��msloop��ʱ�ڵ㣬vm-controller��ֵΪ����VM��$id
    function shimController(data, transation, spans, proxy) {
        var tview = data.template.cloneNode(true)
        var id = proxy.$id
        var span = tview.firstChild
        if (!data.fastRepeat) {
            span = DOC.createElement("vmloop")
            span.style.display = "none"
            span.appendChild(tview)
        }
        span.setAttribute("vm-controller", id)
        spans.push(span)
        transation.appendChild(span)
        VMODELS[id] = proxy
        function fn() {
            delete VMODELS[id]
            data.group = 1
            if (!data.fastRepeat) {
                data.group = span.childNodes.length
                span.parentNode.removeChild(span)
                while (span.firstChild) {
                    transation.appendChild(span.firstChild)
                }
                if (fn.node !== void 0) {
                    fn.parent.insertBefore(transation, fn.node)
                }
            }
        }
        return span.patchRepeat = fn
    }
    // ȡ�����ڶ�λ�Ľڵ㡣�ڰ���vm-each, vm-with���Ե�Ԫ�����������innerHTML������Ϊһ����ģ�������Ƴ�DOM����
    // Ȼ���������Ԫ���ж��ٸ���vm-each�����ֵ���ж���˫��vm-with�����ͽ������ƶ��ٷ�(����ΪN)���پ���ɨ������²����Ԫ���С�
    // ��ʱ��Ԫ�صĺ��ӽ���ΪN�ȷ֣�ÿ�ȷݵĵ�һ���ڵ����������ڶ�λ�Ľڵ㣬
    // �������Ǹ�������������ȷֵĽڵ��ǣ�Ȼ�������Ƴ����ƶ����ǡ�

    function getLocatedNode(parent, data, pos) {
        if (data.startRepeat) {
            var ret = data.startRepeat,
                end = data.endRepeat
            pos += 1
            for (var i = 0; i < pos; i++) {
                ret = ret.nextSibling
                if (ret == end)
                    return end
            }
            return ret
        } else {
            return parent.childNodes[data.group * pos] || null
        }
    }

    function removeView(node, group, n) {
        var length = group * (n || 1)
        var view = documentFragment.cloneNode(false)
        while (--length >= 0) {
            var nextSibling = node.nextSibling
            view.appendChild(node)
            node = nextSibling
            if (!node) {
                break
            }
        }
        return view
    }
    // Ϊvm-each, vm-repeat����һ���������ͨ��������ʹ��һЩ����������빦�ܣ�$index,$first,$last,$remove,$key,$val,$outer��
    var watchEachOne = oneObject("$index,$first,$last")

    function createWithProxy(key, val, $outer) {
        var proxy = modelFactory({
            $key: key,
            $outer: $outer,
            $val: val
        }, 0, {
            $val: 1,
            $key: 1
        })
        proxy.$id = "$proxy$with" + Math.random()
        return proxy
    }

    function createEachProxy(index, item, data, last) {
        var param = data.param || "el"
        var source = {
            $index: index,
            $itemName: param,
            $outer: data.$outer,
            $first: index === 0,
            $last: index === last
        }
        source[param] = item
        source.$remove = function() {
            return data.getter().removeAt(proxy.$index)
        }
        var proxy = modelFactory(source, 0, watchEachOne)
        proxy.$id = "$proxy$" + data.type + Math.random()
        return proxy
    }
    /*********************************************************************
     *                  �ı�����Ĭ�Ͽ��õĹ�����                          *
     **********************************************************************/
    var filters = avalon.filters = {
        uppercase: function(str) {
            return str.toUpperCase()
        },
        lowercase: function(str) {
            return str.toLowerCase()
        },
        camelize: $.camelCase,
        truncate: $.String.truncate,
        escape: $.String.escapeHTML,
        number: $.Number.format
    };

    /*
    var filters = avalon.filters = {
        uppercase: function(str) {
            return str.toUpperCase()
        },
        lowercase: function(str) {
            return str.toLowerCase()
        },
        truncate: function(target, length, truncation) {
            //length�����ַ������ȣ�truncation�����ַ����Ľ�β���ֶ�,�������ַ���
            length = length || 30
            truncation = truncation === void(0) ? "..." : truncation
            return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target)
        },
        camelize: camelize,
        escape: function(html) {
            //���ַ������� html ת��õ��ʺ���ҳ������ʾ������, �����滻 < Ϊ &lt 
            return String(html)
                .replace(/&(?!\w+;)/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
        },
        currency: function(number, symbol) {
            symbol = symbol || "��"
            return symbol + avalon.filters.number(number)
        },
        number: function(number, decimals, dec_point, thousands_sep) {
            //��PHP��number_format��ȫ����
            //number	���裬Ҫ��ʽ��������
            //decimals	��ѡ���涨���ٸ�С��λ��
            //dec_point	��ѡ���涨����С������ַ�����Ĭ��Ϊ . ����
            //thousands_sep	��ѡ���涨����ǧλ�ָ������ַ�����Ĭ��Ϊ , ������������˸ò�������ô���������������Ǳ���ġ�
            // http://kevin.vanzonneveld.net
            number = (number + "").replace(/[^0-9+\-Ee.]/g, "")
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = thousands_sep || ",",
                dec = dec_point || ".",
                s = "",
                toFixedFix = function(n, prec) {
                    var k = Math.pow(10, prec)
                    return "" + Math.round(n * k) / k
                }
            // Fix for IE parseFloat(0.55).toFixed(0) = 0 
            s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split('.')
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
            }
            if ((s[1] || "").length < prec) {
                s[1] = s[1] || ""
                s[1] += new Array(prec - s[1].length + 1).join("0")
            }
            return s.join(dec)
        }
    }
    */
    /*
     'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
     'MMMM': Month in year (January-December)
     'MMM': Month in year (Jan-Dec)
     'MM': Month in year, padded (01-12)
     'M': Month in year (1-12)
     'dd': Day in month, padded (01-31)
     'd': Day in month (1-31)
     'EEEE': Day in Week,(Sunday-Saturday)
     'EEE': Day in Week, (Sun-Sat)
     'HH': Hour in day, padded (00-23)
     'H': Hour in day (0-23)
     'hh': Hour in am/pm, padded (01-12)
     'h': Hour in am/pm, (1-12)
     'mm': Minute in hour, padded (00-59)
     'm': Minute in hour (0-59)
     'ss': Second in minute, padded (00-59)
     's': Second in minute (0-59)
     'a': am/pm marker
     'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     format string can also be one of the following predefined localizable formats:

     'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
     'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
     'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
     'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
     'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
     'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
     'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
     'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
     */
    /*
    new function() {
        function toInt(str) {
            return parseInt(str, 10)
        }

        function padNumber(num, digits, trim) {
            var neg = ""
            if (num < 0) {
                neg = '-'
                num = -num
            }
            num = "" + num
            while (num.length < digits)
                num = "0" + num
            if (trim)
                num = num.substr(num.length - digits)
            return neg + num
        }

        function dateGetter(name, size, offset, trim) {
            return function(date) {
                var value = date["get" + name]()
                if (offset > 0 || value > -offset)
                    value += offset
                if (value === 0 && offset === -12) {
                    value = 12
                }
                return padNumber(value, size, trim)
            }
        }

        function dateStrGetter(name, shortForm) {
            return function(date, formats) {
                var value = date["get" + name]()
                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
                return formats[get][value]
            }
        }

        function timeZoneGetter(date) {
            var zone = -1 * date.getTimezoneOffset()
            var paddedZone = (zone >= 0) ? "+" : ""
            paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
            return paddedZone
        }
        //ȡ����������

        function ampmGetter(date, formats) {
            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
        }
        var DATE_FORMATS = {
            yyyy: dateGetter("FullYear", 4),
            yy: dateGetter("FullYear", 2, 0, true),
            y: dateGetter("FullYear", 1),
            MMMM: dateStrGetter("Month"),
            MMM: dateStrGetter("Month", true),
            MM: dateGetter("Month", 2, 1),
            M: dateGetter("Month", 1, 1),
            dd: dateGetter("Date", 2),
            d: dateGetter("Date", 1),
            HH: dateGetter("Hours", 2),
            H: dateGetter("Hours", 1),
            hh: dateGetter("Hours", 2, -12),
            h: dateGetter("Hours", 1, -12),
            mm: dateGetter("Minutes", 2),
            m: dateGetter("Minutes", 1),
            ss: dateGetter("Seconds", 2),
            s: dateGetter("Seconds", 1),
            sss: dateGetter("Milliseconds", 3),
            EEEE: dateStrGetter("Day"),
            EEE: dateStrGetter("Day", true),
            a: ampmGetter,
            Z: timeZoneGetter
        }
        var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
            NUMBER_STRING = /^\d+$/
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/
        // 1        2       3         4          5          6          7          8  9     10      11

        function jsonStringToDate(string) {
            var match
            if (match = string.match(R_ISO8601_STR)) {
                var date = new Date(0),
                    tzHour = 0,
                    tzMin = 0,
                    dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                    timeSetter = match[8] ? date.setUTCHours : date.setHours
                if (match[9]) {
                    tzHour = toInt(match[9] + match[10])
                    tzMin = toInt(match[9] + match[11])
                }
                dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]))
                var h = toInt(match[4] || 0) - tzHour
                var m = toInt(match[5] || 0) - tzMin
                var s = toInt(match[6] || 0)
                var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000)
                timeSetter.call(date, h, m, s, ms)
                return date
            }
            return string
        }
        var rfixFFDate = /^(\d+)-(\d+)-(\d{4})$/
        var rfixIEDate = /^(\d+)\s+(\d+),(\d{4})$/
        filters.date = function(date, format) {
            var locate = filters.date.locate,
                text = "",
                parts = [],
                fn, match
            format = format || "mediumDate"
            format = locate[format] || format
            if (typeof date === "string") {
                if (NUMBER_STRING.test(date)) {
                    date = toInt(date)
                } else {
                    var trimDate = date.trim()
                    if (trimDate.match(rfixFFDate) || trimDate.match(rfixIEDate)) {
                        date = RegExp.$3 + "/" + RegExp.$1 + "/" + RegExp.$2
                    }
                    date = jsonStringToDate(date)
                }
                date = new Date(date)
            }
            if (typeof date === "number") {
                date = new Date(date)
            }
            if (getType(date) !== "date") {
                return
            }
            while (format) {
                match = DATE_FORMATS_SPLIT.exec(format)
                if (match) {
                    parts = parts.concat(match.slice(1))
                    format = parts.pop()
                } else {
                    parts.push(format)
                    format = null
                }
            }
            parts.forEach(function(value) {
                fn = DATE_FORMATS[value]
                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            })
            return text
        }
        var locate = {
            AMPMS: {
                0: "����",
                1: "����"
            },
            DAY: {
                0: "������",
                1: "����һ",
                2: "���ڶ�",
                3: "������",
                4: "������",
                5: "������",
                6: "������"
            },
            MONTH: {
                0: "1��",
                1: "2��",
                2: "3��",
                3: "4��",
                4: "5��",
                5: "6��",
                6: "7��",
                7: "8��",
                8: "9��",
                9: "10��",
                10: "11��",
                11: "12��"
            },
            SHORTDAY: {
                "0": "����",
                "1": "��һ",
                "2": "�ܶ�",
                "3": "����",
                "4": "����",
                "5": "����",
                "6": "����"
            },
            fullDate: "y��M��d��EEEE",
            longDate: "y��M��d��",
            medium: "yyyy-M-d ah:mm:ss",
            mediumDate: "yyyy-M-d",
            mediumTime: "ah:mm:ss",
            "short": "yy-M-d ah:mm",
            shortDate: "yy-M-d",
            shortTime: "ah:mm"
        }
        locate.SHORTMONTH = locate.MONTH
        filters.date.locate = locate
    }
    */
    /*********************************************************************
     *                      AMD Loader                                *
     **********************************************************************/

    /*
    var innerRequire
    var modules = avalon.modules = {
        "ready!": {
            exports: avalon
        },
        "avalon": {
            exports: avalon,
            state: 2
        }
    }


    new function() {
        var loadings = [] //���ڼ����е�ģ���б�
        var factorys = [] //������Ҫ��ID��factory��Ӧ��ϵ��ģ�飨��׼������£���parse��script�ڵ����onload��
        var basepath

        function cleanUrl(url) {
            return (url || "").replace(/[?#].*//*, "")
        }

        plugins.js = function(url, shim) {
            var id = cleanUrl(url)
            if (!modules[id]) { //���֮ǰû�м��ع�
                modules[id] = {
                    id: id,
                    parent: parent,
                    exports: {}
                }
                if (shim) { //shim����
                    innerRequire(shim.deps || "", function() {
                        loadJS(url, id, function() {
                            modules[id].state = 2
                            if (shim.exports)
                                modules[id].exports = typeof shim.exports === "function" ?
                                    shim.exports() : window[shim.exports]
                            innerRequire.checkDeps()
                        })
                    })
                } else {
                    loadJS(url, id)
                }
            }
            return id
        }
        plugins.css = function(url) {
            var id = url.replace(/(#.+|\W)/g, "") ////���ڴ����href�е�hash�������������
            if (!DOC.getElementById(id)) {
                var node = DOC.createElement("link")
                node.rel = "stylesheet"
                node.href = url
                node.id = id
                head.insertBefore(node, head.firstChild)
            }
        }
        plugins.css.ext = ".css"
        plugins.js.ext = ".js"
        var cur = getCurrentScript(true)
        if (!cur) { //����window safari��Errorû��stack������
            cur = avalon.slice(DOC.scripts).pop().src
        }
        var url = cleanUrl(cur)
        basepath = kernel.base = url.slice(0, url.lastIndexOf("/") + 1)

        function getCurrentScript(base) {
            // �ο� https://github.com/samyk/jiagra/blob/master/jiagra.js
            var stack
            try {
                a.b.c() //ǿ�Ʊ���,�Ա㲶��e.stack
            } catch (e) { //safari�Ĵ������ֻ��line,sourceId,sourceURL
                stack = e.stack
                if (!stack && window.opera) {
                    //opera 9û��e.stack,����e.Backtrace,������ֱ��ȡ��,��Ҫ��e����ת�ַ������г�ȡ
                    stack = (String(e).match(/of linked script \S+/g) || []).join(" ")
                }
            }
            if (stack) {
                //e.stack���һ��������֧�ֵ��������������:
                //chrome23:
                //at http://113.93.50.63/data.js:4:1
                //firefox17:
                //@http://113.93.50.63/query.js:4
                //opera12:http://www.oldapps.com/opera.php?system=Windows_XP
                //@http://113.93.50.63/data.js:4
                //IE10:
                //at Global code (http://113.93.50.63/data.js:4:1)
                //firefox4+ ������document.currentScript
                stack = stack.split(/[@ ]/g).pop() //ȡ�����һ��,���һ���ո��@֮��Ĳ���
                stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "") //ȥ�����з�
                return stack.replace(/(:\d+)?:\d+$/i, "") //ȥ���к��������ڵĳ����ַ���ʼλ��
            }
            var nodes = (base ? DOC : head).getElementsByTagName("script") //ֻ��head��ǩ��Ѱ��
            for (var i = nodes.length, node; node = nodes[--i]; ) {
                if ((base || node.className === subscribers) && node.readyState === "interactive") {
                    return node.className = node.src
                }
            }
        }

        function checkCycle(deps, nick) {
            //����Ƿ����ѭ������
            for (var id in deps) {
                if (deps[id] === "˾ͽ����" && modules[id].state !== 2 && (id === nick || checkCycle(modules[id].deps, nick))) {
                    return true
                }
            }
        }

        function checkDeps() {
            //����JSģ��������Ƿ��Ѱ�װ���,����װ����
            loop: for (var i = loadings.length, id; id = loadings[--i]; ) {

                var obj = modules[id],
                    deps = obj.deps
                for (var key in deps) {
                    if (ohasOwn.call(deps, key) && modules[key].state !== 2) {
                        continue loop
                    }
                }
                //���deps�ǿն��������������ģ���״̬����2
                if (obj.state !== 2) {
                    loadings.splice(i, 1) //�������Ƴ��ٰ�װ����ֹ��IE��DOM��������ֶ�ˢ��ҳ�棬����ִ����
                    fireFactory(obj.id, obj.args, obj.factory)
                    checkDeps() //����ɹ�,����ִ��һ��,�Է���Щģ��Ͳģ��û�а�װ��
                }
            }
        }

        function checkFail(node, onError, fuckIE) {
            var id = cleanUrl(node.src) //����Ƿ�����
            node.onload = node.onreadystatechange = node.onerror = null
            if (onError || (fuckIE && !modules[id].state)) {
                setTimeout(function() {
                    head.removeChild(node)
                    node = null // �����ʽIE�µ�ѭ����������
                })
                log("���� " + id + " ʧ��" + onError + " " + (!modules[id].state))
            } else {
                return true
            }
        }
        var rdeuce = /\/\w+\/\.\./

        function loadResources(url, parent, ret, shim) {
            //1. �ر���mass|ready��ʶ��
            if (url === "ready!" || (modules[url] && modules[url].state === 2)) {
                return url
            }
            //2. ת��Ϊ����·��
            if (typeof kernel.shim[url] === "object") {
                shim = kernel.shim[url]
            }
            if (kernel.paths[url]) { //��������
                url = kernel.paths[url]
            }
            //3.  ����text!  css! ����Դ
            var plugin
            url = url.replace(/^\w+!/, function(a) {
                plugin = a.slice(0, -1)
                return ""
            })
            plugin = plugin || "js"
            plugin = plugins[plugin] || noop
            //4. ��ȫ·��
            if (/^(\w+)(\d)?:.*/
            /*.test(url)) {
                ret = url
            } else {
                parent = parent.substr(0, parent.lastIndexOf("/"))
                var tmp = url.charAt(0)
                if (tmp !== "." && tmp !== "/") { //����ڸ�·��
                    ret = basepath + url
                } else if (url.slice(0, 2) === "./") { //������ֵ�·��
                    ret = parent + url.slice(1)
                } else if (url.slice(0, 2) === "..") { //����ڸ�·��
                    ret = parent + "/" + url
                    while (rdeuce.test(ret)) {
                        ret = ret.replace(rdeuce, "")
                    }
                } else if (tmp === "/") {
                    ret = parent + url //������ֵ�·��
                } else {
                    avalon.error("������ģ���ʶ����: " + url)
                }
            }
            //5. ��ȫ��չ��
            url = cleanUrl(ret)
            var ext = plugin.ext
            if (ext) {
                if (url.slice(0 - ext.length) !== ext) {
                    ret += ext
                }
            }
            //6. ���洦��
            if (kernel.nocache) {
                ret += (ret.indexOf("?") === -1 ? "?" : "&") + (new Date - 0)
            }
            return plugin(ret, shim)
        }

        function loadJS(url, id, callback) {
            //ͨ��script�ڵ����Ŀ��ģ��
            var node = DOC.createElement("script")
            node.className = subscribers //��getCurrentScriptֻ��������Ϊsubscribers��script�ڵ�
            node[W3C ? "onload" : "onreadystatechange"] = function() {
                if (W3C || /loaded|complete/i.test(node.readyState)) {
                    //mass Framework����_checkFail��������Ļص�������������ͷŻش棬����DOM0�¼�д����IE6��GC����
                    var factory = factorys.pop()
                    factory && factory.delay(id)
                    if (callback) {
                        callback()
                    }
                    if (checkFail(node, false, !W3C)) {
                        log("Debug: �ѳɹ����� " + url)
                    }
                }
            }
            node.onerror = function() {
                checkFail(node, true)
            }
            node.src = url //���뵽head�ĵ�һ���ڵ�ǰ����ֹIE6��head��ǩû�պ�ǰʹ��appendChild�״�
            head.insertBefore(node, head.firstChild) //chrome�µڶ�����������Ϊnull
            log("Debug: ��׼������ " + url) //����Ҫ����IE6�¿�����խgetCurrentScript��Ѱ�ҷ�Χ
        }

        innerRequire = avalon.require = function(list, factory, parent) {
            // ���ڼ�����������Ƿ�Ϊ2
            var deps = {},
            // ���ڱ�������ģ��ķ���ֵ
                args = [],
            // ��Ҫ��װ��ģ����
                dn = 0,
            // �Ѱ�װ���ģ����
                cn = 0,
                id = parent || "callback" + setTimeout("1")
            parent = parent || basepath
            String(list).replace(rword, function(el) {
                var url = loadResources(el, parent)
                if (url) {
                    dn++
                    if (modules[url] && modules[url].state === 2) {
                        cn++
                    }
                    if (!deps[url]) {
                        args.push(url)
                        deps[url] = "˾ͽ����" //ȥ��
                    }
                }
            })
            modules[id] = {//����һ������,��¼ģ��ļ��������������Ϣ
                id: id,
                factory: factory,
                deps: deps,
                args: args,
                state: 1
            }
            if (dn === cn) { //�����Ҫ��װ�ĵ����Ѱ�װ�õ�
                fireFactory(id, args, factory) //��װ�������
            } else {
                //�ŵ�����ж���,�ȴ�checkDeps����
                loadings.unshift(id)
            }
            checkDeps()
        }
        */
        /**
         * ����ģ��
         * @param {String} id ? ģ��ID
         * @param {Array} deps ? �����б�
         * @param {Function} factory ģ�鹤��
         * @api public
         *//*
        innerRequire.define = function(id, deps, factory) { //ģ����,�����б�,ģ�鱾��
            var args = aslice.call(arguments)

            if (typeof id === "string") {
                var _id = args.shift()
            }
            if (typeof args[0] === "function") {
                args.unshift([])
            } //���ߺϲ�����ֱ�ӵõ�ģ��ID,����Ѱ�ҵ�ǰ���ڽ����е�script�ڵ��src��Ϊģ��ID
            //���ڳ���safari�⣬���Ƕ���ֱ��ͨ��getCurrentScriptһ����λ�õ���ǰִ�е�script�ڵ㣬
            //safari��ͨ��onload+delay�հ���Ͻ��
            var name = modules[_id] && modules[_id].state >= 1 ? _id : cleanUrl(getCurrentScript())
            if (!modules[name] && _id) {
                modules[name] = {
                    id: name,
                    factory: factory,
                    state: 1
                }
            }
            factory = args[1]
            factory.id = _id //���ڵ���
            factory.delay = function(d) {
                args.push(d)
                var isCycle = true
                try {
                    isCycle = checkCycle(modules[d].deps, d)
                } catch (e) {
                }
                if (isCycle) {
                    avalon.error(d + "ģ����֮ǰ��ĳЩģ�����ѭ������")
                }
                delete factory.delay //�ͷ��ڴ�
                innerRequire.apply(null, args) //0,1,2 --> 1,2,0
            }

            if (name) {
                factory.delay(name, args)
            } else { //�Ƚ��ȳ�
                factorys.push(factory)
            }
        }
        innerRequire.define.amd = modules

        function fireFactory(id, deps, factory) {
            for (var i = 0, array = [], d; d = deps[i++]; ) {
                array.push(modules[d].exports)
            }
            var module = Object(modules[id]),
                ret = factory.apply(window, array)
            module.state = 2
            if (ret !== void 0) {
                modules[id].exports = ret
            }
            return ret
        }
        innerRequire.config = kernel
        innerRequire.checkDeps = checkDeps
    }
    */
    /*********************************************************************
     *                           DOMReady                               *
     **********************************************************************/
    /*
    var ready = W3C ? "DOMContentLoaded" : "readystatechange"

    function fireReady() {
        if (DOC.body) { //  ��IE8 iframe��doScrollCheck���ܲ���ȷ
            modules["ready!"].state = 2
            innerRequire.checkDeps()
            fireReady = noop //���Ժ�������ֹIE9���ε���_checkDeps
        }
    }

    function doScrollCheck() {
        try { //IE��ͨ��doScrollCheck���DOM���Ƿ���
            root.doScroll("left")
            fireReady()
        } catch (e) {
            setTimeout(doScrollCheck)
        }
    }

    if (DOC.readyState === "complete") {
        setTimeout(fireReady) //�����domReady֮�����
    } else if (W3C) {
        DOC.addEventListener(ready, fireReady)
        window.addEventListener("load", fireReady)
    } else {
        DOC.attachEvent("onreadystatechange", function() {
            if (DOC.readyState === "complete") {
                fireReady()
            }
        })
        window.attachEvent("onload", fireReady)
        if (root.doScroll) {
            doScrollCheck()
        }
    }

    avalon.ready = function(fn) {
        innerRequire("ready!", fn)
    }
    avalon.config({
        loader: true
    })
    */
    avalon.ready(function() {
        //IE6-9�����ͨ��ֻҪ1ms,����û�и����ã����ᷢ������setImmediate���ִֻ��һ�Σ���setTimeoutһ��Ҫ140ms����
        if (window.VBArray && !window.setImmediate) {
            var handlerQueue = []

            function drainQueue() {
                var fn = handlerQueue.shift()
                if (fn) {
                    fn()
                    if (handlerQueue.length) {
                        avalon.nextTick()
                    }
                }
            }
            avalon.nextTick = function(callback) {
                if (typeof callback === "function") {
                    handlerQueue.push(callback)
                }
                var node = DOC.createElement("script")
                node.onreadystatechange = function() {
                    drainQueue() //��interactive�׶ξʹ���
                    node.onreadystatechange = null
                    head.removeChild(node)
                    node = null
                }
                head.appendChild(node)
            }
        }
        avalon.scan(DOC.body)
    })
    /*********************************************************************
     *                           armer                                   *
     **********************************************************************/

    $.MVVM = function(id, factory){
        if (arguments.length == 1)
            return VMODELS[arguments[0]];
        else if (arguments.length == 2)
            if (typeof factory == 'object') {
                var model = factory
                factory = function(){
                    $.mix(this, model);
                }
            }
        return avalon.define(id, function(vm){
            factory.call(vm)
        });
    }
    $.MVVM.config = function(hex){
        $.each(hex, function(i, value){
            config[i](value);
        })
    }
    $.MVVM.UI = function(uiname, factory){
        return avalon.ui[uiname] = factory;
    }
    $.MVVM.config({
        interpolate: ["{{", "}}"]
    });
    $.MVVM.mix = avalon.mix;
    $.MVVM.scan = avalon.scan;
    $.MVVM.bindingHandlers = avalon.bindingHandlers;
    $.MVVM.define = avalon.define;
    $.ViewModal = $.VM = $.MVVM


})(document, armer);
if (window.define) {
    define.amd.mvvm = {exports: armer.MVVM}

}

//=========================================
//  TODO(wuhf): lang.extendģ��
//==========================================
;(function($){
    var global = window, DOC = global.document;
    var seval = global.execScript ? "execScript" : "eval",
        sopen = (global.open + '').replace(/open/g, "");
    var head = DOC.head || DOC.getElementsByTagName("head")[0];
    var hasOwn = Object.prototype.hasOwnProperty;

    function identity(value) {
        return value;
    }

    var rformat = /{{([^{}]+)}}/gm;
    var noMatch = /(.)^/;
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    function template(text, data, settings){
        settings = $.extend({}, arguments.callee.settings, settings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) { return '\\' + escapes[match]; });
            source +=
                escape ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" :
                    interpolate ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" :
                        evaluate ? "';\n" + evaluate + "\n__p+='" : '';
            index = offset + match.length;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, $);
        var template = function(data) {
            return render.call(this, data, $);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    }

    template.settings = {
        evaluate    : /\[%([\s\S]+?)%]/g,
        interpolate : /\[%=([\s\S]+?)%]/g,
        escape      : /\[%-([\s\S]+?)%]/g
    };


    $.extend($, {
        /**
         * Ϊhashѡ��������Ĭ�ϳ�Ա
         * @param {object} obj ��Ҫ
         * @returns {*}
         */
        defaults: function(obj) {
            $.each($.slice(arguments, 1), function(_, source) {
                if (source) {
                    for (var prop in source) {
                        if (obj[prop] == null) obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        },



        /*
           ============= is ϵ�� ================
         */
        isBlank: function (target) {
            return /^\s*$/.test(target);
        },
        isString: function(obj){
            return $.type(obj) == 'string';
        },
        /**
         * �ж�method�Ƿ�Ϊobj��ԭ����������$.isNative("JSON",window)
         * @param {String} methodKey
         * @param {*} obj ����
         * @return {Boolean}
         */
        isNative: function(methodKey, obj) {
            var m = obj ? obj[methodKey] : false,
                r = new RegExp(methodKey, "g");
            return !!(m && typeof m != "string" && sopen === (m + "").replace(r, ""));
        },
        /**
         * �Ƿ�Ϊ�ն���
         * @param {Object} obj
         * @return {Boolean}
         */
        isEmptyObject: function(obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        },
        isNaN : function(obj) {
            return obj !== obj;
        },
        isNull : function(obj){
            return obj === null;
        },
        isUndefined : function(obj){
            return obj === void 0;
        },
        isObjectLike : function(obj) {
            return typeof obj == 'object' || typeof obj == 'function';
        },
        // �ж��ַ��������������Ƿ�Ϊ��
        isEmpty : function(obj) {
            if (obj == null) return true;
            if ($.isArray(obj) || $.isString(obj)) return obj.length === 0;
            for (var key in obj) if (obj.hasOwnProperty(key)) return false;
            return true;
        },
        // �ж�һ�������ǲ���jQ����
        isQuaryElement : function(obj){
            return typeof obj == 'object' && obj.constructor == $;
        },
        isDefined: function(obj){
            return obj !== null && obj !== undefined
        },
        // �ж��Ƿ�DOMԪ��
        isElement : function(obj){
            return !!(obj && obj.nodeType == 1);
        },
        // �ж��Ƿ������
        isFinite : function(obj){
            return $.isNumeric(obj) && isFinite(obj);
        },
        isEmptyJson: function(str){return str == '[]' || str == '{}'},
        /**
         * �Ƚ����������Ƿ����
         * @param {*} a �Ƚ϶���1
         * @param {*} b �Ƚ϶���2
         * @return {boolean} �Ƿ����
         */
        isEqual: function(){
            var eq = function(a, b, aStack, bStack) {
                // 0 === -0 Ϊtrue����ʵ���ϲ�Ӧ�����
                // http://wiki.ecmascript.org/doku.php?id=harmony:egal
                // http://www.w3.org/TR/xmlschema11-2/
                if (a === b) return a !== 0 || 1 / a == 1 / b;
                // ��a��bΪnull��ʱ����Ҫ�ϸ��жϣ���Ϊnull == undefined
                if (a == null || b == null) return a === b;
                // �Ƚ����ͣ�������
                var className = $.stringType(a);
                if (className != $.stringType(b)) return false;
                switch (className) {
                    // �ַ��������֣����ڣ������Ƚ�ֵ.
                    case '[object String]':
                        // ͨ����װ������ '5' ʵ���ϵ��� String(5) �����
                        return a == String(b);
                    case '[object Number]':
                        // �Ƚ�����
                        // NaNʵ��������ȵģ�����Ȼ����ͨ�����·�ʽ�ԿɱȽ�
                        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
                    case '[object Date]':
                    case '[object Boolean]':
                        // ���ںͲ�����ǿ��ת�������ֽ��бȽ�
                        // �Ƿ�����ת����ΪNaN��������Ȼ���ֲ����
                        return +a == +b;
                    // ������Ƚ�����ʽ�Լ����
                    case '[object RegExp]':
                        return a.source == b.source &&
                            a.global == b.global &&
                            a.multiline == b.multiline &&
                            a.ignoreCase == b.ignoreCase;
                }
                if (typeof a != 'object' || typeof b != 'object') return false;
                var length = aStack.length;
                while (length--) {
                    // ��������
                    if (aStack[length] == a) return bStack[length] == b;
                }
                // ����һ������ѵ�������ջ��
                aStack.push(a);
                bStack.push(b);
                var size = 0, result = true;
                // �ݹ�Ƚ�����Ͷ���
                if (className == '[object Array]') {
                    // �Ƚ����鳤���Ƿ���ͬȷ���Ƿ���ȱȽ�
                    size = a.length;
                    result = size == b.length;
                    if (result) {
                        // ��ȱȽϣ�����key�����ֵĳ�Ա
                        while (size--) {
                            if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                        }
                    }
                } else {
                    // �����岻ͬ�Ķ��󽫱���Ϊ�����
                    var aCtor = a.constructor, bCtor = b.constructor;
                    if (aCtor !== bCtor && !($.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                        $.isFunction(bCtor) && (bCtor instanceof bCtor))) {
                        return false;
                    }
                    // ��ȵݹ�Ƚ϶���
                    for (var key in a) {
                        if (hasOwn.call(a, key)) {
                            // ����Ԥ���Ա����
                            size++;
                            // ��ȱȽ�ÿ����Ա
                            if (!(result = hasOwn.call(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                        }
                    }
                    // ȷ��ÿ�����󶼰�����ͬ����������
                    if (result) {
                        for (key in b) {
                            if (hasOwn.call(b, key) && !(size--)) break;
                        }
                        result = !size;
                    }
                }
                // �Ƴ����������ջ��һ������
                aStack.pop();
                bStack.pop();
                return result;
            };
            return function(a, b) {
                return eq(a, b, [], []);
            }
        }(),

        // ǿ�������ж�
        type: (function($type){
            var rsplit = /[, |]+/g;
            var typeCase = {
                Blank: function(){},
                ArrayLike: function(){},
                Int: function(obj){return !isNaN(obj) && parseInt(obj) == obj},
                UInt: function(obj){return !isNaN(obj) && parseInt(obj) >= 0},
                Arguments: function(){return identity(obj) == !!obj.callee},
                Window: function(){return obj == obj.document && obj.document != obj || $.stringType(obj,'window|global')},
                Document: function(){return obj.nodeType === 9 || $.stringType(obj,'document')},
                NodeList: function(){return isFinite(obj.length) && obj.item || $.stringType(obj, 'nodelist')}
            };
            /**
             * ����ȡ�����ݵ����ͣ�һ������������£����ж����ݵ����ͣ���������������£�
             * $.type(obj) == a �����Ƴ� $.type(obj, a) == true����������δ��
             * ������и�ϸ���жϣ���ʹ�� $.type(obj, a) �ķ�ʽ
             *
             * @param {*} obj Ҫ���Ķ���
             * @param {String|Array|Function} condition ? Ҫ�Ƚϵ�����
             * @return {String|Boolean}
             * @api public
             */
            return function(obj, condition){
                if (!condition) return $type.apply(this, arguments);
                else {
                    if ('string' == typeof condition)
                        condition = condition.split(rsplit);
                    if ($.isArray(condition))
                        condition = (function(arr){
                            return function(obj){
                                var found = false;
                                $.each(arr, function(__, type){
                                    var compare = typeCase[type] || typeCase[$.hyphen(type)] || typeCase[type.toLowerCase()] || $.stringType;
                                    return !(found = compare(obj, type));
                                });
                                return found;
                            }
                        })(condition);
                    if (!$.isFunction(condition)) throw new TypeError;
                    return !!condition(obj);
                }
            }
        })($.type),



        /*
         ============= parse ϵ�� ================
         */

        /**
         * ���ַ�������JS����ִ��
         * @param {string} code
         */
        parseJS: function(code) {
            //IE�У�global.eval()��eval()һ��ֻ�ڵ�ǰ��������Ч��
            //Firefox��Safari��Opera�У�ֱ�ӵ���eval()Ϊ��ǰ������global.eval()����Ϊȫ��������
            //window.execScript ��IE��һЩ��������
            //http://www.ascadnetworks.com/Guides-and-Tips/IE-error-%2522Could-not-complete-the-operation-due-to-error-80020101%2522
            if (code && /\S/.test(code)) {
                try {
                    global[seval](code);
                } catch (e) {
                }
            }
        },
        // ��text����ת��Ϊbase64�ַ���
        parseBase64: function(inputStr){
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var outputStr = "";
            var i = 0;
            while (i<inputStr.length)
            {
                //all three "& 0xff" added below are there to fix a known bug
                //with bytes returned by xhr.responseText
                var byte1 = inputStr.charCodeAt(i++) & 0xff;
                var byte2 = inputStr.charCodeAt(i++) & 0xff;
                var byte3 = inputStr.charCodeAt(i++) & 0xff;
                var enc1 = byte1 >> 2;
                var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
                var enc3, enc4;
                if (isNaN(byte2))
                    enc3 = enc4 = 64;
                else
                {
                    enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                    if (isNaN(byte3))
                    {
                        enc4 = 64;
                    }
                    else
                    {
                        enc4 = byte3 & 63;
                    }
                }
                outputStr +=  b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
            }
            return outputStr;
        },
        parseCSS: function (css){
            var styles = head.getElementsByTagName("style"), style, media;
            css += "\n";
            if (styles.length == 0) {
                if (DOC.createStyleSheet) {
                    DOC.createStyleSheet();
                } else {
                    style = DOC.createElement('style');
                    style.setAttribute("type", "text/css");
                    head.insertBefore(style, null)
                }
            }
            style = styles[0];
            media = style.getAttribute("media");
            if (media === null && !/screen/i.test(media)) {
                style.setAttribute("media", "all");
            }
            if (style.styleSheet) {
                style.styleSheet.cssText += css;
            } else if (DOC.getBoxObjectFor) {
                style.innerHTML += css;
            } else {
                style.appendChild(DOC.createTextNode(css))
            }
        },

        /*
         ============= �ַ������� ϵ�� ================
         */


        template: template,
        /**
         * �ַ�����ֵ�������ֲ�ֵ������
         * ��һ�֣��ڶ�������Ϊ����{{}}����Ϊ�������滻Ϊ��ֵ���������ص�ֵ��������
         * �ڶ��֣��ѵ�һ��������Ĳ�����Ϊһ�����飬{{}}����Ϊ����ֵ�����㿪ʼ���滻Ϊ����Ԫ��
         * http://www.cnblogs.com/rubylouvre/archive/2011/05/02/1972176.html
         * @param {string} str
         * @param {*} object ��ֵ����ĳһ��Ҫ���ֵ
         * @return {string}
         */
        format: function(str, object) {
            if (arguments.length > 2)
                object = $.slice(arguments, 1);
            return template(str, object, {
                interpolate: rformat
            })
        },
        /**
         * �鿴�����������ڲ�����
         * @param {*} obj
         * @return {string}
         * https://github.com/tdolsen/jquery-dump/blob/master/jquery.dump.js
         * https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js
         * http://freshbrewedcode.com/jimcowart/2013/01/29/what-you-might-not-know-about-json-stringify/
         */
        dump: function(obj) {
            var space = $.isNative("parse", window.JSON) ? 4 : "\r\t", cache = [],
                text = JSON.stringify(obj, function(key, value) {
                    if (typeof value === 'object' && value !== null) {//��ֹ������
                        if (cache.indexOf(value) !== -1) {
                            return;
                        }
                        cache.push(value);
                    }
                    return typeof value === "function" ? value + "" : value;
                }, space);
            cache = [];//GC����
            return text;
        },
        /**
         * Ϊ���ּ��ϵ�λ
         * @param i
         * @param units ��λ
         * @returns {string}
         */
        unit: function (i, units) {
            if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
                return i;
            } else {
                return "" + i + units;
            }
        },
        hyphen: function (target) {
            //ת��Ϊ���ַ��߷��
            return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase();
        },



        // ������ʼ��������
        argsArrange: (function(){
            var filter = function(args, params, defaults) {
                var a = [], tempArr, arr = arguments, item;
                params = params || [];
                defaults = defaults || [];
                for (var i = 0, j = 0; i < params.length; i++) {
                    item = params[i];
                    if ($.isString(item)) item = {condition: item, defaults: defaults[i]};
                    tempArr = [];
                    var isAutoLen = false, isNeed = false, grouper,
                        match = item.match,
                        length = item.length,
                        group = item.group,
                        name = item.name ? 'Params[' + i + ']' : item.name;
                    match =  $.type(match, 'number') ? (isNeed = true, +match) : 1;
                    length =  $.type(length, 'number') ? +length :
                        length == 'auto' ? (isAutoLen = true, Infinity) : match;
                    grouper = group || length > 1 || isAutoLen ? function(arg){tempArr.push(arg); return tempArr} : function(arg){k++; return arg};
                    for (var k = 0; k < length || isAutoLen; k++) {
                        if ($.type(arr[j], item.condition))
                            a[i] = grouper(arr[j++]);
                        else if (k < match && isNeed)
                            throw new TypeError('����' + name + '�������������' + item.condition + '��������Ҫ' + match + '�����ֽ���' + k + '��');
                        else if (isAutoLen)
                            break;
                        else
                            a[i] = grouper(item.defaults);
                    }
                }
                return a;
            };
            return function(func, params, context){
                if ($.isFunction(func))
                    return function(){
                        return func.apply(context || this, filter(arguments, params));
                    };
                else
                    return filter(func, params, context);
            };
        })()
    });

    // TODO(wuhf): �๤��
    // ========================================================
    (function(){
        var
            unextend = $.oneObject(["_super", "prototype", 'extend', 'implement' ]),
            rconst = /constructor|_init|_super/,
            classOne = 'object,array,function';
        function expand(klass,props){
            'extend,implement'.replace( $.rword, function(name){
                var modules = props[name];
                if( $.type(modules, classOne) ){
                    klass[name].apply( klass,[].concat( modules ) );
                    delete props[name];
                }
            });
            return klass;
        }
        var mutators = {
            inherit : function( parent,init ) {
                var bridge = function() { };
                if( typeof parent == 'function'){
                    for(var i in parent){//�̳����Ա
                        this[i] = parent[i];
                    }
                    bridge.prototype = parent.prototype;
                    this.prototype = new bridge ;//�̳�ԭ�ͳ�Ա
                    this._super = parent;//ָ������
                }
                this._init = (this._init || []).concat();
                if( init ){
                    this._init.push(init);
                }
                this.toString = function(){
                    return (init || bridge) + ''
                };
                var proto = this.prototype;
                // FIXME(wuhf): ��ʱ����Ҫ ��עһ��
                /*
                 proto.setOptions = function(first){
                 if( typeof first === 'string' ){
                 first =  this[first] || (this[first] = {});
                 [].splice.call( arguments, 0, 1, first );
                 }else{
                 [].unshift.call( arguments,this );
                 }
                 $.merge.apply(null,arguments);
                 return this;
                 };
                 */
                return proto.constructor = this;
            },
            implement:function(){
                var target = this.prototype, reg = rconst;
                for(var i = 0, module; module = arguments[i++]; ){
                    module = typeof module === "function" ? new module :module;
                    $.each(module, function(name){
                        if(!reg.test(name)) target[name] = module[name];
                    });
                }
                return this;
            },
            extend: function(){//��չ���Ա
                var bridge = {};
                for(var i = 0, module; module = arguments[i++]; ){
                    $.extend( bridge, module );
                }
                for( var key in bridge ){
                    if( !unextend[key] ){
                        this[key] =  bridge[key];
                    }
                }
                return this;
            }
        };
        $.factory = function( obj ){
            obj = obj || {};
            var parent = obj.inherit; //����
            var init = obj.init ;    //������
            var extend = obj.extend; //��̬��Ա
            delete obj.inherit;
            delete obj.init;
            var klass = function () {
                for( var i = 0 , init ; init =  klass._init[i++]; ){
                    init.apply(this, arguments);
                }
            };

            $.extend( klass, mutators ).inherit( parent, init );//��Ӹ����෽��
            return expand( klass, obj ).implement( obj );
        }
    })();


    //�����ĸ����߷���:$.String, $.Array, $.Number, $.Object, $.Function
    "String,Array,Number,Object,Function,Date".replace($.rword, function(Type) {
        var mix = $[Type];
        $[Type] = function(pack) {
            var isNative = typeof pack == "string",
            //ȡ�÷�����
                methods = isNative ? pack.match($.rword) : Object.keys(pack);
            methods.forEach(function(method) {
                $[Type][method] = isNative ?
                    function(obj) {
                        return obj[method].apply(obj, $.slice(arguments, 1));
                    } : pack[method];
            });
        }
        $.extend($[Type], mix);
    });
    $.String({
        byteLen: function(target) {
            /*ȡ��һ���ַ��������ֽڵĳ��ȡ�����һ����˹����ķ����������һ��Ӣ���ַ���
             *�����ݿ� char��varchar��text ���͵��ֶ�ʱռ��һ���ֽڣ���һ�������ַ�����
             *ʱռ�������ֽڣ�Ϊ�˱���������������Ҫ�����ж��ַ������ֽڳ��ȡ���ǰ�ˣ�
             *�������Ҫ�û���յ��ı�����Ҫ�ֽ��ϵĳ������ƣ����緢���ţ�ҲҪ�õ��˷�����
             *����������ռ��Զ����ƵĲ������ⷽ��ҲԽ��Խ���á�
             */
            return target.replace(/[^\x00-\xff]/g, 'ci').length;
        },
        underscored: function(target) {
            //ת��Ϊ�»��߷��
            return target.replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/\-/g, "_").toLowerCase();
        },
        capitalize: function(target) {
            //����ĸ��д
            return target.charAt(0).toUpperCase() + target.substring(1).toLowerCase();
        },
        stripTags: function(target) {
            //�Ƴ��ַ����е�html��ǩ�����ⷽ����ȱ�ݣ���������script��ǩ�������Щ������ʾ�����Ľű�Ҳ��ʾ������
            return target.replace(/<[^>]+>/g, "");
        },
        stripScripts: function(target) {
            //�Ƴ��ַ��������е� script ��ǩ���ֲ�stripTags������ȱ�ݡ��˷���Ӧ��stripTags֮ǰ���á�
            return target.replace(/<script[^>]*>([\S\s]*?)<\/script>/img, '');
        },
        unescapeHTML: function(target) {
            //��ԭΪ�ɱ��ĵ�������HTML��ǩ
            return target.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") //����ת������ĺ�ʵ���ַ�
                .replace(/&#([\d]+);/g, function($0, $1) {
                    return String.fromCharCode(parseInt($1, 10));
                });
        },
        escapeRegExp: function(target) {
            //http://stevenlevithan.com/regex/xregexp/
            //���ַ�����ȫ��ʽ��Ϊ������ʽ��Դ��
            return(target + "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
        pad: function(target, n, filling, right, radix) {
            //http://www.cnblogs.com/rubylouvre/archive/2010/02/09/1666165.html
            //����߲���һЩ�ַ�,Ĭ��Ϊ0
            var num = target.toString(radix || 10);
            filling = filling || "0";
            while (num.length < n) {
                if (!right) {
                    num = filling + num;
                } else {
                    num += filling;
                }
            }
            return num;
        }
    });
    //�ַ�����ԭ��ԭ�ͷ���
    $.String("charAt,charCodeAt,concat,indexOf,lastIndexOf,localeCompare,match," + "contains,endsWith,startsWith,repeat," + //es6
        "replace,search,slice,split,substring,toLowerCase,toLocaleLowerCase,toUpperCase,trim,toJSON");
    $.Array({
        contains: function(target, item) {
            //�ж������Ƿ����ָ��Ŀ�ꡣ
            return !!~target.indexOf(item);
        },
        shuffle: function(target) {
            //���������ϴ�ơ�������Ӱ��ԭ���飬�����ȿ���һ�ݳ���������
            var ret = [],
                i = target.length,
                n;
            target = target.slice(0);
            while (--i >= 0) {
                n = Math.floor(Math.random() * i);
                ret[ret.length] = target[n];
                target[n] = target[i];
            }
            return ret;
        },
        random: function(target) {
            //�������������ѡһ��Ԫ�س�����
            return $.Array.shuffle(target.concat())[0];
        },
        flatten: function(target) {
            //���������ƽ̹����������һ��һά�������顣
            var result = [],
                self = $.Array.flatten;
            target.forEach(function(item) {
                if (Array.isArray(item)) {
                    result = result.concat(self(item));
                } else {
                    result.push(item);
                }
            });
            return result;
        },
        compact: function(target) {
            // ���������е�null��undefined������Ӱ��ԭ���顣
            return target.filter(function(el) {
                return el != null;
            });
        },
        /**
         * ���������ȥ�ز���������һ��û���ظ�Ԫ�ص������顣
         * @param {Array} target Ŀ������
         * @returns {Array}
         */
        unique: function(target) {
            var ret = [],
                n = target.length,
                i, j; //by abcd
            for (i = 0; i < n; i++) {
                for (j = i + 1; j < n; j++)
                    if (target[i] === target[j])
                        j = ++i;
                ret.push(target[i]);
            }
            return ret;
        },
        /**
         * �ϲ���������
         * @param {Array} first ��һ������
         * @param {Array} second �ڶ�������
         * @returns {Array}
         */
        merge: function(first, second) {
            //�ϲ�������������һ
            var i = ~~first.length,
                j = 0;
            for (var n = second.length; j < n; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },
        /**
         * ����������ȡ������
         * @param {Array} target ��һ������
         * @param {Array} array �ڶ�������
         * @returns {Array}
         */
        union: function(target, array) {
            return $.Array.unique($.Array.merge(target, array));
        },
        /**
         * ����������ȡ����
         * @param {Array} target ��һ������
         * @param {Array} array �ڶ�������
         * @returns {Array}
         */
        intersect: function(target, array) {
            return target.filter(function(n) {
                return ~array.indexOf(n);
            });
        },
        /**
         * ����������ȡ�(����)
         * @param {Array} target ��һ������
         * @param {Array} array �ڶ�������
         * @returns {Array}
         */
        diff: function(target, array) {
            var result = target.slice();
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < array.length; j++) {
                    if (result[i] === array[j]) {
                        result.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            return result;
        },
        /**
         * ���������е���Сֵ�������������顣
         * @param {Array} target Ŀ������
         * @returns {Number}
         */
        min: function(target) {
            return Math.min.apply(0, target);
        },
        /**
         * ���������е����ֵ�������������顣
         * @param {Array} target Ŀ������
         * @returns {Number}
         */
        max: function(target) {
            return Math.max.apply(0, target);
        },
        /**
         * �����ǰ����
         * @param {Array} target Ŀ������
         * @returns {Array}
         */
        clone: function(target) {
            var i = target.length,
                result = [];
            while (i--)
                result[i] = cloneOf(target[i]);
            return result;
        },
        remove: function(target, obj){
            var i = target.indexOf(obj);
            if (i>=0) target.splice(i, 1);
        },
        inGroupsOf: function(target, number, fillWith) {
            //�����黮�ֳ�N�����飬����С����number���������һ�����С��number����,
            //�����������������Ϊundefineʱ,���ǿ���������������һ��
            var t = target.length,
                n = Math.ceil(t / number),
                fill = fillWith !== void 0,
                groups = [],
                i, j, cur;
            for (i = 0; i < n; i++) {
                groups[i] = [];
                for (j = 0; j < number; j++) {
                    cur = i * number + j;
                    if (cur === t) {
                        if (fill) {
                            groups[i][j] = fillWith;
                        }
                    } else {
                        groups[i][j] = target[cur];
                    }
                }
            }
            return groups;
        }
    });
    $.Array("concat,join,pop,push,shift,slice,sort,reverse,splice,unshift," + "indexOf,lastIndexOf,every,some,filter,reduce,reduceRight");
    var NumberPack = {
        limit: function(target, n1, n2) {
            //ȷ����ֵ��[n1,n2]������֮��,��������޽�,���û�Ϊ������������ֵ����Сֵ
            var a = [n1, n2].sort();
            if (target < a[0])
                target = a[0];
            if (target > a[1])
                target = a[1];
            return target;
        },
        nearer: function(target, n1, n2) {
            //�������ָ����ֵ������Ǹ���
            var diff1 = Math.abs(target - n1),
                diff2 = Math.abs(target - n2);
            return diff1 < diff2 ? n1 : n2
        },
        round: function(target, base) {
            //http://www.cnblogs.com/xiao-yao/archive/2012/09/11/2680424.html
            if (base) {
                base = Math.pow(10, base);
                return Math.round(target * base) / base;
            } else {
                return Math.round(target);
            }
        }
    };
    "abs,acos,asin,atan,atan2,ceil,cos,exp,floor,log,pow,sin,sqrt,tan".replace($.rword, function(name) {
        NumberPack[name] = Math[name];
    });
    $.Number(NumberPack);
    $.Number("toFixed,toExponential,toPrecision,toJSON");

    function cloneOf(item) {
        var name = $.type(item);
        switch (name) {
            case "array":
            case "object":
                return $[name].clone(item);
            default:
                return item;
        }
    }


    function mergeOne(source, key, current) {
        //ʹ�����������������������ϲ���һ��
        if ($.isPlainObject(source[key])) { //ֻ����JS���󣬲�����window��ڵ�
            $.Object.merge(source[key], current);
        } else {
            source[key] = cloneOf(current)
        }
        return source;
    }

    $.Object({
        /**
         * ���������в���Ҫ���Ԫ��
         * @param {Object} obj
         * @param {Function} fn �������true��Ž��������
         * @param {*} scope ? Ĭ��Ϊ��ǰ������Ԫ�ػ�����ֵ
         * @return {array}
         */
        filter: function(obj, fn, scope) {
            for (var i = 0, n = obj.length, ret = []; i < n; i++) {
                var val = fn.call(scope || obj[i], obj[i], i);
                if (!!val) {
                    ret[ret.length] = obj[i];
                }
            }
            return ret;
        },
        subset: function(target, props) {
            //���ݴ�������ȡ��ǰ������صļ�ֵ�����һ���¶��󷵻�
            var result = {};
            props.forEach(function(prop) {
                result[prop] = target[prop];
            });
            return result;
        },
        //������һ�ļ�ֵ������ص���ִ�У�����ص�����false��ֹ����
        forEach: function(obj, fn) {
            Object.keys(obj).forEach(function(name) {
                fn(obj[name], name)
            })
        },
        //������һ�ļ�ֵ������ص���ִ�У��ռ���������
        map: function(obj, fn) {
            return  Object.keys(obj).map(function(name) {
                return fn(obj[name], name)
            })
        },
        clone: function(target) {
            //�������������һ���¶��������ǳ������ʹ��$.extend
            var clone = {};
            for (var key in target) {
                clone[key] = cloneOf(target[key]);
            }
            return clone;
        },
        merge: function(target, k, v) {
            //���������ϲ�����һ�������л򽫺�����������������ֵ���뵽��һ������
            var obj, key;
            //ΪĿ��������һ����ֵ��
            if (typeof k === "string")
                return mergeOne(target, k, v);
            //�ϲ��������
            for (var i = 1, n = arguments.length; i < n; i++) {
                obj = arguments[i];
                for (key in obj) {
                    if (obj[key] !== void 0) {
                        mergeOne(target, key, obj[key]);
                    }
                }
            }
            return target;
        }
    });
    $.Object("hasOwnerProperty,isPrototypeOf,propertyIsEnumerable");

    $.Function({
        partial: function(func) {
            var args = $.slice(arguments, 1);
            return function() {
                return func.apply(this, args.concat($.slice(arguments)));
            };
        },
        memoize: function(func, hasher) {
            var memo = {};
            hasher || (hasher = identity);
            return function() {
                var key = hasher.apply(this, arguments);
                return memo.hasOwnProperty(key) ? memo[key] : (memo[key] = func.apply(this, arguments));
            };
        },
        throttle: function(func, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function() {
                previous = new Date;
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = new Date;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        debounce: function(func, wait, immediate) {
            var timeout, result;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) result = func.apply(context, args);
                return result;
            };
        },
        one: function(func) {
            var ran = false, memo;
            return function() {
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
        },
        after: function(times, func) {
            if (times <= 0) return func();
            return function() {
                if (--times < 1) {
                    return func.apply(this, arguments);
                }
            };
        }
    });
    $.throttle = $.Function.throttle;

    var DATE_FORMATS = {
        yyyy: dateGetter('FullYear', 4),
        yy: dateGetter('FullYear', 2, 0, true),
        y: dateGetter('FullYear', 1),
        MMMM: dateStrGetter('Month'),
        MMM: dateStrGetter('Month', true),
        MM: dateGetter('Month', 2, 1),
        M: dateGetter('Month', 1, 1),
        dd: dateGetter('Date', 2),
        d: dateGetter('Date', 1),
        HH: dateGetter('Hours', 2),
        H: dateGetter('Hours', 1),
        hh: dateGetter('Hours', 2, -12),
        h: dateGetter('Hours', 1, -12),
        mm: dateGetter('Minutes', 2),
        m: dateGetter('Minutes', 1),
        ss: dateGetter('Seconds', 2),
        s: dateGetter('Seconds', 1),
        sss: dateGetter('Milliseconds', 3),
        EEEE: dateStrGetter('Day'),
        EEE: dateStrGetter('Day', true),
        a: ampmGetter,
        Z: timeZoneGetter
    };
    var locate = {
        AMPMS: {
            0: "����",
            1: "����"
        },
        DAY: {
            0: "������",
            1: "����һ",
            2: "���ڶ�",
            3: "������",
            4: "������",
            5: "������",
            6: "������"
        },
        MONTH: {
            0: "1��",
            1: "2��",
            2: "3��",
            3: "4��",
            4: "5��",
            5: "6��",
            6: "7��",
            7: "8��",
            8: "9��",
            9: "10��",
            10: "11��",
            11: "12��"
        },
        SHORTDAY: {
            "0": "����",
            "1": "��һ",
            "2": "�ܶ�",
            "3": "����",
            "4": "����",
            "5": "����",
            "6": "����"
        },
        fullDate: "y��M��d��EEEE",
        longDate: "y��M��d��",
        medium: "yyyy-M-d ah:mm:ss",
        mediumDate: "yyyy-M-d",
        mediumTime: "ah:mm:ss",
        "short": "yy-M-d ah:mm",
        shortDate: "yy-M-d",
        shortTime: "ah:mm"
    };
    var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
        NUMBER_STRING = /^\d+$/
    var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/
    // 1        2       3         4          5          6          7          8  9     10      11
    locate.SHORTMONTH = locate.MONTH;

    function jsonStringToDate(string) {
        var match
        if (match = string.match(R_ISO8601_STR)) {
            var date = new Date(0),
                tzHour = 0,
                tzMin = 0,
                dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                timeSetter = match[8] ? date.setUTCHours : date.setHours
            if (match[9]) {
                tzHour = toInt(match[9] + match[10])
                tzMin = toInt(match[9] + match[11])
            }
            dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]))
            timeSetter.call(date, toInt(match[4] || 0) - tzHour, toInt(match[5] || 0) - tzMin, toInt(match[6] || 0), toInt(match[7] || 0))
            return date
        }
        return string
    }
    function toInt(str) {
        return parseInt(str, 10)
    }
    function padNumber(num, digits, trim) {
        var neg = '';
        if (num < 0) {
            neg = '-';
            num = -num
        }
        num = '' + num;
        while (num.length < digits)
            num = '0' + num;
        if (trim)
            num = num.substr(num.length - digits);
        return neg + num
    }
    function dateGetter(name, size, offset, trim) {
        return function(date) {
            var value = date['get' + name]()
            if (offset > 0 || value > -offset)
                value += offset
            if (value === 0 && offset === -12) {
                value = 12
            }
            return padNumber(value, size, trim)
        }
    }
    function dateStrGetter(name, shortForm) {
        return function(date, formats) {
            var value = date['get' + name]();
            var get = (shortForm ? ('SHORT' + name) : name).toUpperCase();
            return formats[get][value]
        }
    }
    function timeZoneGetter(date) {
        var zone = -1 * date.getTimezoneOffset();
        var paddedZone = (zone >= 0) ? "+" : "";
        paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
        return paddedZone
    }

    //ȡ����������
    function ampmGetter(date, formats) {
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
    }

    $.Date({
        locate: locate,
        /*
         'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
         'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
         'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
         'MMMM': Month in year (January-December)
         'MMM': Month in year (Jan-Dec)
         'MM': Month in year, padded (01-12)
         'M': Month in year (1-12)
         'dd': Day in month, padded (01-31)
         'd': Day in month (1-31)
         'EEEE': Day in Week,(Sunday-Saturday)
         'EEE': Day in Week, (Sun-Sat)
         'HH': Hour in day, padded (00-23)
         'H': Hour in day (0-23)
         'hh': Hour in am/pm, padded (01-12)
         'h': Hour in am/pm, (1-12)
         'mm': Minute in hour, padded (00-59)
         'm': Minute in hour (0-59)
         'ss': Second in minute, padded (00-59)
         's': Second in minute (0-59)
         'a': am/pm marker
         'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
         format string can also be one of the following predefined localizable formats:

         'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
         'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
         'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
         'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
         'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
         'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
         'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
         'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
         */
        format: function(date, format) {
            var locate = $.Date.locate,
                text = "",
                parts = [],
                fn, match;
            format = format || "mediumDate";
            format = locate[format] || format;
            if (typeof date === "string") {
                if (NUMBER_STRING.test(date)) {
                    date = toInt(date)
                } else {
                    date = jsonStringToDate(date)
                }
                date = new Date(date)
            }
            if (typeof date === "number") {
                date = new Date(date)
            }
            if ($.type(date) !== 'date') {
                return
            }

            while (format) {
                match = DATE_FORMATS_SPLIT.exec(format);
                if (match) {
                    parts = parts.concat(match.slice(1));
                    format = parts.pop()
                } else {
                    parts.push(format);
                    format = null
                }
            }
            parts.forEach(function(value) {
                fn = DATE_FORMATS[value]
                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, '').replace(/''/g, "'")
            });
            return text
        }
    })
})(armer);
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
(function(){

    /**
     * CSS Transform ������
     * ��Ҫ�������з�����transform�ַ���������transform�ļ�ֵ������$.fn.css����$.fn.transit, $.fn.css({ transform: '...' })
     * @param {string} transValue
     * @returns {Transform}
     * @constructor
     * @example
     * var t = new Transform("rotate(90) scale(4)");
     * t.rotate             //=> "90deg"
     * t.scale              //=> "4,4"
     *
     * ����set��get
     * t.set('rotate', 4)
     * t.rotate             //=> "4deg"
     *
     * ʹ��toString���������л���toString����Ϊtrueʱ��Ϊwebkit�汾.
     * t.toString()         //=> "rotate(90deg) scale(4,4)"
     * t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
     */
    var unit = $.unit;
    function Transform(transValue) {
        if (typeof transValue === 'string') { this.parse(transValue); }
        return this;
    }

    Transform.prototype = {
        /**
         * ͨ���ַ��������л�
         * @param prop ��Ҫ���õ�����
         * @param val ��Ҫ���õ�ֵ
         * @example  t.setFromString('scale', '2,4'); �൱�� set('scale', '2', '4');
         */
        setFromString: function(prop, val) {
            var args =
                (typeof val === 'string')  ? val.split(',') :
                    (val.constructor === Array) ? val :
                        [ val ];

            args.unshift(prop);

            Transform.prototype.set.apply(this, args);
        },
        /**
         * ����һ������
         * @param prop ������
         * @example t.set('scale', 2, 4);
         */
        set: function(prop) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[prop]) {
                this.setter[prop].apply(this, args);
            } else {
                this[prop] = args.join(',');
            }
        },

        get: function(prop) {
            if (this.getter[prop]) {
                return this.getter[prop].apply(this);
            } else {
                return this[prop] || 0;
            }
        },

        setter: {
            /**
             * ��ת
             * @param theta �Ƕ�
             * @example
             * .css({ rotate: 30 })
             * .css({ rotate: "30" })
             * .css({ rotate: "30deg" })
             */
            rotate: function(theta) {
                this.rotate = unit(theta, 'deg');
            },
            rotateX: function(theta) {
                this.rotateX = unit(theta, 'deg');
            },
            rotateY: function(theta) {
                this.rotateY = unit(theta, 'deg');
            },
            /**
             * ����
             * @param x
             * @param y
             * @example
             * .css({ scale: 9 })      //=> "scale(9,9)"
             * .css({ scale: '3,2' })  //=> "scale(3,2)"
             */
            scale: function(x, y) {
                if (y === undefined) { y = x; }
                this.scale = x + "," + y;
            },
            // skewX + skewY
            skewX: function(x) {
                this.skewX = unit(x, 'deg');
            },
            skewY: function(y) {
                this.skewY = unit(y, 'deg');
            },
            // ͸��
            perspective: function(dist) {
                this.perspective = unit(dist, 'px');
            },
            // �൱��ƽ�Ƶ�XY
            x: function(x) {
                this.set('translate', x, null);
            },
            y: function(y) {
                this.set('translate', null, y);
            },
            /**
             * ƽ��
             * @param x
             * @param y
             * @example
             * .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
             */
            translate: function(x, y) {
                if (this._translateX === undefined) { this._translateX = 0; }
                if (this._translateY === undefined) { this._translateY = 0; }

                if (x !== null && x !== undefined) { this._translateX = unit(x, 'px'); }
                if (y !== null && y !== undefined) { this._translateY = unit(y, 'px'); }

                this.translate = this._translateX + "," + this._translateY;
            }
        },
        getter: {
            x: function() {
                return this._translateX || 0;
            },

            y: function() {
                return this._translateY || 0;
            },

            scale: function() {
                var s = (this.scale || "1,1").split(',');
                if (s[0]) { s[0] = parseFloat(s[0]); }
                if (s[1]) { s[1] = parseFloat(s[1]); }

                // "2.5,2.5" => 2.5
                // "2.5,1" => [2.5,1]
                return (s[0] === s[1]) ? s[0] : s;
            },

            rotate3d: function() {
                var s = (this.rotate3d || "0,0,0,0deg").split(',');
                for (var i=0; i<=3; ++i) {
                    if (s[i]) { s[i] = parseFloat(s[i]); }
                }
                if (s[3]) { s[3] = unit(s[3], 'deg'); }

                return s;
            }
        },
        // ת��transform
        // ת�����ɹ��������
        parse: function(str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                self.setFromString(prop, val);
            });
        },

        /**
         * ���л�
         * �������л�����transform���л�
         * @param use3d �Ƿ�ʹ��3D
         * @returns {string}
         */
        toString: function(use3d) {
            var re = [];

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    // ����������֧��3D transform����ʹ��
                    if ((!support.transform3d) && (
                        (i === 'rotateX') ||
                            (i === 'rotateY') ||
                            (i === 'perspective') ||
                            (i === 'transformOrigin'))) { continue; }

                    if (i[0] !== '_') {
                        if (use3d && (i === 'scale')) {
                            re.push(i + "3d(" + this[i] + ",1)");
                        } else if (use3d && (i === 'translate')) {
                            re.push(i + "3d(" + this[i] + ",0)");
                        } else {
                            re.push(i + "(" + this[i] + ")");
                        }
                    }
                }
            }

            return re.join(" ");
        }
    };


    var div = document.createElement('div');
    var support = {};
    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

// һ��CSS��Ӧtransition-property�Ķ�Ӧ��
// https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    var propertyMap = $.transitionPropertyMap = {
        marginLeft    : 'margin',
        marginRight   : 'margin',
        marginBottom  : 'margin',
        marginTop     : 'margin',
        paddingLeft   : 'padding',
        paddingRight  : 'padding',
        paddingBottom : 'padding',
        paddingTop    : 'padding'
    }

// ��ȡ���Դ�ǰ׺�ļ�
// transition` => `WebkitTransition
    function getVendorPropertyName(prop) {
        // Handle unprefixed versions (FF16+, for example)
        if (prop in div.style) return prop;
        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);
        if (prop in div.style) { return prop; }
        for (var i=0; i<prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) { return vendorProp; }
        }
    }

// ����Ƿ�֧��transform3D
// ������Ӧ�õ�Webkit��Firefox 10+ ����true
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

// ����������transition�������Եļ������
    support.transition      = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transform       = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.transform3d     = checkTransform3dSupport();

// ��չ��$.support
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
            $.support[key] = support[key];
        }
    }

// ����IE���ڴ�й©
    div = null;

    function registerCssHook(prop, isPixels) {
        // ����ĳЩ���ԣ���Ӧ�ð���'px'
        if (!isPixels) { $.cssNumber[prop] = true; }
        propertyMap[prop] = support.transform;
        $.cssHooks[prop] = {
            get: function(elem) {
                var t = $(elem).css('transit:transform');
                return t.get(prop);
            },
            set: function(elem, value) {
                var t = $(elem).css('transit:transform');
                t.setFromString(prop, value);
                $(elem).css({ 'transit:transform': t });
            }
        };
    }

// 'transform' CSS ����
// ������ͨ��$.fn.css���޸�transition
//
// $("#hello").css({ transform: "rotate(90deg)" });
// $("#hello").css('transform');
// => { rotate: '90deg' }
//
    $.cssHooks['transit:transform'] = {
        // getter�᷵��һ��Transition����
        get: function(elem) {
            return $(elem).data('transform') || new Transform();
        },
        // setter�����һ��Transform�������һ���ַ���
        set: function(elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            // ��Chrome����Ԫ����viewport�����ŵ�ʱ��3D�汾�����Ų����Ч��Ϊ�˲�ð�գ�
            // �����ر�3D����
            // http://davidwalsh.name/detecting-google-chrome-javascript
            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

// Ϊ.css({ transform: '...' })���CSS����
// ����jQuery 1.8+�����⸲��Ĭ��transform
    $.cssHooks.transform = {
        set: $.cssHooks['transit:transform'].set
    };

// ��������
// ����ʹ��rotate, scale��
    registerCssHook('scale');
    registerCssHook('translate');
    registerCssHook('rotate');
    registerCssHook('rotateX');
    registerCssHook('rotateY');
    registerCssHook('rotate3d');
    registerCssHook('perspective');
    registerCssHook('skewX');
    registerCssHook('skewY');
    registerCssHook('x', true);
    registerCssHook('y', true);

})();


$.fn.bgiframe = function(){
    if(this.children('bgiframe').length == 0){   //��������ڲŲ��ȥ
        return this.prepend($(document.createElement('bgiframe')).html('<iframe frameborder="0" scrolling="no" style="width: 100%;height: 100%;z-index: -2;filter: alpha(opacity=0);opacity: 0;"></iframe>').css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            zoom: 1,
            zIndex: -1
        }));
    }
};

// .position ����;
(function( $, undefined ) {
    var cachedScrollbarWidth,
        max = Math.max,
        abs = Math.abs,
        round = Math.round,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /[\+\-]\d+%?/,
        rposition = /^\w+/,
        rpercent = /%$/,
        _position = $.fn.position;

    function getOffsets( offsets, width, height ) {
        return [
            parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
            parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
        ];
    }
    function parseCss( element, property ) {
        return parseInt( $.css( element, property ), 10 ) || 0;
    }

    $.position = {
        scrollbarWidth: function() {
            if ( cachedScrollbarWidth !== undefined ) {
                return cachedScrollbarWidth;
            }
            var w1, w2,
                div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
                innerDiv = div.children()[0];

            $( "body" ).append( div );
            w1 = innerDiv.offsetWidth;
            div.css( "overflow", "scroll" );

            w2 = innerDiv.offsetWidth;

            if ( w1 === w2 ) {
                w2 = div[0].clientWidth;
            }

            div.remove();

            return (cachedScrollbarWidth = w1 - w2);
        },
        getScrollInfo: function( within ) {
            var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
                overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
                hasOverflowX = overflowX === "scroll" ||
                    ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
                hasOverflowY = overflowY === "scroll" ||
                    ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
            return {
                width: hasOverflowX ? $.position.scrollbarWidth() : 0,
                height: hasOverflowY ? $.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo: function( element ) {
            var withinElement = $( element || window ),
                isWindow = $.isWindow( withinElement[0] );
            return {
                element: withinElement,
                isWindow: isWindow,
                offset: withinElement.offset() || { left: 0, top: 0 },
                scrollLeft: withinElement.scrollLeft(),
                scrollTop: withinElement.scrollTop(),
                width: isWindow ? withinElement.width() : withinElement.outerWidth(),
                height: isWindow ? withinElement.height() : withinElement.outerHeight()
            };
        }
    };

    $.fn.position = function( options ) {
        if ( !options || !options.of ) {
            return _position.apply( this, arguments );
        }

        // make a copy, we don't want to modify arguments
        options = $.extend( {}, options );

        var atOffset, targetWidth, targetHeight, targetOffset, basePosition,
            target = $( options.of ),
            within = $.position.getWithinInfo( options.within ),
            scrollInfo = $.position.getScrollInfo( within ),
            targetElem = target[0],
            collision = ( options.collision || "flip" ).split( " " ),
            offsets = {};

        if ( targetElem.nodeType === 9 ) {
            targetWidth = target.width();
            targetHeight = target.height();
            targetOffset = { top: 0, left: 0 };
        } else if ( $.isWindow( targetElem ) ) {
            targetWidth = target.width();
            targetHeight = target.height();
            targetOffset = { top: target.scrollTop(), left: target.scrollLeft() };
        } else if ( targetElem.preventDefault ) {
            // force left top to allow flipping
            options.at = "left top";
            targetWidth = targetHeight = 0;
            targetOffset = { top: targetElem.pageY, left: targetElem.pageX };
        } else {
            targetWidth = target.outerWidth();
            targetHeight = target.outerHeight();
            targetOffset = target.offset();
        }
        // clone to reuse original targetOffset later
        basePosition = $.extend( {}, targetOffset );

        // force my and at to have valid horizontal and vertical positions
        // if a value is missing or invalid, it will be converted to center
        $.each( [ "my", "at" ], function() {
            var pos = ( options[ this ] || "" ).split( " " ),
                horizontalOffset,
                verticalOffset;

            if ( pos.length === 1) {
                pos = rhorizontal.test( pos[ 0 ] ) ?
                    pos.concat( [ "center" ] ) :
                    rvertical.test( pos[ 0 ] ) ?
                        [ "center" ].concat( pos ) :
                        [ "center", "center" ];
            }
            pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
            pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

            // calculate offsets
            horizontalOffset = roffset.exec( pos[ 0 ] );
            verticalOffset = roffset.exec( pos[ 1 ] );
            offsets[ this ] = [
                horizontalOffset ? horizontalOffset[ 0 ] : 0,
                verticalOffset ? verticalOffset[ 0 ] : 0
            ];

            // reduce to just the positions without the offsets
            options[ this ] = [
                rposition.exec( pos[ 0 ] )[ 0 ],
                rposition.exec( pos[ 1 ] )[ 0 ]
            ];
        });

        // normalize collision option
        if ( collision.length === 1 ) {
            collision[ 1 ] = collision[ 0 ];
        }

        if ( options.at[ 0 ] === "right" ) {
            basePosition.left += targetWidth;
        } else if ( options.at[ 0 ] === "center" ) {
            basePosition.left += targetWidth / 2;
        }

        if ( options.at[ 1 ] === "bottom" ) {
            basePosition.top += targetHeight;
        } else if ( options.at[ 1 ] === "center" ) {
            basePosition.top += targetHeight / 2;
        }

        atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
        basePosition.left += atOffset[ 0 ];
        basePosition.top += atOffset[ 1 ];

        return this.each(function() {
            var collisionPosition, using,
                elem = $( this ),
                elemWidth = elem.outerWidth(),
                elemHeight = elem.outerHeight(),
                marginLeft = parseCss( this, "marginLeft" ),
                marginTop = parseCss( this, "marginTop" ),
                collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
                collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
                position = $.extend( {}, basePosition ),
                myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

            if ( options.my[ 0 ] === "right" ) {
                position.left -= elemWidth;
            } else if ( options.my[ 0 ] === "center" ) {
                position.left -= elemWidth / 2;
            }

            if ( options.my[ 1 ] === "bottom" ) {
                position.top -= elemHeight;
            } else if ( options.my[ 1 ] === "center" ) {
                position.top -= elemHeight / 2;
            }

            position.left += myOffset[ 0 ];
            position.top += myOffset[ 1 ];

            // if the browser doesn't support fractions, then round for consistent results
            if ( !$.support.offsetFractions ) {
                position.left = round( position.left );
                position.top = round( position.top );
            }

            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };

            $.each( [ "left", "top" ], function( i, dir ) {
                if ( position[ collision[ i ] ] ) {
                    position[ collision[ i ] ][ dir ]( position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        collisionPosition: collisionPosition,
                        collisionWidth: collisionWidth,
                        collisionHeight: collisionHeight,
                        offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                        my: options.my,
                        at: options.at,
                        within: within,
                        elem : elem
                    });
                }
            });

            if ( $.fn.bgiframe && !!window.ActiveXObject && !window.XMLHttpRequest ) {
                elem.bgiframe();
            }

            if ( options.using ) {
                // adds feedback as second argument to using callback, if present
                using = function( props ) {
                    var left = targetOffset.left - position.left,
                        right = left + targetWidth - elemWidth,
                        top = targetOffset.top - position.top,
                        bottom = top + targetHeight - elemHeight,
                        feedback = {
                            target: {
                                element: target,
                                left: targetOffset.left,
                                top: targetOffset.top,
                                width: targetWidth,
                                height: targetHeight
                            },
                            element: {
                                element: elem,
                                left: position.left,
                                top: position.top,
                                width: elemWidth,
                                height: elemHeight
                            },
                            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                        };
                    if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
                        feedback.horizontal = "center";
                    }
                    if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
                        feedback.vertical = "middle";
                    }
                    if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
                        feedback.important = "horizontal";
                    } else {
                        feedback.important = "vertical";
                    }
                    options.using.call( this, props, feedback );
                };
            }

            elem.offset( $.extend( position, { using: using } ) );
        });
    };
    var position = {
        fit: {
            left: function( position, data ) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                    outerWidth = within.width,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = withinOffset - collisionPosLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                    newOverRight;

                // element is wider than within
                if ( data.collisionWidth > outerWidth ) {
                    // element is initially over the left side of within
                    if ( overLeft > 0 && overRight <= 0 ) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                        position.left += overLeft - newOverRight;
                        // element is initially over right side of within
                    } else if ( overRight > 0 && overLeft <= 0 ) {
                        position.left = withinOffset;
                        // element is initially over both left and right sides of within
                    } else {
                        if ( overLeft > overRight ) {
                            position.left = withinOffset + outerWidth - data.collisionWidth;
                        } else {
                            position.left = withinOffset;
                        }
                    }
                    // too far left -> align with left edge
                } else if ( overLeft > 0 ) {
                    position.left += overLeft;
                    // too far right -> align with right edge
                } else if ( overRight > 0 ) {
                    position.left -= overRight;
                    // adjust based on position and margin
                } else {
                    position.left = max( position.left - collisionPosLeft, position.left );
                }
            },
            top: function( position, data ) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                    outerHeight = data.within.height,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = withinOffset - collisionPosTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                    newOverBottom;

                // element is taller than within
                if ( data.collisionHeight > outerHeight ) {
                    // element is initially over the top of within
                    if ( overTop > 0 && overBottom <= 0 ) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                        position.top += overTop - newOverBottom;
                        // element is initially over bottom of within
                    } else if ( overBottom > 0 && overTop <= 0 ) {
                        position.top = withinOffset;
                        // element is initially over both top and bottom of within
                    } else {
                        if ( overTop > overBottom ) {
                            position.top = withinOffset + outerHeight - data.collisionHeight;
                        } else {
                            position.top = withinOffset;
                        }
                    }
                    // too far up -> align with top
                } else if ( overTop > 0 ) {
                    position.top += overTop;
                    // too far down -> align with bottom edge
                } else if ( overBottom > 0 ) {
                    position.top -= overBottom;
                    // adjust based on position and margin
                } else {
                    position.top = max( position.top - collisionPosTop, position.top );
                }
            }
        },
        flip: {
            left: function( position, data ) {
                var within = data.within,
                    withinOffset = within.offset.left + within.scrollLeft,
                    outerWidth = within.width,
                    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = collisionPosLeft - offsetLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                    myOffset = data.my[ 0 ] === "left" ?
                        -data.elemWidth :
                        data.my[ 0 ] === "right" ?
                            data.elemWidth :
                            0,
                    atOffset = data.at[ 0 ] === "left" ?
                        data.targetWidth :
                        data.at[ 0 ] === "right" ?
                            -data.targetWidth :
                            0,
                    offset = -2 * data.offset[ 0 ],
                    newOverRight,
                    newOverLeft;

                if ( overLeft < 0 ) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                    if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
                else if ( overRight > 0 ) {
                    newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                    if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
            },
            top: function( position, data ) {
                var within = data.within,
                    withinOffset = within.offset.top + within.scrollTop,
                    outerHeight = within.height,
                    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = collisionPosTop - offsetTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                    top = data.my[ 1 ] === "top",
                    myOffset = top ?
                        -data.elemHeight :
                        data.my[ 1 ] === "bottom" ?
                            data.elemHeight :
                            0,
                    atOffset = data.at[ 1 ] === "top" ?
                        data.targetHeight :
                        data.at[ 1 ] === "bottom" ?
                            -data.targetHeight :
                            0,
                    offset = -2 * data.offset[ 1 ],
                    newOverTop,
                    newOverBottom;
                if ( overTop < 0 ) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                    if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
                else if ( overBottom > 0 ) {
                    newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                    if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
            }
        },
        flipfit: {
            left: function() {
                position.flip.left.apply( this, arguments );
                position.fit.left.apply( this, arguments );
            },
            top: function() {
                position.flip.top.apply( this, arguments );
                position.fit.top.apply( this, arguments );
            }
        }
    };

    // fraction support test
    (function () {
        var testElement, testElementParent, testElementStyle, offsetLeft, i,
            body = document.getElementsByTagName( "body" )[ 0 ],
            div = document.createElement( "div" );

        //Create a "fake body" for testing based on method used in jQuery.support
        testElement = document.createElement( body ? "div" : "body" );
        testElementStyle = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        };
        if ( body ) {
            $.extend( testElementStyle, {
                position: "absolute",
                left: "-1000px",
                top: "-1000px"
            });
        }
        for ( i in testElementStyle ) {
            testElement.style[ i ] = testElementStyle[ i ];
        }
        testElement.appendChild( div );
        testElementParent = body || document.documentElement;
        testElementParent.insertBefore( testElement, testElementParent.firstChild );

        div.style.cssText = "position: absolute; left: 10.7432222px;";

        offsetLeft = $( div ).offset().left;
        $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

        testElement.innerHTML = "";
        testElementParent.removeChild( testElement );
    })();

    // offset option
    (function( $ ) {
        var _position = $.fn.position;
        $.fn.position = function( options ) {
            if ( !options || !options.offset ) {
                return _position.call( this, options );
            }
            var offset = options.offset.split( " " ),
                at = options.at.split( " " );
            if ( offset.length === 1 ) {
                offset[ 1 ] = offset[ 0 ];
            }
            if ( /^\d/.test( offset[ 0 ] ) ) {
                offset[ 0 ] = "+" + offset[ 0 ];
            }
            if ( /^\d/.test( offset[ 1 ] ) ) {
                offset[ 1 ] = "+" + offset[ 1 ];
            }
            if ( at.length === 1 ) {
                if ( /left|center|right/.test( at[ 0 ] ) ) {
                    at[ 1 ] = "center";
                } else {
                    at[ 1 ] = at[ 0 ];
                    at[ 0 ] = "center";
                }
            }
            return _position.call( this, $.extend( options, {
                at: at[ 0 ] + offset[ 0 ] + " " + at[ 1 ] + offset[ 1 ],
                offset: undefined
            } ) );
        };
    }( armer ) );
}( armer ) );



// ��չ�ڽ�jQuery css easing
;(function () {
    // ����Robert Penner�Ļ�����ʽ (http://www.robertpenner.com/easing)
    var baseEasings = {};
    $.each(['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'], function (i, name) {
        baseEasings[ name ] = function (p) {
            return Math.pow(p, i + 2);
        };
    });
    $.extend(baseEasings, {
        Sine: function (p) {
            return 1 - Math.cos(p * Math.PI / 2);
        },
        Circ: function (p) {
            return 1 - Math.sqrt(1 - p * p);
        },
        Elastic: function (p) {
            return p === 0 || p === 1 ? p :
                -Math.pow(2, 8 * (p - 1)) * Math.sin(( (p - 1) * 80 - 7.5 ) * Math.PI / 15);
        },
        Back: function (p) {
            return p * p * ( 3 * p - 2 );
        },
        Bounce: function (p) {
            var pow2,
                bounce = 4;
            while (p < ( ( pow2 = Math.pow(2, --bounce) ) - 1 ) / 11) {
            }
            return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - p, 2);
        }
    });
    $.each(baseEasings, function (name, easeIn) {
        $.easing['easeIn' + name ] = easeIn;
        $.easing['easeOut' + name ] = function (p) {
            return 1 - easeIn(1 - p);
        };
        $.easing['easeInOut' + name ] = function (p) {
            return p < 0.5 ?
                easeIn(p * 2) / 2 :
                1 - easeIn(p * -2 + 2) / 2;
        };
    });

    // ��չһЩCSStransition-timing-function��js����
    $.cssEasing = {
        linear: 'linear',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        swing: 'cubic-bezier(.02,.01,.47,1)',
        snap: 'cubic-bezier(0,1,.5,1)',
        easeOutCubic: 'cubic-bezier(.215,.61,.355,1)',
        easeInOutCubic: 'cubic-bezier(.645,.045,.355,1)',
        easeInCirc: 'cubic-bezier(.6,.04,.98,.335)',
        easeOutCirc: 'cubic-bezier(.075,.82,.165,1)',
        easeInOutCirc: 'cubic-bezier(.785,.135,.15,.86)',
        easeInExpo: 'cubic-bezier(.95,.05,.795,.035)',
        easeOutExpo: 'cubic-bezier(.19,1,.22,1)',
        easeInOutExpo: 'cubic-bezier(1,0,0,1)',
        easeInQuad: 'cubic-bezier(.55,.085,.68,.53)',
        easeOutQuad: 'cubic-bezier(.25,.46,.45,.94)',
        easeInOutQuad: 'cubic-bezier(.455,.03,.515,.955)',
        easeInQuart: 'cubic-bezier(.895,.03,.685,.22)',
        easeOutQuart: 'cubic-bezier(.165,.84,.44,1)',
        easeInOutQuart: 'cubic-bezier(.77,0,.175,1)',
        easeInQuint: 'cubic-bezier(.755,.05,.855,.06)',
        easeOutQuint: 'cubic-bezier(.23,1,.32,1)',
        easeInOutQuint: 'cubic-bezier(.86,0,.07,1)',
        easeInSine: 'cubic-bezier(.47,0,.745,.715)',
        easeOutSine: 'cubic-bezier(.39,.575,.565,1)',
        easeInOutSine: 'cubic-bezier(.445,.05,.55,.95)',
        easeInBack: 'cubic-bezier(.6,-.28,.735,.045)',
        easeOutBack: 'cubic-bezier(.175, .885,.32,1.275)',
        easeInOutBack: 'cubic-bezier(.68,-.55,.265,1.55)'
    };
    $.cssEasing._default = 'cubic-bezier(.02,.01,.47,1)';

    var support = $.support;
    // �����Ҫ��transitionend
    var eventNames = {
        'transition':       'transitionend',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition':     'MSTransitionEnd'
    };
    // ����support���ò�ͬ���¼�
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // ����transitionEnd�ı��ֲ�һ�£����Բ���������Ϊ�ж϶�����ɵ�ʱ��
    //$.Transition.useTransitionEnd = true;
    Transition = function(elem, properties, options){
        var transition,
            oldTransitions,
            $elem = $(elem),
            bound = false,
            deferred = $.Deferred().always(function(){
                bound && elem.removeEventListener(transitionEnd, handler);
                elem.style[support.transition] = oldTransitions;
            }),
            handler = function(){
                deferred.resolveWith(elem, [transition]);
            };
        // Ĭ�϶���Ϊswing
        options.easing = options.easing || 'swing';
        oldTransitions = elem.style[support.transition];
        if ($.Transition.useTransitionEnd) {
            bound = true;
            elem.addEventListener(transitionEnd, handler);
        } else window.setTimeout(handler, options.duration);
        // webkit�����ǿ���ػ���ܴ���
        var s = elem.offsetWidth;

        elem.style[support.transition] = getTransition(properties, options.duration, options.easing, options.delay);
        $elem.css(properties);
        transition = deferred.promise({
            elem: elem,
            props: $.extend({}, properties),
            opts: $.extend(true, {}, options),
            originalProperties: properties,
            originalOptions: options,
            duration: options.duration,
            stop: function(gotoEnd){
                var currentStyle = {};
                if (gotoEnd) {
                    deferred.resolveWith(elem, [transition, gotoEnd]);
                } else {
                    $.each(properties, function(i){
                        currentStyle[i] = $(elem).css(i);
                    });
                    elem.css(currentStyle);
                    deferred.rejectWith(elem, [transition, gotoEnd]);
                }
                elem.style[support.transition] = null;
                return this;
            }
        });
        return transition.done( transition.opts.done, transition.opts.complete )
            .fail( transition.opts.fail )
            .always( transition.opts.always );
    };
    $.Transition = $.extend(Transition, {
        // ��ʱ�ر�transitionЧ��
        enabled: true,
        // �����Ƿ�ͨ��transitionEnd������������callback
        useTransitionEnd: false
    });
    $.fn.transit = function(prop, speed, easing, callback){
        var empty = $.isEmptyObject(prop),
            optall = $.speed(speed, easing, callback);
            var doTransition = function(){
                var transit = Transition(this, $.extend({}, prop), optall);
                if (empty || $._data(this, 'finish'))
                    transit.stop(true);
            };
            doTransition.finish = doTransition;
        return empty || optall.queue == false ?
            this.each(doTransition) : this.queue(optall.queue, doTransition);
    };

    /**
     * ����CSS���Ի�ȡTransition����
     * @param props CSS����
     * @returns {Array} ����һ������transition-property����������
     */
    function getProperties(props) {
        var re = [];

        $.each(props, function(key) {
            key = $.camelCase(key); // Convert "text-align" => "textAlign"
            key = $.transitionPropertyMap[key] || $.cssProps[key] || key;
            key = $.hyphen(key); // Convert back to dasherized

            if ($.inArray(key, re) === -1) { re.push(key); }
        });

        return re;
    }

    /**
     * �������л���transition
     * @param properties ����
     * @param duration ����ʱ��
     * @param easing ��������
     * @param delay ��ʱ
     * @returns {string}
     * @exaple
     * getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');  => 'opacity 500ms ease, -webkit-transform 500ms ease'
     */
    function getTransition(properties, duration, easing, delay) {
        // ��ȡ��Ҫ��Transition����
        var props = getProperties(properties);

        // ͨ����ƻ�ȡ�����timming-function
        if ($.cssEasing[easing]) { easing = $.cssEasing[easing]; }

        // ����duration/easing/delay����
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

        // ��ϲ�ͬ��CSS����
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        $.each(props, function(i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }
    /**
     * ���ٶ�ת��Ϊ����
     * @param duration
     * @returns {*}
     * @example
     * toMS('fast')   //=> '400ms'
     * toMS(10)       //=> '10ms'
     */
    function toMS(duration) {
        var i = duration;
        // ת������ 'fast' ���ַ���.
        if ($.fx.speeds[i]) { i = $.fx.speeds[i]; }
        return $.unit(i, 'ms');
    }

    // ��¶һ�������õķ���
    $.Transition.getTransitionValue = getTransition;

    if (!$.support.transition)
        $.fn.transit = $.fn.transition = $.fn.animate;


    // TODO: classAnimation ��JS����transition����js��������ģ��tansitionCSS����

    // ת��Ϊms�����磺��'2000ms'��'2s' ת��Ϊ 2000;
    function toMS(duration) {
        if (typeof duration == 'number') return duration;
        if (duration.indexOf('ms') > -1) return parseInt(duration);
        if (duration.indexOf('s') > -1) return parseInt(duration) * 1000;
        return parseInt(duration);
    }
    var classAnimationActions = [ "add", "remove", "toggle" ];
    var rC = /\s*,\s*/;
    var rS = /\s/;
    var cssEasing2Easing = {
        'ease': 'swing'
    };
    var firstVal = function(obj){
        var i;
        if ($.isArray(obj)) {
            return obj[0]
        } else if (typeof obj == 'object') {
            for (i in obj) {
                return obj[i];
            }
        }
    };
    // ���ˣ����߹��˲�����
    var getStyles = function(elem, filter, diff){
        var style = elem.currentStyle, styles = {}, key, value;
        for (key in filter) {
            value =  style[key];
            if (typeof value === 'string' && (!diff || filter[key] !== value)) {
                styles[key] = style[key];
            }
        }
        return styles;
    };
    // ͨ��currentStyle��ȡtransition
    var getTransition = function(currentStyle){
        var i, tLeng = 0, t = [], property = [], duration = [], timingFunction = [], delay = [], transition = {};
        // ������try���У�����ȡ�Զ������Կ��ܵ��³����ܼ�������
        try {
            t = currentStyle['transition'].split(rC);
            for(i = t.length; i--;) {
                t[i] = t[i].split(rS);
                t[i] = {property:t[i][0], duration: t[i][1], timingFunction: t[i][2], delay: t[i][3]};
            }
            tLeng = t.length;
            property = currentStyle['transition-property'].split(rC);
            duration = currentStyle['transition-duration'].split(rC);
            timingFunction = currentStyle['transition-timing-function'].split(rC);
            delay = currentStyle['transition-delay'].split(rC);
        } catch(e) {}
        // ���ϳ�һ������
        for (i = 0; i < property.length; i++) {
            //alert(property[i]);
            t[i + tLeng] = {property: property[i], duration: duration[i] || duration[0], timingFunction: timingFunction[i] || timingFunction[0], delay: delay[i] || delay[0]};
        }
        // ȥ�غϲ�
        for (i = 0; i < t.length; i++) {
            var item = transition[t[i].property];
            if (!item) item = transition[t[i].property] = {};
            item.duration = t[i].duration || item.duration || $.fx.speeds._default;
            item.timingFunction = t[i].timingFunction || item.timingFunction || $.cssEasing._default;
            item.delay = t[i].delay || item.delay || 0;
        }
        return transition;
    };
    var classAnimation = function(value){
        var animated = this, children, allAnimations, applyClassChange;
        if (!animated[0]) return ;
        var currentStyle = this[0].currentStyle;
        var doAnimate = !!currentStyle &&
            (!!(children = currentStyle['fix-transition-chlidren']) ||
                !!currentStyle['transition-property'] ||
                !!currentStyle['transition']
                );
        applyClassChange = function() {
            $.each(value, function(i, item) {
                item.orig.call(animated, item.classes);
            });
        };
        if (doAnimate) {
            var baseClass = animated.attr( "class" ) || "";
            allAnimations = animated.find($.trim(children).replace(/^["']/, '').replace(/['"]$/, '')).addBack();
            // ������Ҫ��������Ԫ�أ���ȡ��ԭ����ʽ
            allAnimations = allAnimations.map(function(){
                var t = getTransition(this.currentStyle), el = $(this);
                return {
                    el: el,
                    start: getStyles(this, t),
                    transitions: t
                }
            });
            applyClassChange();
            // �ٴα�����Ҫ���������ʽ�Ĳ���
            allAnimations = allAnimations.map(function() {
                this.diff = getStyles(this.el[0], this.start, true);
                return this;
            });
            animated.attr( "class", baseClass );
            allAnimations = allAnimations.map(function(){
                var i = firstVal(this.transitions);
                // ֻ��ȡ��һ��duration��timingFunction��delay��������
                var styleInfo = this,
                    dfd = $.Deferred(),
                    opts = $.extend({
                        duration: toMS(i.duration),
                        easing: cssEasing2Easing[i.timingFunction] || 'swing'
                    }, {
                        complete: function() {
                            dfd.resolve(styleInfo);
                        }
                    });
                this.el.finish().delay(toMS(i.delay)).animate(this.diff, opts);
                return dfd.promise();
            });
            $.when.apply($, allAnimations.get()).done(function() {

                // ��������
                applyClassChange();

                // �������ж�����Ԫ�أ��������css����
                $.each( arguments, function() {
                    var el = this.el;
                    $.each( this.diff, function(key) {
                        el.css( key, "" );
                    });
                });
            });

        } else applyClassChange();
    };
    $.each(classAnimationActions, function(__, action){
        var orig = $.fn[action + 'Class'];
        $.fn[action + 'Class'] = $.support.transition ? orig : function(classes) {
            // TODO: �ж��Ƿ�������..
            var withAnimation = true;
            if (withAnimation) classAnimation.call(this, {add: {classes: classes, orig: orig}})
            else orig.apply(this, arguments);
            return this;
        }
    })
})(armer)

;(function () {
    $.EventEmitter = function(obj){
        if (typeof obj == 'function' || typeof obj == 'object') return $.mix(obj, mul);
        if(!(this instanceof $.EventEmitter)) return new $.EventEmitter();
    }

    var mul = {
        on: function(types, fn){
            $.event.add(this, types, fn);
        },
        off: function(types){
            $.event.remove(this, types);
        },
        emit: function(types, data){
            $.event.trigger(new $.Event(types), data, this);
        }
    };
    $.mix(mul, {
        trigger: mul.emit
    });
    $.EventEmitter.prototype = $.EventEmitter.fn = mul;
})();

// valuechange�¼����������Լ����ô򣬸��������������¼����������뵼�µı�ֵ�仯
/*
 $('input').valuechange(function(e){
 e.newValue; // �µ�ֵ
 e.oldValue; // �ɵ�ֵ
 e.realEvent; // �����仯����ʵ�¼�
 })
 */
(function(){
    var DATA = "valuechangeData";
    //���ֵǰ�����ı�,�����󶨻ص�
    function testChange(elem, realEvent) {
        var old = $.data(elem, DATA);
        var neo = elem.value;
        if(old !== neo){
            $.data(elem, DATA, neo);
            var event = new $.Event("valuechange");
            event.realEvent = realEvent;
            event.oldValue = old;
            event.newValue = neo;
            $.event.trigger(event, [neo, old], elem);

        }
    }
    function unTestChange(elem){
        $.removeData(elem, DATA);
    }
    function startTest(event) {
        var elem = event.target;
        if (event.type == 'focus' || event.type == 'mousedown' || event.type == 'paste') {
            $.data(elem, DATA , elem.value);
            event.type == 'paste' && $.nextTick(function(){
                testChange(elem, event);
            })
        }
        else testChange(elem, event);
    }
    function stopTest(event){
        unTestChange(event.target);
    }
    function listen(elem) {
        unlisten(elem);
        "keydown paste keyup mousedown focus".replace($.rword, function(name){
            $(elem).on(name+"._valuechange", startTest)
        });
        $(elem).on('blur._valuechange', stopTest);
        $(elem).on('webkitspeechchange._valuechange', function(e){
            testChange(e.target,e);
        });
    }
    function unlisten(elem){
        unTestChange(elem);
        $(elem).off("._valuechange")
    }
    $.fn.valuechange = function(callback){
        var $this = $(this), event, neo, old;
        if (typeof callback == 'function')
            $this.on( "valuechange", callback );
        else {
            event = new $.Event('valuechange');
            old = event.oldValue = $this.val();
            $.data(this, DATA, old);
            $this.val(callback);
            neo = event.newValue = $this.val();
            $.event.trigger(event, [neo, old], this);
        }
        return $this;
    };
    $.event.special.valuechange = {
        setup: function(){
            var elem = this, nodeName = elem.tagName;
            if (nodeName == 'INPUT' || nodeName == 'TEXTAREA') {
                listen(elem);
                return false;
            }
        },
        teardown: function () {
            var elem = this, nodeName = elem.tagName;
            if (nodeName == 'INPUT' || nodeName == 'TEXTAREA') {
                unlisten(this);
                return false;
            }
        }
    }
})();


// ���enter,ctrlEnter,backspace�¼�
(function(){
    var keypressEvents = "keydown";
    $.each(["enter", "ctrlenter", "backspace"], function( i, name){
        var key = name;
        $.fn[key] = function( fn ){
            return !fn || $.isFunction( fn ) ?
                this[fn ? "bind" : "trigger"]( key, fn ) :
                this["bind"]( key, function(){ $( fn ).trigger("click"); }); //������ǰ��enter����
        };
        $.event.special[key] = {
            setup: function(){
                $.event.add( this, keypressEvents + '.' + key, enterHandler, {type: key} );
            },
            teardown: function(){
                $.event.remove( this, keypressEvents + '.' + key, enterHandler );
            }
        };
    });

    function enterHandler( e ){
        var pass = true;
        switch(parseInt(e.which)){
            case 13:
                if( (e.data.type != "ctrlEnter" && e.data.type != "enter") ||
                    (e.data.type == "ctrlEnter" && !e.metaKey && !e.ctrlKey) ||
                    (e.data.type == "enter" && e.metaKey) )
                    pass = false;
                break;
            case 8:
                if(e.data.type != "backspace")
                    pass = false;
                break;
            default:
                pass = false;
        }
        if (pass) {
            e.type = e.data.type;
            $.event.trigger(new $.Event(e.type), [], this);
        }
    }
})();

(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ($.event.fixHooks) {
        for ( var i=toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i=toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i=toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.on("mousewheel", fn) : this.trigger("mousewheel");
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0, fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta;  }
        if ( orgEvent.detail     ) { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max( Math.abs(deltaY), Math.abs(deltaX) );
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta/lowestDelta);
        deltaX = Math[fn](deltaX/lowestDeltaXY);
        deltaY = Math[fn](deltaY/lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    $.fn.onExcept = function(selector, eventTypes, fn){
        selector = $(selector);
        return this.on(eventTypes, function(e){
            var trigger = true;
            selector.each(function(){
                /*
                 $.log(
                 'this�ǣ�' + this,
                 'target�ǣ�' + e.target,
                 'this�Ƿ����target:' + $.contains(this, e.target),
                 'this�Ƿ�target:' +  this == e.target
                 );
                 */
                if ($.contains(this, e.target) || $(this)[0] == e.target) {
                    return trigger &= false;
                }
            });
            if (trigger) fn.call(this, e);
        });
    };

})(jQuery);





    $.Utility = function(){
    return $.extend(function(){},{
        // �رմ���
        'closeWindow' : function(confirmStr){
            if (confirmStr && !confirm(confirmStr)) return;
            if (document.referrer == "") {
                if ($.browser.mozilla) return alert("�ô�����Ҫ�رա�������������֧�ֹرյ������ڣ����ֶ��رա�");
                window.opener = '';
                window.open('','_self');
            }
            window.close();
        },
        // �ı�����
        'copyText' : function(text, notdebug){
            var copy = true;
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", text);
            }else if (!notdebug) {
                prompt("��IE���������Ctrl+c�ֶ���������", text);
                copy = false;
            }
            return copy;
        },
        // ����ղ�
        'addFavorite' : function(url,title){
            var url = url || top.location.href;
            var title = title || top.document.title;
            if (document.all) {
                window.external.addFavorite(url,title); }
            else if (window.sidebar)  {
                window.sidebar.addPanel(title, url, "");
            } else {
                alert("�ղ�ʧ�ܣ���ʹ��Ctrl+D�����ղ�");
            }
        }
    })
}();


$.UI = {};
//==============================
//   TODO(wuhf): UI����ķ���
//==============================
(function(support){
    if (!support) {
        var oVal = $.fn.val;
        var togglePlaceHolder = function(val) {
            val = val || oVal.call(this);
            var holder = this.attr('placeholder');
            if (!val && holder) oVal.call(this, holder).addClass('placeholder');
            else this.removeClass('placeholder')
        };
    }
    var fixFn1 = function(){
        var $this = this;
        var str = $this.attr('placeholder')
        var $holder = $(document.createElement('f-placeholder-text')).html(str);
        var cssClass = $this.attr('class');
        cssClass && cssClass.replace($.rword, function(cssClass){
            $holder.addClass(cssClass);
            return false;
        });
        var $wrapper = $(document.createElement('f-placeholder-wrapper'));
        $this.wrap($wrapper);
        var css = {
            'position': 'absolute',
            'width': $this.width(),
            'height': $this.height(),
            'fontFamily': $this.css('fontFamily'),
            'fontSize': $this.css('fontSize'),
            'fontWeight': $this.css('fontWeight'),
            'fontStyle': $this.css('fontStyle'),
            'lineHeight': $this.css('lineHeight')
        };
        'Top,Right,Bottom,Left'.replace($.rword, function(name){
            css['padding' + name] = parseInt($this.css('padding' + name)) + parseInt($this.css('border' + name + 'Width'));
            css['margin' + name] = parseInt($this.css('margin' + name));
        });
        css.marginTop ++;
        $holder.css(css);
        $this.on('valuechange.placeholder', function(){
            var arg = arguments;
            if(!arg[1]) $holder.show();
            else $holder.hide();
        });
        $holder.on('click.placehoder', function(){
            $this.focus();
        });
        $this.before($holder);

    };
    try {
        $('<input/>').attr('placeholder')
    } catch(e) {
        //IE10�����ȥ����...
        support = true;
    }


    var fixFn2 = function(){
        var $this = this;
        !support && togglePlaceHolder.call($this);
        $this.on('blur.placehoder', function(){
            togglePlaceHolder.call($this);
        }).on('focus.placehoder', function(){
                if (oVal.call($this) == $this.attr('placeholder')) oVal.call($this, '');
                $this.removeClass('placeholder');
            });

        //��дval
        $.fn.val = function(val){
            if (val == null && !val)
                return this.each(function(){
                    togglePlaceHolder.call($(this), val);
                });
            else if (val) return oVal.apply(this, arguments);
            else {
                val = oVal.apply(this);
                if(val == this.attr('placeholder')) return '';
                else return val;
            }
        };
    };

    $.fn.placeHolder =  function(str){
        return this.each(function(){
            var $this = $(this);
            if (!$this.data('fix-placeHolder')) {
                $this.data('fix-placeHolder', true);
                !!str && $this.attr('placeholder', str);
                !$.support.placeHolder && fixFn1.call($this);
            }
        })
    }

    if (!support) {
        //��дval
        $.fn.val = function(val){
            var $this = $(this);
            if (!!val && !!$this.attr('placeholder')) {
                oVal.apply(this, arguments);
                $this.trigger("valuechange.placeholder",val);
                return ;
            } else {
                return oVal.apply(this, arguments);
            }
        };
        $(function () {
            $('input[placeholder], textarea[placeholder]').placeHolder();
        })
    }

})($.support.placeHolder =  'placeholder' in document.createElement('input'));
/*�ɽ�ȡ������ʾʡ�Ժ�*/
$.fn.ellipsis = function() {
    function loop ($container, maxHeight, str) {
        if ($container.height() <= maxHeight) return;
        var init = false;
        var nodes = this.contents();
        var i = nodes.length - 2, item
        for (; i > -1 && $container.height() > maxHeight; i--) {
            item = nodes[i];
            if (item.nodeType == '3') {
                if (!init) init = !!$(item).after(str)
                var text = item.nodeValue.replace(/ {2,}/, ' ');
                while (item.nodeValue && $container.height() > maxHeight ){
                    text = text.substr(0, text.length - 1);
                    item.nodeValue = text;
                }
            }
        }
    }
    return function(str, container){
        return this.each(function(){
            // �������������ַ
            var container = container;
            var oldH, str = str || '<span class="ellipsis">...</span>'
            container = container || this;
            // ��ȡmax-height������������
            var maxHeight = window.getComputedStyle ? (getComputedStyle(container)['max-height'] || getComputedStyle(container)['maxHeight']) : container.currentStyle['max-height'];
            var match = maxHeight.match(/(0?\.?\d*)px$/);
            if (match) maxHeight = oldH = match[1];
            else return;
            // ��һ����Ԫ�ز���һ���иߣ�Ȼ��ȥ��
            var s = $('<span></span>', {
                html: 'o',
                css: {
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    left: '-999em'
                }
            }).appendTo(this);
            var lineHeight = parseInt(s.css('lineHeight'));
            s.remove();


            var line = Math.floor(maxHeight / lineHeight);
            console.log(maxHeight)
            console.log('lineHeight:' + lineHeight)
            console.log(line)
            maxHeight = line * lineHeight;

            // ȥ��һЩ��ʽ�����䳬����Χ
            container.style.maxHeight = 'none';
            container.style.overflowY = 'auto';
            container.style.height = 'auto';


            if (arguments.callee.useCssClamp && ('webkitLineClamp' in this.style || 'lineClamp' in this.style)) {
                container.style.textOverflow = 'ellipsis';
                container.style.display = '-webkit-box';
                container.style.webkitBoxOrient = 'vertical';
                container.style.webkitLineClamp = line;
            } else loop.call($(this), $(container), maxHeight, str);


            // ������ʽ
            container.style.overflowY = 'hidden';
            container.style.maxHeight = oldH + 'px';
        })
    }
}();

$.fn.ellipsis.useCssClamp = true;

(function ($) {
    var $backdrop;
    /**
     * ������
     * @param {jQuery.Deferred|jQuery|function|string} content
     * @param {object} options
     * @constructor
     */
    var Modal = function(content, options){
        if (!(this instanceof Modal)) return new Modal(content, options);
        this.options = $.extend({}, arguments.callee.defaults);
        if (typeof content == 'string' || /\//.test(content)) {
            var selector, url, off = content.indexOf(" ");
            if ( off >= 0 ) {
                selector = content.slice(off, content.length);
                url = content.slice(0, off);
            }
            this._init = function(){
                return $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'html',
                    dataFilter: function(responseText){
                        return  $(selector ? $('<div>').append($.parseHTML(responseText)).find(selector) : responseText)
                    }
                })
            }
        } else if ($.type(content) != 'function')
            this._init = function(){
                return $.when($(content));
            };
        else
            this._init = content;
        this.$element = $('<div class="modal" style="position: absolute; z-index:1001; display: none; overflow: hidden;"></div>');
    };
    Modal.list = [];
    Modal.toogleBackDrop = function(toggle){
        toggle = toggle == null ? $backdrop.css('display') == 'none' : !!toggle;

        $('body').toggleClass('with-backdrop', toggle);
        if (!$backdrop) $backdrop = $('<div class="backdrop" style="display: none;"></div>').prependTo('body').bgiframe();
        var opacity = $backdrop.css('opacity');

        if (toggle) {
            $backdrop.css({
                display: 'block',
                opacity: 0
            }).transit({
                opacity: opacity
            }, function(){
                $(this).css({opacity: ''})
            })
        } else {
            $backdrop.css({
                opacity: opacity
            }).transit({
                opacity: 0
            }, function(){
                $(this).css({opacity: '', display: 'none'})
            })
        }
    }
    Modal.prototype = {
        constructor: Modal,
        init: function(){
            var e = $.Event('init'), dfd, self = this;
            self.$element.trigger(e);
            if (!e.isDefaultPrevented()) {
                dfd = self._init();
            } else dfd = $.Deferred.reject();
            dfd.done(function($elem){
                self._init = dfd;
                self.$element.append($elem.show()).appendTo('body');
            })
        },
        _open: function(){
            var self = this;
            if (Modal.list.indexOf(self) >= 0) return;
            if (!Modal.list.length) {
                Modal.toogleBackDrop(true);
                Modal.list.push(self);
            }
            else {
                Modal.list.push(self);
                Modal.list[0].close();
            }
            self.$element.css({
                display: 'block',
                opacity: 0
            }).position({of:$(window), at:'center center-50', my:'center center'}).finish().transit({
                top: '+=50',
                opacity: '1'
            }, function(){
                self.$element.find('.modal-form :text, .modal-form textarea').eq(0).focus();
            })
        },
        _close: function(){
            if (!(Modal.list.indexOf(this) >= 0)) return;
            $.Array.remove(Modal.list, this);
            if (!Modal.list.length) Modal.toogleBackDrop(false);

            this.$element.finish().transit({
                opacity: 0,
                top: '-=50'
            }, function(){
                this.style.display = 'none';
                this.style.top = ''
                this.style.left = ''
            });

        },
        close: function(){
            var e = $.Event('close'), self = this;
            this.$element.trigger(e);
            if (!e.isDefaultPrevented()) {
                self._close();
            }
        },
        open: function(dfd){
            var self = this;
            $.when(typeof self._init == "function" ? self.init() : self._init, dfd).done(function(){
                var e = $.Event('open');
                self.$element.trigger(e);
                if (!e.isDefaultPrevented()) {
                    self._open();
                }
            })
        }
    };

    Modal.defaults = {};

    $.fn.modal = function(options){
        var self = this[0], modal;
        if (modal = $.data(self, 'ui-modal'))
            return modal;
        else $.data(self, 'ui-modal', Modal(self, options));
        return this;
    }
    $.UI.Modal = Modal;

})(jQuery);