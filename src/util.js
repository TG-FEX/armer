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
                this.tickNum ++;
                if (now - item._lastTick >= item.interval || !item._lastTick) {
                    item.trigger(this.EVENT.TICK, [pass,  pass / item.timeout, this.tickNum]);
                    item._lastTick = now;
                }
                if (this.tickNum >= this.limit && pass >= item.timeout) {
                    item.trigger(this.EVENT.FINISH);
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
    $.Timer = function(timeout, interval, limit, callback){
        var callee = arguments.callee;
        if (!(this instanceof callee)) return new callee(timeout, interval, limit, callback);
        // 总需要的事件
        if ($.type(limit) != 'number') {
            callback = limit;
            limit = limit ? (limit < 1 ? 1 : limit) : Infinity;
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
        this.construtor = arguments.callee;
        if ($.type(callback) == 'function') {
            this.onstop = callback;
            this.start();
        }
    };
    $.Timer.interval = 13;
    $.Timer.prototype = $.EventEmitter({
        /**
         * 开始定时器
         * @method start
         */
        EVENT: {
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
        },
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
    })
})(armer);

