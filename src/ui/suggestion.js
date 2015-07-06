define(['./datalist'], function() {
    return $.UI.extend('suggestion', {
        options: {
            cache: false,
            optionList: '<ul class="option-list"></ul>'
        },
        _init: function (element, options) {
            this.element = $(element).attr('autocomplete', 'off');
            this.options = $.mixOptions({data: this.element}, this.constructor.defaults, this.options, options);
            var that = this;
            var dataListParam;
            if (this.options.dataList) {
                dataListParam = this.options.dataList
            } else {
                dataListParam = [this.options.optionList, {source: {source: this.options.source, type: this.options.type, cache: this.options.cache, filter: this.options.filter}}]
            }
            that.datalist = $.Object.instanceTo($.UI.DataList, dataListParam);
            this.$datalist = that.datalist.element;
            this.$datalist.dialog({attach: this.element});
            $(document).onExcept(this.element.add(this.$datalist), 'click', function () {
                that.$datalist.dialog('trigger', 'close');
            });
            that.datalist.on('rendered', function (e, data) {
                if (data.length) {
                    that.$datalist.dialog().trigger('open');
                } else that.$datalist.dialog().trigger('close');
            });
            that.element.on('dblclick', function(e){
                if (!that.$datalist.dialog().isOpened()){
                    that.datalist.trigger('query', [$.isString(that.options.data) ? $(that.options.data).serialize() : that.options.data]);
                }
            });
            that.element.on('valuechange', function (e) {
                that.datalist.val(e.newValue);
                var sendData;
                if ($.isFunction(that.options.data)){
                    sendData = that.options.data(that.element.val(), that.element);
                } else if ($.isString(that.options.data)) {
                    sendData = $(that.options.data).serialize();
                } else {
                    sendData = that.options.data;
                }
                that.datalist.trigger('query', [sendData]);
            }).on('keyup', function (e) {
                if (that.$datalist.dialog().isOpened()) {
                    that.datalist.element.trigger(e);
                }
            }).on('keydown', function (e) {
                if (e.which == 40) {
                    if (that.datalist.size()) {
                        that.$datalist.dialog().trigger('open');
                    } else
                        that.datalist.trigger('query', [$.isString(that.options.data) ? $(that.options.data).serialize() : that.options.data]);
                } else if (e.which == 13 && that.$datalist.dialog().isOpened()) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            if (this.options.onchange) {
                this.onchange = this.options.onchange;
            }
            that.on('change', function (e, data) {
                that.element.val(data.label).data('valuechangeData', data.label);
                that.$datalist.dialog().trigger('close');
            });
            that.datalist.on('change', function (e, a, b, c) {
                that.trigger(e, [a, b, c])
            })
        }

    })
})
