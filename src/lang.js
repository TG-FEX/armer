//=========================================
//  TODO(wuhf): lang.extend模块
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
         * 为hash选项对象添加默认成员
         * @param {object} obj 需要
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
           ============= is 系列 ================
         */
        isBlank: function (target) {
            return /^\s*$/.test(target);
        },
        isString: function(obj){
            return $.type(obj) == 'string';
        },
        /**
         * 判定method是否为obj的原生方法，如$.isNative("JSON",window)
         * @param {String} methodKey
         * @param {*} obj 对象
         * @return {Boolean}
         */
        isNative: function(methodKey, obj) {
            var m = obj ? obj[methodKey] : false,
                r = new RegExp(methodKey, "g");
            return !!(m && typeof m != "string" && sopen === (m + "").replace(r, ""));
        },
        /**
         * 是否为空对象
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
        // 判断字符串，对象，数组是否为空
        isEmpty : function(obj) {
            if (obj == null) return true;
            if ($.isArray(obj) || $.isString(obj)) return obj.length === 0;
            for (var key in obj) if (obj.hasOwnProperty(key)) return false;
            return true;
        },
        // 判断一个对象是不是jQ对象
        isQuaryElement : function(obj){
            return typeof obj == 'object' && obj.constructor == $;
        },
        isDefined: function(obj){
            return obj !== null && obj !== undefined
        },
        // 判断是否DOM元素
        isElement : function(obj){
            return !!(obj && obj.nodeType == 1);
        },
        // 判断是否无穷大
        isFinite : function(obj){
            return $.isNumeric(obj) && isFinite(obj);
        },
        isEmptyJson: function(str){return str == '[]' || str == '{}'},
        /**
         * 比较两个变量是否相等
         * @param {*} a 比较对象1
         * @param {*} b 比较对象2
         * @return {boolean} 是否相等
         */
        isEqual: function(){
            var eq = function(a, b, aStack, bStack) {
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
                        if (hasOwn.call(a, key)) {
                            // 计算预测成员数量
                            size++;
                            // 深度比较每个成员
                            if (!(result = hasOwn.call(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                        }
                    }
                    // 确保每个对象都包含相同数量的属性
                    if (result) {
                        for (key in b) {
                            if (hasOwn.call(b, key) && !(size--)) break;
                        }
                        result = !size;
                    }
                }
                // 移除遍历对象堆栈第一个对象
                aStack.pop();
                bStack.pop();
                return result;
            };
            return function(a, b) {
                return eq(a, b, [], []);
            }
        }(),

        // 强化类型判断
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
             * 用于取得数据的类型（一个参数的情况下）或判定数据的类型（两个参数的情况下）
             * $.type(obj) == a 可以推出 $.type(obj, a) == true，但反过来未必
             * 如需进行更细节判断，请使用 $.type(obj, a) 的方式
             *
             * @param {*} obj 要检测的东西
             * @param {String|Array|Function} condition ? 要比较的条件
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
         ============= parse 系列 ================
         */

        /**
         * 将字符串当作JS代码执行
         * @param {string} code
         */
        parseJS: function(code) {
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
        // 将text数据转换为base64字符串
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
         ============= 字符串处理 系列 ================
         */


        template: template,
        /**
         * 字符串插值，有两种插值方法。
         * 第一种，第二个参数为对象，{{}}里面为键名，替换为键值，适用于重叠值够多的情况
         * 第二种，把第一个参数后的参数视为一个数组，{{}}里面为索引值，从零开始，替换为数组元素
         * http://www.cnblogs.com/rubylouvre/archive/2011/05/02/1972176.html
         * @param {string} str
         * @param {*} object 插值包或某一个要插的值
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
         * 查看对象或数组的内部构造
         * @param {*} obj
         * @return {string}
         * https://github.com/tdolsen/jquery-dump/blob/master/jquery.dump.js
         * https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js
         * http://freshbrewedcode.com/jimcowart/2013/01/29/what-you-might-not-know-about-json-stringify/
         */
        dump: function(obj) {
            var space = $.isNative("parse", window.JSON) ? 4 : "\r\t", cache = [],
                text = JSON.stringify(obj, function(key, value) {
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



        // 参数初始化整理方法
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
                            throw new TypeError('参数' + name + '必须符合条件：' + item.condition + '，最少需要' + match + '个，现仅有' + k + '个');
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

    // TODO(wuhf): 类工厂
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
                    for(var i in parent){//继承类成员
                        this[i] = parent[i];
                    }
                    bridge.prototype = parent.prototype;
                    this.prototype = new bridge ;//继承原型成员
                    this._super = parent;//指定父类
                }
                this._init = (this._init || []).concat();
                if( init ){
                    this._init.push(init);
                }
                this.toString = function(){
                    return (init || bridge) + ''
                };
                var proto = this.prototype;
                // FIXME(wuhf): 暂时不需要 备注一下
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
            extend: function(){//扩展类成员
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
            var parent = obj.inherit; //父类
            var init = obj.init ;    //构造器
            var extend = obj.extend; //静态成员
            delete obj.inherit;
            delete obj.init;
            var klass = function () {
                for( var i = 0 , init ; init =  klass._init[i++]; ){
                    init.apply(this, arguments);
                }
            };

            $.extend( klass, mutators ).inherit( parent, init );//添加更多类方法
            return expand( klass, obj ).implement( obj );
        }
    })();


    //构建四个工具方法:$.String, $.Array, $.Number, $.Object, $.Function
    "String,Array,Number,Object,Function,Date".replace($.rword, function(Type) {
        var mix = $[Type];
        $[Type] = function(pack) {
            var isNative = typeof pack == "string",
            //取得方法名
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
        capitalize: function(target) {
            //首字母大写
            return target.charAt(0).toUpperCase() + target.substring(1).toLowerCase();
        },
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
    $.String("charAt,charCodeAt,concat,indexOf,lastIndexOf,localeCompare,match," + "contains,endsWith,startsWith,repeat," + //es6
        "replace,search,slice,split,substring,toLowerCase,toLocaleLowerCase,toUpperCase,trim,toJSON");
    $.Array({
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
                result[i] = cloneOf(target[i]);
            return result;
        },
        remove: function(target, obj){
            var i = target.indexOf(obj);
            if (i>=0) target.splice(i, 1);
        },
        inGroupsOf: function(target, number, fillWith) {
            //将数组划分成N个分组，其中小组有number个数，最后一组可能小于number个数,
            //但如果第三个参数不为undefine时,我们可以拿它来填空最后一组
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
        //使用深拷贝方法将多个对象或数组合并成一个
        if ($.isPlainObject(source[key])) { //只处理纯JS对象，不处理window与节点
            $.Object.merge(source[key], current);
        } else {
            source[key] = cloneOf(current)
        }
        return source;
    }

    $.Object({
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
                clone[key] = cloneOf(target[key]);
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