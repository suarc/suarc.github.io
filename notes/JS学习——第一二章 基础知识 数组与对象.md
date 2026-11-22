# JS学习——第一章~第二章

## 第一章 基础知识

JavaScript 是一门编程语言，DOM 中 getElement 等都是提供给 JavaScript 的 API，而非 JS 本身。JS 本身也可以写后端，如 NodeJS。

#### **1、基础语法**

JavaScript 的基本内容，如 for、if 等，与 C 语言差距不大，可以直接复用。

注意：JavaScript 中 == 表示宽松相等（执行类型转换），而 === 表示严格相等（不执行类型转换）。例如：

```
console.log(1=="1");      //true
console.log(1==="1");     //false
```

补一个三元运算符，C 语言中有，但我 C 语言学习时漏了：

```
语句 条件 ? 若为True则采用的表达式 : 若为False则采用的表达式 ;
```

#### **2、数据类型**

JS 没有严格的类型区分，不执行严格的数据类型检查。例如 int、double 等（统一为number）。

JS 使用 let 定义变量、而 const 定义固定量（不能简单理解为常量。例如，const a=对象A，则不能将 a 指定为其他对象，但可以通过a改变对象A的属性内容）。

在 JS 中，若数据运算得不到有效的数字/值缺失时，一般有两种值：

- NaN —— **非法数字**，Not a Number，例如 0/0 的结果。NaN属于js的number类型。

```
console.log(0 / 0);            // NaN
console.log("abc" - 1);        // NaN
//注意：1 / 0 返回的是 Infinity（无穷大）
```

- undefined —— **未定义值**，即值缺失/未赋值。

```
let b;
console.log(b);                //undefined
```

此外还有一个 Null，是显示表示“空值”的写法。

#### **3、字符串**

可以用反引号来声明字符串模板:

```
`I am ${变量}`
```

JS 中双引号和单引号都可以定义字符串，两者没有区别，只是可以减少转义符（\）的使用。例如：

```
const s1 = "It's ok";      // 里面单引号直接写
const s2 = 'It\'s ok';     // 里面的单引号要转义
```

## 第二章 数组和对象

### （一）数组

#### **1、基础信息**

JS 的数组和 C 语言一样，下标都是从 0 开始的。

```
let arr=[1,2,3,4];
let arr=[];               //定义一个空的数组。
```

数组内部元素可以是不同类型的（甚至可以存对象），长度也可以不定。arr.length 可取数组长度（可用于判断数组是否为空）。

- arr.push(x) 在末尾加元素。
- arr.pop() 在末尾删除一个元素。
- arr.unshift(x) 在开头加元素。
- arr.shift() 在开头删除一个元素。

#### **2、遍历**

for of 是迭代遍历。

```
for (const score of scores) {
  console.log(score);
}
```

forEach 对某个元素执行特定函数【function（元素变量马上定义）】。forEach 的返回值是 undefined。

```
arr.forEach(item => work(item,another));
arr.forEach(work);
```

map（）新建数组（**转换**原有元素）。

```
newarr=arr.map(n => n * 2);
newarr=arr.map(student => student.name);
```

filter（）新建数组（**挑选**原有元素）。

```
newarr=arr.filter(score => score>=60);
```

注意：filter 本质上是执行一个函数，然后根据这个函数的返回值是 “truthy” 还是 “falsy” 类来决定某个元素是否保留。

filter 和 map 函数的返回值都是新的数组。

### （二）对象

#### 1、定义方式

```
const student= {
  name: "",
  age:18,
  score:90
}
const a = {};            //定义一个空对象
```

后定义的属性会覆盖前面定义的属性。注意属性结尾是逗号而非分号。

#### **2、对象的属性**

操作属性的方法：

- 取属性：student.name 或 student["name"]（方括号可以用变量作为属性）
- 添加新属性：student.id=95;
- 删除属性：delete student.id;

对象的属性值也可以是函数，如：

```
const student={
  introduce: function() { console.log(`${this.name}`) }
}
student.introduce();
```

在这种情况下，this 指代的是对象本身。

### （三）值的复制和引用

基本类型：和C语言一样，新建+复制。

对象、数组：“a，b” 等只是数组/对象的一个引用符号，因此a=数组、b=a，修改b会影响a。

如果要复制，使用展开语法 ...a，例如 [...a]、{ ...a }（但对象这样子只是浅拷贝，只复制第一层）

例如：

```
const a = {
    name: "Alice",
    address: {
        city: "Tokyo"
    }
};
```

用 b= { ...a } 时，成功把 name 直接复制到了 b 中，但 address 作为 a 这个对象的属性，本身也是一个对象，因此 b 复制时只复制了其引用。

要深拷贝，使用语法 structuredClone()。

同样地，数组也有类似的情况。

```
const a=[1,2,3,4];
console.log(...a);        //1 2 3 4
```

上面是 ... 展开语法的实质——它会将可迭代的对象的元素依次展开为独立的实参。