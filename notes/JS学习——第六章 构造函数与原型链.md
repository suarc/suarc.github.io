# JS学习——第六章 构造函数与原型链

## 一、构造函数

### （一）构造函数

#### 1、基础方法

假设我们需要创建 100 个学生对象，每个学生都有姓名、年龄、自我介绍方法，按照之前的知识，我们需要这么创建：

```
const student1 = {
    name: "Alice",
    age: 20,
    introduce: function() {
        console.log(`我叫${this.name},今年${this.age}岁`);
    }
};
············
const student100 = {
    name: "Bob",
    age: 21,
    introduce: function() {
        console.log(`我叫${this.name},今年${this.age}岁`);
    }
};
```

显然，这种写法会造成大量的重复内容。为了避免这种情况，我们可以考虑**把对象也封装成函数**，从而实现批量创建对象。

例如：

```
function Student(name, age) {
    this.name = name;
    this.age = age;
    this.introduce = function() {
        console.log(`我叫${this.name}，今年${this.age}岁`);
    };
}
const student1 = new Student("Alice", 20);
const student2 = new Student("Bob", 21);

```

这种被设计为通过 new 调用、用于创建对象的函数（如图中的 Student\(\) ），通常称为**构造函数**。构造函数的基本使用方法是：使用 function 定义一个函数A，用 this\.key 定义对象的属性，然后在函数外通过 new 语法 \+ 函数A \+ **实参** 来创建对象。

#### 2、注意事项

构造函数有几个注意事项：

- 1、构造函数常使用 **大驼峰命名法 **来命名，以提醒开发者 “此函数是构造函数，需要使用 new 表达式构造”。
- 2、构造函数内常使用 this 设置待创建的对象的属性和方法。
- 3、如果构造函数显式设置了 return 一个对象，则 new 表达式得到的结果仍然是 return 的内容，而非 this 新建的对象（但**仍然会按 this 新建对象**）。如果 return 的是普通值，则仍然返回按 this 新建的对象。

我们之前学过的集合定义方法（const a=new Set\(数组\) ）就属于构造函数的运用。

### （二）构造函数中的 new

new Student\(\.\.\.\) 的执行过程是这样的（如果构造函数没有显式 return）：

- 1. 创建一个新的空对象；
- 2. 建立对象与构造函数原型之间的联系（现在先不用了解这是什么）；
- 3. 将构造函数内部的 this 指向这个新对象；
- 4. 执行构造函数，传入实参，根据构造函数给新对象增加属性和方法，最后返回新对象。

因此，student 最终接收到了创建好的对象。每次执行 new，都会创建一个新的对象。

### （三）构造函数和普通函数的区别

下面的构造函数，能够实现批量创建 Student 对象：

```
function Student(name, score) {
    this.name = name;
    this.score = score;
}
const student = new Student("Alice", 90);
```

如果不使用构造函数，也可以使用如下方法（**工厂函数**）来批量创建 Student 对象：

```
function createStudent(name, score) {
    return {
        name: name,
        score: score
    };
}
const student = createStudent("Alice", 90);
```

两种方法都可以，区别是工厂函数使用 return 显式返回新对象，而构造函数使用 new 表达式自动创建对象。

另外，构造函数本质上仍然是函数，并没有一种特殊的 function 语法。

## 二、原型对象与原型链

### （一）引入

我们在构造函数中设计了这样的代码：

```
function Student(name, score) {
    this.name = name;
    this.score = score;
    this.introduce = function() {
        console.log(`我叫${this.name}，成绩是${this.score}`);
    };
}
const student1 = new Student("Alice", 90);
const student2 = new Student("Bob", 85);
```

这里有一个问题：每一次 new Student 都会调用一次构造函数，因此每创建一个学生对象，就要创建一个 introduce\(\) 函数。如果学生对象很多，就可能造成资源的浪费。

事实上，所有学生对象的 introduce\(\) 函数都是相同的，因此它们完全可以共享一个函数。JS 的**原型机制**可以实现这一点。

### （二）原型对象

先看代码：

```
function Student(name, score) {
    this.name = name;
    this.score = score;
}
// 把 introduce 方法放到 Student 的 prototype 上
Student.prototype.introduce = function() {
    console.log(`我叫${this.name}，成绩是${this.score}`);
};
const student1 = new Student("Alice", 90);
const student2 = new Student("Bob", 85);
```

