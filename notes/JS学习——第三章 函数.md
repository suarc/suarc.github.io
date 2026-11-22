# JS学习（第三章——函数）

## **一、函数的定义**

### **（一）基本结构**

#### 1、基础结构

JS中的函数和C语言的语法类似，均使用return返回值。但JS不需要声明函数的类型、参数类型，可以直接写：

```
function fun(a,b) {
  return a+b;
}
```

若没有return，则函数调用后返回undefined（JS的特殊值——还没有值）。

JS的函数和C语言一样，return只能返回一个值（多值可用数组、对象等），return后立即结束，等等。

#### 2、函数也是一种值

下面是一个示例：

```
function greet() {
    console.log("Hello!");
}
const anotherGreet = greet;
anotherGreet();       // Hello!
```

greet 指代的是这个函数**本身**，而 greet\(\) 则是调用这个函数的**动作**。和对象、数组一样，JS中函数也是一种值，可以被传递、赋值。const anotherGreet = greet，并没有调用函数，而是将greet中对一个函数的“**引用**”**复制**了一份给anotherGreet。

更深入地讲，JS中有两类值：

- 原始值（primitive）：数据本身，如字符串、数字、布尔值，等等。
- 对象值（object）：一块可以被多个变量共同指向的数据，如数组、函数、对象。

在赋值时，原始值给出去的就是自己的复制，而对象值给出去的则是自己的**引用**的复制。

```
let a=[1,2,3];
let b=a;
b[0] = 2;
console.log(a);
```

这段内容输出的结果是 \[2，2，3\]。原因是当执行到 \[1，2，3\] 这个对象时，\[1，2，3\] 这段“字面量”作为“动作”本身就在内存中创建了一个匿名的对象A，但这个“动作”给出的结果是指向这个匿名对象A的引用。因此，赋给a的实际上是对A的引用。当let b=a时，b从a处复制到的也是对A的引用，因此a、b指向的是同一个对象A。

#### 3、函数值的作用

函数也是一种值，因此可以被当作“动作”放到对象和数组里，可以作为回调函数（下面再讲）的参数，可以通过参数传递来调用函数（**由变量的内容决定函数名字**），等等。

```
function runTwice(fn) {
    fn();
    fn();
}
runTwice(greet);   // 结果是：Hello! Hello!
```

### **（二）三种定义方式**

函数有3种定义方式，第一种是声明方式，剩下两种都属于表达式。2、3实际上是把函数作为表达式，没有自己的声明结构，因此要由const/let声明一个名称，不能独立成句；而1则自带函数声明，可以独立成句。

#### **1、函数声明**

```
function fun(a,b) {
  return a+b;
}
```

#### **2、函数表达式**

```
const fun = function (a,b) {
  return a+b;
};
```

注意末尾的“\}”要有";"。

此外，还有一种进阶写法（给函数命名）。例如，下面的函数同时有 fun 和 test 两种函数名称，但fun是外部名称，test是内部名称。test这个名称只在函数内部可用（适合用来实现递归、调用自己）。

```
const fun = function test(a,b) { };
```

#### **3、箭头函数**

```
const add3 = (a,b) => {
  return a+b;
};
```

这种写法和表达式法类似，“参数” =\> \{ 函数功能 \}。注意末尾的“\}”要有";"。

箭头函数有两种简略写法：

```
const square = num => {
  return num*num;
};
```

只有一个参数时，可以不需要括号；没有参数则必须写括号。（这是箭头写法独有的省略。）

此外，如果函数内容只有一行（返回和计算做到一起，并且**返回内容不是对象**），可以省略花括号和return。例如：

```
const square = num => num * num;
```

#### **4、总结**

```
function 函数名称(参数) {}                      //用名称、参数、内容直接定义一个函数
const 函数名称 = function (参数) {};            //使用参数和内容定义一个“函数对象”，然后指定给一个名称
const 函数名称 = 参数 => {};                    //使用“参数 => {内容}”（=>是结构语法，像是“传入”）的方法定义一个“函数对象”，然后指定给一个名称
```

定义方式2、3本质上是“新建一个匿名函数，再取一个名称用于指向它”（像定义变量一样），因此末尾的“\}”要有";"。

注意：如果函数想要有返回值，只有单行箭头函数才能省略return（它那行的结果就是返回值），其他情况下都必须保留return。如果没有return，函数默认返回 undefined。

### **（三）函数与作用域**

#### 1、函数的定义位置

直接使用function fun\(\)方法定义的函数，会在代码执行前被提升到作用域的顶部，因此可以先调用后定义，例如：

```
sayHi();
function sayHi() {
  console.log("hi");
}
```

但const方法定义的函数，是和变量定义走一条路的，因此必须先定义（声明）再使用。例如，下面的代码是不正确的：

```
sayHi();
const sayHi = function () {
  console.log("hi");
};
```

为了方便管理，实际写代码时建议函数都先定义再调用。

#### 2、作用域问题

