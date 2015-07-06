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

    var requestUrl = null;
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
                            // try 一下，确保不会把奇奇怪怪的东西放进去
                            try {
                                dep = eval.call(null, dep);
                                if (typeof dep == 'string') deps.push(dep);
                            } catch(e) {}
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
                    } else if (this.url) {
                        url = this.url;
                    } else {
                        url = $.URL(this.name, this.parent);
                    }
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
                if (shim.exports)
                    modules.exports.exports = eval('(function(){return ' + shim.exports + '})()');
                mod.factory = mod.factory || shim.init;
                var args = arguments
                require.rebase(mod.url, function(){
                    if (defaults.plugins[mod.method].callback.apply(mod, args) !== false) {
                        mod.dfd.resolveWith(mod, [mod]);
                    }
                });
                modules.module.exports = null;
            }
            if (mod.deps && mod.deps.length) {
                require.rebase(mod.url, function(){
                    innerRequire(mod.deps).done(success).fail(function(){
                        mod.dfd.rejectWith(mod, arguments);
                    });
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

    function parseDep(config, currentUrl) {
        var mod, tmp;
        if (typeof config == 'string') {
            // 存在同名模块
            tmp = id2Config(config, currentUrl);
            if (!(mod = modules[tmp.id] || modules[config])) {
                config = tmp
            }
        }

        //如果有mod证明已经通过同名模块的if分支
        if (!mod) {
            if ($.isDeferred(config)) {
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
        }
        return mod;
    }
    /**
     * 请求模块
     * @param deps 依赖列表
     * @param parent 当前路径
     * @returns {$.Deferred.promise}
     */

    function innerRequire(deps) {
        if (!$.isArray(deps)) deps = [deps];
        var mDps = [], mod;
        for (var i = 0; i < deps.length; i++) {
            mod = parseDep(deps[i], requestUrl);
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
                            //crossDomain: defaults.charset ? true : void 0,
                            crossDomain: true,
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
                                    require.rebase(mod.url, function(){
                                        $.globalEval(text);
                                    });
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
        if (!callback && !$.isArray(deps)) {
            var mod;
            if (mod = modules[id2Config(deps, requestUrl).id] || modules[deps])
                return mod.exports;
            else {
                throw Error('this module is not define');
            }
        }
        return require.rebase($.URL.current(), function(){
            return innerRequire(deps).done(function(){
                callback.apply(this, getExports(arguments))
            }).fail(errorCallback).promise();
        });

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

        var currentUrl = requestUrl || $.URL.current();
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

    function id2Config(name, parent) {


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
        if (!~c.name.indexOf('://')) {
            s = c.name.split(':');
            if (/:\/\//.test(c.name) && s.length == 2 || s.length == 1)
                c.namespace = defaults.namespace;
            else
                c.namespace = s.shift();
            c.name = s[s.length - 1];
        }
        c.parent = parent;

        //别名机制
        var tmpExt = '.' + defaults.ext;
        var path;
        if (name.indexOf(tmpExt) == name.length - tmpExt.length) {
            path = defaults.paths[name.substr(name.length)]
        } else {
            path = defaults.paths[name + tmpExt];
        }
        if (defaults.paths[name] || path) {
            c.url = defaults.paths[name] || path
        }

        c = defaults.plugins[c.method].config.call(c) || c;
        c.id = c.id || c.method + '!' + (c.namespace ? (c.namespace + ':') : '') + c.url;
        return c;
    }
    define.amd = define.cmd = modules;
    require.defaults = defaults;
    require.config = function(options){
        if ($.isPlainObject(options)) {
            options = $.mixOptions({}, options);
            if (options.paths) $.each(options.paths, function(i, item){
                if ($.type(item) == 'string') {
                    options.paths[i] = $.URL(item);
                }
            });
            $.mixOptions(this.defaults, options);
        } else return defaults[options];
    };
    /**
     * 默认require会在当前js运行的环境下找相对require的路径，但如果要特定require相对路径查找的位置，需要运行这个方法
     * @param url 给出的url
     * @param callback
     * @returns {*}
     */
    require.rebase = function(url, callback){
        var ret
        requestUrl = url;
        ret = callback();
        requestUrl = null;
        return ret;
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
                } else if (this.url) {
                    url = this.url;
                } else {
                    url = $.URL(this.name, this.parent);
                }
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
            } else if (this.url) {
                url = this.url;
            } else {
                url = $.URL(this.name, this.parent);
            }
            this.ext = url.extension();
            if (this.ext == defaults.ext)
                this.name = url.fileNameWithoutExt();
            else
                this.name = url.fileName();

            if (this.ext == 'js')
                this.type = 'script'
            else
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
    window.__uri = window.__uid = window.__uril = function(url){
        return $.URL(url, requestUrl || $.URL.current()).toString()
    }

    if (defaults.main)
        $(function(){
            require.rebase(location.href, function(){
                innerRequire(defaults.main);
            })
        });
})(armer, window);
