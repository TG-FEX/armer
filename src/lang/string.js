(function($){
    $.String = {
        byteLen: function(target) {
            /*取得一个字符串所有字节的长度。这是一个后端过来的方法，如果将一个英文字符插
             *入数据库 char、varchar、text 类型的字段时占用一个字节，而一个中文字符插入
             *时占用两个字节，为了避免插入溢出，就需要事先判断字符串的字节长度。在前端，
             *如果我们要用户填空的文本，需要字节上的长短限制，比如发短信，也要用到此方法。
             *随着浏览器普及对二进制的操作，这方法也越来越常用。
             */
            return target.replace(/[^\x00-\xff]/g, 'ci').length;
        },
        underscored: function(target) {
            //转换为下划线风格
            return target.replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/\-/g, "_").toLowerCase();
        },
        capitalize: function(target) {
            //首字母大写
            return target.charAt(0).toUpperCase() + target.substring(1).toLowerCase();
        },
        stripTags: function(target) {
            //移除字符串中的html标签，但这方法有缺陷，如里面有script标签，会把这些不该显示出来的脚本也显示出来了
            return target.replace(/<[^>]+>/g, "");
        },
        stripScripts: function(target) {
            //移除字符串中所有的 script 标签。弥补stripTags方法的缺陷。此方法应在stripTags之前调用。
            return target.replace(/<script[^>]*>([\S\s]*?)<\/script>/img, '');
        },
        unescapeHTML: function(target) {
            //还原为可被文档解析的HTML标签
            return target.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") //处理转义的中文和实体字符
                .replace(/&#([\d]+);/g, function($0, $1) {
                    return String.fromCharCode(parseInt($1, 10));
                });
        },
        escapeRegExp: function(target) {
            //http://stevenlevithan.com/regex/xregexp/
            //将字符串安全格式化为正则表达式的源码
            return(target + "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
        pad: function(target, n, filling, right, radix) {
            //http://www.cnblogs.com/rubylouvre/archive/2010/02/09/1666165.html
            //在左边补上一些字符,默认为0
            var num = target.toString(radix || 10);
            filling = filling || "0";
            while (num.length < n) {
                if (!right) {
                    num = filling + num;
                } else {
                    num += filling;
                }
            }
            return num;
        }
    };
    //字符串的原生原型方法
    ("charAt,charCodeAt,concat,indexOf,lastIndexOf,localeCompare,match," + "contains,endsWith,startsWith,repeat," + //es6
        "replace,search,slice,split,substring,toLowerCase,toLocaleLowerCase,toUpperCase,trim,toJSON").replace($.rword, function(name) {
            $.String[name] = function(obj) {
                return obj[name].apply(obj, $.slice(arguments, 1));
            };
        });
})(armer);
