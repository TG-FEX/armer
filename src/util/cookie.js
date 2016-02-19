$.Cookie = (function(){
    return $.EventEmitter.extend({
        _init: function(){
            this._list = $.unserialize(document.cookie, ';', '=');
        },
        'get': function(key){
            if (key)
                return $.cloneOf(this._list[key]);
            // 先备份一下，以免被误改
            else return $.cloneOf(this._list);
        },
        'set': function(hash, value, options){
            var that = this;
            var key, isNew = true;
            options = options || {
                path: '/'
            };
            if ($.type(hash) == 'string') {
                key = hash;
                hash = {}
                hash[key] = value
                isNew = value == null
            }
            if ('expires' in hash) {
                options.expires = hash.expires;
                delete hash.expires;
            }
            if ('path' in hash) {
                options.path = hash.path;
                delete hash.path;
            }
            if ('domain' in hash) {
                options.domain = hash.domain;
                delete hash.domain
            }
            var result = this._testAndSet(hash, isNew);
            if (this._isChange(result)) {
                // 延迟渲染，以免阻塞
                $.nextTick(function () {
                    $.each(result[0], function(i, item){
                        var s = {};
                        s[i] = item;
                        document.cookie = $.serialize(s, ';', '=') + '; ' + $.serialize(options, ';', '=', ',', false);
                    });
                })
            }
        },
        _isChange: function(result){
            return !$.isEmptyObject(result[0]) || !$.isEmptyObject(result[1])
        },
        _testAndSet: function(valueHash, isNew){
            var i, newValue = {}, oldValue = {}, mix
            if (isNew) mix = $.mix({}, valueHash, this._list)
            else mix = valueHash
            for (i in mix) {
                if (mix.hasOwnProperty(i) && !$.isEqual(this._list[i], valueHash[i])) {
                    // 如果不相等则赋值

                    oldValue[i] = this._list[i];

                    if (valueHash.hasOwnProperty(i)) this._list[i] = newValue[i] = $.cloneOf(valueHash[i]);
                    else if (isNew) {
                        this.del(i)
                    }
                }
            }
            return [newValue, oldValue, this._list]
        },
        del: function(keys){
            var list = this._list;
            if ($.isString(keys)) {
                keys = [keys];
            }
            keys = $.oneObject(keys, 'delete');
            $.each(keys, function(key){
                delete list[key];
            })
            document.cookie = $.serialize(keys, ';', '=') + '; ' +  $.serialize({
                expires: (new Date($.now() - 10000)).toUTCString()
            }, ';', '=', ',', false)

        }

    })
})();
$.cookie = new $.Cookie;