这里出现了一个新的东西：Student\.prototype。它是构造函数 Student 的一个**属性**，其内容是一个对象。这个对象就是 Student 的**原型对象**。

什么是原型对象？原型对象可以理解为多个对象所共有的一块公共区域。上面的代码中，student1、student2 各自独立存储 name、score，同时共有原型对象上的属性和方法，因此它们共同拥有对一个函数的引用。由于这两个对象是从同一个构造函数通过 new 构造出来的，它们具有相同的原型对象。

这就是原型机制的一个重要用途：**让多个对象共享属性和方法**。

### （三）原型链

在上面的示例中，通过 new Student 直接构造的对象并没有 introduce 方法，为什么仍然能够调用 student1\.introduce\(\) 呢？Student\.prototype 本身并不属于 student1。

这是因为 JS 存在下面的查找机制：

- 首先检查 student1 自己有没有 introduce 属性。
- 如果没有，就沿着它的原型链接，去原型对象（Student\.prototype）上查找。
- 如果原型对象也没有，就继续向原型的原型查找。
- 一直查找到原型链末端 null，如果仍然没有，就得到 undefined。

例如：

```js
function Student(name) {
    this.name = name;
}
Student.prototype.introduce = function() {
    console.log(this.name);
};
const student = new Student("Alice");
student.introduce(); // Alice

```

查找机制如下：

```js
student
  |
  │ 没有找到 introduce
  ↓
Student.prototype
  |
  │ 找到了 introduce
  ↓
调用该函数
```

这种机制就是**原型链机制**。简单来说，就是先查找对象本身，再查找对象的原型对象，再查找原型对象的原型对象 ······ 查到最后还是没有，就得到 undefined。这个链条就是**原型链**。JavaScript 对象不只有自己的属性，还可以通过原型链接访问其他对象上的属性和方法。

从上面的例子可以发现：introduce 是原型对象上的方法，但 student\.introduce\(\) 调用后 this 仍然指向的是 student。这是因为 this 是由函数的调用方法决定的，这里调用者仍然是 student。

下面是另外一个实际的例子：

```
function Student(name) {
    this.name = name;
}
const student = new Student("Alice");
```

它的查找路径是：

```js
student                 // 新对象
   ↓
Student.prototype       // 构造函数的原型对象（不是 Student ~ 函数）
   ↓
Object.prototype        // 对象的原型对象（不是 Object ~ 对象）
   ↓
null
```

也就是说大部分的对象最后都有一个 Object 原型，使得它们可以调用 Object 原型的一些方法。（有的特殊对象没有，后面再说）

### （四）原型属性和对象自己的属性

#### 1、如何判断是不是原型属性

如何判断一个对象的属性/方法是它自己的，还是它的原型链上的？答案是 Object\.hasOwn\(\) 方法。

我们之前提到过，可以使用 Object\.hasOwn\(对象, "属性"\) 和 "属性" in 对象 这两种方法来确定对象是否拥有某个属性。实际上这两种方法是有差别的：

- Object\.hasOwn\(\) 只检查对象本身。
- "属性" in 对象 会检查对象本身及**对象的原型链**。

例如：

```
function Student(name) {
    this.name = name;
}

Student.prototype.school = "大学";

const student1 = new Student("Alice");
const student2 = new Student("Bob");

console.log(Object.hasOwn(student1, "school"));      // false
console.log("school" in student1);                   // true
```

school 属性是原型链上的，因此 in 方法的结果是 true，而 hasOwn 方法的结果是 false。

#### 2、区分原型属性和自身属性

看下面的代码：

```
function Student(name) {
    this.name = name;
}
Student.prototype.school = "西电";
const student1 = new Student("Alice");

console.log(student1.school); // 西电

student1.school = "清华大学";
console.log(student1.school); // 清华大学
console.log(Student.prototype.school); // 西电
```

这里出现了一个很重要的地方：构造函数 Student 是没有 school 的，因此最初 student1 没有 school，访问 student1\.school 得到的是原型上的 “西电”。

但是向 student1\.school 写入的时候就不一样了。JS 发现 student1 没有 school 属性时，不会去修改 student1 的原型的 school 属性，而是为 student1 增加 school 属性！之后再读取 student1\.school 时，JS 会优先找到对象自己的属性，忽略原型上的相关属性，这种现象被称为**属性遮蔽**（Shadowing）。对于普通的可写数据来说，都是这样的。

#### 3、修改原型属性

