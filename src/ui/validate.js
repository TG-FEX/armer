(function(){
    var s = function(){
        $(this).data('after-submit', true);
    }
    var INSTANCE_STR = 'validate-instance';
    $.UI.extend('validate', {
        options: {
            condition: function(){}, // 校验的条件，可以是function，deferred，url，reg
            message: {
                error: "测试一下"
            }, // 校验的信息，可以是function，是function的情况会返回其返回值，是obj会通过hash查询
            onerror: function(){},
            onpass: function(){},
            onvalid: function(){},
            onshowError: function(){},
            obstruct: false, // 校验未返回结果时阻塞再次校验
            stopValidateWhenError: true, // 异常时不再检测
            bindTiming: 0 // 绑定表单值变化校验的时机，0：不绑定表单元素，1: 在表单第一次提交后绑定，2: 初始化时绑定
        },
        _init: function(element, options) {
            var that = this;
            element = $(element)
            var instance = element.data('INSTANCE_STR');
            if (instance) return instance;
            this.options = $.mixOptions({form: element.closest('form')}, this.options, element.data(), options);
            this.element = this.options.form.find('[name="' + element.attr('name') + '"]').data(INSTANCE_STR, this);
            this.form = $(this.options.form).off('submit', s).one('submit', s);
            this.options.onerror && this.on('error', this.options.onerror);
            this.options.onpass && this.on('pass', this.options.onpass);
            this.options.onvalid && this.on('valid', this.options.onvalid);
            this.options.onshowError && this.on('showError', this.options.onshowError);
            this.validating = false;
            this.bindTiming = this.options.bindTiming;
            //this._lockform = function(e){return false};

            var bind = function () {
                that.element.on('change', function () {
                    that.trigger('valid');
                });
                bind = null;
            }
            if (this.bindTiming == 2 || this.form.data('after-submit') && this.bindTiming == 1) {
                bind();
            }
            this.form.on('submit.validate', function (e) {
                if (bind && that.bindTiming == 1) {
                    bind();
                }
                if (that.element.is(':disabled *, :disabled')) return;

                // 非异步的
                that.valid(true).fail(function(){
                    if (that.options.stopValidateWhenError) {
                        e.stopImmediatePropagation();
                    }
                    e.preventDefault();
                }).done(function(){});
            })
        },
        _check: function (oCondition, sync) {
            var e, condition;
            if ($.isString(oCondition) && this.constructor.condition[oCondition]) {
                condition = this.constructor.condition[oCondition];
            } else {
                condition = oCondition;
            }
            var dfd = $.Deferred();
            var ajaxConfig = {
                url: condition,
                //dataType: "text",
                data: $.serializeNodes(this.element),
                sync: sync,
                success: function(data){
                    dfd.resolve(data)
                },
                error: function(xhr){
                    dfd.reject(xhr.responseText || xhr.status);
                }
            };
            if ($.isFunction(condition)) {
                e = condition.call(dfd, this.element, this.element.vals(), this.element[0]);
            } else if ($.isURLString(condition)) {
                e = dfd;
                $.ajax(ajaxConfig)
            } else if ($.isPlainObject(condition) && condition.url) {
                e = dfd;
                $.ajax($.extend({}, condition, ajaxConfig))
            } else
                e = condition;

            var ret;
            if (!$.isDeferred(e)) {
                ret = $.Deferred();
                if ($.isString(e)) {
                    ret.reject(e, oCondition, this.element.vals(), this.element, this.element[0]);
                } else if(e === undefined) {
                    ret.resolve(e, oCondition, this.element.vals(), this.element, this.element[0]);
                } else if (e) {
                    ret.resolve(e, oCondition, this.element.vals(), this.element, this.element[0])
                } else {
                    ret.reject(e, oCondition, this.element.vals(), this.element, this.element[0]);
                }
            } else ret = e;
            ret.timestamp = $.now();
            return ret;
        },
        valid: function(sync){
            if (this.options.obstruct && this.validating) {
                return this.validating.notify();
            }
            var that = this, condition;
            condition = $.isArray(this.options.condition) ? this.options.condition : [this.options.condition];
            var dfd = $.when.apply($, condition.map(function(item){
                return that._check(item, sync)
            }));
            this.validating = dfd;
            this.dfd = dfd;
            dfd.done(function(){
                that.validating = null;
                that.trigger('pass', [].slice.call(arguments))
            }).fail(function(){
                that.validating = null;
                that.trigger('error', [].slice.call(arguments))
            });
            return dfd;
        },
        _pass: function(){
            //this.form.off('submit', this._lockform)
            this.trigger('showPass', [].slice.call(arguments));
        },
        _getMsg: function(err, oCondition){
            var s
            if ($.type(this.options.message) == 'object') {
                if (err === false && (typeof oCondition == 'string') && this.options.message[oCondition]) {
                    err = oCondition;
                }
                s = this.options.message[err];
            }
            else s = this.options.message;

            if ($.type(this.options.message) == 'function') return s.call(this.err);
            else return s || err;

        },
        _error: function(err){
            //this.form.off('submit', this._lockform);
            //this.form.on('submit', this._lockform);
            this.trigger('showError', [this._getMsg.apply(this, arguments)].concat([].slice.call(arguments)));
        }
    }).mix({
        condition: {
            required: function(_, v){
                return !$.isBlank(v);
            }
        }
    });

})();