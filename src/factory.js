(function($){

    $.factory = function(constructor, prototype, base){
        var basePrototype;
        if (!$.isFunction(constructor)) {
            base = prototype;
            prototype = constructor;
            constructor = $.own(prototype, 'constructor') || function(){
                var callee = arguments.callee;
                if (!(this instanceof callee)) {return $.applyConstr(callee, arguments)}
                this.constructor = callee;
                if (this._init) {
                    return this._init.apply(this, [].slice.call(arguments));
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

        // 如果 base报错，具体方法待定
        var baseInit = base.prototype._init
        base.prototype._init = null;
        var tmp = base.prototype;
        try{
            basePrototype = new base();
        } catch(e){
            base = function(){};
            base.prototype = tmp;
            basePrototype = new base();
        }
        base.prototype._init = baseInit;
        var options = $.mixOptions( {}, basePrototype.options, prototype.options);

        $.each(prototype, function(prop, value){
            if ($.isFunction(value)) {
                basePrototype[prop] = (function () {
                    var _super = function () {
                        return base.prototype[prop].apply(this, arguments);
                    }, _superApply = function (args) {
                        return base.prototype[prop].apply(this, args);
                    }, fn = function () {
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
                    fn.toString = function () {
                        return value.toString();
                    }
                    return fn;
                })();
            } else {
                basePrototype[prop] = value;
            }
        });
        constructor.prototype = $.extend(basePrototype, {
            options: options,
            inherit: base
        });
        constructor.extend = base.extend;
        constructor.mix = base.mix;
        return constructor
    };

    $.Object.extend = $.factory;
    if ($.EventEmitter) $.EventEmitter.extend = $.factory;

})(armer);
