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
        plusin: {
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
                    var ext = url.extension();
                    if (!ext) {
                        url.extension(defaults.ext);
                        ext = defaults.ext;
                    } else if (!$.ajax.ext2Type[ext]) {
                        url.extension(defaults.ext, true);
                        ext = defaults.ext;
                    }
                    if (ext == defaults.ext) {
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
                    } else
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
    if (!window.require) window.require = require
    if (!window.define) window.define = define
    $.require = require;
    $.define = define;
    $.use = function(deps){
        return require(deps, $.noop);
    }


    defaults.plusin.domReady = defaults.plusin.ready = defaults.plusin.domready;
    $.each(['js', 'css', 'text', 'html'], function(i, item){
        defaults.plusin[item] = {
            config: function(){
                var url;
                if ($.type(this.url) == 'string') {
                    url = $.URL(this.url, this.parent);
                } else url = this.url;
                var ext = url.extension();
                if (ext == defaults.ext) {
                    this.name = url.fileNameWithoutExt()
                } else {
                    this.name = url.fileName()
                }
                url.search('callback', 'define');
                this.url = url.toString();
                this.type = $.ajax.ext2Type[item] || item;
            },
            callback: defaults.plusin.auto.callback
        }
    });


    var nodes = document.getElementsByTagName("script")
    var dataMain = $(nodes[nodes.length - 1]).data('main')
    if (dataMain) $(function(){require(dataMain, $.noop)});
})(armer, window);
