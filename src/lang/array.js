;(function($){
    $.Array = $.extend($.Array, {
        // 判断数组是否包含相同的目标
        containsEqual: function(value, data){
            return value.some(function(item){
                return $.isEqual(item, data)
            });
        },
        // 根据条件查找数组下标
        findIndexOf: function(value, iterator){
            var ret = -1;
            $.each(value, function(i, item){
                if (iterator.call(value, item)) {
                    ret = i;
                    return false;
                }
            });
            return ret;
        },
        // 查找第一个与value相同的下标
        indexOfEqual: function(value, data){
            return $.Array.findIndexOf(value, function(item){
                return $.isEqual(item, data)
            })
        },
        contains: function(target, item) {
            //判定数组是否包含指定目标。
            return !!~target.indexOf(item);
        },
        shuffle: function(target) {
            //对数组进行洗牌。若不想影响原数组，可以先拷贝一份出来操作。
            var ret = [],
                i = target.length,
                n;
            target = target.slice(0);
            while (--i >= 0) {
                n = Math.floor(Math.random() * i);
                ret[ret.length] = target[n];
                target[n] = target[i];
            }
            return ret;
        },
        random: function(target) {
            //从数组中随机抽选一个元素出来。
            return $.Array.shuffle(target.concat())[0];
        },
        flatten: function(target) {
            //对数组进行平坦化处理，返回一个一维的新数组。
            var result = [],
                self = $.Array.flatten;
            target.forEach(function(item) {
                if (Array.isArray(item)) {
                    result = result.concat(self(item));
                } else {
                    result.push(item);
                }
            });
            return result;
        },
        compact: function(target) {
            // 过滤数组中的null与undefined，但不影响原数组。
            return target.filter(function(el) {
                return el != null;
            });
        },
        /**
         * 对数组进行去重操作，返回一个没有重复元素的新数组。
         * @param {Array} target 目标数组
         * @returns {Array}
         */
        unique: function(target) {
            var ret = [],
                n = target.length,
                i, j; //by abcd
            for (i = 0; i < n; i++) {
                for (j = i + 1; j < n; j++)
                    if (target[i] === target[j])
                        j = ++i;
                ret.push(target[i]);
            }
            return ret;
        },
        /**
         * 合并两个数组
         * @param {Array} first 第一个数组
         * @param {Array} second 第二个数组
         * @returns {Array}
         */
        merge: function(first, second) {
            //合并参数二到参数一
            var i = ~~first.length,
                j = 0;
            for (var n = second.length; j < n; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },
        /**
         * 对两个数组取并集。
         * @param {Array} target 第一个数组
         * @param {Array} array 第二个数组
         * @returns {Array}
         */
        union: function(target, array) {
            return $.Array.unique($.Array.merge(target, array));
        },
        /**
         * 对两个数组取交集
         * @param {Array} target 第一个数组
         * @param {Array} array 第二个数组
         * @returns {Array}
         */
        intersect: function(target, array) {
            return target.filter(function(n) {
                return ~array.indexOf(n);
            });
        },
        /**
         * 对两个数组取差集(补集)
         * @param {Array} target 第一个数组
         * @param {Array} array 第二个数组
         * @returns {Array}
         */
        diff: function(target, array) {
            var result = target.slice();
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < array.length; j++) {
                    if (result[i] === array[j]) {
                        result.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            return result;
        },
        /**
         * 返回数组中的最小值，用于数字数组。
         * @param {Array} target 目标数组
         * @returns {Number}
         */
        min: function(target) {
            return Math.min.apply(0, target);
        },
        /**
         * 返回数组中的最大值，用于数字数组。
         * @param {Array} target 目标数组
         * @returns {Number}
         */
        max: function(target) {
            return Math.max.apply(0, target);
        },
        /**
         * 深拷贝当前数组
         * @param {Array} target 目标数组
         * @returns {Array}
         */
        clone: function(target) {
            var i = target.length,
                result = [];
            while (i--)
                result[i] = $.cloneOf(target[i]);
            return result;
        },
        remove: function(target, obj){
            var i = target.indexOf(obj);
            if (i>=0) target.splice(i, 1);
        },
        inGroupsOf: function(target, number, fillWith) {
            //将数组划分成N个分组，其中小组有number个数，最后一组可能小于number个数,
            //但如果第三个参数不为undefined时,我们可以拿它来填空最后一组
            var t = target.length,
                n = Math.ceil(t / number),
                fill = fillWith !== void 0,
                groups = [],
                i, j, cur;
            for (i = 0; i < n; i++) {
                groups[i] = [];
                for (j = 0; j < number; j++) {
                    cur = i * number + j;
                    if (cur === t) {
                        if (fill) {
                            groups[i][j] = fillWith;
                        }
                    } else {
                        groups[i][j] = target[cur];
                    }
                }
            }
            return groups;
        }
    });
    ("concat,join,pop,push,shift,slice,sort,reverse,splice,unshift," + "indexOf,lastIndexOf,every,some,filter,reduce,reduceRight").replace($.rword, function(name) {
        $.Array[name] = function(obj) {
            return obj[name].apply(obj, $.slice(arguments, 1));
        };
    });
})(armer);