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


    this.VBClass || (function(window){
        /*! (C) WebReflection - Mit Style License */
        window.VBClass = function VBClass(name, definition) {
            var
                proto = [],
                properties = [],
                compile = [
                    "Class VB_" + name,
                    "", // properties
                    ""  // constructor
                ],
                current, key, i, tmp
                ;
            for (i = hiddenProperties.length; i--;) {
                key = hiddenProperties[i];
                if (hasOwnProperty.call(definition, key)) {
                    proto.push(key);
                }
            }
            for (key in definition) {
                if (hasOwnProperty.call(definition, key) && !indexOf(proto, key)) {
                    proto.push(key);
                }
            }
            for (i = proto.length; i--;) {
                if ("constructor" != (key = proto[i])) {
                    current = definition[key];
                    if (hasOwnProperty.call(current, "value")) {
                        if (typeof(current = current.value) == "function") {
                            (function(callback, result){
                                VBClass_bridge["VB_typeMethod_" + name + "_" + key] = function (vb) {
                                    switch(typeof(result = callback.apply(vb, slice.call(arguments, 1)))) {
                                        case "object":
                                        case "unknown":
                                        case "function":
                                            if (result) {
                                                return 1;
                                            }
                                    }
                                    return 0;
                                };
                                VBClass_bridge["VB_valueMethod_" + name + "_" + key] = function() {
                                    return result;
                                };
                            }(current));
                            tmp = createArguments(current.length);
                            compile.push(
                                "Public Function " + key + "(" + tmp.slice(3) + ")",
                                "If VBClass_bridge.VB_typeMethod_" + name + "_" + key + "(" + tmp + ") = 1 Then",
                                "Set " + key + " = VBClass_bridge.VB_valueMethod_" + name + "_" + key + "()",
                                "Else",
                                key + " = VBClass_bridge.VB_valueMethod_" + name + "_" + key + "()",
                                "End If",
                                "End Function"
                            );
                        } else {
                            properties.push(key);
                            compile.push(
                                "Public Property Get " + key,
                                "If VB_type_" + key + " = 1 Then",
                                "Set " + key + " = VB_value_" + key,
                                "Else",
                                key + " = VB_value_" + key,
                                "End If",
                                "End Property",
                                "Public Property Let " + key + "(value)",
                                "VB_value_" + key + " = value",
                                "VB_type_" + key + " = 0",
                                "End Property",
                                "Public Property Set " + key + "(value)",
                                "Set VB_value_" + key + " = value",
                                "VB_type_" + key + " = 1",
                                "End Property"
                            );
                        }
                    } else {
                        if (hasOwnProperty.call(current, "get")) {
                            (function(callback, result){
                                VBClass_bridge["VB_typeGet_" + name + "_" + key] = function (vb) {
                                    switch(typeof(result = callback.call(vb))) {
                                        case "object":
                                        case "unknown":
                                        case "function":
                                            if (result) {
                                                return 1;
                                            }
                                    }
                                    return 0;
                                };
                                VBClass_bridge["VB_valueGet_" + name + "_" + key] = function() {
                                    return result;
                                };
                            }(current.get));
                            compile.push(
                                "Public Property Get " + key,
                                "If VBClass_bridge.VB_typeGet_" + name + "_" + key + "(me) = 1 Then",
                                "Set " + key + " = VBClass_bridge.VB_valueGet_" + name + "_" + key + "()",
                                "Else",
                                key + " = VBClass_bridge.VB_valueGet_" + name + "_" + key + "()",
                                "End If",
                                "End Property"
                            );
                        }
                        if (hasOwnProperty.call(current, "set")) {
                            (function(callback){
                                VBClass_bridge["VB_valueSet_" + name + "_" + key] = function(vb, value) {
                                    callback.call(vb, value);
                                };
                            }(current.set));
                            compile.push(
                                "Public Property Let " + key + "(value)",
                                "VBClass_bridge.VB_valueSet_" + name + "_" + key + " me, value",
                                "End Property",
                                "Public Property Set " + key + "(value)",
                                "VBClass_bridge.VB_valueSet_" + name + "_" + key + " me, value",
                                "End Property"
                            );
                        }
                    }
                }
            }
            compile.push(
                "End Class",
                "Function VB_" + name + "_Factory",
                "Set VB_" + name + "_Factory = New VB_" + name,
                "End Function"
            );
            if (i = properties.length) {
                current = ["Private Sub Class_Initialize"];
                while (i--) {
                    key = properties[i];
                    VBClass_bridge["VB_Class_" + name] = {};
                    switch (typeof(
                        VBClass_bridge["VB_Class_" + name][key] = definition[key].value
                    )) {
                        case "object":
                        case "unknown":
                        case "function":
                            if (definition[key].value) {
                                current.push(
                                    "Set VB_value_" + key + " = VBClass_bridge.VB_Class_" + name + "." + key,
                                    "VB_type_" + key + " = 1"
                                );
                                break;
                            }
                        default:
                            current.push(
                                "VB_value_" + key + " = VBClass_bridge.VB_Class_" + name + "." + key,
                                "VB_type_" + key + " = 0"
                            );
                            break;
                    }
                    properties[i] = "Private VB_type_" + key + "\nPrivate VB_value_" + key;
                }
                current.push("End Sub");
                compile[1] = properties.join("\n");
                compile[2] = current.join("\n");
            }
            execScript(compile.join("\n"), "VBScript");
            return (window[name] = function(VBFactory, constructor){
                return constructor ?
                    function VBClass() {
                        var object = window[VBFactory]();
                        constructor.apply(object, arguments);
                        return object;
                    } :
                    function VBClass() {
                        return window[VBFactory]();
                    }
                    ;
            }(
                "VB_" + name + "_Factory",
                hasOwnProperty.call(definition, "constructor") && definition.constructor.value
            ));
        };

        function constructor() {}

        function createArguments(length) {
            var $arguments = [];
            while (length--) {
                $arguments.push("a" + length);
            }
            $arguments.push("me");
            return $arguments.reverse().join(",");
        }

        function indexOf(proto, key) {
            for (var i = proto.length; i-- && proto[i] !== key;);
            return ~i;
        }

        var
            hiddenProperties = "hasOwnProperty.isPrototypeOf.propertyIsEnumerable.toLocaleString.toString.valueOf".split("."),
            hasOwnProperty = {}.hasOwnProperty,
            slice = [].slice
            ;

        window.VBClass_bridge = {};

    }(this));


    this.VBClass || (function(window){
        /*! (C) WebReflection - Mit Style License */
        var
            Object = window.Object,
            hasOwnProperty = {}.hasOwnProperty,
            create = Object.create,
            freeze = Object.preventExtensions || Object.freeze || Object.seal || function() {}
            ;
        window.VBClass = function VBClass(name, definition) {
            if (hasOwnProperty.call(window, name)) {
                throw "Class redefined";
            }
            var
                creator = {},
                current, key
                ;
            for (key in definition) {
                if (hasOwnProperty.call(definition, key) && key != "constructor") {
                    current = definition[key];
                    creator[key] = {
                        enumerable: true,
                        configurable: false
                    };
                    if (hasOwnProperty.call(current, "value")) {
                        if (typeof(creator[key].value = current.value) != "function") {
                            creator[key].writable = true;
                        }
                    } else {
                        if (hasOwnProperty.call(current, "get")) {
                            creator[key].get = current.get;
                        }
                        if (hasOwnProperty.call(current, "set")) {
                            creator[key].set = current.set;
                        }
                    }
                }
            }
            return (window[name] = function(freeze, create, creator, constructor){
                return constructor ?
                    function VBClass() {
                        var object = create(null, creator);
                        constructor.apply(object, arguments);
                        freeze(object);
                        return object;
                    } :
                    function VBClass() {
                        var object = create(null, creator);
                        freeze(object);
                        return object;
                    }
                    ;
            }(
                freeze, create, creator,
                hasOwnProperty.call(definition, "constructor") && definition.constructor.value
            ));
        };
    }(this));

})(armer);
