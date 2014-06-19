test('isString',function(){
    equal($.isString('aaa52'), true, '是字符串')
})

test('isNative',function(){
    equal($.isNative('open',window), true, '是固有方法')
})

test('isEmptyObject',function(){
    equal($.isEmptyObject({}), true, '')
})

test('filter',function(){
    equal($.filter([5,6,9,100,102],function(item,__){
        return item > 100;
    }), [102], '过滤数组')
})

test('format',function(){
    equal($.format('aaa#{0}','bbb'), 'aaabbb', '字符串插值')
    equal($.format('hi,#{name},i am #{old}',{name:'tao',old:'23'}), 'hi,tao,i am 23', '字符串插值')
})

test('dump',function(){

})

test('parseBase64',function(){
    equal($.parseBase64('10'), 'MTAA', '将text数据转换为base64字符串')
})

test('unit',function(){
    equal($.unit(55,'$'), '55$', '为数字加上单位')
})

test('hyphen',function(){
    equal($.hyphen('redApple'), 'red-apple', '转换为连字符线风格')
})

test('isEqual',function(){
    //equal($.isEqual(0,-0), false, '比较两个变量是否相等')
    //equal($.isEqual([1,2,3],[1,2,3]), true, '比较两个变量是否相等')
    //equal($.isEqual([1,2,3],[1,2,4]), false, '比较两个变量是否相等')
    //equal($.isEqual({name: 'tao',old: '23'},{name: 'tao',old: '23'}), true, '比较两个变量是否相等')
    //equal($.isEqual({name: 'tao',old: '23'},{name: 'tao1',old: '24'}), false, '比较两个变量是否相等')
})

test('byteLen',function(){
    equal($.String.byteLen('88发'), 4, '取得一个字符串所有字节的长度')
    equal($.String.byteLen('88,发'), 5, '取得一个字符串所有字节的长度')
    equal($.String.byteLen('88，发'), 6, '取得一个字符串所有字节的长度')
})

test('underScored',function(){
    equal($.String.underscored('redApple'), 'red_apple', '转换为下划线风格')
    equal($.String.underscored('red-apple'), 'red_apple', '转换为下划线风格')
})

test('capitalize',function(){
    equal($.String.capitalize('capitalize'), 'Capitalize', '首字母大写')
})

test('stripTags',function(){
    equal($.String.stripTags('<p class="test">it is a test!</p>'), 'it is a test!', '移除字符串中的html标签')
    equal($.String.stripTags('<script>alert(1)</script>'), 'alert(1)', '移除字符串中的html标签')
    equal($.String.stripTags('<p class="test"><a href="">test</a><script>alert(1)</script></p>'), 'testalert(1)', '移除字符串中的html标签')
})

test('stripScripts',function(){
    equal($.String.stripScripts('<script>alert(1)</script>'), '','移除字符串中所有的 script 标签')
    equal($.String.stripScripts('<p class="test"><a href="">test</a><script>alert(1)</script></p>'), '<p class="test"><a href="">test</a></p>','移除字符串中所有的 script 标签')
})

test('unescapeHTML',function(){
    equal($.String.unescapeHTML('&lt;p class=&quot;test&quot;&gt;前面是注释&#42;&lt;/p&gt;'), '<p class="test">前面是注释*</p>', '还原为可被文档解析的HTML标签')
})

test('escapeRegExp',function(){
    //equal($.String.escapeRegExp('^[a-z]{0,2}u$'), '', '将字符串安全格式化为正则表达式的源码')
})

test('pad',function(){
    equal($.String.pad(40,4), '0040', '在左边补零')
    equal($.String.pad(40,4,'xx'), 'xx40', '在左边补xx')
    equal($.String.pad(40,4,0,true), '4000', '在右边补零')
    equal($.String.pad(40,4,'xx',true), '40xx', '在右边补xx')
    equal($.String.pad(40,4,'xx',true,16), '28xx', '先转为十六进制，再在右边补xx')

})

