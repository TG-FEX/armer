// ��չ�ڽ�jQuery css easing
;(function () {
    // ����Robert Penner�Ļ�����ʽ (http://www.robertpenner.com/easing)
    var baseEasings = {};
    $.each(['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'], function (i, name) {
        baseEasings[ name ] = function (p) {
            return Math.pow(p, i + 2);
        };
    });
    $.extend(baseEasings, {
        Sine: function (p) {
            return 1 - Math.cos(p * Math.PI / 2);
        },
        Circ: function (p) {
            return 1 - Math.sqrt(1 - p * p);
        },
        Elastic: function (p) {
            return p === 0 || p === 1 ? p :
                -Math.pow(2, 8 * (p - 1)) * Math.sin(( (p - 1) * 80 - 7.5 ) * Math.PI / 15);
        },
        Back: function (p) {
            return p * p * ( 3 * p - 2 );
        },
        Bounce: function (p) {
            var pow2,
                bounce = 4;
            while (p < ( ( pow2 = Math.pow(2, --bounce) ) - 1 ) / 11) {
            }
            return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - p, 2);
        }
    });
    $.each(baseEasings, function (name, easeIn) {
        $.easing['easeIn' + name ] = easeIn;
        $.easing['easeOut' + name ] = function (p) {
            return 1 - easeIn(1 - p);
        };
        $.easing['easeInOut' + name ] = function (p) {
            return p < 0.5 ?
                easeIn(p * 2) / 2 :
                1 - easeIn(p * -2 + 2) / 2;
        };
    });

    // ��չһЩCSStransition-timing-function��js����
    $.cssEasing = {
        linear: 'linear',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        swing: 'cubic-bezier(.02,.01,.47,1)',
        snap: 'cubic-bezier(0,1,.5,1)',
        easeOutCubic: 'cubic-bezier(.215,.61,.355,1)',
        easeInOutCubic: 'cubic-bezier(.645,.045,.355,1)',
        easeInCirc: 'cubic-bezier(.6,.04,.98,.335)',
        easeOutCirc: 'cubic-bezier(.075,.82,.165,1)',
        easeInOutCirc: 'cubic-bezier(.785,.135,.15,.86)',
        easeInExpo: 'cubic-bezier(.95,.05,.795,.035)',
        easeOutExpo: 'cubic-bezier(.19,1,.22,1)',
        easeInOutExpo: 'cubic-bezier(1,0,0,1)',
        easeInQuad: 'cubic-bezier(.55,.085,.68,.53)',
        easeOutQuad: 'cubic-bezier(.25,.46,.45,.94)',
        easeInOutQuad: 'cubic-bezier(.455,.03,.515,.955)',
        easeInQuart: 'cubic-bezier(.895,.03,.685,.22)',
        easeOutQuart: 'cubic-bezier(.165,.84,.44,1)',
        easeInOutQuart: 'cubic-bezier(.77,0,.175,1)',
        easeInQuint: 'cubic-bezier(.755,.05,.855,.06)',
        easeOutQuint: 'cubic-bezier(.23,1,.32,1)',
        easeInOutQuint: 'cubic-bezier(.86,0,.07,1)',
        easeInSine: 'cubic-bezier(.47,0,.745,.715)',
        easeOutSine: 'cubic-bezier(.39,.575,.565,1)',
        easeInOutSine: 'cubic-bezier(.445,.05,.55,.95)',
        easeInBack: 'cubic-bezier(.6,-.28,.735,.045)',
        easeOutBack: 'cubic-bezier(.175, .885,.32,1.275)',
        easeInOutBack: 'cubic-bezier(.68,-.55,.265,1.55)'
    };
    $.cssEasing._default = 'cubic-bezier(.02,.01,.47,1)';

    var support = $.support;
    // �����Ҫ��transitionend
    var eventNames = {
        'transition':       'transitionend',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition':     'MSTransitionEnd'
    };
    // ����support���ò�ͬ���¼�
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // ����transitionEnd�ı��ֲ�һ�£����Բ���������Ϊ�ж϶�����ɵ�ʱ��
    //$.Transition.useTransitionEnd = true;
    Transition = function(elem, properties, options){
        var transition,
            oldTransitions,
            $elem = $(elem),
            bound = false,
            deferred = $.Deferred().always(function(){
                bound && elem.removeEventListener(transitionEnd, handler);
                elem.style[support.transition] = oldTransitions;
            }),
            handler = function(){
                deferred.resolveWith(elem, [transition]);
            };
        // Ĭ�϶���Ϊswing
        options.easing = options.easing || 'swing';
        oldTransitions = elem.style[support.transition];
        if ($.Transition.useTransitionEnd) {
            bound = true;
            elem.addEventListener(transitionEnd, handler);
        } else window.setTimeout(handler, options.duration);
        // webkit�����ǿ���ػ���ܴ���
        var s = elem.offsetWidth;

        elem.style[support.transition] = getTransition(properties, options.duration, options.easing, options.delay);
        $elem.css(properties);
        transition = deferred.promise({
            elem: elem,
            props: $.extend({}, properties),
            opts: $.extend(true, {}, options),
            originalProperties: properties,
            originalOptions: options,
            duration: options.duration,
            stop: function(gotoEnd){
                var currentStyle = {};
                if (gotoEnd) {
                    deferred.resolveWith(elem, [transition, gotoEnd]);
                } else {
                    $.each(properties, function(i){
                        currentStyle[i] = $(elem).css(i);
                    });
                    elem.css(currentStyle);
                    deferred.rejectWith(elem, [transition, gotoEnd]);
                }
                elem.style[support.transition] = null;
                return this;
            }
        });
        return transition.done( transition.opts.done, transition.opts.complete )
            .fail( transition.opts.fail )
            .always( transition.opts.always );
    };
    $.Transition = $.extend(Transition, {
        // ��ʱ�ر�transitionЧ��
        enabled: true,
        // �����Ƿ�ͨ��transitionEnd������������callback
        useTransitionEnd: false
    });
    $.fn.transit = function(prop, speed, easing, callback){
        var empty = $.isEmptyObject(prop),
            optall = $.speed(speed, easing, callback);
            var doTransition = function(){
                var transit = Transition(this, $.extend({}, prop), optall);
                if (empty || $._data(this, 'finish'))
                    transit.stop(true);
            };
            doTransition.finish = doTransition;
        return empty || optall.queue == false ?
            this.each(doTransition) : this.queue(optall.queue, doTransition);
    };

    /**
     * ����CSS���Ի�ȡTransition����
     * @param props CSS����
     * @returns {Array} ����һ������transition-property����������
     */
    function getProperties(props) {
        var re = [];

        $.each(props, function(key) {
            key = $.camelCase(key); // Convert "text-align" => "textAlign"
            key = $.transitionPropertyMap[key] || $.cssProps[key] || key;
            key = $.hyphen(key); // Convert back to dasherized

            if ($.inArray(key, re) === -1) { re.push(key); }
        });

        return re;
    }

    /**
     * �������л���transition
     * @param properties ����
     * @param duration ����ʱ��
     * @param easing ��������
     * @param delay ��ʱ
     * @returns {string}
     * @exaple
     * getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');  => 'opacity 500ms ease, -webkit-transform 500ms ease'
     */
    function getTransition(properties, duration, easing, delay) {
        // ��ȡ��Ҫ��Transition����
        var props = getProperties(properties);

        // ͨ����ƻ�ȡ�����timming-function
        if ($.cssEasing[easing]) { easing = $.cssEasing[easing]; }

        // ����duration/easing/delay����
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

        // ��ϲ�ͬ��CSS����
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        $.each(props, function(i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }
    /**
     * ���ٶ�ת��Ϊ����
     * @param duration
     * @returns {*}
     * @example
     * toMS('fast')   //=> '400ms'
     * toMS(10)       //=> '10ms'
     */
    function toMS(duration) {
        var i = duration;
        // ת������ 'fast' ���ַ���.
        if ($.fx.speeds[i]) { i = $.fx.speeds[i]; }
        return $.unit(i, 'ms');
    }

    // ��¶һ�������õķ���
    $.Transition.getTransitionValue = getTransition;

    if (!$.support.transition)
        $.fn.transit = $.fn.transition = $.fn.animate;


    // TODO: classAnimation ��JS����transition����js��������ģ��tansitionCSS����

    // ת��Ϊms�����磺��'2000ms'��'2s' ת��Ϊ 2000;
    function toMS(duration) {
        if (typeof duration == 'number') return duration;
        if (duration.indexOf('ms') > -1) return parseInt(duration);
        if (duration.indexOf('s') > -1) return parseInt(duration) * 1000;
        return parseInt(duration);
    }
    var classAnimationActions = [ "add", "remove", "toggle" ];
    var rC = /\s*,\s*/;
    var rS = /\s/;
    var cssEasing2Easing = {
        'ease': 'swing'
    };
    var firstVal = function(obj){
        var i;
        if ($.isArray(obj)) {
            return obj[0]
        } else if (typeof obj == 'object') {
            for (i in obj) {
                return obj[i];
            }
        }
    };
    // ���ˣ����߹��˲�����
    var getStyles = function(elem, filter, diff){
        var style = elem.currentStyle, styles = {}, key, value;
        for (key in filter) {
            value =  style[key];
            if (typeof value === 'string' && (!diff || filter[key] !== value)) {
                styles[key] = style[key];
            }
        }
        return styles;
    };
    // ͨ��currentStyle��ȡtransition
    var getTransition = function(currentStyle){
        var i, tLeng = 0, t = [], property = [], duration = [], timingFunction = [], delay = [], transition = {};
        // ������try���У�����ȡ�Զ������Կ��ܵ��³����ܼ�������
        try {
            t = currentStyle['transition'].split(rC);
            for(i = t.length; i--;) {
                t[i] = t[i].split(rS);
                t[i] = {property:t[i][0], duration: t[i][1], timingFunction: t[i][2], delay: t[i][3]};
            }
            tLeng = t.length;
            property = currentStyle['transition-property'].split(rC);
            duration = currentStyle['transition-duration'].split(rC);
            timingFunction = currentStyle['transition-timing-function'].split(rC);
            delay = currentStyle['transition-delay'].split(rC);
        } catch(e) {}
        // ���ϳ�һ������
        for (i = 0; i < property.length; i++) {
            //alert(property[i]);
            t[i + tLeng] = {property: property[i], duration: duration[i] || duration[0], timingFunction: timingFunction[i] || timingFunction[0], delay: delay[i] || delay[0]};
        }
        // ȥ�غϲ�
        for (i = 0; i < t.length; i++) {
            var item = transition[t[i].property];
            if (!item) item = transition[t[i].property] = {};
            item.duration = t[i].duration || item.duration || $.fx.speeds._default;
            item.timingFunction = t[i].timingFunction || item.timingFunction || $.cssEasing._default;
            item.delay = t[i].delay || item.delay || 0;
        }
        return transition;
    };
    var classAnimation = function(value){
        var animated = this, children, allAnimations, applyClassChange;
        if (!animated[0]) return ;
        var currentStyle = this[0].currentStyle;
        var doAnimate = !!currentStyle &&
            (!!(children = currentStyle['fix-transition-chlidren']) ||
                !!currentStyle['transition-property'] ||
                !!currentStyle['transition']
                );
        applyClassChange = function() {
            $.each(value, function(i, item) {
                item.orig.call(animated, item.classes);
            });
        };
        if (doAnimate) {
            var baseClass = animated.attr( "class" ) || "";
            allAnimations = animated.find($.trim(children).replace(/^["']/, '').replace(/['"]$/, '')).addBack();
            // ������Ҫ��������Ԫ�أ���ȡ��ԭ����ʽ
            allAnimations = allAnimations.map(function(){
                var t = getTransition(this.currentStyle), el = $(this);
                return {
                    el: el,
                    start: getStyles(this, t),
                    transitions: t
                }
            });
            applyClassChange();
            // �ٴα�����Ҫ���������ʽ�Ĳ���
            allAnimations = allAnimations.map(function() {
                this.diff = getStyles(this.el[0], this.start, true);
                return this;
            });
            animated.attr( "class", baseClass );
            allAnimations = allAnimations.map(function(){
                var i = firstVal(this.transitions);
                // ֻ��ȡ��һ��duration��timingFunction��delay��������
                var styleInfo = this,
                    dfd = $.Deferred(),
                    opts = $.extend({
                        duration: toMS(i.duration),
                        easing: cssEasing2Easing[i.timingFunction] || 'swing'
                    }, {
                        complete: function() {
                            dfd.resolve(styleInfo);
                        }
                    });
                this.el.finish().delay(toMS(i.delay)).animate(this.diff, opts);
                return dfd.promise();
            });
            $.when.apply($, allAnimations.get()).done(function() {

                // ��������
                applyClassChange();

                // �������ж�����Ԫ�أ��������css����
                $.each( arguments, function() {
                    var el = this.el;
                    $.each( this.diff, function(key) {
                        el.css( key, "" );
                    });
                });
            });

        } else applyClassChange();
    };
    $.each(classAnimationActions, function(__, action){
        var orig = $.fn[action + 'Class'];
        $.fn[action + 'Class'] = $.support.transition ? orig : function(classes) {
            // TODO: �ж��Ƿ�������..
            var withAnimation = true;
            if (withAnimation) classAnimation.call(this, {add: {classes: classes, orig: orig}})
            else orig.apply(this, arguments);
            return this;
        }
    })
})(armer)
