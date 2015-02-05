define(['./datasource'], function(){
    $.UI.extend('data-list', {
        options: {
            item: $.template('<li>[%=name%]</li>'),
            multi: false,
            onchange: function(e, i, selectElem, otherElem){
                this._data2Element(selectElem).addClass('selected');
                this._data2Element(otherElem).removeClass('selected');
            },
            onrendered: function(){
                var that = this;
                this.element.removeClass('loading');
                if (that.value == null) return;
                this._data2elementMap.forEach(function(element, obj){
                    if (that.options.multi && $.Array.containsEqual(that.value, obj)) {
                        $(element).addClass('selected')
                    } else if ($.isEqual(obj, that.value)) {
                        $(element).addClass('selected');
                        return false
                    }
                })
            },
            onfocusOption: function(e, data, elem){
                elem.addClass('focus');
                this.element.finish().animate({
                    scrollTop: this.element.scrollTop() + elem.position().top
                })
            },
            onblurOption: function(e, data, elem){
                elem.removeClass('focus')
            },
            ongetData: function(){
                this.element.addClass('loading')
            }
        },
        size: function(){
            return this._data2elementMap.size;
        },
        _init: function(element, options){
            if ($.isPlainObject(element)) {
                options = element;
                element = '<ul class="option-list"></ul>';
            }
            this.options = $.mixOptions({}, this.constructor.defaults, this.options, options);
            this.element = $(element);
            this._data2elementMap = new Map();
            var that = this;
            this.options.source = $.Object.instanceTo($.DataSource, this.options.source);
            this.options.source.on('filtered', function(e, data){
                that.trigger('render', [data]);
            }).on('getData', function(e){
                that.trigger(e);
            });
            this.element.on('click', '> *', function(){
                var selectElem = $(this);
                var data = selectElem.data('data-list-item');
                that.trigger('clickOption', [data, selectElem])
            });
            this.options.onchange && this.on('change', this.options.onchange);
            this.options.onrendered && this.on('rendered', this.options.onrendered);
            this.options.onfocusOption && this.on('focusOption', this.options.onfocusOption);
            this.options.onblurOption && this.on('blurOption', this.options.onblurOption);
            this.options.ongetData && this.on('getData', this.options.ongetData);
            if (this.options.multi) this.value = [];
            this.focusedValue = null;
            this.element.attr('tabindex', 0).on('keydown', function(e){
                e.preventDefault();
            }).on('keyup', function(e){
                var element, oldelement;
                if (that.size()) {
                    if (e.which == 13 && that.focusedValue) {
                        that._clickOption(that.focusedValue);
                    }
                    if (e.which == 40 || e.which == 38) {
                        if (!that.focusedValue) {
                            element = that.element.find('> *').first();
                        } else {
                            oldelement = that._data2Element([that.focusedValue]);
                            switch(e.which) {
                                case 40: {
                                    element = oldelement.next();
                                    if (!element.length) element = that.element.find('> *').first();
                                    break;
                                }
                                case 38: {
                                    element = oldelement.prev();
                                    if (!element.length) element = that.element.find('> *').last();
                                }
                            }
                        }
                        if (oldelement) {
                            that.trigger('blurOption', [null, oldelement]);
                        }
                        if (element) {
                            that.trigger('focusOption', [element.data('data-list-item'), element]);
                        }
                        return false;
                    }
                }
            })
            this.val(this.options.value);
        },
        _focusOption: function(data){
            this.focusedValue = data;
        },
        _select: function(value, data){
            if (this.options.multi) {
                value.push(data)
            } else value = data;
            return value;
        },
        toggle: function(data, toggle){
            var has = this.options.multi ? $.Array.containsEqual(this.value, data) : $.isEqual(this.value, data);
            toggle = toggle == null ? !has : toggle;
            if (has == toggle) return;
            this.trigger('change', [this.options.multi ? this._select(this.value, data) : data, toggle ? [data] : [], toggle ? [] : [data]])
        },
        valueOf: function(){
            return this.value
        },
        select: function(data){
            this.toggle(data, true);
        },
        unselect: function(){
            this.toggle(data, false);
        },
        _unselect: function(value, data){
            if (this.options.multi) {
                var index = $.Array.indexOfEqual(value, data);
                value.splice(index, 1);

            } else value = undefined;
            return value;
        },
        val: function(value){
            if (value) this.value = value;
            else return this.value;
        },
        _change: function(value){
            this.value = value;
        },
        _getDataOfElement: function(data) {
            return this.element.children().map(function(){
                if ($(this).data('data-list-item')) return this;
            }).eq(0);
        },
        _clickOption: function(data){
            var that = this, e;

            if (that.options.multi) {
                var has = $.Array.containsEqual(that.value, data);
                e = $.Event(has ? 'unselect' : 'select');
                this.trigger(e, [that.value.slice(0), data]);
                if (!e.isDefaultPrevented()) {
                    this.trigger('change', [e.actionReturns, has ? [] : [data], has ? [data] : []]);
                }
            } else if (!$.isEqual(that.value, data)) {
                var eu = $.Event('unselect');
                e = $.Event('select');
                if (that.value) this.trigger(eu, [that.value]);
                if (!eu.isDefaultPrevented())
                    this.trigger(e, [eu.actionReturns, data]);
                if (!e.isDefaultPrevented())
                    this.trigger('change', [e.actionReturns, [data], [that.value]]);
            }
        },
        _data2Element: function(dataList){
            var that = this;
            var g = $();
            dataList.forEach(function(item){
                that._data2elementMap.forEach(function(obj, key){
                    if ($.isEqual(key, item)) {
                        g = g.add(obj)
                    }
                });
            });
            return g;
        },
        query: function(search){
            this.options.source.query(search)
        },
        _render: function(data){
            var that = this;
            that.focusedValue = null;
            this.element.empty().scrollTop(0);
            that._data2elementMap.clear();
            data.forEach(function(item){
                that._data2elementMap['set'](item, $($.toTemplate(that.options.item)(item)).data('data-list-item', item).appendTo(that.element)[0]);
            });
            that.trigger('rendered', [data]);
        }
    });

})