作用域决定了变量在哪些地方可以被访问。函数的引入会影响变量的作用域。（下面的内容不考虑var）

**① 全局作用域（最基础）**

```
const message = "Hello";
const greet = () => console.log(message);
greet();    // Hello
```

message变量是在最外侧定义的，因此greet函数内可访问message变量，这就是全局作用域。

**② 函数作用域**

```
function test(a,b) {
    const message = "Inside";
    console.log(message);
}
test(); // Inside
console.log(message); // ReferenceError
```

message定义在函数内部，因此只能在函数内部被访问，出了函数之后就没人认了。

注意：test函数的形式参数a、b在括号中被声明了，也属于函数作用域，类似于在函数中写了 let a,b;。（注意：是先定义a再定义b的）

**③ 块级作用域**

定义在一个 \{ \} 内的变量，只能在这个 \{ \} 的范围内使用。

```
if (true) {
    let x = 10;
}
console.log(x); // ReferenceError
```

函数本身也是一个 \{ \} 块，其行为有些类似块级作用域，但不完全一致（见词法作用域）。

**④ 词法作用域**

```
function outer() {
    const message = "Hello from outer";
    return function inner() {
        console.log(message);
    };
}
const savedFunction = outer();
savedFunction(); // Hello from outer
```

**内部函数**可以访问外部函数中的变量。

词法作用域有一个很重要的概念——**闭包**：内部函数可以继续访问它定义时的外部词法环境，即使外层函数已经执行完毕。（这种行为不是偶然现象，而是 JavaScript 作用域机制的一部分）

## 二、函数的调用——参数

### （1）形式参数和实际参数

这个知识和C语言类似：形参是定义函数时的“占位符”，而实参则是调用函数时真正传递进去的数值。

```
function add(a, b) {   // a、b 是形参（定义时占位）
  return a + b;
}
add(1, 2);             // 1、2 是实参（调用时真正传进去的值）
```

### （2）参数检查机制

JS不执行严格的参数个数检查机制。对于多传/少传实参，JS这样处理：

- 如果传入的参数少了（实参＜形参），则缺的传入 undefined；
- 如果传入的参数多了（实参＞形参），多出来的不会被绑定到普通形参上。

在JS中“形参个数”只是建议，不是强制约束。

注意：上面的内容不是绝对的，下面的内容会打破相关约束。

### （3）传参少了——默认参数

函数可以为形式参数设置默认值，这样如果该形式参数为 undefined 时，则采用默认值。

定义默认值的方法是在括号中使用赋值符号，下面是一个示例：

```
const greet = (name = "Guest") => console.log(name);
greet(); // Guest
greet("Tom"); // Tom
```

注意：默认参数只有在传入的实参值为 undefined 时才生效。如果传入了明确值（如greet\(null\);），则不生效。

### （4）传参多了——剩余参数

多传的实参会被忽略，但也可以通过其他方法获得，方式是使用**剩余参数**。

```
function sum(a, ...nums) {
  return nums.length;
}
console.log(sum(1, 2, 3));         //返回2
```

在括号中放置 \.\.\.nums 意味着将多传的参数都放在**数组** nums 中。注意 \.\.\.nums 只能放在括号的最后，并且只能有一个（显而易见！）。

在JS中，还曾使用 arguments。arguments 是一种类数组对象（但不是数组，不能用 filter 等），默认存在、无需像 \.\.nums 一样事先声明。箭头函数中没有 arguments。现在已经不推荐使用 arguments，了解即可。

```
function sum() {
  console.log(arguments.length); // 3
  console.log(arguments[0]);     // 1
}
sum(1, 2, 3);
```

## 三、函数的调用——回调函数

### （一）回调函数

回调函数：把一个函数传给另一个函数，由后者在适当的时候调用它。先看一个示例：

```
function sayHello() {
  console.log("你好！");
}
function runFunction(fn) {
  fn();
}
runFunction(sayHello);
```

这里就先定义了一个函数 sayHello\(\)，但没有调用。随后同样定义了一个函数 runFunction\(\)，其内容是“将传入参数作为函数名，调用一个特定的函数”。关键是 runFunction\(sayHello\)，这里将 sayHello 作为 runFunction 在运行时调用的函数，因此这里 sayHello 成为了回调函数。

回调函数可以用箭头函数方法简写，例如：

```
function runFunction(fn) {
  fn();
}
runFunction(()=>{console.log("你好！")});
```

### （二）回调函数的参数

回调函数本身是函数，可以接收多个参数。由于回调函数是由**主调函数**（调用回调函数的函数）调用的，因此回调函数的参数也由主调函数提供。

一些常见的主调函数提供给回调函数的参数如下：

#### 1、forEach、map、filter\(\)

```
//以下都是示例写法，不是真正可运行的JS代码
arr.forEach(fun(item,index,arr));
arr.map(fun(item,index,arr));
arr.filter(fun(item,index,arr));
```

