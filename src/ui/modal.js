(function ($) {
    var $backdrop;
    /**
     * µ¯³ö¿ò
     * @param {jQuery.Deferred|jQuery|function|string} content
     * @param {object} options
     * @constructor
     */
    var Modal = function(content, options){
        if (!(this instanceof Modal)) return new Modal(content, options);
        this.options = $.extend({}, arguments.callee.defaults);
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
        this.$element = $('<div class="modal" style="position: absolute; z-index:1001; display: none; overflow: hidden;"></div>');
    };
    Modal.list = [];
    Modal.toogleBackDrop = function(toggle){
        toggle = toggle == null ? $backdrop.css('display') == 'none' : !!toggle;

        $('body').toggleClass('with-backdrop', toggle);
        if (!$backdrop) $backdrop = $('<div class="backdrop" style="display: none;"></div>').prependTo('body').bgiframe();
        var opacity = $backdrop.css('opacity');

        if (toggle) {
            $backdrop.css({
                display: 'block',
                opacity: 0
            }).transit({
                opacity: opacity
            }, function(){
                $(this).css({opacity: ''})
            })
        } else {
            $backdrop.css({
                opacity: opacity
            }).transit({
                opacity: 0
            }, function(){
                $(this).css({opacity: '', display: 'none'})
            })
        }
    }
    Modal.prototype = {
        constructor: Modal,
        init: function(){
            var e = $.Event('init'), dfd, self = this;
            self.$element.trigger(e);
            if (!e.isDefaultPrevented()) {
                dfd = self._init();
            } else dfd = $.Deferred.reject();
            dfd.done(function($elem){
                self._init = dfd;
                self.$element.append($elem.show()).appendTo('body');
            })
        },
        _open: function(){
            var self = this;
            if (Modal.list.indexOf(self) >= 0) return;
            if (!Modal.list.length) {
                Modal.toogleBackDrop(true);
                Modal.list.push(self);
            }
            else {
                Modal.list.push(self);
                Modal.list[0].close();
            }
            self.$element.css({
                display: 'block',
                opacity: 0
            }).position({of:$(window), at:'center center-50', my:'center center'}).finish().transit({
                top: '+=50',
                opacity: '1'
            }, function(){
                self.$element.find('.modal-form :text, .modal-form textarea').eq(0).focus();
            })
        },
        _close: function(){
            if (!(Modal.list.indexOf(this) >= 0)) return;
            $.Array.remove(Modal.list, this);
            if (!Modal.list.length) Modal.toogleBackDrop(false);

            this.$element.finish().transit({
                opacity: 0,
                top: '-=50'
            }, function(){
                this.style.display = 'none';
                this.style.top = ''
                this.style.left = ''
            });

        },
        close: function(){
            var e = $.Event('close'), self = this;
            this.$element.trigger(e);
            if (!e.isDefaultPrevented()) {
                self._close();
            }
        },
        open: function(dfd){
            var self = this;
            $.when(typeof self._init == "function" ? self.init() : self._init, dfd).done(function(){
                var e = $.Event('open');
                self.$element.trigger(e);
                if (!e.isDefaultPrevented()) {
                    self._open();
                }
            })
        }
    };

    Modal.defaults = {};

    $.fn.modal = function(options){
        var self = this[0], modal;
        if (modal = $.data(self, 'ui-modal'))
            return modal;
        else $.data(self, 'ui-modal', Modal(self, options));
        return this;
    }
    $.UI.Modal = Modal;

})(jQuery);