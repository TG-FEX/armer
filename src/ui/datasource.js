/**
 * Created by Administrator on 2014/12/23.
 */

$.DataSource = $.EventEmitter.extend({
    options: {
        source: '', //数据源,可以是url,
        type: 'post', //如果是url时，传送的方式
        cache: false, //是否缓存
        filter: function(data){
            return data
        }
    },
    _init: function(options){
        if (typeof options != 'object') {
            options = {source: options}
        }
        this.options = $.mixOptions({}, this.constructor.defaults, this.options, options);
        this.cache = {};

        if (this.options.source) {
            if ($.type(this.options.source) == 'string') {
                this.source = function(search){
                    var source;
                    var that = this;
                    var cacheKey = JSON.toString(search);
                    var cacheTime = this.options.cache === true ? Infinity : this.options.cache;
                    if (cacheTime && this.cache[cacheKey] && ($.now() - this.cache[cacheKey].timestamp < cacheTime)) {
                        source = this.cache[cacheKey];
                    } else {
                        this.cache[cacheKey] = source = $.EventEmitter.trigger(this, 'getData', [search, this.options.source]).done(function(data){
                            that.trigger('gotData', [data])
                        });
                        source.timestamp = $.now();
                    }

                    return source;
                };
            } else if ($.isElement(this.options.source) || $.isQueryElement(this.options.source)){
                this.source = function(){ return $.when(this.constructor.fromElement(this.options.source)) };
            } else if (!$.isFunction(this.options.source)) {
                this.source = function(){ $.when(this.options.source) };
            } else {
                this.source = this.options.source;
            }
        }

    },
    query: function(search){
        var source, that = this;

        source = this.source.call(this, search);

        if (source) {
            source.done(function(source) {
                that.trigger('filter', [source, search]);
            })
        }
    },
    _getData: function(search, url){
        return $.ajax({
            url: url,
            type: 'post',
            data: search
        })
    },
    filter: function(source, filter){
        var keyword = filter;
        if ($.type('filter') != 'function') {
            keyword = null;
            filter = this.options.filter;
        }
        this.trigger('filtered', [filter.call(this, source, keyword)])
    }
}).mix({
    fromElement: function($this){
        $this = $($this);
        var $source = $this.find('option, input[type=checkbox], input[type=radio]').andSelf();
        return $.map($source, function(element){
            var forE
            if (element.id)
                forE = $('[for=' + element.id + ']')[0];
            return {label: forE ? forE.innerHTML : element.innerHTML, value: element.value == undefined ? element.innerHTML : element.value}
        })
    }
});