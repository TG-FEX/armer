# armerJS使用指南 #
-------------------------
## 模块划分 ##
1. 核心模块
	> 核心模块主要用于系统的基本配置，核心的方法，模块调度引擎等
2. 补丁模块
	> 补丁模块主要用于让浏览器保持接口统一提供一些补充原生js接口的方法
3. mvvm模块
	> 为框架提供MVVM的功能
4. 语言模块
	> 提供一系列的常用工具函数来扩展ecma语言的不足
5. css模块
	> 提高jQuery对CSS的分析能力
6. 动画模块
	> 提高jQuery对动画的处理能力
7. 输入输出模块
	> 扩充ajax和提供信息通信中心能力
8. 事件扩充模块
	> 提供一些更强大的事件模型
9. UI模块
	> 一系列的封装好的UI方法
10. 其他模块
	> 一些关于窗口的工具函数等

## 核心模块 ##
-------------------------
### $.slice() ###
> 为一些类数组提供类似Array.prototype.slice的方法

### $.mix() ###
> $.extend的别称

### $.generateID() ###
> 生成一个全局唯一ID

### $.radom() ###
> 生成一个随机数

### $.oneObject() ###
> 生成键值统一的对象，用于高速化判定

### $.trace() ###
> 一个输出控制台方法，兼容所有浏览器

### $.serialize() ###
> 序列化通过对象或数组产生类似cookie、get等字符串

### $.unserialize() ###
> 反序列化对象

### $.isArrayLike() ###
> 判断某变量是否为数组或者类数组

### $.range() ###
> 生成一个整数数组，类似[1,2,3,4,5]

### $.innerHTML() ###
> 修改node的innerHTML（确保老式IE能正常使用）

### $.clearChild() ###
> 清除node里边所有子元素

### $.parseFragment() ###
> 将文本转换为html碎片对象

### $.nextTick() ###
> 缓存一个function在浏览器空闲的时候执行

### $.URL() ###
> URL对象用于分析路径或者转换路径

### require() ###
> 请求一个或多个模块
### define() ###
> 定义一个模块

## 补丁模块 ##
-------------------------
### Array.prototype.unshift()
> 修复IE67下unshift不返回数组长度的问题

### Array.prototype.splice()
> 修复IE splice必须有第二个参数的bug

### Data.prototype.getYear()
> 修复IE5-7 getYear表现跟标准不一致的问题

### Data.prototype.setYear()
> 修复IE5-7 getYear表现跟标准不一致的问题

### Number.prototype.toFixed()
> 修复IE6 toFixed的bug

### String.prototype.substr()
> 修复部分浏览器substr不支持负数的bug

### Node.prototype.contains() 
> 修复sarafi5+ 把contains方法放在Element.prototype上而不是Node.prototype上的问题

### Object.prototype.create()
> 创建一个对象(让不支持该方法的浏览器支持该方法)

### Object.prototype.keys()
> 返回一个该对象所有键的数组(让不支持该方法的浏览器支持该方法)

### Object.prototype.getPrototypeOf()
> 返回一个对象的原型(让不支持该方法的浏览器支持该方法)

### Array.prototype.indexOf()
> 定位操作，返回数组中第一个等于给定参数的元素的索引值；让不支持该方法的浏览器支持该方法(让不支持该方法的浏览器支持该方法)

### Array.prototype.lastIndexOf()
> 定位引操作，同上，不过是从后遍历。(让不支持该方法的浏览器支持该方法)

### Array.prototype.forEach()
> 迭代操作，将数组的元素挨个儿传入一个函数中执行,类似$.each(让不支持该方法的浏览器支持该方法)

### Array.prototype.filter()
> 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组(让不支持该方法的浏览器支持该方法)

### Array.prototype.map()
> 将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回(让不支持该方法的浏览器支持该方法)

### Array.prototype.some()
> 只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true(让不支持该方法的浏览器支持该方法)

### Array.prototype.every()
> 只有数组中的元素都满足条件（放进给定函数返回true），它才返回true(让不支持该方法的浏览器支持该方法)

### Array.prototype.reduce()
> 将该数组的每个元素和前一次调用的结果运行一个函数，返回最后的结果(让不支持该方法的浏览器支持该方法)

### Array.prototype.reduceRight()
> 将该数组的每个元素和前一次调用的结果运行一个函数，返回最后的结果(让不支持该方法的浏览器支持该方法)

### Data.prototype.now()
> 返回一个当前时间的数字值(让不支持该方法的浏览器支持该方法)

### String.prototype.trim()
> 去除一个字符串首尾空格(让不支持该方法的浏览器支持该方法)

### String.prototype.repeat()
> 将字符串重复N遍(让不支持该方法的浏览器支持该方法)

### String.prototype.startsWith()
> 判断字符串是否以另一个字符串开头(让不支持该方法的浏览器支持该方法)

### String.prototype.endsWith()
> 判断字符串是否以另一个字符串结尾(让不支持该方法的浏览器支持该方法)

### String.prototype.contains()
> 判断字符串是否包含另一个字符串(让不支持该方法的浏览器支持该方法)

### Function.prototype.bind()
> 返回一个新的函数，该函数会以固定的上下文来执行原来的函数(让不支持该方法的浏览器支持该方法)

