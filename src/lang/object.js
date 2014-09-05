(function($){
    function cloneOf(item) {
        var name = $.type(item);
        switch (name) {
            case "array":
            case "object":
                return $[name].clone(item);
            default:
                return item;
        }
    }


    function mergeOne(source, key, current) {
        //使用深拷贝方法将多个对象或数组合并成一个
        if ($.isPlainObject(source[key])) { //只处理纯JS对象，不处理window与节点
            $.Object.merge(source[key], current);
        } else {
            source[key] = cloneOf(current)
        }
        return source;
    }

    $.Object = function(mix){
        var callee = arguments.callee;
        if (this.constructor != callee && this.constructor != Object) return new callee(mix);
        if ($.isPlainObject(mix)) {
            $.extend(this, mix);
        }
    };
    $.Object.prototype = Object.prototype;
    $.Object.mix = $.extend;
    $.Object.mix({
        size: function(obj){
            return $.isArrayLike(obj) ? obj.length: Object.keys(obj).length;
        },
        /**
         * 过滤数组中不合要求的元素
         * @param {Object} obj
         * @param {Function} fn 如果返回true则放进结果集中
         * @param {*} scope ? 默认为当前遍历的元素或属性值
         * @return {array}
         */
        filter: function(obj, fn, scope) {
            for (var i = 0, n = obj.length, ret = []; i < n; i++) {
                var val = fn.call(scope || obj[i], obj[i], i);
                if (!!val) {
                    ret[ret.length] = obj[i];
                }
            }
            return ret;
        },
        subset: function(target, props) {
            //根据传入数组取当前对象相关的键值对组成一个新对象返回
            var result = {};
            props.forEach(function(prop) {
                result[prop] = target[prop];
            });
            return result;
        },
        //将参数一的键值都放入回调中执行，如果回调返回false中止遍历
        forEach: function(obj, fn) {
            Object.keys(obj).forEach(function(name) {
                fn(obj[name], name)
            })
        },
        reduce: function(obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (obj.reduce) {
                if (context) iterator = iterator.bind(context);
                return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
            }
            $.each(obj, function(index, value) {
                if (!initial) {
                    memo = value;
                    initial = true;
                } else {
                    memo = iterator.call(context, memo, value, index);
                }
            });
            if (!initial) throw new TypeError('Reduce of empty array with no initial value');
            return memo;
        },
        //将参数一的键值都放入回调中执行，收集其结果返回
        map: function(obj, fn) {
            return  Object.keys(obj).map(function(name) {
                return fn(obj[name], name)
            })
        },
        clone: function(target) {
            //进行深拷贝，返回一个新对象，如果是浅拷贝请使用$.extend
            var clone = {};
            for (var key in target) {
                clone[key] = cloneOf(target[key]);
            }
            return clone;
        },
        merge: function(target, k, v) {
            //将多个对象合并到第一个参数中或将后两个参数当作键与值加入到第一个参数
            var obj, key;
            //为目标对象添加一个键值对
            if (typeof k === "string")
                return mergeOne(target, k, v);
            //合并多个对象
            for (var i = 1, n = arguments.length; i < n; i++) {
                obj = arguments[i];
                for (key in obj) {
                    if (obj[key] !== void 0) {
                        mergeOne(target, key, obj[key]);
                    }
                }
            }
            return target;
        }
    });
    "hasOwnerProperty,isPrototypeOf,propertyIsEnumerable".replace($.rword, function(name) {
        $.Object[name] = function(obj) {
            return obj[name].apply(obj, $.slice(arguments, 1));
        };
    });
})(armer);