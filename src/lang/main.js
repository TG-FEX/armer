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

    $.fn.compileAll = function(){
        this.find('script[type="text/html"]').compile();
        return this;
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