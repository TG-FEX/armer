;(function($){
    $.Number = {
        limit: function(target, n1, n2) {
            //确保数值在[n1,n2]闭区间之内,如果超出限界,则置换为离它最近的最大值或最小值
            var a = [n1, n2].sort();
            if (target < a[0])
                target = a[0];
            if (target > a[1])
                target = a[1];
            return target;
        },
        nearer: function(target, n1, n2) {
            //求出距离指定数值最近的那个数
            var diff1 = Math.abs(target - n1),
                diff2 = Math.abs(target - n2);
            return diff1 < diff2 ? n1 : n2
        },
        round: function(target, base) {
            //http://www.cnblogs.com/xiao-yao/archive/2012/09/11/2680424.html
            if (base) {
                base = Math.pow(10, base);
                return Math.round(target * base) / base;
            } else {
                return Math.round(target);
            }
        }
    };
    "abs,acos,asin,atan,atan2,ceil,cos,exp,floor,log,pow,sin,sqrt,tan".replace($.rword, function(name) {
        $.Number[name] = Math[name];
    });
    "toFixed,toExponential,toPrecision,toJSON".replace($.rword, function(name) {
        $.Number[name] = function(obj) {
            return obj[name].apply(obj, $.slice(arguments, 1));
        };
    });
})(armer)