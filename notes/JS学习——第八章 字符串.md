# JS学习——第八章 字符串

字符串的知识本来应当放在前面，但前面漏了，因此补为第八章。

## 一、字符串类型

### （一）字符串

JS 中，字符串是一种基本类型。字符串可以用 “”、\`\`、'' 三种引号指定。例如，下面是一个示例字符串：

```
const str1 = 'Hello!';
```

JS 的字符串是一个基本类型，而不是类似 C 语言那样的字符串数组，但 JS 也支持使用类似数组的索引访问字符串。不过 JS 的字符串是只读的，无法通过索引更改。

例如：

```
console.log(str1[0]);        // H
str1[0] = 'A';
console.log(str1[0]);        // H
```

可以使用 str1\.length 属性来查询 string 的长度。但需要注意，length 是按 UTF\-16 码元计算的，例如：

```
console.log("😊".length);    // 2
```

表情 😊 占据了 2 个 UTF\-16 码元，因此其长度为2。

### （二）字符串的基本操作

#### 1、字符串拼接

JS 可以直接使用 \+ 号来合并字符串。例如：

```
let str1='Hello',str2='World!';
console.log(str1 + ' ' + str2);      // Hello World!
```

也可以写：

```
console.log(str1 += " World");
// 等价于 str1 = str1 + ' World'
```

注意：字符串中加号不仅可做数学运算，也可拼合字符串。

#### 2、模板字符串

之前已经讲过了，方法如下：

```js
const name = "Alice",age = 20;
console.log(`我叫${name}，今年${age}岁。`);
```

模板字符串还可以包含表达式：

```js
const a = 10,b = 20;
console.log(`${a} + ${b} = ${a + b}`);      // 10 + 20 = 30
```

模板字符串还支持多行文本：

```
const text = `
第一行
第二行
第三行
`;
```

## 二、字符串操作

### （一）截取字符串

#### 1、slice\(\) 函数

字符串的 slice\(\) 函数和数组基本相同。例如：

```
const str = "JavaScript";
console.log(str.slice(-1));          // "t"
console.log(str.slice(-3));          // "ipt"
console.log(str.slice(-6, -3));      // "Scr"
```

索引0是第一个字符，\-1是倒数第一个字符。另外还有一个区别：字符串是按 “码元” 而非 “字符数” 来截取的。

**注意**：这里和 Array\.slice\(\) 是一样的，索引从 0 开始，且取 start 不取 end。

#### 2、substring\(\) 函数

这是 JS 处理字符串的第二个方法。它与 slice 类似，但有以下两个区别：

- slice\(\) 支持负数，而 substring\(\) 会把负数当0；
- slice\(\) 当起点大于终点时返回空字符串，而 substring\(\) 会调换两者并且正常返回；

入门优先使用 slice\(\) 函数。

### （二）查找字符串

#### 1、includes\(\) 函数

基本使用方法和数组的 includes 类似（但不同），如下：

```
str.includes("string",position);
```

返回值是布尔值（是否具有某字符串）；position 是可选参数（索引），指定了从哪里**开始**查找。（只能设置起点，不能设置终点。）

```
const str = "I love JavaScript";
console.log(str.includes("JavaScript"));        // true
console.log(str.includes("love",8));            // false
```

#### 2、indexOf\(\) 函数

查找字符串第一次出现的位置。如果查不到，则返回\-1。基本语法如下：

```
str.indexOf("string",index);
```

例如：

```
const str = "Hello JavaScript";
console.log(str.indexOf("JavaScript"));          // 6
console.log(str.indexOf("Hello"));               // 0
console.log(str.indexOf("Python"));              // -1
```

如果只是要判断是否存在字符串，建议直接使用 includes\(\)。

还可以使用 lastIndexOf\(\) 来倒过来查找，因为 indexOf 是从左到右查找的。

#### 3、startsWith\(\) 和 endsWith\(\)

判断字符串是否以指定字符串开始/结束。例如：

```
const filename = "picture.png";
console.log(filename.startsWith("pic"));        // true
console.log(filename.startsWith("png"));        // false
console.log(filename.endsWith("png"));          // true
```

注意：includes、startsWith、endsWith 中动词都是第三人称单数形式。

### （三）替换字符串 —— replace\(\)、replaceAll\(\)

#### 1、基本用法

replace\(\) 函数的基本用法是：

```
str.replace(searchValue, newValue);
```

例如：

```
const str = "Hello World";
const result = str.replace("World", "JavaScript");
console.log(str);          // Hello World
console.log(result);       // Hello JavaScript
```

注意 replace 函数不会修改原字符串 str，而是新建一个字符串 result，这和数组的 slice\(\) 等是一样的。

#### 2、进阶用法

replace\(\) 默认只会替换第一次查找到的部分。例如：

```
const str = "apple apple apple";
console.log(str.replace("apple", "banana"));        // banana apple apple
```

replace\(\) 还支持使用正则表达式进行高级替换（先不深入研究），例如：

```
const str = "apple apple apple";
console.log(str.replace(/apple/g, "banana"));        // banana banana banana
```

这里的 /apple/g 是正则表达式，g 表示全局匹配。

此外还有 replaceAll\(\) 函数，可以批量替换字符串中所有符合条件的部分，用法和 replace\(\) 函数类似。

### （四）字符串的分割和并合

这里的分割和合并不是简单的 str1 \+ str2 或 str1\.slice\(\)，而是利用 “数据 \+ 分隔符 \+ 数据 ······” 的方式拆分和组织数据。

#### 1、分割：split 函数

split\(\) 函数可以根据给定的分隔符，将字符串分割为数组。其基础语法如下：

```
str.split(separator);
```

例如：

```
const str = "apple,banana,orange";
const fruits = str.split(",");
console.log(fruits);
```

结果是：

```js
["apple", "banana", "orange"]
```

如果传入的是 “”，则 split\(\) 会按码元拆分。对于英文来说，按码元拆分就是按字符拆分，例如：

```
const str = "apple";
console.log(str.split(""));          // ['a','p','p','l','e']
```

如果不传入参数，则 split **不切分字符串**。（这和后面的 join\(\) 是不同的！）

split\(\) 显然不会修改原字符串。

#### 2、合并：join 函数

join 函数类似于 split 函数的 “逆操作”，可以使用分隔符将数组转化为字符串。其语法如下：

```
arr.join(separator);
```

例如：

```
const arr1=['h','e','l','l','o'];
const arr2=['apple','banana','orange'];
console.log(arr1.join(''));        // hello
console.log(arr2.join(','));       // apple,banana,orange
```

如果不传入参数，默认使用英文逗号作为分隔符。

#### 3、使用数组处理数据

使用 split 函数和 join 函数可以使字符串和数组相互转换，从而使用数组方法来处理字符串。（trim 函数下面讲）

```
const text = "HTML, CSS, JavaScript";
const languages = text.split(",");
const result = languages.map(item => item.trim());
console.log(result);
// ["HTML", "CSS", "JavaScript"]
```

### （五）字符串的整理 —— trim

当一个字符串中出现空格、制表符、换行符等内容时，有时我们希望去除这些内容，从而更加准确地对字符串执行判断。例如，用户输入的用户名是 "                    Mac Taylor         "，则我们希望把它转化为 “Mac Taylor” 再进行处理，这时就可以使用 trim\(\) 函数。

例如：

```
const str='     Mac Taylor        ';
console.log(str.trim());        // Mac Taylor
```

多行空格是这样的：

```js
const a=`

Hello World!

`;
console.log(a);
console.log(a.trim());

```

输出分别是：

```js
(空行)
(空行)
Hello World!
(空行)
```

```js
Hello World!
```

注意：trim\(\) 指令只能删除首尾的空白，不会删除中间的空白。

如果想只删除首/尾的空白，可用 trimStart\(\) 与 trimEnd\(\)。注意，trim 没有参数，但要写 \(\)。

## 三、字符串方法总结

字符串和数组具有某些公共方法，下面是一张总结表格。

| 方法 | 字符串 | 数组 |
| :---: | :---: | :---: |
| `slice()` | 支持 | 支持 |
| `includes()` | 支持 | 支持 |
| `indexOf()` | 支持 | 支持 |
| `lastIndexOf()` | 支持 | **支持** |
| `map()` | —— | 支持 |
| `filter()` | —— | 支持 |
| `split()` | 支持 | —— |
| `join()` | —— | 支持 |