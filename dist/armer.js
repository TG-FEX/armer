/*!
 * armerjs - v0.8.9 - 2015-05-04 
 * Copyright (c) 2015 Alphmega; Licensed MIT() 
 */
/*!
 * armerjs - v0.8.9 - 2015-05-04 
 * Copyright (c) 2015 Alphmega; Licensed MIT() 
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
         * 判断对象类型
         * @method armer.stringType
         * @static
         * @param obj
         * @param [type]
         * @returns {boolean|string}
         */
        $.stringType = toStringType;

        /**
         * 数组化
         * @method armer.slice
         * @static
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
        /**
         * 计算类似array[-1]为最后一位的算法
         * 用于模拟slice, splice的效果
         * @name armer.resetNumber
         * @param a 下标值
         * @param [n] 总长度
         * @param [end] 非整数的处理方式，如果为true则取n值
         * @returns {number}
         */
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
             * @method armer.generateID
             * @static
             * @returns {string}
             */
            generateID: function () {
                return "armer" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            },
            mixOptions: function (target) {
                var callee = arguments.callee,
                    input = $.slice(arguments, 1),
                    inputIndex = 0,
                    inputLength = input.length,
                    key, tmp, obj,
                    value;
                for (; inputIndex < inputLength; inputIndex++) {
                    for (key in input[inputIndex]) {
                        value = input[inputIndex][key];
                        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {

                            if (/[\[\]\.]/.test(key)) {
                                try {
                                    tmp =  getWs(target, key);
                                } catch(e) {
                                    tmp = undefined;
                                }
                            }

                            if (tmp && typeof tmp[0] == 'object') {
                                obj = tmp[0];
                                key = tmp[1];
                            } else {
                                obj = target
                            }

                            // Clone objects
                            if ($.isPlainObject(value)) {
                                obj[key] = $.isPlainObject(obj[key]) ?
                                    callee.call(this, {}, obj[key], value) :
                                    // Don't extend strings, arrays, etc. with objects
                                    callee.call(this, {}, value);
                                // Copy everything else by reference
                            } else {
                                obj[key] = value;
                            }
                        }
                    }
                }
                return target;
            },
            /**
             * 生成随机数
             * @method armer.random
             * @static
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
             * @method armer.oneObject
             * @static
             * @param {array|string} array 如果是字符串，请用","或空格分开
             * @param {number} [val] 默认为1
             * @returns {Object}
             */
            oneObject: oneObject,
            hasOwn: function(obj, key){
                return hasOwn.call(obj, key)
            },
            own: function(obj, key){
                if ($.type(obj) != 'object') {
                    key = obj;
                    obj = this;
                }
                return hasOwn.call(obj, key) ? obj[key] : undefined;
            },
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
             *  @method armer.trace
             *  @static
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
            unparam: function(query){
                var setValue = function(root, path, value){
                    if(path.length > 1){
                        var dir = path.shift();
                        if( typeof root[dir] == 'undefined' ){
                            root[dir] = path[0] == '' ? [] : {};
                        }

                        arguments.callee(root[dir], path, value);
                    }else{
                        if( root instanceof Array ){
                            root.push(value);
                        }else{
                            root[path] = value;
                        }
                    }
                };
                var nvp = query.split('&');
                var data = {};
                for( var i = 0 ; i < nvp.length ; i++ ){
                    var pair = nvp[i].split('=');
                    var name = decodeURIComponent(pair[0]);
                    var value = decodeURIComponent(pair[1]);

                    var path = name.match(/(^[^\[]+)(\[.*\]$)?/);
                    var first = path[1];
                    if(path[2]){
                        //case of 'array[level1]' || 'array[level1][level2]'
                        path = path[2].match(/(?=\[(.*)\]$)/)[1].split('][')
                    }else{
                        //case of 'name'
                        path = [];
                    }
                    path.unshift(first);

                    setValue(data, path, value);
                }
                return data;
            },
            /**
             * 序列化表单对象
             * @method armer.serializeNodes
             * @static
             * @param obj {string|jQuery|NodeList|Element} 需要序列化的元素
             * @param [join] {string|function} 序列化同名元素的分隔符或者合并方法，默认返回元素的值或者多个值情况的数组
             * @param [ignoreAttrChecked=false] 是否忽略checked属性
             * @returns {{}}
             */
            serializeNodes: function(obj, join, ignoreAttrCheckedOrSelected){
                obj = $(obj).find('input,option,textarea').andSelf().not(':disabled, fieldset:disabled *');
                var result = {}, separator;
                if (typeof join == 'string') {
                    separator = join;
                    join = function(a){
                        return a.join(separator)
                    }
                } else if (join == null) {
                    join = function(a){
                        return (a.length > 1 ? a : a[0]) || '';
                    }
                }
                for (var i = 0; i <= obj.length; i++) {
                    if ('object' != typeof obj[i] || !('value' in obj[i]))
                        continue
                    // 不允许一般数组
                    var name = obj[i].name;
                    if (obj[i].tagName == 'OPTION') name = $(obj[i]).closest('select').attr('name');
                    if (!name) continue;
                    result[name] = result[name] || [];
                    if (ignoreAttrCheckedOrSelected  ||
                        (obj[i].tagName != 'OPTION' && obj[i].type != 'checkbox' && obj[i].type != 'radio' || obj[i].checked || obj[i].selected)
                        ) {
                        result[name].push(obj[i].value);
                    }
                }
                if (typeof join == 'function') {
                    for (var i in result) {
                        result[i] = join(result[i]);
                    }
                }
                return result
            },
            /**
             * 序列化通过对象或数组产生类似cookie、get等字符串
             * @method armer.serialize
             * @static
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
                function buildParams(i, value, assignment, add) {
                    var k;
                    if ($.isArray(value)) {
                        if (typeof value[0] == 'object') {
                            add(i, assume(value), assignment)
                        } else {
                            $.each(value, function(_, value) {
                                k = assume(value);
                                if (k !== void 0) add(i + '[]', k, assignment);
                            });
                        }
                    } else if ($.isPlainObject(value)) {
                        var k = assume(value);
                        if (k !== void 0) add(i, k, assignment);
                    } else if ($.isFunction(value)){
                        return;
                    } else if ('object' != typeof value) {
                        value = value == null ? '' : value;
                        add(i, value, assignment);
                    }
                }

                return function(obj, separator, assignment, join, encode){
                    if (join == null) {
                        join = ',';
                    }
                    if (typeof obj == 'string' && obj == '' || obj == null) return '';
                    else if ($.isArrayLike(obj)) {
                        return arguments.callee.call(this, $.serializeNodes(obj, join), separator, assignment, join, encode);
                    } else if ('object' == typeof obj) {
                        separator = separator || '&';
                        assignment = assignment || '=';
                        encode = encode == undefined ? true : encode;
                        var s = [],
                            arrSeparator,
                            add = function(key, value, assignment){
                                s.push(key + assignment + (encode ? encodeURIComponent(value) : value))
                            },
                            resource = $.extend({}, obj);
                        if (typeof join == 'string') {
                            arrSeparator = join;
                            join = function(a){
                                if (typeof a[0] == 'object')
                                    return a
                                else
                                    return a.join(arrSeparator);
                            }
                        }
                        if (typeof join == 'function') {
                            for (var i in resource) {
                                if ($.isArray(resource[i]))
                                    resource[i] = join(resource[i]);
                            }
                        }
                        $.each(resource, function(i, value){
                            buildParams(i, value, assignment, add);
                        })
                    } else {
                        throw new TypeError;
                    }
                    return s.join(separator);
                }
            }(),
            /**
             * 反序列化通过对象
             * @method armer.unserialize
             * @static
             * @param {String} str
             * @param {String} [separator] 分割符，默认&
             * @param {String} [assignment] 赋值符，默认=
             * @returns {Object|Array}
             */
            unserialize: function () {
                var r = /[\n\r\s]/g;
                function assume (value){
                    try {
                        value = decodeURIComponent(value)
                    } catch(e) {}
                    if (value.indexOf('{') == 0||value.indexOf('[') == 0) {
                        // 预测是对象或者数组
                        return JSON.parse(value);
                    } else if (value == '') {
                        //为空
                        return null
                        /*
                         } else if (!isNaN(Number(value).valueOf())) {
                         //数字
                         return Number(value).valueOf();
                         */
                    } else if (value == 'true') {
                        return true
                    } else if (value == 'false') {
                        return false
                    } else {
                        return value
                    }
                }
                function add(result, key, value) {
                    if (!(key in result))
                        result[key] = value;
                    else {
                        if (!$.isArray(result[key]))
                            result[key] = [result[key]];
                        result[key].push(value);
                    }

                }
                return function(str, separator, assignment, spliter){
                    if (str == '' || str == null) return {};
                    separator = separator || '&';
                    assignment = assignment || '=';
                    spliter = spliter || ',';
                    str = str.replace(r, '');
                    var group = str.split(separator),
                        result = {};
                    $.each(group, function(__, str){
                        var splits = str.split(assignment),
                            key = splits[0],
                            value = splits[1];
                        var m = key.match(/(.*)\[\]$/);

                        if (m) {
                            key = m[1];
                            result[key] = result[key] || [];
                        }

                        if (!value) return;
                        else {
                            var s = decodeURIComponent(value);
                            if (value.indexOf(spliter) > -1 && s.indexOf('[') != 0 && s.indexOf('{') != 0) {
                                result[key] = result[key] || [];
                                $.each(value.split(spliter), function(__, value){
                                    add(result, key, assume(value))
                                });
                            } else {
                                add(result, key, assume(value))
                            }
                        }
                    });
                    return result;
                }
            }(),
            /**
             * 判断一个对象是不是jQuery.Deferred
             * @method armer.isDeferred;
             * @static
             * @param obj
             * @returns {boolean}
             */
            isDeferred : function(obj){
                return typeof obj == 'object' && typeof obj.done == 'function' && typeof obj.fail == 'function';
            },
            /**
             * jQuery的isHidden方法，他丫的，这么好用为啥不弄成全局
             * @method armer.isHidden;
             * @static
             * @param elem
             * @returns {boolean}
             */
            isHidden: function(elem) {
                return $.css(elem, "display") === "none" || !$.contains(elem.ownerDocument, elem);
            },
            /**
             * 是否为类数组（Array, Arguments, NodeList与拥有非负整数的length属性的Object对象）
             * 如果第二个参数为true,则包含有字符串
             * @method armer.isArrayLike
             * @static
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
                    return typeof obj.callee == 'function' || obj.namedItem || (i >= 0) && (i % 1 === 0) && (hasOwn.call(obj, '0') || typeof obj.each == 'function' || typeof obj.forEach == 'function'); //非负整数
                }
                return false;
            },

            /**
             * 生成一个整数数组
             * @method armer.range
             * @static
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
             * @method armer.innerHTML
             * @static
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
             * @method armer.clearChild
             * @static
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
             * @method armer.defaultDisplay
             * @static
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
        /**
         * 视浏览器情况采用最快的异步回调
         * @method armer.nextTick
         * @static
         * @param [handler] {function} 需要绑定的函数
         */
        $.nextTick = global.setImmediate ? setImmediate.bind(global) : function(callback) {
            setTimeout(callback, 0)//IE10-11 or W3C
        };

    })();
    // 反序列化表单
    (function(){
        function setAsGroup(obj, key, item) {
            if (obj[key] == null){
                obj[key] = item;
                return
            }
            if (!$.isArray(obj[key]))
                obj[key] = [obj[key]];
            obj[key].push(item);
        }
        $.flatten = function(obj, combine){
            var a = {};
            function s(name, obj, b){
                if ($.type(obj) == 'object' || $.isArray(obj)) {
                    $.each(obj, function(i, item){
                        s((combine && $.isArray(obj) && typeof item != 'object') ? (name + '[]') : (name + '[' + i + ']'), item, b);
                    })
                } else setAsGroup(b, name, obj)

            }
            $.each(obj, function(key, item){
                s(key, item, a);
            });
            return a;
        };

        $.unserializeNodes = function(data, nodes, hooks, phpstyle){
            var callee = arguments.callee;
            hooks = hooks || {};
            nodes = $(nodes).find('input,select,textarea').andSelf();

            var b = {};

            $.each(data, function(key, item){
                if (!phpstyle)
                    setAsGroup(b, key, item);
                if (typeof item == 'object' && phpstyle == null) {
                    phpstyle = true;
                    return false;
                }
            });

            if (phpstyle)
                b = $.flatten(data, true);

            var a = {};
            nodes.each(function(key, node){
                var name = node.name;
                if (!name) return;
                if (!a[name]) a[name] = [];
                a[name].push(node);
            })
            $.each(a, function(key, nodes){
                var name = key.slice(0, -2);
                if (!b.hasOwnProperty(key) && !!~key.indexOf('[]') && b.hasOwnProperty(name)) {
                    b[key] = b[name]
                }
                if (!b[key]) return;
                (hooks[key] || callee.defaultHandler)(nodes, b[key], key, b);
            })
        }

        function has(values, node){
            var has = false;
            $.each(values, function(j, value){
                if (node.value == undefined && node.innerHTML == value || value == node.value) {
                    has = true;
                }
                if (has) return false;
            })
            return has;
        }

        $.vals = function(nodes, values){
            nodes = $(nodes);
            if (!values) return $.serializeNodes(nodes, false)[nodes[0].name];
            else {
                if (!$.isArray(values)) values = [values];
                if (nodes[0].tagName == 'SELECT' && nodes[0].multiple == true) {
                    nodes = $(nodes[0]).find('option');
                    $.each(nodes, function(i, node){
                        node.selected = has(values, node);
                    })
                } else if (nodes[0].type == 'checkbox' || nodes[0].type == 'radio') {
                    $.each(nodes, function(i, node){
                        node.checked = has(values, node);
                    });
                } else
                    $.each(nodes, function(i, node){
                        node.value = values[i];
                    })
            }
        }

        $.fn.vals = function(values){
            return $.vals(this, values);
        }

        $.unserializeNodes.defaultHandler = $.vals


        $.clearForm = function (form) {
            $(':input, select', form).not(':button, :submit, :reset, :radio').val('');
            $(':checkbox, :radio', form).prop('checked', false);
        }
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
        swf: 'flash',
        html: 'html'
    };

    // 基本语言扩充
    /** @namespace armer.Array */
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
         * @method armer.Array.pluck
         * @static
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
         * @method armer.Array.ensure
         * @static
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
         * @method armer.Array.removeAt
         * @static
         * @param target 目标数组
         * @param index 下标
         * @returns {boolean} 是否移除成功
         */
        removeAt: function(target, index) {
            return !!target.splice(index, 1).length
        },
        /**
         * 移除数组里对应元素
         * @method armer.Array.remove
         * @static
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
    /** @namespace armer.String */
    $.String = {
        /**
         * 截取字符串
         * @method armer.String.truncate
         * @static
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
         * @method armer.String.escapeHTML
         * @static
         * @param target 目标字符串
         * @returns {string}
         */
        escapeHTML: function(target) {
            return target.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        }
    };
    /** @namespace armer.Number */
    $.Number = {
        /**
         * 与PHP的number_format完全兼容
         * @method armer.Number.format
         * @static
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

    /** @namespace armer.support */
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

// TODO(wuhf): AMD/CMD加载器
// ========================================================
;(function ($, global) {

    var modules = {
        'armer': {
            exports: $
        },
        require: {exports: require},
        exports: {exports: {}},
        module: {exports: {}}
    };
    modules.jQuery = modules.jquery = modules.zepto = modules.armer;

    var currentUrl = location.href, xhrRequestURL = null;
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
        collector: [
            function (deps, factory){
                var withCMD = -1, i;
                for (i = 0; i < deps.length; i++) {
                    // 看deps里是否有require，是则找出其index
                    if (deps[i] == 'require') {
                        withCMD = i;
                    }
                }

                // CMD分析require
                if (typeof factory == "function" && !!~withCMD) {
                    var requireS, fn = factory.toString();
                    var args = fn.match(/^function[^(]*\(([^)]*)\)/)[1];
                    if ($.trim(args) != '')  {
                        args = args.split(',');
                        requireS = $.trim(args[withCMD]);
                        fn.replace(RegExp('[^\\w\\d$_]' + requireS + '\\s*\\(([^)]*)\\)', 'g'), function(_, dep){
                            dep = eval.call(null, dep);
                            if (typeof dep == 'string') deps.push(dep);
                        })
                    }
                }
            },
            function(deps, factory){
                var s = ['__inline'], fn = factory.toString();
                $.each(s, function(_, item){
                    fn.replace(RegExp('[^\\w\\d$_]' + item + '\\s*\\(([^)]*)\\)', 'g'), function(_, dep){
                        dep = eval.call(null, dep);
                        if (typeof dep == 'string') deps.push(item + '!' + dep);
                    })
                });
            }
        ],
        plugins: {
            // domready 插件
            domready: {
                config: function(){
                    var mod = {
                        dfd: $.Deferred(),
                        exports: $,
                        method: 'domready'
                    };
                    $(function(){
                        mod.dfd.resolveWith(mod, [mod]);
                    });
                    return mod;
                }
            },
            auto: {
                config: function(config){
                    var url;
                    if ($.type(this.url) == 'string') {
                        url = $.URL(this.url, this.parent);
                    } else url = this.url;
                    this.ext = url.extension();
                    if (!this.ext) {
                        url.extension(defaults.ext);
                        this.ext = defaults.ext;
                    } else if (!$.ajax.ext2Type[this.ext]) {
                        url.extension(defaults.ext, true);
                        this.ext = defaults.ext;
                    }
                    if (this.ext == defaults.ext) {
                        this.name = url.fileNameWithoutExt()
                    } else {
                        this.name = url.fileName()
                    }
                    url.search('callback', 'define');
                    this.url = url.toString();
                    this.type = $.ajax.ext2Type[this.ext];
                },
                callback: function(){

                    if (this.type !== 'script') {
                        this.exports = this.originData;
                    } else if (this.factory) {
                        var exports = this.factory.apply(this, getExports(arguments))
                        if (exports != null)
                            this.exports = exports
                        else if (this.exports == null)
                            this.exports = modules.exports.exports
                    } else if (this.exports == null)
                        this.exports = modules.exports.exports

                    this.dfd.resolveWith(this, [this]);
                }
            }
        }
    };

    // 构造模块
    require.Model = function Model(config){
        $.extend(this, config);
        //throw Error(this.id)
        modules[this.id] = this;
        //if (this.url) modules[this.method + this.url] = this;
        //else if (this.id) modules[this.id] = this;
    };
    require.Model.prototype = {
        // 处理模块
        fire: function(data){
            // 使用shim模式
            var mod = this;
            var shim = defaults.shim[mod.name] || {};
            if ($.isArray(shim))
                shim = {
                    deps: shim
                }
            mod.deps = mod.deps || shim.deps
            mod.originData = data;
            var success = function(){
                modules.module.exports = mod;
                modules.exports.exports = {};
                currentUrl = mod.url;
                if (shim.exports)
                    modules.exports.exports = eval('(function(){return ' + shim.exports + '})()');
                mod.factory = mod.factory || shim.init;
                defaults.plugins[mod.method].callback.apply(mod, arguments);
                modules.module.exports = null;
            }
            if (mod.deps && mod.deps.length) {
                currentUrl = mod.url;
                innerRequire(mod.deps).done(success).fail(function(){
                    mod.dfd.rejectWith(mod, arguments);
                });
            } else
            // 避免加载过快 parseDep 时currentUrl的出错
                $.nextTick(function(){success()}, 0);

            // 这两个是为CMD服务的，只读
            mod.dependencies = mod.deps;
            mod.uri = mod.url;
        },
        error: function(errState){
            this.err = errState
            this.dfd.rejectWith(this, [this]);
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
            if (!(mod = modules[config] || modules[id2Config(config, currentUrl).id])) {
                // 不存在则是新的模块
                config = id2Config(config);
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
            // 处理同样地址同样方式加载但不同name的模块
            if (!(mod = modules[config.id]))
                mod = new require.Model(config);
            // 模块作为参数情况
        } else if (typeof config == 'string')
            mod = new require.Model({url: config})

        return mod;
    }
    /**
     * 请求模块
     * @param deps 依赖列表
     * @returns {$.Deferred.promise}
     */

    function innerRequire(deps) {
        if (!$.isArray(deps)) deps = [deps];
        var mDps = [], mod;
        for (var i = 0; i < deps.length; i++) {
            mod = parseDep(deps[i]);
            // 当不存在dfd的时候证明这个模块没有初始化
            // 当存在状态为rejected的模块，则重新请求
            if (!mod.dfd || mod.dfd.state() == 'rejected') {
                mod.dfd = $.Deferred();
                // 如果factory或者exports没有定义，那么可以判断出是通过异步加载已存在但未请求成功的模块
                // TODO:这个判断貌似不太准确
                if (!mod.factory  && !('exports' in mod))
                    (function(mod){
                        requesting[mod.url] = mod;
                        var options = {
                            url: mod.url,
                            cache: true,
                            crossDomain: defaults.charset ? true : void 0,
                            //crossDomain: true,
                            dataType: mod.type || $.ajax.ext2Type[defaults.ext],
                            scriptCharset: defaults.charset,
                            success: function(data) {
                                var bmod;
                                if (requesting[mod.url]) {
                                    if (bmod = requesting[mod.url].bmod) {
                                        var dfd = mod.dfd;
                                        $.extend(mod, bmod);
                                        mod.dfd = dfd;
                                        modules[bmod.id] = mod;
                                    }
                                    delete requesting[mod.url]
                                }
                                mod.fire(data);
                            },
                            error: function(){
                                mod.error(arguments);
                                delete requesting[mod.url];
                            },
                            converters: {
                                "text script": function(text) {
                                    xhrRequestURL = mod.url
                                    jQuery.globalEval(text);
                                    xhrRequestURL = null;
                                    return text;
                                }
                            }
                        };
                        $.ajax(options);
                    })(mod);
                // 如果factory或者exports已经定义过，那么就直接处理该模块
                else if (mod.fire)
                    mod.fire();
                // 一些特殊的模块，只包括exports的
                else mod.dfd.resolveWith(mod, [mod])
            }
            mDps.push(mod.dfd);
        }
        return $.when.apply($, mDps);
    }

    function require(deps, callback, errorCallback){
        // 兼容CMD模式
        if (!callback) {
            var mod;
            if (mod = modules[deps] || modules[id2Config(deps, currentUrl).id] || modules[id2Config(deps).id])
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
     * @param name 模块name用于记录缓存这个模块
     * @param [deps] 依赖列表，这个模块需要依赖那些模块
     * @param factory 工厂，用于处理返回的模块
     * @returns {Model}
     */
    function define(name, deps, factory){
        if (typeof name != 'string') {
            factory = deps;
            deps = name;
            name = null;
        }
        if (factory === undefined) {
            factory = deps;
            deps = ['require', 'exports', 'module'];
        }
        var mod, config;

        currentUrl = xhrRequestURL || $.URL.current();
        // 如果正在请求这个js
        if (mod = requesting[currentUrl]) {
            if (name && (config = id2Config(name, currentUrl)).id !== mod.id) {
                // 如果define的名字不一样，记录bmod作为后备模块，当文件请求完毕仍然没有同名模块，则最后一个后备模块为该模块
                mod = new require.Model(config);
                requesting[currentUrl].bmod = mod;
            } else {
                // define()这种形式默认是这个模块
                delete mod.bmod;
                delete requesting[currentUrl]
            }
        } else {
            //如果没有请求这个js
            if (!name) $.error('can\'t create anonymous model here')
            else mod = new require.Model(id2Config(name, currentUrl))
        }

        mod.deps = deps;
        mod.type = 'script';

        $.each(defaults.collector, function(i, item){
            item(mod.deps, factory);
        });

        if (typeof factory == 'function')
            mod.factory = factory;
        else
            mod.exports = factory;
        return mod;
    }

    function id2Config(name, url) {
        var s, c = {name: name};
        s = name.split('!');
        // 分析处理方法
        if (s.length == 2) {
            c.method = s[0];
            c.name = s[1];
        } else if (!!~name.indexOf('!')) {
            c.method = s[0];
        } else {
            c.method = defaults.method;
            c.name = s[0];
        }
        s = c.name.split(':');
        if (/:\/\//.test(c.name) && s.length == 2 || s.length == 1)
            c.namespace = defaults.namespace;
        else
            c.namespace = s.shift();
        c.name = s.join(':');
        if (url) {
            c.url = url;
        } else {
            c.parent = currentUrl;
            c.url = c.name;
            //别名机制
            var tmpExt = '.' + defaults.ext;
            var path;
            if (name.indexOf(tmpExt) == name.length - tmpExt.length) {
                path = defaults.paths[name.substr(name.length)]
            } else {
                path = defaults.paths[name + tmpExt];
            }
            c.url = defaults.paths[name] || path || c.url;
            c = defaults.plugins[c.method].config.call(c) || c;
        }
        c.id = c.id || c.method + '!' + (c.namespace ? (c.namespace + ':') : '') +
            (c.name ? c.name : '')  + (c.url ? ('@' + c.url) : '')
        return c;
    }
    define.amd = define.cmd = modules;
    require.defaults = defaults;
    require.config = function(options){
        options = $.mixOptions({}, options);
        if (options.paths) $.each(options.paths, function(i, item){
            if ($.type(item) == 'string') {
                options.paths[i] = $.URL(item);
            }
        });
        $.mixOptions(this.defaults, options);

    };
    // CMD的async方法实际是就是AMD的require
    require.async = require;
    require.resolve = function(url){
        return modules.module.exports.resolve(url);
    };
    require.requesting = requesting;
    require.register = define;
    $.require = require;
    $.define = define;
    $.use = function(deps){
        return require(deps, $.noop);
    }


    defaults.plugins.domReady = defaults.plugins.ready = defaults.plugins.domready;
    $.each(['js', 'css', 'text', 'html'], function(i, item){
        defaults.plugins[item] = {
            config: function(){
                var url;
                if ($.type(this.url) == 'string') {
                    url = $.URL(this.url, this.parent);
                } else url = this.url;
                this.ext = url.extension();
                if (this.ext == defaults.ext) {
                    this.name = url.fileNameWithoutExt()
                } else {
                    this.name = url.fileName()
                }
                url.search('callback', 'define');
                this.url = url.toString();
                this.type = $.ajax.ext2Type[item] || item;
            },
            callback: defaults.plugins.auto.callback
        }
    });
    defaults.plugins['__inline'] = {
        config: function(){
            var url;
            if ($.type(this.url) == 'string') {
                url = $.URL(this.url, this.parent);
            } else url = this.url;
            this.ext = url.extension();
            if (this.ext == defaults.ext)
                this.name = url.fileNameWithoutExt();
            else
                this.name = url.fileName();
            this.type = 'text'
            url.search('callback', 'define');
            this.url = url.toString();
        },
        callback: defaults.plugins.auto.callback
    };



    var nodes = document.getElementsByTagName("script");
    defaults = $.mixOptions(defaults, window.require, $(nodes[nodes.length - 1]).data());

    if (!window.require) window.require = require;
    if (!window.define) window.define = define;
    window.__inline = function(url){
        return require('__inline!' + url);
    }

    if (defaults.main) $(function(){require(defaults.main, $.noop)});
})(armer, window);

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
    //IE8的Object.defineProperty只对DOM有效
    // 判断是否支持defineProperty
    var defineProperty = Object.defineProperty;

    function isFunction(obj){
        return 'function' === typeof obj;
    }
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }

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
        // TODO: 修复各种bug
        //=====================
        //------------------------------------------------
        //修正IE67下unshift不返回数组长度的问题
        //http://www.cnblogs.com/rubylouvre/archive/2010/01/14/1647751.html
        if ([].unshift(1) !== 1) {
            var _unshift = Array[P].unshift;
            Array[P].unshift = function () {
                _unshift.apply(this, arguments);
                return this.length; //返回新数组的长度
            }
        }

        //修复IE splice必须有第二个参数的bug
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

        // 修复 Date.get/setYear() (IE5-7)
        if ((new Date).getYear() > 1900) {
            //http://stackoverflow.com/questions/5763107/javascript-date-getyear-returns-different-result-between-ie-and-firefox-how-to
            Date[P].getYear = function () {
                return this.getFullYear() - 1900;
            };
            Date[P].setYear = function (year) {
                return this.setFullYear(year); //+ 1900
            };
        }

        // 修复IE6 toFixed Bug
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

        //  string.substr(start, length)参考 start
        //  要抽取的子串的起始下标。如果是一个负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1指定字符串中的最后一个字符，-2指倒数第二个字符，以此类推。
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

        //safari5+是把contains方法放在Element.prototype上而不是Node.prototype
        if (!document.documentElement) {
            Node.prototype.contains = function(arg) {
                return !!(this.compareDocumentPosition(arg) & 16)
            }
        }
        if (!document.contains) { //IE6-11的文档对象没有contains
            document.contains = function(b) {
                return fixContains(this, b)
            }
        }


        //=====================================
        // TODO: ES5补充部分
        //=====================================

        //=====================
        // TODO: Object
        //=====================
        //第二个参数仅在浏览器支持Object.defineProperties时可用
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
            //取得其所有键名以数组形式返回
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

        //用于创建javascript1.6 Array的迭代器

        function iterator(vars, body, ret) {
            var fun = 'for(var ' + vars + 'i=0,n = this.length;i < n;i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret;
            return Function("fn,scope", fun);
        }

        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) == "[object Array]";
        };

        mix(Array[P], {
            //定位操作，返回数组中第一个等于给定参数的元素的索引值。
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
            //定位引操作，同上，不过是从后遍历。
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
            //迭代操作，将数组的元素挨个儿传入一个函数中执行。Ptototype.js的对应名字为each。
            forEach: iterator('', '_', ''),
            //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Ptototype.js的对应名字为collect。
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Ptototype.js的对应名字为any。
            some: iterator('', 'if(_)return true', 'return false'),
            //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Ptototype.js的对应名字为all。
            every: iterator('', 'if(!_)return false', 'return true'),
            //归化类 javascript1.8  将该数组的每个元素和前一次调用的结果运行一个函数，返回最后的结果。
            reduce: function (fn, lastResult, scope) {
                if (this.length == 0)
                    return lastResult;
                var i = lastResult !== undefined ? 0 : 1;
                var result = lastResult !== undefined ? lastResult : this[0];
                for (var n = this.length; i < n; i++)
                    result = fn.call(scope, result, this[i], i, this);
                return result;
            },
            //归化类 javascript1.8 同上，但从右向左执行。
            reduceRight: function (fn, lastResult, scope) {
                var array = this.concat().reverse();
                return array.reduce(fn, lastResult, scope);
            }
        });

        // ISO 8601
        if (!Date.prototype.toISOString){
            var isLeapYear = function(year){
                return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
            };
            var operHoursAndMinutes = {};
            operHoursAndMinutes['+'] = function(minusHours, minusMinutes, year, month, date, hours, minutes, seconds, milliseconds){
                var ret = {};
                minutes -= minusMinutes;
                hours -= minusHours;
                if (minutes < 0){
                    hours -= 1;
                    minutes += 60;
                }
                if (hours < 0 ){
                    --date;
                    hours += 24;
                    if (date < 0){
                        --month;
                        if (month < 0){
                            --year;
                            month = 11;
                        }
                        if (month % 2 === 0){
                            date += 31;
                        }
                        else if (month === 1)
                        {
                            date += isLeapYear(year) ? 29 : 28;
                        }
                        else{
                            date += 30;
                        }

                        if (month < 0){
                            --year;
                            month += 12;
                        }
                    }
                }

                ret.year = year;
                ret.month = month;
                ret.date = date;
                ret.hours = hours;
                ret.minutes = minutes;
                ret.seconds = seconds;
                ret.milliseconds = milliseconds;

                return ret;
            };
            operHoursAndMinutes['-'] = function(addHours, addMinutes, year, month, date, hours, minutes, seconds, milliseconds){
                var ret = {};

                minutes += addMinutes;
                hours += addHours;
                if (minutes >= 60){
                    hours += 1;
                    minutes -= 60;
                }
                if (hours >=24){
                    ++date;
                    hours -= 24;
                    var dateOfCurrMonth = month % 2 === 0 ? 31 : (month === 1 ? (isLeapYear(year) ? 29 : 28) : 30);
                    if (date >= dateOfCurrMonth){
                        ++month;
                        date -= dateOfCurrMonth;

                        if (month >= 12){
                            ++year;
                            month -= 12;
                        }
                    }
                }

                ret.year = year;
                ret.month = month;
                ret.date = date;
                ret.hours = hours;
                ret.minutes = minutes;
                ret.seconds = seconds;
                ret.milliseconds = milliseconds;

                return ret;
            };
            var regExp = new RegExp('^(\\d{4,4})'
            + '-((?:0[123456789]|1[012]))'
            + '-((?:0[123456789]|[12]\\d|3[01]))'
            + 'T'
            + '((?:[01]\\d|2[0123]))'
            + ':([012345]\\d)'
            + ':([012345]\\d)'
            + '(?:.(\\d{3}))?'
            + '(Z|[+-](?:[01]\\d|2[0123]):?[012345]\\d)$');
            var parseISOString2UTC = function(ISOString){
                var ret = {};
                var year = Number(RegExp.$1)
                    , month = Number(RegExp.$2) - 1
                    , date = Number(RegExp.$3)
                    , hours = Number(RegExp.$4)
                    , minutes = Number(RegExp.$5)
                    , seconds = Number(RegExp.$6)
                    , offset = RegExp.$8
                    , milliseconds;
                milliseconds = (milliseconds = Number(RegExp.$7), !isNaN(milliseconds) && milliseconds || 0);

                if (offset === 'Z'){
                    ret.year = year;
                    ret.month = month;
                    ret.date = date;
                    ret.hours = hours;
                    ret.minutes = minutes;
                    ret.seconds = seconds;
                    ret.milliseconds = milliseconds;
                }
                else if (typeof offset !== 'undefined'){
                    var symbol = offset.charAt(0);
                    var offsetHours = Number(offset.substring(1,3));
                    var offsetMinutes = Number(offset.substring(offset.length > 5 ? 4 : 3));

                    ret = operHoursAndMinutes[symbol](offsetHours, offsetMinutes, year, month, date, hours, minutes, seconds, milliseconds);
                }

                return ret;
            };

            var _nativeDate = Date;
            Date = function(Y,M,D,H,m,s,ms){
                var ret, len = arguments.length;
                if (!(this instanceof this.arguments.callee)){
                    ret = this.arguments.callee.apply(null, arguments);
                }
                else if (len === 1 && typeof arguments[0] === 'string' && regExp.test(arguments[0])){
                    var tmpRet;
                    try{
                        tmpRet = parseISOString2UTC();
                    }
                    catch(e){
                        console && console.log('Invalid Date');
                        return void 0;
                    }

                    ret = new _nativeDate(_nativeDate.UTC(tmpRet.year, tmpRet.month, tmpRet.date, tmpRet.hours, tmpRet.minutes, tmpRet.seconds, tmpRet.milliseconds));
                }
                else if (typeof arguments[0] === 'string'){
                    ret = new _nativeDate(arguments[0]);
                }
                else{
                    ret = len >= 7 ? new _nativeDate(Y, M, D, H, m, s, ms)
                        : len >= 6 ? new _nativeDate(Y, M, D, H, m, s)
                        : len >= 5 ? new _nativeDate(Y, M, D, H, m)
                        : len >= 4 ? new _nativeDate(Y, M, D, H)
                        : len >= 3 ? new _nativeDate(Y, M, D)
                        : len >= 2 ? new _nativeDate(Y, M)
                        : len >= 1 ? new _nativeDate(Y)
                        : new _nativeDate();
                }

                return ret;
            };
            Date.prototype = _nativeDate.prototype;
            Date.prototype.constructor = Date;

            var _pad = function(num){
                if (num < 10){
                    return '0' + num;
                }
                return num;
            };
            var _padMillisecond = function(num){
                if (num < 10){
                    return '00' + num;
                }
                else if (num < 100){
                    return '0' + num;
                }
                return num;
            };
            Date.prototype.toISOString = function(){
                return [this.getUTCFullYear(), '-', _pad(this.getUTCMonth() + 1), '-', _pad(this.getUTCDate()), 'T'
                    , _pad(this.getUTCHours()), ':', _pad(this.getUTCMinutes()), ':', _pad(this.getUTCSeconds()), '.', _padMillisecond(this.getUTCMilliseconds()), 'Z'].join('');
            };

            // 复制可枚举的类成员
            for (var clsProp in _nativeDate){
                if (_nativeDate.hasOwnProperty(clsProp)){
                    Date[clsProp] = _nativeDate[clsProp];
                }
            }
            // 复制不可枚举的类成员
            var innumerableMems = ['UTC'];
            for (var i = 0, clsProp; clsProp = innumerableMems[i++];){
                Date[clsProp] = _nativeDate[clsProp];
            }

            Date.parse = function(str){
                if (['string', 'number'].indexOf(typeof str) === -1) return NaN;

                var isMatch = regExp.test(str), milliseconds = 0;
                if (!isMatch) return _nativeDate.parse(str);

                var tmpRet = parseISOString2UTC();

                return _nativeDate.UTC(tmpRet.year, tmpRet.month, tmpRet.date, tmpRet.hours, tmpRet.minutes, tmpRet.seconds, tmpRet.milliseconds);
            };
            Date.now = Date.now
            || function(){
                return +new this();
            };
        }

        //=====================
        // TODO: String
        //=====================

        //String扩展
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
        // TODO: ES6补充部分
        //=====================================
        mix(String[P], {
            repeat: function (n) {
                //将字符串重复n遍
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
                //判定是否以给定字符串开头
                return this.indexOf(str) === 0;
            },
            endsWith: function (str) {
                //判定是否以给定字符串结尾
                return this.lastIndexOf(str) === this.length - str.length;
            },
            contains: function (s, position) {
                //判断一个字符串是否包含另一个字符
                return ''.indexOf.call(this, s, position >> 0) !== -1;
            }
        });
        mix(Number[P], {
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
    }



    //TODO: fix localStorage
    // 本地存储的兼容方案
    // http://www.cnblogs.com/zjcn/archive/2012/07/03/2575026.html#2607520
    // https://github.com/marcuswestin/store.js
    (function (win, doc) {
        if(!($.support.localStorage = !!win.localStorage) && doc.documentElement.addBehavior){
            var storage, store, box, container;
            //存储文件名（单文件小于128k，足够普通情况下使用了）
            //cookie大小4096, 0.4K X 50个大概20K，可见userdata大的多
            var FILENAME = win.location.hostname || 'localStorage';
            try{
                //由于#userData的存储仅适用于特定的路径，
                //我们需要以某种方式关联我们的数据到一个特定的路径。我们选择/favicon.ico作为一个非常安全的目标，
                //因为所有的浏览器都发出这个URL请求，而且这个请求即使是404也不会有危险。
                //我们可以通过一个ActiveXObject(htmlfile)对象的文档来干这事。
                //(参见:http://msdn.microsoft.com/en-us/library/aa752574(v = VS.85). aspx)
                //因为iframe的访问规则允许直接访问和操纵文档中的元素，即使是404。
                //这文档可以用来代替当前文档（这被限制在当前路径）执行#userData的存储。
                container = new ActiveXObject('htmlfile');
                container.open();
                container.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>');
                container.close();
                //container返回的是htmlfile的document
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
                } else if (type == 'date') {
                    return feed.toISOString();
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
            //好吧，这里复制了一遍jQ的，以免递归出错
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

    //TODO polyfill Set Map
    (function(support, golbal){
        if (support) return;

        golbal.Map = function(array) {
            var that = this;
            this._keys = [];
            this.length = this.size = 0;
            if (array) array.forEach(function(item){
                if (!isArray(item))
                    throw Error('Iterator value ' + item.toString() + ' is not an entry object');
                that['set'](item[0], item[1]);
            })
        }
        golbal.Map.prototype = {
            has: function(key){
                return !!~this._keys.indexOf(key);
            },
            "set": function(key, value){
                var index = this._keys.indexOf(key);
                if (!~index) {
                    this._keys.push(key);
                    [].push.call(this, value);
                } else {
                    this[index] = value;
                }
                this.size = this.length;
            },
            "get": function(key){
                var index = this._keys.indexOf(key);
                return this[index];
            },
            "delete": function(key){
                var index = this._keys.indexOf(key);
                if (!~index) return false;
                this._keys.splice(index, 1);
                [].splice.call(this, index, 1);
                this.size = this.length;
                return true
            },
            clear: function(){
                for (var i = this._keys.length - 1; i >= 0; i--) {
                    delete this[i];
                }
                this.length = this.size = 0;
                this._keys = [];
            },
            forEach: function(iterator, context){
                context = context || this;
                for (var i = 0; i < this._keys.length; i++) {
                    if (iterator.call(context, this[i], this._keys[i], this) === false) return
                }
            }
        };
        golbal.Set = function(array){
            var that = this;
            this.length = this.size = 0;
            if (array && !isArray(array)) throw Error(array.toString() + ' is not iterable')
            array.forEach(function(item){
                that.add(item);
            })
        };
        golbal.Set.prototype = {
            add: function(item){
                if (!this.has(item)) {
                    [].push.call(this, item);
                }
                this.size = this.length;
                return this;
            },
            "delete": function(item){
                var index = [].indexOf.call(this, item);
                if (!~index) return false;
                [].splice.call(this, index, 1);
                this.size = this.length;
                return true;
            },
            has: function(item){
                return !!~[].indexOf.call(this, item)
            },
            clear: function(){
                for (var i = this.length - 1; i >= 0; i--) {
                    delete this[i];
                }
                this.length = 0;
                this.size = this.length;
            },
            forEach: function(iterator, context){
                context = context || this;
                for (var i = 0; i < this.length; i++) {
                    if (iterator.call(context, this[i], i, this) === false) return
                }
            }
        }
    })(typeof window.Set == 'function', window);

    // TODO: polyfill Promise
    (function(support, golbal){
        if (support) {
            return;
        }
        var PENDING = 'pending', REJECTED = 'rejected', RESOLVED = 'resolved', FULFILLED = "fulfilled";
        var valueKey = '[[PromiseValue]]', stateKey = '[[PromiseStatus]]';
        function isThenable(obj){
            return obj && typeof obj['then'] == 'function';
        }
        function transition(status,value){
            var promise = this;
            if(promise[stateKey] !== PENDING) return;
            // 所以的执行都是异步调用，保证then是先执行的
            setTimeout(function(){
                promise[stateKey] = status;
                publish.call(promise,value);
            });
        }
        function publish(val){
            var promise = this,
                fn,
                st = promise[stateKey] === FULFILLED,
                queue = promise[st ? '_resolves' : '_rejects'];

            while(fn = queue.shift()) {
                val = fn.call(promise, val) || val;
            }
            promise[valueKey] = val;
            promise['_resolves'] = promise['_rejects'] = undefined;
        }
        function Promise(callback) {
            if (!isFunction(callback))
                throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
            if (!(this instanceof Promise)) return new Promise(callback);
            var promise = this;
            promise[valueKey] = undefined;
            promise[stateKey] = PENDING;
            promise._resolves = [];
            promise._rejects = [];
        }
        Promise.prototype = {
            then: function(onFulfilled,onRejected){
                var promise = this;
                // 每次返回一个promise，保证是可thenable的
                return Promise(function(resolve,reject){
                    function callback(value){
                        var ret = isFunction(onFulfilled) && onFulfilled(value) || value;
                        if(isThenable(ret)){
                            ret.then(function(value){
                                resolve(value);
                            }, function(reason){
                                reject(reason);
                            });
                        }else{
                            resolve(ret);
                        }
                    }
                    function errback(reason){
                        reason = isFunction(onRejected) && onRejected(reason) || reason;
                        reject(reason);
                    }
                    if(promise[stateKey] === PENDING){
                        promise._resolves.push(callback);
                        promise._rejects.push(errback);
                    }else if(promise[stateKey] === FULFILLED){ // 状态改变后的then操作，立刻执行
                        callback(promise[valueKey]);
                    }else if(promise[stateKey] === REJECTED){
                        errback(promise[valueKey]);
                    }
                });
            },
            'catch': function(onRejected){
                return this.then(undefined, onRejected);
            },
            reject: function(arg){
                return Promise(function(resolve,reject){
                    reject(arg)
                })
            }
        }

        Promise.all = function(promises){
            if (!isArray(promises)) {
                throw new TypeError('You must pass an array to all.');
            }
            return Promise(function(resolve,reject){
                var i = 0,
                    result = [],
                    len = promises.length;

                function resolver(index) {
                    return function(value) {
                        resolveAll(index, value);
                    };
                }

                function rejecter(reason){
                    reject(reason);
                }

                function resolveAll(index,value){
                    result[index] = value;
                    if(index == len - 1){
                        resolve(result);
                    }
                }

                for (; i < len; i++) {
                    promises[i].then(resolver(i),rejecter);
                }
            });
        }

        Promise.race = function(promises){
            if (!isArray(promises)) {
                throw new TypeError('You must pass an array to race.');
            }
            return Promise(function(resolve,reject){
                var i = 0,
                    len = promises.length;

                function resolver(value) {
                    resolve(value);
                }

                function rejecter(reason){
                    reject(reason);
                }

                for (; i < len; i++) {
                    promises[i].then(resolver,rejecter);
                }
            });
        }

        golbal.Promise = Promise;
    })(window.Promise, window);

    //TODO: fix hashchange
    (function(DOC){
        var hashchange = 'hashchange';
        $.support.hashchange = ('on' + hashchange) in window && ( document.documentMode === void 0 || document.documentMode > 7 );

        $.fn[ hashchange ] = function(callback){
            return callback?  this.bind(hashchange, callback ) : this.fire( hashchange);
        };

        $.fn[ hashchange ].delay = 50;

        if(!$.support.hashchange){
            var iframe, timeoutID, html = '<!doctype html><html><body>#{0}</body></html>'
            if( $.fn[ hashchange ].domain){
                html = html.replace("<body>","<script>document.domain ="+
                $.fn[ hashchange ].domain +"</script><body>" )
            }

            function getHash ( url) {//用于取得当前窗口或iframe窗口的hash值
                url = url || DOC.URL
                return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
            }
            function getHistory(){
                return getHash(iframe.location);
            }
            function setHistory(hash, history_hash){
                var doc = iframe.document;
                if (  hash !== history_hash ) {//只有当新hash不等于iframe中的hash才重写
                    //用于产生历史
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
                            //创建一个隐藏的iframe，使用这博文提供的技术 http://www.paciellogroup.com/blog/?p=604.
                            //iframe是直接加载父页面，为了防止死循环，在DOM树未建完之前就擦入新的内容
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
                                var hash = getHash(),//取得主窗口中的hash
                                    history_hash = iframe.document.body.innerText;//取得现在iframe中的hash
                                if(hash !== last_hash){//如果是主窗口的hash发生变化
                                    setHistory(last_hash = hash, history_hash )
                                    $(desc.currentTarget).fire(hashchange)
                                }else if(history_hash !== last_hash){//如果按下回退键，
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

/*!
 * armerjs - v0.8.9 - 2015-05-04 
 * Copyright (c) 2015 Alphmega; Licensed MIT() 
 */
;
(function ($) {
    var global = window,
        DOC = global.document,
        seval = global.execScript ? "execScript" : "eval",
        sopen = (global.open + '').replace(/open/g, ""),
        head = DOC.head || DOC.getElementsByTagName("head")[0],
        rformat = /{{([^{}]+)}}/gm,
        noMatch = /(.)^/,
        escapes = {
            "'": "'",
            '\\': '\\',
            '\r': 'r',
            '\n': 'n',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        },
        escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;


    function isArgs() {
        return arguments !== undefined;
    }

    function template(text, data, settings) {
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
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function (match) {
                    return '\\' + escapes[match];
                });
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
        var template = function (data) {
            return render.call(this, data, $);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    }

    template.settings = {
        evaluate: /\[%([\s\S]+?)%]/g,
        interpolate: /\[%=([\s\S]+?)%]/g,
        escape: /\[%-([\s\S]+?)%]/g
    };


    $.fn.template = function () {
        return this.each(function () {
            if ($(this).data('template')) return false;
            var compiler = template($.trim(this.nodeValue || this.innerHTML));
            var $placeholder = $(document.createComment('template here'));
            $(this).replaceWith($placeholder).data('template', compiler).data('t-placeholder', $placeholder);
        })
    };
    $.fn.templateRender = function () {
        this.template();
        return $(this[0]).data('template');
    };

    $.fn.replaceAllWith = function(r){
        this.eq(0).replaceWith(r).end().slice(1).remove();
        return this;
    }

    $.fn.compile = function(data){
        return this.each(function(){
            var $this = $(this);
            var p, $t;
            var t;
            $this.template()
            p = $this.data('t-placeholder');
            t = $this.data('template');
            $t = $(t(data));
            p.replaceAllWith($t);
            $this.data('t-placeholder', $t);
        })
    }

    $.fn.render = function(data){
        this.compile(data);
        return this.data('t-placeholder');
    }

    function getWs(target, name) {
        var a = [];
        name.replace(/[a-zA-Z][a-zA-Z0-9]*/g, function (i) {
            a.push(i)
        });
        var key = a.pop();
        return [a.length ? (new Function('obj', 'return obj' + '["' + a.join('"]') + '"]'))(target) : target, key]
    }

    /**
     * @for armer
     */
    $.extend($, {
        // apply的构造体版
        applyConstr: function (constructor, args) {
            var pram1 = '';
            var pram2 = '';
            for (var i = 0; i < args.length; i++) {
                pram1 += 'var p' + i + ' = args[' + i + '];';
                pram2 += i == 0 ? 'p' + i : ',p' + i;
            }
            return (new Function('constructor', 'args', pram1 + 'return new constructor(' + pram2 + ')'))(constructor, args)
        },
        /**
         * 为hash选项对象添加默认成员
         * @method defaults
         * @static
         * @param {object} obj 需要扩展的对象
         * @param {object} [defaults]*  需要作为默认扩展的对象
         * @returns {*}
         */
        defaults: function (obj) {
            $.each($.slice(arguments, 1), function (_, source) {
                if (source) {
                    for (var prop in source) {
                        if (obj[prop] == null) obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        },
        cloneOf: function (item) {
            var name = $.type(item);
            var cap = $.capitalize(name)
            if ($[cap] && typeof $[cap].clone == 'function')
                return $[cap].clone(item)
            else return item;
        },

        /*
         ============= is 系列 ================
         */
        /**
         * 判断一个字符串是否为空字符串
         * @method isBlank
         * @static
         * @param str {string} 目标字符串
         * @returns {boolean}
         */
        isBlank: function (str) {
            return /^\s*$/.test(str);
        },
        /**
         * 判断一个目标变量是否为字符串
         * @method isString
         * @static
         * @param target {*} 目标变量
         * @returns {boolean}
         */
        isString: function (target) {
            return $.type(target) == 'string';
        },
        isArguments: function (obj) {
            if (obj != null) {
                if ($.stringType(obj) == "Arguments") {
                    return true;
                } else if ('callee' in obj) {
                    try {
                        return isArgs.apply(this, obj);
                    } catch (e) {
                    }
                }
            }
            return false;
        },
        /**
         * 判定目标对象是否包括名字为methodKey的原生方法，如$.isNative("JSON",window)
         * @method isNative
         * @static
         * @param {string} methodKey 需要判断的方法的键
         * @param {object|function} target 目标对象
         * @return {boolean}
         */
        isNative: function (methodKey, target) {
            var m = target ? target[methodKey] : false,
                r = new RegExp(methodKey, "g");
            return !!(m && typeof m != "string" && sopen === (m + "").replace(r, ""));
        },
        /**
         * 判定目标对象是否包括名字为eventName的原生事件
         * @method isNativeEvent
         * @static
         * @param {string} eventName 需要判断的方法的键
         * @param {object|function} target 目标对象
         * @return {boolean}
         */
        isNativeEvent: function (eventName, target) {
            target = target || DOC;
            eventName = 'on' + eventName;
            var osc = target[eventName];
            var support = false;
            try {
                target[eventName] = 0;
            } catch (e) {
            }
            support = target[eventName] === null;
            target[eventName] = osc;
            return support;
        },
        /**
         * 是否为空对象
         * @method isEmptyObject
         * @static
         * @param {Object} obj 需要判断的目标对象
         * @return {Boolean}
         */
        isEmptyObject: function (obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        },
        /**
         * 判断是否为NaN
         * @method isNaN
         * @static
         * @param target {*} 需要判断的目标对象
         * @returns {boolean}
         */
        isNaN: function (target) {
            return target !== target;
        },
        /**
         * 判断是否为null
         * @method isNull
         * @static
         * @param target {*} 需要判断的目标对象
         * @returns {boolean}
         */
        isNull: function (target) {
            return target === null;
        },
        /**
         * 判断是否为undefined
         * @method isUndefined
         * @static
         * @param target {*} 需要判断的目标对象
         * @returns {boolean}
         */
        isUndefined: function (target) {
            return target === void 0;
        },
        isObjectLike: function (obj) {
            return typeof obj == 'object' || typeof obj == 'function';
        },
        // 判断字符串，对象，数组是否为空
        isEmpty: function (obj) {
            if (obj == null) return true;
            if ($.isArray(obj) || $.isString(obj)) return obj.length === 0;
            for (var key in obj) if (obj.hasOwnProperty(key)) return false;
            return true;
        },
        isURLString: function(str){
            return !!~str.indexOf('/') || !!~str.indexOf('?')
        },
        // 判断一个对象是不是jQ对象
        isQueryElement: function (obj) {
            return typeof obj == 'object' && obj.constructor == $;
        },
        isDefined: function (obj) {
            return obj !== null && obj !== undefined
        },
        // 判断是否DOM元素
        isElement: function (obj) {
            return !!(obj && obj.nodeType == 1);
        },
        // 判断是否无穷大
        isFinite: function (obj) {
            return $.isNumeric(obj) && isFinite(obj);
        },
        isEmptyJson: function (str) {
            return str == '[]' || str == '{}'
        },
        /**
         * 比较两个变量是否相等
         * @param {*} a 比较对象1
         * @param {*} b 比较对象2
         * @return {boolean} 是否相等
         */
        isEqual: function () {
            var eq = function (a, b, aStack, bStack) {
                // 0 === -0 为true，但实际上不应该相等
                // http://wiki.ecmascript.org/doku.php?id=harmony:egal
                // http://www.w3.org/TR/xmlschema11-2/
                if (a === b) return a !== 0 || 1 / a == 1 / b;
                // 在a或b为null的时候，需要严格判断，因为null == undefined
                if (a == null || b == null) return a === b;
                // 比较类型（类名）
                var className = $.stringType(a);
                if (className != $.stringType(b)) return false;
                switch (className) {
                    // 字符串，数字，日期，布尔比较值.
                    case '[object String]':
                        // 通过包装对象解决 '5' 实际上等于 String(5) 的情况
                        return a == String(b);
                    case '[object Number]':
                        // 比较数字
                        // NaN实际上是相等的，但不然，但通过以下方式仍可比较
                        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
                    case '[object Date]':
                    case '[object Boolean]':
                        // 日期和布尔量强行转换成数字进行比较
                        // 非法日期转换将为NaN，所以仍然保持不相等
                        return +a == +b;
                    // 正则则比较其表达式以及标记
                    case '[object RegExp]':
                        return a.source == b.source &&
                            a.global == b.global &&
                            a.multiline == b.multiline &&
                            a.ignoreCase == b.ignoreCase;
                }
                if (typeof a != 'object' || typeof b != 'object') return false;
                var length = aStack.length;
                while (length--) {
                    // 线性搜索
                    if (aStack[length] == a) return bStack[length] == b;
                }
                // 将第一个对象堆到遍历堆栈中
                aStack.push(a);
                bStack.push(b);
                var size = 0, result = true;
                // 递归比较数组和对象
                if (className == '[object Array]') {
                    // 比较数组长度是否相同确定是否深度比较
                    size = a.length;
                    result = size == b.length;
                    if (result) {
                        // 深度比较，忽略key非数字的成员
                        while (size--) {
                            if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                        }
                    }
                } else {
                    // 构造体不同的对象将被认为不相等
                    var aCtor = a.constructor, bCtor = b.constructor;
                    if (aCtor !== bCtor && !($.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                        $.isFunction(bCtor) && (bCtor instanceof bCtor))) {
                        return false;
                    }
                    // 深度递归比较对象
                    for (var key in a) {
                        if ($.hasOwn(a, key)) {
                            // 计算预测成员数量
                            size++;
                            // 深度比较每个成员
                            if (!(result = $.hasOwn(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                        }
                    }
                    // 确保每个对象都包含相同数量的属性
                    if (result) {
                        for (key in b) {
                            if ($.hasOwn(b, key) && !(size--)) break;
                        }
                        result = !size;
                    }
                }
                // 移除遍历对象堆栈第一个对象
                aStack.pop();
                bStack.pop();
                return result;
            };
            return function (a, b) {
                return eq(a, b, [], []);
            }
        }(),

        // 强化类型判断
        type: (function ($type) {
            var rsplit = /[, |]+/g;
            var typeCase = {
                blank: function () {
                },
                arraylike: $.isArrayLike,
                int: function (obj) {
                    return !isNaN(obj) && parseInt(obj) == obj
                },
                uint: function (obj) {
                    return !isNaN(obj) && parseInt(obj) >= 0
                },
                arguments: $.isArguments,
                window: function (obj) {
                    return obj == obj.document && obj.document != obj || $.stringType(obj, 'window|global')
                },
                document: function (obj) {
                    return obj.nodeType === 9 || $.stringType(obj, 'document')
                },
                nodelist: function (obj) {
                    return isFinite(obj.length) && obj.item || $.stringType(obj, 'nodelist')
                }
            };
            /**
             * 用于取得数据的类型（一个参数的情况下）或判定数据的类型（两个参数的情况下）
             * $.type(obj) == a 可以推出 $.type(obj, a) == true，但反过来未必
             * 如需进行更细节判断，请使用 $.type(obj, a) 的方式
             * @method type
             * @static
             * @param {*} target 要检测的东西
             * @param {string|array|function} [condition] 要比较的条件
             * @return {string|boolean}
             * @api public
             */
            return function (target, condition) {
                if (!condition) return $type.apply(this, arguments);
                else {
                    if ('string' == typeof condition)
                        condition = condition.split(rsplit);
                    if ($.isArray(condition))
                        condition = (function (arr) {
                            return function (obj) {
                                var found = false;
                                $.each(arr, function (__, type) {
                                    var camel = $.camelCase(type);
                                    var cap = $.capitalize(camel);
                                    var lower = camel.toLowerCase();
                                    var compare = typeCase[camel] || typeCase[cap] || typeCase[lower] || $['is' + cap] || $.stringType;
                                    return !(found = compare(obj, type));
                                });
                                return found;
                            }
                        })(condition);
                    if (!$.isFunction(condition)) throw new TypeError;
                    return !!condition(target);
                }
            }
        })($.type),


        /*
         ============= parse 系列 ================
         */

        /**
         * @method parseJS
         * @static
         * 将字符串当作JS代码执行
         * @param {string} code
         */
        parseJS: function (code) {
            //IE中，global.eval()和eval()一样只在当前作用域生效。
            //Firefox，Safari，Opera中，直接调用eval()为当前作用域，global.eval()调用为全局作用域。
            //window.execScript 在IE下一些限制条件
            //http://www.ascadnetworks.com/Guides-and-Tips/IE-error-%2522Could-not-complete-the-operation-due-to-error-80020101%2522
            if (code && /\S/.test(code)) {
                try {
                    global[seval](code);
                } catch (e) {
                }
            }
        },
        /**
         * 将text数据转换为base64字符串
         * @method parseBase64
         * @static
         * @param inputStr
         * @beta
         * @returns {string}
         */
        parseBase64: function (inputStr) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var outputStr = "";
            var i = 0;
            while (i < inputStr.length) {
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
                else {
                    enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                    if (isNaN(byte3)) {
                        enc4 = 64;
                    }
                    else {
                        enc4 = byte3 & 63;
                    }
                }
                outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
            }
            return outputStr;
        },
        /**
         * 往页面插入CSS
         * @method parseCSS
         * @static
         * @param cssStr
         */
        parseCSS: function (cssStr) {
            var styles = head.getElementsByTagName("style"), style, media;
            cssStr += "\n";
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
                style.styleSheet.cssText += cssStr;
            } else if (DOC.getBoxObjectFor) {
                style.innerHTML += cssStr;
            } else {
                style.appendChild(DOC.createTextNode(cssStr))
            }
        },

        /*
         ============= 字符串处理 系列 ================
         */


        template: template,
        toTemplate: function (str) {
            if ($.isFunction(str)) return str;
            else return $(str).templateRender()
        },
        /**
         * 字符串插值，有两种插值方法。
         * 第一种，第二个参数为对象，{{}}里面为键名，替换为键值，适用于重叠值够多的情况
         * 第二种，把第一个参数后的参数视为一个数组，{{}}里面为索引值，从零开始，替换为数组元素
         * http://www.cnblogs.com/rubylouvre/archive/2011/05/02/1972176.html
         * @method format
         * @static
         * @param {string} str
         * @param {*} object 插值包或某一个要插的值
         * @return {string}
         */
        format: function (str, object) {
            if (arguments.length > 2)
                object = $.slice(arguments, 1);
            return template(str, object, {
                interpolate: rformat
            })
        },
        /**
         * 查看对象或数组的内部构造
         * @method dump
         * @static
         * @param {*} obj
         * @return {string}
         * https://github.com/tdolsen/jquery-dump/blob/master/jquery.dump.js
         * https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js
         * http://freshbrewedcode.com/jimcowart/2013/01/29/what-you-might-not-know-about-json-stringify/
         */
        dump: function (obj) {
            var space = $.isNative("parse", window.JSON) ? 4 : "\r\t", cache = [],
                text = JSON.stringify(obj, function (key, value) {
                    if (typeof value === 'object' && value !== null) {//防止环引用
                        if (cache.indexOf(value) !== -1) {
                            return;
                        }
                        cache.push(value);
                    }
                    return typeof value === "function" ? value + "" : value;
                }, space);
            cache = [];//GC回收
            return text;
        },
        /**
         * 为数字加上单位
         * @method unit
         * @static
         * @param i
         * @param units 单位
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
            //转换为连字符线风格
            return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase();
        },
        capitalize: function (s) {
            return s.charAt(0).toUpperCase() + s.substr(1);
        },
        throttle: function (func, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function () {
                previous = new Date;
                timeout = null;
                result = func.apply(context, args);
            };
            return function () {
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


        // 参数初始化整理方法
        argsArrange: (function () {
            var filter = function (args, paramsDescription, defaults, excludeRest) {
                if (typeof defaults == 'boolean') {
                    excludeRest = defaults;
                    defaults = null;
                }
                var a = [], tempArr, item;
                paramsDescription = paramsDescription || [];
                if (excludeRest == null) excludeRest = true;
                defaults = defaults || [];
                for (var i = 0, j = 0; i < paramsDescription.length; i++) {
                    item = paramsDescription[i];
                    if ($.isString(item)) item = {type: item};
                    item.defaults = defaults[i] || item.defaults;
                    tempArr = [];
                    var isAutoLen = false, required = false, grouper,
                        match = item.required,
                        length = item.length,
                        group = item.group,
                        name = item.name ? item.name : 'Params[' + i + ']';
                    if ($.type(match, 'number')) {
                        required = true;
                        match = +match;
                    } else match = 1;
                    if ($.type(length, 'number')) {
                        length = +length;
                    } else if (length == 'auto') {
                        length = Infinity;
                        isAutoLen = true;
                    } else length = match;
                    grouper = group || length > 1 || isAutoLen ? function (arg) {
                        tempArr.push(arg);
                        return tempArr
                    } : function (arg) {
                        k++;
                        return arg
                    };
                    for (var k = 0; k < length || isAutoLen; k++) {
                        if ($.type(args[j], item.type))
                            a[i] = grouper(args[j++]);
                        else if (k < match && required)
                            throw new TypeError('参数' + name + '必须符合条件：' + item.type + '，最少需要' + match + '个，现仅有' + k + '个');
                        else if (isAutoLen)
                            break;
                        else
                            a[i] = grouper(item.defaults);
                    }
                }
                for (; j < args.length && excludeRest;) {
                    a[i++] = args[j++];
                }
                return a;
            };
            return function (args, paramsDescription, defaults) {
                if ($.isFunction(args)) {
                    paramsDescription = [].slice.call(arguments);
                    var func = args.shift();
                    return function () {
                        return func.apply(this, filter(arguments, paramsDescription));
                    };
                } else
                    return filter(args, paramsDescription, defaults);
            };
        })()
    });
})(armer)
;(function($){
    $.String = $.extend($.String, {
        byteLen: function(target) {
            /*取得一个字符串所有字节的长度。这是一个后端过来的方法，如果将一个英文字符插
             *入数据库 char、varchar、text 类型的字段时占用一个字节，而一个中文字符插入
             *时占用两个字节，为了避免插入溢出，就需要事先判断字符串的字节长度。在前端，
             *如果我们要用户填空的文本，需要字节上的长短限制，比如发短信，也要用到此方法。
             *随着浏览器普及对二进制的操作，这方法也越来越常用。
             */
            return target.replace(/[^\x00-\xff]/g, 'ci').length;
        },
        underscored: function(target) {
            //转换为下划线风格
            return target.replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/\-/g, "_").toLowerCase();
        },
        capitalize: $.capitalize,
        stripTags: function(target) {
            //移除字符串中的html标签，但这方法有缺陷，如里面有script标签，会把这些不该显示出来的脚本也显示出来了
            return target.replace(/<[^>]+>/g, "");
        },
        stripScripts: function(target) {
            //移除字符串中所有的 script 标签。弥补stripTags方法的缺陷。此方法应在stripTags之前调用。
            return target.replace(/<script[^>]*>([\S\s]*?)<\/script>/img, '');
        },
        unescapeHTML: function(target) {
            //还原为可被文档解析的HTML标签
            return target.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") //处理转义的中文和实体字符
                .replace(/&#([\d]+);/g, function($0, $1) {
                    return String.fromCharCode(parseInt($1, 10));
                });
        },
        escapeRegExp: function(target) {
            //http://stevenlevithan.com/regex/xregexp/
            //将字符串安全格式化为正则表达式的源码
            return(target + "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
        pad: function(target, n, filling, right, radix) {
            //http://www.cnblogs.com/rubylouvre/archive/2010/02/09/1666165.html
            //在左边补上一些字符,默认为0
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
    //字符串的原生原型方法
    ("charAt,charCodeAt,concat,indexOf,lastIndexOf,localeCompare,match," + "contains,endsWith,startsWith,repeat," + //es6
        "replace,search,slice,split,substring,toLowerCase,toLocaleLowerCase,toUpperCase,trim,toJSON").replace($.rword, function(name) {
            $.String[name] = function(obj) {
                return obj[name].apply(obj, $.slice(arguments, 1));
            };
        });
})(armer);

;(function($){

    function mergeOne(source, key, current) {
        //使用深拷贝方法将多个对象或数组合并成一个
        if ($.isPlainObject(source[key])) { //只处理纯JS对象，不处理window与节点
            $.Object.merge(source[key], current);
        } else {
            source[key] = cloneOf(current)
        }
        return source;
    }

    $.Object = function(mix){
        var callee = arguments.callee;
        if (this.constructor != callee && this.constructor != Object) return new callee(mix);
        if ($.isPlainObject(mix)) {
            $.extend(this, mix);
        }
    };
    var OldObject = $.Object;
    $.Object.prototype = Object.prototype;
    $.Object.mix = $.extend;
    $.Object.mix(OldObject, {
        /**
         * 判断obj是不是属于constructor的实例，是则返回obj，不是则以obj作为参数，返回constructor的实例
         * @param {Function} constructor 需要判断的构造器
         * @param {*} obj 需要判断的东西
         * @return {array}
         */
        instanceTo: function(constructor, obj){
            if (obj instanceof constructor){
                return obj
            } else return $.Function.applyConstr(constructor, $.isArray(obj) ? obj : [obj]);
        },
        size: function(obj){
            return $.isArrayLike(obj) ? obj.length: Object.keys(obj).length;
        },
        /**
         * 过滤数组中不合要求的元素
         * @param {Object} obj
         * @param {Function} fn 如果返回true则放进结果集中
         * @param {*} scope ? 默认为当前遍历的元素或属性值
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
            //根据传入数组取当前对象相关的键值对组成一个新对象返回
            var result = {};
            props.forEach(function(prop) {
                result[prop] = target[prop];
            });
            return result;
        },
        //将参数一的键值都放入回调中执行，如果回调返回false中止遍历
        forEach: function(obj, fn) {
            Object.keys(obj).forEach(function(name) {
                fn(obj[name], name)
            })
        },
        reduce: function(obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (obj.reduce) {
                if (context) iterator = iterator.bind(context);
                return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
            }
            $.each(obj, function(index, value) {
                if (!initial) {
                    memo = value;
                    initial = true;
                } else {
                    memo = iterator.call(context, memo, value, index);
                }
            });
            if (!initial) throw new TypeError('Reduce of empty array with no initial value');
            return memo;
        },
        //将参数一的键值都放入回调中执行，收集其结果返回
        map: function(obj, fn) {
            return  Object.keys(obj).map(function(name) {
                return fn(obj[name], name)
            })
        },
        clone: function(target) {
            //进行深拷贝，返回一个新对象，如果是浅拷贝请使用$.extend
            var clone = {};
            for (var key in target) {
                clone[key] = $.cloneOf(target[key]);
            }
            return clone;
        },
        merge: function(target, k, v) {
            //将多个对象合并到第一个参数中或将后两个参数当作键与值加入到第一个参数
            var obj, key;
            //为目标对象添加一个键值对
            if (typeof k === "string")
                return mergeOne(target, k, v);
            //合并多个对象
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
    "hasOwnerProperty,isPrototypeOf,propertyIsEnumerable".replace($.rword, function(name) {
        $.Object[name] = function(obj) {
            return obj[name].apply(obj, $.slice(arguments, 1));
        };
    });
})(armer);
;(function($){
    $.Array = $.extend($.Array, {
        // 判断数组是否包含相同的目标
        containsEqual: function(value, data){
            return value.some(function(item){
                return $.isEqual(item, data)
            });
        },
        // 根据条件查找数组下标
        findIndexOf: function(value, iterator){
            var ret = -1;
            $.each(value, function(i, item){
                if (iterator.call(value, item)) {
                    ret = i;
                    return false;
                }
            });
            return ret;
        },
        // 查找第一个与value相同的下标
        indexOfEqual: function(value, data){
            return $.Array.findIndexOf(value, function(item){
                return $.isEqual(item, data)
            })
        },
        contains: function(target, item) {
            //判定数组是否包含指定目标。
            return !!~target.indexOf(item);
        },
        shuffle: function(target) {
            //对数组进行洗牌。若不想影响原数组，可以先拷贝一份出来操作。
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
            //从数组中随机抽选一个元素出来。
            return $.Array.shuffle(target.concat())[0];
        },
        flatten: function(target) {
            //对数组进行平坦化处理，返回一个一维的新数组。
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
            // 过滤数组中的null与undefined，但不影响原数组。
            return target.filter(function(el) {
                return el != null;
            });
        },
        /**
         * 对数组进行去重操作，返回一个没有重复元素的新数组。
         * @param {Array} target 目标数组
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
         * 合并两个数组
         * @param {Array} first 第一个数组
         * @param {Array} second 第二个数组
         * @returns {Array}
         */
        merge: function(first, second) {
            //合并参数二到参数一
            var i = ~~first.length,
                j = 0;
            for (var n = second.length; j < n; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },
        /**
         * 对两个数组取并集。
         * @param {Array} target 第一个数组
         * @param {Array} array 第二个数组
         * @returns {Array}
         */
        union: function(target, array) {
            return $.Array.unique($.Array.merge(target, array));
        },
        /**
         * 对两个数组取交集
         * @param {Array} target 第一个数组
         * @param {Array} array 第二个数组
         * @returns {Array}
         */
        intersect: function(target, array) {
            return target.filter(function(n) {
                return ~array.indexOf(n);
            });
        },
        /**
         * 对两个数组取差集(补集)
         * @param {Array} target 第一个数组
         * @param {Array} array 第二个数组
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
         * 返回数组中的最小值，用于数字数组。
         * @param {Array} target 目标数组
         * @returns {Number}
         */
        min: function(target) {
            return Math.min.apply(0, target);
        },
        /**
         * 返回数组中的最大值，用于数字数组。
         * @param {Array} target 目标数组
         * @returns {Number}
         */
        max: function(target) {
            return Math.max.apply(0, target);
        },
        /**
         * 深拷贝当前数组
         * @param {Array} target 目标数组
         * @returns {Array}
         */
        clone: function(target) {
            var i = target.length,
                result = [];
            while (i--)
                result[i] = $.cloneOf(target[i]);
            return result;
        },
        remove: function(target, obj){
            var i = target.indexOf(obj);
            if (i>=0) target.splice(i, 1);
        },
        inGroupsOf: function(target, number, fillWith) {
            //将数组划分成N个分组，其中小组有number个数，最后一组可能小于number个数,
            //但如果第三个参数不为undefined时,我们可以拿它来填空最后一组
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
    ("concat,join,pop,push,shift,slice,sort,reverse,splice,unshift," + "indexOf,lastIndexOf,every,some,filter,reduce,reduceRight").replace($.rword, function(name) {
        $.Array[name] = function(obj) {
            return obj[name].apply(obj, $.slice(arguments, 1));
        };
    });
})(armer);
;(function($){
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
            0: "上午",
            1: "下午"
        },
        DAY: {
            0: "星期日",
            1: "星期一",
            2: "星期二",
            3: "星期三",
            4: "星期四",
            5: "星期五",
            6: "星期六"
        },
        MONTH: {
            0: "1月",
            1: "2月",
            2: "3月",
            3: "4月",
            4: "5月",
            5: "6月",
            6: "7月",
            7: "8月",
            8: "9月",
            9: "10月",
            10: "11月",
            11: "12月"
        },
        SHORTDAY: {
            "0": "周日",
            "1": "周一",
            "2": "周二",
            "3": "周三",
            "4": "周四",
            "5": "周五",
            "6": "周六"
        },
        fullDate: "y年M月d日EEEE",
        longDate: "y年M月d日",
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

    //取得上午下午
    function ampmGetter(date, formats) {
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
    }

    $.Date = $.extend($.Date, {
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
    });
})(armer);
;(function($){
    $.Function = $.extend($.Function, {
        applyConstr: $.applyConstr,
        clone: function(fn, extend){
            var newfn = new Function('return ' + fn.toString())();
            if (newfn.prototype)
                newfn.prototype = fn.prototype;
            $.extend(newfn, fn, extend);
            return newfn;
        },
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
        throttle: $.throttle,
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
})(armer);

;(function($){
    $.Number = $.extend($.Number, {
        limit: function(target, n1, n2) {
            //确保数值在[n1,n2]闭区间之内,如果超出限界,则置换为离它最近的最大值或最小值
            var a = [n1, n2].sort();
            if (target < a[0])
                target = a[0];
            if (target > a[1])
                target = a[1];
            return target;
        },
        nearer: function(target, n1, n2) {
            //求出距离指定数值最近的那个数
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
    });
    "abs,acos,asin,atan,atan2,ceil,cos,exp,floor,log,pow,sin,sqrt,tan".replace($.rword, function(name) {
        $.Number[name] = Math[name];
    });
    "toFixed,toExponential,toPrecision,toJSON".replace($.rword, function(name) {
        $.Number[name] = function(obj) {
            return obj[name].apply(obj, $.slice(arguments, 1));
        };
    });
})(armer)
;(function(DOC, $) {
    var Registry = {} //将函数曝光到此对象上，方便访问器收集依赖
    var expose = new Date - 0
    var subscribers = "$" + expose
    var window = this || (0, eval)('this')
    //var otherRequire = window.require
    //var otherDefine = window.define
    var stopRepeatAssign = false
    //var rword = /[^, ]+/g //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
    //var class2type = {}
    var oproto = Object.prototype
    var ohasOwn = oproto.hasOwnProperty
    var prefix = "vm-"
    var W3C = window.dispatchEvent
    var root = DOC.documentElement
    //var serialize = oproto.toString
    var ap = Array.prototype
    var aslice = ap.slice
    var head = DOC.head || DOC.getElementsByTagName("head")[0] //HEAD元素
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
     *                    命名空间与工具函数                               *
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
    avalon = function(el) { //创建jQuery式的无new 实例化结构
        return new avalon.init(el)
    }

    avalon.init = function(el) {
        this[0] = this.element = el
    }
    avalon.fn = avalon.prototype = avalon.init.prototype
    //率先添加三个判定类型的方法

    function getType(obj) { //取得类型
        if (obj == null) {
            return String(obj)
        }
        // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[serialize.call(obj)] || "object" :
            typeof obj
    }
    avalon.type = getType

    avalon.isWindow = function(obj) {
        if (!obj)
            return false
        // 利用IE678 window == document为true,document == window竟然为false的神奇特性
        // 标准浏览器及IE9，IE10等使用 正则检测
        return obj == obj.document && obj.document != obj
    }

    function isWindow(obj) {
        return rwindow.test(serialize.call(obj))
    }
    if (isWindow(window)) {
        avalon.isWindow = isWindow
    }
    //判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例。
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

        // 如果第一个参数为布尔,判定是否深拷贝
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1] || {}
            i++
        }

        //确保接受方为一个复杂的数据类型
        if (typeof target !== "object" && getType(target) !== "function") {
            target = {}
        }

        //如果只有一个参数，那么新成员添加于mix所在的对象上
        if (i === length) {
            target = this
            i--
        }

        for (; i < length; i++) {
            //只处理非空参数
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    copy = options[name]

                    // 防止环引用
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

    function resetNumber(a, n, end) { //用于模拟slice, splice的效果
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
        error: function(str, e) { //如果不用Error对象封装一下，str在控制台下可能会乱码
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
        range: function(start, end, step) { // 用于生成整数数组
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
        bind: function(el, type, fn, phase) { // 绑定事件
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
        unbind: W3C ? function(el, type, fn, phase) { //卸载事件
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
            if (value === void 0 || typeof value === "boolean") { //获取样式
                var fn = cssHooks[prop + ":get"] || cssHooks["@:get"]
                var val = fn(node, name)
                return value === true ? parseFloat(val) || 0 : val
            } else if (value === "") { //请除样式
                node.style[name] = ""
            } else { //设置样式
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
            if (obj) { //排除null, undefined
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
                //只有当前数组不存在此元素时只添加它
                if (target.indexOf(item) === -1) {
                    target.push(item)
                }
                return target
            },
            removeAt: function(target, index) {
                //移除数组中指定位置的元素，返回布尔表示成功与否。
                return !!target.splice(index, 1).length
            },
            remove: function(target, item) {
                //移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否。
                var index = target.indexOf(item)
                if (~index)
                    return avalon.Array.removeAt(target, index)
                return false
            }
        }
    })

    function generateID() {
        //生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return "avalon" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    //只让节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象通过

    function isArrayLike(obj) {
        if (obj && typeof obj === "object" && !avalon.isWindow(obj)) {
            var n = obj.length
            if (+n === n && !(n % 1) && n >= 0) { //检测length属性是否为非负整数
                try {
                    if ({}.propertyIsEnumerable.call(obj, "length") === false) { //如果是原生对象
                        return Array.isArray(obj) || /^\s?function/.test(obj.item || obj.callee)
                    }
                    return true
                } catch (e) { //IE的NodeList直接抛错
                    return true
                }
            }
        }
        return false
    }
    //视浏览器情况采用最快的异步回调(在avalon.ready里，还有一个分支，用于处理IE6-9)
    avalon.nextTick = window.setImmediate ? setImmediate.bind(window) : function(callback) {
        setTimeout(callback, 0) //IE10-11 or W3C
    }

    /*********************************************************************
     *                           modelFactory                             *
     **********************************************************************/
    var VMODELS = avalon.vmodels = {}
    avalon.define = function(name, factory) {
        if (typeof name !== "string") {
            avalon.error("必须指定ID")
        }
        if (typeof factory !== "function") {
            avalon.error("factory必须是函数")
        }
        var scope = {
            $watch: noop
        }
        factory(scope) //得到所有定义
        var model = modelFactory(scope) //偷天换日，将scope换为model
        stopRepeatAssign = true
        factory(model)
        stopRepeatAssign = false
        model.$id = name
        return VMODELS[name] = model
    }

    function modelFactory(scope, model) {
        if (Array.isArray(scope)) {
            var arr = scope.concat() //原数组的作为新生成的监控数组的$model而存在
            scope.length = 0
            var collection = Collection(scope)
            collection.push.apply(collection, arr)
            return collection
        }
        if (typeof scope.nodeType === "number") {
            return scope
        }
        var vmodel = {} //要返回的对象
        model = model || {} //放置$model上的属性
        var accessingProperties = {} //监控属性
        var normalProperties = {} //普通属性
        var computedProperties = [] //计算属性
        var watchProperties = arguments[2] || {} //强制要监听的属性
        var skipArray = scope.$skipArray //要忽略监控的属性
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
        vmodel = defineProperties(vmodel, descriptorFactory(accessingProperties), normalProperties) //生成一个空的ViewModel
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
            if (!W3C) { //在IE6-8下，VB对象的方法里的this并不指向自身，需要用bind处理一下
                fn = fn.bind(vmodel)
            }
            vmodel[i] = fn
        }
        vmodel.hasOwnProperty = function(name) {
            return name in vmodel.$model
        }
        for (var i = 0, fn; fn = computedProperties[i++]; ) { //最后强逼计算属性 计算自己的值
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
        if (normalProperties[name] || (val && val.nodeType)) { //如果是指明不用监控的系统属性或元素节点，或放到 $skipArray里面
            return normalProperties[name] = val
        }
        if (name.charAt(0) === "$" && !watchProperties[name]) { //如果是$开头，并且不在watchMore里面的
            return normalProperties[name] = val
        }
        var valueType = getType(val)
        if (valueType === "function") { //如果是函数，也不用监控
            return normalProperties[name] = val
        }
        var accessor, oldArgs
        if (valueType === "object" && typeof val.get === "function" && Object.keys(val).length <= 2) {
            var setter = val.set,
                getter = val.get
            accessor = function(newValue) { //创建计算属性，因变量，基本上由其他监控属性触发其改变
                var vmodel = watchProperties.vmodel
                var value = model[name],
                    preValue = value
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (typeof setter === "function") {
                        var backup = vmodel.$events[name]
                        vmodel.$events[name] = [] //清空回调，防止内部冒泡而触发多次$fire
                        setter.call(vmodel, newValue)
                        vmodel.$events[name] = backup
                    }
                    if (!isEqual(oldArgs, newValue)) {
                        oldArgs = newValue
                        newValue = model[name] = getter.call(vmodel)//同步$model
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue)//同步循环绑定中的代理VM
                        notifySubscribers(accessor) //通知顶层改变
                        safeFire(vmodel, name, newValue, preValue)//触发$watch回调
                    }
                } else {
                    if (avalon.openComputedCollect) { // 收集视图刷新函数
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
            accessor = function(newValue) { //子ViewModel或监控数组
                var realAccessor = accessor.$vmodel, preValue = realAccessor.$model
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (!isEqual(preValue, newValue)) {
                        newValue = accessor.$vmodel = updateVModel(realAccessor, newValue, valueType)
                        var fn = rebindings[newValue.$id]
                        fn && fn()//更新视图
                        var parent = watchProperties.vmodel
                        // withProxyCount && updateWithProxy(parent.$id, name, newValue)//同步循环绑定中的代理VM
                        model[name] = newValue.$model//同步$model
                        notifySubscribers(realAccessor)   //通知顶层改变
                        safeFire(parent, name, model[name], preValue)   //触发$watch回调
                    }
                } else {
                    collectSubscribers(realAccessor) //收集视图函数
                    return realAccessor
                }
            }
            accessor.$vmodel = val.$model ? val : modelFactory(val, val)
            model[name] = accessor.$vmodel.$model
        } else {
            accessor = function(newValue) { //简单的数据类型
                var preValue = model[name]
                if (arguments.length) {
                    if (!isEqual(preValue, newValue)) {
                        model[name] = newValue //同步$model
                        var vmodel = watchProperties.vmodel
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue)//同步循环绑定中的代理VM
                        notifySubscribers(accessor) //通知顶层改变
                        safeFire(vmodel, name, newValue, preValue)//触发$watch回调
                    }
                } else {
                    collectSubscribers(accessor) //收集视图函数
                    return preValue
                }
            }
            model[name] = val
        }
        accessor[subscribers] = [] //订阅者数组
        accessingProperties[name] = accessor
    }
    //with绑定生成的代理对象储存池
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
        //a为原来的VM， b为新数组或新对象
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
                data.rollback && data.rollback() //还原 vm-with vm-on
            })
            var ret = modelFactory(b)
            rebindings[ret.$id] = function(data) {
                while (data = iterators.shift()) {
                    (function(el) {
                        if (el.type) { //重新绑定
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

    //===================修复浏览器对Object.defineProperties的支持=================
    var defineProperty = Object.defineProperty
    //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
    //标准浏览器使用__defineGetter__, __defineSetter__实现
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
    //IE6-8使用VBScript类的set get语句实现
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
                "\t\tSet [__const__] = Me", //链式调用
                "\tEnd Function")
            //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
            for (name in normalProperties) {
                buffer.push("\tPublic [" + name + "]")
            }
            buffer.push("\tPublic [" + 'hasOwnProperty' + "]")
            //添加访问器属性 
            for (name in accessingProperties) {
                if (!(name in normalProperties)) { //防止重复定义
                    buffer.push(
                        //由于不知对方会传入什么,因此set, let都用上
                        "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Get [" + name + "]", //getter
                        "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
                        "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tIf Err.Number <> 0 Then",
                        "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tEnd If",
                        "\tOn Error Goto 0",
                        "\tEnd Property")
                }
            }
            buffer.push("End Class") //类定义完毕
            buffer.push(
                "Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
                "\tDim o",
                "\tSet o = (New " + className + ")(a, b)",
                "\tSet " + className + "Factory = o",
                "End Function")
            window.parseVB(buffer.join("\r\n")) //先创建一个VB类工厂
            return window[className + "Factory"](accessingProperties, VBMediator) //得到其产品
        }
    }
    /*********************************************************************
     *                           ecma262 v5语法补丁                   *
     **********************************************************************/
    /*
    if (!"司徒正美".trim) {
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
            //定位操作，返回数组中第一个等于给定参数的元素的索引值。
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
            //定位引操作，同上，不过是从后遍历。
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
            //迭代操作，将数组的元素挨个儿传入一个函数中执行。Ptototype.js的对应名字为each。
            forEach: iterator("", '_', ""),
            //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Ptototype.js的对应名字为collect。
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Ptototype.js的对应名字为any。
            some: iterator("", 'if(_)return true', 'return false'),
            //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Ptototype.js的对应名字为all。
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
    if (!root.contains) { //safari5+是把contains方法放在Element.prototype上而不是Node.prototype
        Node.prototype.contains = function(arg) {
            return !!(this.compareDocumentPosition(arg) & 16)
        }
    }
    if (!DOC.contains) { //IE6-11的文档对象没有contains
        DOC.contains = function(b) {
            return fixContains(this, b)
        }
    }
    if (!root.outerHTML && window.HTMLElement) {//firefox 到11时才有outerHTML
        HTMLElement.prototype.__defineGetter__("outerHTML", function() {
            domParser.textContent = ""
            domParser.appendChild(this)
            var str = this.innerHTML
            domParser.textContent = ""
            return str
        });
    }
    /*********************************************************************
     *                           配置模块                                  *
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
        //将字符串安全格式化为正则表达式的源码
        return (target + "").replace(rregexp, "\\$&")
    }
    /*
    var plugins = {
        alias: function(val) {
            log("Warning: alias方法已废弃，请用paths, shim配置项")
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
     *                      DOM API的高级封装                           *
     **********************************************************************/

    /*
    function hyphen(target) {
        //转换为连字符线风格
        return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase()
    }

    function camelize(target) {
        //转换为驼峰风格
        if (target.indexOf("-") < 0 && target.indexOf("_") < 0) {
            return target //提前判断，提高getStyle等的效率
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
                offsetParent = this.offsetParent() //得到真正的offsetParent
                offset = this.offset() // 得到正确的offsetParent
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
            if (this[0]) { //此方法不会链
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

    //生成avalon.fn.scrollLeft, avalon.fn.scrollTop方法
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
    //=============================css相关=======================
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
        try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine 在旧式IE下会抛异常
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
                    ret = node.style[name] //其他浏览器需要我们手动取内联样式
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
            //取得精确值，不过它有可能是带em,pc,mm,pt,%等单位
            var currentStyle = node.currentStyle
            var ret = currentStyle[name]
            if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
                //①，保存原有的style.left, runtimeStyle.left,
                var style = node.style,
                    left = style.left,
                    rsLeft = node.runtimeStyle.left
                //②由于③处的style.left = xxx会影响到currentStyle.left，
                //因此把它currentStyle.left放到runtimeStyle.left，
                //runtimeStyle.left拥有最高优先级，不会style.left影响
                node.runtimeStyle.left = currentStyle.left
                //③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
                //得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
                style.left = name === 'fontSize' ? '1em' : (ret || 0)
                ret = style.pixelLeft + "px"
                //④还原 style.left，runtimeStyle.left
                style.left = left
                node.runtimeStyle.left = rsLeft
            }
            if (ret === "medium") {
                name = name.replace("Width", "Style")
                //border width 默认值为medium，即使其为0"
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
            //这是最快的获取IE透明值的方式，不需要动用正则了！
            var alpha = node.filters.alpha || node.filters[salpha],
                op = alpha ? alpha.opacity : 100
            return (op / 100) + "" //确保返回的是字符串
        }
        //旧式IE无法通过currentStyle取得没有定义在样式表中的width, height值
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
        if (node.offsetWidth <= 0) { //opera.offsetWidth可能小于0
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
                if (node.setTimeout) { //取得窗口尺寸,IE9后可以用node.innerWidth /innerHeight代替
                    return node["inner" + name] || node.document.documentElement[clientProp]
                }
                if (node.nodeType === 9) { //取得页面尺寸
                    var doc = node.documentElement
                    //FF chrome    html.scrollHeight< body.scrollHeight
                    //IE 标准模式 : html.scrollHeight> body.scrollHeight
                    //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
                    return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
                }
                return cssHooks[method + "::get"](node)
            } else {
                return this.css(method, value)
            }
        }

    })
    avalon.fn.offset = function() { //取得距离页面左右角的坐标
        var node = this[0],
            doc = node && node.ownerDocument
        var pos = {
            left: 0,
            top: 0
        }
        if (!doc) {
            return pos
        }
        //http://hkom.blog1.fc2.com/?mode=m&no=750 body的偏移量是不包含margin的
        //我们可以通过getBoundingClientRect来获得元素相对于client的rect.
        //http://msdn.microsoft.com/en-us/library/ms536433.aspx
        var box = node.getBoundingClientRect(),
        //chrome1+, firefox3+, ie4+, opera(yes) safari4+
            win = doc.defaultView || doc.parentWindow,
            root = (navigator.vendor || doc.compatMode === "BackCompat") ? doc.body : doc.documentElement,
            clientTop = root.clientTop >> 0,
            clientLeft = root.clientLeft >> 0,
            scrollTop = win.pageYOffset || root.scrollTop,
            scrollLeft = win.pageXOffset || root.scrollLeft
        // 把滚动距离加到left,top中去。
        // IE一些版本中会自动为HTML元素加上2px的border，我们需要去掉它
        // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
        pos.top = box.top + scrollTop - clientTop
        pos.left = box.left + scrollLeft - clientLeft
        return pos
    }

    //==================================val相关============================

    function getValType(el) {
        var ret = el.tagName.toLowerCase()
        return ret === "input" && /checkbox|radio/.test(el.type) ? "checked" : ret
    }
    var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
    var valHooks = {
        "option:get": function(node) {
            //在IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
            if (node.hasAttribute) {
                return node.hasAttribute("value") ? node.value : node.text
            }
            //specified并不可靠，因此通过分析outerHTML判定用户有没有显示定义value
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
                //旧式IE在reset后不会改变selected，需要改用i === index判定
                //我们过滤所有disabled的option元素，但在safari5下，如果设置select为disable，那么其所有孩子都disable
                //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
                if ((option.selected || i === index) && !option.disabled) {
                    value = getter(option)
                    if (one) {
                        return value
                    }
                    //收集所有selected值组成数组返回
                    values.push(value)
                }
            }
            return values
        },
        "select:set": function(node, values, optionSet) {
            values = [].concat(values) //强制转换为数组
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
    //取得其tagName
        rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig,
        scriptTypes = oneObject("text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript", "text/vbscript"),
    //需要处理套嵌关系的标签
        rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/
    //parseHTML的辅助变量
    var tagHooks = {
        area: [1, "<map>"],
        param: [1, "<object>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</table>"],
        legend: [1, "<fieldset>"],
        option: [1, "<select multiple='multiple'>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>"],
        td: [3, "<table><tbody><tr>"],
        //IE6-8在用innerHTML生成节点时，不能直接创建no-scope元素与HTML5的新标签
        _default: W3C ? [0, ""] : [1, "X<div>"] //div可以不用闭合
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
        //取得其标签名
            wrap = tagHooks[tag] || tagHooks._default,
            fragment = documentFragment.cloneNode(false),
            wrapper = domParser,
            firstChild, neo
        if (!W3C) { //fix IE
            html = html.replace(rcreate, "<br class=msNoScope>$1") //在link style script等标签之前添加一个补丁
        }
        wrapper.innerHTML = wrap[1] + html + (wrap[2] || "")
        var els = wrapper.getElementsByTagName("script")
        if (els.length) { //使用innerHTML生成的script节点不会发出请求与执行text属性
            for (var i = 0, el; el = els[i++]; ) {
                if (!el.type || scriptTypes[el.type]) { //如果script节点的MIME能让其执行脚本
                    neo = script.cloneNode(false) //FF不能省略参数
                    for (var j = 0, attr; attr = el.attributes[j++]; ) {
                        if (attr.specified) { //复制其属性
                            neo[attr.name] = attr.value
                        }
                    }
                    neo.text = el.text //必须指定,因为无法在attributes中遍历出来
                    el.parentNode.replaceChild(neo, el) //替换节点
                }
            }
        }
        //移除我们为了符合套嵌关系而添加的标签
        for (i = wrap[0]; i--; wrapper = wrapper.lastChild) {
        }
        if (!W3C) { //fix IE
            for (els = wrapper["getElementsByTagName"]("br"), i = 0; el = els[i++]; ) {
                if (el.className && el.className === "vmNoScope") {
                    el.parentNode.removeChild(el)
                }
            }
        }
        while (firstChild = wrapper.firstChild) { // 将wrapper上的节点转移到文档碎片上！
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
            } else { //重新开始监听此VM的第一重简单属性的变动
                this.$events = this.$watch.backup
            }
            return this
        },
        $unwatch: function(type, callback) {
            var n = arguments.length
            if (n === 0) { //让此VM的所有$watch回调无效化
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
     *                           依赖收集与触发                                *
     **********************************************************************/

    function registerSubscriber(data) {
        Registry[expose] = data //暴光此函数,方便collectSubscribers收集
        avalon.openComputedCollect = true
        var fn = data.evaluator
        if (fn) { //如果是求值函数
            if (data.type === "duplex") {
                data.handler()
            } else {
                data.handler(fn.apply(0, data.args), data.element, data)
            }
        } else { //如果是计算属性的accessor
            data()
        }
        avalon.openComputedCollect = false
        delete Registry[expose]
    }

    function collectSubscribers(accessor) { //收集依赖于这个访问器的订阅者
        if (Registry[expose]) {
            var list = accessor[subscribers]
            list && avalon.Array.ensure(list, Registry[expose]) //只有数组不存在此元素才push进去
        }
    }

    function notifySubscribers(accessor) { //通知依赖于这个访问器的订阅者更新自身
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
                    if (remove) { //如果它没有在DOM树
                        list.splice(i, 1)
                        log("Debug: remove " + fn.name)
                    }
                }
                if (typeof fn === "function") {
                    fn.apply(0, args) //强制重新计算自身
                } else if (fn.getter) {
                    fn.handler.apply(fn, args) //处理监控数组的方法
                } else {
                    fn.handler(fn.evaluator.apply(0, fn.args || []), el, fn)
                }
            }
        }
    }

    /*********************************************************************
     *                           扫描系统                                 *
     **********************************************************************/
    avalon.scan = function(elem, vmodel) {
        elem = elem || root
        var vmodels = vmodel ? [].concat(vmodel) : []
        scanTag(elem, vmodels)
    }

    //http://www.w3.org/TR/html5/syntax.html#void-elements
    var stopScan = oneObject("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea".toUpperCase())

    //确保元素的内容被完全扫描渲染完毕才调用回调
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
        //扫描顺序  vm-skip(0) --> vm-important(1) --> vm-controller(2) --> vm-if(10) --> vm-repeat(100) 
        //--> vm-if-loop(110) --> vm-attr(970) ...--> vm-each(1400)-->vm-with(1500)--〉vm-duplex(2000)垫后
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
            //vm-important不包含父VM，vm-controller相反
            vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
            elem.removeAttribute(node.name) //removeAttributeNode不会刷新[vm-controller]样式规则
            avalon(elem).removeClass(node.name) //处理IE6
        }
        scanAttr(elem, vmodels) //扫描特性节点
    }

    function scanNodes(parent, vmodels) {
        var node = parent.firstChild

        while (node) {
            var nextNode = node.nextSibling
            if (node.nodeType === 1) {
                scanTag(node, vmodels) //扫描元素节点
            } else if (node.nodeType === 3 && rexpr.test(node.nodeValue)) {
                scanText(node, vmodels) //扫描文本节点
            }
            node = nextNode
        }
    }

    function scanText(textNode, vmodels) {
        var bindings = [],
            tokens = scanExpr(textNode.nodeValue)
        if (tokens.length) {
            for (var i = 0, token; token = tokens[i++]; ) {
                var node = DOC.createTextNode(token.value) //将文本转换为文本节点，并替换原来的文本节点
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
                    bindings.push(binding) //收集带有插值表达式的文本
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
                    //如果是以指定前缀命名的
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
            log("warning!一个元素上不能同时定义vm-checked与vm-duplex")
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
                    scanNodes(elem, vmodels) //扫描子孙元素
                }
                break;
        }

        if (elem.patchRepeat) {
            elem.patchRepeat()
            elem.patchRepeat = null
        }

    }
    //IE67下，在循环绑定中，一个节点如果是通过cloneNode得到，自定义属性的specified为false，无法进入里面的分支，
    //但如果我们去掉scanAttr中的attr.specified检测，一个元素会有80+个特性节点（因为它不区分固有属性与自定义属性），很容易卡死页面
    if (!"1" [0]) {
        var cacheAttr = createCache(512)
        var rattrs = /\s+(vm-[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
            rquote = /^['"]/,
            rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i
        var getAttributes = function(elem) {
            if (elem.outerHTML.slice(0, 2) == "</") { //处理旧式IE模拟HTML5新元素带来的伪标签
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

            if (data.evaluator && data.name) { //移除数据绑定，防止被二次解析
                //chrome使用removeAttributeNode移除不存在的特性节点时会报错 https://github.com/RubyLouvre/avalon/issues/99
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
            if (value) { // {{ 左边的文本
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
            if (value) { //处理{{ }}插值表达式
                var leach = []
                if (value.indexOf("|") > 0) { // 抽取过滤器 先替换掉所有短路与
                    value = value.replace(r11a, "U2hvcnRDaXJjdWl0") //btoa("ShortCircuit")
                    value = value.replace(rfilters, function(c, d, e) {
                        leach.push(d + (e || ""))
                        return ""
                    })
                    value = value.replace(r11b, "||") //还原短路与
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
        if (value) { //}} 右边的文本
            tokens.push({
                value: value,
                expr: false
            })
        }

        return tokens
    }
    /*********************************************************************
     *                          编译模块                                  *
     **********************************************************************/

    var keywords =
        // 关键字
        "break,case,catch,continue,debugger,default,delete,do,else,false" + ",finally,for,function,if,in,instanceof,new,null,return,switch,this" + ",throw,true,try,typeof,var,void,while,with"
            // 保留字
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

    //添加赋值语句

    function addAssign(vars, scope, name, duplex) {
        var ret = [],
            prefix = " = " + name + "."
        for (var i = vars.length, prop; prop = vars[--i]; ) {
            if (scope.hasOwnProperty && scope.hasOwnProperty(prop)) { //IE6下节点没有hasOwnProperty
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
    //缓存求值函数，以便多次利用

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
    //取得求值函数及其传参
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
        //args 是一个对象数组， names 是将要生成的求值函数的参数
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
        var fn = cacheExpr[exprId] //直接从缓存，免得重复生成
        if (fn) {
            data.evaluator = fn
            return
        }
        var prefix = assigns.join(", ")
        if (prefix) {
            prefix = "var " + prefix
        }
        if (filters) {//文本绑定，双工绑定才有过滤器
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
        } else if (dataType === "duplex") {//双工绑定
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
        } else if (dataType === "on") {//事件绑定
            code = code.replace("(", ".call(this,")
            if (four === "$event") {
                names.push(four)
            }
            code = "\nreturn " + code + ";" //IE全家 Function("return ")出错，需要Function("return ;")
            var lastIndex = code.lastIndexOf("\nreturn")
            var header = code.slice(0, lastIndex)
            var footer = code.slice(lastIndex)
            code = header + "\nif(avalon.openComputedCollect) return ;" + footer
        } else {//其他绑定
            code = "\nreturn " + code + ";" //IE全家 Function("return ")出错，需要Function("return ;")
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
            vars = textBuffer = names = null //释放内存
        }
    }

    //parseExpr的智能引用代理

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
            //方便调试
            //这里非常重要,我们通过判定视图刷新函数的element是否在DOM树决定
            //将它移出订阅者列表
            registerSubscriber(data)
        }
    }
    avalon.parseExprProxy = parseExprProxy
    /*********************************************************************
     *绑定模块（实现“操作数据即操作DOM”的关键，将DOM操作放逐出前端开发人员的视野，让它交由框架自行处理，开发人员专致于业务本身） *                                 *
     **********************************************************************/
    /*
    var cacheDisplay = oneObject("a,abbr,b,span,strong,em,font,i,kbd", "inline")
    avalon.mix(cacheDisplay, oneObject("div,h1,h2,h3,h4,h5,h6,section,p", "block"))

    function parseDisplay(nodeName, val) {
        //用于取得此类标签的默认display值
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
    styleEl = avalon.parseHTML(styleEl).firstChild //IE6-8 head标签的innerHTML是只读的
    head.insertBefore(styleEl, null) //避免IE6 base标签BUG
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
    //这里的函数每当VM发生改变后，都会被执行（操作方为notifySubscribers）
    var bindingExecutors = avalon.bindingExecutors = {
        "attr": function(val, elem, data) {
            var method = data.type,
                attrName = data.param
            if (method === "css") {
                avalon(elem).css(attrName, val)
            } else if (method === "attr") {
                // vm-attr-class="xxx" vm.xxx="aaa bbb ccc"将元素的className设置为aaa bbb ccc
                // vm-attr-class="xxx" vm.xxx=false  清空元素的所有类名
                // vm-attr-name="yyy"  vm.yyy="ooo" 为元素设置name属性
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
                    //IE系列与够新的标准浏览器支持通过ID取得元素（firefox14+）
                    //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
                    var el = val && val.nodeType == 1 ? val : DOC.getElementById(val)
                    if (el) {
                        if (el.tagName === "NOSCRIPT" && !(el.innerHTML || el.fixIE78)) { //IE7-8 innerText,innerHTML都无法取得其内容，IE6能取得其innerHTML
                            var xhr = getXHR() //IE9-11与chrome的innerHTML会得到转义的内容，它们的innerText可以
                            xhr.open("GET", location, false) //谢谢Nodejs 乱炖群 深圳-纯属虚构
                            xhr.send(null)
                            //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
                            var noscripts = DOC.getElementsByTagName("noscript")
                            var array = (xhr.responseText || "").match(rnoscripts) || []
                            var n = array.length
                            for (var i = 0; i < n; i++) {
                                var tag = noscripts[i]
                                if (tag) { //IE6-8中noscript标签的innerHTML,innerText是只读的
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
                    val = val.replace(/&amp;/g, "&") //处理IE67自动转义的问题
                }
                elem[method] = val
            }
        },
        "class": function(val, elem, data) {
            var $elem = avalon(elem),
                method = data.type
            if (method === "class" && data.param) { //如果是旧风格
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
                        if (!data.init) { //确保只绑定一次
                            if (method === "hover") { //在移出移入时切换类名
                                var event1 = "mouseenter",
                                    event2 = "mouseleave"
                            } else { //在聚焦失焦中切换类名
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
                    case "add": //在pos位置后添加el数组（pos为数字，el为数组）
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
                    case "del": //将pos后的el个元素删掉(pos, el都是数字)
                        proxies.splice(pos, el) //移除对应的子VM
                        removeFromSanctuary(removeView(locatedNode, group, el))
                        break
                    case "index": //将proxies中的第pos个起的所有元素重新索引（pos为数字，el用作循环变量）
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
                    case "move": //将proxies中的第pos个元素移动el位置上(pos, el都是数字)
                        var t = proxies.splice(pos, 1)[0]
                        if (t) {
                            proxies.splice(el, 0, t)
                            var moveNode = removeView(locatedNode, group)
                            locatedNode = getLocatedNode(parent, data, el)
                            parent.insertBefore(moveNode, locatedNode)
                        }
                        break
                    case "set": //将proxies中的第pos个元素的VM设置为el（pos为数字，el任意）
                        var proxy = proxies[pos]
                        if (proxy) {
                            proxy[proxy.$itemName] = el
                        }
                        break
                    case "append": //将pos的键值对从el中取出（pos为一个普通对象，el为预先生成好的代理VM对象池）
                        var pool = el
                        var transation = documentFragment.cloneNode(false)
                        var callback = getBindingCallback(data.callbackElement, "data-with-sorted", data.vmodels)
                        var keys = [],
                            spans = [],
                            lastFn = {}
                        for (var key in pos) { //得到所有键名
                            if (pos.hasOwnProperty(key) && key !== "hasOwnProperty") {
                                keys.push(key)
                            }
                        }
                        if (callback) { //如果有回调，则让它们排序
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
                elem.insertBefore(fragment, data.replaceNodes[0] || null) //fix IE6-8 insertBefore的第2个参数只能为节点或null
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
            if (val) { //插回DOM树
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
            } else { //移出DOM树，放进ifSanctuary DIV中，并用注释节点占据原位置

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
            val = val == null ? "" : val //不在页面上显示undefined null
            if (data.nodeType === 3) { //绑定在文本节点上
                data.node.data = val
            } else { //绑定在特性节点上
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
    //这里的函数只会在第一次被扫描后被执行一次，并放进行对应VM属性的subscribers数组内（操作方为registerSubscriber）
    var bindingHandlers = avalon.bindingHandlers = {
        //这是一个字符串属性绑定的范本, 方便你在title, alt,  src, href, include, css添加插值表达式
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
            data.handlerName = "attr" //handleName用于处理多种绑定共用同一种bindingExecutor的情况
            parseExprProxy(text, vmodels, data, (simple ? null : scanExpr(data.value)))
        },
        "checked": function(data, vmodels) {
            data.handlerName = "checked"
            parseExprProxy(data.value, vmodels, data)
        },
        //根据VM的属性值或表达式的值切换类名，vm-class="xxx yyy zzz:flag" 
        //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
        "class": function(data, vmodels) {
            var oldStyle = data.param,
                text = data.value,
                rightExpr
            data.handlerName = "class"
            if (!oldStyle || isFinite(oldStyle)) {
                data.param = "" //去掉数字
                var noExpr = text.replace(rexprg, function(a) {
                    return Math.pow(10, a.length - 1) //将插值表达式插入10的N-1次方来占位
                })
                var colonIndex = noExpr.indexOf(":") //取得第一个冒号的位置
                if (colonIndex === -1) { // 比如 vm-class="aaa bbb ccc" 的情况
                    var className = text
                } else { // 比如 vm-class-1="ui-state-active:checked" 的情况 
                    className = text.slice(0, colonIndex)
                    rightExpr = text.slice(colonIndex + 1)
                    parseExpr(rightExpr, vmodels, data) //决定是添加还是删除
                    if (!data.evaluator) {
                        log("Debug: vm-class '" + (rightExpr || "").trim() + "' 不存在于VM中")
                        return false
                    } else {
                        data._evaluator = data.evaluator
                        data._args = data.args
                    }
                }
                var hasExpr = rexpr.test(className) //比如vm-class="width{{w}}"的情况
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
                //由于情况特殊，不再经过parseExprProxy
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
                avalon.log("Warning:建议使用vm-repeat代替vm-each, vm-with, vm-repeat只占用一个标签并且性能更好")
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
                if (matched === "" || matched === "$event") { // aaa() aaa($event)当成aaa处理
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
            if (!supportDisplay && !root.contains(elem)) { //fuck firfox 全家！
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
                    if (VMODELS[v.$id]) { //取得离它最近由用户定义的VM
                        var nearestVM = v
                        break
                    }
                }
                var optName = args[2] || widget //尝试获得配置项的名字，没有则取widget的名字
                if (nearestVM && typeof nearestVM[optName] === "object") {
                    vmOptions = nearestVM[optName]
                    vmOptions = vmOptions.$model || vmOptions
                    var id = vmOptions[widget + "Id"]
                    if (typeof id === "string") {
                        args[1] = id
                    }
                }
                var widgetData = avalon.getWidgetData(element, args[0]) //抽取data-tooltip-text、data-tooltip-attr属性，组成一个配置对象
                data[widget + "Id"] = args[1]
                data[widget + "Options"] = avalon.mix({}, constructor.defaults, vmOptions, widgetData)
                element.removeAttribute("vm-widget")
                var widgetVM = constructor(element, data, vmodels)
                data.evaluator = noop
                var callback = getBindingCallback(element, "data-widget-defined", vmodels)
                if (callback) {
                    callback.call(element, widgetVM)
                }
            } else if (vmodels.length) { //如果该组件还没有加载，那么保存当前的vmodels
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
    //与href绑定器 用法差不多的其他字符串属性的绑定器
    //建议不要直接在src属性上修改，这样会发出无效的请求，请使用vm-src
    "title,alt,src,value,css,include,href".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.attr
    })
    //============================= model binding =======================
    //将模型中的字段与input, textarea的value值关联在一起
    var modelBinding = bindingHandlers.duplex
    //如果一个input标签添加了model绑定。那么它对应的字段将与元素的value连结在一起
    //字段变，value就变；value变，字段也跟着变。默认是绑定input事件，
    modelBinding.INPUT = function(element, evaluator, data) {
        var fixType = data.param,
            type = element.type,
            callback = data.changed,
            $elem = avalon(element),
            removeFn

        if (type === "checkbox" && fixType === "radio") {
            type = "radio"
        }
        //当value变化时改变model的值
        var updateVModel = function() {
            var val = element.oldValue = element.value
            if ($elem.data("duplex-observe") !== false) {
                evaluator(val)
                callback.call(element, val)
            }
        }
        //当model变化时,它就会改变value的值
        data.handler = function() {
            var val = evaluator()
            if (val !== element.value) {
                element.value = val + ""
            }
        }
        if (type === "radio") {
            data.handler = function() {
                //IE6是通过defaultChecked来实现打勾效果
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
                        avalon.error("vm-duplex位于checkbox时要求对应一个数组")
                    }
                    callback.call(element, array)
                }
            }
            data.handler = function() {
                var array = [].concat(evaluator()) //强制转换为数组
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
                if (W3C) { //先执行W3C
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

                if (DOC.documentMode === 9) { // IE9 无法在切剪中同步VM
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
    if (Object.getOwnPropertyNames) { //屏蔽IE8
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
            oldSetter = Object.getOwnPropertyDescriptor(inputProto, "value").set //屏蔽chrome, safari,opera
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
                var val = $elem.val() //字符串或字符串数组
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
                //先等到select里的option元素被扫描后，才根据model设置selected属性  
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
        ret.preventDefault = function() { //阻止默认行为
            event.returnValue = false
        }
        ret.stopPropagation = function() { //阻止事件在DOM树中的传播
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
     *          监控数组（与vm-each, vm-repeat配合使用）                     *
     **********************************************************************/

    function Collection(model) {
        var array = []
        array.$id = generateID()
        array[subscribers] = []
        array.$model = model // model.concat()
        array.$events = {} //VB对象的方法里的this并不指向自身，需要使用bind处理一下
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
        _add: function(arr, pos) { //在第pos个位置上，添加一组元素
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
        _del: function(pos, n) { //在第pos个位置上，删除N个元素
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
            var ret = this._add(arguments, 0) //返回长度
            notifySubscribers(this, "index", arguments.length)
            return ret
        },
        shift: function() {
            var el = this.$model.shift()
            this._del(0, 1)
            notifySubscribers(this, "index", 0)
            return el //返回被移除的元素
        },
        pop: function() {
            var el = this.$model.pop()
            this._del(this.length - 1, 1)
            return el //返回被移除的元素
        },
        splice: function(a, b) {
            // 必须存在第一个参数，需要大于-1, 为添加或删除元素的基点
            a = resetNumber(a, this.length)
            var removed = _splice.apply(this.$model, arguments),
                ret = []
            this._stopFireLength = true //确保在这个方法中 , $watch("length",fn)只触发一次
            if (removed.length) {
                ret = this._del(a, removed.length)
                if (arguments.length <= 2) { //如果没有执行添加操作，需要手动resetIndex
                    notifySubscribers(this, "index", a)
                }
            }
            if (arguments.length > 2) {
                this._add(aslice.call(arguments, 2), a)
            }
            this._stopFireLength = false
            this._.length = this.length
            return ret //返回被移除的元素
        },
        contains: function(el) { //判定是否包含
            return this.indexOf(el) !== -1
        },
        size: function() { //取得数组长度，这个函数可以同步视图，length不能
            return this._.length
        },
        remove: function(el) { //移除第一个等于给定值的元素
            var index = this.indexOf(el)
            if (index >= 0) {
                return this.removeAt(index)
            }
        },
        removeAt: function(index) { //移除指定索引上的元素
            this.splice(index, 1)
        },
        clear: function() {
            this.$model.length = this.length = this._.length = 0 //清空数组
            notifySubscribers(this, "clear", 0)
            return this
        },
        removeAll: function(all) { //移除N个元素
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
            if (!this.contains(el)) { //只有不存在才push
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
            ap[method].apply(aaa, arguments) //先移动model
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

    //取得el在array的位置

    function getIndex(a, array, start) {
        for (var i = start, n = array.length; i < n; i++) {
            if (isEqual(a, array[i])) {
                return i
            }
        }
        return -1
    }
    //============ each/repeat/with binding 用到的辅助函数与对象 ======================
    //得到某一元素节点或文档碎片对象下的所有注释节点
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
    //将通过vm-if移出DOM树放进ifSanctuary的元素节点移出来，以便垃圾回收

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
    //为vm-each, vm-with, vm-repeat要循环的元素外包一个msloop临时节点，vm-controller的值为代理VM的$id
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
    // 取得用于定位的节点。在绑定了vm-each, vm-with属性的元素里，它的整个innerHTML都会视为一个子模板先行移出DOM树，
    // 然后如果它的元素有多少个（vm-each）或键值对有多少双（vm-with），就将它复制多少份(多少为N)，再经过扫描后，重新插入该元素中。
    // 这时该元素的孩子将分为N等分，每等份的第一个节点就是这个用于定位的节点，
    // 方便我们根据它算出整个等分的节点们，然后整体移除或移动它们。

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
    // 为vm-each, vm-repeat创建一个代理对象，通过它们能使用一些额外的属性与功能（$index,$first,$last,$remove,$key,$val,$outer）
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
     *                  文本绑定里默认可用的过滤器                          *
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
            //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
            length = length || 30
            truncation = truncation === void(0) ? "..." : truncation
            return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target)
        },
        camelize: camelize,
        escape: function(html) {
            //将字符串经过 html 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt 
            return String(html)
                .replace(/&(?!\w+;)/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
        },
        currency: function(number, symbol) {
            symbol = symbol || "￥"
            return symbol + avalon.filters.number(number)
        },
        number: function(number, decimals, dec_point, thousands_sep) {
            //与PHP的number_format完全兼容
            //number	必需，要格式化的数字
            //decimals	可选，规定多少个小数位。
            //dec_point	可选，规定用作小数点的字符串（默认为 . ）。
            //thousands_sep	可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
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
        //取得上午下午

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
                0: "上午",
                1: "下午"
            },
            DAY: {
                0: "星期日",
                1: "星期一",
                2: "星期二",
                3: "星期三",
                4: "星期四",
                5: "星期五",
                6: "星期六"
            },
            MONTH: {
                0: "1月",
                1: "2月",
                2: "3月",
                3: "4月",
                4: "5月",
                5: "6月",
                6: "7月",
                7: "8月",
                8: "9月",
                9: "10月",
                10: "11月",
                11: "12月"
            },
            SHORTDAY: {
                "0": "周日",
                "1": "周一",
                "2": "周二",
                "3": "周三",
                "4": "周四",
                "5": "周五",
                "6": "周六"
            },
            fullDate: "y年M月d日EEEE",
            longDate: "y年M月d日",
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
        var loadings = [] //正在加载中的模块列表
        var factorys = [] //储存需要绑定ID与factory对应关系的模块（标准浏览器下，先parse的script节点会先onload）
        var basepath

        function cleanUrl(url) {
            return (url || "").replace(/[?#].*//*, "")
        }

        plugins.js = function(url, shim) {
            var id = cleanUrl(url)
            if (!modules[id]) { //如果之前没有加载过
                modules[id] = {
                    id: id,
                    parent: parent,
                    exports: {}
                }
                if (shim) { //shim机制
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
            var id = url.replace(/(#.+|\W)/g, "") ////用于处理掉href中的hash与所有特殊符号
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
        if (!cur) { //处理window safari的Error没有stack的问题
            cur = avalon.slice(DOC.scripts).pop().src
        }
        var url = cleanUrl(cur)
        basepath = kernel.base = url.slice(0, url.lastIndexOf("/") + 1)

        function getCurrentScript(base) {
            // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
            var stack
            try {
                a.b.c() //强制报错,以便捕获e.stack
            } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
                stack = e.stack
                if (!stack && window.opera) {
                    //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                    stack = (String(e).match(/of linked script \S+/g) || []).join(" ")
                }
            }
            if (stack) {
                //e.stack最后一行在所有支持的浏览器大致如下:
                //chrome23:
                //at http://113.93.50.63/data.js:4:1
                //firefox17:
                //@http://113.93.50.63/query.js:4
                //opera12:http://www.oldapps.com/opera.php?system=Windows_XP
                //@http://113.93.50.63/data.js:4
                //IE10:
                //at Global code (http://113.93.50.63/data.js:4:1)
                //firefox4+ 可以用document.currentScript
                stack = stack.split(/[@ ]/g).pop() //取得最后一行,最后一个空格或@之后的部分
                stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "") //去掉换行符
                return stack.replace(/(:\d+)?:\d+$/i, "") //去掉行号与或许存在的出错字符起始位置
            }
            var nodes = (base ? DOC : head).getElementsByTagName("script") //只在head标签中寻找
            for (var i = nodes.length, node; node = nodes[--i]; ) {
                if ((base || node.className === subscribers) && node.readyState === "interactive") {
                    return node.className = node.src
                }
            }
        }

        function checkCycle(deps, nick) {
            //检测是否存在循环依赖
            for (var id in deps) {
                if (deps[id] === "司徒正美" && modules[id].state !== 2 && (id === nick || checkCycle(modules[id].deps, nick))) {
                    return true
                }
            }
        }

        function checkDeps() {
            //检测此JS模块的依赖是否都已安装完毕,是则安装自身
            loop: for (var i = loadings.length, id; id = loadings[--i]; ) {

                var obj = modules[id],
                    deps = obj.deps
                for (var key in deps) {
                    if (ohasOwn.call(deps, key) && modules[key].state !== 2) {
                        continue loop
                    }
                }
                //如果deps是空对象或者其依赖的模块的状态都是2
                if (obj.state !== 2) {
                    loadings.splice(i, 1) //必须先移除再安装，防止在IE下DOM树建完后手动刷新页面，会多次执行它
                    fireFactory(obj.id, obj.args, obj.factory)
                    checkDeps() //如果成功,则再执行一次,以防有些模块就差本模块没有安装好
                }
            }
        }

        function checkFail(node, onError, fuckIE) {
            var id = cleanUrl(node.src) //检测是否死链
            node.onload = node.onreadystatechange = node.onerror = null
            if (onError || (fuckIE && !modules[id].state)) {
                setTimeout(function() {
                    head.removeChild(node)
                    node = null // 处理旧式IE下的循环引用问题
                })
                log("加载 " + id + " 失败" + onError + " " + (!modules[id].state))
            } else {
                return true
            }
        }
        var rdeuce = /\/\w+\/\.\./

        function loadResources(url, parent, ret, shim) {
            //1. 特别处理mass|ready标识符
            if (url === "ready!" || (modules[url] && modules[url].state === 2)) {
                return url
            }
            //2. 转化为完整路径
            if (typeof kernel.shim[url] === "object") {
                shim = kernel.shim[url]
            }
            if (kernel.paths[url]) { //别名机制
                url = kernel.paths[url]
            }
            //3.  处理text!  css! 等资源
            var plugin
            url = url.replace(/^\w+!/, function(a) {
                plugin = a.slice(0, -1)
                return ""
            })
            plugin = plugin || "js"
            plugin = plugins[plugin] || noop
            //4. 补全路径
            if (/^(\w+)(\d)?:.*/
            /*.test(url)) {
                ret = url
            } else {
                parent = parent.substr(0, parent.lastIndexOf("/"))
                var tmp = url.charAt(0)
                if (tmp !== "." && tmp !== "/") { //相对于根路径
                    ret = basepath + url
                } else if (url.slice(0, 2) === "./") { //相对于兄弟路径
                    ret = parent + url.slice(1)
                } else if (url.slice(0, 2) === "..") { //相对于父路径
                    ret = parent + "/" + url
                    while (rdeuce.test(ret)) {
                        ret = ret.replace(rdeuce, "")
                    }
                } else if (tmp === "/") {
                    ret = parent + url //相对于兄弟路径
                } else {
                    avalon.error("不符合模块标识规则: " + url)
                }
            }
            //5. 补全扩展名
            url = cleanUrl(ret)
            var ext = plugin.ext
            if (ext) {
                if (url.slice(0 - ext.length) !== ext) {
                    ret += ext
                }
            }
            //6. 缓存处理
            if (kernel.nocache) {
                ret += (ret.indexOf("?") === -1 ? "?" : "&") + (new Date - 0)
            }
            return plugin(ret, shim)
        }

        function loadJS(url, id, callback) {
            //通过script节点加载目标模块
            var node = DOC.createElement("script")
            node.className = subscribers //让getCurrentScript只处理类名为subscribers的script节点
            node[W3C ? "onload" : "onreadystatechange"] = function() {
                if (W3C || /loaded|complete/i.test(node.readyState)) {
                    //mass Framework会在_checkFail把它上面的回调清掉，尽可能释放回存，尽管DOM0事件写法在IE6下GC无望
                    var factory = factorys.pop()
                    factory && factory.delay(id)
                    if (callback) {
                        callback()
                    }
                    if (checkFail(node, false, !W3C)) {
                        log("Debug: 已成功加载 " + url)
                    }
                }
            }
            node.onerror = function() {
                checkFail(node, true)
            }
            node.src = url //插入到head的第一个节点前，防止IE6下head标签没闭合前使用appendChild抛错
            head.insertBefore(node, head.firstChild) //chrome下第二个参数不能为null
            log("Debug: 正准备加载 " + url) //更重要的是IE6下可以收窄getCurrentScript的寻找范围
        }

        innerRequire = avalon.require = function(list, factory, parent) {
            // 用于检测它的依赖是否都为2
            var deps = {},
            // 用于保存依赖模块的返回值
                args = [],
            // 需要安装的模块数
                dn = 0,
            // 已安装完的模块数
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
                        deps[url] = "司徒正美" //去重
                    }
                }
            })
            modules[id] = {//创建一个对象,记录模块的加载情况与其他信息
                id: id,
                factory: factory,
                deps: deps,
                args: args,
                state: 1
            }
            if (dn === cn) { //如果需要安装的等于已安装好的
                fireFactory(id, args, factory) //安装到框架中
            } else {
                //放到检测列队中,等待checkDeps处理
                loadings.unshift(id)
            }
            checkDeps()
        }
        */
        /**
         * 定义模块
         * @param {String} id ? 模块ID
         * @param {Array} deps ? 依赖列表
         * @param {Function} factory 模块工厂
         * @api public
         *//*
        innerRequire.define = function(id, deps, factory) { //模块名,依赖列表,模块本身
            var args = aslice.call(arguments)

            if (typeof id === "string") {
                var _id = args.shift()
            }
            if (typeof args[0] === "function") {
                args.unshift([])
            } //上线合并后能直接得到模块ID,否则寻找当前正在解析中的script节点的src作为模块ID
            //现在除了safari外，我们都能直接通过getCurrentScript一步到位得到当前执行的script节点，
            //safari可通过onload+delay闭包组合解决
            var name = modules[_id] && modules[_id].state >= 1 ? _id : cleanUrl(getCurrentScript())
            if (!modules[name] && _id) {
                modules[name] = {
                    id: name,
                    factory: factory,
                    state: 1
                }
            }
            factory = args[1]
            factory.id = _id //用于调试
            factory.delay = function(d) {
                args.push(d)
                var isCycle = true
                try {
                    isCycle = checkCycle(modules[d].deps, d)
                } catch (e) {
                }
                if (isCycle) {
                    avalon.error(d + "模块与之前的某些模块存在循环依赖")
                }
                delete factory.delay //释放内存
                innerRequire.apply(null, args) //0,1,2 --> 1,2,0
            }

            if (name) {
                factory.delay(name, args)
            } else { //先进先出
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
        if (DOC.body) { //  在IE8 iframe中doScrollCheck可能不正确
            modules["ready!"].state = 2
            innerRequire.checkDeps()
            fireReady = noop //隋性函数，防止IE9二次调用_checkDeps
        }
    }

    function doScrollCheck() {
        try { //IE下通过doScrollCheck检测DOM树是否建完
            root.doScroll("left")
            fireReady()
        } catch (e) {
            setTimeout(doScrollCheck)
        }
    }

    if (DOC.readyState === "complete") {
        setTimeout(fireReady) //如果在domReady之外加载
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
        //IE6-9下这个通常只要1ms,而且没有副作用，不会发出请求，setImmediate如果只执行一次，与setTimeout一样要140ms上下
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
                    drainQueue() //在interactive阶段就触发
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

// TODO(wuhf): 强化$.ajax让它支持style类型(暂时不支持onerror)image类型和修复script.onerror
;(function ($) {
    var DOC = document, script,
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
    // 对image 进行处理
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

    // 修复script onload的bug
    $.ajaxTransport('+script', function(s){
        var src = s.url;
        if (s.crossDomain) {
            return {
                send: function(_, complete){
                    var handler;
                    if (DOC.dispatchEvent) {
                        // 对于w3c标准浏览器，采用onerror和onload判断脚本加载情况
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
     * CSS Transform 过渡类
     * 主要用于序列反序列transform字符串，生成transform的键值表，用于$.fn.css或者$.fn.transit, $.fn.css({ transform: '...' })
     * @param {string} transValue
     * @returns {Transform}
     * @constructor
     * @example
     * var t = new Transform("rotate(90) scale(4)");
     * t.rotate             //=> "90deg"
     * t.scale              //=> "4,4"
     *
     * 这样set和get
     * t.set('rotate', 4)
     * t.rotate             //=> "4deg"
     *
     * 使用toString来进行序列化，toString参数为true时，为webkit版本.
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
         * 通过字符串反序列化
         * @param prop 需要设置的属性
         * @param val 需要设置的值
         * @example  t.setFromString('scale', '2,4'); 相当于 set('scale', '2', '4');
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
         * 设置一个属性
         * @param prop 属性名
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
             * 旋转
             * @param theta 角度
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
             * 缩放
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
            // 透视
            perspective: function(dist) {
                this.perspective = unit(dist, 'px');
            },
            // 相当于平移的XY
            x: function(x) {
                this.set('translate', x, null);
            },
            y: function(y) {
                this.set('translate', null, y);
            },
            /**
             * 平移
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
        // 转换transform
        // 转换，由构造体调用
        parse: function(str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                self.setFromString(prop, val);
            });
        },

        /**
         * 序列化
         * 将反序列化过的transform序列化
         * @param use3d 是否使用3D
         * @returns {string}
         */
        toString: function(use3d) {
            var re = [];

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    // 如果浏览器不支持3D transform，则不使用
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

// 一个CSS对应transition-property的对应表
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

// 获取属性带前缀的键
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

// 检查是否支持transform3D
// 理论上应该当Webkit和Firefox 10+ 返回true
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

// 检查浏览器对transition各个属性的兼容情况
    support.transition      = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transform       = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.transform3d     = checkTransform3dSupport();

// 扩展进$.support
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
            $.support[key] = support[key];
        }
    }

// 避免IE的内存泄漏
    div = null;

    function registerCssHook(prop, isPixels) {
        // 对于某些属性，不应该包含'px'
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

// 'transform' CSS 钩子
// 允许你通过$.fn.css来修改transition
//
// $("#hello").css({ transform: "rotate(90deg)" });
// $("#hello").css('transform');
// => { rotate: '90deg' }
//
    $.cssHooks['transit:transform'] = {
        // getter会返回一个Transition对象
        get: function(elem) {
            return $(elem).data('transform') || new Transform();
        },
        // setter会接收一个Transform对象或者一个字符串
        set: function(elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            // 在Chrome，当元素在viewport外缩放的时候3D版本的缩放不会凑效，为了不冒险，
            // 决定关闭3D缩放
            // http://davidwalsh.name/detecting-google-chrome-javascript
            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

// 为.css({ transform: '...' })添加CSS钩子
// 对于jQuery 1.8+，刻意覆盖默认transform
    $.cssHooks.transform = {
        set: $.cssHooks['transit:transform'].set
    };

// 其他钩子
// 允许使用rotate, scale等
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
    $.each(this, function(){
        var $this = $(this)
        if($this.children('bgiframe').length == 0){   //如果不存在才插进去
            var $iframe = $('<iframe frameborder="0" scrolling="no" style="width: 100%;height: 100%;z-index: -2;filter: alpha(opacity=0);opacity: 0;"></iframe>')
            var $wraper = $(document.createElement('bgiframe')).css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                zoom: 1,
                zIndex: -1
            });
            $this.prepend($wraper.append($iframe));
            $($iframe[0].contentWindow).on('click', function(e){
                $iframe.trigger(e)
            });
        }
    });
    return this
};

// .position 改造;
(function($, undefined) {

    $.ui = $.ui || {};
    var uiPosition;

    var cachedScrollbarWidth, supportsOffsetFractions,
        max = Math.max,
        abs = Math.abs,
        round = Math.round,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /[\+\-]\d+(\.[\d]+)?%?/,
        rposition = /^\w+/,
        rpercent = /%$/,
        _position = $.fn.position;

    function getOffsets( offsets, width, height ) {
        return [
            parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
            parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
        ];
    }

    function parseCss( element, property ) {
        return parseInt( $.css( element, property ), 10 ) || 0;
    }

    function getDimensions( elem ) {
        var raw = elem[0];
        if ( raw.nodeType === 9 ) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: { top: 0, left: 0 }
            };
        }
        if ( $.isWindow( raw ) ) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
            };
        }
        if ( raw.preventDefault ) {
            return {
                width: 0,
                height: 0,
                offset: { top: raw.pageY, left: raw.pageX }
            };
        }
        return {
            width: elem.outerWidth(),
            height: elem.outerHeight(),
            offset: elem.offset()
        };
    }

    $.position = {
        scrollbarWidth: function() {
            if ( cachedScrollbarWidth !== undefined ) {
                return cachedScrollbarWidth;
            }
            var w1, w2,
                div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
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
            var overflowX = within.isWindow || within.isDocument ? "" :
                    within.element.css( "overflow-x" ),
                overflowY = within.isWindow || within.isDocument ? "" :
                    within.element.css( "overflow-y" ),
                hasOverflowX = overflowX === "scroll" ||
                    ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
                hasOverflowY = overflowY === "scroll" ||
                    ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
            return {
                width: hasOverflowY ? $.position.scrollbarWidth() : 0,
                height: hasOverflowX ? $.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo: function( element ) {
            var withinElement = $( element || window ),
                isWindow = $.isWindow( withinElement[0] ),
                isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
            return {
                element: withinElement,
                isWindow: isWindow,
                isDocument: isDocument,
                offset: withinElement.offset() || { left: 0, top: 0 },
                scrollLeft: withinElement.scrollLeft(),
                scrollTop: withinElement.scrollTop(),

                // support: jQuery 1.6.x
                // jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
                width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
                height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
            };
        }
    };

    $.fn.position = function( options ) {
        if ( !options || !options.of ) {
            return _position.apply( this, arguments );
        }

        // make a copy, we don't want to modify arguments
        options = $.extend( {}, options );

        var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
            target = $( options.of ),
            within = $.position.getWithinInfo( options.within ),
            scrollInfo = $.position.getScrollInfo( within ),
            collision = ( options.collision || "flip" ).split( " " ),
            offsets = {};

        dimensions = getDimensions( target );
        if ( target[0].preventDefault ) {
            // force left top to allow flipping
            options.at = "left top";
        }
        targetWidth = dimensions.width;
        targetHeight = dimensions.height;
        targetOffset = dimensions.offset;
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
            if ( !supportsOffsetFractions ) {
                position.left = round( position.left );
                position.top = round( position.top );
            }

            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };

            $.each( [ "left", "top" ], function( i, dir ) {
                if ( uiPosition[ collision[ i ] ] ) {
                    uiPosition[ collision[ i ] ][ dir ]( position, {
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
                        elem: elem
                    });
                }
            });

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

    uiPosition = {
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
                } else if ( overRight > 0 ) {
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
                    if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
                        position.top += myOffset + atOffset + offset;
                    }
                } else if ( overBottom > 0 ) {
                    newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                    if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
            }
        },
        flipfit: {
            left: function() {
                uiPosition.flip.left.apply( this, arguments );
                uiPosition.fit.left.apply( this, arguments );
            },
            top: function() {
                uiPosition.flip.top.apply( this, arguments );
                uiPosition.fit.top.apply( this, arguments );
            }
        }
    };

// fraction support test
    (function() {
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
        supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

        testElement.innerHTML = "";
        testElementParent.removeChild( testElement );
    })();

})(armer);



// 扩展内建jQuery css easing
(function () {
    // 基于Robert Penner的缓动公式 (http://www.robertpenner.com/easing)
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

    // 扩展一些CSStransition-timing-function的js调用
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
    // 检测需要的transitionend
    var eventNames = {
        'transition':       'transitionend',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition':     'MSTransitionEnd'
    };
    // 根据support调用不同的事件
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;
    var transitionPrefilters = [defaultPrefilter];
    // 由于transitionEnd的表现不一致，所以不适用它作为判断动画完成的时机
    //$.Transition.useTransitionEnd = true;
    var Transition = function(elem, properties, options){
        var transition,
            result,
            index = 0,
            length = transitionPrefilters.length,
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
        // 默认动画为swing
        options.easing = options.easing || 'swing';
        oldTransitions = elem.style[support.transition];
        if ($.Transition.useTransitionEnd) {
            bound = true;
            elem.addEventListener(transitionEnd, handler);
        } else window.setTimeout(handler, options.duration);

        transition = deferred.promise({
            elem: elem,
            props: $.extend({}, properties),
            opts: $.extend(true, { specialEasing: {} }, options),
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

        for ( ; index < length ; index++ ) {
            result = transitionPrefilters[index].call(transition, elem, properties, transition.opts);
            if (result) {
                return result;
            }
        }

        if ($.isFunction(transition.opts.start)) {
            transition.opts.start.call(elem, transition);
        }

        // webkit外必须强迫重绘才能触发
        var s = elem.offsetWidth;
        elem.style[support.transition] = getTransition(properties, options.duration, options.easing, options.delay);
        $elem.css(properties);

        return transition.done( transition.opts.done, transition.opts.complete )
            .fail( transition.opts.fail )
            .always( transition.opts.always );
    };
    $.Transition = $.extend(Transition, {
        // 临时关闭transition效果
        enabled: true,
        // 设置是否通过transitionEnd来触发动画的callback
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
     * 根据CSS属性获取Transition属性
     * @param props CSS属性
     * @returns {Array} 返回一个用于transition-property的属性数组
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
    var defaultDisplay = $.defaultDisplay,
        isHidden = $.isHidden,
        rfxtypes = /^(?:toggle|show|hide)$/

    function defaultPrefilter( elem, props, opts ) {
        /* jshint validthis: true */
        var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
            anim = this,
            orig = {},
            style = elem.style,
            hidden = elem.nodeType && isHidden( elem ),
            dataShow = jQuery._data( elem, "fxshow" );

        // height/width overflow pass
        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            display = $.css( elem, "display" );

            // Test default display if display is currently "none"
            checkDisplay = display === "none" ?
                $._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

            if ( checkDisplay === "inline" && $.css( elem, "float" ) === "none" ) {

                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
                    style.display = "inline-block";
                } else {
                    style.zoom = 1;
                }
            }
        }

        if ( opts.overflow ) {
            style.overflow = "hidden";
            if ( !support.shrinkWrapBlocks() ) {
                anim.always(function() {
                    style.overflow = opts.overflow[ 0 ];
                    style.overflowX = opts.overflow[ 1 ];
                    style.overflowY = opts.overflow[ 2 ];
                });
            }
        }

        // show/hide pass
        for ( prop in props ) {
            value = props[ prop ];
            if ( rfxtypes.exec( value ) ) {
                delete props[ prop ];
                toggle = toggle || value === "toggle";
                if ( value === ( hidden ? "hide" : "show" ) ) {

                    // If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
                    if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
                        hidden = true;
                    } else {
                        continue;
                    }
                }
                orig[ prop ] = dataShow && dataShow[ prop ] || $.style( elem, prop );

                // Any non-fx value stops us from restoring the original display value
            } else {
                display = undefined;
            }
        }

        if ( !jQuery.isEmptyObject( orig ) ) {
            if ( dataShow ) {
                if ( "hidden" in dataShow ) {
                    hidden = dataShow.hidden;
                }
            } else {
                dataShow = $._data( elem, "fxshow", {} );
            }

            // store state if its toggle - enables .stop().toggle() to "reverse"
            if ( toggle ) {
                dataShow.hidden = !hidden;
            }
            if ( hidden ) {
                $( elem ).show();
            } else {
                anim.done(function() {
                    $( elem ).hide();
                });
            }
            anim.done(function() {
                var prop;
                $._removeData( elem, "fxshow" );
                for ( prop in orig ) {
                    $.style( elem, prop, orig[ prop ] );
                }
            });
            //console.log(orig)
            for (prop in orig) {
                var start = $(elem).css(prop);
                if (!( prop in dataShow )) {
                    dataShow[prop] = start;
                }
                if (hidden) {
                    style[prop] = 0
                }
                props[prop] = hidden ? dataShow[ prop ] : 0;
            }
/*
            for ( prop in orig ) {
                tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

                if ( !( prop in dataShow ) ) {
                    dataShow[ prop ] = tween.start;
                    if ( hidden ) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
*/

            // If this is a noop like .hide().hide(), restore an overwritten display value
        } else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
            style.display = display;
        }
    }

    /**
     * 生成序列化的transition
     * @param properties 属性
     * @param duration 持续时间
     * @param easing 过场动画
     * @param delay 延时
     * @returns {string}
     * @exaple
     * getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');  => 'opacity 500ms ease, -webkit-transform 500ms ease'
     */
    function getTransition(properties, duration, easing, delay) {
        // 获取需要的Transition属性
        var props = getProperties(properties);

        // 通过别称获取具体的timming-function
        if ($.cssEasing[easing]) { easing = $.cssEasing[easing]; }

        // 创建duration/easing/delay属性
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

        // 组合不同的CSS属性
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        $.each(props, function(i, name) {
            transitions.push(name + ' ' + attribs);
        });
        return transitions.join(', ');
    }
    /**
     * 将速度转换为毫秒
     * @param duration
     * @returns {*}
     * @example
     * toMS('fast')   //=> '400ms'
     * toMS(10)       //=> '10ms'
     */
    function toMS(duration) {
        var i = duration;

        // Allow string durations like 'fast' and 'slow', without overriding numeric values.
        if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) { i = $.fx.speeds[i] || $.fx.speeds._default; }

        return $.unit(i, 'ms');
    }

    // 暴露一个测试用的方法
    $.Transition.getTransitionValue = getTransition;

    if (!$.support.transition)
        $.fn.transit = $.fn.transition = $.fn.animate;

    // TODO: classAnimation 让JS分析transition进行js动画过渡模拟tansitionCSS动画


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
    // 过滤，或者过滤并且求差集
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
    // 通过currentStyle获取transition
    var queryTransition = function(currentStyle){
        var i, tLeng = 0, t = [], property = [], duration = [], timingFunction = [], delay = [], transition = {};
        // 必须在try运行，否则取自定义属性可能导致程序不能继续运行
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
        // 整合成一个数组
        for (i = 0; i < property.length; i++) {
            //alert(property[i]);
            t[i + tLeng] = {property: property[i], duration: duration[i] || duration[0], timingFunction: timingFunction[i] || timingFunction[0], delay: delay[i] || delay[0]};
        }
        // 去重合并
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
            // 遍历需要做动画的元素，抽取出原来样式
            allAnimations = allAnimations.map(function(){
                var t = queryTransition(this.currentStyle), el = $(this);
                return {
                    el: el,
                    start: getStyles(this, t),
                    transitions: t
                }
            });
            applyClassChange();
            // 再次遍历需要，计算出样式的差异
            allAnimations = allAnimations.map(function() {
                this.diff = getStyles(this.el[0], this.start, true);
                return this;
            });
            animated.attr( "class", baseClass );
            allAnimations = allAnimations.map(function(){
                var i = firstVal(this.transitions);
                // 只抽取第一个duration、timingFunction、delay来简化流程
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

                // 设置新类
                applyClassChange();

                // 遍历所有动画的元素，清除所有css属性
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
            // TODO: 判断是否做动画..
            var withAnimation = true;
            if (withAnimation) classAnimation.call(this, {add: {classes: classes, orig: orig}})
            else orig.apply(this, arguments);
            return this;
        }
    })
})(armer);

;(function () {
    var fn;
    /**
     * 事件发射器，让一个对象拥有订阅事件的能力
     * @param [obj] {object} 需要扩展的对象
     * @constructor
     * @class armer.EventEmitter
     */
     function Emitter(obj) {
        var callee = arguments.callee;
        if ($.isObjectLike(obj) && obj.emit != fn.emit) return $.mix(obj, fn);
        if (!(this instanceof $.EventEmitter)) return new callee();
    };
    Emitter.fn = Emitter.prototype = fn = $.Object({
        /**
         * 绑定一个事件处理器
         * @param types {string} 绑定事件的类型
         * @param handler {function} 绑定的处理器
         * @method on
         */
        on: function () {
            [].unshift.call(arguments, this);
            $.event.add.apply($.event, arguments);
            return this
        },
        /**
         * 解绑一个或多个事件处理器
         * @param types {string} 解绑事件的类型
         * @param [handler] {function} 解绑事件的处理器
         * @async
         * @method off
         */
        off: function () {
            [].unshift.call(arguments, this);
            $.event.remove.apply($.event, arguments);
            return this
        },
        /**
         * 触发一个或多个事件
         * @param event {$.Event|string} 解绑事件或者事件类型
         * @param [data] {*} 触发事件传递的数据
         * @param [onlyHandlers] {boolean} 是否不触发默认事件
         * @method emit
         */
        emit: function (event, data, onlyHandlers) {
            var handle, ontype, tmp, orignData,
                eventPath = [ this || document ],
                type = $.hasOwn(event, "type") ? event.type : event,
                namespaces = $.hasOwn(event, "namespace") ? event.namespace.split(".") : [];

            tmp = this;
            if (type.indexOf(".") >= 0) {
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;

            event = event[ $.expando ] ?
                event :
                new $.Event(type, typeof event === "object" && event);

            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ?
                new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                null;

            event.result = undefined;
            if (!event.target) {
                event.target = this;
            }
            orignData = data = $.type(data, 'array') ? data : [data];
            data = $.makeArray(orignData, [ event ]);
            handle = ( $._data(this, "events") || {} )[ event.type ] && $._data(this, "handle");
            if (handle) {
                handle.apply(this, data);
            }
            handle = ontype && this[ ontype ];
            if (handle && handle.apply && $.acceptData(this)) {
                event.result = handle.apply(this, data);
                if (event.result === false) {
                    event.preventDefault();
                }
            }
            event.type = type;
            var actFn
            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if (ontype && (actFn = this [ '_' + type ] || this[ type ] ) && !$.isWindow(this)) {
                    tmp = this[ ontype ];

                    if (tmp) {
                        this[ ontype ] = null;
                    }
                    $.event.triggered = type;
                    event.actionReturns = actFn.apply(this, orignData);
                    $.event.triggered = undefined;

                    if (tmp) {
                        this[ ontype ] = tmp;
                    }
                }
            }
            return event.result;
        }
    });
    $.mix(fn, {
        constructor: Emitter,
        /**
         * 触发一个事件
         * @method trigger
         */
        trigger: fn.emit
    });
    $.EventEmitter = Emitter;
    Emitter.mix = $.mix;
    Emitter.extend = $.factory;
    Emitter.trigger =  function(emitter, type){
        var args = [].slice.call(arguments, 2);
        var e = $.Event(type);
        args.unshift(e);
        emitter.trigger.apply(emitter, args);
        return e.actionReturns;
    }
})();

// valuechange事件，监听来自键盘敲打，复制咱贴，触屏事件，语音输入导致的表单值变化
/*
 $('input').valuechange(function(e){
 e.newValue; // 新的值
 e.oldValue; // 旧的值
 e.realEvent; // 触发变化的真实事件
 })
 */
(function () {
    var DATA = "valuechangeData";
    //如果值前后发生改变,触发绑定回调
    function testChange(elem, realEvent) {
        var old = $.data(elem, DATA);
        var neo = elem.value;
        if (old !== neo) {
            $.data(elem, DATA, neo);
            var event = new $.Event("valuechange");
            event.realEvent = realEvent;
            event.oldValue = old;
            event.newValue = neo;
            $.event.trigger(event, [neo, old], elem);

        }
    }

    function unTestChange(elem) {
        $.removeData(elem, DATA);
    }

    function startTest(event) {
        var elem = event.target;
        if (event.type == 'focus' || event.type == 'mousedown' || event.type == 'paste') {
            $.data(elem, DATA, elem.value);
            event.type == 'paste' && $.nextTick(function () {
                testChange(elem, event);
            })
        }
        else testChange(elem, event);
    }

    function stopTest(event) {
        unTestChange(event.target);
    }

    function listen(elem) {
        unlisten(elem);
        "keydown paste keyup mousedown focus".replace($.rword, function (name) {
            $(elem).on(name + "._valuechange", startTest)
        });
        $(elem).on('blur._valuechange', stopTest);
        $(elem).on('webkitspeechchange._valuechange', function (e) {
            testChange(e.target, e);
        });
    }

    function unlisten(elem) {
        unTestChange(elem);
        $(elem).off("._valuechange")
    }

    $.fn.valuechange = function (callback) {
        var $this = $(this), event, neo, old;
        if (typeof callback == 'function')
            $this.on("valuechange", callback);
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
        setup: function () {
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


// 添加enter,ctrlEnter,backspace事件
(function () {
    var keypressEvents = "keydown";
    $.each(["enter", "ctrlenter", "backspace"], function (i, name) {
        var key = name;
        $.fn[key] = function (fn) {
            return !fn || $.isFunction(fn) ?
                this[fn ? "bind" : "trigger"](key, fn) :
                this["bind"](key, function () {
                    $(fn).trigger("click");
                }); //兼容以前的enter代码
        };
        $.event.special[key] = {
            setup: function () {
                $.event.add(this, keypressEvents + '.' + key, enterHandler, {type: key});
            },
            teardown: function () {
                $.event.remove(this, keypressEvents + '.' + key, enterHandler);
            }
        };
    });

    function enterHandler(e) {
        var pass = true;
        switch (parseInt(e.which)) {
            case 13:
                if ((e.data.type != "ctrlEnter" && e.data.type != "enter") ||
                    (e.data.type == "ctrlEnter" && !e.metaKey && !e.ctrlKey) ||
                    (e.data.type == "enter" && e.metaKey))
                    pass = false;
                break;
            case 8:
                if (e.data.type != "backspace")
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
        for (var i = toFix.length; i;) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.on("mousewheel", fn) : this.trigger("mousewheel");
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0, fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if (orgEvent.wheelDelta) {
            delta = orgEvent.wheelDelta;
        }
        if (orgEvent.detail) {
            delta = orgEvent.detail * -1;
        }

        // New school wheel delta (wheel event)
        if (orgEvent.deltaY) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if (orgEvent.deltaX) {
            deltaX = orgEvent.deltaX;
            delta = deltaX * -1;
        }

        // Webkit
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
            lowestDeltaXY = absDeltaXY;
        }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    $.fn.onExcept = function (selector, eventTypes, fn) {
        selector = $(selector);
        return this.on(eventTypes, function (e) {
            var trigger = true;
            selector.each(function () {
                /*
                 $.log(
                 'this是：' + this,
                 'target是：' + e.target,
                 'this是否包含target:' + $.contains(this, e.target),
                 'this是否target:' +  this == e.target
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


(function($){

    $.factory = function(constructor, prototype, base){
        var basePrototype;
        if (!$.isFunction(constructor)) {
            base = prototype;
            prototype = constructor;
            constructor = $.own(prototype, 'constructor') || function(a, b, c, d, e, f){
                var callee = arguments.callee, prototype = callee.prototype;
                if (!(this instanceof callee)) {return new callee(a, b, c, d, e, f)}
                this.constructor = callee;
                if (this._init) {
                    this._init(a, b, c, d, e, f);
                }
            };
        }

        if (!$.isPlainObject(prototype)) {
            base = prototype;
            prototype = {}
        }
        if (!base) {
            base = $.own(prototype, 'inherit') || this;
        }

        // 如果 base报错，具体方法待定
        var baseInit = base.prototype._init
        base.prototype._init = null;
        var tmp = base.prototype;
        try{
            basePrototype = new base();
        } catch(e){
            base = function(){};
            base.prototype = tmp;
            basePrototype = new base();
        }
        base.prototype._init = baseInit;
        var options = $.mixOptions( {}, basePrototype.options, prototype.options);

        $.each(prototype, function(prop, value){
            if ($.isFunction(value)) {
                basePrototype[prop] = (function () {
                    var _super = function () {
                        return base.prototype[prop].apply(this, arguments);
                    }, _superApply = function (args) {
                        return base.prototype[prop].apply(this, args);
                    }, fn = function () {
                        var __super = this._super,
                            __superApply = this._superApply,
                            returnValue;
                        this._super = _super;
                        this._superApply = _superApply;
                        returnValue = value.apply(this, arguments);
                        this._super = __super;
                        this._superApply = __superApply;
                        return returnValue;
                    }
                    fn.toString = function () {
                        return value.toString();
                    }
                    return fn;
                })();
            } else {
                basePrototype[prop] = value;
            }
        });
        constructor.prototype = $.extend(basePrototype, {
            options: options,
            inherit: base
        });
        constructor.extend = base.extend;
        constructor.mix = base.mix;
        return constructor
    };

    $.Object.extend = $.factory;
    if ($.EventEmitter) $.EventEmitter.extend = $.factory;

})(armer);

/*!
 * armerjs - v0.8.9 - 2015-05-04 
 * Copyright (c) 2015 Alphmega; Licensed MIT() 
 */
(function($){
    $.Utility = $.extend(function(){},{
        // 关闭窗口
        'closeWindow' : function(confirmStr){
            if (confirmStr && !confirm(confirmStr)) return;
            if (document.referrer == "") {
                if ($.browser.mozilla) return alert("该窗口需要关闭。但火狐浏览器不支持关闭单独窗口，请手动关闭。");
                window.opener = '';
                window.open('','_self');
            }
            window.close();
        },
        // 文本复制
        'copyText' : function(text, notdebug){
            var copy = true;
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", text);
            }else if (!notdebug) {
                prompt("非IE浏览器请用Ctrl+c手动复制链接", text);
                copy = false;
            }
            return copy;
        },
        // 添加收藏
        'addFavorite' : function(url,title){
            var url = url || top.location.href;
            var title = title || top.document.title;
            if (document.all) {
                window.external.addFavorite(url,title); }
            else if (window.sidebar)  {
                window.sidebar.addPanel(title, url, "");
            } else {
                alert("收藏失败！请使用Ctrl+D进行收藏");
            }
        }
    });


    var list = [], t;
    function start(){
        t = setInterval(function(){
            list.forEach(function(item){
                var now = $.now();
                var pass = getpass(item, now);
                item.tickNum ++;
                if (!item._lastTick) item._lastTick = now;
                if (now - item._lastTick >= item.interval) {
                    item.trigger($.Timer.event.TICK, [pass,  pass / item.timeout, item.tickNum]);
                    item._lastTick = now;
                }
                if (item.tickNum >= item.limit || pass >= item.timeout) {
                    item.trigger($.Timer.event.FINISH);
                }
            })
        }, $.Timer.interval);
    }
    function getpass(item, now) {
        var pass = now - item._startTime + item._pass;
        pass = pass > item.timeout ? item.timeout : pass;
        return pass;
    }

})(armer);


$.Store = (function(){
    function serialize(value){
        return JSON.stringify(value)
    }
    function deserialize(value){
        var result;
        if (typeof value != 'string') result = value;
        try {
            result = JSON.parse(value)
        } catch(e) {}
        // 不是对象的时候，将其值为空对象
        if (!$.isPlainObject(result)) result = {}
        return result
    }
    return $.EventEmitter.extend({
        _init: function(_key, triggerItself){
            this._key = _key;
            this._triggerItself = !!triggerItself;
            this._list = deserialize(localStorage.getItem(this._key));
            this.bind();
        },
        'get': function(key){
            if (key)
                return $.cloneOf(this._list[key]);
            // 先备份一下，以免被误改
            else return $.cloneOf(this._list);
        },
        bind: function(){
            //Chrome下(14.0.794.0)重写了document.domain之后会导致onstorage不触发
            //支持localStorage的情况
            var callback = this._callback.bind(this);
            if ('onstorage' in document) {
                // IE绑到document;
                document.attachEvent("onstorage", callback)
            } else if ($.support.localStorage) {
                // 标准浏览器绑到window;
                window.addEventListener("storage", callback)
            } else if (this.userTicker) {
                // 先刨个坑
            } else {
                // IE678
                window.attachEvent('onfocus', callback)
            }
        },
        _callback: function(e){
            var that = this;
            //IE下不使用setTimeout竟然获取不到改变后的值?!
            $.nextTick(function(){
                e = e || window.storageEvent
                //若变化的key不是绑定的key，则过滤掉
                //IE下不支持key属性,因此需要根据storage中的数据判断key中的数据是否变化
                if (e.key && that._key != e.key) return
                //获取新的值
                var result = that._testAndSet(deserialize(e.newValue || localStorage.getItem(that._key)));
                if (that._isChange(result)) {
                    that.trigger('change', result)
                }
            });
        },
        'set': function(hash, triggerItself){
            var key, isNew = true, value;
            var that = this;
            if ($.type(hash) == 'string') {
                key = hash;
                value = triggerItself;
                triggerItself = arguments[2];
                hash = {}
                hash[key] = value
                isNew = false
                // 如果不是这个hash传递的话，只修改某个字段
            }
            triggerItself = triggerItself == null ? this._triggerItself : triggerItself;
            var result = this._testAndSet(hash, isNew);
            if (this._isChange(result)) {
                triggerItself && this.trigger('change', result);
                // 延迟渲染，以免阻塞
                $.nextTick(function () {
                    localStorage.setItem(that._key, serialize(result[2]))
                })
            }
        },
        _isChange: function(result){
            return !$.isEmptyObject(result[0]) || !$.isEmptyObject(result[1])
        },
        // 比较新旧数据的差异
        _testAndSet: function(valueHash, isNew){
            var i, newValue = {}, oldValue = {}, mix
            if (isNew) mix = $.mix({}, valueHash, this._list)
            else mix = valueHash
            for (i in mix) {
                if (mix.hasOwnProperty(i) && !$.isEqual(this._list[i], valueHash[i])) {
                    // 如果不相等则赋值
                    oldValue[i] = this._list[i];
                    console.log(i)
                    console.log(valueHash.hasOwnProperty(i))
                    if (valueHash.hasOwnProperty(i)) this._list[i] = newValue[i] = $.cloneOf(valueHash[i]);
                    else delete this._list[i]
                }
            }
            return [newValue, oldValue, this._list]
        }
    })
})();
$.store = new $.Store('default-store');

;(function($){

    /**
     * 定时器
     * @param timeout {boolean|number} 超时时间，定时器开始后，会在该时间后停止
     * @param [interval=200] {number} 通知时隔，定时器开始后，每隔一段时间会进行进度通知
     * @param [limit=Infinity] {number} 进度生成次数限制，超过这个次数，定时器将会停止
     * @param [callback] {function} 成功后绑定的成功时间
     * @class armer.Timer
     * @constructor
     * @extends armer.EventEmitter
     */
    $.Timer = $.EventEmitter.extend({
        _init: function(timeout, interval, limit, callback){
            // 总需要的事件
            if ($.type(limit) != 'number' && limit < 1) {
                callback = limit;
                limit = Infinity;
            }
            if ($.type(interval) != 'number') {
                callback = interval;
                interval = null;
            }
            if ($.type(timeout) != 'number') {
                timeout = Infinity;
            }

            this._pass = 0;

            /**
             * 最大超时时间
             * @property timeout
             * @type {number}
             */
            this.timeout = this._total = timeout;
            /**
             * 当前通知数
             * @property tickNum
             * @type {number}
             */
            this.tickNum = 0;
            /**
             * 最大的通知数
             * @property limit
             * @type {number}
             */
            this.limit = limit;
            /**
             * 通知的间隔时间
             * @property interval
             * @type {number}
             */
            this.interval = interval || 200;
            if ($.type(callback) == 'function') {
                this.onfinish = callback;
                this.start();
            }
        },
        /**
         * 开始定时器
         * @method start
         */
        start: function(){
            if (list.length == 0) start();
            $.Array.ensure(list, this);
            this._startTime = $.now();
        },
        finish: function(){
            this.reset();
        },
        /**
         * 停止定时器
         * @method stop
         */
        stop: function(){
            $.Array.remove(list, this);
            if (list.length == 0) clearInterval(t);
        },
        /**
         * 停止并重设定时器
         * @method reset
         */
        reset: function(){
            this.stop();
            this._pass = 0;
            this._total = $.now();
        },
        /**
         * 暂停定时器
         * @method pause
         */
        pause: function(){
            this.stop();
            var now = $.now();
            this._pass = getpass(this, now);
            this._total = now;
        }
    });
    $.Timer.interval = 13;
    $.Timer.event = {
        /**
         * 启动事件
         * @event start
         */
        START: 'start',
        /**
         * 完成事件
         * @event finish
         */
        FINISH: 'finish',
        /**
         * 停止事件
         * @event stop
         */
        STOP: 'stop',
        /**
         * 通知事件
         * @event tick
         */
        TICK: 'tick'
    }

    $.setTimeout = function(callback, timeout){
        return $.Timer(timeout, $.type(callback) == string ? function(){eval(callback)} : callbcak);
    }
    $.clearTimeout = function(timer) {
        timer.stop();
    }
    $.setInterval = function(callback, interval){
        return $.Timer(false, interval, callback);
    }
    $.clearInterval = function(timer){
        timer.stop();
    }

})(armer);
$.Cookie = (function(){
    return $.EventEmitter.extend({
        _init: function(){
            this._list = $.unserialize(document.cookie, ';', '=');
        },
        'get': function(key){
            if (key)
                return $.cloneOf(this._list[key]);
            // 先备份一下，以免被误改
            else return $.cloneOf(this._list);
        },

        'set': function(hash, value){
            var key, isNew = true;
            var that = this;
            if ($.type(hash) == 'string') {
                key = hash;
                hash = {}
                hash[key] = value
                isNew = false
            }
            var options = {};
            if ('expires' in hash) {
                options.expires = hash.expires
                delete hash.expires;
            }
            if ('path' in hash) {
                options.path = hash.path
                delete hash.path;
            }
            var result = this._testAndSet(hash, isNew);
            if (this._isChange(result)) {
                // 延迟渲染，以免阻塞
                $.nextTick(function () {
                    $.each(result[0], function(i, item){
                        var s = {};
                        s[i] = item;
                        document.cookie = $.serialize(s, ';', '=') + '; ' + $.serialize(options, ';', '=', ',', false);
                    });
                })
            }
        },
        _isChange: function(result){
            return !$.isEmptyObject(result[0]) || !$.isEmptyObject(result[1])
        },
        _testAndSet: function(valueHash, isNew){
            var i, newValue = {}, oldValue = {}, mix
            if (isNew) mix = $.mix({}, valueHash, this._list)
            else mix = valueHash
            for (i in mix) {
                if (mix.hasOwnProperty(i) && !$.isEqual(this._list[i], valueHash[i])) {
                    // 如果不相等则赋值

                    oldValue[i] = this._list[i];

                    if (valueHash.hasOwnProperty(i)) this._list[i] = newValue[i] = $.cloneOf(valueHash[i]);
                    else delete this._list[i]
                }
            }
            return [newValue, oldValue, this._list]
        }

    })
})();
$.cookie = new $.Cookie;
/*!
 * armerjs - v0.8.9 - 2015-05-04 
 * Copyright (c) 2015 Alphmega; Licensed MIT() 
 */
// 关掉IE6 7 的动画
if (!$.support.opacity) $.fx.off = true;

$.UI = $.EventEmitter.extend({
    _init: function(){}
});
$.UI.extend = function(name, base, prototype){
    var tmp, namespace, fullName, constructor, constructorName;

    if (typeof name != 'string') {
        prototype = base;
        base = name
        name = null;
    }
    if (!$.isFunction(base)) {
        prototype = base;
        base = this
    }

    prototype = prototype || {};
    constructor = $.factory(prototype, base);
    constructor.mix(base);


    tmp = name.split('.');
    fullName = name = tmp.pop();
    namespace = tmp[0];

    constructorName = name.charAt(0).toUpperCase() + $.camelCase(name).substr(1);
    if (namespace) {
        fullName = namespace + '-' + name;
        tmp = this[namespace] = this[namespace] || {};
    } else {
        tmp = this;
    }
    fullName = 'ui-' + $.hyphen(fullName);

    tmp[constructorName] = constructor;

    $.expr[':'][fullName] = function(elem){
        return !!$.data(elem, fullName);
    };
    $.valHooks[fullName] = {
        'set': function(element, value){
            if ($.fn[name] && $.data(element, fullName)) {

                $(element)[name]('val', value);
            }
        }
    };
    var fullNameCamel = $.camelCase(name)


    $.fn[fullNameCamel] = function() {
        var self = this[0], ui, $this = $(this[0]);
        var args = arguments, command;
        if (!$this[0]) return this;
        // 判断是否有这个方法
        if ($.type(args[0]) != 'string' && !constructor.prototype[args[0]]) {
            command = null;
        } else
            command = [].shift.call(args);
        ui = $.data(self, fullName);
        if (!ui) {
            //如果命令为空，那么拼接参数
            if (command)
                args = [$this];
            else
                [].unshift.call(args, $this);
            ui = constructor.apply($.UI, args)
            $.data(self, fullName, ui);
            if (!command) return this;
        } else if (!command) return ui;
        return ui[command].apply(ui, arguments);
    }

    $(function(){
        $('[type=' + fullName + ']').each(function(){
            $(this)[fullNameCamel]()
        });
    });

    constructor.defaults = constructor.prototype.options;
    constructor.config = function(){
        $.mixOptions.apply($, [this.defaults].concat([].slice.call(arguments)))
    };
    return constructor;
};


$(function(){
    var $b = $('body');
    $b.on('click', '[data-trigger],[href]', function(e){
        var $this = $(e.currentTarget),
            target = $this.data('target'),
            toggle = $this.data('toggle'),
            $target, ui;
        if (!target && toggle) target = $this.attr('href');
        if (target) {
            $target = $(target);
            ui = $target.data('ui-toggle');
            if (!ui) return;
            if (!toggle) {
                for(var i in ui) {
                    $target[i](ui[i]);
                }
            } else {
                $target[toggle](ui[toggle]);
            }
            e.stopPropagation(true);
            return false;
        }
    });
});
//==============================
//   TODO(wuhf): UI级别的方法
//==============================
(function() {

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = $.fn.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        var settings = {};

        placeholder = $.fn.placeholder = function(options) {

            var defaults = {customClass: 'placeholder'};
            settings = $.extend({}, defaults, options);

            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.'+settings.customClass)
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }

                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value === '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass(settings.customClass)) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.'+settings.customClass, this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.'+settings.customClass).each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass(settings.customClass)) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass(settings.customClass);
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value === '') {
            if (input.type === 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass(settings.customClass);
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass(settings.customClass);
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        // https://github.com/mathiasbynens/jquery-placeholder/pull/99
        try {
            return document.activeElement;
        } catch (exception) {}
    }

})();
$(function(){
    $('input, textarea').placeholder();
});

/*可截取多行显示省略号*/
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
            // 复制以下这个地址
            var container = container;
            var oldH, str = str || '<span class="ellipsis">...</span>'
            container = container || this;
            // 获取max-height用来计算行数
            var maxHeight = window.getComputedStyle ? (getComputedStyle(container)['max-height'] || getComputedStyle(container)['maxHeight']) : container.currentStyle['max-height'];
            var match = maxHeight.match(/(0?\.?\d*)px$/);
            if (match) maxHeight = oldH = match[1];
            else return;
            // 用一个空元素测量一下行高，然后去掉
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

            // 去掉一些样式，让其超出范围
            container.style.maxHeight = 'none';
            container.style.overflowY = 'auto';
            container.style.height = 'auto';


            if (arguments.callee.useCssClamp && ('webkitLineClamp' in this.style || 'lineClamp' in this.style)) {
                container.style.textOverflow = 'ellipsis';
                container.style.display = '-webkit-box';
                container.style.webkitBoxOrient = 'vertical';
                container.style.webkitLineClamp = line;
            } else loop.call($(this), $(container), maxHeight, str);


            // 覆盖样式
            container.style.overflowY = 'hidden';
            container.style.maxHeight = oldH + 'px';
        })
    }
}();

$.fn.ellipsis.useCssClamp = true;

(function(){
    var d = 1;
    var EXPR = {
        0 : function(i, step, max, min){
            var s = i + step;
            if (s < min)
                return min;
            else if (s > max)
                return max;
            else return s;
        },
        1:  function(i, step, max, min){
            var diff = max - min;
            var s = i +  ((step / diff > 0 && step % diff == 0) ? diff : (step % diff));
            if (s < min) {
                return max;
            } else if (s > max) {
                return min
            } else return s
        },
        2: function(i, step, max, min){
            var diff = max - min;
            var s = i +  ((step / diff > 0 && step % diff == 0) ? diff : (step % diff));
            if (s < min) {
                d = -d;
                return 2 * min - s;
            } else if (s > max) {
                d = -d;
                return 2 * max - s;
            } else return s
        },
        3: function(i, step, max, min){
            var diff = max - min;
            var s = i +  ((step / diff > 0 && step % diff == 0) ? diff : (step % diff));
            if (s < min) {
                return max- min + s ;
            } else if (s > max) {
                return min - max + s
            } else return s
        }
    };

    var Switcher = $.EventEmitter.extend({
        _init: function(options){
            this.options = $.mixOptions({}, this.constructor.defaults, this.options, options);
            this._index = this.options.start;

            if (typeof this.options.formula == 'number') {
                this.options.formula = {
                    next: EXPR[this.options.formula],
                    prev: EXPR[this.options.formula]
                }
            }

            if (this.options.delay) this.auto(this.options.delay);
        },
        options: {
            delay: false,
            max: 5,
            min: 0,
            start: 0,
            step: 1,
            formula: 1
        },
        _switch: function(i){
            this._index = i;
        },
        index: function(){
            return this._index;
        },
        auto: function(delay){
            var that = this;
            that.off('next');
            if (this.timer) this.timer.stop();
            if (delay) {
                this.timer = $.Timer(true, delay);
                this.timer.on('tick', function(){
                    that.trigger('next')
                }).start();
            }
        },
        next: function(){
            this.trigger('switch', this.options.formula.next(this._index, this.options.step, this.options.max, this.options.min));
        },
        prev: function(){
            this.trigger('switch', this.options.formula.prev(this._index, this.options.step * -1, this.options.max, this.options.min));
        }
    });
    $.UI.Switcher = Switcher;
})();
(function ($) {

    var animate = function($elem, animateArgs){
        return ($.fn.transit || $.fn.animate).apply($elem, animateArgs);
    }
    var openCauseClose;
    /**
     * 对话框构造体
     * @param {jQuery.Deferred|jQuery|function|string} content
     * @param {object} options
     * @class armer.UI.Dialog
     * @extends armer.EventEmitter
     * @constructor
     */
    var Dialog = $.UI.extend('dialog', {
        _init: function(content, options){
            var that = this;
            this.options = $.extend({}, this.constructor.defaults, options);
            if (typeof content == 'string' && /\//.test(content)) {
                var selector, url, off = content.indexOf(" ");
                if ( off >= 0 ) {
                    selector = content.slice(off, content.length);
                    url = content.slice(0, off);
                }
                this._content = function(){
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
                this._content = function(){
                    return $.when($(content));
                };
            else
                this._content = content;
            this.container = $('<div class="' + this.options.dialogClass +'" tabindex="0" style="position: absolute; z-index:1001; display: none; overflow: hidden;"></div>');
        },
        /**
         * 初始化方法
         * @method init
         * @returns {$.Deferred}
         */
        _create: function(){
            var self = this;
            if (typeof this._content == "function") {
                return this._content().done(function($elem){
                    self._content = this;
                    self.container.append($elem.show()).appendTo('body');
                    self.element = $elem;
                })
            } else return this._content
        },
        /**
         * 聚焦弹出框
         * @method focus
         */
        focus: function(){
            var $backdrop = this.options.backdrop;
            var list = this.options.queue;
            var z = this.options.zIndex;
            var that = this;
            var thisZindex, has = false, s;
            $.Array.remove(list, that);
            list.push(that);
            list.forEach(function(item, i){
                s = z.start + i * z.step;
                var b = !!item.lastOpenOptions.showBackdrop;
                has = b || has;
                if (b) thisZindex = s || thisZindex;
                item.container.css('zIndex', s);
            })
            if ($backdrop){
                if (!has)
                    this.constructor.toggleBackdrop(false, $backdrop);
                else $backdrop.css('zIndex', thisZindex);
            }
        },
        isOpened: function(){
            var list = this.options.queue;
            return list.indexOf(this) >= 0
        },
        _innerOpen: function(openOptions){
            var list = this.options.queue, self = this, index, position;
            if (this.isOpened()) return $.when();
            this.lastOpenOptions = openOptions;

            self.container.on('focus.ui.dialog', function(e){
                self.trigger(e);
            });
            if (openOptions.showBackdrop)
                this.constructor.toggleBackdrop(true, this.options.backdrop);
            openCauseClose = true;
            if (openOptions.closeOthers) {
                this.constructor.closeAll();
            }
            openCauseClose = false;
            list.push(self);
            position = typeof openOptions.position == 'object' ? openOptions.position : openOptions.position(list.indexOf(self));
            position.of = position.of || this.options.attach;

            self.container.show().finish().position(position);

            if (!openOptions.animate) {
                return $.when().done(function(){
                    self.trigger('opened.ui.dialog');
                });
            }

            self.container.hide();
            return animate(self.container, openOptions.animate).promise().done(function(){
                self.trigger('opened.ui.dialog');
            });
        },
        _innerClose: function(returnValue, closeOptions){
            var self = this;
            self.container.off('focus.dialog');
            return closeOptions.animate ? animate(this.container.finish(), closeOptions.animate).promise().done(function(){
                this[0].style.top = '';
                this[0].style.left = '';
                self.trigger('closed.ui.dialog', [returnValue]);
            }) : (this.container.hide() && $.when().done(function(){
                self.trigger('closed.ui.dialog', [returnValue]);
            }));
        },
        /**
         * 开关弹出框
         * @method toggle
         * @async
         */
        toggle: function(){
            var list = this.options.queue;
            if (!(list.indexOf(this) >= 0)) this.open.apply(this, arguments);
            else this.close.apply(this, arguments);
        },
        /**
         * 关闭弹出框
         * @method close
         * @async
         * @param [returnValue] 关闭传递的参数
         * @param [closeOptions] 关闭的选项
         * @returns {$.Deferred}
         */
        close: function(returnValue, closeOptions){
            var self = this, list = this.options.queue, ret = $.Deferred();
            if (!(list.indexOf(this) >= 0)) return;
            closeOptions = $.extend({}, this.options.close, closeOptions);
            returnValue = returnValue || closeOptions.returnValue;
            returnValue = $.isFunction(returnValue) ? returnValue.call(this) : returnValue;
            this._innerClose(returnValue, closeOptions).done(function(){
                ret.resolve(returnValue)
            });
            $.Array.remove(this.options.queue, this);
            if (!openCauseClose) {
                if (!list.length) this.constructor.toggleBackdrop(false, this.options.backdrop);
                list.length && list[list.length - 1].container.trigger('focus.ui.dialog');
            }
            return ret
        },
        /**
         * 打开弹出框
         * @method open
         * @async
         * @param [dfd] {$.Deferred} 需要等待的操作
         * @param [openOptions] 打开的选项
         * @returns {$.Deferred}
         */
        open: function(dfd, openOptions){
            var self = this, ret = $.Deferred();
            if (!$.isDeferred(dfd)) {
                openOptions = dfd;
                dfd = null;
            }
            openOptions = $.mixOptions({}, this.options.open, openOptions);
            dfd = dfd || openOptions.dfd;
            var init;
            if (typeof this._content == 'function') {
                var e = $.Event('create');
                self.trigger(e);
                init = e.isDefaultPrevented() ? $.Deferred.reject() : e.actionReturns;
            } else
                init = self._content;
            $.when(init, dfd).done(function(){
                self._innerOpen(openOptions).done(function(){
                    ret.resolve();
                });
                self.trigger('focus.ui.dialog');
                openOptions.getFocus && self.container[0].focus();
            });
            return ret
        }
    }).mix({
        event: {
            OPEN: 'open',
            OPENED: 'opened',
            CLOSE: 'close',
            CLOSED: 'closed',
            FOCUS: 'focus'
        },
        /**
         * 打开/关闭遮罩层
         * @method toggleBackdrop
         * @static
         * @param toggle {boolean} 打开或者关闭
         * @param [$backdrop] {armer}　需要打开或者关闭的弹出框对象
         */
        toggleBackdrop: function(toggle, $backdrop){
            $backdrop = $backdrop || this.defaults.backdrop;
            if (!$backdrop) return;
            var $body = $('body');
            if (!$.contains($body[0], $backdrop[0])) {
                $backdrop.prependTo('body');
                if (!!window.ActiveXObject && !window.XMLHttpRequest) {
                    $backdrop.bgiframe()
                }
            }
            toggle = toggle == null ? $backdrop.css('display') == 'none' : !!toggle;
            $body.toggleClass('with-backdrop', toggle);
            animate($backdrop, [{
                opacity: toggle ? 'show' : 'hide'
            }]);
        },
        /**
         * 关闭所有弹出框
         * @method closeAll
         * @static
         * @param [list] 需要关闭的弹出框的列表
         * @param [returnValue] 需要提供的返回值
         * @param [closeOptions] 关闭的选项
         */
        closeAll: function(list, returnValue, closeOptions){
            list = list || this.defaults.queue;
            var $backdrop;
            list.forEach(function(item){
                var co = $.extend(closeOptions, item.options.close);
                var rt = returnValue || co.returnValue;
                rt = $.isFunction(rt) ? rt.call(this) : rt;
                $backdrop = item.options.backdrop;
                item._innerClose(rt, co)
            });
            list.length = 0;
            !openCauseClose && $backdrop && this.toggleBackdrop(false, $backdrop);
        },
        defaults: {
            dialogClass: 'dialog',
            queue: [],
            attach: $(window),
            zIndex: {
                start: 1300,
                step: 100,
                end: 1400
            },
            open: {
                position: {
                    //at: 'left' + ' bottom' + '+15',
                    at: 'left' + ' bottom' + '+5',
                    my: 'left top',
                    collision: 'flipfit flipfit'
                },
                showBackdrop: false,
                closeOthers: true,
                animate: [{
                    //top: '-=10',
                    opacity: 'show'
                }],
                getFocus: false
            },
            close: {
                animate: [{
                    //top: '+=10',
                    opacity: 'hide'
                }]
            },
            onopen: $.noop,
            onopened: $.noop,
            onclose: $.noop,
            onclosed: $.noop,
            oninit: $.noop,
            onfocus: $.noop
        }

    });


    $.UI.Dialog = Dialog;

    $.UI.Modal = Dialog.extend('modal');
    $.UI.Modal.defaults = {
        dialogClass: 'modal',
        queue: [],
        attach: $(window),
        backdrop: $('<div class="backdrop" style="display: none;"></div>'),
        zIndex: {
            start: 1100,
            step: 10,
            end: 1300
        },
        open: {
            position: function(index){
                var stepX = 20;
                var stepY = 20;
                var offestX = index * stepX;
                var offestY = index * stepX - 30;
                offestX = offestX > 0 ? ('+' + offestX.toString()) : (offestX == 0) ? '' : offestX.toString();
                offestY = offestY > 0 ? ('+' + offestY.toString()) : (offestY == 0) ? '' : offestY.toString();
                return {
                    at: 'center' + offestY + ' center' + offestY,
                    my: 'center center',
                    collision: 'fit'
                }
            },
            showBackdrop: true,
            closeOthers: true,
            getFocus: true,
            animate: [{
                top: '+=30',
                opacity: 'show'
            },{
                done: function(){
                    $(this).find('.modal-form :text, .modal-form textarea').eq(0).focus();
                }
            }]
        },
        close: {
            animate: [{
                opacity: 'hide',
                top: '+=30'
            }]
        },
        onopen: $.noop,
        onopened: $.noop,
        onclose: $.noop,
        onclosed: $.noop,
        oninit: $.noop,
        onfocus: $.noop
    }

})(jQuery);
$.UI.extend('spinner', {
    _init: function(element, options){

        var that= this;
        this.element = element;
        this.output = $('<span class="spinner"><a class="btn-spinup" href="javascript:">-</a><input  type="text"/><a class="btn-spindown" href="javascript:">+</a></span>');
        this._input = this.output.find('input');
        this.options = $.extend({}, this.constructor.defaults, options);

        var tmp;
        this.output.on('click', 'a', function(){
            var $this = $(this);
            var klass = $this.attr('class');
            that.trigger(!~klass.indexOf('up') ? 'spinup' : 'spindown');
        });
        this._input.valuechange(function(e, newValue, oldValue){
            if (newValue === '') {
                tmp = oldValue;
                return;
            }
            that.trigger('validate', [newValue, that.oldValue]);
        }).blur(function(){
            if (this.value === '') {
                that.trigger('validate', [this.value, that.oldValue]);
            }
        }).on('keyup', function(e){
            if (e.which == 38) {
                that.spinup();
                this.select();
                return false;
            } else if (e.which == 40) {
                that.spindown();
                this.select();
                return false;
            }
        });
        this.element.after(this.output);
        this.on('invalid overflow', function(e, _, oldValue){
            that._input.val(oldValue);
        });
        this.editable(this.options.editable);
        this.val(this.element.val());
    },
    editable: function(editable){
        this._input.prop('readonly', !editable);
    },
    spin: function(down){
        var oldValue = this._input.val();
        var step = 0;
        if (down) step = -this.options.step;
        else step = +this.options.step;
        if (step)  this.trigger('validate', [step + +oldValue, oldValue]);
    },
    spinup: function(){
        return this.spin();
    },
    spindown: function(){
        return this.spin(true);
    },
    _change: function(newValue){
        this._input.val(newValue);
        this.element.val(newValue);
        this.oldValue = newValue;
    },
    val: function(newValue){
        if (newValue != null) this.validate(newValue, this.oldValue);
        else return this.element.val();
    },
    _validate: function(newValue, oldValue){
        var that = this;
        var val = +newValue;
        if (isNaN(val) || newValue === '') {
            that.trigger('invalid', [newValue, oldValue]);
        } else if (val < that.options.min || val > that.options.max) {
            that.trigger('overflow', [val, oldValue]);
        } else if (!$.isEqual(val, oldValue))
            this.trigger('change', [val, oldValue]);
    },
    validate: function(newValue, oldValue){
        var that = this;
        var val = +newValue;
        if (isNaN(val) || newValue === '') {
            that.trigger('invalid', [newValue, oldValue]);
        } else if (val < that.options.min || val > that.options.max) {
            that.trigger('overflow', [val, oldValue]);
        } else if (!$.isEqual(val, oldValue))
            this._change(val, oldValue);
    }
}).mix({
    defaults: {
        min: 1,
        max: 99,
        step: 1,
        editable: true,
        oninvalid: function(){
            this.output.addClass('invalid');
        },
        onoverflow: function(){
            this.output.addClass('overflow');
        },
        onchange: function(){
            this.output.removeClass('invalid overflow');
        }
    }
})