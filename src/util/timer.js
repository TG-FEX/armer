;(function($){
    var list = [], t;
    function start(){
        t = setInterval(function(){
            list.forEach(function(item){
                var now = $.now();
                var pass = getpass(item, now);
                item.tickNum ++;
                if (now - item._lastTick >= item.interval || !item._lastTick) {
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
     * @param [interval=200] {number} 通知时隔，定时器开始后，每隔一段时间会进行进度通知
     * @param [limit=Infinity] {number} 进度生成次数限制，超过这个次数，定时器将会停止
     * @param [callback] {function} 成功后绑定的成功时间
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

    $.setTimeout = function(callback, timeout){
        return $.Timer(timeout, $.type(callback) == string ? function(){eval(callback)} : callbcak);
    }
    $.clearTimeout = function(timer) {
        timer.stop();
    }
    $.setInterval = function(callback, interval){
        var timer = $.Timer(false, interval);
        timer.on($.Timer.event.TICK, callback);
        return timer;
    }
    $.clearInterval = function(timer){
        timer.stop();
    }

})(armer);