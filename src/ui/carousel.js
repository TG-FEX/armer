(function(){
    var d = 1;
    var EXPR = {
        0 : function(i, step, max, min){
            var s = i + step;
            if (s < min)
                return min;
            else if (s > max)
                return max;
            else return s;
        },
        1:  function(i, step, max, min){
            var diff = max - min;
            var s = i +  ((step / diff > 0 && step % diff == 0) ? diff : (step % diff));
            if (s < min) {
                return max;
            } else if (s > max) {
                return min
            } else return s
        },
        2: function(i, step, max, min){
            var diff = max - min;
            var s = i +  ((step / diff > 0 && step % diff == 0) ? diff : (step % diff));
            if (s < min) {
                d = -d;
                return 2 * min - s;
            } else if (s > max) {
                d = -d;
                return 2 * max - s;
            } else return s
        },
        3: function(i, step, max, min){
            var diff = max - min;
            var s = i +  ((step / diff > 0 && step % diff == 0) ? diff : (step % diff));
                if (s < min) {
                    return max- min + s ;
                } else if (s > max) {
                    return min - max + s
                } else return s
            }
    };

    var Switcher = $.EventEmitter.extend({
        _init: function(options){
            this.options = $.mixOptions({}, this.constructor.defaults, this.options, options);
            this._index = this.options.start;

            if (typeof this.options.formula == 'number') {
                this.options.formula = {
                    next: EXPR[this.options.formula],
                    prev: EXPR[this.options.formula]
                }
            }

            if (this.options.delay) this.auto(this.options.delay);
        },
        options: {
            delay: false,
            max: 5,
            min: 0,
            start: 0,
            step: 1,
            formula: 1
        },
        _switch: function(i){
            this._index = i;
        },
        index: function(){
            return this._index;
        },
        auto: function(delay){
            var that = this;
            that.off('next');
            if (this.timer) this.timer.stop();
            if (delay) {
                this.timer = $.Timer(true, delay);
                this.timer.on('tick', function(){
                    that.trigger('next')
                }).start();
            }
        },
        next: function(){
            this.trigger('switch', this.options.formula.next(this._index, this.options.step, this.options.max, this.options.min));
        },
        prev: function(){
            this.trigger('switch', this.options.formula.prev(this._index, this.options.step * -1, this.options.max, this.options.min));
        }
    });
    $.UI.Switcher = Switcher;
})();

(function(){
    define($.UI.extend('carousel', $.UI.Switcher, {
        _init: function(element, options){
            var that = this;
            this.element = $(element);
            that.options = $.mixOptions({}, this.constructor.defaults, this.options, this.element.data(), options);

            this._inner = $(that.options.inner, this.element);
            this._item = $(that.options.item, this.element);


            this.viewSize = this.element.innerWidth();
            this.length = this._item.length;

            this._allViewSize = this._item.toArray().reduce(function(memo, item){
                return memo + $(item).outerWidth(true);
            }, 0);

            this._super({max: this.length - 1});
            if (this._allViewSize > this.viewSize) {
                this._haha();
            }
        },
        options: {
            start: 0, // 滚动当前元素下标的初始值
            step: 1, // 滚动正方向的步长
            min: 0, // 滚动当前元素下标的最小值
            item: 'li',
            inner: 'ul', // 这两个是选择器
            formula: 2, // 滚动循环方程
            align: 0, // 滚动的对齐方式 0. 滚动的当前元素对齐容器左或上边界，
                        // 1. 滚动的当前元素对齐容器中间
                        // 2. 滚动的当前元素对齐右或下边界
            duration: 500, // 滚动的动画速度
            vertical: false // 垂直
        },
        _haha: function(){
            this._item.clone(true).appendTo(this._inner).clone(true).prependTo(this._inner);

            this._resume(this._getOffset(this._index));
        },
        _resume: function(offset){
            offset = offset || 0;
            this._inner.css('margin-left',  - this._allViewSize - this._getSize(0, this._index) + offset);
        },
        _getOffset: function(i){
            var offset = 0;
            if (this.options.align == 2) {
                offset = this.viewSize - this._item.eq(i).outerWidth(true);
            }
            if (this.options.align == 1) {
                offset = (this.viewSize - this._item.eq(i).outerWidth(true)) / 2;
            }
            return offset;
        },
        _getSize: function(form, step){
            var end = this.options.formula.next(form, step, this.options.max, this.options.min);
            var max = Math.max(form, end);
            var array = this._item.slice(Math.min(form, end), max).toArray();
            return array.reduce(function(memo, item){
                return memo + $(item).outerWidth(true) * (form == max ? -1 : 1);
            }, 0);
        },
        _switch: function(i){
            console.log(i);
            var that = this;
            // 判断一下滚动的尺寸是否超出能滚动的区域
            //FIXME: 单纯判断是否滚动一个

            var offset = that._getOffset(i);

            var s;
            if (this._index == this.options.min && i == this.options.max)
                s = - this._allViewSize + this._item.eq(i).outerWidth(true) + offset;
            else if (this._index == this.options.max && i == this.options.min)
                s = - 2 * this._allViewSize + offset;
            else {
                s = - this._allViewSize - this._getSize(0, i) + offset;
            }

            this._inner.finish().animate({
                'margin-left': s
            }, that.options.duration, function(){
                that._resume(offset)
            });
            this.trigger('scroll');
            this._super(i);
        }
    }))

})()
