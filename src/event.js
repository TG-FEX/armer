;(function () {
    var fn;
    /**
     * 事件发射器，让一个对象拥有订阅事件的能力
     * @param [obj] {object} 需要扩展的对象
     * @constructor
     * @class armer.EventEmitter
     */
     function Emitter(obj) {
        var callee = arguments.callee;
        if ($.isObjectLike(obj) && obj.emit != fn.emit) return $.mix(obj, fn);
        if (!(this instanceof $.EventEmitter)) return new callee();
    };
    Emitter.fn = Emitter.prototype = fn = $.Object({
        /**
         * 绑定一个事件处理器
         * @param types {string} 绑定事件的类型
         * @param handler {function} 绑定的处理器
         * @method on
         */
        on: function () {
            [].unshift.call(arguments, this);
            $.event.add.apply($.event, arguments);
            return this
        },
        /**
         * 解绑一个或多个事件处理器
         * @param types {string} 解绑事件的类型
         * @param [handler] {function} 解绑事件的处理器
         * @async
         * @method off
         */
        off: function () {
            [].unshift.call(arguments, this);
            $.event.remove.apply($.event, arguments);
            return this
        },
        /**
         * 触发一个或多个事件
         * @param event {$.Event|string} 解绑事件或者事件类型
         * @param [data] {*} 触发事件传递的数据
         * @param [onlyHandlers] {boolean} 是否不触发默认事件
         * @method emit
         */
        emit: function (event, data, onlyHandlers) {
            var handle, ontype, tmp, orignData,
                eventPath = [ this || document ],
                type = $.hasOwn(event, "type") ? event.type : event,
                namespaces = $.hasOwn(event, "namespace") ? event.namespace.split(".") : [];

            tmp = this;
            if (type.indexOf(".") >= 0) {
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;

            event = event[ $.expando ] ?
                event :
                new $.Event(type, typeof event === "object" && event);

            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ?
                new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                null;

            event.result = undefined;
            if (!event.target) {
                event.target = this;
            }
            orignData = data = $.type(data, 'array') ? data : [data];
            data = $.makeArray(orignData, [ event ]);
            handle = ( $._data(this, "events") || {} )[ event.type ] && $._data(this, "handle");
            if (handle) {
                handle.apply(this, data);
            }
            handle = ontype && this[ ontype ];
            if (handle && handle.apply && $.acceptData(this)) {
                event.result = handle.apply(this, data);
                if (event.result === false) {
                    event.preventDefault();
                }
            }
            event.type = type;

            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if (ontype && this[ type ] && !$.isWindow(this)) {
                    tmp = this[ ontype ];

                    if (tmp) {
                        this[ ontype ] = null;
                    }
                    $.event.triggered = type;
                    event.actionReturns = this[ type ].apply(this, orignData);
                    $.event.triggered = undefined;

                    if (tmp) {
                        this[ ontype ] = tmp;
                    }
                }
            }
            return event.result;
        }
    });
    $.mix(fn, {
        constructor: Emitter,
        /**
         * 触发一个事件
         * @method trigger
         */
        trigger: fn.emit
    });
    $.EventEmitter = Emitter;
    Emitter.mix = $.mix;
    Emitter.extend = $.factory;
})();

// valuechange事件，监听来自键盘敲打，复制咱贴，触屏事件，语音输入导致的表单值变化
/*
 $('input').valuechange(function(e){
 e.newValue; // 新的值
 e.oldValue; // 旧的值
 e.realEvent; // 触发变化的真实事件
 })
 */
(function () {
    var DATA = "valuechangeData";
    //如果值前后发生改变,触发绑定回调
    function testChange(elem, realEvent) {
        var old = $.data(elem, DATA);
        var neo = elem.value;
        if (old !== neo) {
            $.data(elem, DATA, neo);
            var event = new $.Event("valuechange");
            event.realEvent = realEvent;
            event.oldValue = old;
            event.newValue = neo;
            $.event.trigger(event, [neo, old], elem);

        }
    }

    function unTestChange(elem) {
        $.removeData(elem, DATA);
    }

    function startTest(event) {
        var elem = event.target;
        if (event.type == 'focus' || event.type == 'mousedown' || event.type == 'paste') {
            $.data(elem, DATA, elem.value);
            event.type == 'paste' && $.nextTick(function () {
                testChange(elem, event);
            })
        }
        else testChange(elem, event);
    }

    function stopTest(event) {
        unTestChange(event.target);
    }

    function listen(elem) {
        unlisten(elem);
        "keydown paste keyup mousedown focus".replace($.rword, function (name) {
            $(elem).on(name + "._valuechange", startTest)
        });
        $(elem).on('blur._valuechange', stopTest);
        $(elem).on('webkitspeechchange._valuechange', function (e) {
            testChange(e.target, e);
        });
    }

    function unlisten(elem) {
        unTestChange(elem);
        $(elem).off("._valuechange")
    }

    $.fn.valuechange = function (callback) {
        var $this = $(this), event, neo, old;
        if (typeof callback == 'function')
            $this.on("valuechange", callback);
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
        setup: function () {
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


// 添加enter,ctrlEnter,backspace事件
(function () {
    var keypressEvents = "keydown";
    $.each(["enter", "ctrlenter", "backspace"], function (i, name) {
        var key = name;
        $.fn[key] = function (fn) {
            return !fn || $.isFunction(fn) ?
                this[fn ? "bind" : "trigger"](key, fn) :
                this["bind"](key, function () {
                    $(fn).trigger("click");
                }); //兼容以前的enter代码
        };
        $.event.special[key] = {
            setup: function () {
                $.event.add(this, keypressEvents + '.' + key, enterHandler, {type: key});
            },
            teardown: function () {
                $.event.remove(this, keypressEvents + '.' + key, enterHandler);
            }
        };
    });

    function enterHandler(e) {
        var pass = true;
        switch (parseInt(e.which)) {
            case 13:
                if ((e.data.type != "ctrlEnter" && e.data.type != "enter") ||
                    (e.data.type == "ctrlEnter" && !e.metaKey && !e.ctrlKey) ||
                    (e.data.type == "enter" && e.metaKey))
                    pass = false;
                break;
            case 8:
                if (e.data.type != "backspace")
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
        for (var i = toFix.length; i;) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.on("mousewheel", fn) : this.trigger("mousewheel");
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0, absDelta = 0, absDeltaXY = 0, fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if (orgEvent.wheelDelta) {
            delta = orgEvent.wheelDelta;
        }
        if (orgEvent.detail) {
            delta = orgEvent.detail * -1;
        }

        // New school wheel delta (wheel event)
        if (orgEvent.deltaY) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if (orgEvent.deltaX) {
            deltaX = orgEvent.deltaX;
            delta = deltaX * -1;
        }

        // Webkit
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
            lowestDeltaXY = absDeltaXY;
        }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    $.fn.onExcept = function (selector, eventTypes, fn) {
        selector = $(selector);
        return this.on(eventTypes, function (e) {
            var trigger = true;
            selector.each(function () {
                /*
                 $.log(
                 'this是：' + this,
                 'target是：' + e.target,
                 'this是否包含target:' + $.contains(this, e.target),
                 'this是否target:' +  this == e.target
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

