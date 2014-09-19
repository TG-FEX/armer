suite('core/main', function () {
    suite('#resetNumber(num, length)', function () {
        test('正数情况', function () {
            equal($.resetNumber(1, 5), 1)
        })
        test('负数时', function () {
            equal($.resetNumber(-1, 5), 4)
        });
        test('超出长度时', function () {
            equal($.resetNumber(6, 5), 5)
        });
        test('负数超出长度时', function () {
            equal($.resetNumber(-6, 5), 0)
        });
        test('非整数时', function () {
            equal($.resetNumber(.5, 5), 0)
        });
        test('非整数时2', function () {
            equal($.resetNumber(.5, 5, true), 5)
        });
    })

    suite('#stringType(target)', function () {
        test('测试字符串', function () {
            equal($.stringType(''), 'String')
        });
        test('测试字符串', function () {
            ok($.stringType('', 'string'))
        });
        test('测试数字', function () {
            equal($.stringType(0), 'Number')
        });
        test('测试数字', function () {
            ok($.stringType(0, 'number'))
        });
        test('测试对象', function () {
            equal($.stringType({}), 'Object')
        });
        test('测试对象', function () {
            ok($.stringType({}, 'object'))
        });
        test('测试数组', function () {
            equal($.stringType([]), 'Array')
        });
        test('测试数组', function () {
            ok($.stringType([], 'array'))
        });
        test('测试布尔型', function () {
            equal($.stringType(true), 'Boolean')
        });
        test('测试布尔型', function () {
            ok($.stringType(true, 'boolean'))
        });
    })

    suite('isArrayLike', function () {
        test('参数对象', function () {
            ok($.isArrayLike(arguments))
        });
        test('元素队列', function () {
            ok($.isArrayLike(document.getElementsByTagName('div')))
        });
        test('非空类数组', function () {
            ok($.isArrayLike({length: 1, 0: 1}))
        });
        test('空类数组', function () {
            equal($.isArrayLike({length: 0}), false)
        });
        test('字符串类型', function () {
            ok($.isArrayLike('', true))
        });
        test('字符串类型错误', function () {
            equal($.isArrayLike(''), false)
        });
        test('字符串类型错误', function () {
            equal($.isArrayLike(''), false)
        });
    })

    suite('resetNumber', function () {
        test('超出长度时', function () {
            equal($.resetNumber(6, 5), 5)
        });
        test('负数超出长度时', function () {
            equal($.resetNumber(-6, 5), 0)
        });
        test('负数时', function () {
            equal($.resetNumber(-1, 5), 4)
        });
        test('正数时', function () {
            equal($.resetNumber(1, 5), 1)
        });
        test('非整数时', function () {
            equal($.resetNumber(.5, 5), 0)
        });
        test('非整数时2', function () {
            equal($.resetNumber(.5, 5, true), 5)
        });
    })

    suite('range', function () {
        test('测试', function () {
            deepEqual($.range(5), [0, 1, 2, 3, 4])
        });
        test('测试', function () {
            deepEqual($.range(1, 5), [1, 2, 3, 4])
        });
        test('测试', function () {
            deepEqual($.range(1, 7, 2), [1, 3, 5])
        });
    })

});