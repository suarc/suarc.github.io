# JS学习——第九章 边界处理

边界处理问题是编程语言中的一种重要问题，它问我们的是：当输入为边界情况（如空数组、空对象、空字符串等）时，程序应当如何响应？

例如：

```
function calc(a,b)
{
  console.log(a/b);
}
```

这是一个简单的除法计算函数。在大部分情况下它都可以正常工作，但一旦输入 b = 0，就会出现 0 / 0 型错误，得到 NaN。这里的 b = 0 就是一种边界情况。

如果我们对 b = 0 的取值做特殊规定，提醒用户 b 输错了，例如：

```
function calc(a,b)
{
  if(b!=0) console.log(a/b);
  else console.log('ERROR!');
}
```

这就是一种简单的边界处理。

## 一、空内容及其布尔

边界问题的一大部分是在 **空内容** 上发生的，因此我们先介绍空内容。

#### 1、空内容

JS 中有五种常见的空内容：

```
const a = [];          // 空数组
const b = "";          // 空字符串
const c = {};          // 空对象
const d = null;        // 空值
let e;                 // undefined
```

注意，\[\]、\{\} 是空数组/对象，但它们仍然是数组/对象。

#### 2、truthy 和 falsy

现在设想一个函数：

```
function test(a)
{
  if(a) console.log('TRUE');
  else console.log('FALSE');
}
```

传入 undefined、NaN、null 时，正如我们的预期，得到的是 FALSE。然而当我们传入 \[\]、\{\} 时，得到的却是 TRUE。为什么？

这是因为 JS 中除了普通布尔（true/false，0/1）外，还有**广义布尔**（truthy、falsy）。当非布尔内容被传入判断语句时，JS 会根据其广义布尔，决定判断语句是否成立。

下面几种内容在 JS 的广义布尔中被判为 falsy：

```
false
0
-0
0n
""
null
undefined
NaN
```

除了这几个内容外，剩下的内容都会被判为 truthy，因此 \[\]、\{\} 得到的是 TRUE。

## 二、数组对空内容的处理

#### 1、如何判断数组为空？

空数组 \[\] 仍然是数组，在 if 中会被判为 truthy，因此不能用 if\(arr\) 的方式判断是否为非空数组，我们需要改用 length 方式。例如：

```
if(arr.length == 0) console.log('empty');
if(Object.keys(obj).length == 0) console.log('empty');
```

#### 2、数组方法对空数组的处理

map\(\)、filter\(\)、some\(\) 都是普通的 “存在性” 问题，因此处理方法符合直觉，不用直接记。

every\(\) 方法对空数组的结果是 true，因为 every 看起来是 “全称问题”，但它是以 “是否存在不符合条件的元素” 的存在性方法来决定结果的。

reduce\(\) 方法中，不事先声明 sum 累积变量的初始值，默认会以第一个元素的值作为初始值，并且从第二个元素开始 reduce。此时若数组为空，因为找不到第一个元素，会报 TypeError。

## 三、对象的可选链和空值合并

### （一）可选链 “ ?\. ” 操作符

#### 1、引入

设想现在有一段业务代码：

```
function getAddress(obj)
{
  return obj.location.city + ' ' + obj.location.street;
}
const student1 = {
  name:"Bob",
  score:90,
  location: {
    city:'New York',
    street:'1234 Rd'
  }
}
const student2 = {
  name:"Alice",
  score:90
}
console.log(getAddress(student1));        // New York 1234 Rd
console.log(getAddress(student2));        // TypeError
```

（设想这里 Alice 的住址信息并未被采集，所以不具备 location 属性。）

当我们试图获取 Alice 的地址时，JS 报错 TypeError，导致程序无法继续执行。原因在于：Alice 并无 location 属性，因此 obj\.location 的结果是 undefined。JS 会尝试去取 undefined\.city，这就得到了 TypeError。 

我们当然可以用使 student2 包含 location 属性（且其内容全部初始化为 undefined）的方法解决，但实际的业务代码中，我们并不总是有修改 obj 格式、事先用 undefined 填充好所有缺省属性的条件。因此，这里我们要引入**可选链**操作符 “ ?\. ”。

#### 2、可选链操作符

可选链操作符 ?\. 的语法如下：

```js
obj.location?.city
```

它的意思是：如果 ?\. 左侧的 obj\.location 存在，则将对象链继续向右延申，获得 obj\.location\.city；否则不延申出去，直接报 undefined。

可选链操作符支持多次使用，例如：

```js
obj?.location?.city
```

这样，如果 obj 不存在，也不会报 TypeError，而是直接得到 undefined。

3、

try catch