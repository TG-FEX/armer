(function ($) {
    var $backdrop = $('<div class="backdrop" style="display: none;"></div>').prependTo('body').bgiframe();
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
                var dfd = $.Deferred();
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'html'
                }).done(function(responseText) {
                    dfd.resolve($(selector ? $('<div>').append($.parseHTML(responseText)).find(selector) : responseText));
                });
                return dfd;
            }
        } else if ($.type(content) != 'function')
            this._init = function(){
                return $.when($(content));
            };
        else
            this._init = content;
        this.$element = $('<div style="position: absolute; z-index:1001; display: none; overflow:hidden"></div>');
    };
    Modal.list = [];
    Modal.toogleBackDrop = function(toggle){
        toggle = toggle == null ? 'toggle' : !toggle ? 'hide' : 'show'
        $backdrop.animate({
            opacity: toggle
        })
    }
    Modal.prototype = {
        constructor: Modal,
        init: function(){
            var e = $.Event('init'), dfd, self = this;
            this.$element.trigger(e);
            if (!e.isDefaultPrevented()) {
                dfd = this._init();
            } else dfd = $.Deferred.reject();
            dfd.done(function($elem){
                self._init = dfd;
                self.$element.append($elem.show()).appendTo('body');
            })
        },
        _open: function(){
            if (Modal.list.indexOf(this) >= 0) return;
            if (!Modal.list.length) {
                Modal.toogleBackDrop(true);
                Modal.list.push(this);
            }
            else {
                Modal.list.push(this);
                Modal.list[0].close();
            }
            this.$element.position({of:$(window), at:'center center-50', my:'center center'}).animate({
                top: '+=50',
                opacity: 'show'
            })
        },
        _close: function(){
            if (!(Modal.list.indexOf(this) >= 0)) return;
            $.Array.remove(Modal.list, this);
            if (!Modal.list.length) Modal.toogleBackDrop(false);
            this.$element.animate({
                opacity: 'hide',
                top: '-=50'
            }, function(){
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
            $.when(typeof this._init == "function" ? this.init() : this._init, dfd).done(function(){
                var e = $.Event('open');
                self.$element.trigger(e);
                if (!e.isDefaultPrevented()) {
                    Modal.toogleBackDrop(true);
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
