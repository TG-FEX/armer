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