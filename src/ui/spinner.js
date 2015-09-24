$.UI.extend('spinner', {
    _init: function(element, options){

        var that= this;
        this.element = $(element);
        this.options = $.extend({}, this.constructor.defaults, this.element.data(), options);
        this.output = $('<span><a class="btn-spinup" href="javascript:">-</a><input  type="text"/><a class="btn-spindown" href="javascript:">+</a></span>');
        this._input = this.output.find('input');
        this.output.addClass(this.options.classes);

        var tmp;
        this.output.on('click', 'a', function(){
            var $this = $(this);
            var klass = $this.attr('class');
            that.trigger(!~klass.indexOf('up') ? 'spinup' : 'spindown');
        });
        this._input.valuechange(function(e, newValue, oldValue){
            if (newValue === '') {
                tmp = oldValue;
                return;
            }
            that.trigger('validate', [newValue, that.oldValue]);
        }).blur(function(){
            if (this.value === '') {
                that.trigger('validate', [this.value, that.oldValue]);
            }
        }).on('keyup', function(e){
            if (e.which == 38) {
                that.spinup();
                this.select();
                return false;
            } else if (e.which == 40) {
                that.spindown();
                this.select();
                return false;
            }
        });
        this.element.after(this.output);
        this.on('invalid overflow', function(e, _, oldValue){
            that._input.val(oldValue);
        });
        this.editable(this.options.editable);
        this.val(this.element.val());
    },
    editable: function(editable){
        this._input.prop('readonly', !editable);
    },
    spin: function(down){
        var oldValue = this._input.val();
        var step = 0;
        if (down) step = -this.options.step;
        else step = +this.options.step;
        if (step)  this.trigger('validate', [step + +oldValue, oldValue]);
    },
    spinup: function(){
        return this.spin();
    },
    spindown: function(){
        return this.spin(true);
    },
    _change: function(newValue){
        this._input.val(newValue);
        this.element.val(newValue);
        this.oldValue = newValue;
    },
    change: function(newValue){
        this._change(newValue);
    },
    val: function(newValue){
        if (newValue != null) this.validate(newValue, this.oldValue);
        else return this.element.val();
    },
    _validate: function(newValue, oldValue){
        var that = this;
        var val = +newValue;
        if (isNaN(val) || newValue === '') {
            that.trigger('invalid', [newValue, oldValue]);
        } else if (val < that.options.min || val > that.options.max) {
            that.trigger('overflow', [val, oldValue]);
        } else if (!$.isEqual(val, oldValue))
            this.trigger('change', [val, oldValue]);
    },
    validate: function(newValue, oldValue){
        var that = this;
        var val = +newValue;
        if (isNaN(val) || newValue === '') {
            that.trigger('invalid', [newValue, oldValue]);
        } else if (val < that.options.min || val > that.options.max) {
            that.trigger('overflow', [val, oldValue]);
        } else if (!$.isEqual(val, oldValue))
            this._change(val, oldValue);
    }
}).mix({
    defaults: {
        classes: 'spinner',
        min: 1,
        max: 99,
        step: 1,
        editable: true,
        oninvalid: function(){
            this.output.addClass('invalid');
        },
        onoverflow: function(){
            this.output.addClass('overflow');
        },
        onchange: function(){
            this.output.removeClass('invalid overflow');
        }
    }
})