JS 通过 new \+ 构造函数创建对象时，并不会将原型属性复制到每一个对象中（那样就不是原型属性了），而是使多个对象实例共有一个原型属性。

原型属性是通过例如 Student\.prototype\.school 的方法定义的，事实上这一方法也可以获得和改变原型属性。例如：

```
function Student(name) {
    this.name = name;
}
Student.prototype.school = "西电";            // 设置原型属性

const student1 = new Student("Alice");
console.log(student1.school); // 西电

Student.prototype.school = "清华大学";        // 改变原型属性
console.log(student1.school); // 清华大学
```

前面提到 Student\.prototype 也是一种对象，所以也可以单独用 Object\.hasOwn\(\)、delete、Object\.entries\(\)、解构对象等语法操作其属性和方法，甚至重新赋值。例如，下面的写法是正确的：

```js
Student.prototype = {
    school: "清华大学"
};
```

### （五）深入理解原型机制

#### 1、查看原型

JS 提供了 Object\.getPrototypeOf\(\) 方法，用于查询某个对象的原型对象。例如：

```
function Student(name) {
    this.name = name;
}

const student1 = new Student("Alice");
console.log(Object.getPrototypeOf(student1) === Student.prototype);      // true
```

注意区分：Student\.prototype 是构造函数 Student 新建的对象的原型对象，而 student1\.prototype 是 student1 对象自身名为 prototype 的属性，通常是 undefined。

#### 2、\.prototype 和 \[\[Prototype\]\] 的区别

这里要注意区分两个概念：构造函数的 \.prototype 和新对象的 \[\[Prototype\]\]。

构造函数的 \.prototype 是构造函数的属性（函数本质上也是一种 JS 对象，因此也具有属性），决定了在使用 new 表达式新建对象时，为新对象指定的原型对象是什么；而 \[\[Prototype\]\] 则是一个对象内部存储的对自己的”原型对象“的引用，是每个对象都具有的一个内部机制。Student\.prototype 得到的是前者，而 Object\.getPrototypeOf\(\) 方法得到的是后者。这两者一些情况下相同，但并不一定相同，例如：

```
function Student(name) {
  this.name = name;
}
Student.prototype.school = "A";
const student1 = new Student("Alice");
Student.prototype = { school:"B" };
const student2 = new Student("Bob");

console.log(student1.school)         // A
console.log(student2.school)         // B
```

原先使用 new 定义 student1 时使用的是初始原型，因此 student1 的 \[\[Prototype\]\] 的 school 是 A。但后来重新指定了新的原型 \{ school:"B" \}，构造函数的 prototype 属性从初始原型的**引用**变成了新原型的引用， 这时再用 new 定义 student2，student2 的 \[\[Prototype\]\] 就变成新原型了，其 school 变成 B。

所以，原型可以粗略地理解为：构造函数会将自己的原型属性 prototype 保存的原型对象的引用作为新对象的 \[\[Prototype\]\]。如果中途改变了 prototype，则此后新增的对象的原型对象也会随之改变，而之前的则不会改变。

#### 3、原型链的推广

在 JS 中，除了字符串、布尔值等原始值外，大部分符合数据结构都是对象。为了防止混淆，我们先把函数、对象、数组分别规定为 **函数对象（可执行对象）、普通对象、数组对象**。

先以对象为例。为什么新对象的原型对象，不是构造函数这一函数对象（语义上的“上级对象”），而是构造函数下属的一个 prototype 对象呢？

我们知道，多个普通对象所共有的原型函数，应当掌握这些对象所共同需要的一些属性和方法，层次是在这些对象内的。如果这些对象的原型对象被直接指定为其 “上级对象”，上级对象（构造函数）作为一个构造新对象的函数，其属性和方法和其创建的对象可能完全不同，因此把新对象的共有属性指定到它上面是不合适的，可能产生混乱和冲突。因此，我们在上级对象中专门约定一个 prototype 属性，用于存放其子函数的原型对象，它和子函数的属性是同一个层次的。

再来理解对象的原型链：

```
student => Student.prototype => Object.prototype => null
```

Student\.prototype 是普通对象，而普通对象语义上从属于 Object 类，因此其原型对象是 Object 从属的 Object\.prototype。

然后是函数对象和数组对象的推广：

```
array1 => Array.prototype => Object.prototype => null
function1 => Function.prototype => Object.prototype => null
```

数组、函数，分别是 Array 类和 Function 类对象，因此其原型对象挂在 Array 和 Function 下。

