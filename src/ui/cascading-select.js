define(function(){
    $.UI.extend('serialize-select', {
        options: {
            url: '',
            maxLevel: 4,
            data: function(parent_id, level){
                return {
                    parent: parent_id,
                    level: level
                }
            }
        },
        init: function(element, options){
            var that = this;
            this.element = element
            this.options = $.mixOptions({}, this.element.data(), this.options, options);
            this.select = $();
            this.container = $('<span class="serialize-select"></span>');
        },

        val: function(){

        },
        _select: function(id, level){
            this.clearSelect(level);
        }
        _change: function(){

        },
        _clearSelect(level) {
        this.select.slice(level).remove();
        this.select.splice(level);
    },
    _addSelect: function(data){
        var that = this;
        $('<select>').change(function(){
            that.trigger('select', [data.id, data.level]);
        }).data(data);
    }

});