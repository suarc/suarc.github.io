# JS学习——第七章 面向对象编程进阶

## 一、对象的属性描述

### （一）属性描述

除了属性名、属性内容外，JS 对象还具有 **属性描述**，规定了属性是否可被修改、可被枚举、可被删除或重新配置。

属性描述的获取方法是 Object\.getOwnPropertyDescriptor\(对象,属性名\)。例如：

```
Object.getOwnPropertyDescriptor(a,"name");
```

例如：

```
const a = {
  name:"Alice"
};
console.log(
    Object.getOwnPropertyDescriptor(a,"name")
);
```

得到的结果是这样的：

```
{
  "value":"Alice",
  "writable":true,
  "enumerable":true,
  "configurable":true
}
```

这里有四个属性：value、writable、enumerable、configurable。value 不用再说了，关键是剩下的三个：

#### 1、writable 可写属性

此选项规定此属性的内容是否可被更改。

#### 2、enumerable 可被枚举

此选项规定此属性能否被枚举。

我们之前曾提到过，可以用 for in、提取对象为数组的枚举方法（Object\.keys\(\)等）、展开运算符（\.\.\.）等方法来枚举对象的内容。enumerable 为 false 的属性不会出现在这些普通枚举方法的结果中。

已知 Object\.prototype 的内置属性都是不可被枚举的。下面就是一个例子：

```
console.log(Object.prototype.constructor);            // Object
const newarr = Object.entries(Object.prototype);
console.log(newarr);                                  // []
```

#### 3、configurable 可被配置

此选项规定了属性能否被删除、其描述能否被更改。如果 configurable 为 false，则 enumerable 将不能再更改，writable 只能从 true 单向改为 false，且无法删除属性。value 仍然由 writable 管理，writable 为 true 时仍然可以改 value。

注意：此属性的修改是**无法复原**的，因为 configurable: false 同样会阻止 JS 修改 configurable 属性，导致它不能被改回 true。

### （二）设置属性描述

#### 1、对象字面量创建的属性描述

通过对象字面量创建的对象默认是三个属性全部 true 的。例如：

```
Student.prototype = {
    constructor: Student,
    age: 20
};
console.log(Object.keys(Student.prototype));
Object.getOwnPropertyDescriptor(Student.prototype,"age");
```

输出结果分别是：

```js
["constructor", "age"]
{
  "value":20,
  "writable":true,
  "enumerable":true,
  "configurable":true
}
```

#### 2、手动设置属性描述

如果我们想设置属性描述，可以使用 Object\.defineProperty\(对象，属性，属性描述\) 的方法。例如：

```
Object.defineProperty(Student.prototype, "constructor", {
    value: Student,
    writable: true,
    configurable: true
});
```

没有写到的部分则采用现有值。如果用此方法创建新属性（不是修改现有属性），则没写到的部分通常默认为 false。

## 二、原型对象的 constructor 属性

### （一）constructor 属性

当普通函数作为构造函数时，其一般会获得 prototype 这一原型属性。prototype 本身是一个原型对象，它一般有一个 constructor 属性，默认指向**这个构造函数**。例如：

```
function Teacher(name) {
  this.name = name;
}
const teacher1 = new Teacher("Alice");
console.log(teacher1.constructor);        // Teacher
```

teacher1 对象不具有 constructor 属性，因此到 Teacher\.prototype 中寻找，然后从 Teacher\.prototype\.constructor 得到了 Teacher 函数。

例如：

```
function Student(name) {
    this.name = name;
}
const student = new Student("Alice");
// 通过 student.constructor 找到 Student
const student2 = new student.constructor("Bob");
console.log(student2.name); // Bob
```

注意：constructor 并不是 JavaScript 专门为构造函数设计的特殊语法，也不是一种内部机制，而只是一个默认存在的普通属性。它是**可以被任意更改**的，只是**默认指向它的构造函数**。（如果 constructor 不存在，会在原型链上继续寻找 constructor，并且往往得到 Object\.prototype\.constructor，值是 Object。）

constructor 的存在为原型对象提供了一个 “构造它的构造函数” 的语义属性，可以用它为新对象分类（如 Student，Teacher 等），但由于它可被修改，因此不能绝对地将它用于判断对象的真实类型或创建来源。

### （二）constructor 的属性描述

使用 Object\.getOwnPropertyDescriptor\(Object\.prototype,"constructor"\) 可得到如下内容：

```
{
    value: Object,
    writable: true,
    enumerable: false,
    configurable: true
}
```

这说明 constructor 是一个可写、不可被枚举、可被配置的属性。

## 三、原型继承机制

### （一）原型链的更改

先看下面的代码：

```
function Animal(name)      // 动物构造函数
{
  this.name = name;
}
Animal.prototype.eat = function () { console.log(`${this.name} 正在吃东西`); };

function Dog(name)          // 狗的构造函数
{
  this.name = name;
}
Dog.prototype.bark = function () { console.log(`${this.name} 正在汪汪叫`); };

const a = new Dog('Bob');
```

我们这里新建了 Animal、Dog 这两个原型函数。显然狗属于动物，因此我们自然地想到 Dog 可以继承 Animal 的方法，从而使对象 a 同时具有 Dog 的自身方法 bark\(\) 和 Animal 的公共方法 eat\(\)。但是，这里是行不通的，因为 a 的原型链是这样的：

