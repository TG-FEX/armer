/*!
 * armerjs - v0.8.10 - 2015-05-13 
 * Copyright (c) 2015 Alphmega; Licensed MIT() 
 */
// 关掉IE6 7 的动画
if (!$.support.opacity) $.fx.off = true;

$.UI = $.EventEmitter.extend({
    _init: function(){}
});
$.UI.extend = function(name, base, prototype){
    var tmp, namespace, fullName, constructor, constructorName;

    if (typeof name != 'string') {
        prototype = base;
        base = name
        name = null;
    }
    if (!$.isFunction(base)) {
        prototype = base;
        base = this
    }

    prototype = prototype || {};
    constructor = $.factory(prototype, base);
    constructor.mix(base);


    tmp = name.split('.');
    fullName = name = tmp.pop();
    namespace = tmp[0];

    constructorName = name.charAt(0).toUpperCase() + $.camelCase(name).substr(1);
    if (namespace) {
        fullName = namespace + '-' + name;
        tmp = this[namespace] = this[namespace] || {};
    } else {
        tmp = this;
    }
    fullName = 'ui-' + $.hyphen(fullName);

    tmp[constructorName] = constructor;

    $.expr[':'][fullName] = function(elem){
        return !!$.data(elem, fullName);
    };
    $.valHooks[fullName] = {
        'set': function(element, value){
            if ($.fn[name] && $.data(element, fullName)) {

                $(element)[name]('val', value);
            }
        }
    };
    var fullNameCamel = $.camelCase(name)


    $.fn[fullNameCamel] = function() {
        var self = this[0], ui, $this = $(this[0]);
        var args = arguments, command;
        if (!$this[0]) return this;
        // 判断是否有这个方法
        if ($.type(args[0]) != 'string' && !constructor.prototype[args[0]]) {
            command = null;
        } else
            command = [].shift.call(args);
        ui = $.data(self, fullName);
        if (!ui) {
            //如果命令为空，那么拼接参数
            if (command)
                args = [$this];
            else
                [].unshift.call(args, $this);
            ui = constructor.apply($.UI, args)
            $.data(self, fullName, ui);
            if (!command) return this;
        } else if (!command) return ui;
        return ui[command].apply(ui, arguments);
    }

    $(function(){
        $('[type=' + fullName + ']').each(function(){
            $(this)[fullNameCamel]()
        });
    });

    constructor.defaults = constructor.prototype.options;
    constructor.config = function(){
        $.mixOptions.apply($, [this.defaults].concat([].slice.call(arguments)))
    };
    return constructor;
};


$(function(){
    var $b = $('body');
    $b.on('click', '[data-trigger],[href]', function(e){
        var $this = $(e.currentTarget),
            target = $this.data('target'),
            toggle = $this.data('toggle'),
            $target, ui;
        if (!target && toggle) target = $this.attr('href');
        if (target) {
            $target = $(target);
            ui = $target.data('ui-toggle');
            if (!ui) return;
            if (!toggle) {
                for(var i in ui) {
                    $target[i](ui[i]);
                }
            } else {
                $target[toggle](ui[toggle]);
            }
            e.stopPropagation(true);
            return false;
        }
    });
});
//==============================
//   TODO(wuhf): UI级别的方法
//==============================
(function() {

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = $.fn.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        var settings = {};

        placeholder = $.fn.placeholder = function(options) {

            var defaults = {customClass: 'placeholder'};
            settings = $.extend({}, defaults, options);

            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.'+settings.customClass)
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }

                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value === '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass(settings.customClass)) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            var handler = function () {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.' + settings.customClass, this).each(clearInner);
                setTimeout(function () {
                    $inputs.each(setPlaceholder);
                }, 10);

            };
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', handler).delegate('form', 'reset.placeholder', handler);
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.'+settings.customClass).each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        return clearInner.call(this, event, value, function(input, isPassword){
            if (isPassword) {
                input.focus();
            } else {
                input == safeActiveElement() && input.select();
            }
        })
    }


    function clearInner(event, value, afterclear) {
        afterclear = afterclear || $.noop;
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass(settings.customClass)) {
            var isPassword = $input.data('placeholder-password');
            if (isPassword) {
                $input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                afterclear($input[0], isPassword)

            } else {
                input.value = '';
                $input.removeClass(settings.customClass);
                afterclear($input[0], isPassword)

            }
        }
    }

    function setPlaceholder() {
        var $replacement;
        var $input = $(this);
        $input = $input.data('placeholder-password') || $input;
        var input = $input[0];
        var id = this.id;
        if (input.value === '') {
            if (input.type === 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder).addClass(settings.customClass)[0].value = $replacement.attr('placeholder');
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', id).show();
                // Note: `$input[0] != input` now!
            } else {
                $input.addClass(settings.customClass);
                $input[0].value = $input.attr('placeholder');
            }
        } else {
            $input.removeClass(settings.customClass);
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        // https://github.com/mathiasbynens/jquery-placeholder/pull/99
        try {
            return document.activeElement;
        } catch (exception) {}
    }

})();
$(function(){


    // 坑爹的IE9-对 javascript:触发beforeunload
    $(document).on('click', 'a[href^="javascript:"]', function(){
        var events = $._data(window, 'events'), event;
        if (events) {
            event = events['beforeunload'];
            var handler = window.onbeforeunload;
            delete events['beforeunload'];
        }
        window.onbeforeunload = null;
        setTimeout(function(){
            if (event) {
                events['beforeunload'] = event;
            }
            window.onbeforeunload = handler;
        })

    })

    $('input, textarea').placeholder();
});

