/*==================================================
 Copyright 20013-2014 ˾ͽ������ UnitedStack and other contributors
 http://www.cnblogs.com/rubylouvre/
 https://github.com/RubyLouvre
 http://weibo.com/jslouvre/

 Released under the MIT license
 avalon 1.2.4 2014.3.18
 ==================================================*/
;(function(DOC, $) {
    var Registry = {} //�������ع⵽�˶����ϣ�����������ռ�����
    var expose = new Date - 0
    var subscribers = "$" + expose
    var window = this || (0, eval)('this')
    //var otherRequire = window.require
    //var otherDefine = window.define
    var stopRepeatAssign = false
    //var rword = /[^, ]+/g //�и��ַ���Ϊһ����С�飬�Կո�򶹺ŷֿ����ǣ����replaceʵ���ַ�����forEach
    //var class2type = {}
    var oproto = Object.prototype
    var ohasOwn = oproto.hasOwnProperty
    var prefix = "vm-"
    var W3C = window.dispatchEvent
    var root = DOC.documentElement
    //var serialize = oproto.toString
    var ap = Array.prototype
    var aslice = ap.slice
    var head = DOC.head || DOC.getElementsByTagName("head")[0] //HEADԪ��
    var documentFragment = DOC.createDocumentFragment()
    //var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(",")
    /*
    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function(name) {
        class2type["[object " + name + "]"] = name.toLowerCase()
    })
    */

    //var rnative = /\[native code\]/
    var rchecktype = /^(?:object|array)$/
    //var rwindow = /^\[object (Window|DOMWindow|global)\]$/

    var rword = $.rword;
    var noop = $.noop;
    var log = $.trace;

/*
    function noop() {
    }

    function log(a) {
        window.console && console.log(W3C ? a : a + "")
    }
*/

    /*********************************************************************
     *                    �����ռ��빤�ߺ���                               *
     **********************************************************************/
    var getType = $.type;
    var resetNumber = $.slice.resetNumber;
    var oneObject = $.oneObject;
    var generateID = $.generateID;

    window.avalon = function(el) {
        return $(el);
    }
    $.extend(avalon, {
        isWindow: $.isWindow,
        isPlainObject: $.isPlainObject,
        slice: $.slice,
        range: $.range,
        error: $.error,
        noop: noop,
        ui: {},
        nextTick: $.nextTick,
        bind: $.event.add,
        unbind: $.event.remove,
        parseDisplay: $.defaultDisplay,
        parseHTML: $.parseFragment,
        innerHTML: $.innerHTML,
        clearChild: $.clearChild,
        contains: $.contains,
        ready: $,
        log: $.trace
    })
    avalon.Array = $.Array;

/*
    avalon = function(el) { //����jQueryʽ����new ʵ�����ṹ
        return new avalon.init(el)
    }

    avalon.init = function(el) {
        this[0] = this.element = el
    }
    avalon.fn = avalon.prototype = avalon.init.prototype
    //������������ж����͵ķ���

    function getType(obj) { //ȡ������
        if (obj == null) {
            return String(obj)
        }
        // ���ڵ�webkit�ں������ʵ�����ѷ�����ecma262v4��׼�����Խ�������������������ʹ�ã����typeof���ж�����ʱ�᷵��function
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[serialize.call(obj)] || "object" :
            typeof obj
    }
    avalon.type = getType

    avalon.isWindow = function(obj) {
        if (!obj)
            return false
        // ����IE678 window == documentΪtrue,document == window��ȻΪfalse����������
        // ��׼�������IE9��IE10��ʹ�� ������
        return obj == obj.document && obj.document != obj
    }

    function isWindow(obj) {
        return rwindow.test(serialize.call(obj))
    }
    if (isWindow(window)) {
        avalon.isWindow = isWindow
    }
    //�ж��Ƿ���һ�����ص�javascript����Object��������DOM���󣬲���BOM���󣬲����Զ������ʵ����
    avalon.isPlainObject = function(obj) {
        if (getType(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
            return false
        }
        try {
            if (obj.constructor && !ohasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false
            }
        } catch (e) {
            return false
        }
        return true
    }
    if (rnative.test(Object.getPrototypeOf)) {
        avalon.isPlainObject = function(obj) {
            return !!obj && typeof obj === "object" && Object.getPrototypeOf(obj) === oproto
        }
    }
    */
    avalon.mix = /* avalon.fn.mix = */ function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false

        // �����һ������Ϊ����,�ж��Ƿ����
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1] || {}
            i++
        }

        //ȷ�����ܷ�Ϊһ�����ӵ���������
        if (typeof target !== "object" && getType(target) !== "function") {
            target = {}
        }

        //���ֻ��һ����������ô�³�Ա�����mix���ڵĶ�����
        if (i === length) {
            target = this
            i--
        }

        for (; i < length; i++) {
            //ֻ����ǿղ���
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    copy = options[name]

                    // ��ֹ������
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                            clone = clone.$model || clone

                        } else {
                            clone = src && avalon.isPlainObject(src) ? src : {}
                        }

                        target[name] = avalon.mix(deep, clone, copy)
                    } else if (copy !== void 0) {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    }

    avalon.getWidgetData = function(elem, prefix) {
        var raw = avalon(elem).data()
        var result = {}
        for (var i in raw) {
            if (i.indexOf(prefix) === 0) {
                result[i.replace(prefix, "").replace(/\w/, function(a) {
                    return a.toLowerCase()
                })] = raw[i]
            }
        }
        return result
    }

    /*
    var eventMap = avalon.eventMap = {}

    function resetNumber(a, n, end) { //����ģ��slice, splice��Ч��
        if ((a === +a) && !(a % 1)) { //���������
            if (a < 0) {
                a = a * -1 >= n ? 0 : a + n
            } else {
                a = a > n ? n : a
            }
        } else {
            a = end ? n : 0
        }
        return a
    }

    function oneObject(array, val) {
        if (typeof array === "string") {
            array = array.match(rword) || []
        }
        var result = {},
            value = val !== void 0 ? val : 1
        for (var i = 0, n = array.length; i < n; i++) {
            result[array[i]] = value
        }
        return result
    }
    */
    /*
    avalon.mix({
        rword: rword,
        subscribers: subscribers,
        ui: {},
        log: log,
        slice: W3C ? function(nodes, start, end) {
            return aslice.call(nodes, start, end)
        } : function(nodes, start, end) {
            var ret = [],
                n = nodes.length
            start = resetNumber(start, n)
            end = resetNumber(end, n, 1)
            for (var i = start; i < end; ++i) {
                ret[i - start] = nodes[i]
            }
            return ret
        },
        noop: noop,
        error: function(str, e) { //�������Error�����װһ�£�str�ڿ���̨�¿��ܻ�����
            throw new (e || Error)(str)
        },
        oneObject: oneObject,
        // avalon.range(10)
        // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        // avalon.range(1, 11)
        // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        // avalon.range(0, 30, 5)
        // => [0, 5, 10, 15, 20, 25]
        // avalon.range(0, -10, -1)
        // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
        // avalon.range(0)
        // => []
        range: function(start, end, step) { // ����������������
            step || (step = 1)
            if (end == null) {
                end = start || 0
                start = 0
            }
            var index = -1,
                length = Math.max(0, Math.ceil((end - start) / step)),
                result = Array(length)
            while (++index < length) {
                result[index] = start
                start += step
            }
            return result
        },
        bind: function(el, type, fn, phase) { // ���¼�
            var callback = W3C ? fn : function(e) {
                return fn.call(el, fixEvent(e))
            }
            if (W3C) {
                el.addEventListener(eventMap[type] || type, callback, !!phase)
            } else {
                el.attachEvent("on" + type, callback)
            }
            return callback
        },
        unbind: W3C ? function(el, type, fn, phase) { //ж���¼�
            el.removeEventListener(eventMap[type] || type, fn || noop, !!phase)
        } : function(el, type, fn) {
            el.detachEvent("on" + type, fn || noop)
        },
        css: function(node, name, value) {
            if (node instanceof avalon) {
                node = node[0]
            }
            var prop = /[_-]/.test(name) ? camelize(name) : name
            name = avalon.cssName(prop) || prop
            if (value === void 0 || typeof value === "boolean") { //��ȡ��ʽ
                var fn = cssHooks[prop + ":get"] || cssHooks["@:get"]
                var val = fn(node, name)
                return value === true ? parseFloat(val) || 0 : val
            } else if (value === "") { //�����ʽ
                node.style[name] = ""
            } else { //������ʽ
                if (value == null || value !== value) {
                    return
                }
                if (isFinite(value) && !avalon.cssNumber[prop]) {
                    value += "px"
                }
                fn = cssHooks[prop + ":set"] || cssHooks["@:set"]
                fn(node, name, value)
            }
        },
        each: function(obj, fn) {
            if (obj) { //�ų�null, undefined
                var i = 0
                if (isArrayLike(obj)) {
                    for (var n = obj.length; i < n; i++) {
                        fn(i, obj[i])
                    }
                } else {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            fn(i, obj[i])
                        }
                    }
                }
            }
        },
        Array: {
            ensure: function(target, item) {
                //ֻ�е�ǰ���鲻���ڴ�Ԫ��ʱֻ�����
                if (target.indexOf(item) === -1) {
                    target.push(item)
                }
                return target
            },
            removeAt: function(target, index) {
                //�Ƴ�������ָ��λ�õ�Ԫ�أ����ز�����ʾ�ɹ����
                return !!target.splice(index, 1).length
            },
            remove: function(target, item) {
                //�Ƴ������е�һ��ƥ�䴫�ε��Ǹ�Ԫ�أ����ز�����ʾ�ɹ����
                var index = target.indexOf(item)
                if (~index)
                    return avalon.Array.removeAt(target, index)
                return false
            }
        }
    })

    function generateID() {
        //����UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return "avalon" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    //ֻ�ýڵ㼯�ϣ������飬arguments��ӵ�зǸ�������length���ԵĴ�JS����ͨ��

    function isArrayLike(obj) {
        if (obj && typeof obj === "object" && !avalon.isWindow(obj)) {
            var n = obj.length
            if (+n === n && !(n % 1) && n >= 0) { //���length�����Ƿ�Ϊ�Ǹ�����
                try {
                    if ({}.propertyIsEnumerable.call(obj, "length") === false) { //�����ԭ������
                        return Array.isArray(obj) || /^\s?function/.test(obj.item || obj.callee)
                    }
                    return true
                } catch (e) { //IE��NodeListֱ���״�
                    return true
                }
            }
        }
        return false
    }
    //�������������������첽�ص�(��avalon.ready�����һ����֧�����ڴ���IE6-9)
    avalon.nextTick = window.setImmediate ? setImmediate.bind(window) : function(callback) {
        setTimeout(callback, 0) //IE10-11 or W3C
    }

    /*********************************************************************
     *                           modelFactory                             *
     **********************************************************************/
    var VMODELS = avalon.vmodels = {}
    avalon.define = function(name, factory) {
        if (typeof name !== "string") {
            avalon.error("����ָ��ID")
        }
        if (typeof factory !== "function") {
            avalon.error("factory�����Ǻ���")
        }
        var scope = {
            $watch: noop
        }
        factory(scope) //�õ����ж���
        var model = modelFactory(scope) //͵�컻�գ���scope��Ϊmodel
        stopRepeatAssign = true
        factory(model)
        stopRepeatAssign = false
        model.$id = name
        return VMODELS[name] = model
    }

    function modelFactory(scope, model) {
        if (Array.isArray(scope)) {
            var arr = scope.concat() //ԭ�������Ϊ�����ɵļ�������$model������
            scope.length = 0
            var collection = Collection(scope)
            collection.push.apply(collection, arr)
            return collection
        }
        if (typeof scope.nodeType === "number") {
            return scope
        }
        var vmodel = {} //Ҫ���صĶ���
        model = model || {} //����$model�ϵ�����
        var accessingProperties = {} //�������
        var normalProperties = {} //��ͨ����
        var computedProperties = [] //��������
        var watchProperties = arguments[2] || {} //ǿ��Ҫ����������
        var skipArray = scope.$skipArray //Ҫ���Լ�ص�����
        for (var i = 0, name; name = skipProperties[i++]; ) {
            delete scope[name]
            normalProperties[name] = true
        }
        if (Array.isArray(skipArray)) {
            for (var i = 0, name; name = skipArray[i++]; ) {
                normalProperties[name] = true
            }
        }
        for (var i in scope) {
            loopModel(i, scope[i], model, normalProperties, accessingProperties, computedProperties, watchProperties)
        }
        vmodel = defineProperties(vmodel, descriptorFactory(accessingProperties), normalProperties) //����һ���յ�ViewModel
        for (var name in normalProperties) {
            vmodel[name] = normalProperties[name]
        }
        watchProperties.vmodel = vmodel
        vmodel.$model = model
        vmodel.$events = {}
        vmodel.$id = generateID()
        vmodel.$accessors = accessingProperties
        vmodel[subscribers] = []
        for (var i in Observable) {
            var fn = Observable[i]
            if (!W3C) { //��IE6-8�£�VB����ķ������this����ָ��������Ҫ��bind����һ��
                fn = fn.bind(vmodel)
            }
            vmodel[i] = fn
        }
        vmodel.hasOwnProperty = function(name) {
            return name in vmodel.$model
        }
        for (var i = 0, fn; fn = computedProperties[i++]; ) { //���ǿ�Ƽ������� �����Լ���ֵ
            Registry[expose] = fn
            fn()
            collectSubscribers(fn)
            delete Registry[expose]
        }
        return vmodel
    }

    var skipProperties = String("$id,$watch,$unwatch,$fire,$events,$model,$skipArray,$accessors," + subscribers).match(rword)

    var isEqual = Object.is || function(v1, v2) {
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2
        } else if (v1 !== v1) {
            return v2 !== v2
        } else {
            return v1 === v2
        }
    }

    function safeFire(a, b, c, d) {
        if (a.$events) {
            Observable.$fire.call(a, b, c, d)
        }
    }
    var descriptorFactory = W3C ? function(obj) {
        var descriptors = {}
        for (var i in obj) {
            descriptors[i] = {
                get: obj[i],
                set: obj[i],
                enumerable: true,
                configurable: true
            }
        }
        return descriptors
    } : function(a) {
        return a
    }

    function loopModel(name, val, model, normalProperties, accessingProperties, computedProperties, watchProperties) {
        model[name] = val
        if (normalProperties[name] || (val && val.nodeType)) { //�����ָ�����ü�ص�ϵͳ���Ի�Ԫ�ؽڵ㣬��ŵ� $skipArray����
            return normalProperties[name] = val
        }
        if (name.charAt(0) === "$" && !watchProperties[name]) { //�����$��ͷ�����Ҳ���watchMore�����
            return normalProperties[name] = val
        }
        var valueType = getType(val)
        if (valueType === "function") { //����Ǻ�����Ҳ���ü��
            return normalProperties[name] = val
        }
        var accessor, oldArgs
        if (valueType === "object" && typeof val.get === "function" && Object.keys(val).length <= 2) {
            var setter = val.set,
                getter = val.get
            accessor = function(newValue) { //�����������ԣ��������������������������Դ�����ı�
                var vmodel = watchProperties.vmodel
                var value = model[name],
                    preValue = value
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (typeof setter === "function") {
                        var backup = vmodel.$events[name]
                        vmodel.$events[name] = [] //��ջص�����ֹ�ڲ�ð�ݶ��������$fire
                        setter.call(vmodel, newValue)
                        vmodel.$events[name] = backup
                    }
                    if (!isEqual(oldArgs, newValue)) {
                        oldArgs = newValue
                        newValue = model[name] = getter.call(vmodel)//ͬ��$model
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue)//ͬ��ѭ�����еĴ���VM
                        notifySubscribers(accessor) //֪ͨ����ı�
                        safeFire(vmodel, name, newValue, preValue)//����$watch�ص�
                    }
                } else {
                    if (avalon.openComputedCollect) { // �ռ���ͼˢ�º���
                        collectSubscribers(accessor)
                    }
                    newValue = model[name] = getter.call(vmodel)
                    if (!isEqual(value, newValue)) {
                        oldArgs = void 0
                        safeFire(vmodel, name, newValue, preValue)
                    }
                    return newValue
                }
            }
            computedProperties.push(accessor)
        } else if (rchecktype.test(valueType)) {
            accessor = function(newValue) { //��ViewModel��������
                var realAccessor = accessor.$vmodel, preValue = realAccessor.$model
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (!isEqual(preValue, newValue)) {
                        newValue = accessor.$vmodel = updateVModel(realAccessor, newValue, valueType)
                        var fn = rebindings[newValue.$id]
                        fn && fn()//������ͼ
                        var parent = watchProperties.vmodel
                        // withProxyCount && updateWithProxy(parent.$id, name, newValue)//ͬ��ѭ�����еĴ���VM
                        model[name] = newValue.$model//ͬ��$model
                        notifySubscribers(realAccessor)   //֪ͨ����ı�
                        safeFire(parent, name, model[name], preValue)   //����$watch�ص�
                    }
                } else {
                    collectSubscribers(realAccessor) //�ռ���ͼ����
                    return realAccessor
                }
            }
            accessor.$vmodel = val.$model ? val : modelFactory(val, val)
            model[name] = accessor.$vmodel.$model
        } else {
            accessor = function(newValue) { //�򵥵���������
                var preValue = model[name]
                if (arguments.length) {
                    if (!isEqual(preValue, newValue)) {
                        model[name] = newValue //ͬ��$model
                        var vmodel = watchProperties.vmodel
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue)//ͬ��ѭ�����еĴ���VM
                        notifySubscribers(accessor) //֪ͨ����ı�
                        safeFire(vmodel, name, newValue, preValue)//����$watch�ص�
                    }
                } else {
                    collectSubscribers(accessor) //�ռ���ͼ����
                    return preValue
                }
            }
            model[name] = val
        }
        accessor[subscribers] = [] //����������
        accessingProperties[name] = accessor
    }
    //with�����ɵĴ�����󴢴��
    var withProxyPool = {}
    var withProxyCount = 0
    var rebindings = {}

    function updateWithProxy($id, name, val) {
        var pool = withProxyPool[$id]
        if (pool && pool[name]) {
            pool[name].$val = val
        }
    }

    function updateVModel(a, b, valueType) {
        //aΪԭ����VM�� bΪ��������¶���
        if (valueType === "array") {
            if (!Array.isArray(b)) {
                return a //fix https://github.com/RubyLouvre/avalon/issues/261
            }
            var bb = b.concat()
            a.clear()
            a.push.apply(a, bb)
            return a
        } else {
            var iterators = a[subscribers]
            if (withProxyPool[a.$id]) {
                withProxyCount--
                delete withProxyPool[a.$id]
            }
            iterators.forEach(function(data) {
                data.rollback && data.rollback() //��ԭ vm-with vm-on
            })
            var ret = modelFactory(b)
            rebindings[ret.$id] = function(data) {
                while (data = iterators.shift()) {
                    (function(el) {
                        if (el.type) { //���°�
                            avalon.nextTick(function() {
                                bindingHandlers[el.type](el, el.vmodels)
                            })
                        }
                    })(data)
                }
                delete rebindings[ret.$id]
            }
            return ret
        }
    }

    //===================�޸��������Object.defineProperties��֧��=================
    var defineProperty = Object.defineProperty
    //����������֧��ecma262v5��Object.defineProperties���ߴ���BUG������IE8
    //��׼�����ʹ��__defineGetter__, __defineSetter__ʵ��
    try {
        defineProperty({}, "_", {
            value: "x"
        })
        var defineProperties = Object.defineProperties
    } catch (e) {
        if ("__defineGetter__" in avalon) {
            defineProperty = function(obj, prop, desc) {
                if ('value' in desc) {
                    obj[prop] = desc.value
                }
                if ("get" in desc) {
                    obj.__defineGetter__(prop, desc.get)
                }
                if ('set' in desc) {
                    obj.__defineSetter__(prop, desc.set)
                }
                return obj
            }
            defineProperties = function(obj, descs) {
                for (var prop in descs) {
                    if (descs.hasOwnProperty(prop)) {
                        defineProperty(obj, prop, descs[prop])
                    }
                }
                return obj
            }
        }
    }
    //IE6-8ʹ��VBScript���set get���ʵ��
    if (!defineProperties && window.VBArray) {
        window.execScript([
            "Function parseVB(code)",
            "\tExecuteGlobal(code)",
            "End Function"
        ].join("\n"), "VBScript")

        function VBMediator(accessingProperties, name, value) {
            var accessor = accessingProperties[name]
            if (arguments.length === 3) {
                accessor(value)
            } else {
                return accessor()
            }
        }
        defineProperties = function(name, accessingProperties, normalProperties) {
            var className = "VBClass" + setTimeout("1"),
                buffer = []
            buffer.push(
                "Class " + className,
                "\tPrivate [__data__], [__proxy__]",
                "\tPublic Default Function [__const__](d, p)",
                "\t\tSet [__data__] = d: set [__proxy__] = p",
                "\t\tSet [__const__] = Me", //��ʽ����
                "\tEnd Function")
            //�����ͨ����,��ΪVBScript��������JS����������ɾ���ԣ�����������Ԥ�ȶ����
            for (name in normalProperties) {
                buffer.push("\tPublic [" + name + "]")
            }
            buffer.push("\tPublic [" + 'hasOwnProperty' + "]")
            //��ӷ��������� 
            for (name in accessingProperties) {
                if (!(name in normalProperties)) { //��ֹ�ظ�����
                    buffer.push(
                        //���ڲ�֪�Է��ᴫ��ʲô,���set, let������
                        "\tPublic Property Let [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Set [" + name + "](val" + expose + ")", //setter
                        "\t\tCall [__proxy__]([__data__], \"" + name + "\", val" + expose + ")",
                        "\tEnd Property",
                        "\tPublic Property Get [" + name + "]", //getter
                        "\tOn Error Resume Next", //��������ʹ��set���,�������������鵱�ַ�������
                        "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tIf Err.Number <> 0 Then",
                        "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
                        "\tEnd If",
                        "\tOn Error Goto 0",
                        "\tEnd Property")
                }
            }
            buffer.push("End Class") //�ඨ�����
            buffer.push(
                "Function " + className + "Factory(a, b)", //����ʵ�������������ؼ��Ĳ���
                "\tDim o",
                "\tSet o = (New " + className + ")(a, b)",
                "\tSet " + className + "Factory = o",
                "End Function")
            window.parseVB(buffer.join("\r\n")) //�ȴ���һ��VB�๤��
            return window[className + "Factory"](accessingProperties, VBMediator) //�õ����Ʒ
        }
    }
    /*********************************************************************
     *                           ecma262 v5�﷨����                   *
     **********************************************************************/
    /*
    if (!"˾ͽ����".trim) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        String.prototype.trim = function() {
            return this.replace(rtrim, "")
        }
    }
    for (var i in {
        toString: 1
    }) {
        DONT_ENUM = false
    }
    if (!Object.keys) {
        Object.keys = function(obj) { //ecma262v5 15.2.3.14
            var result = []
            for (var key in obj)
                if (obj.hasOwnProperty(key)) {
                    result.push(key)
                }
            if (DONT_ENUM && obj) {
                for (var i = 0; key = DONT_ENUM[i++]; ) {
                    if (obj.hasOwnProperty(key)) {
                        result.push(key)
                    }
                }
            }
            return result
        }
    }
    if (!Array.isArray) {
        Array.isArray = function(a) {
            return a && getType(a) === "array"
        }
    }

    if (!noop.bind) {
        Function.prototype.bind = function(scope) {
            if (arguments.length < 2 && scope === void 0)
                return this
            var fn = this,
                argv = arguments
            return function() {
                var args = [],
                    i
                for (i = 1; i < argv.length; i++)
                    args.push(argv[i])
                for (i = 0; i < arguments.length; i++)
                    args.push(arguments[i])
                return fn.apply(scope, args)
            }
        }
    }

    function iterator(vars, body, ret) {
        var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' + body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') + '}' + ret
        return Function("fn,scope", fun)
    }
    if (!rnative.test([].map)) {
        avalon.mix(ap, {
            //��λ���������������е�һ�����ڸ���������Ԫ�ص�����ֵ��
            indexOf: function(item, index) {
                var n = this.length,
                    i = ~~index
                if (i < 0)
                    i += n
                for (; i < n; i++)
                    if (this[i] === item)
                        return i
                return -1
            },
            //��λ��������ͬ�ϣ������ǴӺ������
            lastIndexOf: function(item, index) {
                var n = this.length,
                    i = index == null ? n - 1 : index
                if (i < 0)
                    i = Math.max(0, n + i)
                for (; i >= 0; i--)
                    if (this[i] === item)
                        return i
                return -1
            },
            //�����������������Ԫ�ذ���������һ��������ִ�С�Ptototype.js�Ķ�Ӧ����Ϊeach��
            forEach: iterator("", '_', ""),
            //������ �������е�ÿ����������һ������������˺�����ֵΪ�棬���Ԫ����Ϊ�������Ԫ���ռ�������������������
            filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
            //�ռ��������������Ԫ�ذ���������һ��������ִ�У�Ȼ������ǵķ���ֵ���һ�������鷵�ء�Ptototype.js�Ķ�Ӧ����Ϊcollect��
            map: iterator('r=[],', 'r[i]=_', 'return r'),
            //ֻҪ��������һ��Ԫ�������������Ž�������������true������ô���ͷ���true��Ptototype.js�Ķ�Ӧ����Ϊany��
            some: iterator("", 'if(_)return true', 'return false'),
            //ֻ�������е�Ԫ�ض������������Ž�������������true�������ŷ���true��Ptototype.js�Ķ�Ӧ����Ϊall��
            every: iterator("", 'if(!_)return false', 'return true')
        })
    }

    function fixContains(a, b) {
        if (b) {
            while ((b = b.parentNode)) {
                if (b === a) {
                    return true;
                }
            }
        }
        return false;
    }
    if (!root.contains) { //safari5+�ǰ�contains��������Element.prototype�϶�����Node.prototype
        Node.prototype.contains = function(arg) {
            return !!(this.compareDocumentPosition(arg) & 16)
        }
    }
    if (!DOC.contains) { //IE6-11���ĵ�����û��contains
        DOC.contains = function(b) {
            return fixContains(this, b)
        }
    }
    if (!root.outerHTML && window.HTMLElement) {//firefox ��11ʱ����outerHTML
        HTMLElement.prototype.__defineGetter__("outerHTML", function() {
            domParser.textContent = ""
            domParser.appendChild(this)
            var str = this.innerHTML
            domParser.textContent = ""
            return str
        });
    }
    /*********************************************************************
     *                           ����ģ��                                  *
     **********************************************************************/

    function kernel(settings) {
        for (var p in settings) {
            if (!ohasOwn.call(settings, p))
                continue
            var val = settings[p]
            if (typeof kernel.plugins[p] === "function") {
                kernel.plugins[p](val)
            } else if (typeof kernel[p] === "object") {
                avalon.mix(kernel[p], val)
            } else {
                kernel[p] = val
            }
        }
        return this
    }
    var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g

    function escapeRegExp(target) {
        //http://stevenlevithan.com/regex/xregexp/
        //���ַ�����ȫ��ʽ��Ϊ������ʽ��Դ��
        return (target + "").replace(rregexp, "\\$&")
    }
    /*
    var plugins = {
        alias: function(val) {
            log("Warning: alias�����ѷ���������paths, shim������")
            for (var c in val) {
                if (ohasOwn.call(val, c)) {
                    var currValue = val[c]
                    switch (getType(currValue)) {
                        case "string":
                            kernel.paths[c] = currValue
                            break;
                        case "object":
                            if (currValue.src) {
                                kernel.paths[c] = currValue.src
                                delete currValue.src
                            }
                            kernel.shim[c] = currValue
                            break;
                    }
                }
            }
        },
        loader: function(bool) {
            if (bool) {
                window.define = innerRequire.define
                window.require = innerRequire
            } else {
                window.define = otherDefine
                window.require = otherRequire
            }
        },
        interpolate: function(array) {
            if (Array.isArray(array) && array[0] && array[1] && array[0] !== array[1]) {
                openTag = array[0]
                closeTag = array[1]
                var o = escapeRegExp(openTag),
                    c = escapeRegExp(closeTag)
                rexpr = new RegExp(o + "(.*?)" + c)
                rexprg = new RegExp(o + "(.*?)" + c, "g")
                rbind = new RegExp(o + ".*?" + c + "|\\svm-")
            }
        }
    }

    kernel.plugins = plugins
    kernel.plugins['interpolate'](["{{", "}}"])
    kernel.paths = {}
    kernel.shim = {}
    avalon.config = kernel
    */
    var config = {
        interpolate: function(array) {
            if (Array.isArray(array) && array[0] && array[1] && array[0] !== array[1]) {
                openTag = array[0]
                closeTag = array[1]
                var o = escapeRegExp(openTag),
                    c = escapeRegExp(closeTag)
                rexpr = new RegExp(o + "(.*?)" + c)
                rexprg = new RegExp(o + "(.*?)" + c, "g")
                rbind = new RegExp(o + ".*?" + c + "|\\s" + prefix);
            }
        }
    }
    /*********************************************************************
     *                      DOM API�ĸ߼���װ                           *
     **********************************************************************/

    /*
    function hyphen(target) {
        //ת��Ϊ���ַ��߷��
        return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase()
    }

    function camelize(target) {
        //ת��Ϊ�շ���
        if (target.indexOf("-") < 0 && target.indexOf("_") < 0) {
            return target //��ǰ�жϣ����getStyle�ȵ�Ч��
        }
        return target.replace(/[-_][^-_]/g, function(match) {
            return match.charAt(1).toUpperCase()
        })
    }

    var rnospaces = /\S+/g

    avalon.fn.mix({
        hasClass: function(cls) {
            var node = this[0] || {}
            if (node.nodeType === 1 && node.className) {
                return (" " + node.className + " ").indexOf(" " + cls + " ") > -1
            }
            return false
        },
        addClass: function(cls) {
            var node = this[0] || {}
            if (cls && typeof cls === "string" && node.nodeType === 1) {
                if (!node.className) {
                    node.className = cls
                } else {
                    var arr = node.className.match(rnospaces)
                    cls.replace(rnospaces, function(a) {
                        if (arr.indexOf(a) === -1) {
                            arr.push(a)
                        }
                    })
                    node.className = arr.join(" ")
                }
            }
            return this
        },
        removeClass: function(cls) {
            var node = this[0] || {}
            if (cls && typeof cls > "o" && node.nodeType === 1 && node.className) {
                var classNames = (cls || "").match(rnospaces) || []
                var cl = classNames.length
                var set = " " + node.className.match(rnospaces).join(" ") + " "
                for (var c = 0; c < cl; c++) {
                    set = set.replace(" " + classNames[c] + " ", " ")
                }
                node.className = set.slice(1, set.length - 1)
            }
            return this
        },
        toggleClass: function(value, stateVal) {
            var state = stateVal,
                className, i = 0
            var classNames = value.match(rnospaces) || []
            var isBool = typeof stateVal === "boolean"
            while ((className = classNames[i++])) {
                state = isBool ? state : !this.hasClass(className)
                this[state ? "addClass" : "removeClass"](className)
            }
            return this
        },
        attr: function(name, value) {
            if (arguments.length === 2) {
                this[0].setAttribute(name, value)
                return this
            } else {
                return this[0].getAttribute(name)
            }
        },
        data: function(name, value) {
            name = "data-" + hyphen(name || "")
            switch (arguments.length) {
                case 2:
                    this.attr(name, value)
                    return this
                case 1:
                    var val = this.attr(name)
                    return parseData(val)
                case 0:
                    var attrs = this[0].attributes,
                        ret = {}
                    for (var i = 0, attr; attr = attrs[i++]; ) {
                        name = attr.name
                        if (!name.indexOf("data-")) {
                            name = camelize(name.slice(5))
                            ret[name] = parseData(attr.value)
                        }
                    }
                    return ret
            }
        },
        removeData: function(name) {
            name = "data-" + hyphen(name)
            this[0].removeAttribute(name)
            return this
        },
        css: function(name, value) {
            if (avalon.isPlainObject(name)) {
                for (var i in name) {
                    avalon.css(this, i, name[i])
                }
            } else {
                var ret = avalon.css(this, name, value)
            }
            return ret !== void 0 ? ret : this
        },
        position: function() {
            var offsetParent, offset,
                elem = this[0],
                parentOffset = {
                    top: 0,
                    left: 0
                }
            if (!elem) {
                return
            }
            if (this.css("position") === "fixed") {
                offset = elem.getBoundingClientRect()
            } else {
                offsetParent = this.offsetParent() //�õ�������offsetParent
                offset = this.offset() // �õ���ȷ��offsetParent
                if (offsetParent[0].tagName !== "HTML") {
                    parentOffset = offsetParent.offset()
                }
                parentOffset.top += avalon.css(offsetParent[0], "borderTopWidth", true)
                parentOffset.left += avalon.css(offsetParent[0], "borderLeftWidth", true)
            }
            return {
                top: offset.top - parentOffset.top - avalon.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - avalon.css(elem, "marginLeft", true)
            }
        },
        offsetParent: function() {
            var offsetParent = this[0].offsetParent || root
            while (offsetParent && (offsetParent.tagName !== "HTML") && avalon.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent
            }
            return avalon(offsetParent || root)
        },
        bind: function(type, fn, phase) {
            if (this[0]) { //�˷���������
                return avalon.bind(this[0], type, fn, phase)
            }
        },
        unbind: function(type, fn, phase) {
            if (this[0]) {
                avalon.unbind(this[0], type, fn, phase)
            }
            return this
        },
        val: function(value) {
            var node = this[0]
            if (node && node.nodeType === 1) {
                var get = arguments.length === 0
                var access = get ? ":get" : ":set"
                var fn = valHooks[getValType(node) + access]
                if (fn) {
                    var val = fn(node, value)
                } else if (get) {
                    return (node.value || "").replace(/\r/g, "")
                } else {
                    node.value = value
                }
            }
            return get ? val : this
        }
    })

    function parseData(data) {
        try {
            data = data === "true" ? true :
                data === "false" ? false :
                    data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? parseJSON(data) : data
        } catch (e) {
        }
        return data
    }
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
    var parseJSON = window.JSON ? JSON.parse : function(data) {
        if (typeof data === "string") {
            data = data.trim();
            if (data) {
                if (rvalidchars.test(data.replace(rvalidescape, "@")
                    .replace(rvalidtokens, "]")
                    .replace(rvalidbraces, ""))) {
                    return (new Function("return " + data))();
                }
            }
            avalon.error("Invalid JSON: " + data);
        }
    }

    //����avalon.fn.scrollLeft, avalon.fn.scrollTop����
    avalon.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        avalon.fn[method] = function(val) {
            var node = this[0] || {}, win = getWindow(node),
                top = method === "scrollTop"
            if (!arguments.length) {
                return win ? (prop in win) ? win[prop] : root[method] : node[method]
            } else {
                if (win) {
                    win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
                } else {
                    node[method] = val
                }
            }
        }
    })

    function getWindow(node) {
        return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
    }
    //=============================css���=======================
    var cssHooks = avalon.cssHooks = {}
    var prefixes = ["", "-webkit-", "-o-", "-moz-", "-vm-"]
    var cssMap = {
        "float": "cssFloat",
        background: "backgroundColor"
    }
    avalon.cssNumber = oneObject("columnCount,order,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom")

    avalon.cssName = function(name, host, camelCase) {
        if (cssMap[name]) {
            return cssMap[name]
        }
        host = host || root.style
        for (var i = 0, n = prefixes.length; i < n; i++) {
            camelCase = camelize(prefixes[i] + name)
            if (camelCase in host) {
                return (cssMap[name] = camelCase)
            }
        }
        return null
    }
    cssHooks["@:set"] = function(node, name, value) {
        try { //node.style.width = NaN;node.style.width = "xxxxxxx";node.style.width = undefine �ھ�ʽIE�»����쳣
            node.style[name] = value
        } catch (e) {
        }
    }
    if (window.getComputedStyle) {
        cssHooks["@:get"] = function(node, name) {
            var ret, styles = window.getComputedStyle(node, null)
            if (styles) {
                ret = name === "filter" ? styles.getPropertyValue(name) : styles[name]
                if (ret === "") {
                    ret = node.style[name] //�����������Ҫ�����ֶ�ȡ������ʽ
                }
            }
            return ret
        }
        cssHooks["opacity:get"] = function(node) {
            var ret = cssHooks["@:get"](node, "opacity")
            return ret === "" ? "1" : ret
        }
    } else {
        var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
        var rposition = /^(top|right|bottom|left)$/
        var ie8 = !!window.XDomainRequest
        var salpha = "DXImageTransform.Microsoft.Alpha"
        var border = {
            thin: ie8 ? '1px' : '2px',
            medium: ie8 ? '3px' : '4px',
            thick: ie8 ? '5px' : '6px'
        }
        cssHooks["@:get"] = function(node, name) {
            //ȡ�þ�ȷֵ���������п����Ǵ�em,pc,mm,pt,%�ȵ�λ
            var currentStyle = node.currentStyle
            var ret = currentStyle[name]
            if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
                //�٣�����ԭ�е�style.left, runtimeStyle.left,
                var style = node.style,
                    left = style.left,
                    rsLeft = node.runtimeStyle.left
                //�����ڢ۴���style.left = xxx��Ӱ�쵽currentStyle.left��
                //��˰���currentStyle.left�ŵ�runtimeStyle.left��
                //runtimeStyle.leftӵ��������ȼ�������style.leftӰ��
                node.runtimeStyle.left = currentStyle.left
                //�۽���ȷֵ������style.left��Ȼ��ͨ��IE����һ��˽������ style.pixelLeft
                //�õ���λΪpx�Ľ����fontSize�ķ�֧��http://bugs.jquery.com/ticket/760
                style.left = name === 'fontSize' ? '1em' : (ret || 0)
                ret = style.pixelLeft + "px"
                //�ܻ�ԭ style.left��runtimeStyle.left
                style.left = left
                node.runtimeStyle.left = rsLeft
            }
            if (ret === "medium") {
                name = name.replace("Width", "Style")
                //border width Ĭ��ֵΪmedium����ʹ��Ϊ0"
                if (currentStyle[name] === "none") {
                    ret = "0px"
                }
            }
            return ret === "" ? "auto" : border[ret] || ret
        }
        cssHooks["opacity:set"] = function(node, name, value) {
            node.style.filter = 'alpha(opacity=' + value * 100 + ')'
            node.style.zoom = 1
        }
        cssHooks["opacity:get"] = function(node) {
            //�������Ļ�ȡIE͸��ֵ�ķ�ʽ������Ҫ���������ˣ�
            var alpha = node.filters.alpha || node.filters[salpha],
                op = alpha ? alpha.opacity : 100
            return (op / 100) + "" //ȷ�����ص����ַ���
        }
        //��ʽIE�޷�ͨ��currentStyleȡ��û�ж�������ʽ���е�width, heightֵ
        "width,height".replace(rword, function(name) {
            cssHooks[name + ":get"] = function(node) {
                if (name === "width") {
                    return node.clientWidth - avalon.css(node, "paddingLeft", true) - avalon.css(node, "paddingRight", true)
                } else {
                    return node.clientHeight - avalon.css(node, "paddingTop", true) - avalon.css(node, "paddingBottom", true)
                }
            }
        })
    }

    "top,left".replace(rword, function(name) {
        cssHooks[name + ":get"] = function(node) {
            var computed = cssHooks["@:get"](node, name)
            return /px$/.test(computed) ? computed :
                avalon(node).position()[name] + "px"
        }
    })
    var cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }

    var rdisplayswap = /^(none|table(?!-c[ea]).+)/

    function showHidden(node, array) {
        //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
        if (node.offsetWidth <= 0) { //opera.offsetWidth����С��0
            if (rdisplayswap.test(cssHooks["@:get"](node, "display"))) {
                var obj = {
                    node: node
                }
                for (var name in cssShow) {
                    obj[name] = node.style[name]
                    node.style[name] = cssShow[name]
                }
                array.push(obj)
            }
            var parent = node.parentNode
            if (parent && parent.nodeType == 1) {
                showHidden(parent, array)
            }
        }
    }
    "Width,Height".replace(rword, function(name) {
        var method = name.toLowerCase(),
            clientProp = "client" + name,
            scrollProp = "scroll" + name,
            offsetProp = "offset" + name
        cssHooks[method + "::get"] = function(node) {
            var hidden = [];
            showHidden(node, hidden);
            var val = avalon.css(node, method, true)
            for (var i = 0, obj; obj = hidden[i++]; ) {
                node = obj.node
                for (var n in obj) {
                    if (typeof obj[n] === "string") {
                        node.style[n] = obj[n]
                    }
                }
            }
            return val;
        }
        avalon.fn[method] = function(value) {
            var node = this[0]
            if (arguments.length === 0) {
                if (node.setTimeout) { //ȡ�ô��ڳߴ�,IE9�������node.innerWidth /innerHeight����
                    return node["inner" + name] || node.document.documentElement[clientProp]
                }
                if (node.nodeType === 9) { //ȡ��ҳ��ߴ�
                    var doc = node.documentElement
                    //FF chrome    html.scrollHeight< body.scrollHeight
                    //IE ��׼ģʽ : html.scrollHeight> body.scrollHeight
                    //IE ����ģʽ : html.scrollHeight �����ڿ��Ӵ��ڶ�һ�㣿
                    return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
                }
                return cssHooks[method + "::get"](node)
            } else {
                return this.css(method, value)
            }
        }

    })
    avalon.fn.offset = function() { //ȡ�þ���ҳ�����ҽǵ�����
        var node = this[0],
            doc = node && node.ownerDocument
        var pos = {
            left: 0,
            top: 0
        }
        if (!doc) {
            return pos
        }
        //http://hkom.blog1.fc2.com/?mode=m&no=750 body��ƫ�����ǲ�����margin��
        //���ǿ���ͨ��getBoundingClientRect�����Ԫ�������client��rect.
        //http://msdn.microsoft.com/en-us/library/ms536433.aspx
        var box = node.getBoundingClientRect(),
        //chrome1+, firefox3+, ie4+, opera(yes) safari4+
            win = doc.defaultView || doc.parentWindow,
            root = (navigator.vendor || doc.compatMode === "BackCompat") ? doc.body : doc.documentElement,
            clientTop = root.clientTop >> 0,
            clientLeft = root.clientLeft >> 0,
            scrollTop = win.pageYOffset || root.scrollTop,
            scrollLeft = win.pageXOffset || root.scrollLeft
        // �ѹ�������ӵ�left,top��ȥ��
        // IEһЩ�汾�л��Զ�ΪHTMLԪ�ؼ���2px��border��������Ҫȥ����
        // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
        pos.top = box.top + scrollTop - clientTop
        pos.left = box.left + scrollLeft - clientLeft
        return pos
    }

    //==================================val���============================

    function getValType(el) {
        var ret = el.tagName.toLowerCase()
        return ret === "input" && /checkbox|radio/.test(el.type) ? "checked" : ret
    }
    var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
    var valHooks = {
        "option:get": function(node) {
            //��IE11��W3C�����û��ָ��value����ônode.valueĬ��Ϊnode.text������trim��������IE9-10����ȡinnerHTML(ûtrim����)
            if (node.hasAttribute) {
                return node.hasAttribute("value") ? node.value : node.text
            }
            //specified�����ɿ������ͨ������outerHTML�ж��û���û����ʾ����value
            return roption.test(node.outerHTML) ? node.value : node.text
        },
        "select:get": function(node, value) {
            var option, options = node.options,
                index = node.selectedIndex,
                getter = valHooks["option:get"],
                one = node.type === "select-one" || index < 0,
                values = one ? null : [],
                max = one ? index + 1 : options.length,
                i = index < 0 ? max : one ? index : 0
            for (; i < max; i++) {
                option = options[i]
                //��ʽIE��reset�󲻻�ı�selected����Ҫ����i === index�ж�
                //���ǹ�������disabled��optionԪ�أ�����safari5�£��������selectΪdisable����ô�����к��Ӷ�disable
                //��˵�һ��Ԫ��Ϊdisable����Ҫ������Ƿ���ʽ������disable���丸�ڵ��disable���
                if ((option.selected || i === index) && !option.disabled) {
                    value = getter(option)
                    if (one) {
                        return value
                    }
                    //�ռ�����selectedֵ������鷵��
                    values.push(value)
                }
            }
            return values
        },
        "select:set": function(node, values, optionSet) {
            values = [].concat(values) //ǿ��ת��Ϊ����
            var getter = valHooks["option:get"]
            for (var i = 0, el; el = node.options[i++]; ) {
                if ((el.selected = values.indexOf(getter(el)) >= 0)) {
                    optionSet = true
                }
            }
            if (!optionSet) {
                node.selectedIndex = -1
            }
        }
    }
    */

    /************************************************************************
     *                                parseHTML                              *
     ************************************************************************/
    /*
    var rtagName = /<([\w:]+)/,
    //ȡ����tagName
        rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rcreate = W3C ? /[^\d\D]/ : /(<(?:script|link|style|meta|noscript))/ig,
        scriptTypes = oneObject("text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript", "text/vbscript"),
    //��Ҫ������Ƕ��ϵ�ı�ǩ
        rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/
    //parseHTML�ĸ�������
    var tagHooks = {
        area: [1, "<map>"],
        param: [1, "<object>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</table>"],
        legend: [1, "<fieldset>"],
        option: [1, "<select multiple='multiple'>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>"],
        td: [3, "<table><tbody><tr>"],
        //IE6-8����innerHTML���ɽڵ�ʱ������ֱ�Ӵ���no-scopeԪ����HTML5���±�ǩ
        _default: W3C ? [0, ""] : [1, "X<div>"] //div���Բ��ñպ�
    }
    tagHooks.optgroup = tagHooks.option
    tagHooks.tbody = tagHooks.tfoot = tagHooks.colgroup = tagHooks.caption = tagHooks.thead
    tagHooks.th = tagHooks.td

    var script = DOC.createElement("script")
    avalon.parseHTML = function(html) {
        if (typeof html !== "string") {
            html = html + ""
        }
        html = html.replace(rxhtml, "<$1></$2>").trim()
        var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase(),
        //ȡ�����ǩ��
            wrap = tagHooks[tag] || tagHooks._default,
            fragment = documentFragment.cloneNode(false),
            wrapper = domParser,
            firstChild, neo
        if (!W3C) { //fix IE
            html = html.replace(rcreate, "<br class=msNoScope>$1") //��link style script�ȱ�ǩ֮ǰ���һ������
        }
        wrapper.innerHTML = wrap[1] + html + (wrap[2] || "")
        var els = wrapper.getElementsByTagName("script")
        if (els.length) { //ʹ��innerHTML���ɵ�script�ڵ㲻�ᷢ��������ִ��text����
            for (var i = 0, el; el = els[i++]; ) {
                if (!el.type || scriptTypes[el.type]) { //���script�ڵ��MIME������ִ�нű�
                    neo = script.cloneNode(false) //FF����ʡ�Բ���
                    for (var j = 0, attr; attr = el.attributes[j++]; ) {
                        if (attr.specified) { //����������
                            neo[attr.name] = attr.value
                        }
                    }
                    neo.text = el.text //����ָ��,��Ϊ�޷���attributes�б�������
                    el.parentNode.replaceChild(neo, el) //�滻�ڵ�
                }
            }
        }
        //�Ƴ�����Ϊ�˷�����Ƕ��ϵ����ӵı�ǩ
        for (i = wrap[0]; i--; wrapper = wrapper.lastChild) {
        }
        if (!W3C) { //fix IE
            for (els = wrapper["getElementsByTagName"]("br"), i = 0; el = els[i++]; ) {
                if (el.className && el.className === "vmNoScope") {
                    el.parentNode.removeChild(el)
                }
            }
        }
        while (firstChild = wrapper.firstChild) { // ��wrapper�ϵĽڵ�ת�Ƶ��ĵ���Ƭ�ϣ�
            fragment.appendChild(firstChild)
        }
        return fragment
    }
    avalon.innerHTML = function(node, html) {
        if (!W3C && (!rcreate.test(html) && !rnest.test(html))) {
            try {
                node.innerHTML = html
                return
            } catch (e) {
            }
        }
        var a = this.parseHTML(html)
        this.clearHTML(node).appendChild(a)
    }
    avalon.clearHTML = function(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild)
        }
        return node
    }
    */
    /*********************************************************************
     *                           Observable                              *
     **********************************************************************/
    var Observable = {
        $watch: function(type, callback) {
            if (typeof callback === "function") {
                var callbacks = this.$events[type]
                if (callbacks) {
                    callbacks.push(callback)
                } else {
                    this.$events[type] = [callback]
                }
            } else { //���¿�ʼ������VM�ĵ�һ�ؼ����Եı䶯
                this.$events = this.$watch.backup
            }
            return this
        },
        $unwatch: function(type, callback) {
            var n = arguments.length
            if (n === 0) { //�ô�VM������$watch�ص���Ч��
                this.$watch.backup = this.$events
                this.$events = {}
            } else if (n === 1) {
                this.$events[type] = []
            } else {
                var callbacks = this.$events[type] || []
                var i = callbacks.length
                while (~--i < 0) {
                    if (callbacks[i] === callback) {
                        return callbacks.splice(i, 1)
                    }
                }
            }
            return this
        },
        $fire: function(type) {
            var callbacks = this.$events[type] || []
            var all = this.$events.$all || []
            var args = aslice.call(arguments, 1)
            for (var i = 0, callback; callback = callbacks[i++]; ) {
                callback.apply(this, args)
            }
            for (var i = 0, callback; callback = all[i++]; ) {
                callback.apply(this, arguments)
            }
        }
    }

    /*********************************************************************
     *                           �����ռ��봥��                                *
     **********************************************************************/

    function registerSubscriber(data) {
        Registry[expose] = data //����˺���,����collectSubscribers�ռ�
        avalon.openComputedCollect = true
        var fn = data.evaluator
        if (fn) { //�������ֵ����
            if (data.type === "duplex") {
                data.handler()
            } else {
                data.handler(fn.apply(0, data.args), data.element, data)
            }
        } else { //����Ǽ������Ե�accessor
            data()
        }
        avalon.openComputedCollect = false
        delete Registry[expose]
    }

    function collectSubscribers(accessor) { //�ռ�����������������Ķ�����
        if (Registry[expose]) {
            var list = accessor[subscribers]
            list && avalon.Array.ensure(list, Registry[expose]) //ֻ�����鲻���ڴ�Ԫ�ز�push��ȥ
        }
    }

    function notifySubscribers(accessor) { //֪ͨ����������������Ķ����߸�������
        var list = accessor[subscribers]
        if (list && list.length) {
            var args = aslice.call(arguments, 1)
            for (var i = list.length, fn; fn = list[--i]; ) {
                var el = fn.element,
                    remove
                if (el && !avalon.contains(ifSanctuary, el)) {
                    if (typeof el.sourceIndex == "number") { //IE6-IE11
                        remove = el.sourceIndex === 0
                    } else {
                        remove = !avalon.contains(root, el)
                    }
                    if (remove) { //�����û����DOM��
                        list.splice(i, 1)
                        log("Debug: remove " + fn.name)
                    }
                }
                if (typeof fn === "function") {
                    fn.apply(0, args) //ǿ�����¼�������
                } else if (fn.getter) {
                    fn.handler.apply(fn, args) //����������ķ���
                } else {
                    fn.handler(fn.evaluator.apply(0, fn.args || []), el, fn)
                }
            }
        }
    }

    /*********************************************************************
     *                           ɨ��ϵͳ                                 *
     **********************************************************************/
    avalon.scan = function(elem, vmodel) {
        elem = elem || root
        var vmodels = vmodel ? [].concat(vmodel) : []
        scanTag(elem, vmodels)
    }

    //http://www.w3.org/TR/html5/syntax.html#void-elements
    var stopScan = oneObject("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,script,style,textarea".toUpperCase())

    //ȷ��Ԫ�ص����ݱ���ȫɨ����Ⱦ��ϲŵ��ûص�
    var interval = W3C ? 15 : 50

    function checkScan(elem, callback) {
        var innerHTML = NaN,
            id = setInterval(function() {
                var currHTML = elem.innerHTML
                if (currHTML === innerHTML) {
                    clearInterval(id)
                    callback()
                } else {
                    innerHTML = currHTML
                }
            }, interval)
    }


    function scanTag(elem, vmodels, node) {
        //ɨ��˳��  vm-skip(0) --> vm-important(1) --> vm-controller(2) --> vm-if(10) --> vm-repeat(100) 
        //--> vm-if-loop(110) --> vm-attr(970) ...--> vm-each(1400)-->vm-with(1500)--��vm-duplex(2000)���
        var a = elem.getAttribute(prefix + "skip")
        var b = elem.getAttributeNode(prefix + "important")
        var c = elem.getAttributeNode(prefix + "controller")
        if (typeof a === "string") {
            return
        } else if (node = b || c) {
            var newVmodel = VMODELS[node.value]
            if (!newVmodel) {
                return
            }
            //vm-important��������VM��vm-controller�෴
            vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
            elem.removeAttribute(node.name) //removeAttributeNode����ˢ��[vm-controller]��ʽ����
            avalon(elem).removeClass(node.name) //����IE6
        }
        scanAttr(elem, vmodels) //ɨ�����Խڵ�
    }

    function scanNodes(parent, vmodels) {
        var node = parent.firstChild

        while (node) {
            var nextNode = node.nextSibling
            if (node.nodeType === 1) {
                scanTag(node, vmodels) //ɨ��Ԫ�ؽڵ�
            } else if (node.nodeType === 3 && rexpr.test(node.nodeValue)) {
                scanText(node, vmodels) //ɨ���ı��ڵ�
            }
            node = nextNode
        }
    }

    function scanText(textNode, vmodels) {
        var bindings = [],
            tokens = scanExpr(textNode.nodeValue)
        if (tokens.length) {
            for (var i = 0, token; token = tokens[i++]; ) {
                var node = DOC.createTextNode(token.value) //���ı�ת��Ϊ�ı��ڵ㣬���滻ԭ�����ı��ڵ�
                if (token.expr) {
                    var filters = token.filters
                    var binding = {
                        type: "text",
                        node: node,
                        nodeType: 3,
                        value: token.value,
                        filters: filters
                    }
                    if (filters && filters.indexOf("html") !== -1) {
                        avalon.Array.remove(filters, "html")
                        binding.type = "html"
                        binding.replaceNodes = [node]
                        if (!filters.length) {
                            delete bindings.filters
                        }
                    }
                    bindings.push(binding) //�ռ����в�ֵ���ʽ���ı�
                }
                documentFragment.appendChild(node)
            }
            textNode.parentNode.replaceChild(documentFragment, textNode)
            if (bindings.length)
                executeBindings(bindings, vmodels)
        }
    }

    var rmsAttr = /vm-(\w+)-?(.*)/
    var priorityMap = {
        "if": 10,
        "repeat": 100,
        "each": 1400,
        "with": 1500,
        "duplex": 2000
    }

    function scanAttr(elem, vmodels) {
        var attributes = getAttributes ? getAttributes(elem) : elem.attributes
        var bindings = [],
            msData = {},
            match
        for (var i = 0, attr; attr = attributes[i++]; ) {
            if (attr.specified) {
                if (match = attr.name.match(rmsAttr)) {
                    //�������ָ��ǰ׺������
                    var type = match[1]
                    msData[attr.name] = attr.value
                    if (typeof bindingHandlers[type] === "function") {
                        var param = match[2] || ""
                        var binding = {
                            type: type,
                            param: param,
                            element: elem,
                            name: match[0],
                            value: attr.value,
                            priority: type in priorityMap ? priorityMap[type] : type.charCodeAt(0) * 10 + (Number(param) || 0)
                        }

                        if (type === "if" && param.indexOf("loop") > -1) {
                            binding.priority += 100
                        }
                        if (type === "widget") {
                            bindings.push(binding)
                            elem.msData = elem.msData || msData
                        } else if (vmodels.length) {
                            bindings.push(binding)
                        }
                    }
                }
            }
        }
        bindings.sort(function(a, b) {
            return a.priority - b.priority
        })
        if (msData["vm-checked"] && msData["vm-duplex"]) {
            log("warning!һ��Ԫ���ϲ���ͬʱ����vm-checked��vm-duplex")
        }
        var firstBinding = bindings[0] || {}
        switch (firstBinding.type) {
            case "if":
            case "repeat":
                executeBindings([firstBinding], vmodels)
                break
            default:
                executeBindings(bindings, vmodels)
                if (!stopScan[elem.tagName] && rbind.test(elem.innerHTML)) {
                    scanNodes(elem, vmodels) //ɨ������Ԫ��
                }
                break;
        }

        if (elem.patchRepeat) {
            elem.patchRepeat()
            elem.patchRepeat = null
        }

    }
    //IE67�£���ѭ�����У�һ���ڵ������ͨ��cloneNode�õ����Զ������Ե�specifiedΪfalse���޷���������ķ�֧��
    //���������ȥ��scanAttr�е�attr.specified��⣬һ��Ԫ�ػ���80+�����Խڵ㣨��Ϊ�������ֹ����������Զ������ԣ��������׿���ҳ��
    if (!"1" [0]) {
        var cacheAttr = createCache(512)
        var rattrs = /\s+(vm-[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g,
            rquote = /^['"]/,
            rtag = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/i
        var getAttributes = function(elem) {
            if (elem.outerHTML.slice(0, 2) == "</") { //�����ʽIEģ��HTML5��Ԫ�ش�����α��ǩ
                return []
            }
            var str = elem.outerHTML.match(rtag)[0]
            var attributes = [],
                match,
                k, v;
            if (cacheAttr[str]) {
                return cacheAttr[str]
            }
            while (k = rattrs.exec(str)) {
                v = k[2]
                var name = k[1].toLowerCase()
                match = name.match(rmsAttr)
                var binding = {
                    name: name,
                    specified: true,
                    value: v ? rquote.test(v) ? v.slice(1, -1) : v : ""
                }
                attributes.push(binding)
            }
            return cacheAttr(str, attributes)
        }
    }

    function executeBindings(bindings, vmodels) {
        for (var i = 0, data; data = bindings[i++]; ) {
            data.vmodels = vmodels
            bindingHandlers[data.type](data, vmodels)

            if (data.evaluator && data.name) { //�Ƴ����ݰ󶨣���ֹ�����ν���
                //chromeʹ��removeAttributeNode�Ƴ������ڵ����Խڵ�ʱ�ᱨ�� https://github.com/RubyLouvre/avalon/issues/99
                data.element.removeAttribute(data.name)
            }
        }
        bindings.length = 0
    }


    var rfilters = /\|\s*(\w+)\s*(\([^)]*\))?/g,
        r11a = /\|\|/g,
        r11b = /U2hvcnRDaXJjdWl0/g

    function scanExpr(str) {
        var tokens = [],
            value, start = 0,
            stop
        do {
            stop = str.indexOf(openTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { // {{ ��ߵ��ı�
                tokens.push({
                    value: value,
                    expr: false
                })
            }
            start = stop + openTag.length
            stop = str.indexOf(closeTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { //����{{ }}��ֵ���ʽ
                var leach = []
                if (value.indexOf("|") > 0) { // ��ȡ������ ���滻�����ж�·��
                    value = value.replace(r11a, "U2hvcnRDaXJjdWl0") //btoa("ShortCircuit")
                    value = value.replace(rfilters, function(c, d, e) {
                        leach.push(d + (e || ""))
                        return ""
                    })
                    value = value.replace(r11b, "||") //��ԭ��·��
                }
                tokens.push({
                    value: value,
                    expr: true,
                    filters: leach.length ? leach : void 0
                })
            }
            start = stop + closeTag.length
        } while (1)
        value = str.slice(start)
        if (value) { //}} �ұߵ��ı�
            tokens.push({
                value: value,
                expr: false
            })
        }

        return tokens
    }
    /*********************************************************************
     *                          ����ģ��                                  *
     **********************************************************************/

    var keywords =
        // �ؼ���
        "break,case,catch,continue,debugger,default,delete,do,else,false" + ",finally,for,function,if,in,instanceof,new,null,return,switch,this" + ",throw,true,try,typeof,var,void,while,with"
            // ������
            + ",abstract,boolean,byte,char,class,const,double,enum,export,extends" + ",final,float,goto,implements,import,int,interface,long,native" + ",package,private,protected,public,short,static,super,synchronized" + ",throws,transient,volatile"

            // ECMA 5 - use strict
            + ",arguments,let,yield"

            + ",undefined"
    var rrexpstr = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g
    var rsplit = /[^\w$]+/g
    var rkeywords = new RegExp(["\\b" + keywords.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g')
    var rnumber = /\b\d[^,]*/g
    var rcomma = /^,+|,+$/g
    var getVariables = function(code) {
        code = code
            .replace(rrexpstr, "")
            .replace(rsplit, ",")
            .replace(rkeywords, "")
            .replace(rnumber, "")
            .replace(rcomma, "")

        return code ? code.split(/,+/) : []
    }

    //��Ӹ�ֵ���

    function addAssign(vars, scope, name, duplex) {
        var ret = [],
            prefix = " = " + name + "."
        for (var i = vars.length, prop; prop = vars[--i]; ) {
            if (scope.hasOwnProperty && scope.hasOwnProperty(prop)) { //IE6�½ڵ�û��hasOwnProperty
                ret.push(prop + prefix + prop)
                if (duplex === "duplex") {
                    vars.get = name + "." + prop
                }
                vars.splice(i, 1)
            }
        }
        return ret
    }

    function uniqArray(arr, vm) {
        var length = arr.length
        if (length <= 1) {
            return arr
        } else if (length === 2) {
            return arr[0] !== arr[1] ? arr : [arr[0]]
        }
        var uniq = {}
        return arr.filter(function(el) {
            var key = vm ? el && el.$id : el
            if (!uniq[key]) {
                uniq[key] = 1
                return true
            }
            return false
        })
    }
    //������ֵ�������Ա�������

    function createCache(maxLength) {
        var keys = []

        function cache(key, value) {
            if (keys.push(key) > maxLength) {
                delete cache[keys.shift()]
            }
            return cache[key] = value;
        }
        return cache;
    }
    var cacheExpr = createCache(256)
    //ȡ����ֵ�������䴫��
    var rduplex = /\w\[.*\]|\w\.\w/
    var rproxy = /(\$proxy\$[a-z]+)\d+$/
    function parseExpr(code, scopes, data, four) {
        var dataType = data.type
        var filters = dataType == "html" || dataType === "text" ? data.filters : ""
        var exprId = scopes.map(function(el) {
            return el.$id.replace(rproxy, "$1")
        }) + code + dataType + filters
        var vars = getVariables(code),
            assigns = [],
            names = [],
            args = [],
            prefix = ""
        //args ��һ���������飬 names �ǽ�Ҫ���ɵ���ֵ�����Ĳ���
        vars = uniqArray(vars), scopes = uniqArray(scopes, 1)
        for (var i = 0, sn = scopes.length; i < sn; i++) {
            if (vars.length) {
                var name = "vm" + expose + "_" + i
                names.push(name)
                args.push(scopes[i])
                assigns.push.apply(assigns, addAssign(vars, scopes[i], name, four))
            }
        }
        //---------------args----------------
        if (filters) {
            args.push(avalon.filters)
        }
        data.args = args
        //---------------cache----------------
        var fn = cacheExpr[exprId] //ֱ�Ӵӻ��棬����ظ�����
        if (fn) {
            data.evaluator = fn
            return
        }
        var prefix = assigns.join(", ")
        if (prefix) {
            prefix = "var " + prefix
        }
        if (filters) {//�ı��󶨣�˫���󶨲��й�����
            code = "\nvar ret" + expose + " = " + code
            var textBuffer = [],
                fargs
            textBuffer.push(code, "\r\n")
            for (var i = 0, fname; fname = data.filters[i++]; ) {
                var start = fname.indexOf("(")
                if (start !== -1) {
                    fargs = fname.slice(start + 1, fname.lastIndexOf(")")).trim()
                    fargs = "," + fargs
                    fname = fname.slice(0, start).trim()
                } else {
                    fargs = ""
                }
                textBuffer.push(" if(filters", expose, ".", fname, "){\n\ttry{\nret", expose,
                    " = filters", expose, ".", fname, "(ret", expose, fargs, ")\n\t}catch(e){} \n}\n")
            }
            code = textBuffer.join("")
            code += "\nreturn ret" + expose
            names.push("filters" + expose)
        } else if (dataType === "duplex") {//˫����
            var _body = "'use strict';\nreturn function(vvv){\n\t" +
                prefix +
                ";\n\tif(!arguments.length){\n\t\treturn " +
                code +
                "\n\t}\n\t" + (!rduplex.test(code) ? vars.get : code) +
                "= vvv;\n} "
            try {
                fn = Function.apply(noop, names.concat(_body))
                data.evaluator = cacheExpr(exprId, fn)
            } catch (e) {
            }
            return
        } else if (dataType === "on") {//�¼���
            code = code.replace("(", ".call(this,")
            if (four === "$event") {
                names.push(four)
            }
            code = "\nreturn " + code + ";" //IEȫ�� Function("return ")������ҪFunction("return ;")
            var lastIndex = code.lastIndexOf("\nreturn")
            var header = code.slice(0, lastIndex)
            var footer = code.slice(lastIndex)
            code = header + "\nif(avalon.openComputedCollect) return ;" + footer
        } else {//������
            code = "\nreturn " + code + ";" //IEȫ�� Function("return ")������ҪFunction("return ;")
        }
        try {
            fn = Function.apply(noop, names.concat("'use strict';\n" + prefix + code))
            if (data.type !== "on") {
                fn.apply(fn, args)
            }
            data.evaluator = cacheExpr(exprId, fn)
        } catch (e) {
            log("Debug:" + e.message)
        } finally {
            vars = textBuffer = names = null //�ͷ��ڴ�
        }
    }

    //parseExpr���������ô���

    function parseExprProxy(code, scopes, data, tokens) {
        if (Array.isArray(tokens)) {
            var array = tokens.map(function(token) {
                var tmpl = {}
                return token.expr ? parseExpr(token.value, scopes, tmpl) || tmpl : token.value
            })
            data.evaluator = function() {
                var ret = ""
                for (var i = 0, el; el = array[i++]; ) {
                    ret += typeof el === "string" ? el : el.evaluator.apply(0, el.args)
                }
                return ret
            }
            data.args = []
        } else {
            parseExpr(code, scopes, data, tokens)
        }
        if (data.evaluator) {
            data.handler = bindingExecutors[data.handlerName || data.type]
            data.evaluator.toString = function() {
                return data.type + " binding to eval(" + code + ")"
            }
            //�������
            //����ǳ���Ҫ,����ͨ���ж���ͼˢ�º�����element�Ƿ���DOM������
            //�����Ƴ��������б�
            registerSubscriber(data)
        }
    }
    avalon.parseExprProxy = parseExprProxy
    /*********************************************************************
     *��ģ�飨ʵ�֡��������ݼ�����DOM���Ĺؼ�����DOM���������ǰ�˿�����Ա����Ұ���������ɿ�����д���������Աר����ҵ���� *                                 *
     **********************************************************************/
    /*
    var cacheDisplay = oneObject("a,abbr,b,span,strong,em,font,i,kbd", "inline")
    avalon.mix(cacheDisplay, oneObject("div,h1,h2,h3,h4,h5,h6,section,p", "block"))

    function parseDisplay(nodeName, val) {
        //����ȡ�ô����ǩ��Ĭ��displayֵ
        nodeName = nodeName.toLowerCase()
        if (!cacheDisplay[nodeName]) {
            var node = DOC.createElement(nodeName)
            root.appendChild(node)
            if (window.getComputedStyle) {
                val = window.getComputedStyle(node, null).display
            } else {
                val = node.currentStyle.display
            }
            root.removeChild(node)
            cacheDisplay[nodeName] = val
        }
        return cacheDisplay[nodeName]
    }
    avalon.parseDisplay = parseDisplay
    */
    var parseDisplay = avalon.parseDisplay
    var supportDisplay = (function(td) {
        return window.getComputedStyle ?
            window.getComputedStyle(td, null).display === "table-cell" : true
    })(DOC.createElement("td"))
    var domParser = DOC.createElement("div")
    domParser.setAttribute("className", "t")
    var fuckIEAttr = domParser.className === "t"
    var propMap = {
        "class": "className",
        "for": "htmlFor"
    }
    var rdash = /\(([^)]*)\)/

    var styleEl = '<style id="avalonStyle">.avalonHide{ display: none!important }</style>'
    styleEl = avalon.parseHTML(styleEl).firstChild //IE6-8 head��ǩ��innerHTML��ֻ����
    head.insertBefore(styleEl, null) //����IE6 base��ǩBUG
    var rnoscripts = /<noscript.*?>(?:[\s\S]+?)<\/noscript>/img
    var rnoscriptText = /<noscript.*?>([\s\S]+?)<\/noscript>/im

    var getXHR = function() {
        return new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP")
    }
    var getBindingCallback = function(elem, name, vmodels) {
        var callback = elem.getAttribute(name)
        if (callback) {
            for (var i = 0, vm; vm = vmodels[i++]; ) {
                if (vm.hasOwnProperty(callback) && typeof vm[callback] === "function") {
                    return vm[callback]
                }
            }
        }
    }
    var includeContents = {}
    var ifSanctuary = DOC.createElement("div")
    ifSanctuary.innerHTML = "a"
/*
    try {
        ifSanctuary.contains(ifSanctuary.firstChild)
        avalon.contains = function(a, b) {
            return a.contains(b)
        }
    } catch (e) {
        avalon.contains = fixContains
    }
*/
    //����ĺ���ÿ��VM�����ı�󣬶��ᱻִ�У�������ΪnotifySubscribers��
    var bindingExecutors = avalon.bindingExecutors = {
        "attr": function(val, elem, data) {
            var method = data.type,
                attrName = data.param
            if (method === "css") {
                avalon(elem).css(attrName, val)
            } else if (method === "attr") {
                // vm-attr-class="xxx" vm.xxx="aaa bbb ccc"��Ԫ�ص�className����Ϊaaa bbb ccc
                // vm-attr-class="xxx" vm.xxx=false  ���Ԫ�ص���������
                // vm-attr-name="yyy"  vm.yyy="ooo" ΪԪ������name����
                var toRemove = (val === false) || (val === null) || (val === void 0)
                if (toRemove)
                    elem.removeAttribute(attrName)
                if (fuckIEAttr && attrName in propMap) {
                    attrName = propMap[attrName]
                    if (toRemove) {
                        elem.removeAttribute(attrName)
                    } else {
                        elem[attrName] = val
                    }
                } else if (!toRemove) {
                    elem.setAttribute(attrName, val)
                }
            } else if (method === "include" && val) {
                var vmodels = data.vmodels
                var rendered = getBindingCallback(elem, "data-include-rendered", vmodels)
                var loaded = getBindingCallback(elem, "data-include-loaded", vmodels)

                function scanTemplate(text) {
                    if (loaded) {
                        text = loaded.apply(elem, [text].concat(vmodels))
                    }
                    avalon.innerHTML(elem, text)
                    scanNodes(elem, vmodels)
                    rendered && checkScan(elem, function() {
                        rendered.call(elem)
                    })
                }
                if (data.param === "src") {
                    if (includeContents[val]) {
                        scanTemplate(includeContents[val])
                    } else {
                        var xhr = getXHR()
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                var s = xhr.status
                                if (s >= 200 && s < 300 || s === 304 || s === 1223) {
                                    scanTemplate(includeContents[val] = xhr.responseText)
                                }
                            }
                        }
                        xhr.open("GET", val, true)
                        if ("withCredentials" in xhr) {
                            xhr.withCredentials = true
                        }
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
                        xhr.send(null)
                    }
                } else {
                    //IEϵ���빻�µı�׼�����֧��ͨ��IDȡ��Ԫ�أ�firefox14+��
                    //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
                    var el = val && val.nodeType == 1 ? val : DOC.getElementById(val)
                    if (el) {
                        if (el.tagName === "NOSCRIPT" && !(el.innerHTML || el.fixIE78)) { //IE7-8 innerText,innerHTML���޷�ȡ�������ݣ�IE6��ȡ����innerHTML
                            var xhr = getXHR() //IE9-11��chrome��innerHTML��õ�ת������ݣ����ǵ�innerText����
                            xhr.open("GET", location, false) //ллNodejs ����Ⱥ ����-�����鹹
                            xhr.send(null)
                            //http://bbs.csdn.net/topics/390349046?page=1#post-393492653
                            var noscripts = DOC.getElementsByTagName("noscript")
                            var array = (xhr.responseText || "").match(rnoscripts) || []
                            var n = array.length
                            for (var i = 0; i < n; i++) {
                                var tag = noscripts[i]
                                if (tag) { //IE6-8��noscript��ǩ��innerHTML,innerText��ֻ����
                                    tag.style.display = "none" //http://haslayout.net/css/noscript-Ghost-Bug
                                    tag.fixIE78 = (array[i].match(rnoscriptText) || ["", "&nbsp;"])[1]
                                }
                            }
                        }
                        avalon.nextTick(function() {
                            scanTemplate(el.fixIE78 || el.innerText || el.innerHTML)
                        })
                    }
                }
            } else {
                if (!root.hasAttribute && typeof val === "string" && (method === "src" || method === "href")) {
                    val = val.replace(/&amp;/g, "&") //����IE67�Զ�ת�������
                }
                elem[method] = val
            }
        },
        "class": function(val, elem, data) {
            var $elem = avalon(elem),
                method = data.type
            if (method === "class" && data.param) { //����Ǿɷ��
                $elem.toggleClass(data.param, !!val)
            } else {
                var toggle = data._evaluator ? !!data._evaluator.apply(elem, data._args) : true
                var className = data._class || val
                switch (method) {
                    case "class":
                        if (toggle && data.oldClass) {
                            $elem.removeClass(data.oldClass)
                        }
                        $elem.toggleClass(className, toggle)
                        data.oldClass = className
                        break;
                    case "hover":
                    case "active":
                        if (!data.init) { //ȷ��ֻ��һ��
                            if (method === "hover") { //���Ƴ�����ʱ�л�����
                                var event1 = "mouseenter",
                                    event2 = "mouseleave"
                            } else { //�ھ۽�ʧ�����л�����
                                elem.tabIndex = elem.tabIndex || -1
                                event1 = "mousedown", event2 = "mouseup"
                                $elem.bind("mouseleave", function() {
                                    toggle && $elem.removeClass(className)
                                })
                            }
                            $elem.bind(event1, function() {
                                toggle && $elem.addClass(className)
                            })
                            $elem.bind(event2, function() {
                                toggle && $elem.removeClass(className)
                            })
                            data.init = 1
                        }
                        break;
                }
            }
        },
        "data": function(val, elem, data) {
            var key = "data-" + data.param
            if (val && typeof val === "object") {
                elem[key] = val
            } else {
                elem.setAttribute(key, String(val))
            }
        },
        "checked": function(val, elem, data) {
            var name = data.type;
            if (name === "enabled") {
                elem.disabled = !val
            } else {
                var propName = name === "readonly" ? "readOnly" : name
                elem[propName] = !!val
            }
        },
        "each": function(method, pos, el) {
            if (method) {
                var data = this
                var group = data.group
                var pp = data.startRepeat && data.startRepeat.parentNode
                if (pp) { //fix  #300 #307
                    data.parent = pp
                }
                var parent = data.parent
                var proxies = data.proxies
                if (method === "del" || method === "move") {
                    var locatedNode = getLocatedNode(parent, data, pos)
                }
                switch (method) {
                    case "add": //��posλ�ú����el���飨posΪ���֣�elΪ���飩
                        var arr = el
                        var last = data.getter().length - 1
                        var transation = documentFragment.cloneNode(false)
                        var spans = [],
                            lastFn = {}
                        for (var i = 0, n = arr.length; i < n; i++) {
                            var ii = i + pos
                            var proxy = createEachProxy(ii, arr[i], data, last)
                            proxies.splice(ii, 0, proxy)
                            lastFn = shimController(data, transation, spans, proxy)
                        }
                        locatedNode = getLocatedNode(parent, data, pos)
                        lastFn.node = locatedNode
                        lastFn.parent = parent
                        parent.insertBefore(transation, locatedNode)
                        for (var i = 0, node; node = spans[i++]; ) {
                            scanTag(node, data.vmodels)
                        }
                        spans = null
                        break
                    case "del": //��pos���el��Ԫ��ɾ��(pos, el��������)
                        proxies.splice(pos, el) //�Ƴ���Ӧ����VM
                        removeFromSanctuary(removeView(locatedNode, group, el))
                        break
                    case "index": //��proxies�еĵ�pos���������Ԫ������������posΪ���֣�el����ѭ��������
                        var last = proxies.length - 1
                        for (; el = proxies[pos]; pos++) {
                            el.$index = pos
                            el.$first = pos === 0
                            el.$last = pos === last
                        }
                        break
                    case "clear":
                        var deleteFragment = documentFragment.cloneNode(false)
                        if (data.startRepeat) {
                            while (true) {
                                var node = data.startRepeat.nextSibling
                                if (node && node !== data.endRepeat) {
                                    deleteFragment.appendChild(node)
                                } else {
                                    break
                                }
                            }
                        } else {
                            while (parent.firstChild) {
                                deleteFragment.appendChild(parent.firstChild)
                            }
                        }
                        removeFromSanctuary(deleteFragment)
                        proxies.length = 0
                        break
                    case "move": //��proxies�еĵ�pos��Ԫ���ƶ�elλ����(pos, el��������)
                        var t = proxies.splice(pos, 1)[0]
                        if (t) {
                            proxies.splice(el, 0, t)
                            var moveNode = removeView(locatedNode, group)
                            locatedNode = getLocatedNode(parent, data, el)
                            parent.insertBefore(moveNode, locatedNode)
                        }
                        break
                    case "set": //��proxies�еĵ�pos��Ԫ�ص�VM����Ϊel��posΪ���֣�el���⣩
                        var proxy = proxies[pos]
                        if (proxy) {
                            proxy[proxy.$itemName] = el
                        }
                        break
                    case "append": //��pos�ļ�ֵ�Դ�el��ȡ����posΪһ����ͨ����elΪԤ�����ɺõĴ���VM����أ�
                        var pool = el
                        var transation = documentFragment.cloneNode(false)
                        var callback = getBindingCallback(data.callbackElement, "data-with-sorted", data.vmodels)
                        var keys = [],
                            spans = [],
                            lastFn = {}
                        for (var key in pos) { //�õ����м���
                            if (pos.hasOwnProperty(key) && key !== "hasOwnProperty") {
                                keys.push(key)
                            }
                        }
                        if (callback) { //����лص���������������
                            var keys2 = callback.call(parent, keys)
                            if (keys2 && Array.isArray(keys2) && keys2.length) {
                                keys = keys2
                            }
                        }
                        for (var i = 0, key; key = keys[i++]; ) {
                            if (key !== "hasOwnProperty") {
                                lastFn = shimController(data, transation, spans, pool[key])
                            }
                        }
                        lastFn.parent = parent
                        lastFn.node = data.endRepeat || null
                        parent.insertBefore(transation, lastFn.node)
                        for (var i = 0, el; el = spans[i++]; ) {
                            scanTag(el, data.vmodels)
                        }
                        spans = null
                        break
                }
                iteratorCallback.call(data, arguments)
            }
        },
        "html": function(val, elem, data) {
            val = val == null ? "" : val
            if (!elem) {
                elem = data.element = data.node.parentNode
            }
            if (data.replaceNodes) {
                var fragment, nodes
                if (val.nodeType === 11) {
                    fragment = val
                } else if (val.nodeType === 1 || val.item) {
                    nodes = val.nodeType === 1 ? val.childNodes : val.item ? val : []
                    fragment = documentFragment.cloneNode(true)
                    while (nodes[0]) {
                        fragment.appendChild(nodes[0])
                    }
                } else {
                    fragment = avalon.parseHTML(val)
                }
                var replaceNodes = avalon.slice(fragment.childNodes)
                elem.insertBefore(fragment, data.replaceNodes[0] || null) //fix IE6-8 insertBefore�ĵ�2������ֻ��Ϊ�ڵ��null
                for (var i = 0, node; node = data.replaceNodes[i++]; ) {
                    elem.removeChild(node)
                }
                data.replaceNodes = replaceNodes
            } else {
                avalon.innerHTML(elem, val)
            }
            avalon.nextTick(function() {
                scanNodes(elem, data.vmodels)
            })
        },
        "if": function(val, elem, data) {
            var placehoder = data.placehoder
            if (val) { //���DOM��
                if (!data.msInDocument) {
                    data.msInDocument = true
                    try {
                        placehoder.parentNode.replaceChild(elem, placehoder)
                    } catch (e) {
                        avalon.log("Debug: vm-if  " + e.message)
                    }
                }
                if (rbind.test(elem.outerHTML)) {
                    scanAttr(elem, data.vmodels)
//                    if (data.param.indexOf("once") >= 0) {
//                        data.handler = noop
//                    }
                }
            } else { //�Ƴ�DOM�����Ž�ifSanctuary DIV�У�����ע�ͽڵ�ռ��ԭλ��

                if (data.msInDocument) {
                    data.msInDocument = false
                    elem.parentNode.replaceChild(placehoder, elem)
                    placehoder.elem = elem
                    ifSanctuary.appendChild(elem)
                }
            }
        },
        "on": function(callback, elem, data) {
            var fn = data.evaluator
            var args = data.args
            var vmodels = data.vmodels
            if (!data.hasArgs) {
                callback = function(e) {
                    return fn.apply(0, args).call(this, e)
                }
            } else {
                callback = function(e) {
                    return fn.apply(this, args.concat(e))
                }
            }
            elem.$vmodel = vmodels[0]
            elem.$vmodels = vmodels
            if (typeof data.specialBind === "function") {
                data.specialBind(elem, callback)
            } else {
                var removeFn = avalon.bind(elem, data.param, callback)
            }
            data.rollback = function() {
                if (typeof data.specialUnbind === "function") {
                    data.specialUnbind()
                } else {
                    avalon.unbind(elem, data.param, removeFn)
                }
            }
            data.evaluator = data.handler = noop
        },
        "text": function(val, elem, data) {
            val = val == null ? "" : val //����ҳ������ʾundefined null
            if (data.nodeType === 3) { //�����ı��ڵ���
                data.node.data = val
            } else { //�������Խڵ���
                if (!elem) {
                    elem = data.element = data.node.parentNode
                }
                if ("textContent" in elem) {
                    elem.textContent = val
                } else {
                    elem.innerText = val
                }
            }
        },
        "visible": function(val, elem, data) {
            elem.style.display = val ? data.display : "none"
        },
        "widget": noop
    }
    var rwhitespace = /^\s+$/
    //����ĺ���ֻ���ڵ�һ�α�ɨ���ִ��һ�Σ����Ž��ж�ӦVM���Ե�subscribers�����ڣ�������ΪregisterSubscriber��
    var bindingHandlers = avalon.bindingHandlers = {
        //����һ���ַ������԰󶨵ķ���, ��������title, alt,  src, href, include, css��Ӳ�ֵ���ʽ
        //<a vm-href="{{url.hostname}}/{{url.pathname}}.html">
        "attr": function(data, vmodels) {
            var text = data.value.trim(),
                simple = true
            if (text.indexOf(openTag) > -1 && text.indexOf(closeTag) > 2) {
                simple = false
                if (rexpr.test(text) && RegExp.rightContext === "" && RegExp.leftContext === "") {
                    simple = true
                    text = RegExp.$1
                }
            }
            data.handlerName = "attr" //handleName���ڴ�����ְ󶨹���ͬһ��bindingExecutor�����
            parseExprProxy(text, vmodels, data, (simple ? null : scanExpr(data.value)))
        },
        "checked": function(data, vmodels) {
            data.handlerName = "checked"
            parseExprProxy(data.value, vmodels, data)
        },
        //����VM������ֵ����ʽ��ֵ�л�������vm-class="xxx yyy zzz:flag" 
        //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
        "class": function(data, vmodels) {
            var oldStyle = data.param,
                text = data.value,
                rightExpr
            data.handlerName = "class"
            if (!oldStyle || isFinite(oldStyle)) {
                data.param = "" //ȥ������
                var noExpr = text.replace(rexprg, function(a) {
                    return Math.pow(10, a.length - 1) //����ֵ���ʽ����10��N-1�η���ռλ
                })
                var colonIndex = noExpr.indexOf(":") //ȡ�õ�һ��ð�ŵ�λ��
                if (colonIndex === -1) { // ���� vm-class="aaa bbb ccc" �����
                    var className = text
                } else { // ���� vm-class-1="ui-state-active:checked" ����� 
                    className = text.slice(0, colonIndex)
                    rightExpr = text.slice(colonIndex + 1)
                    parseExpr(rightExpr, vmodels, data) //��������ӻ���ɾ��
                    if (!data.evaluator) {
                        log("Debug: vm-class '" + (rightExpr || "").trim() + "' ��������VM��")
                        return false
                    } else {
                        data._evaluator = data.evaluator
                        data._args = data.args
                    }
                }
                var hasExpr = rexpr.test(className) //����vm-class="width{{w}}"�����
                if (!hasExpr) {
                    data._class = className
                }
                parseExprProxy("", vmodels, data, (hasExpr ? scanExpr(className) : null))
            } else if (data.type === "class") {
                parseExprProxy(text, vmodels, data)
            }
        },
        "duplex": function(data, vmodels) {
            var elem = data.element,
                tagName = elem.tagName
            if (typeof modelBinding[tagName] === "function") {
                data.changed = getBindingCallback(elem, "data-duplex-changed", vmodels) || noop
                //����������⣬���پ���parseExprProxy
                parseExpr(data.value, vmodels, data, "duplex")
                if (data.evaluator && data.args) {
                    var form = elem.form
                    if (form && form.msValidate) {
                        form.msValidate(elem)
                    }
                    modelBinding[elem.tagName](elem, data.evaluator.apply(null, data.args), data)
                }
            }
        },
        "each": function(data, vmodels) {
            var type = data.type,
                elem = data.element,
                list
            parseExpr(data.value, vmodels, data)
            data.getter = function() {
                return this.evaluator.apply(0, this.args || [])
            }
            data.handler = bindingExecutors.each
            data.callbackName = "data-" + (type || "each") + "-rendered"
            if (type !== "repeat") {
                avalon.log("Warning:����ʹ��vm-repeat����vm-each, vm-with, vm-repeatֻռ��һ����ǩ�������ܸ���")
            }
            data.callbackElement = data.parent = elem
            var freturn = true
            try {
                list = data.getter()
                if (rchecktype.test(getType(list))) {
                    freturn = false
                }
            } catch (e) {
            }
            var check0 = "$key",
                check1 = "$val"
            if (Array.isArray(list)) {
                check0 = "$first"
                check1 = "$last"
            }
            for (var i = 0, p; p = vmodels[i++]; ) {
                if (p.hasOwnProperty(check0) && p.hasOwnProperty(check1)) {
                    data.$outer = p
                    break
                }
            }
            data.$outer = data.$outer || {}
            var template = documentFragment.cloneNode(false)
            if (type === "repeat") {
                var startRepeat = DOC.createComment("vm-repeat-start")
                var endRepeat = DOC.createComment("vm-repeat-end")
                data.element = data.parent = elem.parentNode
                data.startRepeat = startRepeat
                data.endRepeat = endRepeat
                elem.removeAttribute(data.name)
                data.parent.replaceChild(endRepeat, elem)
                data.parent.insertBefore(startRepeat, endRepeat)
                template.appendChild(elem)
            } else {
                var node
                while (node = elem.firstChild) {
                    if (node.nodeType === 3 && rwhitespace.test(node.data)) {
                        elem.removeChild(node)
                    } else {
                        template.appendChild(node)
                    }
                }
            }
            data.proxies = []
            data.template = template
            node = template.firstChild
            data.fastRepeat = node.nodeType === 1 && template.lastChild === node && !node.attributes["vm-controller"] && !node.attributes["vm-important"]
            if (freturn) {
                return
            }
            list[subscribers] && list[subscribers].push(data)
            if (!Array.isArray(list) && type !== "each") {
                var pool = withProxyPool[list.$id]
                if (!pool) {
                    withProxyCount++
                    pool = withProxyPool[list.$id] = {}
                    for (var key in list) {
                        if (list.hasOwnProperty(key) && key !== "hasOwnProperty") {
                            (function(k, v) {
                                pool[k] = createWithProxy(k, v, data.$outer)
                                pool[k].$watch("$val", function(val) {
                                    list[k] = val //#303
                                })
                            })(key, list[key])
                        }
                    }
                }
                data.rollback = function() {
                    bindingExecutors.each.call(data, "clear")
                    var endRepeat = data.endRepeat
                    var parent = data.parent
                    parent.insertBefore(data.template, endRepeat || null)
                    if (endRepeat) {
                        parent.removeChild(endRepeat)
                        parent.removeChild(data.startRepeat)
                        data.element = data.callbackElement
                    }
                }
                data.handler("append", list, pool)
            } else {
                data.handler("add", 0, list)
            }
        },
        "html": function(data, vmodels) {
            parseExprProxy(data.value, vmodels, data)
        },
        "if": function(data, vmodels) {
            var elem = data.element
            elem.removeAttribute(data.name)
            if (!data.placehoder) {
                data.msInDocument = data.placehoder = DOC.createComment("vm-if")
            }
            data.vmodels = vmodels
            parseExprProxy(data.value, vmodels, data)

        },
        "on": function(data, vmodels) {
            var value = data.value,
                four = "$event"
            if (value.indexOf("(") > 0 && value.indexOf(")") > -1) {
                var matched = (value.match(rdash) || ["", ""])[1].trim()
                if (matched === "" || matched === "$event") { // aaa() aaa($event)����aaa����
                    four = void 0
                    value = value.replace(rdash, "")
                }
            } else {
                four = void 0
            }
            data.type = "on"
            data.hasArgs = four
            data.handlerName = "on"
            parseExprProxy(value, vmodels, data, four)
        },
        "visible": function(data, vmodels) {
            var elem = data.element
            if (!supportDisplay && !root.contains(elem)) { //fuck firfox ȫ�ң�
                var display = parseDisplay(elem.tagName)
            }
            display = display || avalon(elem).css("display")
            data.display = display === "none" ? parseDisplay(elem.tagName) : display
            parseExprProxy(data.value, vmodels, data)
        },
        "widget": function(data, vmodels) {
            var args = data.value.match(rword),
                element = data.element,
                widget = args[0],
                vmOptions = {}

            if (args[1] === "$") {
                args[1] = void 0
            }
            if (!args[1]) {
                args[1] = widget + setTimeout("1")
            }
            data.value = args.join(",")
            var constructor = avalon.ui[widget]
            if (typeof constructor === "function") { //vm-widget="tabs,tabsAAA,optname"
                vmodels = element.vmodels || vmodels
                for (var i = 0, v; v = vmodels[i++]; ) {
                    if (VMODELS[v.$id]) { //ȡ������������û������VM
                        var nearestVM = v
                        break
                    }
                }
                var optName = args[2] || widget //���Ի������������֣�û����ȡwidget������
                if (nearestVM && typeof nearestVM[optName] === "object") {
                    vmOptions = nearestVM[optName]
                    vmOptions = vmOptions.$model || vmOptions
                    var id = vmOptions[widget + "Id"]
                    if (typeof id === "string") {
                        args[1] = id
                    }
                }
                var widgetData = avalon.getWidgetData(element, args[0]) //��ȡdata-tooltip-text��data-tooltip-attr���ԣ����һ�����ö���
                data[widget + "Id"] = args[1]
                data[widget + "Options"] = avalon.mix({}, constructor.defaults, vmOptions, widgetData)
                element.removeAttribute("vm-widget")
                var widgetVM = constructor(element, data, vmodels)
                data.evaluator = noop
                var callback = getBindingCallback(element, "data-widget-defined", vmodels)
                if (callback) {
                    callback.call(element, widgetVM)
                }
            } else if (vmodels.length) { //����������û�м��أ���ô���浱ǰ��vmodels
                element.vmodels = vmodels
            }
            return true
        }
    }



    //============================ class preperty binding  =======================
    "hover,active".replace(rword, function(method) {
        bindingHandlers[method] = bindingHandlers["class"]
    })
    "with,repeat".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.each
    })
    //============================= boolean preperty binding =======================
    "disabled,enabled,readonly,selected".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.checked
    })
    bindingHandlers.data = bindingHandlers.text = bindingHandlers.html
    //============================= string preperty binding =======================
    //��href���� �÷����������ַ������Եİ���
    //���鲻Ҫֱ����src�������޸ģ������ᷢ����Ч��������ʹ��vm-src
    "title,alt,src,value,css,include,href".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.attr
    })
    //============================= model binding =======================
    //��ģ���е��ֶ���input, textarea��valueֵ������һ��
    var modelBinding = bindingHandlers.duplex
    //���һ��input��ǩ�����model�󶨡���ô����Ӧ���ֶν���Ԫ�ص�value������һ��
    //�ֶα䣬value�ͱ䣻value�䣬�ֶ�Ҳ���ű䡣Ĭ���ǰ�input�¼���
    modelBinding.INPUT = function(element, evaluator, data) {
        var fixType = data.param,
            type = element.type,
            callback = data.changed,
            $elem = avalon(element),
            removeFn

        if (type === "checkbox" && fixType === "radio") {
            type = "radio"
        }
        //��value�仯ʱ�ı�model��ֵ
        var updateVModel = function() {
            var val = element.oldValue = element.value
            if ($elem.data("duplex-observe") !== false) {
                evaluator(val)
                callback.call(element, val)
            }
        }
        //��model�仯ʱ,���ͻ�ı�value��ֵ
        data.handler = function() {
            var val = evaluator()
            if (val !== element.value) {
                element.value = val + ""
            }
        }
        if (type === "radio") {
            data.handler = function() {
                //IE6��ͨ��defaultChecked��ʵ�ִ�Ч��
                element.defaultChecked = (element.checked = /bool|text/.test(fixType) ? evaluator() + "" === element.value : !!evaluator())
            }
            updateVModel = function() {
                if ($elem.data("duplex-observe") !== false) {
                    var val = element.value
                    if (fixType === "text") {
                        evaluator(val)
                    } else if (fixType === "bool") {
                        val = val === "true"
                        evaluator(val)
                    } else {
                        val = !element.defaultChecked
                        evaluator(val)
                        element.checked = val
                    }
                    callback.call(element, val)
                }
            }
            removeFn = $elem.bind("click", updateVModel)
            data.rollback = function() {
                $elem.unbind("click", removeFn)
            }
        } else if (type === "checkbox") {
            updateVModel = function() {
                if ($elem.data("duplex-observe") !== false) {
                    var method = element.checked ? "ensure" : "remove"
                    var array = evaluator()
                    if (Array.isArray(array)) {
                        avalon.Array[method](array, element.value)
                    } else {
                        avalon.error("vm-duplexλ��checkboxʱҪ���Ӧһ������")
                    }
                    callback.call(element, array)
                }
            }
            data.handler = function() {
                var array = [].concat(evaluator()) //ǿ��ת��Ϊ����
                element.checked = array.indexOf(element.value) >= 0
            }
            removeFn = $elem.bind("click", updateVModel) //IE6-8
            data.rollback = function() {
                $elem.unbind("click", removeFn)
            }
        } else {
            var event = element.attributes["data-duplex-event"] || element.attributes["data-event"] || {}
            event = event.value
            if (event === "change") {
                avalon.bind(element, event, updateVModel)
            } else {
                if (W3C) { //��ִ��W3C
                    element.addEventListener("input", updateVModel)
                    data.rollback = function() {
                        element.removeEventListener("input", updateVModel)
                    }
                } else {
                    removeFn = function(e) {
                        if (e.propertyName === "value") {
                            updateVModel()
                        }
                    }
                    element.attachEvent("onpropertychange", removeFn)
                    data.rollback = function() {
                        element.detachEvent("onpropertychange", removeFn)
                    }
                }

                if (DOC.documentMode === 9) { // IE9 �޷����м���ͬ��VM
                    var selectionchange = function(e) {
                        if (e.type === "focus") {
                            DOC.addEventListener("selectionchange", updateVModel)
                        } else {
                            DOC.removeEventListener("selectionchange", updateVModel)
                        }
                    }
                    element.addEventListener("focus", selectionchange)
                    element.addEventListener("blur", selectionchange)
                    var rollback = data.rollback
                    data.rollback = function() {
                        rollback()
                        element.removeEventListener("focus", selectionchange)
                        element.removeEventListener("blur", selectionchange)
                    }
                }
            }
        }
        element.oldValue = element.value
        launch(element)
        registerSubscriber(data)
    }
    var TimerID, ribbon = [],
        launch = noop

    function ticker() {
        for (var n = ribbon.length - 1; n >= 0; n--) {
            var el = ribbon[n]
            if (avalon.contains(root, el)) {
                if (el.oldValue !== el.value) {
                    var event = DOC.createEvent("Event")
                    event.initEvent("input", true, true)
                    el.dispatchEvent(event)
                }
            } else {
                ribbon.splice(n, 1)
            }
        }
        if (!ribbon.length) {
            clearInterval(TimerID)
        }
    }

    function launchImpl(el) {
        if (ribbon.push(el) === 1) {
            TimerID = setInterval(ticker, 30)
        }
    }
    //http://msdn.microsoft.com/en-us/library/dd229916(VS.85).aspx
    //https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
    if (Object.getOwnPropertyNames) { //����IE8
        try {
            var inputProto = HTMLInputElement.prototype,
                oldSetter

            function newSetter(newValue) {
                oldSetter.call(this, newValue)
                if (newValue !== this.oldValue) {
                    var event = DOC.createEvent("Event")
                    event.initEvent("input", true, true)
                    this.dispatchEvent(event)
                }
            }
            oldSetter = Object.getOwnPropertyDescriptor(inputProto, "value").set //����chrome, safari,opera
            Object.defineProperty(inputProto, "value", {
                set: newSetter
            })
        } catch (e) {
            launch = launchImpl
        }
    }
    modelBinding.SELECT = function(element, evaluator, data, oldValue) {
        var $elem = avalon(element)
        function updateVModel() {
            if ($elem.data("duplex-observe") !== false) {
                var val = $elem.val() //�ַ������ַ�������
                if (val + "" !== oldValue) {
                    evaluator(val)
                    oldValue = val + ""
                }
                data.changed.call(element, val)
            }
        }
        data.handler = function() {
            var curValue = evaluator()
            curValue = curValue && curValue.$model || curValue
            curValue = Array.isArray(curValue) ? curValue.map(String) : curValue + ""
            if (curValue + "" !== oldValue) {
                $elem.val(curValue)
                oldValue = curValue + ""
            }
        }
        var removeFn = $elem.bind("change", updateVModel)
        data.rollback = function() {
            $elem.unbind("change", removeFn)
        }
        var innerHTML = NaN
        var id = setInterval(function() {
            var currHTML = element.innerHTML
            if (currHTML === innerHTML) {
                clearInterval(id)
                //�ȵȵ�select���optionԪ�ر�ɨ��󣬲Ÿ���model����selected����  
                registerSubscriber(data)
            } else {
                innerHTML = currHTML
            }
        }, 20)
    }
    modelBinding.TEXTAREA = modelBinding.INPUT
    //============================= event binding =======================

    /*
    var eventName = {
        AnimationEvent: 'animationend',
        WebKitAnimationEvent: 'webkitAnimationEnd'
    }
    for (var name in eventName) {
        if (/object|function/.test(typeof window[name])) {
            eventMap.animationend = eventName[name]
            break
        }
    }

    function fixEvent(event) {
        var ret = {}
        for (var i in event) {
            ret[i] = event[i]
        }
        var target = ret.target = event.srcElement
        if (event.type.indexOf("key") === 0) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode
        } else if (/mouse|click/.test(event.type)) {
            var doc = target.ownerDocument || DOC
            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
        }
        ret.timeStamp = new Date - 0
        ret.originalEvent = event
        ret.preventDefault = function() { //��ֹĬ����Ϊ
            event.returnValue = false
        }
        ret.stopPropagation = function() { //��ֹ�¼���DOM���еĴ���
            event.cancelBubble = true
        }
        return ret
    }
    */
    "animationend,blur,change,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scroll".
        replace(rword, function(name) {
            bindingHandlers[name] = function(data) {
                data.param = name
                bindingHandlers.on.apply(0, arguments)
            }
        })
    /*
    var oldBind = avalon.bind
    if (!("onmouseenter" in root)) { //fix firefox, chrome
        var events = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }
        avalon.bind = function(elem, type, fn) {
            if (events[type]) {
                return oldBind(elem, events[type], function(e) {
                    var t = e.relatedTarget
                    if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
                        delete e.type
                        e.type = type
                        return fn.call(elem, e)
                    }
                })
            } else {
                return oldBind(elem, type, fn)
            }
        }
    }
    if (!("oninput" in document.createElement("input"))) { //fix IE6-8
        avalon.bind = function(elem, type, fn) {
            if (type === "input") {
                return oldBind(elem, "propertychange", function(e) {
                    if (e.propertyName === "value") {
                        e.type = "input"
                        return fn.call(elem, e)
                    }
                })
            } else {
                return oldBind(elem, type, fn)
            }
        }
    }
    /*********************************************************************
     *          ������飨��vm-each, vm-repeat���ʹ�ã�                     *
     **********************************************************************/

    function Collection(model) {
        var array = []
        array.$id = generateID()
        array[subscribers] = []
        array.$model = model // model.concat()
        array.$events = {} //VB����ķ������this����ָ��������Ҫʹ��bind����һ��
        array._ = modelFactory({
            length: model.length
        })
        array._.$watch("length", function(a, b) {
            array.$fire("length", a, b)
        })
        for (var i in Observable) {
            array[i] = Observable[i]
        }
        avalon.mix(array, CollectionPrototype)
        return array
    }

    var _splice = ap.splice
    var CollectionPrototype = {
        _splice: _splice,
        _add: function(arr, pos) { //�ڵ�pos��λ���ϣ����һ��Ԫ��
            var oldLength = this.length
            pos = typeof pos === "number" ? pos : oldLength
            var added = []
            for (var i = 0, n = arr.length; i < n; i++) {
                added[i] = convert(arr[i])
            }
            _splice.apply(this, [pos, 0].concat(added))
            notifySubscribers(this, "add", pos, added)
            if (!this._stopFireLength) {
                return this._.length = this.length
            }
        },
        _del: function(pos, n) { //�ڵ�pos��λ���ϣ�ɾ��N��Ԫ��
            var ret = this._splice(pos, n)
            if (ret.length) {
                notifySubscribers(this, "del", pos, n)
                if (!this._stopFireLength) {
                    this._.length = this.length
                }
            }
            return ret
        },
        push: function() {
            ap.push.apply(this.$model, arguments)
            var n = this._add(arguments)
            notifySubscribers(this, "index", n > 2 ? n - 2 : 0)
            return n
        },
        unshift: function() {
            ap.unshift.apply(this.$model, arguments)
            var ret = this._add(arguments, 0) //���س���
            notifySubscribers(this, "index", arguments.length)
            return ret
        },
        shift: function() {
            var el = this.$model.shift()
            this._del(0, 1)
            notifySubscribers(this, "index", 0)
            return el //���ر��Ƴ���Ԫ��
        },
        pop: function() {
            var el = this.$model.pop()
            this._del(this.length - 1, 1)
            return el //���ر��Ƴ���Ԫ��
        },
        splice: function(a, b) {
            // ������ڵ�һ����������Ҫ����-1, Ϊ��ӻ�ɾ��Ԫ�صĻ���
            a = resetNumber(a, this.length)
            var removed = _splice.apply(this.$model, arguments),
                ret = []
            this._stopFireLength = true //ȷ������������� , $watch("length",fn)ֻ����һ��
            if (removed.length) {
                ret = this._del(a, removed.length)
                if (arguments.length <= 2) { //���û��ִ����Ӳ�������Ҫ�ֶ�resetIndex
                    notifySubscribers(this, "index", a)
                }
            }
            if (arguments.length > 2) {
                this._add(aslice.call(arguments, 2), a)
            }
            this._stopFireLength = false
            this._.length = this.length
            return ret //���ر��Ƴ���Ԫ��
        },
        contains: function(el) { //�ж��Ƿ����
            return this.indexOf(el) !== -1
        },
        size: function() { //ȡ�����鳤�ȣ������������ͬ����ͼ��length����
            return this._.length
        },
        remove: function(el) { //�Ƴ���һ�����ڸ���ֵ��Ԫ��
            var index = this.indexOf(el)
            if (index >= 0) {
                return this.removeAt(index)
            }
        },
        removeAt: function(index) { //�Ƴ�ָ�������ϵ�Ԫ��
            this.splice(index, 1)
        },
        clear: function() {
            this.$model.length = this.length = this._.length = 0 //�������
            notifySubscribers(this, "clear", 0)
            return this
        },
        removeAll: function(all) { //�Ƴ�N��Ԫ��
            if (Array.isArray(all)) {
                all.forEach(function(el) {
                    this.remove(el)
                }, this)
            } else if (typeof all === "function") {
                for (var i = this.length - 1; i >= 0; i--) {
                    var el = this[i]
                    if (all(el, i)) {
                        this.splice(i, 1)
                    }
                }
            } else {
                this.clear()
            }
        },
        ensure: function(el) {
            if (!this.contains(el)) { //ֻ�в����ڲ�push
                this.push(el)
            }
            return this
        },
        set: function(index, val) {
            if ( index >= 0 ) {
                var valueType = getType(val)
                if (val && val.$model) {
                    val = val.$model
                }
                var target = this[index]
                if (valueType === "object") {
                    for (var i in val) {
                        if (target.hasOwnProperty(i)) {
                            target[i] = val[i]
                        }
                    }
                } else if (valueType === "array") {
                    target.clear().push.apply(target, val)
                } else if (target !== val) {
                    this[index] = val
                    notifySubscribers(this, "set", index, val)
                }
            }
            return this
        }
    }
    "sort,reverse".replace(rword, function(method) {
        CollectionPrototype[method] = function() {
            var aaa = this.$model,
                bbb = aaa.slice(0),
                sorted = false
            ap[method].apply(aaa, arguments) //���ƶ�model
            for (var i = 0, n = bbb.length; i < n; i++) {
                var a = aaa[i],
                    b = bbb[i]
                if (!isEqual(a, b)) {
                    sorted = true
                    var index = getIndex(a, bbb, i)
                    var remove = this._splice(index, 1)[0]
                    var remove2 = bbb.splice(index, 1)[0]
                    this._splice(i, 0, remove)
                    bbb.splice(i, 0, remove2)
                    notifySubscribers(this, "move", index, i)
                }
            }
            bbb = void 0
            if (sorted) {
                notifySubscribers(this, "index", 0)
            }
            return this
        }
    })

    function convert(val) {
        var type = getType(val)
        if (rchecktype.test(type)) {
            val = val.$id ? val : modelFactory(val, val)
        }
        return val
    }

    //ȡ��el��array��λ��

    function getIndex(a, array, start) {
        for (var i = start, n = array.length; i < n; i++) {
            if (isEqual(a, array[i])) {
                return i
            }
        }
        return -1
    }
    //============ each/repeat/with binding �õ��ĸ������������ ======================
    //�õ�ĳһԪ�ؽڵ���ĵ���Ƭ�����µ�����ע�ͽڵ�
    var queryComments = DOC.createTreeWalker ? function(parent) {
        var tw = DOC.createTreeWalker(parent, NodeFilter.SHOW_COMMENT, null, null),
            comment, ret = []
        while (comment = tw.nextNode()) {
            ret.push(comment)
        }
        return ret
    } : function(parent) {
        return parent.getElementsByTagName("!")
    }
    //��ͨ��vm-if�Ƴ�DOM���Ž�ifSanctuary��Ԫ�ؽڵ��Ƴ������Ա���������

    function removeFromSanctuary(parent) {
        var comments = queryComments(parent)
        for (var i = 0, comment; comment = comments[i++]; ) {
            if (comment.nodeValue == "vm-if") {
                var msIfEl = comment.elem
                if (msIfEl.parentNode) {
                    msIfEl.parentNode.removeChild(msIfEl)
                }
            }
        }
        parent.textContent = ""
    }

    function iteratorCallback(args) {
        var callback = getBindingCallback(this.callbackElement, this.callbackName, this.vmodels)
        if (callback) {
            var parent = this.parent
            checkScan(parent, function() {
                callback.apply(parent, args)
            })
        }
    }
    //Ϊvm-each, vm-with, vm-repeatҪѭ����Ԫ�����һ��msloop��ʱ�ڵ㣬vm-controller��ֵΪ����VM��$id
    function shimController(data, transation, spans, proxy) {
        var tview = data.template.cloneNode(true)
        var id = proxy.$id
        var span = tview.firstChild
        if (!data.fastRepeat) {
            span = DOC.createElement("vmloop")
            span.style.display = "none"
            span.appendChild(tview)
        }
        span.setAttribute("vm-controller", id)
        spans.push(span)
        transation.appendChild(span)
        VMODELS[id] = proxy
        function fn() {
            delete VMODELS[id]
            data.group = 1
            if (!data.fastRepeat) {
                data.group = span.childNodes.length
                span.parentNode.removeChild(span)
                while (span.firstChild) {
                    transation.appendChild(span.firstChild)
                }
                if (fn.node !== void 0) {
                    fn.parent.insertBefore(transation, fn.node)
                }
            }
        }
        return span.patchRepeat = fn
    }
    // ȡ�����ڶ�λ�Ľڵ㡣�ڰ���vm-each, vm-with���Ե�Ԫ�����������innerHTML������Ϊһ����ģ�������Ƴ�DOM����
    // Ȼ���������Ԫ���ж��ٸ���vm-each�����ֵ���ж���˫��vm-with�����ͽ������ƶ��ٷ�(����ΪN)���پ���ɨ������²����Ԫ���С�
    // ��ʱ��Ԫ�صĺ��ӽ���ΪN�ȷ֣�ÿ�ȷݵĵ�һ���ڵ����������ڶ�λ�Ľڵ㣬
    // �������Ǹ�������������ȷֵĽڵ��ǣ�Ȼ�������Ƴ����ƶ����ǡ�

    function getLocatedNode(parent, data, pos) {
        if (data.startRepeat) {
            var ret = data.startRepeat,
                end = data.endRepeat
            pos += 1
            for (var i = 0; i < pos; i++) {
                ret = ret.nextSibling
                if (ret == end)
                    return end
            }
            return ret
        } else {
            return parent.childNodes[data.group * pos] || null
        }
    }

    function removeView(node, group, n) {
        var length = group * (n || 1)
        var view = documentFragment.cloneNode(false)
        while (--length >= 0) {
            var nextSibling = node.nextSibling
            view.appendChild(node)
            node = nextSibling
            if (!node) {
                break
            }
        }
        return view
    }
    // Ϊvm-each, vm-repeat����һ���������ͨ��������ʹ��һЩ����������빦�ܣ�$index,$first,$last,$remove,$key,$val,$outer��
    var watchEachOne = oneObject("$index,$first,$last")

    function createWithProxy(key, val, $outer) {
        var proxy = modelFactory({
            $key: key,
            $outer: $outer,
            $val: val
        }, 0, {
            $val: 1,
            $key: 1
        })
        proxy.$id = "$proxy$with" + Math.random()
        return proxy
    }

    function createEachProxy(index, item, data, last) {
        var param = data.param || "el"
        var source = {
            $index: index,
            $itemName: param,
            $outer: data.$outer,
            $first: index === 0,
            $last: index === last
        }
        source[param] = item
        source.$remove = function() {
            return data.getter().removeAt(proxy.$index)
        }
        var proxy = modelFactory(source, 0, watchEachOne)
        proxy.$id = "$proxy$" + data.type + Math.random()
        return proxy
    }
    /*********************************************************************
     *                  �ı�����Ĭ�Ͽ��õĹ�����                          *
     **********************************************************************/
    var filters = avalon.filters = {
        uppercase: function(str) {
            return str.toUpperCase()
        },
        lowercase: function(str) {
            return str.toLowerCase()
        },
        camelize: $.camelCase,
        truncate: $.String.truncate,
        escape: $.String.escapeHTML,
        number: $.Number.format
    };

    /*
    var filters = avalon.filters = {
        uppercase: function(str) {
            return str.toUpperCase()
        },
        lowercase: function(str) {
            return str.toLowerCase()
        },
        truncate: function(target, length, truncation) {
            //length�����ַ������ȣ�truncation�����ַ����Ľ�β���ֶ�,�������ַ���
            length = length || 30
            truncation = truncation === void(0) ? "..." : truncation
            return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target)
        },
        camelize: camelize,
        escape: function(html) {
            //���ַ������� html ת��õ��ʺ���ҳ������ʾ������, �����滻 < Ϊ &lt 
            return String(html)
                .replace(/&(?!\w+;)/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
        },
        currency: function(number, symbol) {
            symbol = symbol || "��"
            return symbol + avalon.filters.number(number)
        },
        number: function(number, decimals, dec_point, thousands_sep) {
            //��PHP��number_format��ȫ����
            //number	���裬Ҫ��ʽ��������
            //decimals	��ѡ���涨���ٸ�С��λ��
            //dec_point	��ѡ���涨����С������ַ�����Ĭ��Ϊ . ����
            //thousands_sep	��ѡ���涨����ǧλ�ָ������ַ�����Ĭ��Ϊ , ������������˸ò�������ô���������������Ǳ���ġ�
            // http://kevin.vanzonneveld.net
            number = (number + "").replace(/[^0-9+\-Ee.]/g, "")
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = thousands_sep || ",",
                dec = dec_point || ".",
                s = "",
                toFixedFix = function(n, prec) {
                    var k = Math.pow(10, prec)
                    return "" + Math.round(n * k) / k
                }
            // Fix for IE parseFloat(0.55).toFixed(0) = 0 
            s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split('.')
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
            }
            if ((s[1] || "").length < prec) {
                s[1] = s[1] || ""
                s[1] += new Array(prec - s[1].length + 1).join("0")
            }
            return s.join(dec)
        }
    }
    */
    /*
     'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
     'MMMM': Month in year (January-December)
     'MMM': Month in year (Jan-Dec)
     'MM': Month in year, padded (01-12)
     'M': Month in year (1-12)
     'dd': Day in month, padded (01-31)
     'd': Day in month (1-31)
     'EEEE': Day in Week,(Sunday-Saturday)
     'EEE': Day in Week, (Sun-Sat)
     'HH': Hour in day, padded (00-23)
     'H': Hour in day (0-23)
     'hh': Hour in am/pm, padded (01-12)
     'h': Hour in am/pm, (1-12)
     'mm': Minute in hour, padded (00-59)
     'm': Minute in hour (0-59)
     'ss': Second in minute, padded (00-59)
     's': Second in minute (0-59)
     'a': am/pm marker
     'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     format string can also be one of the following predefined localizable formats:

     'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
     'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
     'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
     'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
     'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
     'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
     'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
     'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
     */
    /*
    new function() {
        function toInt(str) {
            return parseInt(str, 10)
        }

        function padNumber(num, digits, trim) {
            var neg = ""
            if (num < 0) {
                neg = '-'
                num = -num
            }
            num = "" + num
            while (num.length < digits)
                num = "0" + num
            if (trim)
                num = num.substr(num.length - digits)
            return neg + num
        }

        function dateGetter(name, size, offset, trim) {
            return function(date) {
                var value = date["get" + name]()
                if (offset > 0 || value > -offset)
                    value += offset
                if (value === 0 && offset === -12) {
                    value = 12
                }
                return padNumber(value, size, trim)
            }
        }

        function dateStrGetter(name, shortForm) {
            return function(date, formats) {
                var value = date["get" + name]()
                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
                return formats[get][value]
            }
        }

        function timeZoneGetter(date) {
            var zone = -1 * date.getTimezoneOffset()
            var paddedZone = (zone >= 0) ? "+" : ""
            paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
            return paddedZone
        }
        //ȡ����������

        function ampmGetter(date, formats) {
            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
        }
        var DATE_FORMATS = {
            yyyy: dateGetter("FullYear", 4),
            yy: dateGetter("FullYear", 2, 0, true),
            y: dateGetter("FullYear", 1),
            MMMM: dateStrGetter("Month"),
            MMM: dateStrGetter("Month", true),
            MM: dateGetter("Month", 2, 1),
            M: dateGetter("Month", 1, 1),
            dd: dateGetter("Date", 2),
            d: dateGetter("Date", 1),
            HH: dateGetter("Hours", 2),
            H: dateGetter("Hours", 1),
            hh: dateGetter("Hours", 2, -12),
            h: dateGetter("Hours", 1, -12),
            mm: dateGetter("Minutes", 2),
            m: dateGetter("Minutes", 1),
            ss: dateGetter("Seconds", 2),
            s: dateGetter("Seconds", 1),
            sss: dateGetter("Milliseconds", 3),
            EEEE: dateStrGetter("Day"),
            EEE: dateStrGetter("Day", true),
            a: ampmGetter,
            Z: timeZoneGetter
        }
        var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
            NUMBER_STRING = /^\d+$/
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/
        // 1        2       3         4          5          6          7          8  9     10      11

        function jsonStringToDate(string) {
            var match
            if (match = string.match(R_ISO8601_STR)) {
                var date = new Date(0),
                    tzHour = 0,
                    tzMin = 0,
                    dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                    timeSetter = match[8] ? date.setUTCHours : date.setHours
                if (match[9]) {
                    tzHour = toInt(match[9] + match[10])
                    tzMin = toInt(match[9] + match[11])
                }
                dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]))
                var h = toInt(match[4] || 0) - tzHour
                var m = toInt(match[5] || 0) - tzMin
                var s = toInt(match[6] || 0)
                var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000)
                timeSetter.call(date, h, m, s, ms)
                return date
            }
            return string
        }
        var rfixFFDate = /^(\d+)-(\d+)-(\d{4})$/
        var rfixIEDate = /^(\d+)\s+(\d+),(\d{4})$/
        filters.date = function(date, format) {
            var locate = filters.date.locate,
                text = "",
                parts = [],
                fn, match
            format = format || "mediumDate"
            format = locate[format] || format
            if (typeof date === "string") {
                if (NUMBER_STRING.test(date)) {
                    date = toInt(date)
                } else {
                    var trimDate = date.trim()
                    if (trimDate.match(rfixFFDate) || trimDate.match(rfixIEDate)) {
                        date = RegExp.$3 + "/" + RegExp.$1 + "/" + RegExp.$2
                    }
                    date = jsonStringToDate(date)
                }
                date = new Date(date)
            }
            if (typeof date === "number") {
                date = new Date(date)
            }
            if (getType(date) !== "date") {
                return
            }
            while (format) {
                match = DATE_FORMATS_SPLIT.exec(format)
                if (match) {
                    parts = parts.concat(match.slice(1))
                    format = parts.pop()
                } else {
                    parts.push(format)
                    format = null
                }
            }
            parts.forEach(function(value) {
                fn = DATE_FORMATS[value]
                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            })
            return text
        }
        var locate = {
            AMPMS: {
                0: "����",
                1: "����"
            },
            DAY: {
                0: "������",
                1: "����һ",
                2: "���ڶ�",
                3: "������",
                4: "������",
                5: "������",
                6: "������"
            },
            MONTH: {
                0: "1��",
                1: "2��",
                2: "3��",
                3: "4��",
                4: "5��",
                5: "6��",
                6: "7��",
                7: "8��",
                8: "9��",
                9: "10��",
                10: "11��",
                11: "12��"
            },
            SHORTDAY: {
                "0": "����",
                "1": "��һ",
                "2": "�ܶ�",
                "3": "����",
                "4": "����",
                "5": "����",
                "6": "����"
            },
            fullDate: "y��M��d��EEEE",
            longDate: "y��M��d��",
            medium: "yyyy-M-d ah:mm:ss",
            mediumDate: "yyyy-M-d",
            mediumTime: "ah:mm:ss",
            "short": "yy-M-d ah:mm",
            shortDate: "yy-M-d",
            shortTime: "ah:mm"
        }
        locate.SHORTMONTH = locate.MONTH
        filters.date.locate = locate
    }
    */
    /*********************************************************************
     *                      AMD Loader                                *
     **********************************************************************/

    /*
    var innerRequire
    var modules = avalon.modules = {
        "ready!": {
            exports: avalon
        },
        "avalon": {
            exports: avalon,
            state: 2
        }
    }


    new function() {
        var loadings = [] //���ڼ����е�ģ���б�
        var factorys = [] //������Ҫ��ID��factory��Ӧ��ϵ��ģ�飨��׼������£���parse��script�ڵ����onload��
        var basepath

        function cleanUrl(url) {
            return (url || "").replace(/[?#].*//*, "")
        }

        plugins.js = function(url, shim) {
            var id = cleanUrl(url)
            if (!modules[id]) { //���֮ǰû�м��ع�
                modules[id] = {
                    id: id,
                    parent: parent,
                    exports: {}
                }
                if (shim) { //shim����
                    innerRequire(shim.deps || "", function() {
                        loadJS(url, id, function() {
                            modules[id].state = 2
                            if (shim.exports)
                                modules[id].exports = typeof shim.exports === "function" ?
                                    shim.exports() : window[shim.exports]
                            innerRequire.checkDeps()
                        })
                    })
                } else {
                    loadJS(url, id)
                }
            }
            return id
        }
        plugins.css = function(url) {
            var id = url.replace(/(#.+|\W)/g, "") ////���ڴ����href�е�hash�������������
            if (!DOC.getElementById(id)) {
                var node = DOC.createElement("link")
                node.rel = "stylesheet"
                node.href = url
                node.id = id
                head.insertBefore(node, head.firstChild)
            }
        }
        plugins.css.ext = ".css"
        plugins.js.ext = ".js"
        var cur = getCurrentScript(true)
        if (!cur) { //����window safari��Errorû��stack������
            cur = avalon.slice(DOC.scripts).pop().src
        }
        var url = cleanUrl(cur)
        basepath = kernel.base = url.slice(0, url.lastIndexOf("/") + 1)

        function getCurrentScript(base) {
            // �ο� https://github.com/samyk/jiagra/blob/master/jiagra.js
            var stack
            try {
                a.b.c() //ǿ�Ʊ���,�Ա㲶��e.stack
            } catch (e) { //safari�Ĵ������ֻ��line,sourceId,sourceURL
                stack = e.stack
                if (!stack && window.opera) {
                    //opera 9û��e.stack,����e.Backtrace,������ֱ��ȡ��,��Ҫ��e����ת�ַ������г�ȡ
                    stack = (String(e).match(/of linked script \S+/g) || []).join(" ")
                }
            }
            if (stack) {
                //e.stack���һ��������֧�ֵ��������������:
                //chrome23:
                //at http://113.93.50.63/data.js:4:1
                //firefox17:
                //@http://113.93.50.63/query.js:4
                //opera12:http://www.oldapps.com/opera.php?system=Windows_XP
                //@http://113.93.50.63/data.js:4
                //IE10:
                //at Global code (http://113.93.50.63/data.js:4:1)
                //firefox4+ ������document.currentScript
                stack = stack.split(/[@ ]/g).pop() //ȡ�����һ��,���һ���ո��@֮��Ĳ���
                stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "") //ȥ�����з�
                return stack.replace(/(:\d+)?:\d+$/i, "") //ȥ���к��������ڵĳ����ַ���ʼλ��
            }
            var nodes = (base ? DOC : head).getElementsByTagName("script") //ֻ��head��ǩ��Ѱ��
            for (var i = nodes.length, node; node = nodes[--i]; ) {
                if ((base || node.className === subscribers) && node.readyState === "interactive") {
                    return node.className = node.src
                }
            }
        }

        function checkCycle(deps, nick) {
            //����Ƿ����ѭ������
            for (var id in deps) {
                if (deps[id] === "˾ͽ����" && modules[id].state !== 2 && (id === nick || checkCycle(modules[id].deps, nick))) {
                    return true
                }
            }
        }

        function checkDeps() {
            //����JSģ��������Ƿ��Ѱ�װ���,����װ����
            loop: for (var i = loadings.length, id; id = loadings[--i]; ) {

                var obj = modules[id],
                    deps = obj.deps
                for (var key in deps) {
                    if (ohasOwn.call(deps, key) && modules[key].state !== 2) {
                        continue loop
                    }
                }
                //���deps�ǿն��������������ģ���״̬����2
                if (obj.state !== 2) {
                    loadings.splice(i, 1) //�������Ƴ��ٰ�װ����ֹ��IE��DOM��������ֶ�ˢ��ҳ�棬����ִ����
                    fireFactory(obj.id, obj.args, obj.factory)
                    checkDeps() //����ɹ�,����ִ��һ��,�Է���Щģ��Ͳģ��û�а�װ��
                }
            }
        }

        function checkFail(node, onError, fuckIE) {
            var id = cleanUrl(node.src) //����Ƿ�����
            node.onload = node.onreadystatechange = node.onerror = null
            if (onError || (fuckIE && !modules[id].state)) {
                setTimeout(function() {
                    head.removeChild(node)
                    node = null // �����ʽIE�µ�ѭ����������
                })
                log("���� " + id + " ʧ��" + onError + " " + (!modules[id].state))
            } else {
                return true
            }
        }
        var rdeuce = /\/\w+\/\.\./

        function loadResources(url, parent, ret, shim) {
            //1. �ر���mass|ready��ʶ��
            if (url === "ready!" || (modules[url] && modules[url].state === 2)) {
                return url
            }
            //2. ת��Ϊ����·��
            if (typeof kernel.shim[url] === "object") {
                shim = kernel.shim[url]
            }
            if (kernel.paths[url]) { //��������
                url = kernel.paths[url]
            }
            //3.  ����text!  css! ����Դ
            var plugin
            url = url.replace(/^\w+!/, function(a) {
                plugin = a.slice(0, -1)
                return ""
            })
            plugin = plugin || "js"
            plugin = plugins[plugin] || noop
            //4. ��ȫ·��
            if (/^(\w+)(\d)?:.*/
            /*.test(url)) {
                ret = url
            } else {
                parent = parent.substr(0, parent.lastIndexOf("/"))
                var tmp = url.charAt(0)
                if (tmp !== "." && tmp !== "/") { //����ڸ�·��
                    ret = basepath + url
                } else if (url.slice(0, 2) === "./") { //������ֵ�·��
                    ret = parent + url.slice(1)
                } else if (url.slice(0, 2) === "..") { //����ڸ�·��
                    ret = parent + "/" + url
                    while (rdeuce.test(ret)) {
                        ret = ret.replace(rdeuce, "")
                    }
                } else if (tmp === "/") {
                    ret = parent + url //������ֵ�·��
                } else {
                    avalon.error("������ģ���ʶ����: " + url)
                }
            }
            //5. ��ȫ��չ��
            url = cleanUrl(ret)
            var ext = plugin.ext
            if (ext) {
                if (url.slice(0 - ext.length) !== ext) {
                    ret += ext
                }
            }
            //6. ���洦��
            if (kernel.nocache) {
                ret += (ret.indexOf("?") === -1 ? "?" : "&") + (new Date - 0)
            }
            return plugin(ret, shim)
        }

        function loadJS(url, id, callback) {
            //ͨ��script�ڵ����Ŀ��ģ��
            var node = DOC.createElement("script")
            node.className = subscribers //��getCurrentScriptֻ��������Ϊsubscribers��script�ڵ�
            node[W3C ? "onload" : "onreadystatechange"] = function() {
                if (W3C || /loaded|complete/i.test(node.readyState)) {
                    //mass Framework����_checkFail��������Ļص�������������ͷŻش棬����DOM0�¼�д����IE6��GC����
                    var factory = factorys.pop()
                    factory && factory.delay(id)
                    if (callback) {
                        callback()
                    }
                    if (checkFail(node, false, !W3C)) {
                        log("Debug: �ѳɹ����� " + url)
                    }
                }
            }
            node.onerror = function() {
                checkFail(node, true)
            }
            node.src = url //���뵽head�ĵ�һ���ڵ�ǰ����ֹIE6��head��ǩû�պ�ǰʹ��appendChild�״�
            head.insertBefore(node, head.firstChild) //chrome�µڶ�����������Ϊnull
            log("Debug: ��׼������ " + url) //����Ҫ����IE6�¿�����խgetCurrentScript��Ѱ�ҷ�Χ
        }

        innerRequire = avalon.require = function(list, factory, parent) {
            // ���ڼ�����������Ƿ�Ϊ2
            var deps = {},
            // ���ڱ�������ģ��ķ���ֵ
                args = [],
            // ��Ҫ��װ��ģ����
                dn = 0,
            // �Ѱ�װ���ģ����
                cn = 0,
                id = parent || "callback" + setTimeout("1")
            parent = parent || basepath
            String(list).replace(rword, function(el) {
                var url = loadResources(el, parent)
                if (url) {
                    dn++
                    if (modules[url] && modules[url].state === 2) {
                        cn++
                    }
                    if (!deps[url]) {
                        args.push(url)
                        deps[url] = "˾ͽ����" //ȥ��
                    }
                }
            })
            modules[id] = {//����һ������,��¼ģ��ļ��������������Ϣ
                id: id,
                factory: factory,
                deps: deps,
                args: args,
                state: 1
            }
            if (dn === cn) { //�����Ҫ��װ�ĵ����Ѱ�װ�õ�
                fireFactory(id, args, factory) //��װ�������
            } else {
                //�ŵ�����ж���,�ȴ�checkDeps����
                loadings.unshift(id)
            }
            checkDeps()
        }
        */
        /**
         * ����ģ��
         * @param {String} id ? ģ��ID
         * @param {Array} deps ? �����б�
         * @param {Function} factory ģ�鹤��
         * @api public
         *//*
        innerRequire.define = function(id, deps, factory) { //ģ����,�����б�,ģ�鱾��
            var args = aslice.call(arguments)

            if (typeof id === "string") {
                var _id = args.shift()
            }
            if (typeof args[0] === "function") {
                args.unshift([])
            } //���ߺϲ�����ֱ�ӵõ�ģ��ID,����Ѱ�ҵ�ǰ���ڽ����е�script�ڵ��src��Ϊģ��ID
            //���ڳ���safari�⣬���Ƕ���ֱ��ͨ��getCurrentScriptһ����λ�õ���ǰִ�е�script�ڵ㣬
            //safari��ͨ��onload+delay�հ���Ͻ��
            var name = modules[_id] && modules[_id].state >= 1 ? _id : cleanUrl(getCurrentScript())
            if (!modules[name] && _id) {
                modules[name] = {
                    id: name,
                    factory: factory,
                    state: 1
                }
            }
            factory = args[1]
            factory.id = _id //���ڵ���
            factory.delay = function(d) {
                args.push(d)
                var isCycle = true
                try {
                    isCycle = checkCycle(modules[d].deps, d)
                } catch (e) {
                }
                if (isCycle) {
                    avalon.error(d + "ģ����֮ǰ��ĳЩģ�����ѭ������")
                }
                delete factory.delay //�ͷ��ڴ�
                innerRequire.apply(null, args) //0,1,2 --> 1,2,0
            }

            if (name) {
                factory.delay(name, args)
            } else { //�Ƚ��ȳ�
                factorys.push(factory)
            }
        }
        innerRequire.define.amd = modules

        function fireFactory(id, deps, factory) {
            for (var i = 0, array = [], d; d = deps[i++]; ) {
                array.push(modules[d].exports)
            }
            var module = Object(modules[id]),
                ret = factory.apply(window, array)
            module.state = 2
            if (ret !== void 0) {
                modules[id].exports = ret
            }
            return ret
        }
        innerRequire.config = kernel
        innerRequire.checkDeps = checkDeps
    }
    */
    /*********************************************************************
     *                           DOMReady                               *
     **********************************************************************/
    /*
    var ready = W3C ? "DOMContentLoaded" : "readystatechange"

    function fireReady() {
        if (DOC.body) { //  ��IE8 iframe��doScrollCheck���ܲ���ȷ
            modules["ready!"].state = 2
            innerRequire.checkDeps()
            fireReady = noop //���Ժ�������ֹIE9���ε���_checkDeps
        }
    }

    function doScrollCheck() {
        try { //IE��ͨ��doScrollCheck���DOM���Ƿ���
            root.doScroll("left")
            fireReady()
        } catch (e) {
            setTimeout(doScrollCheck)
        }
    }

    if (DOC.readyState === "complete") {
        setTimeout(fireReady) //�����domReady֮�����
    } else if (W3C) {
        DOC.addEventListener(ready, fireReady)
        window.addEventListener("load", fireReady)
    } else {
        DOC.attachEvent("onreadystatechange", function() {
            if (DOC.readyState === "complete") {
                fireReady()
            }
        })
        window.attachEvent("onload", fireReady)
        if (root.doScroll) {
            doScrollCheck()
        }
    }

    avalon.ready = function(fn) {
        innerRequire("ready!", fn)
    }
    avalon.config({
        loader: true
    })
    */
    avalon.ready(function() {
        //IE6-9�����ͨ��ֻҪ1ms,����û�и����ã����ᷢ������setImmediate���ִֻ��һ�Σ���setTimeoutһ��Ҫ140ms����
        if (window.VBArray && !window.setImmediate) {
            var handlerQueue = []

            function drainQueue() {
                var fn = handlerQueue.shift()
                if (fn) {
                    fn()
                    if (handlerQueue.length) {
                        avalon.nextTick()
                    }
                }
            }
            avalon.nextTick = function(callback) {
                if (typeof callback === "function") {
                    handlerQueue.push(callback)
                }
                var node = DOC.createElement("script")
                node.onreadystatechange = function() {
                    drainQueue() //��interactive�׶ξʹ���
                    node.onreadystatechange = null
                    head.removeChild(node)
                    node = null
                }
                head.appendChild(node)
            }
        }
        avalon.scan(DOC.body)
    })
    /*********************************************************************
     *                           armer                                   *
     **********************************************************************/

    $.MVVM = function(id, factory){
        if (arguments.length == 1)
            return VMODELS[arguments[0]];
        else if (arguments.length == 2)
            if (typeof factory == 'object') {
                var model = factory
                factory = function(){
                    $.mix(this, model);
                }
            }
        return avalon.define(id, function(vm){
            factory.call(vm)
        });
    }
    $.MVVM.config = function(hex){
        $.each(hex, function(i, value){
            config[i](value);
        })
    }
    $.MVVM.UI = function(uiname, factory){
        return avalon.ui[uiname] = factory;
    }
    $.MVVM.config({
        interpolate: ["{{", "}}"]
    });
    $.MVVM.mix = avalon.mix;
    $.MVVM.scan = avalon.scan;
    $.MVVM.bindingHandlers = avalon.bindingHandlers;
    $.MVVM.define = avalon.define;
    $.ViewModal = $.VM = $.MVVM


})(document, armer);
if (window.define) {
    define.amd.mvvm = {exports: armer.MVVM}

}
