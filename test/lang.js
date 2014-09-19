suite('core/main', function(){
    suite('#type(target, [type])', function(){
        test('target1', function(){
            assert.equal($.type('', 'String'), true);
        });
        test('target为数字应该返回"Number"', function(){
            assert.equal($.stringType(0), 'Number');
        });
        test('target为字符串应该返回"String"', function(){
            assert.equal($.stringType(''), 'String');
        });
    });
})

test('isString',function(){
    equal($.isString('aaa52'), true, '���ַ�')
})

test('isNative',function(){
    equal($.isNative('open',window), true, '�ǹ��з���')
})

test('isEmptyObject',function(){
    equal($.isEmptyObject({}), true, '')
})

test('filter',function(){
    equal($.filter([5,6,9,100,102],function(item,__){
        return item > 100;
    }), [102], '��������')
})

test('format',function(){
    equal($.format('aaa#{0}','bbb'), 'aaabbb', '�ַ��ֵ')
    equal($.format('hi,#{name},i am #{old}',{name:'tao',old:'23'}), 'hi,tao,i am 23', '�ַ��ֵ')
})

test('dump',function(){

})

test('parseBase64',function(){
    equal($.parseBase64('10'), 'MTAA', '��text���ת��Ϊbase64�ַ�')
})

test('unit',function(){
    equal($.unit(55,'$'), '55$', 'Ϊ���ּ��ϵ�λ')
})

test('hyphen',function(){
    equal($.hyphen('redApple'), 'red-apple', 'ת��Ϊ���ַ��߷��')
})

test('isEqual',function(){
    //equal($.isEqual(0,-0), false, '�Ƚ����������Ƿ����')
    //equal($.isEqual([1,2,3],[1,2,3]), true, '�Ƚ����������Ƿ����')
    //equal($.isEqual([1,2,3],[1,2,4]), false, '�Ƚ����������Ƿ����')
    //equal($.isEqual({name: 'tao',old: '23'},{name: 'tao',old: '23'}), true, '�Ƚ����������Ƿ����')
    //equal($.isEqual({name: 'tao',old: '23'},{name: 'tao1',old: '24'}), false, '�Ƚ����������Ƿ����')
})

test('byteLen',function(){
    equal($.String.byteLen('88��'), 4, 'ȡ��һ���ַ������ֽڵĳ���')
    equal($.String.byteLen('88,��'), 5, 'ȡ��һ���ַ������ֽڵĳ���')
    equal($.String.byteLen('88����'), 6, 'ȡ��һ���ַ������ֽڵĳ���')
})

test('underScored',function(){
    equal($.String.underscored('redApple'), 'red_apple', 'ת��Ϊ�»��߷��')
    equal($.String.underscored('red-apple'), 'red_apple', 'ת��Ϊ�»��߷��')
})

test('capitalize',function(){
    equal($.String.capitalize('capitalize'), 'Capitalize', '����ĸ��д')
})

test('stripTags',function(){
    equal($.String.stripTags('<p class="test">it is a test!</p>'), 'it is a test!', '�Ƴ��ַ��е�html��ǩ')
    equal($.String.stripTags('<script>alert(1)</script>'), 'alert(1)', '�Ƴ��ַ��е�html��ǩ')
    equal($.String.stripTags('<p class="test"><a href="">test</a><script>alert(1)</script></p>'), 'testalert(1)', '�Ƴ��ַ��е�html��ǩ')
})

test('stripScripts',function(){
    equal($.String.stripScripts('<script>alert(1)</script>'), '','�Ƴ��ַ������е� script ��ǩ')
    equal($.String.stripScripts('<p class="test"><a href="">test</a><script>alert(1)</script></p>'), '<p class="test"><a href="">test</a></p>','�Ƴ��ַ������е� script ��ǩ')
})

test('unescapeHTML',function(){
    equal($.String.unescapeHTML('&lt;p class=&quot;test&quot;&gt;ǰ����ע��&#42;&lt;/p&gt;'), '<p class="test">ǰ����ע��*</p>', '��ԭΪ�ɱ��ĵ�������HTML��ǩ')
})

test('escapeRegExp',function(){
    //equal($.String.escapeRegExp('^[a-z]{0,2}u$'), '', '���ַ�ȫ��ʽ��Ϊ������ʽ��Դ��')
})