### window.localStorage
> 让不支持本地存储的浏览器支持本地存储
#### localStorage.setItem()
> 添加一个本地存储项
#### localStorage.getItem()
> 获取一个本地存储项
#### localStorage.removeItem()
> 移除一个本地存储项
#### localStorage.clear()
> 清楚所有本地存储
#### localStorage.key()
> 返回第n个本地存储

### window.JSON
> 让不支持JSON的浏览器支持JSON
#### JSON.stringify
> 将一个变量转换为json字符串(暂时不支持第二第三参数)
#### JSON.parse
> 将一个json字符串转换为正确的类型

### $(window).on('hashchange')
### $(window).hashchange
> 让浏览器支持onhashchange事件

## 语言模块
--------------------------------
### $.defaults()
> 为hash选项对象添加默认对象

### $.isString()
> 判断是否是字符串

### $.isNative()
> 判断某个方法是不是某个对象的原生方法

### $.isEmptyObject()
> 判断某个对象是否不存在键值

### $.format()
> 字符串插值，有两种插值方法。
>> 第一种，第二个参数为对象，#{}里面为键名，替换为键值，适用于重叠值够多的情况
>> 第二种，把第一个参数后的参数视为一个数组，#{}里面为索引值，从零开始，替换为数组元素

### $.dump()
> 查看对象或数组的内部构造

### $.parseJS()
> 把字符串在当前域运行当作JS执行

### $.parseBase64()
> 将文本数据转换为base64数据

### $.parseCSS()
> 将字符串转换为css

### $.unit()
> 在数字末尾加上单位

### $.hyphen()
> 将单词转换为连字符格式

### $.isEqual()
> 判断两个变量是否相等

### $.type()
> 强化$.type使其支持第二个参数返回布尔类型

### $.factory()
> 一个生成类工厂

### $.String.byteLen()
> 取得一个字符串所有字节的长度，中文占用两个字符

### $.String.undersored()
> 将一个字符串单词转换为下划线风格

### $.String.capitalize()
> 将一个字符串转换为首字母大写的风格

### $.String.stripTags()
> 移除字符串里边所有html标签

### $.String.stripScripts()
> 移除字符串里边所有script标签

### $.String.unescapeHTML()
> 将已经escape的HTML标签还原为可解释的HTML标签

### $.String.escapeRegExp()
> 将字符串安全转化为正则源码

### $.String.pad()
> 字符串左侧或右侧补位

### $.Array.contains()
> 返回数组是否包含某个值的布尔值

### $.Array.shuffle()
> 将数组里边所有元素随机洗牌

### $.Array.random()
> 随机从数组抽出一个元素

### $.Array.flatten()
> 平坦化一个数组，返回一个一维数组

### $.Array.compact()
> 过滤数组中的null和undefined返回一个新数组

### $.Array.unique()
> 返回一个没有重复值的数组

### $.Array.merge()
> 合并两个数组

### $.Array.union()
> 取两个数组的并集

### $.Array.interect()
> 取两个数组的交集

### $.Array.diff()
> 取两个数组的差集

### $.Array.min()
> 获得数组元素的最小值

### $.Array.max()
> 获取数组元素的最大值

### $.Array.clone()
> 深度拷贝一个数组

### $.Array.inGroupOf()
> 将数组以n个位单位分组为一个二维数组

### $.Number.limit()
> 确保数值在[n1,n2]闭区间之内,如果超出限界,则置换为离它最近的最大值或最小值

### $.Number.nearer()
> 给出两个数字，求出距离目标最近的一个值

### $.Number.round()
> 精准取得四舍五入值

### $.Object.subset()
> 根据传入数组取当前对象相关的键值对组成一个新对象返回
> $.Object.subset({one:1,two:2,three:3}, ['one', 'three']) ==> {one:1, three:3}

### $.Object.forEach()
> 将参数一的键值都放入回调中执行，如果回调返回false中止遍历

### $.Object.map()
> 将参数一的键值都放入回调中执行，收集其结果返回

### $.Object.clone()
> 进行深拷贝，返回一个新对象，如果是浅拷贝请使用$.extend

### $.Object.merge()
> 将多个对象合并到第一个参数中或将后两个参数当作键与值加入到第一个参数

### $.Date.format()
> 将时间对象转换为指定格式

## mvvm模块
---------------------------------------
### $.VM();
### $.VM.scan();

## css模块
---------------------------------------
### $.Transform()
> 用于分析transform
### $.fn.css()
> 增强css的transform分析功能
### $.fn.position()
> 增强为可以对对象进行定位设置

## 动画模块
----------------------------------------
### $.Transition()
> 提供CSS3 transition
### $.fn.transit()
> 提供CSS3动画为高级浏览器$.fn.animate的替代方案
### $.fn.addClass()、$.fn.removeClass、$.fn.toggleClass
> 用于低级浏览器通过分析class的样式变化，来计算动画过场来实现对transition的兼容

## 输入输出
----------------------------------------
### $.ajax()
> 新增predictType参数来预判加载的格式
> 增加类型css、image、file
> 修复IE8-的error缺失状态





 
 



















