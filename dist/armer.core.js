/*!
 * armerjs - v0.6.8 - 2014-12-22 
 * Copyright (c) 2014 Alphmega; Licensed MIT() 
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
                obj = $(obj).find('input,option,textarea').andSelf();
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
                        $.each(value, function(_, value) {
                            k = assume(value);
                            if (k !== void 0) add(i + '[]', k, assignment);
                        });
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
                                s.push(key + assignment + (encode ? encodeURI(value) : value))
                            },
                            resource = $.extend({}, obj);
                        if (typeof join == 'string') {
                            arrSeparator = join;
                            join = function(a){
                                return a.join(arrSeparator);
                            }
                        }
                        if (typeof join == 'function') {
                            for (var i in resource) {
                                if ($.isArray(resource[i]))
                                    resource[i] = join(resource[i]);
                            }
                        }
                        $.each(obj, function(i, value){
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
                    if (value.indexOf('{') == 0) {
                        // 预测是对象或者数组
                        return decodeURIComponent(JSON.parse(value));
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
                        try {
                            return decodeURIComponent(value)
                        } catch(e) {
                            return value;
                        }
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
                        else if (value.indexOf(spliter) > -1) {
                            result[key] = result[key] || [];
                            $.each(value.split(spliter), function(__, value){
                                add(result, key, assume(value))
                            });
                        } else {
                            add(result, key, assume(value))
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
    modules.jQuery = modules.jquery = modules.zepto = { exports: $ };

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
        plusin: {
            auto: {
                config: function(config){
                    var url = $.URL(this.url, this.parent);
                    var ext = url.extension();
                    if (!ext) {
                        url.extension(defaults.ext);
                        ext = 'js';
                    }
                    if (ext == 'js') {
                        this.name = url.fileNameWithoutExt()
                    } else {
                        this.name = url.fileName()
                    }
                    url.search('callback', 'define');
                    this.url = url.toString();
                    this.type = $.ajax.ext2Type[ext];
                },
                callback: function(){
                    var that = this;

                    if (this.type !== 'script'){
                        this.exports = this.originData;
                    } else if (this.factory) {
                        var exports = this.factory.apply(this, getExports(arguments))
                        if (exports != null)
                            this.exports = exports
                        else if (this.exports == null)
                            this.exports = modules.exports.exports
                    }

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
                    modules.exports.exports = modules.exports.exports || eval('(function(){return ' + shim.exports + '})')
                defaults.plusin[mod.method].callback.apply(mod, arguments);
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
     * @param callback 依赖加载成功后执行的回调函数
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

    function require(deps, callback, errorCallback, options){
        // 兼容CMD模式
        if (!callback) {
            var mod;
            if (mod = modules[deps] || modules[id2Config(deps, currentUrl).id] || modules[id2Config(deps).id])
                return mod.exports;
            else {
                throw Error('this module is not define');
            }
        }
        return innerRequire(deps, options).done(function(){
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

        currentUrl = xhrRequestURL || currentScriptURL();
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
            var args = fn.match(/^function[^(]*\(([^)]*)\)/)[1];
            if ($.trim(args) != '')  {
                args = args.split(',');
                requireS = $.trim(args[withCMD]);
                fn.replace(RegExp('[^\\w\\d$_]' + requireS + '\\s*\\(([^)]*)\\)', 'g'), function(_, dep){
                    dep = eval.call(null, dep);
                    if (typeof dep == 'string') mod.deps.push(dep);
                })
            }
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
            c.url = defaults.paths[name] || c.url;
            c = defaults.plusin[c.method].config.call(c) || c;
        }
        c.id = c.id || c.method + '!' + (c.namespace ? (c.namespace + ':') : '') +
            (c.name ? c.name : '')  + (c.url ? ('@' + c.url) : '')
        return c;
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
    require.register = define;
    if (!window.require) window.require = require
    if (!window.define) window.define = define
    $.require = require;
    $.define = define;

    // domready 插件
    defaults.plusin['domready'] = {
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

    };

    var nodes = document.getElementsByTagName("script")
    var dataMain = $(nodes[nodes.length - 1]).data('main')
    if (dataMain) $(function(){require(dataMain, $.noop)});
})(armer, window);
