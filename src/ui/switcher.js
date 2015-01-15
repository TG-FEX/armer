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