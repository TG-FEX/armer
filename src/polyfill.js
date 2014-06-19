/**
 * =========================================
 * TODO(wuhf): polyFillsģ��
 * ��˵����
 * �޸�ecma�Լ�javascript�ڲ�ͬ��������ֲ�ͬ������
 *
 * �����������ļ���
 * 1. core.js
 *
 * �������������ݡ�
 * 1. �޸����������Ҫ���IE��һЩ֧�ֵ����ֲ���ȷ�ķ���
 * 2. ecmaV5�﷨���� Array.isArray��Array.prototype.forEach��
 * 3. ecmaV6�﷨���� String.prototype.repeat��
 * 4. localstorage
 * 5. json
 * 6. jQuery��ʽ�޸�onhashchange
 * ==========================================
 */
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

                function F() {
                }

                F.prototype = o;
                return new F();
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
