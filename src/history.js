;(function ($) {
    var History = $.History = function() {
        this.location2hash = {}
    }
    var proxy
    var defaults = {
        basepath: '/',
        html5Mode: false,
        hashPrefix: "!",
        interval: 50
    }
    var rthimSlant = /^\/+|\/+$/g  // 去最左右两边的斜线
    var rleftSlant = /^\//         //最左的斜线
    var rhashBang = /^#(!)?\//   //匹配/#/ 或 /#!/
    var rhashIE = /^[^#]*(#.+)$/
    var anchorElement = document.createElement('a')

    History.started = false
    History.IEVersion = (function() {
        var mode = document.documentMode
        return mode ? mode : window.XMLHttpRequest ? 7 : 6
    })()

    var lastIframeHash = ""
    var lastDocumentHash = ""
    var checkerRunning = false

    History.prototype = {
        constructor: History,
        start: function(options) {
            if (History.started)
                throw new Error("$.history has already been started")
            History.started = true
            this.options = $.mix({}, defaults, this.options, options)

            //IE6不支持maxHeight, IE7支持XMLHttpRequest, IE8支持window.Element，querySelector,
            //IE9支持window.Node, window.HTMLElement, IE10不支持条件注释

            var oldIE = window.VBArray && History.IEVersion <= 7
            //延迟检测
            this.supportPushState = !!(window.history.pushState)
            this.supportHashChange = !!('onhashchange' in window && (!window.VBArray || !oldIE))

            this.html5Mode = !!this.options.html5Mode
            if (!this.supportPushState) {
                $.log("如果浏览器不支持HTML5 pushState，强制使用hash hack!")
                this.html5Mode = false
            }

            anchorElement.href = ('/' + this.options.basepath + '/').replace(rthimSlant, '/')
            var fullpath = History.getAbsolutePath(anchorElement)

            anchorElement.href = "/"
            var rootpath = History.getAbsolutePath(anchorElement)

            this.basepath = fullpath.replace(/\/$/, "")
            this.rootpath = rootpath.replace(/\/$/, "")

            this.rbasepath = new RegExp("^" + this.basepath, "i")
            this.rrootpath = new RegExp("^" + this.rootpath, "i")

            this.location2hash[this.basepath] = ""
            this.location2hash[fullpath] = ""

            var html = '<!doctype html><html><body>@</body></html>'
            if (this.options.domain) {
                html = html.replace("<body>", "<script>document.domain =" + this.options.domain + "</script><body>")
            }
            if (oldIE && !this.html5Mode) {
                //IE6,7在hash改变时不会产生历史，需要用一个iframe来共享历史
                $.ready(function() {
                    var iframe = $.parseHTML('<iframe src="javascript:0"  tabindex="-1" style="display:none" />').firstChild
                    document.body.appendChild(iframe)
                    proxy.iframe = iframe.contentWindow
                    var idoc = proxy.iframe.document
                    idoc.open()
                    idoc.write(html)
                    idoc.close()
                })
                var startedWithHash = !!History.getHash(location.href)
            }

            // 支持popstate 就监听popstate
            // 支持hashchange 就监听hashchange
            // 否则的话只能每隔一段时间进行检测了
            var lastLocation = location.href
            function checkUrl() {
                var currLocation = location.href
                if (proxy && (lastLocation !== currLocation)) {
                    lastLocation = currLocation;
                    if (!proxy.location2hash[ lastLocation ])
                        proxy.location2hash[ lastLocation ] = location.href.split("#!")[1];
                    var hash = proxy.location2hash[ lastLocation ] || ""
                    execRouter(hash)
                }
            }
            function execRouter(hash) {
                var router = $.router
                hash = hash.replace(rhashBang, "/")
                if (router && router.navigate) {
                    router.navigate(hash)
                }
                scrollToAnchorId(hash)
            }
            //thanks https://github.com/browserstate/history.js/blob/master/scripts/uncompressed/history.html4.js#L272
            function checkUrlIE() {
                if (checkerRunning || !proxy.iframe) {
                    return false
                }
                checkerRunning = true
                var idoc = proxy.iframe.document
                var documentHash = proxy.location2hash[ document.URL ] || ""

                var iframeHash = proxy.location2hash[ idoc.URL ] || ""
                if (documentHash !== lastDocumentHash) {//如果是用户点击页面的链接触发
                    lastDocumentHash = documentHash
                    if (iframeHash !== documentHash) {
                        lastIframeHash = iframeHash = documentHash
                        idoc.open()//创建历史记录
                        idoc.write(html)
                        idoc.close()
                        idoc.location.hash = documentHash
                    }
                    execRouter(documentHash)
                } else if (iframeHash !== lastIframeHash) {//如果是后退按钮触发hash不一致
                    lastIframeHash = iframeHash
                    if (startedWithHash && iframeHash === '') {
                        history.go(-1)
                    } else {
                        location.hash = iframeHash
                    }
                }
                checkerRunning = false
            }
            if (this.html5Mode) {
                this.checkUrl = $.event.add(window, 'popstate', checkUrl)
                this._fireLocationChange = checkUrl
            } else if (this.supportHashChange) {//IE 8, 9与其他不支持push state的浏览器使用hashchange
                this.checkUrl = $.event.add(window, 'hashchange', checkUrl)
            } else {//IE 6 7下使用定时器监听URL的变动"
                this.checkUrl = setInterval(checkUrlIE, this.options.interval)
            }
            if (this.html5Mode === false && location.href.indexOf("#!") !== -1) {
                execRouter(location.href.split("#!")[1])
            } else if (this.html5Mode === true && this.rbasepath.test(location.href)) {
                execRouter(RegExp.rightContext)
            }
        },
        // 中断URL的监听
        stop: function() {
            $.event.remove(window, "popstate", this.checkUrl)
            $.event.remove(window, "hashchange", this.checkUrl)
            clearInterval(this.checkUrl)
            History.started = false
        },
        getLocation: function() {
            return History.getfullPath(window.location)
        },
        setLocation: function(path, hash) {
            var prefix = "#" + this.options.hashPrefix + "/"
            if (!this.html5Mode) {//如果支持HTML5 history 新API
                var IEhash = prefix + hash.replace(rleftSlant, "")
            }

            if (path !== this.getLocation()) {
                if (this.html5Mode && rleftSlant.test(path)) {
                    history.pushState({path: path}, window.title, path)
                    this.location2hash[ location.href ] = hash
                    $.nextTick(proxy._fireLocationChange) //由于没有hashchange, setInterval回调做殿后，需要自己擦屁股
                } else {
                    window.location.hash = IEhash
                    this.location2hash[ location.href ] = IEhash
                }
            }
        }
    }


    function getFirstAnchor(list) {
        for (var i = 0, el; el = list[i++]; ) {
            if (el.nodeName === "A") {
                return el
            }
        }
    }

    function scrollToAnchorId(hash, el) {
        hash = hash.replace(rleftSlant, '').replace(/#.*/, '')
        hash = decodeURIComponent(hash)
        if ((el = document.getElementById(hash))) {
            el.scrollIntoView()
        } else if ((el = getFirstAnchor(document.getElementsByName(hash)))) {
            el.scrollIntoView()
        } /*else {
            window.scrollTo(0, 0)
        }*/
    }

    //判定A标签的target属性是否指向自身
    //thanks https://github.com/quirkey/sammy/blob/master/lib/sammy.js#L219
    History.targetIsThisWindow = function targetIsThisWindow(targetWindow) {
        if (!targetWindow || targetWindow === window.name || targetWindow === '_self' || (targetWindow === 'top' && window == window.top)) {
            return true
        }
        return false
    }
    // IE6直接用location.hash取hash，可能会取少一部分内容
    // 比如 http://www.cnblogs.com/rubylouvre#stream/xxxxx?lang=zh_c
    // ie6 => location.hash = #stream/xxxxx
    // 其他浏览器 => location.hash = #stream/xxxxx?lang=zh_c
    // firefox 会自作多情对hash进行decodeURIComponent
    // 又比如 http://www.cnblogs.com/rubylouvre/#!/home/q={%22thedate%22:%2220121010~20121010%22}
    // firefox 15 => #!/home/q={"thedate":"20121010~20121010"}
    // 其他浏览器 => #!/home/q={%22thedate%22:%2220121010~20121010%22}
    History.getHash = function(url) {
        var matches = url.toString().match(rhashIE)
        return matches ? matches[1] : ""
    }
    History.getfullPath = function(url) {
        return [url.pathname, url.search, History.getHash(url)].join("")
    }
    History.getAbsolutePath = function(a) {
        return !a.hasAttribute ? a.getAttribute("href", 4) : a.href
    }
    //https://github.com/asual/jquery-address/blob/master/src/jquery.address.js
    proxy = $.history = new History

    $.event.add(document, "click", function(event) {
        var defaultPrevented = "defaultPrevented" in event ? event['defaultPrevented'] : event.returnValue === false
        if (defaultPrevented || event.ctrlKey || event.metaKey || event.which === 2)
            return
        var target = event.target
        while (target.nodeName !== "A") {
            target = target.parentNode
            if (!target || target.nodeName === "Body") {
                return
            }
        }

        var hostname = target.hostname;
        var port = target.port

        if (hostname === window.location.hostname && port === window.location.port && History.targetIsThisWindow(target.target)) {
            var path = target.getAttribute("href", 2)
            if (path.indexOf("#/") === 0) {
                anchorElement.href = ('/' + proxy.options.basepath + '/').replace(rthimSlant, '/') + path.slice(2)
                var href = History.getAbsolutePath(anchorElement)
                event.preventDefault()
                proxy.setLocation(href.replace(proxy.rrootpath, ""), href.replace(proxy.rbasepath, ""))
            }
            return false
        }

    })
})(armer);
(function ($) {
        if (![].reduce) {
            Array.prototype.reduce = function(fn, lastResult, scope) {
                if (this.length == 0)
                    return lastResult;
                var i = lastResult !== undefined ? 0 : 1;
                var result = lastResult !== undefined ? lastResult : this[0];
                for (var n = this.length; i < n; i++)
                    result = fn.call(scope, result, this[i], i, this);
                return result;
            }
        }
        //表的结构：method+segments.length 普通字段
        function _tokenize(pathStr) {
            var stack = [''];
            for (var i = 0; i < pathStr.length; i++) {
                var chr = pathStr.charAt(i);
                if (chr === '/') {//用于让后面的字符串相加
                    stack.push('');
                    continue;
                } else if (chr === '(') {
                    stack.push('(');
                    stack.push('');
                } else if (chr === ')') {
                    stack.push(')');
                    stack.push('');
                } else {
                    stack[stack.length - 1] += chr;
                }
            }
            return stack.filter(function(str) {
                return str.length !== 0;// 去掉空字符
            });
        }



        function _parse(tokens) {
            var smallAst = [];
            var token;
            while ((token = tokens.shift()) !== void 0) {
                if (token.length <= 0) {
                    continue;
                }
                switch (token) {
                    case '(':
                        smallAst.push(_parse(tokens));
                        break;
                    case ')':
                        return smallAst;
                    default:
                        smallAst.push(token);
                }
            }
            return smallAst;
        }
        var combine = function(list, func) {
            var first = list.shift();
            var second = list.shift();
            if (second === void 0) {
                return first;
            }
            var combination = first.map(function(val1) {
                return second.map(function(val2) {
                    return func(val1, val2);
                });
            }).reduce(function(val1, val2) {
                    return val1.concat(val2);
                });
            if (list.length === 0) {
                return combination;
            } else {
                return combine([combination].concat(list), func);
            }
        }
        // 将一个路由规则转换为一个数组
        // "/users/:user/apps/:app/:id"   -->   ["users",":user","apps",":app",":id"]
        // "/items/:item(/type/:type)"   --> ["items", ":item", ["type", ":type"] ]
        function parse(rule) {
            var tokens = _tokenize(rule);

            var ast = _parse(tokens);

            return ast;
        }

        function Router() {
            this.routingTable = {};
        }
        function parseQuery(path) {
            var array = path.split("#"), query = {}, tail = array[1];
            if (tail) {
                var index = tail.indexOf("?");
                if (index > 0) {
                    var seg = tail.slice(index + 1).split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        query[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
                    }
                }
            }
            return {
                pathname: array[0],
                query: query
            };
        }

        Router.prototype = {
            _set: function(table, query, value) {
                var nextKey = query.shift();//构建一个前缀树，用于高速匹对给定的URL
                if (nextKey.length <= 0) {
                    $.error('构建失败');
                }
                if (nextKey.charAt && nextKey.charAt(0) === ':') {//如果碰到参数
                    var n = nextKey.substring(1);
                    if (table.hasOwnProperty('^n') && table['^n'] !== n) {
                        return false;
                    }
                    table['^n'] = n;
                    nextKey = '^v';
                }
                if (query.length === 0) {
                    table[nextKey] = value;
                    return true;
                } else {
                    var nextTable = table.hasOwnProperty(nextKey) ?
                        table[nextKey] : table[nextKey] = {};
                    return this._set(nextTable, query, value);
                }

            },
            error: function(callback) {
                this.errorback = callback
            },
            //添加一个路由规则
            add: function(method, path, value) {

                var ast = parse(path); //转换为抽象语法树

                var patterns = this._expandRules(ast);//进行全排列，应对可选的fragment

                if (patterns.length === 0) {
                    var query = [method, 0];
                    this._set(this.routingTable, query, value);
                } else {
                    var self = this
                    patterns.every(function(pattern) {
                        var length = pattern.length,
                            query = [method, length].concat(pattern);
                        return self._set(self.routingTable, query, value);
                    });
                }
                return value;
            },
            routeWithQuery: function(method, path) {
                var parsedUrl = parseQuery(path),
                    ret = this.route(method, parsedUrl.pathname);
                if (ret) {
                    ret.query = parsedUrl.query;
                    return ret;
                }
            },
            route: function(method, path) {//将当前URL与
                path = path.trim();
                var splitted = path.split('/'),
                    query = Array(splitted.length),
                    index = 0,
                    params = {},
                    table = [],
                    args = [],
                    val, key, j;
                for (var i = 0; i < splitted.length; ++i) {
                    val = splitted[i];
                    if (val.length !== 0) {
                        query[index] = val;
                        index++;
                    }
                }
                query.length = index;
                table = this.routingTable[method];
                if (table === void 0)
                    return;
                table = table[query.length];
                if (table === void 0)
                    return;
                for (j = 0; j < query.length; ++j) {
                    key = query[j];
                    if (table.hasOwnProperty(key)) {
                        table = table[key];
                    } else if (table.hasOwnProperty('^v')) {
                        params[table['^n']] = key;
                        args.push(key)
                        table = table['^v'];
                    } else {
                        return;
                    }
                }
                return {
                    query: {},
                    path: path,
                    args: args,
                    params: params,
                    value: table
                };
            },
            _expandRules: function(ast) {
                if (Array.isArray(ast) && ast.length === 0) {
                    return [];
                }
                var self = this;
                var result = combine(ast.map(function(val) {
                    if (typeof val === 'string') {
                        return [[val]];
                    } else if (Array.isArray(val)) {
                        return self._expandRules(val).concat([[]]);
                    } else {
                        throw new Error('这里的值只能是字符串或数组 {{' + val + '}}');
                    }
                }), function(a, b) {
                    return a.concat(b);
                });
                return result;
            },
            navigate: function(url) {//传入一个URL，触发预定义的回调
                var match = this.routeWithQuery("GET", url);
                if (match) {
                    var fn = match.value;
                    if (typeof fn === "function") {
                        return  fn.apply(match, match.args);
                    }
                } else if (typeof this.errorback === "function") {
                    this.errorback(url)
                }
            }
        };
        "get,put,delete,post".replace($.rword, function(method) {
            return  Router.prototype[method] = function(path, fn) {
                return this.add(method.toUpperCase(), path, fn)
            }
        })


        $.router = new Router
        // 先添加路由规则与对应的处理函数
        // router.add("GET","/aaa", function(){}) //{GET:{1:{aaa: function(){}}}}
        // router.add("GET","/aaa/bbb", function(){}) //{GET:{1:{aaa:{bbb: function(){}} }}}
        // router.add("GET","/aaa/:bbb", function(){}) //{GET:{1:{aaa: {"^n": "bbb", "^v": function(){}}}}}
        // router.add("GET","/aaa(/:bbb)", function(){}) //{GET:{1:{aaa: {"^n": "bbb", "^v": function(){}}}}}
        // 再启动历史管理器
        // require("ready!", function(bind){
        //     $.history.start();
        // })
    // http://kieran.github.io/barista/
    // https://github.com/millermedeiros/crossroads.js/wiki/Examples
})(armer);