forEach 会依次为被调函数 fun 传入三个实参，分别是数组的当前元素、索引（0\~n\-1）、当前的整个数组。注意：传入的实参（当前元素、索引、数组）是由形参的位置决定的，即第1个位置的形参传入当前元素，第3个位置的形参传入整个数组，等等。

filter 和 map 函数的参数和 forEach 一样，都是 item、index、array。

filter 实际上是根据回调函数的返回值是 truthy 还是 falsy 来决定元素是否保留，而 map 则是将回调函数的返回值作为新数组的元素。

#### 2、其他情况

注意：参数可以少给，但不能跳过，因为**传入实参的类型是形参的位置决定的**。例如 forEach\(\) 有三个参数，依次为 item、index、arr，如果需要 item 和 arr，则被调函数必须写 fun\(a,b,c\) 然后调用 a、c 分别作为 item、arr，不能写 fun\(a,c\)。不过，也可以用下划线作为占位符替代b，例如 fun\(a,下划线,c\)。

## 四、函数的闭包

前面已经提到了词法作用域，现在再来讨论一下闭包问题。

### （一）闭包

```
function geti()
{
  let i=5;
  return ()=>{
    console.log(i);
  };
}
const test = geti();
```

调用 test\(\) 函数时，得到的结果是 5。执行 const test = geti\(\) 后，geti\(\) 函数已经执行结束了；但是其内层函数 test\(\) 却仍然能访问外层函数的 i。

这种现象就是**闭包**：JS 会为函数保留访问其外部词法环境的能力，即使其外部函数已经执行结束。

### （二）let 和 var 在闭包中的不同行为

let、var 两种定义变量的方法，虽然都能定义变量，但作用范围不同；var 是函数作用域，而 let 是块级作用域。这一点会对闭包产生显著的影响。

#### 1、let、var 的区别

```
function hello()
{
  for(var i=1;i<=10;i++) {}
  i=6;
  console.log(i);
}
hello();
```

结果是 6。因为 i 虽然是在 for 中声明的，但它是 var 声明的，因此它具有函数作用域，在整个 hello\(\) 函数内都能生效。因此，后面设定 i=6 是合法的。

如果我们把 var 改为 let，则严格模式下会报错，因为 let 是块级作用域，出不了 for，会在 i=6 处报错（变量未声明）。

#### 2、闭包中的 let

看下面的例子：

```
function counter()
{
  let arr = [];
  let count = 30;
  for(let i=1;i<=3;i++)
  {
    arr.push({
      ['add']: ()=>{
        count = count + i;
        console.log(count);
      }
    });
  }
  count = 20;
  return arr;
}
```

控制台中得到的结果是：

```js
> const arr = counter();
> arr[0].add();
21
> arr[2].add();
24
```

由于闭包，for 中生成的 add 函数均可访问其外层作用域的 count、i 变量。



- 第一个重点是：在 for 循环结构和函数闭包同时出现时，let 会为每次迭代独立绑定 i。因此，上面的 for 循环中，arr\[0\] 所得函数的 i 是 1，而 arr\[2\] 所得函数的 i 是 3。
- 第二个重点是：JS 保留的是内层函数对外层词法环境的访问能力，并不是直接把创建函数前变量的值直接复制进去。虽然 count = 20 是创建函数后才出现的，但调用 add\(\) 函数时，取到的 count 仍然是 20，因为 count = 20 仍然是内层函数可访问的外层词法环境；多个 add\(\) 函数也共同享有一个 count。



因此，最终计算出的 arr\[2\]\.add\(\) 的结果是 20 \+ 1 \+ 3 = 24。

数组的 forEach 和 for \(const a of arr\) 也具有相同的行为。while 中只有将变量声明放到循环体内部才具有相同行为。

#### 3、闭包中的 var

如果把上面代码中 for 循环中的 let 改为 var，情况会变成这样：

```
function counter()
{
  let arr = [];
  let count = 30;
  for(var i=1;i<=3;i++)
  {
    arr.push({
      ['add']: ()=>{
        count = count + i;
        console.log(count);
      }
    });
  }
  count = 20;
  return arr;
}
```

```js
> const arr = counter();
> arr[0].add();
24
> arr[2].add();
28
```

这是因为 var 不具有上面所说的 let 的行为，它的定义域是函数定义域，不会因为 for 循环而为每个内部函数独立创造 i。调用函数时，不管是哪个 add\(\)，其 i 均等于 4（i 初始值为1，循环中 i\+\+ 了三次）。

下面是 for \+ var 的类似 let 写法，可以用于理解为什么 var 不会创造 i：

```
let i;
for(i=1;i<=3;i++)
{
  //业务代码
}
```

当 let i 不在 for 内部时，其行为就回到了我们上面所说的 count 的类似情况。i 的最终取值是 4，因此所有 add\(\) 的 i 均为 4。甚至我们在 return arr; 之前如果再写一句 i=100；add\(\) 的 i 也会变为 100。