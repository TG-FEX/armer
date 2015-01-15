$.Store = (function(){
    function serialize(value){
        return JSON.stringify(value)
    }
    function deserialize(value){
        var result;
        if (typeof value != 'string') result = value;
        try {
            result = JSON.parse(value)
        } catch(e) {}
        // 不是对象的时候，将其值为空对象
        if (!$.isPlainObject(result)) result = {}
        return result
    }
    return $.EventEmitter.extend({
        _init: function(_key, triggerItself){
            this._key = _key;
            this._triggerItself = !!triggerItself;
            this._list = deserialize(localStorage.getItem(this._key));
            this.bind();
        },
        'get': function(key){
            if (key)
                return $.cloneOf(this._list[key]);
            // 先备份一下，以免被误改
            else return $.cloneOf(this._list);
        },
        bind: function(){
            //Chrome下(14.0.794.0)重写了document.domain之后会导致onstorage不触发
            //支持localStorage的情况
            var callback = this._callback.bind(this);
            if ('onstorage' in document) {
                // IE绑到document;
                document.attachEvent("onstorage", callback)
            } else if ($.support.localStorage) {
                // 标准浏览器绑到window;
                window.addEventListener("storage", callback)
            } else if (this.userTicker) {
                // 先刨个坑
            } else {
                // IE678
                window.attachEvent('onfocus', callback)
            }
        },
        _callback: function(e){
            var that = this;
            //IE下不使用setTimeout竟然获取不到改变后的值?!
            $.nextTick(function(){
                e = e || window.storageEvent
                //若变化的key不是绑定的key，则过滤掉
                //IE下不支持key属性,因此需要根据storage中的数据判断key中的数据是否变化
                if (e.key && that._key != e.key) return
                //获取新的值
                var result = that._testAndSet(deserialize(e.newValue || localStorage.getItem(that._key)));
                if (that._isChange(result)) {
                    that.trigger('change', result)
                }
            });
        },
        'set': function(hash, triggerItself){
            var key, isNew = true, value;
            var that = this;
            if ($.type(hash) == 'string') {
                key = hash;
                value = triggerItself;
                triggerItself = arguments[2];
                hash = {}
                hash[key] = value
                isNew = false
                // 如果不是这个hash传递的话，只修改某个字段
            }
            triggerItself = triggerItself == null ? this._triggerItself : triggerItself;
            var result = this._testAndSet(hash, isNew);
            if (this._isChange(result)) {
                triggerItself && this.trigger('change', result);
                // 延迟渲染，以免阻塞
                $.nextTick(function () {
                    localStorage.setItem(that._key, serialize(result[2]))
                })
            }
        },
        _isChange: function(result){
            return !$.isEmptyObject(result[0]) || !$.isEmptyObject(result[1])
        },
        // 比较新旧数据的差异
        _testAndSet: function(valueHash, isNew){
            var i, newValue = {}, oldValue = {}, mix
            if (isNew) mix = $.mix({}, valueHash, this._list)
            else mix = valueHash
            for (i in mix) {
                if (mix.hasOwnProperty(i) && !$.isEqual(this._list[i], valueHash[i])) {
                    // 如果不相等则赋值
                    oldValue[i] = this._list[i];
                    console.log(i)
                    console.log(valueHash.hasOwnProperty(i))
                    if (valueHash.hasOwnProperty(i)) this._list[i] = newValue[i] = $.cloneOf(valueHash[i]);
                    else delete this._list[i]
                }
            }
            return [newValue, oldValue, this._list]
        }
    })
})();
$.store = new $.Store('default-store');
