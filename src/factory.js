// TODO(wuhf): 类工厂
// ========================================================
(function($){
    var
        unextend = $.oneObject(["_super", "prototype", 'extend', 'implement' ]),
        rconst = /constructor|_init|_super/,
        classOne = 'object,array,function';
    function expand(klass,props){
        'extend,implement'.replace( $.rword, function(name){
            var modules = props[name];
            if( $.type(modules, classOne) ){
                klass[name].apply( klass,[].concat( modules ) );
                delete props[name];
            }
        });
        return klass;
    }
    var mutators = {
        inherit : function( parent,init ) {
            var bridge = function() { };
            if( typeof parent == 'function'){
                for(var i in parent){//继承类成员
                    this[i] = parent[i];
                }
                bridge.prototype = parent.prototype;
                this.prototype = new bridge ;//继承原型成员
                this._super = parent;//指定父类
            }
            this._init = (this._init || []).concat();
            if( init ){
                this._init.push(init);
            }
            this.toString = function(){
                return (init || bridge) + ''
            };
            var proto = this.prototype;
            // FIXME(wuhf): 暂时不需要 备注一下
            /*
             proto.setOptions = function(first){
             if( typeof first === 'string' ){
             first =  this[first] || (this[first] = {});
             [].splice.call( arguments, 0, 1, first );
             }else{
             [].unshift.call( arguments,this );
             }
             $.merge.apply(null,arguments);
             return this;
             };
             */
            return proto.constructor = this;
        },
        implement:function(){
            var target = this.prototype, reg = rconst;
            for(var i = 0, module; module = arguments[i++]; ){
                module = typeof module === "function" ? new module :module;
                $.each(module, function(name){
                    if(!reg.test(name)) target[name] = module[name];
                });
            }
            return this;
        },
        extend: function(){//扩展类成员
            var bridge = {};
            for(var i = 0, module; module = arguments[i++]; ){
                $.extend( bridge, module );
            }
            for( var key in bridge ){
                if( !unextend[key] ){
                    this[key] =  bridge[key];
                }
            }
            return this;
        }
    };
    $.factory = function( obj ){
        obj = obj || {};
        var parent = obj.inherit; //父类
        var init = obj.init ;    //构造器
        var extend = obj.extend; //静态成员
        delete obj.inherit;
        delete obj.init;
        var klass = function () {
            for( var i = 0 , init ; init =  klass._init[i++]; ){
                init.apply(this, arguments);
            }
        };

        $.extend( klass, mutators ).inherit( parent, init );//添加更多类方法
        return expand( klass, obj ).implement( obj );
    }
})(armer);

