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
            this.container = $('<div class="' + this.options.dialogClass +'" tabindex="0" style="position: absolute; z-index:1001; display: none;"></div>');
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
        focusin: function(){
            var $backdrop = this.options.backdrop;
            var list = this.options.queue;
            var z = this.options.zIndex;
            var that = this;
            var thisZindex, has = false, s, r;
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
            if (this.options.reposition) {
                if (!that.reposition) {
                    that.reposition = $.Function.debounce(function(e) {
                        if (e.target == that.container[0]) return;
                        var position = that._getPosition();
                        position.using = function(position){
                            animate(that.container, [position])
                        };
                        that.container.position(position);
                    }, 100);
                }
                this.container.on('DOMSubtreeModified propertychange', that.reposition);
                $(window).on('resize scroll', that.reposition);
            }
        },
        focusout: function(){
            if (this.reposition) {
                this.container.off('DOMSubtreeModified propertychange', this.reposition);
                $(window).off('resize scroll', this.reposition);
            }
        },
        isOpened: function(){
            var list = this.options.queue;
            return list.indexOf(this) >= 0
        },
        _innerOpen: function(openOptions){
            var list = this.options.queue, self = this, index, position, animatePosition = {}, animateFn;
            if (this.isOpened()) return $.when();
            this.lastOpenOptions = openOptions;

            self.container.on('focusin.dialog', function(e){
                self.trigger(e);
            }).on('focusout.dialog', function(e){
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

            position = this._getPosition(openOptions.position);
            if ($.isFunction(openOptions.animate)) {
                animateFn = openOptions.animate
            } else {
                animateFn = function($elem, position){
                    $elem.css(position);
                    return openOptions.animate
                }
            }
            self.container.show().finish();
            if (openOptions.animate) {
                animatePosition = {
                    using: function(position){
                        position.display = 'none';
                        animate(self.container, animateFn(self.container, position))
                    }
                }
            }

            self.container.position($.mixOptions(animatePosition, position));
            this.options.loadingClass && this.options.backdrop.addClass(this.options.loadingClass);

            return self.container.promise().done(function(){
                self.trigger('opened');
            });
        },
        _getPosition: function(position){
            position = position || this.options.position;
            position = typeof position == 'object' ? position : position(this.options.queue.indexOf(this));
            position.of = position.of || this.options.attach;
            return position
        },
        _innerClose: function(returnValue, closeOptions){
            var self = this;
            self.container.off('focusin.dialog');
            return closeOptions.animate ? animate(this.container.finish(), closeOptions.animate).promise().done(function(){
                this[0].style.top = '';
                this[0].style.left = '';
                self.trigger('closed', [returnValue]);
            }) : (this.container.hide() && $.when().done(function(){
                self.trigger('closed', [returnValue]);
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
                list.length && list[list.length - 1].container.trigger('focus');
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

            //this.constructor.defaults.loadingClass && self.constructor.toggleBackdrop(true, this.options.backdrop);

            $.when(init, dfd, self.options.resizeIframe ? self._resizeIframe() : undefined).done(function(){
                self._innerOpen(openOptions).done(function(){
                    ret.resolve();
                });
                self.trigger('focus');
                openOptions.getFocus && self.container[0].focus();
            });
            return ret
        },
        _opened: function(){
            this.options.loadingClass && this.options.backdrop.removeClass('loading');
            var self = this;


        },
        _resizeIframe: function(){
            var that = this;
            var ret = [];
            var resize = function(iframe, selector){
                var $elem = iframe.contents().find(selector);
                iframe.css({
                    width: $elem.width(true),
                    height: $elem.height(true)
                })
            }
            this.element.find('iframe').each(function(i, iframe) {
                var $iframe = $(iframe);
                var src = $iframe.data('src');
                if (src) {
                    $iframe.attr('src', src);
                }
                $iframe.attr('scrolling', 'no');
                var dfd = $.Deferred();
                ret.push(dfd);

                $iframe.on('load', function(){
                    resize($iframe, that.options.resizeIframe === true ? 'body' : that.options.resizeIframe);
                    dfd.resolve(iframe);
                })

            });
            return $.when.apply($, ret);
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
            position: {
                at: 'left' + ' bottom' + '+15',
                //at: 'left' + ' bottom' + '+5',
                my: 'left top',
                collision: 'flipfit flipfit'
            },
            open: {
                showBackdrop: false,
                closeOthers: true,
                animate: [{
                    top: '-=10',
                    opacity: 'show'
                }],
                getFocus: false
            },
            close: {
                animate: [{
                    top: '+=10',
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
        loadingClass: 'loading',
        dialogClass: 'modal',
        queue: [],
        reposition: true,
        attach: $(window),
        backdrop: $('<div class="backdrop" style="display: none;"></div>'),
        zIndex: {
            start: 1100,
            step: 10,
            end: 1300
        },
        position: function(index){
            var stepX = 20;
            var stepY = 20;
            var offestX = index * stepX;
            var offestY = index * stepY;
            offestX = offestX > 0 ? ('+' + offestX.toString()) : (offestX == 0) ? '' : offestX.toString();
            offestY = offestY > 0 ? ('+' + offestY.toString()) : (offestY == 0) ? '' : offestY.toString();
            return {
                at: 'center' + offestX + ' center' + offestY,
                my: 'center center',
                collision: 'fit'
            }
        },
        open: {
            showBackdrop: true,
            closeOthers: true,
            getFocus: true,
            animate: function($elem, position){
                position.top -= 30;
                $elem.css(position);

                return [{
                    top: '+=30',
                    opacity: 'show'
                },{
                    done: function(){
                        $(this).find('.modal-form :text, .modal-form textarea').eq(0).focus();
                    }
                }]
            }
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