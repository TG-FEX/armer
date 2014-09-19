suite('core/url', function(){
    suite('相对地址转换、初始化', function(){
        test('/xx相对地址', function () {
            equal($.URL('/a.html', 'http://www.baidu.com/a/s/s.html').toString(), 'http://www.baidu.com/a.html')
        });
        test('xx相对地址', function () {
            equal($.URL('a.html', 'http://www.baidu.com/a/b.html').toString(), 'http://www.baidu.com/a/a.html')
        });
        test('./xx相对地址', function () {
            equal($.URL('./s.html', 'http://www.baidu.com/b/a.html').toString(), 'http://www.baidu.com/b/s.html')
        });
        test('../xx相对地址', function () {
            equal($.URL('../a.html', 'http://www.baidu.com/s/asd/a.html').toString(), 'http://www.baidu.com/s/a.html')
        });
    });

    var url = $.URL('../weba/sdasd/xsaw/qq.tm#asda?asd=asd&a=454', 'http://www.tgnet.com/sdawd/asda/');
    suite('读写search', function(){
        test('读取', function () {
            var search = url.search();
            deepEqual({asd: search.asd, a: search.a}, {asd: 'asd', a: '454'});
            equal(search.toString(), '?asd=asd&a=454')
        });
        test('写入search', function(){
            url.search({b:'123',a:'321'});
            var search = url.search();
            deepEqual({b: search.b, a: search.a}, {b: '123', a: '321'});
        })
    })
    suite('读写hash', function(){
        test('读取', function () {
            equal(url.hash(), '#asda')
        });
        test('写入', function(){
            url.hash('#asdasd');
            equal(url.hash(), '#asdasd')
        })
    })

    suite('读写hostname', function(){
        test('读取', function(){
            equal(url.hostname(1), 'tgnet');
            equal(url.hostname(), 'www.tgnet.com')
        })
        test('写入', function(){
            url.hostname('www.sina.com')
            equal(url.hostname(), 'www.sina.com');
            url.hostname(1, 'baidu')
            equal(url.hostname(), 'www.baidu.com');
        })
    })
    suite('读写host', function(){
        test('读取', function(){
            equal(url.host(), 'www.baidu.com')
        })
        test('写入', function(){
            url.host('www.sina.com:8270')
            equal(url.host(), 'www.sina.com:8270')
        })
    });
})
