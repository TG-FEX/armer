function ok(expr, msg) {
    if (!expr) throw new Error(msg);
}
test('stringType', function(){
    equal($.stringType(''), 'String',  '测试字符串')
    ok($.stringType('', 'string'), '测试字符串')
    equal($.stringType(0), 'Number', '测试数字')
    ok($.stringType(0, 'number'), '测试数字')
    equal($.stringType({}), 'Object', '测试对象')
    ok($.stringType({}, 'object'), '测试对象')
    equal($.stringType([]), 'Array', '测试数组')
    ok($.stringType([], 'array'), '测试数组')
    equal($.stringType(true), 'Boolean', '测试布尔型')
    ok($.stringType(true, 'boolean'), '测试布尔型')
})

test('isArrayLike', function(){
    ok($.isArrayLike(arguments), '参数对象');
    ok($.isArrayLike(document.getElementsByTagName('div')), '元素队列')
    ok($.isArrayLike({length:1, 0:1}), '非空类数组')
    equal($.isArrayLike({length:0}), false, '空类数组')
    ok($.isArrayLike('', true), '字符串类型')
    equal($.isArrayLike(''), false, '字符串类型错误')
    equal($.isArrayLike(''), false, '字符串类型错误')
})

test('resetNumber', function(){
    equal($.resetNumber(6, 5), 5, '超出长度时')
    equal($.resetNumber(-6, 5), 0, '负数超出长度时')
    equal($.resetNumber(-1, 5), 4, '负数时')
    equal($.resetNumber(1, 5), 1, '正数时')
    equal($.resetNumber(.5, 5), 0, '非整数时')
    equal($.resetNumber(.5, 5, true), 5, '非整数时2')
})

test('URL', function(){
    equal($.URL('/a.html', 'http://www.baidu.com').toString(), 'http://www.baidu.com/a.html')
    equal($.URL('/a.html', 'http://www.baidu.com/b/s.html').toString(), 'http://www.baidu.com/a.html')
    equal($.URL('./a.html', 'http://www.baidu.com/b/s.html').toString(), 'http://www.baidu.com/b/a.html')
    equal($.URL('../a.html', 'http://www.baidu.com/b/s.html').toString(), 'http://www.baidu.com/a.html')

    var url = $.URL('../weba/sdasd/xsaw/qq.tm#asda?asd=asd&a=454', 'http://www.tgnet.com/sdawd/asda/');
    var search = url.search();
    deepEqual({asd:search.asd, a:search.a}, {asd:'asd', a:454});
    equal(search.toString(), '?asd=asd&a=454')
    equal(url.hash(), '#asda');
})

test('range', function(){
    deepEqual($.range(5), [0,1,2,3,4])
    deepEqual($.range(1, 5), [1,2,3,4])
    deepEqual($.range(1, 7, 2), [1,3,5])
})







