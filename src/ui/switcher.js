var max = 4;
var min = 0;
function next0(step){
    return function(i){
        var s = i + step;
        if (s < min)
            return min;
        else if (s > max)
            return max;
        else return s;
    }
}
function next1(step) {
    return function(i){
        var s = i +  step % (max - min);
        s = s % max;
        if (s < min) {
            return max;
        } else if (s > max) {
            return min
        } else return s
    }
}
function next2(step) {
    return function(i){
        var s = i +  step % (max - min);
        s = s % max;
        if (s < min) {
            step = -step;
            return 2 * min - s;
        } else if (s > max) {
            step = -step;
            return 2 * max - s;
        } else return s
    }
}
function next3(step) {
    return function(i){
        var s = i +  step % (max - min);
        s = s % max;
        if (s < min) {
            return max- min + s ;
        } else if (s > max) {
            return min - max + s
        } else return s
    }
}


var Switcher = $.EventEmitter.extend({
    _init: function(delay, index){
        this._index = index;
        this.expr = {
            next: next0(1),
            prev: next0(-1)
        }
        if (delay) this.auto(delay);
    },
    options: {
        index: 0,
        formula: {
            next: next0(true),
            prev: next0()
        }
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
        this.trigger('switch', this.expr.next(this._index));
    },
    prev: function(){
        this.trigger('switch', this.expr.prev(this._index));
    }
})