```
a => Dog.prototype => Object.prototype => null
```

这里的原型链是默认的。如果我们想要实现上述功能，就需要在 Dog\.prototype 后面加上 Animal\.prototype，使原型链变成这样：

```
a => Dog.prototype => Animal.prototype => Object.prototype => null
```

这就涉及到了原型链的更改。

### （二）实现原型继承

如何更改原型链？或者说，应当如何指定某个对象的原型对象？答案是使用 Object\.create\(\) 方法。

Object\.create\(\) 方法会创建一个新对象，并且将其原型指向一个现有对象。例如：

```
const obj1 = Object.create(obj2);             //  创建了对象 a，其内容是 {}，并且其 [[prototype]] 指向对象 b
```

这就是 **原型继承**。

回到我们上面的示例，我们再加一行：

```
Dog.prototype = Object.create(Animal.prototype);      // 新建一个 [[prototype]] => Animal.prototype 的空对象，并且将其赋给 Dog.prototype
```

这样，就使 Dog\.prototype 的原型对象指向了 Animal\.prototype。不过要注意的是，由于 Object\.create\(\) 是新建没有自身属性的新对象，因此 Dog\.prototype 的原有内容（如 constructor）会被清空。

完整代码如下：

```
function Animal(name) {  this.name = name;  }
function Dog(name) {  this.name = name;  }

Animal.prototype.eat = function () { console.log(`${this.name} 正在吃东西`); };
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.bark = function () { console.log(`${this.name} 正在汪汪叫`); };

const a = new Dog('Bob');
a.bark();         // 正在汪汪叫
a.eat();          // 正在吃东西
```

这里有一个细节，定义 bark 方法必须放在 Object\.create 语句的后面，否则会被新建的空对象清空。

注意：不可直接 Dog\.prototype = Animal\.prototype，否则两者会指向 “同一个对象”，使 Dog 的局部方法错误地升级为 Animal 的方法。

## 四、借用构造函数

### （一）如何借用

上面，我们通过原型链实现了对象方法的继承。然而，在多级构造结构中，除了对象方法的继承外，我们往往还需要同类属性的复用。例如：

```
function Human(name,age) {}
function Teacher(name,age,rank)
{
  this.name = name;
  this.age = age;
  this.rank = rank;
}
function Student(name,age,score)
{
  this.name = name;
  this.age = age;
  this.score = score;
}
Teacher.prototype = Object.create(Human.prototype);
Student.prototype = Object.create(Human.prototype);
Human.prototype.introduce = function () { console.log(`我是${this.name}`); };
const Alice = new Teacher("Alice",30,"primarily");
const Bob = new Student("Bob",15,"100");
```

这里实现了 Teacher、Student 两个原型对象，并且借助原型链 \+ 上级构造函数 Human，使它们具有了共同的方法 introduce\(\) 。然而我们观察到，Teacher 和 Student 作为 Human 的下级构造函数，他们都具有 name、age 等共同属性。如果我们要创建很多的下级构造函数，例如 Worker、Manager、Doctor ······ 就要把这些属性重复写很多遍，造成不必要的麻烦。

这个问题显然不能借用原型链共有属性来解决，因为原型链会使所有人共有一份相同的属性。

为了解决这个问题，我们需要采用一种设计：由上级构造函数规定一些公共属性，再使下级构造函数**复用**上级构造函数的这些公共属性、再自己额外加一些新的属性，从而组成新的对象。这种方法就是 **借用构造函数**。

下面是一个例子：

```
function Human(name,age,income)
{
  this.name = name;
  this.age = age;
  this.income = income;
}
function Teacher(name,age,income,rank)
{
  Human.call(this,name,age,income);
  this.rank = rank;
}
function Student(name,age,income,score)
{
  Human.call(this,name,age,income);
  this.score = score;
}
function Doctor(name,age,income,department)
{
  Human.call(this,name,age,income);
  this.department = department;
}
const Bob = new Student("Bob",15,"100");
const Tylor = new Teacher("Tylor",30,"primarily");
const Mac = new Doctor("Mac",40,"Internal Medicine");
```

关键在这一行：

```
Human.call(this,name,age,income);
```

这里发生了这样一件事：将当前的下级构造函数的 this（即待创建的新对象）通过 call\(\) 方法指定给上级构造函数作为上级构造函数的 this，再借用上级构造函数，为下级构造函数的 this 批量添加 name、age、income 三种属性。这就是 **借用构造函数**。

### （二）“借用构造函数” 和原型链的区别

借用构造函数，是借用上级构造函数，将上级构造函数所定义的 “公共属性” 创建给了下级构造函数，它们是独立的；而原型链是使下级构造函数没有某属性时，**沿用 **上级构造函数的 prototype** **的属性，它们是**共享**的。

或者说，上级构造函数有两种方法，可以将自己当作 “模板” 提供给下级构造函数使用：



- 提供 上级构造函数\.prototype 作为 下级构造函数\.prototype 的原型对象，使下级构造函数创建的新对象们能共享同一份方法和属性。
- 上级构造函数自己定义一些公共的构造内容（如 name、age），下级构造函数先借用上级构造函数将 “公共部分” 构造出来后，再自己在其基础上继续构造，创建各有不同的对象。



注意：借用构造函数本身不会影响原型链。

