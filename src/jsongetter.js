$.JSONGetter = (function () {
    function createDefaultRetune(retry) {
        if (retry === true) retry = Infinity;
        return function defaultRetryment (dataArray){
            var state = dataArray.State, dfd = $.Deferred();
            if (state == 1 && this._retry < retry) {
                if ($.UI.login)
                    $.UI.login(dataArray).done(function(){
                        dfd.resolve()
                    })
                else dfd.resolve();
            } else {
                dfd.reject();
            }
            return dfd
        }
    }

    function tgDataConvert(jqXHR) {
        var data = tgDataFilter(jqXHR.responseText);
        switch(data.State) {
            case 1: data.state = 401; break;
            case 0: data.state = 200; break;
            default: data.state = 500;
        }
        data.info = data.Msg;
        data.data = data.Data;
        return data;
    }
    function tgDataFilter(data){
        var err = 0;
        //如果没有data
        if (!data) {
            return {state: 204}
        }
        if (typeof data == 'string')
            try {
                data = $.parseJSON(data);
            } catch (e) {
                err = 1;
            }
        if (!err && typeof data == 'object' && ('state_code' in data || 'message' in data)) {
            data = {
                State: parseInt(data['state_code']),
                Data: data.data,
                Msg: data.message,
                HelpLink: data['help_link']
            }
        } else if (err || typeof data != 'object' || !('State' in data) && !('Data' in data)) {
            // 如果转换错误，则当作字符串类型
            if (err && data.charAt(1) == ':' || $.isArray(data) && typeof data[0] == 'number') {
                if ($.isString(data))
                    data = data.split(':');
                var s = data.shift();
                s = s == 1 ? 0 : s == 0 ? 999 : s;
                if (s != 0 && data[0].indexOf('登录') >= 0)
                    s = 1;
                if (s == 0) {
                    data = { Data: data, State: s}
                } else
                    data = { Msg: data[0], State: s}

            } else
                data = {
                    State: 0,
                    Data: data
                }
        }
        return data;
    }

    /**
     * 获取JSON器
     * @param {string|object} url 地址或者配置
     * @param {object} [options] 配置
     * @returns {JSONGetter}
     * @constructor
     */

    return $.EventEmitter.extend({
        _init: function (url, options) {
            this.options = $.extend({}, this.constructor.defaults, this.options, options)
            if (typeof url == 'object') {
                $.extend(this.options, url)
            } else
                this.options.url = url

            if (typeof options == 'boolean')
                options = { obstruction: options }

            $.extend(this.options, options)

            if (this.options.retune === true || typeof this.options.retune == 'number')
                this.options.retune = createDefaultRetune.call(this, this.options.retune)

            this._ajax = null
            this.url = this.options.url;
        },
        send: function (sendData) {
            if ($.isArrayLike(sendData)) sendData = $.serializeNodes(sendData, ',');
            var request = this, ajaxOptions;
            var dfd = $.Deferred();

            if (this.retry) {
                this._retry ++;
            }
            else {
                dfd.fail(this.options.error).done(this.options.success).always(this.options.complete);
                this._retry = 0;
            }

            if (this.retry || !this.options.obstruction || !this._ajax || this._ajax.state() != 'pending') {
                var d = {}
                if (this.options.beforeSend && (false === this.options.beforeSend(sendData, d))) {
                    $.extend(d, {state: -403, info:'由于需求请求被中断'});
                    request.branchAjaxResult(dfd, d);
                }  else {
                    ajaxOptions = {
                        url: request.options.url,
                        type: 'post',
                        dataType: 'text',
                        data: request._sendData = sendData,
                        contentType: "application/x-www-form-urlencoded;charset=utf-8",
                        error: function (jqXHR) {
                            request.branchAjaxResult(dfd, request.options.convert(jqXHR));
                        },
                        success: function (_, __, jqXHR) {
                            request.branchAjaxResult(dfd, $.extend(d, request.options.convert(jqXHR)));
                        },
                        timeout: this.options.timeout
                    }

                    if (this.constructor.debug && this.constructor.Spy.spies[request.url])
                        this._ajax = this.constructor.Spy.spies[request.url].ajax(ajaxOptions);
                    else
                        this._ajax = $.ajax(ajaxOptions);
                }
            } else request.branchAjaxResult(dfd, { state: -100 });

            return dfd.promise();
        },
        abort: function(){
            this._ajax && this._ajax.abort();
        },
        branchAjaxResult: function (dfd, originData) {
            var request = this;
            var state = originData.state;
            var dataArray = [this._originData = originData, this._data = originData.data, this._state = originData.state, this._info = originData.info, request._sendData];
            // 0 , undefined, null, ''都视为正确
            if (state >= 200 && state < 300 || state == 304 || state == -304 || state <= -200 && state > -300)
                dfd.resolveWith(this, dataArray);
            else if (state <= -100 && state > -200 || state >= 100 && state < 200)
                dfd.notifyWith(this, dataArray);
            else {
                //try {
                dataArray[3] = dataArray[3] || '系统错误';
                if (this.options.retune) {
                    dataArray[0].retry = true;
                    dfd.notifyWith(this, dataArray);
                    $.when(this.options.retune.apply(this, dataArray)).done(function(){
                        request.retry = true;
                        request.send(request._sendData).done(function(){
                            dfd.resolveWith(request, arguments);
                        }).fail(function(){
                            //alert(11);
                            dfd.rejectWith(request, arguments);
                        }).progress(function(){
                            dfd.notifyWith(request, arguments);
                        });
                    }).fail(function(){
                        request.retry = false;
                        dfd.rejectWith(this, dataArray);
                    });
                } else  dfd.rejectWith(this, dataArray);
            }
        },
        spy: function(dataFactory, delay){
            this.constructor.Spy(this.url, dataFactory, delay);
            return this;
        }
    }).mix({
        defaults: {
            obstruction: true,
            retune: false,
            success: $.noop,
            error: $.noop,
            complete: $.noop,
            convert: function (jqXHR) {
                var data;
                if (!jqXHR) throw new Error();
                try {
                    data = JSON.parse(jqXHR.responseText);
                    if (!data.code && !data.msg && !data.info) {
                        data = {
                            msg: data
                        }
                    }
                    data.state = data.code;
                    data.data = data.msg;
                } catch(e) {
                    if (/<doctype|<html/i.test(jqXHR.responseText)) {
                        //应该是传了一个html了吧
                        data = {
                            code: 500
                        }
                    } else
                        data = {
                            info: jqXHR.responseText
                        }

                }
                data.state = data.state || data.code || jqXHR.status;
                if (data.state >= 200 && data.state < 300 || data.state == 304) {
                    data.info = data.info || '请求成功'
                } else data.info = data.info || '未知错误';

                return data;
            }

        },
        getters: {},
        debug: true,
        config: function(options){
            $.extend(this.defaults, options);
        },
        send: function(url, data){
            this.getters[url] = this.getters[url] || this(url);
            return this.getters[url].send(data)
        },
        defaultErrHandler: function(D){
            var msg = D.info || '系统错误';
            if (D.state > 0 || D.state < -499) alert(msg);
            else alert('(错误码：'+ D.state + ")" + msg + '\n' + '请稍候重试或联系客服!');
        },
        /**
         * JSONGetter的监听器，用去调试
         * @param {string} url
         * @param {function|*} dataFactory
         * @param {number} [delay]
         * @returns {JSONGetter.Spy}
         * @constructor
         */
        Spy: $.EventEmitter.extend({
            _init: function(url, dataFactory, delay){
                if (typeof dataFactory == 'number') {
                    delay = dataFactory;
                    dataFactory = null;
                }
                var s, a;
                if ((a = dataFactory == null) || typeof dataFactory != 'function') {
                    s = dataFactory
                    dataFactory = function(){
                        var dfd = $.Deferred();
                        setTimeout(function(){
                            a ? dfd.reject(s) : dfd.resolve(s);
                        }, delay || this.constructor.defaults.delay)
                        return dfd;
                    }
                }
                this.dataFactory = dataFactory;
                this.constructor.spies[url] = this;
            },
            ajax: function(ajaxOptions){
                var data = ajaxOptions.data;
                if ($.isArrayLike(data)) data = $.serializeNodes(data, ',');
                var start = $.now();
                console.groupCollapsed('%c发送了一个JSONGetter.Spy请求至 %s', 'color:#00F', ajaxOptions.url)
                console.log('请求数据 %O', data);
                console.groupEnd();
                return $.when(this.dataFactory(data, ajaxOptions)).done(function(s){
                    console.groupCollapsed('%c返回了一个JSONGetter.Spy响应从 %s', 'color:#00F', ajaxOptions.url)
                    console.log('耗时约 %i ms', $.now() - start);
                    console.log('响应数据 %O', s);
                    console.groupEnd();
                }).fail(function(){
                    console.groupCollapsed('%c返回了一个JSONGetter.Spy响应从 %s', 'color:#F00', ajaxOptions.url)
                    console.log('耗时约 %i ms', $.now() - start);
                    console.groupEnd();
                }).done(ajaxOptions.success).fail(ajaxOptions.error).promise();
            },
            destroy: function(){
                delete this.constructor.spies[this.url]
            }
        }).mix({
            spies: {},
            defaults: {
                delay: 1000
            }
        })
    })
})();