/*可截取多行显示省略号*/
$.fn.ellipsis = function() {
    function loop ($container, maxHeight, str) {
        if ($container.height() <= maxHeight) return;
        var init = false;
        var nodes = this.contents();
        var i = nodes.length - 2, item
        for (; i > -1 && $container.height() > maxHeight; i--) {
            item = nodes[i];
            if (item.nodeType == '3') {
                if (!init) init = !!$(item).after(str)
                var text = item.nodeValue.replace(/ {2,}/, ' ');
                while (item.nodeValue && $container.height() > maxHeight ){
                    text = text.substr(0, text.length - 1);
                    item.nodeValue = text;
                }
            }
        }
    }
    return function(str, container){
        return this.each(function(){
            // 复制以下这个地址
            var container = container;
            var oldH, str = str || '<span class="ellipsis">...</span>'
            container = container || this;
            // 获取max-height用来计算行数
            var maxHeight = window.getComputedStyle ? (getComputedStyle(container)['max-height'] || getComputedStyle(container)['maxHeight']) : container.currentStyle['max-height'];
            var match = maxHeight.match(/(0?\.?\d*)px$/);
            if (match) maxHeight = oldH = match[1];
            else return;
            // 用一个空元素测量一下行高，然后去掉
            var s = $('<span></span>', {
                html: 'o',
                css: {
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    left: '-999em'
                }
            }).appendTo(this);
            var lineHeight = parseInt(s.css('lineHeight'));
            s.remove();


            var line = Math.floor(maxHeight / lineHeight);
            console.log(maxHeight)
            console.log('lineHeight:' + lineHeight)
            console.log(line)
            maxHeight = line * lineHeight;

            // 去掉一些样式，让其超出范围
            container.style.maxHeight = 'none';
            container.style.overflowY = 'auto';
            container.style.height = 'auto';


            if (arguments.callee.useCssClamp && ('webkitLineClamp' in this.style || 'lineClamp' in this.style)) {
                container.style.textOverflow = 'ellipsis';
                container.style.display = '-webkit-box';
                container.style.webkitBoxOrient = 'vertical';
                container.style.webkitLineClamp = line;
            } else loop.call($(this), $(container), maxHeight, str);


            // 覆盖样式
            container.style.overflowY = 'hidden';
            container.style.maxHeight = oldH + 'px';
        })
    }
}();

