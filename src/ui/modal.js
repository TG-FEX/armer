(function ($) {

    var animate = function($elem, animateArgs){
        return ($.fn.transit || $.fn.animate).apply($elem, animateArgs);
    }
    var openCauseClose;
    /**
     * 对话框构造体
     * @param {jQuery.Deferred|jQuery|function|string} content
     * @param {object} options
     * @constructor
     */
    var Dialog = function(content, options){
        var callee = arguments.callee;
        if (!(this instanceof callee)) return new callee(content, options);
        this.options = $.extend({}, callee.defaults, options);
        callee.factory.call(this, content, options);
        this.constructor = callee;
    };
    Dialog.factory = function(content){
        var that = this;
        if (typeof content == 'string' || /\//.test(content)) {
            var selector, url, off = content.indexOf(" ");
            if ( off >= 0 ) {
                selector = content.slice(off, content.length);
                url = content.slice(0, off);
            }
            this._init = function(){
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
            this._init = function(){
                return $.when($(content));
            };
        else
            this._init = content;
        this.$element = $('<div class="modal" tabindex="1" style="position: absolute; z-index:1001; display: none; overflow: hidden;"></div>');
    };
    Dialog.toggleBackDrop = function(toggle, $backdrop){
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
    }
    Dialog.closeAll = function(list, returnValue, closeOptions){
        list = list || this.defaults.queue;
        var $backdrop;
        list.forEach(function(item){
            var co = $.extend(closeOptions, item.options.close);
            var rt = returnValue || co.returnValue;
            rt = $.isFunction(rt) ? rt.call(this) : rt;
            $backdrop = item.options.backdrop;
            item._close(rt, co)
        });
        list.length = 0;
        !openCauseClose && $backdrop && this.toggleBackDrop(false, $backdrop);
    }
    Dialog.prototype = $.EventEmitter({
        init: function(){
            var self = this;
            if (typeof this._init == "function") {
                return this._init().done(function($elem){
                    self._init = this;
                    self.$element.append($elem.show()).appendTo('body');
                })
            } else return this._init
        },
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
                var b = !!item.lastOpen.showBackdrop;
                has = b || has;
                if (b) thisZindex = s || thisZindex;
                item.$element.css('zIndex', s);
            })
            if ($backdrop){
                if (!has)
                    this.constructor.toggleBackDrop(false, $backdrop);
                else $backdrop.css('zIndex', thisZindex);
            }
        },
        _open: function(openOptions){
            var list = this.options.queue, self = this, index, position;
            if (list.indexOf(self) >= 0) return;
            this.lastOpen = openOptions;
            self.$element.on('focus.ui.dialog', function(e){
                self.trigger(e);
            });
            if (openOptions.showBackdrop)
                this.constructor.toggleBackDrop(true, this.options.backdrop);
            openCauseClose = true;
            if (openOptions.closeOthers) {
                this.constructor.closeAll();
            }
            openCauseClose = false;
            list.push(self);
            position = typeof openOptions.position == 'object' ? openOptions.position : openOptions.position(list.indexOf(self));
            position.of = position.of || this.options.attach;
            self.$element.finish().position(position);
            return animate(self.$element, openOptions.animate).promise().done(function(){
                self.trigger('opened.ui.dialog');
            });
        },
        _close: function(returnValue, closeOptions){
            var self = this;
            self.$element.off('focus.dialog');
            return animate(this.$element, closeOptions.animate).promise().done(function(){
                this[0].style.top = '';
                this[0].style.left = '';
                self.trigger('closed.ui.dialog', [returnValue]);
            });
        },
        toggle: function(){
            var list = this.options.queue;
            if (!(list.indexOf(this) >= 0)) this.trigger('close');
            else this.trigger('open');
        },
        close: function(returnValue, closeOptions){
            var self = this, list = this.options.queue;
            if (!(list.indexOf(this) >= 0)) return;
            closeOptions = $.extend({}, this.options.close, closeOptions);
            returnValue = returnValue || closeOptions.returnValue;
            returnValue = $.isFunction(returnValue) ? returnValue.call(this) : returnValue;
            this._close(returnValue, closeOptions);
            $.Array.remove(this.options.queue, this);
            if (!openCauseClose) {
                if (!list.length) this.constructor.toggleBackDrop(false, this.options.backdrop);
                list.length && list[list.length - 1].$element.trigger('focus.ui.dialog');
            }
        },
        open: function(dfd, openOptions){
            var self = this;
            if (!$.isDeferred(dfd)) {
                openOptions = dfd;
                dfd = null;
            }
            openOptions = $.extend({}, this.options.open, openOptions);
            dfd = dfd || openOptions.dfd;
            var init;
            if (typeof this._init == 'function') {
                var e = $.Event('init');
                self.trigger(e);
                if (!e.isDefaultPrevented())
                    init = e.actionReturns
                else init = $.Deferred.reject()
            } else
                init = self._init;
            $.when(init, dfd).done(function(){
                self._open(openOptions);
                self.trigger('focus.ui.dialog');
                //self.$element[0].focus();
            })
        }
    });


    Dialog.defaults = {
        queue: [],
        attach: $(window),
        zIndex: {
            start: 1300,
            step: 100,
            end: 1400
        },
        open: {
            position: {
                at: 'left' + ' bottom' + '+15',
                my: 'left top'
            },
            showBackdrop: false,
            closeOthers: true,
            getFocus: false,
            animate: [{
                top: '-=10',
                opacity: 'show'
            }]
        },
        close: {
            animate: [{
                opacity: 'hide',
                top: '+=10'
            }]
        },
        onopen: $.noop,
        onopened: $.noop,
        onclose: $.noop,
        onclosed: $.noop,
        oninit: $.noop,
        onfocus: $.noop
    };

    $.UI.Dialog = Dialog;
    $.UI.Modal = $.Function.clone(Dialog);
    $.UI.Modal.defaults = {
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
                    collision: 'flipfit'
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


    $.fn.modal = function(command){
        var $this = this[0], modal;
        // 判断是否有这个方法
        if ($.type(command) != 'string' && !$.UI.Modal.prototype[command]) {
            command = null;
        } else
            [].shift.call(arguments);
        modal = $.data(self, 'ui-modal');
        if (!modal) {
            //如果命令为空，那么拼接参数
            if (!command) {
                [].unshift.call(arguments, $this);
                modal = $.UI.Modal.apply($.UI.Modal, arguments);
            } else {
                console.log($this);
                modal = $.UI.Modal($this);
            }
            $.data(self, 'ui-modal', modal);
            if (!command) return this;
        } else if (!command) return modal;

        return modal[command].apply(modal, arguments);
    }

})(jQuery);