test('pad',function(){
    equal($.String.pad(40,4), '0040', '����߲���')
    equal($.String.pad(40,4,'xx'), 'xx40', '����߲�xx')
    equal($.String.pad(40,4,0,true), '4000', '���ұ߲���')
    equal($.String.pad(40,4,'xx',true), '40xx', '���ұ߲�xx')
    equal($.String.pad(40,4,'xx',true,16), '28xx', '��תΪʮ����ƣ������ұ߲�xx')

})

test('contains',function(){
    ok($.Array.contains([1,2,3],1))
})

test('flatten',function(){
    equal($.Array.flatten(['level1',[['level2a'],['level2b',['level3a']]],[3],[4]]),['level1','level2a','level2b','level3a',3,4], '���������ƽ̹������')
})

test('compact',function(){
    equal($.Array.compact([null,'',,4]), ["", 4], 'ȥ�������е�undefined��null')
})

test('unique',function(){
    equal($.Array.unique([1,5,1,3,1,3,1]), [5,3,1], 'ȥ��Ȩ�ش���1��')
})

test('merge',function(){
    equal($.Array.merge([1,2], ['a','b']),[1,2,'a','b'], '�ϲ�����')
    equal($.Array.merge([1,2,[3,4]],['a','b',['c','d']]), [1,2,[3,4],'a','b',['c','d']], '�ϲ�����')
})

test('union',function(){
    equal($.Array.union([1,2,3],[1,3,5]), [2,1,3,5], '����������ȡ����')
})

test('intersect',function(){
    equal($.Array.intersect([1],[1,3]),[1],'����������ȡ����')
    equal($.Array.intersect([1,2,3],[1,3]),[1,3],'����������ȡ����')
})

test('diff',function(){
    equal($.Array.diff([1,2,3],[4,5,6]),[1,2,3],'����������ȡ�(����)')
})

test('min',function(){
    equal($.Array.min([1,2,3]),1,'���������е���Сֵ')
})

test('max',function(){
    equal($.Array.max([1,2,3]),3,'���������е����ֵ')
})

test('clone',function(){
    //equal($.Array.clone([1,2,[5,6,[7,8,9]]]),[1,2,[5,6,[7,8,9]]],'�����ǰ����')
})

test('inGroupsOf',function(){
    //equal($.Array.inGroupsOf([1,2,3,4,5],2,'fill'),[[1,2],[3,4],[5,'fill']],'�����黮�ֳ�N������')
})

test('subset',function(){
    deepEqual($.Object.subset({one:1,two:2,three:3}, ['one', 'three']), {one:1, three:3}, '��ݴ�������ȡ��ǰ������صļ�ֵ�����һ���¶��󷵻�')
})

test('forEach',function(){
    //deepEqual($.Object.forEach({one:1,two:2,three:3},function(val,key){var resule = [];if (val < 3) {return resule.push(val);}}), [1,2], '������һ�ļ�ֵ������ص���ִ�У����ص�����false��ֹ����')
})

test('merge',function(){
    deepEqual($.Object.merge({no:1,name:'tao'},'sex','men'), {no:1,name:'tao',sex:'men'}, '������������������ֵ���뵽��һ�����������')
    deepEqual($.Object.merge({no:1,name:'tao'},{sex:'men',father:'lisi'}), {no:1,name:'tao',sex:'men',father:'lisi'}, '���������ϲ�����һ��������')
})

/*
test('date',function(){
    deepEqual($.Date.format(new Date('2014-1-24'),'fullDate'), '2014��1��24��0000', '�����ڶ���ת��Ϊ�����ʽ')
    deepEqual($.Date.format(new Date('2014-1-24'),'medium'), '2014-1-24 00:00:00', '�����ڶ���ת��Ϊ�����ʽ')
    deepEqual($.Date.format(new Date('2014-1-24'),'mediumDate'), '2014-1-24', '�����ڶ���ת��Ϊ�����ʽ')
    deepEqual($.Date.format(new Date('2014-1-24'),'mediumTime'), '00:00:00', '�����ڶ���ת��Ϊ�����ʽ')
    deepEqual($.Date.format(new Date('2014-1-24'),'short'), '14-1-24 00:00:00', '�����ڶ���ת��Ϊ�����ʽ')
    deepEqual($.Date.format(new Date('2014-1-24'),'longDate'), '2014��1��24��', '�����ڶ���ת��Ϊ�����ʽ')
    deepEqual($.Date.format(new Date('2014-1-24'),'shortDate'), '14-1��-��', '�����ڶ���ת��Ϊ�����ʽ')
    deepEqual($.Date.format(new Date('2014-1-24'),'shortTime'), '00:00', '�����ڶ���ת��Ϊ�����ʽ')
})
*/
