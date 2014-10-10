(function($){

    $.factory = function(constructor, prototype, base){
        var basePrototype;
        if (!$.isFunction(constructor)) {
            base = prototype;
            prototype = constructor;
            constructor = $.own(prototype, 'constructor') || function(a, b, c, d, e, f){
                var callee = arguments.callee, prototype = callee.prototype;
                if (!(this instanceof callee)) {return new callee(a, b, c, d, e, f)}
                this.constructor = callee;
                if (this._init) {
                    this._init(a, b, c, d, e, f);
                }
            };
        }
        if (!$.isPlainObject(prototype)) {
            base = prototype;
            prototype = {}
        }
        if (!base) {
            base = $.own(prototype, 'inherit') || this;
        }

        basePrototype = new base();
        basePrototype.options = $.mixOptions( {}, basePrototype.options );

        $.each(prototype, function(prop, value){
            if (!$.isFunction(value)) {
                basePrototype[prop] = value;
                return;
            }
            basePrototype[prop] = (function(){
                var _super = function(){
                    return base.prototype[prop].apply(this, arguments);
                }, _superApply = function(args) {
                    return base.prototype[prop].apply(this, args);
                }, fn = function(){
                    var __super = this._super,
                        __superApply = this._superApply,
                        returnValue;
                    this._super = _super;
                    this._superApply = _superApply;
                    returnValue = value.apply(this, arguments);
                    this._super = __super;
                    this._superApply = __superApply;
                    return returnValue;
                }
                fn.toString = function(){
                    return value.toString();
                }
                return fn;
            })();
            constructor.prototype = $.extend(basePrototype, {
                inherit: base
            });
        });
        constructor.prototype = basePrototype;
        constructor.extend = base.extend;
        constructor.mix = base.mix;
        return constructor
    };

    $.Object.extend = $.factory;
    if ($.EventEmitter) $.EventEmitter.extend = $.factory

})(armer);
