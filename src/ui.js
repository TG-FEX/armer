$.UI = {};
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
(function(support){
    if (!support) {
        var oVal = $.fn.val;
        var togglePlaceHolder = function(val) {
            val = val || oVal.call(this);
            var holder = this.attr('placeholder');
            if (!val && holder) oVal.call(this, holder).addClass('placeholder');
            else this.removeClass('placeholder')
        };
    }
    var fixFn1 = function(){
        var $this = this;
        var str = $this.attr('placeholder')
        var $holder = $(document.createElement('f-placeholder-text')).html(str);
        var cssClass = $this.attr('class');
        cssClass && cssClass.replace($.rword, function(cssClass){
            $holder.addClass(cssClass);
            return false;
        });
        var $wrapper = $(document.createElement('f-placeholder-wrapper'));
        $this.wrap($wrapper);
        var css = {
            'position': 'absolute',
            'width': $this.width(),
            'height': $this.height(),
            'fontFamily': $this.css('fontFamily'),
            'fontSize': $this.css('fontSize'),
            'fontWeight': $this.css('fontWeight'),
            'fontStyle': $this.css('fontStyle'),
            'lineHeight': $this.css('lineHeight')
        };
        'Top,Right,Bottom,Left'.replace($.rword, function(name){
            css['padding' + name] = parseInt($this.css('padding' + name)) + parseInt($this.css('border' + name + 'Width'));
            css['margin' + name] = parseInt($this.css('margin' + name));
        });
        css.marginTop ++;
        $holder.css(css);
        $this.on('valuechange.placeholder', function(){
            var arg = arguments;
            if(!arg[1]) $holder.show();
            else $holder.hide();
        });
        $holder.on('click.placehoder', function(){
            $this.focus();
        });
        $this.before($holder);

    };
    try {
        $('<input/>').attr('placeholder')
    } catch(e) {
        //IE10你可以去死了...
        support = true;
    }


    var fixFn2 = function(){
        var $this = this;
        !support && togglePlaceHolder.call($this);
        $this.on('blur.placehoder', function(){
            togglePlaceHolder.call($this);
        }).on('focus.placehoder', function(){
                if (oVal.call($this) == $this.attr('placeholder')) oVal.call($this, '');
                $this.removeClass('placeholder');
            });

        //重写val
        $.fn.val = function(val){
            if (val == null && !val)
                return this.each(function(){
                    togglePlaceHolder.call($(this), val);
                });
            else if (val) return oVal.apply(this, arguments);
            else {
                val = oVal.apply(this);
                if(val == this.attr('placeholder')) return '';
                else return val;
            }
        };
    };

    $.fn.placeHolder =  function(str){
        return this.each(function(){
            var $this = $(this);
            if (!$this.data('fix-placeHolder')) {
                $this.data('fix-placeHolder', true);
                !!str && $this.attr('placeholder', str);
                !$.support.placeHolder && fixFn1.call($this);
            }
        })
    }

    if (!support) {
        //重写val
        $.fn.val = function(val){
            var $this = $(this);
            if (!!val && !!$this.attr('placeholder')) {
                oVal.apply(this, arguments);
                $this.trigger("valuechange.placeholder",val);
                return ;
            } else {
                return oVal.apply(this, arguments);
            }
        };
        $(function () {
            $('input[placeholder], textarea[placeholder]').placeHolder();
        })
    }

})($.support.placeHolder =  'placeholder' in document.createElement('input'));
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
