;(function () {
    $.EventEmitter = function(obj){
        if (typeof obj == 'function' || typeof obj == 'object') return $.mix(obj, mul);
        if(!(this instanceof $.EventEmitter)) return new $.EventEmitter();
    }

    var mul = {
        on: function(types, fn){
            $.event.add(this, types, fn);
        },
        off: function(types){
            $.event.remove(this, types);
        },
        emit: function(types, data){
            $.event.trigger(new $.Event(types), data, this);
        }
    };
    $.mix(mul, {
        trigger: mul.emit
    });
    $.EventEmitter.prototype = $.EventEmitter.fn = mul;
})();

// valuechange�¼����������Լ����ô򣬸��������������¼����������뵼�µı�ֵ�仯
/*
 $('input').valuechange(function(e){
 e.newValue; // �µ�ֵ
 e.oldValue; // �ɵ�ֵ
 e.realEvent; // �����仯����ʵ�¼�
 })
 */
(function(){
    var DATA = "valuechangeData";
    //���ֵǰ�����ı�,�����󶨻ص�
    function testChange(elem, realEvent) {
        var old = $.data(elem, DATA);
        var neo = elem.value;
        if(old !== neo){
            $.data(elem, DATA, neo);
            var event = new $.Event("valuechange");
            event.realEvent = realEvent;
            event.oldValue = old;
            event.newValue = neo;
            $.event.trigger(event, [neo, old], elem);

        }
    }
    function unTestChange(elem){
        $.removeData(elem, DATA);
    }
    function startTest(event) {
        var elem = event.target;
        if (event.type == 'focus' || event.type == 'mousedown' || event.type == 'paste') {
            $.data(elem, DATA , elem.value);
            event.type == 'paste' && $.nextTick(function(){
                testChange(elem, event);
            })
        }
        else testChange(elem, event);
    }
    function stopTest(event){
        unTestChange(event.target);
    }
    function listen(elem) {
        unlisten(elem);
        "keydown paste keyup mousedown focus".replace($.rword, function(name){
            $(elem).on(name+"._valuechange", startTest)
        });
        $(elem).on('blur._valuechange', stopTest);
        $(elem).on('webkitspeechchange._valuechange', function(e){
            testChange(e.target,e);
        });
    }
    function unlisten(elem){
        unTestChange(elem);
        $(elem).off("._valuechange")
    }
    $.fn.valuechange = function(callback){
        var $this = $(this), event, neo, old;
        if (typeof callback == 'function')
            $this.on( "valuechange", callback );
        else {
            event = new $.Event('valuechange');
            old = event.oldValue = $this.val();
            $.data(this, DATA, old);
            $this.val(callback);
            neo = event.newValue = $this.val();
            $.event.trigger(event, [neo, old], this);
        }
        return $this;
    };
    $.event.special.valuechange = {
        setup: function(){
            var elem = this, nodeName = elem.tagName;
            if (nodeName == 'INPUT' || nodeName == 'TEXTAREA') {
                listen(elem);
                return false;
            }
        },
        teardown: function () {
            var elem = this, nodeName = elem.tagName;
            if (nodeName == 'INPUT' || nodeName == 'TEXTAREA') {
                unlisten(this);
                return false;
            }
        }
    }
})();


// ���enter,ctrlEnter,backspace�¼�
(function(){
    var keypressEvents = "keydown";
    $.each(["enter", "ctrlenter", "backspace"], function( i, name){
        var key = name;
        $.fn[key] = function( fn ){
            return !fn || $.isFunction( fn ) ?
                this[fn ? "bind" : "trigger"]( key, fn ) :
                this["bind"]( key, function(){ $( fn ).trigger("click"); }); //������ǰ��enter����
        };
        $.event.special[key] = {
            setup: function(){
                $.event.add( this, keypressEvents + '.' + key, enterHandler, {type: key} );
            },
            teardown: function(){
                $.event.remove( this, keypressEvents + '.' + key, enterHandler );
            }
        };
    });

    function enterHandler( e ){
        var pass = true;
        switch(parseInt(e.which)){
            case 13:
                if( (e.data.type != "ctrlEnter" && e.data.type != "enter") ||
                    (e.data.type == "ctrlEnter" && !e.metaKey && !e.ctrlKey) ||
                    (e.data.type == "enter" && e.metaKey) )
                    pass = false;
                break;
            case 8:
                if(e.data.type != "backspace")
                    pass = false;
                break;
            default:
                pass = false;
        }
        if (pass) {
            e.type = e.data.type;
            $.event.trigger(new $.Event(e.type), [], this);
        }
    }
})();

(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ($.event.fixHooks) {
        for ( var i=toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i=toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i=toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.on("mousewheel", fn) : this.trigger("mousewheel");
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0, fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta;  }
        if ( orgEvent.detail     ) { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max( Math.abs(deltaY), Math.abs(deltaX) );
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta/lowestDelta);
        deltaX = Math[fn](deltaX/lowestDeltaXY);
        deltaY = Math[fn](deltaY/lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    $.fn.onExcept = function(selector, eventTypes, fn){
        selector = $(selector);
        return this.on(eventTypes, function(e){
            var trigger = true;
            selector.each(function(){
                /*
                 $.log(
                 'this�ǣ�' + this,
                 'target�ǣ�' + e.target,
                 'this�Ƿ����target:' + $.contains(this, e.target),
                 'this�Ƿ�target:' +  this == e.target
                 );
                 */
                if ($.contains(this, e.target) || $(this)[0] == e.target) {
                    return trigger &= false;
                }
            });
            if (trigger) fn.call(this, e);
        });
    };

})(jQuery);

