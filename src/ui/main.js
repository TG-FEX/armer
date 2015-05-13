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
        }, 0)

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
