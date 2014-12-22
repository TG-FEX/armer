(function($){
    $.Utility = $.extend(function(){},{
        // 关闭窗口
        'closeWindow' : function(confirmStr){
            if (confirmStr && !confirm(confirmStr)) return;
            if (document.referrer == "") {
                if ($.browser.mozilla) return alert("该窗口需要关闭。但火狐浏览器不支持关闭单独窗口，请手动关闭。");
                window.opener = '';
                window.open('','_self');
            }
            window.close();
        },
        // 文本复制
        'copyText' : function(text, notdebug){
            var copy = true;
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", text);
            }else if (!notdebug) {
                prompt("非IE浏览器请用Ctrl+c手动复制链接", text);
                copy = false;
            }
            return copy;
        },
        // 添加收藏
        'addFavorite' : function(url,title){
            var url = url || top.location.href;
            var title = title || top.document.title;
            if (document.all) {
                window.external.addFavorite(url,title); }
            else if (window.sidebar)  {
                window.sidebar.addPanel(title, url, "");
            } else {
                alert("收藏失败！请使用Ctrl+D进行收藏");
            }
        }
    });


    var list = [], t;
    function start(){
        t = setInterval(function(){
            list.forEach(function(item){
                var now = $.now();
                var pass = getpass(item, now);
                item.tickNum ++;
                if (!item._lastTick) item._lastTick = now;
                if (now - item._lastTick >= item.interval) {
                    item.trigger($.Timer.event.TICK, [pass,  pass / item.timeout, item.tickNum]);
                    item._lastTick = now;
                }
                if (item.tickNum >= item.limit || pass >= item.timeout) {
                    item.trigger($.Timer.event.FINISH);
                }
            })
        }, $.Timer.interval);
    }
    function getpass(item, now) {
        var pass = now - item._startTime + item._pass;
        pass = pass > item.timeout ? item.timeout : pass;
        return pass;
    }

    /**
     * 定时器
     * @param timeout {boolean|number} 超时时间，定时器开始后，会在该时间后停止
     * @param [interval=200] 通知时隔，定时器开始后，每隔一段时间会进行进度通知
     * @param [limit=Infinity] 进度生成次数限制，超过这个次数，定时器将会停止
     * @class armer.Timer
     * @constructor
     * @extends armer.EventEmitter
     */
    $.Timer = $.EventEmitter.extend({
        _init: function(timeout, interval, limit, callback){
            // 总需要的事件
            if ($.type(limit) != 'number' && limit < 1) {
                callback = limit;
                limit = Infinity;
            }
            if ($.type(interval) != 'number') {
                callback = interval;
                interval = null;
            }
            if ($.type(timeout) != 'number') {
                timeout = Infinity;
            }

            this._pass = 0;

            /**
             * 最大超时时间
             * @property timeout
             * @type {number}
             */
            this.timeout = this._total = timeout;
            /**
             * 当前通知数
             * @property tickNum
             * @type {number}
             */
            this.tickNum = 0;
            /**
             * 最大的通知数
             * @property limit
             * @type {number}
             */
            this.limit = limit;
            /**
             * 通知的间隔时间
             * @property interval
             * @type {number}
             */
            this.interval = interval || 200;
            if ($.type(callback) == 'function') {
                this.onfinish = callback;
                this.start();
            }
        },
        /**
         * 开始定时器
         * @method start
         */
        start: function(){
            if (list.length == 0) start();
            $.Array.ensure(list, this);
            this._startTime = $.now();
        },
        finish: function(){
            this.reset();
        },
        /**
         * 停止定时器
         * @method stop
         */
        stop: function(){
            $.Array.remove(list, this);
            if (list.length == 0) clearInterval(t);
        },
        /**
         * 停止并重设定时器
         * @method reset
         */
        reset: function(){
            this.stop();
            this._pass = 0;
            this._total = $.now();
        },
        /**
         * 暂停定时器
         * @method pause
         */
        pause: function(){
            this.stop();
            var now = $.now();
            this._pass = getpass(this, now);
            this._total = now;
        }
    });
    $.Timer.interval = 13;
    $.Timer.event = {
        /**
         * 启动事件
         * @event start
         */
        START: 'start',
        /**
         * 完成事件
         * @event finish
         */
            FINISH: 'finish',
        /**
         * 停止事件
         * @event stop
         */
            STOP: 'stop',
        /**
         * 通知事件
         * @event tick
         */
            TICK: 'tick'
    }

    $.Store = (function(){
        function serialize(value){
            return JSON.stringify(value)
        }
        function deserialize(value){
            var result;
            if (typeof value != 'string') result = value;
            try {
                result = JSON.parse(value)
            } catch(e) {}
            // 不是对象的时候，将其值为空对象
            if (!$.isPlainObject(result)) result = {}
            return result
        }
        return $.EventEmitter.extend({
            _init: function(_key, triggerItself){
                this._key = _key;
                this._triggerItself = !!triggerItself;
                this._list = deserialize(localStorage.getItem(this._key));
                this.init();
            },
            get: function(key){
                if (key)
                    return $.cloneOf(this._list[key]);
                // 先备份一下，以免被误改
                else return $.cloneOf(this._list);
            },
            init: function(){
                //Chrome下(14.0.794.0)重写了document.domain之后会导致onstorage不触发
                //支持localStorage的情况
                var callback = this._callback.bind(this);
                if ('onstorage' in document) {
                    // IE绑到document;
                    document.attachEvent("onstorage", callback)
                } else if ($.support.localStorage) {
                    // 标准浏览器绑到window;
                    window.addEventListener("storage", callback)
                } else if (this.userTicker) {
                    // 先刨个坑
                } else {
                    // IE678
                    window.attachEvent('onfocus', callback)
                }
            },
            _callback: function(e){
                var that = this;
                //IE下不使用setTimeout竟然获取不到改变后的值?!
                $.nextTick(function(){
                    e = e || window.storageEvent
                    //若变化的key不是绑定的key，则过滤掉
                    //IE下不支持key属性,因此需要根据storage中的数据判断key中的数据是否变化
                    if (e.key && that._key != e.key) return
                    //获取新的值
                    var result = that._testAndSet(deserialize(e.newValue || localStorage.getItem(that._key)));
                    if (that._isChange(result)) {
                        that.trigger('change', result)
                    }
                });
            },
            set: function(hash, triggerItself){
                var key, isNew = true, value;
                var that = this;
                if ($.type(hash) == 'string') {
                    key = hash;
                    value = triggerItself;
                    triggerItself = arguments[2];
                    hash = {}
                    hash[key] = value
                    isNew = false
                    // 如果不是这个hash传递的话，只修改某个字段
                }
                triggerItself = triggerItself == null ? this._triggerItself : triggerItself;
                var result = this._testAndSet(hash, isNew);
                if (this._isChange(result)) {
                    triggerItself && this.trigger('change', result);
                    // 延迟渲染，以免阻塞
                    $.nextTick(function () {
                        localStorage.setItem(that._key, serialize(result[2]))
                    })
                }
            },
            _isChange: function(result){
                return !$.isEmptyObject(result[0]) || !$.isEmptyObject(result[1])
            },
            // 比较新旧数据的差异
            _testAndSet: function(valueHash, isNew){
                var i, newValue = {}, oldValue = {}, mix
                if (isNew) mix = $.mix({}, valueHash, this._list)
                else mix = valueHash
                for (i in mix) {
                    if (mix.hasOwnProperty(i) && !$.isEqual(this._list[i], valueHash[i])) {
                        // 如果不相等则赋值
                        oldValue[i] = this._list[i];
                        if (valueHash.hasOwnProperty(i)) this._list[i] = newValue[i] = $.cloneOf(valueHash[i]);
                        else delete this._list[i]
                    }
                }
                return [newValue, oldValue, this._list]
            }
        })
    })();
    $.store = new $.Store('default-store');


})(armer);

