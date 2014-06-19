/**
 * =========================================
 * TODO(wuhf): Coreģ��
 * ��˵����
 *  ��ܵ����岼���Լ�����
 *
 * �����������ļ���
 * 1. jQuery
 *
 * �������������ݡ�
 * 1. ǿ��jQuery���ķ���������ͨ�ù��߼�$.slice, $.oneObject, $.nextTick��
 * 2. $.factory �๤��
 * 3. $.URL URL������
 * 4. AMDģ���������
 * ==========================================
 */
armer = window.jQuery || window.Zepto;
(function ($, global, DOC) {
    alert(11)
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