$.fn.ellipsis.useCssClamp = true;

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
(function ($) {

    var animate = function($elem, animateArgs){
        return ($.fn.transit || $.fn.animate).apply($elem, animateArgs);
    }
    var openCauseClose;
    /**
     * 对话框构造体
     * @param {jQuery.Deferred|jQuery|function|string} content
     * @param {object} options
     * @class armer.UI.Dialog
     * @extends armer.EventEmitter
     * @constructor
     */
    var Dialog = $.UI.extend('dialog', {
        _init: function(content, options){
            var that = this;
            this.options = $.extend({}, this.constructor.defaults, options);
            if (typeof content == 'string' && /\//.test(content)) {
                var selector, url, off = content.indexOf(" ");
                if ( off >= 0 ) {
                    selector = content.slice(off, content.length);
                    url = content.slice(0, off);
                }
                this._content = function(){
                    return $.ajax({
                        url: url,
                        type: 'get',
                        dataType: 'html',
                        dataFilter: function(responseText){
                            return  $(selector ? $('<div>').append($.parseHTML(responseText)).find(selector) : responseText)
                        }
                    })
                }
            } else if ($.type(content) != 'function')
                this._content = function(){
                    return $.when($(content));
                };
            else
                this._content = content;
            this.container = $('<div class="' + this.options.dialogClass +'" tabindex="0" style="position: absolute; z-index:1001; display: none; overflow: hidden;"></div>');
        },
        /**
         * 初始化方法
         * @method init
         * @returns {$.Deferred}
         */
        _create: function(){
            var self = this;
            if (typeof this._content == "function") {
                return this._content().done(function($elem){
                    self._content = this;
                    self.container.append($elem.show()).appendTo('body');
                    self.element = $elem;
                })
            } else return this._content
        },
        /**
         * 聚焦弹出框
         * @method focus
         */
        focus: function(){
            var $backdrop = this.options.backdrop;
            var list = this.options.queue;
            var z = this.options.zIndex;
            var that = this;
            var thisZindex, has = false, s;
            $.Array.remove(list, that);
            list.push(that);
            list.forEach(function(item, i){
                s = z.start + i * z.step;
                var b = !!item.lastOpenOptions.showBackdrop;
                has = b || has;
                if (b) thisZindex = s || thisZindex;
                item.container.css('zIndex', s);
            })
            if ($backdrop){
                if (!has)
                    this.constructor.toggleBackdrop(false, $backdrop);
                else $backdrop.css('zIndex', thisZindex);
            }
        },
        isOpened: function(){
            var list = this.options.queue;
            return list.indexOf(this) >= 0
        },
        _innerOpen: function(openOptions){
            var list = this.options.queue, self = this, index, position;
            if (this.isOpened()) return $.when();
            this.lastOpenOptions = openOptions;

            self.container.on('focus.ui.dialog', function(e){
                self.trigger(e);
            });
            if (openOptions.showBackdrop)
                this.constructor.toggleBackdrop(true, this.options.backdrop);
            openCauseClose = true;
            if (openOptions.closeOthers) {
                this.constructor.closeAll();
            }
            openCauseClose = false;
            list.push(self);
            position = typeof openOptions.position == 'object' ? openOptions.position : openOptions.position(list.indexOf(self));
            position.of = position.of || this.options.attach;

            self.container.show().finish().position(position);

            if (!openOptions.animate) {
                return $.when().done(function(){
                    self.trigger('opened.ui.dialog');
                });
            }

            self.container.hide();
            return animate(self.container, openOptions.animate).promise().done(function(){
                self.trigger('opened.ui.dialog');
            });
        },
        _innerClose: function(returnValue, closeOptions){
            var self = this;
            self.container.off('focus.dialog');
            return closeOptions.animate ? animate(this.container.finish(), closeOptions.animate).promise().done(function(){
                this[0].style.top = '';
                this[0].style.left = '';
                self.trigger('closed.ui.dialog', [returnValue]);
            }) : (this.container.hide() && $.when().done(function(){
                self.trigger('closed.ui.dialog', [returnValue]);
            }));
        },
        /**
         * 开关弹出框
         * @method toggle
         * @async
         */
        toggle: function(){
            var list = this.options.queue;
            if (!(list.indexOf(this) >= 0)) this.open.apply(this, arguments);
            else this.close.apply(this, arguments);
        },
        /**
         * 关闭弹出框
         * @method close
         * @async
         * @param [returnValue] 关闭传递的参数
         * @param [closeOptions] 关闭的选项
         * @returns {$.Deferred}
         */
        close: function(returnValue, closeOptions){
            var self = this, list = this.options.queue, ret = $.Deferred();
            if (!(list.indexOf(this) >= 0)) return;
            closeOptions = $.extend({}, this.options.close, closeOptions);
            returnValue = returnValue || closeOptions.returnValue;
            returnValue = $.isFunction(returnValue) ? returnValue.call(this) : returnValue;
            this._innerClose(returnValue, closeOptions).done(function(){
                ret.resolve(returnValue)
            });
            $.Array.remove(this.options.queue, this);
            if (!openCauseClose) {
                if (!list.length) this.constructor.toggleBackdrop(false, this.options.backdrop);
                list.length && list[list.length - 1].container.trigger('focus.ui.dialog');
            }
            return ret
        },
        /**
         * 打开弹出框
         * @method open
         * @async
         * @param [dfd] {$.Deferred} 需要等待的操作
         * @param [openOptions] 打开的选项
         * @returns {$.Deferred}
         */
        open: function(dfd, openOptions){
            var self = this, ret = $.Deferred();
            if (!$.isDeferred(dfd)) {
                openOptions = dfd;
                dfd = null;
            }
            openOptions = $.mixOptions({}, this.options.open, openOptions);
            dfd = dfd || openOptions.dfd;
            var init;
            if (typeof this._content == 'function') {
                var e = $.Event('create');
                self.trigger(e);
                init = e.isDefaultPrevented() ? $.Deferred.reject() : e.actionReturns;
            } else
                init = self._content;
            $.when(init, dfd).done(function(){
                self._innerOpen(openOptions).done(function(){
                    ret.resolve();
                });
                self.trigger('focus.ui.dialog');
                openOptions.getFocus && self.container[0].focus();
            });
            return ret
        }
    }).mix({
        event: {
            OPEN: 'open',
            OPENED: 'opened',
            CLOSE: 'close',
            CLOSED: 'closed',
            FOCUS: 'focus'
        },
        /**
         * 打开/关闭遮罩层
         * @method toggleBackdrop
         * @static
         * @param toggle {boolean} 打开或者关闭
         * @param [$backdrop] {armer}　需要打开或者关闭的弹出框对象
         */
        toggleBackdrop: function(toggle, $backdrop){
            $backdrop = $backdrop || this.defaults.backdrop;
            if (!$backdrop) return;
            var $body = $('body');
            if (!$.contains($body[0], $backdrop[0])) {
                $backdrop.prependTo('body');
                if (!!window.ActiveXObject && !window.XMLHttpRequest) {
                    $backdrop.bgiframe()
                }
            }
            toggle = toggle == null ? $backdrop.css('display') == 'none' : !!toggle;
            $body.toggleClass('with-backdrop', toggle);
            animate($backdrop, [{
                opacity: toggle ? 'show' : 'hide'
            }]);
        },
        /**
         * 关闭所有弹出框
         * @method closeAll
         * @static
         * @param [list] 需要关闭的弹出框的列表
         * @param [returnValue] 需要提供的返回值
         * @param [closeOptions] 关闭的选项
         */
        closeAll: function(list, returnValue, closeOptions){
            list = list || this.defaults.queue;
            var $backdrop;
            list.forEach(function(item){
                var co = $.extend(closeOptions, item.options.close);
                var rt = returnValue || co.returnValue;
                rt = $.isFunction(rt) ? rt.call(this) : rt;
                $backdrop = item.options.backdrop;
                item._innerClose(rt, co)
            });
            list.length = 0;
            !openCauseClose && $backdrop && this.toggleBackdrop(false, $backdrop);
        },
        defaults: {
            dialogClass: 'dialog',
            queue: [],
            attach: $(window),
            zIndex: {
                start: 1300,
                step: 100,
                end: 1400
            },
            open: {
                position: {
                    //at: 'left' + ' bottom' + '+15',
                    at: 'left' + ' bottom' + '+5',
                    my: 'left top',
                    collision: 'flipfit flipfit'
                },
                showBackdrop: false,
                closeOthers: true,
                animate: [{
                    //top: '-=10',
                    opacity: 'show'
                }],
                getFocus: false
            },
            close: {
                animate: [{
                    //top: '+=10',
                    opacity: 'hide'
                }]
            },
            onopen: $.noop,
            onopened: $.noop,
            onclose: $.noop,
            onclosed: $.noop,
            oninit: $.noop,
            onfocus: $.noop
        }

    });


    $.UI.Dialog = Dialog;

    $.UI.Modal = Dialog.extend('modal');
    $.UI.Modal.defaults = {
        dialogClass: 'modal',
        queue: [],
        attach: $(window),
        backdrop: $('<div class="backdrop" style="display: none;"></div>'),
        zIndex: {
            start: 1100,
            step: 10,
            end: 1300
        },
        open: {
            position: function(index){
                var stepX = 20;
                var stepY = 20;
                var offestX = index * stepX;
                var offestY = index * stepX - 30;
                offestX = offestX > 0 ? ('+' + offestX.toString()) : (offestX == 0) ? '' : offestX.toString();
                offestY = offestY > 0 ? ('+' + offestY.toString()) : (offestY == 0) ? '' : offestY.toString();
                return {
                    at: 'center' + offestY + ' center' + offestY,
                    my: 'center center',
                    collision: 'fit'
                }
            },
            showBackdrop: true,
            closeOthers: true,
            getFocus: true,
            animate: [{
                top: '+=30',
                opacity: 'show'
            },{
                done: function(){
                    $(this).find('.modal-form :text, .modal-form textarea').eq(0).focus();
                }
            }]
        },
        close: {
            animate: [{
                opacity: 'hide',
                top: '+=30'
            }]
        },
        onopen: $.noop,
        onopened: $.noop,
        onclose: $.noop,
        onclosed: $.noop,
        oninit: $.noop,
        onfocus: $.noop
    }

})(jQuery);
$.UI.extend('spinner', {
    _init: function(element, options){

        var that= this;
        this.element = element;
        this.output = $('<span class="spinner"><a class="btn-spinup" href="javascript:">-</a><input  type="text"/><a class="btn-spindown" href="javascript:">+</a></span>');
        this._input = this.output.find('input');
        this.options = $.extend({}, this.constructor.defaults, options);

        var tmp;
        this.output.on('click', 'a', function(){
            var $this = $(this);
            var klass = $this.attr('class');
            that.trigger(!~klass.indexOf('up') ? 'spinup' : 'spindown');
        });
        this._input.valuechange(function(e, newValue, oldValue){
            if (newValue === '') {
                tmp = oldValue;
                return;
            }
            that.trigger('validate', [newValue, that.oldValue]);
        }).blur(function(){
            if (this.value === '') {
                that.trigger('validate', [this.value, that.oldValue]);
            }
        }).on('keyup', function(e){
            if (e.which == 38) {
                that.spinup();
                this.select();
                return false;
            } else if (e.which == 40) {
                that.spindown();
                this.select();
                return false;
            }
        });
        this.element.after(this.output);
        this.on('invalid overflow', function(e, _, oldValue){
            that._input.val(oldValue);
        });
        this.editable(this.options.editable);
        this.val(this.element.val());
    },
    editable: function(editable){
        this._input.prop('readonly', !editable);
    },
    spin: function(down){
        var oldValue = this._input.val();
        var step = 0;
        if (down) step = -this.options.step;
        else step = +this.options.step;
        if (step)  this.trigger('validate', [step + +oldValue, oldValue]);
    },
    spinup: function(){
        return this.spin();
    },
    spindown: function(){
        return this.spin(true);
    },
    _change: function(newValue){
        this._input.val(newValue);
        this.element.val(newValue);
        this.oldValue = newValue;
    },
    val: function(newValue){
        if (newValue != null) this.validate(newValue, this.oldValue);
        else return this.element.val();
    },
    _validate: function(newValue, oldValue){
        var that = this;
        var val = +newValue;
        if (isNaN(val) || newValue === '') {
            that.trigger('invalid', [newValue, oldValue]);
        } else if (val < that.options.min || val > that.options.max) {
            that.trigger('overflow', [val, oldValue]);
        } else if (!$.isEqual(val, oldValue))
            this.trigger('change', [val, oldValue]);
    },
    validate: function(newValue, oldValue){
        var that = this;
        var val = +newValue;
        if (isNaN(val) || newValue === '') {
            that.trigger('invalid', [newValue, oldValue]);
        } else if (val < that.options.min || val > that.options.max) {
            that.trigger('overflow', [val, oldValue]);
        } else if (!$.isEqual(val, oldValue))
            this._change(val, oldValue);
    }
}).mix({
    defaults: {
        min: 1,
        max: 99,
        step: 1,
        editable: true,
        oninvalid: function(){
            this.output.addClass('invalid');
        },
        onoverflow: function(){
            this.output.addClass('overflow');
        },
        onchange: function(){
            this.output.removeClass('invalid overflow');
        }
    }
})