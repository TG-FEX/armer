define(['./datalist'], function(){

    $.fn.replaceAllWith = function(r){
        this.slice(1).remove();
        this.eq(0).replaceWith(r);
        return this;
    }


    $.UI.extend('select', {
        options: {
            output: '<span class="select"></span>',
            optionList: '<ul class="option-list"></ul>'
        },
        _init: function(element, options){
            this.element = element;
            this.options = $.mixOptions({}, this.constructor.defaults, this.options, options);
            this.output = $(this.options.output).attr('tabindex', 0);
            this.name= this.element.attr('name');
            this.input = $('<input type="hidden" ' + (this.name ? ('name="' + this.name + '"') : '') + '>');
            this.output.insertAfter(this.element);
            this.element.replaceWith(this.input);
            var that = this, value;
            var dataListParam;
            if (this.options.dataList) {
                dataListParam = this.options.dataList
            } else {
                var options = this.element.find('option');
                var multi = this.element.attr('multiple');
                var selected = $.map(options.filter('[selected]'), function(element){
                    return {name: element.name || element.innerHTML, value: element.value}
                });
                dataListParam = [this.options.optionList, {
                    multi: !!multi,
                    value: multi ? selected : selected[0],
                    source: {
                        source: $.map(options, function(element){
                            return {name: element.name || element.innerHTML, value: element.value}
                        })
                    }
                }]
            }
            that.datalist = $.Object.instanceTo($.UI.DataList, dataListParam);
            this.$datalist = that.datalist.element.dialog({attach: this.output});
            that.datalist.val() && this._change(dataListParam.multi ? [that.datalist.val()]: that.datalist.val());
            $(document).onExcept(this.output.add(this.$datalist), 'click', function(){
                that.$datalist.dialog('trigger', 'close');
            });
            that.datalist.query('');
            this.output.on('click focus', function(){
                that.$datalist.dialog().trigger('open');
            }).on('keyup', function(e){
                that.datalist.element.trigger(e);
            }).on('keydown', function(e){
                if (e.which == 40) {
                    if (that.datalist.size()) {
                        that.$datalist.dialog().trigger('open');
                    } else
                        that.datalist.trigger('query', [{key: that.element.val()}]);
                }
            });
            that.on('change', function(e, data){

            })
            that.datalist.on('change', function(e, a, b, c){
                that.trigger(e, [a, b, c])
            })
        },
        _change: function(data) {
            var val = [], str = [];
            var that = this;
            if (this.datalist.options.multi) {
                data.forEach(function(item){
                    str.push(item.name);
                    val.push(item.value);
                });
            } else {
                str.push(data.name);
                val.push(data.value);
                this.$datalist.dialog().trigger('close');
            }
            this.output.html(str.join(','));
            var inputStr = val.map(function(item){return '<input type="hidden" ' + (that.name ? ('name="' + that.name + '"') : '') + ' value="' + item +'"></input>'});
            if (!inputStr.length) inputStr = ['<input type="hidden" ' + (that.name ? ('name="' + that.name + '"') : '') + '>'];
            var r = $(inputStr.join(''));
            this.input.replaceAllWith(r);
            this.input = r;
        }
    });
})
