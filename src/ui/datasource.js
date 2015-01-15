/**
 * Created by Administrator on 2014/12/23.
 */
$.EventEmitter.trigger =  function(emitter, type){
    var args = [].slice.call(arguments, 2);
    var e = $.Event(type);
    args.unshift(e);
    emitter.trigger.apply(emitter, args);
    return e.actionReturns;
};
$.DataSource = $.EventEmitter.extend({
    options: {
        source: '',
        type: 'post',
        requireOnce: false,
        filter: function(data){
            return data
        }
    },
    _init: function(options){
        this.options = $.mixOptions({}, this.constructor.defaults, this.options, options);

        if (this.options.source) {
            console.log(this.options.source);
            if ($.type(this.options.source) == 'string') {
                this.url = this.options.source;
            } else this.source = $.when(this.options.source);
        }

    },
    query: function(search){
        var source, that = this;
        if (!this.source) {
            source = $.EventEmitter.trigger(this, 'getdata', [search]).done(function(data){
                that.trigger('gotdata', [data]);
            });
            if (this.options.requireOnce) this.source = source;
        } else
            source = this.source;
        if (source) {
            source.done(function(source) {
                that.trigger('filter', [source, search]);
            })
        }
    },
    _getdata: function(search){
        console.log(this.url);
        return $.ajax({
            url: this.url,
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
});