test('contains',function(){
    ok($.Array.contains([1,2,3],1))
})

test('flatten',function(){
    equal($.Array.flatten(['level1',[['level2a'],['level2b',['level3a']]],[3],[4]]),['level1','level2a','level2b','level3a',3,4], '对数组进行平坦化处理')
})

test('compact',function(){
    equal($.Array.compact([null,'',,4]), ["", 4], '去除数组中的undefined和null')
})

test('unique',function(){
    equal($.Array.unique([1,5,1,3,1,3,1]), [5,3,1], '去除权重大于1的')
})

test('merge',function(){
    equal($.Array.merge([1,2], ['a','b']),[1,2,'a','b'], '合并数组')
    equal($.Array.merge([1,2,[3,4]],['a','b',['c','d']]), [1,2,[3,4],'a','b',['c','d']], '合并数组')
})

test('union',function(){
    equal($.Array.union([1,2,3],[1,3,5]), [2,1,3,5], '对两个数组取并集')
})

test('intersect',function(){
    equal($.Array.intersect([1],[1,3]),[1],'对两个数组取交集')
    equal($.Array.intersect([1,2,3],[1,3]),[1,3],'对两个数组取交集')
})

test('diff',function(){
    equal($.Array.diff([1,2,3],[4,5,6]),[1,2,3],'对两个数组取差集(补集)')
})

test('min',function(){
    equal($.Array.min([1,2,3]),1,'返回数组中的最小值')
})

test('max',function(){
    equal($.Array.max([1,2,3]),3,'返回数组中的最大值')
})

test('clone',function(){
    //equal($.Array.clone([1,2,[5,6,[7,8,9]]]),[1,2,[5,6,[7,8,9]]],'深拷贝当前数组')
})

test('inGroupsOf',function(){
    //equal($.Array.inGroupsOf([1,2,3,4,5],2,'fill'),[[1,2],[3,4],[5,'fill']],'将数组划分成N个分组')
})

test('subset',function(){
    deepEqual($.Object.subset({one:1,two:2,three:3}, ['one', 'three']), {one:1, three:3}, '根据传入数组取当前对象相关的键值对组成一个新对象返回')
})

test('forEach',function(){
    //deepEqual($.Object.forEach({one:1,two:2,three:3},function(val,key){var resule = [];if (val < 3) {return resule.push(val);}}), [1,2], '将参数一的键值都放入回调中执行，如果回调返回false中止遍历')
})

test('merge',function(){
    deepEqual($.Object.merge({no:1,name:'tao'},'sex','men'), {no:1,name:'tao',sex:'men'}, '将后两个参数当作键与值加入到第一个参数对象中')
    deepEqual($.Object.merge({no:1,name:'tao'},{sex:'men',father:'lisi'}), {no:1,name:'tao',sex:'men',father:'lisi'}, '将多个对象合并到第一个对象中')
})

/*
test('date',function(){
    deepEqual($.Date.format(new Date('2014-1-24'),'fullDate'), '2014年1月24日0000', '把日期对象转换为所需格式')
    deepEqual($.Date.format(new Date('2014-1-24'),'medium'), '2014-1-24 00:00:00', '把日期对象转换为所需格式')
    deepEqual($.Date.format(new Date('2014-1-24'),'mediumDate'), '2014-1-24', '把日期对象转换为所需格式')
    deepEqual($.Date.format(new Date('2014-1-24'),'mediumTime'), '00:00:00', '把日期对象转换为所需格式')
    deepEqual($.Date.format(new Date('2014-1-24'),'short'), '14-1-24 00:00:00', '把日期对象转换为所需格式')
    deepEqual($.Date.format(new Date('2014-1-24'),'longDate'), '2014年1月24日', '把日期对象转换为所需格式')
    deepEqual($.Date.format(new Date('2014-1-24'),'shortDate'), '14-1月-日', '把日期对象转换为所需格式')
    deepEqual($.Date.format(new Date('2014-1-24'),'shortTime'), '00:00', '把日期对象转换为所需格式')
})
*/