构造函数也可以推广到数组和函数方面。例如，我们可以认为普通对象、数组、函数是 Object、Array 和 Function 函数创建的（但实际上只是语义等价，并不是真的调用了它们）。

总之，原型链可以这样理解：对象的原型对象存储在其构造函数上。array1 的构造函数是 Array，Array\.prototype 的构造函数是 Object，而 Object\.prototype 没有构造函数，因此为 null。

## 三、JS 中的方法

我们现在已经学习了 **原型链 **这种重要的 JS 机制。在 JS 中，对象具有很重要的地位，函数、对象、数组等都属于 JS 对象，因此都具有原型链等作用机制。我们之前学习过的许多函数方法，都是基于原型链和对象方法机制来实现的，现在我们基于新知识再复习一次。

我们先列出两种常见的 JS 方法，再对它们进行归类。

```
// 第一种
Object.keys(obj);
// 第二种
numbers.map(item => item * 2);

```

### （一）原型方法

原型方法是定义在原型上的方法。当调用原型方法时，JS 会先检查对象自身有无相关同名方法，然后再顺着原型链找到原型方法，并且调用。

例如：

```
const numbers=[1];                                                            // 定义数组对象
const student = {};           // 定义普通对象
const test = function () { console.log(this) };                               // 定义函数对象

numbers.map(item => item * 2);
student.toString();
test.call(student);
```

它们分别调用的是以下三种原型的方法：

```js
Array.prototype
Object.prototype
Function.prototype
```

调用时，这些方法本身并不属于调用对象（如 number，student，test）的一部分，因而 JS 顺着原型链找到了它们的原型，并且进行了调用。这就是 **原型方法**。

### （二）静态方法

原型方法是定义在原型对象上的，而静态方法是直接定义在 **构造函数 **上的，它本身是构造函数的一个属性（方法），而不是构造函数的构造产物的方法。

Object\.keys\(\) 等就是常见的静态方法。例如：

```
const a = Object.keys(student);
const b = Object.values(student);
const c = Object.entries(student);
```

它们都是构造函数 Object 的方法，而**不是 Object\.prototype 的方法**，也不是构造函数的产物对象的方法。因此，不能使用下面的方法调用：

```
student.keys();
student.values();
student.entries();
```

因为 student 并不具备这些方法，同时顺着原型链找不到 Object\.prototype\.keys\(\) ······。

复习一下：Object\.keys\(\)、values\(\)、entries\(\) 并不遍历原型链，只遍历 “传入对象**自身**的可枚举字符串键”。

静态方法不一定只能由构造函数创建实例。它的关键是**方法属于类或函数自身**，而不是属于**实例**。例如 Object\.keys\(\) 就是一个静态方法。

### （三）对象自身方法

这个我们已经见过很多了，就是定义对象时定义给对象的方法，例如：

```
const student = {
  greet: function () {
    console.log('Hello!');
  }
};
student.greet();
```

这里的 student\.greet\(\) 即为对象自身方法。

### （四）方法的延申调用

原型方法不一定非要通过原型链调用。例如，下面是一种原型调用：

```
numbers.map(item => item * 2);
```

但它同样可以通过下面的方法调用：

```
Array.prototype.map.call(
    numbers,
    item => item * 2
);
```

因为 map 本身是一个函数。通过原型方法（属于**对象方法**）调用时，this 默认指定了 numbers；但也可以直接把原型函数写明，再使用 Function 的原型函数 call\(\) 指定 this。

## 四、复习（实例分析）

```
const A = function () {};
const B = function () {};
const oldInstance = new A();
A.prototype = B.prototype;
const newInstance = new A();

console.log({
  oldInstanceOfA:oldInstance instanceof A,
  newInstanceOfA:newInstance instanceof A,
  oldConstructorIsA:oldInstance.constructor == A,
  newConstructorIsB:newInstance.constructor == B
});
```

结果是：

```
{
  "oldInstanceOfA":false,
  "newInstanceOfA":true,
  "oldConstructorIsA":true,
  "newConstructorIsB":true
}
```

这里先从 prototype 角度出发，区分旧A、新A（=B）。

oldInstance 具有旧A prototype，故 oldInstance 的原型不再是新A，而 newInstance 是新 A；oldInstance 的 constructor 是旧A，指向构造函数A，而 newInstance 的 constructor 是新A来的，而新A=新B，故指向构造函数 B。