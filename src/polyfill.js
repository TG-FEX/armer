/**
 * =========================================
 * TODO(wuhf): polyFills模块
 * 【说明】
 * 修复ecma以及javascript在不同浏览器表现不同的问题
 *
 * 【依赖以下文件】
 * 1. core.js
 *
 * 【包含以下内容】
 * 1. 修复浏览器（主要针对IE）一些支持但表现不正确的方法
 * 2. ecmaV5语法补丁 Array.isArray、Array.prototype.forEach等
 * 3. ecmaV6语法补丁 String.prototype.repeat等
 * 4. localstorage
 * 5. json
 * 6. jQuery形式修复onhashchange
 * 7. Map类型，Set类型，Promise类型
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

        Date.now = function () {
            return +new Date;
        };

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
            array.forEach(function(item){
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

        if(!$.support.hashChange){
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
