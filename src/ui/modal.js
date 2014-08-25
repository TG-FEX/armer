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
    Dialog.toogleBackDrop = function(toggle, $backdrop){
        $backdrop = $backdrop || this.defaults.backdrop;
        if (!$backdrop) return;
        var $body = $('body');
        if (!$.contains($body[0], $backdrop[0])) {
            $backdrop.prependTo('body').bgiframe();
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
        !openCauseClose && $backdrop && this.toogleBackDrop(false, $backdrop);
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
            var list = this.options.queue;
            var z = this.options.zIndex;
            var that = this;
            var thisZindex;
            $.Array.remove(list, that);
            list.push(that);
            list.forEach(function(item, i){
                var s = z.start + i * z.step;
                if (item == that) thisZindex = s
                item.$element.css('zIndex', s);
            })
            this.options.backdrop && this.options.backdrop.css('zIndex', thisZindex);

        },
        _open: function(openOptions){
            var list = this.options.queue, self = this, index, position;
            if (list.indexOf(self) >= 0) return;
            self.$element.on('focus.dialog', function(e){
                self.trigger(e);
            });
            if (!list.length) {
                if (openOptions.showBackdrop)
                    this.constructor.toogleBackDrop(true, this.options.backdrop);
            } else {
                openCauseClose = true;
                if (openOptions.closeOthers) {
                    this.constructor.closeAll();
                }
                openCauseClose = false;
            }
            list.push(self);
            position = typeof openOptions.position == 'object' ? openOptions.position : openOptions.position(list.indexOf(self));
            position.of = position.of || this.options.attach;
            self.$element.finish().position(position);
            return animate(self.$element, openOptions.animate).promise().done(function(){
                self.trigger('opened');
            });
        },
        _close: function(returnValue, closeOptions){
            var self = this;
            self.$element.off('focus.dialog');
            return animate(this.$element, closeOptions.animate).promise().done(function(){
                this[0].style.top = '';
                this[0].style.left = '';
                self.trigger('closed', [returnValue]);
            });
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
                if (!list.length) this.constructor.toogleBackDrop(false, this.options.backdrop);
                list.length && list[list.length - 1].$element.trigger('focus');
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
                if (openOptions.getFocus)
                    self.$element.trigger('focus')
                else
                    self.trigger('focus');
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

    $.fn.modal = function(options){
        var self = this[0], modal;
        if (modal = $.data(self, 'ui-modal'))
            return modal;
        else $.data(self, 'ui-modal', $.UI.Modal(self, options));
        return this;
    }
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
                offestX = offestX ? offestX.toString() : '';
                offestY = offestY ? offestY.toString() : '';
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

})(jQuery);