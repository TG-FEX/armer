suite('lang/main', function(){
    suite('#defaults(target)', function(){
        test('单个参数', function(){
            deepEqual($.defaults({a:1}), {a:1})
        });
        test('两个参数', function(){
            deepEqual($.defaults({a:1}, {b:2, a:3}), {a:1, b:2});
        });
        test('三个参数', function(){
            deepEqual($.defaults({a:1}, {b:2, a:3}, {b:3, c:1}), {a:1, b:2, c:1});
        })
    });
    suite('#isNative(methodKey, [target])', function(){
        test('open测试', function(){

        })
    });
    suite('#type(target, condition, [coincidence])', function(){
        var scripts = document.getElementsByTagName('script');
        var type = {
            nodelist: scripts,
            element: scripts[0],
            object: {},
            array: [],
            arraylike: {length:1, 0:{}},
            string: '',
            number: 0,
            arguments: arguments
        };
        $.each(type, function(type, target){
            test('测试类型' + type, function(){
                ok($.type(target, type))
            })
        });
        test('随机测试', function(){
            ok($.type({}, 'plainobject'))
            ok($.type(window, 'window'))
            ok($.type(document, 'Document'))
            ok($.type(document, ['Document', 'object']))
        })
        test('非测试', function(){
            equal($.type(type.nodelist, 'number'), false)
            equal($.type(type.nodelist, 'string'), false)
            equal($.type(type.object, 'string'), false)
            equal($.type(type.nodelist, 'plainobject'), false)
        });
        test('多类型测试', function(){
            ok($.type(type.nodelist, 'object nodelist'))
            ok($.type(type.array, 'object array'))
        })
        test('coincidence测试', function(){
            equal($.type({}, 'plainobject, object', true), true)
            equal($.type({}, 'plainobject, array', true), false)
        })

    });
    ['String', 'Undefined', 'Null'].forEach(function(type){
        suite('#is' + type + '(obj)', function(){
            ['字符串', 0, function(){}, {}, [], undefined, null, true].forEach(function(item){
                var type2 = $.type(item);
                test('测试类型' + type2, function(){
                    if (type.toLowerCase() == type2)
                        equal($['is' + type](item), true)
                    else equal($['is' + type](item), false)
                })
            })
        });
    })
    suite('#mixOptions(target)', function(){
        //test({a:})
    });
    suite('#isNative(string)', function(){});
})
