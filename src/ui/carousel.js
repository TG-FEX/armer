(function(){
    function Carousel($c, delay, isAuto) {
        var $tabs = $('ul', $c), $li;
        var t, i = 0, d = false, step = 1, length, size, liWidth;

        function start() {
            t = setInterval(function () {
                next(d)
            }, delay);
        }

        function stop() {
            clearInterval(t);
        }

        function resume() {
            $tabs.css('margin-left', (i + length) * -liWidth);
        }

        function next(d) {
            var move = (!d ? step : -step) + i;
            if (size < length) scroll(move, 500)
            i = move >= length ? move - length : move < 0 ? move + length : move;
            $c.trigger('carouselswitch', [i, $li.eq(i)]);
        }
        $c.on('carouselswitch', function(e, index){
            i = index;
        })

        function scroll(move, duration) {
            $tabs.finish().animate({
                'margin-left': (move + length) * -liWidth
            }, duration, function(){
                resume()
            });
        }
        function init() {
            if (size < length) {
                $li.clone(true).appendTo($tabs).clone(true).prependTo($tabs);
                resume()
            }
            if (isAuto) start()
        }
        $li = $('li', $c);
        liWidth = $li.outerWidth(true);
        this.length = length = $li.length;
        size = Math.ceil($c.width() / liWidth);
        init()


        this.index = function(){
            return i;
        }
        this.size = function(){
            return length;
        }
        this.viewSize = function(){
            return size;
        }
        this.scroll = function(index){
            if (size < length)
                this.scroll(index < i ? index + length : index, 500)
            else
                $c.trigger('carouselswitch', [index, $li.eq(index)]);
        };
        this.auto = function(isAuto){
            if (isAuto && !t) start();
            else if (!isAuto) stop();
        }
        this.next = function(){
            next(d = false);
        }
        this.prev = function(){
            next(d = true);
        }

    }

    $.UI.Carousel = Carousel;
})()
