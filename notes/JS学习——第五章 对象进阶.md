# JS学习——第五章 对象进阶

## 一、复习——对象也是一种值

我们已经知道，对象是一个具有独立身份的值，多个变量可以关联到同一个对象。例如：

```
const a = {
    name: "Alice",
    age: 20
};
const b = a;
b.name = 'Steve';
console.log(a === b); // true
```

b = a 并没有创建一个新的对象。它做的是：读取变量 a 中的值，将这个值赋给变量 b。因为**这个值代表一个对象**，**所以 a 和 b 最终关联到同一个对象**，而不是两个对象。

还有一个要注意的细节，在 JS 中，定义对象时，属性是以**逗号**为分隔的，最后一个属性结尾带不带逗号都可以。

## 二、对象的基础操作

### （一）读取和修改属性

#### 1、点语法

可通过 object\.key 来操作对象 object 下的 key 属性。注意点语法只支持**常值**，不支持变量。

```
const key = 'name';
console.log(a.key);             //输出的是 a.key 这个属性的内容，而不是 a.name
```

#### 2、方括号语法

方括号语法如下：

```
console.log(a[key]);            //输出的是 a.name 这个属性的内容
console.log(a["name"]);         //输出的是 a.name 这个属性的内容
```

方括号语法支持变量作为属性（直接写变量就行）。如果需要使用常值读取对象属性，则需要字符串引号。

### （二）添加属性

```
const test = {
  name: "Alice",
}
test.score = 90;
```

直接为对象中不存在的属性赋值，就会为对象增加该属性（追加到结尾）。

这里还涉及到我们之前说的 “const 并不是只能定义常量”。const 只是使 test 不能重新绑定到新的对象，但允许对 test 已经绑定的**现有对象**的属性进行更改。

### （三）删除属性

可以使用 delete 删除已有属性（delete object\.key）。例如：

```
const test = {
  name: "Alice",
  score: 90
}
delete test.score;
console.log(test);      // { name:"Alice" }
```

如果对象的一个属性不存在，则试图访问它时会返回 undefined。

## 三、对象的方法

### （一）检查对象是否具有某属性

#### 1、in 运算符

```js
"key" in object
```

例如：

```
const test = {
  name: "Alice"
}
console.log("score" in test)      // false
```

in 语法还会检查对象的原型链，之后再说。

#### 2、hasOwn\(\) 方法

基本方法如下：

```
Object.hasOwn(object,key);
```

注意这里的 Object 是专有标识符，不是待查对象的名字，和 arr\.includes\(\) 等不同。

例如：

```
const test = {
  name: "Alice"
}
console.log(Object.hasOwn(test,"score"))      // false
```

此外也可以用 hasOwnProperty\(\) 方法，这时点号前面是待查对象，例如：

```
console.log(test.hasOwnProperty("score"))      // false
```

细节：是 “score” 而不是 score，这里应当是属性名，而不是变量。

### （二）对象=\>数组 转化方法

下面所说的几个方法，可以转化对象，并且将其中的部分内容转为数组，稍后可以使用数组来处理数据。

下面的所有方法都只有一个参数 —— 需要转化的对象。下面的示例都使用此对象：

```
const student = {
    name: "Alice",
    age: 20,
    score: 95
};
```

#### 1、获取属性 —— Object\.keys\(\)

可以将对象的所有属性名收集为一个新数组。例如：

```
console.log(Object.keys(student));        // ["name","age","score"]
```

#### 2、获取属性值 —— Object\.values\(\)

将对象的所有属性的内容收集为一个新数组。例如：

```
console.log(Object.values(student));      // ["Alice",20,95]
```

#### 3、获取键值对 —— Object\.entries\(\)

将对象转化为一个新数组，其元素是二维数组（\[属性名, 属性值\]）。例如：

```
console.log(Object.entries(student));
```

结果如下：

```
[
  ["name","Alice"],
  ["age",20],
  ["score",95]
]
```

注意：此种方法仍然是 “浅转化”，如果某对象的一个属性内容仍然是一个对象，则不会把这个对象也转为数组。

### （三）遍历对象

数组可以使用 for of 语法来遍历，而对象可以使用 for in 语法遍历，操作方法类似。

```
const student = {
    name: "Alice",
    age: 20,
    score: 95
};
for (const key in student) console.log(student[key]);
```

要注意，for in 语法赋给变量的是对象的**属性名**。

## 四、对象的解构

本节的示例均使用如下对象：

```
const student = {
    name: "Alice",
    age: 20,
    score: 95
};
```

对象的解构涉及到对象内容的拷贝，因此仍然要注意浅拷贝问题。因为已经强调了很多次，我们这里就不再多提了。

### （一）解构对象的基本方法

如果想要从对象中取出几个值赋给变量，传统方法是这样的：

```
const name = student.name;
const age = student.age;
const score = student.score;
```

JS 提供了一种快速方法，即解构对象，允许我们快速、批量将对象中的属性内容赋值给变量。语法如下：

```
const { name, age, score } = student;
```

这样会创建 3 个变量 name、age、score，分别对应 student 的三个属性的内容。

注意：默认使用**变量名**来检索对象中的属性。如果变量名对应的属性不存在，则返回 undefined。例如：

```
const { name, score, age, grade } = student;
console.log(grade);        // undefined
console.log(score);        // 95
```

### （二）设置变量名、默认值

如果不想要使变量名 = 属性名，则可以使用 属性名:变量名 的写法（即“将属性A赋给变量M”）。下面是一个例子。

```
const { name:a, score:b, age:c } = student;
console.log(b);            // 95
```

这种写法是很常见的，因为很多对象可能都有相同的属性名，同时按变量名 = 属性名的方法解构可能会发生冲突。

如果要对多个对象使用相同方法解构，则可能出现某个对象没有某个属性的情况。这时，可以给该属性对应的变量取一个默认值。写法如下：

```
console.log(student.grade);    // undefined
const { name:a, grade:b=0 } = student;
console.log(b);                // 0
```

当该属性返回 undefined（不是null，也不是NaN）时，JS 会将默认值赋给对应变量。

### （三）嵌套解构

如果对象的内容仍然具有对象，则可以嵌套解构，将子对象也解构出来。例如：

```
const student = {
  name:"Alice",
  address:
  {
    city:"Beijing",
    street:"Road 1"
  }
}
```

如果要获得 name、street（分别赋给 nameCopy、streetCopy），可以这样写：

```
const {
  name:nameCopy,
  address: { street:streetCopy }
} = student;
```

注意：这样得不到 address。还有要注意的是，这样相当于是把属性名从 address: 变成了 address: \{ street \}，因此如果变量想用别名，则应当加在子对象的 street 上。

### （四）剩余属性

JS 的对象解构中，允许使用 “剩余属性” 方法，将剩下的属性都收集到一个新对象中，这有些类似于函数的 “剩余参数”。例如：

```
const { name, ...otherInfo } = student;
console.log(otherInfo);
```

返回的内容是：

```
{
  age:20,
  score:95
}
```

## 五、对象的进阶表示

### （一）用变量表示属性名和属性内容

我们已经知道，对象的属性内容可以是变量，只要把变量名写到属性内容的位置即可：

```
const name = "Alice";
const age = 20;
const student = {
    name: name,
    age: age
};
```

JS 的对象还支持使用变量名作为属性内容，方法就是使用**方括号语法**。根据字面量创建对象时，会读取变量的内容，然后将其作为属性名。

例如：

```
let p1 = "name";
let p2 = "student";
const student = {
  [p1]:"Alice",
  [p2]:20
};
console.log(student.name);    // Alice
p1 = "score";
console.log(student.name);    // Alice
```

实际上方括号语法内是支持表达式运算的。例如，下面的写法是合法的：

```
const p1 = "name";
const student = {
  [p1 + "2"]:"Alice"
}
console.log(student);          // { "name2":"Alice" }
```

实际上普通的方括号调用也支持这样的写法，例如 student\[p1 \+ "2"\]。

### （二）对象的简写

如果我们想把几个变量放入一个对象，普通方法是这样的：

```
const name = "Alice";
const age = 20;
const student = {
    name: name,
    age: age,
    grade: 10
};
```

很多情况下，变量名就是对变量内容的描述，例如 name = "Alice"，等等。使用普通方法，我们需要手动定义一个属性名，再引用变量作为属性的内容；如果我们想直接用变量名作为属性名，可以使用简化语法，直接将属性名及冒号省去不写，JS 会将变量名作为属性名使用。例如：

```
const student = {
    name,
    age,
    grade: 10
};
```

要注意的是，只有变量名/内容 = 属性名/内容的情况才能简写，其他情况仍按正常方法书写。

## 六、对象中的 this 是什么？

this 是函数的一个基本变量，字面意义上是指向 “自己”。然而 “自己” 指的是什么，不同情况下会有很大的出入。

### （一）引入：两种调用下的 this

JS 中有两种调用函数的方法，分别是 “普通函数调用” 和 “对象方法调用”。

#### 1、普通函数调用

```
function greet() {
    console.log(this);
}
greet();
```

这种情况下，函数就是函数，它是单独存在的。在 JS 的严格模式下，函数的 this 是 undefined。

#### 2、对象方法调用

```
const person = {
    name: "Alice",
    greet: function() {
        console.log(this);
    }
};
person.greet();
```

这种情况下，函数是对象的**内容**、函数作为对象的一个**方法**而存在，因此 this 指向的是**这个对象本身**（person）。

this 指向的是调用函数的那个“调用者”。普通函数的调用就是直接调用的，因此没有这个概念；而当函数作为对象的方法存在时，我们是通过对象来调用函数的，因此“调用者”是对象，this 指向对象。

### （二）this 指向调用它的对象

#### 1、调用对象改变，this 也会改变

我们已经提到，this 指向的是**调用它的对象**。非常重要的一点是，this 的意义并**不是由它的位置**，而是**由它所处函数的被调用方式**决定的。this 并不是定义函数时就确定的一个量，调用方式不同，this 的含义就会改变。例如：

```
const person1 = {
    name: "Alice",
    greet: function() {
        console.log(this.name);
    }
};
const person2 = {
    name: "Bob",
    greet: person1.greet
};
person1.greet(); // Alice
person2.greet(); // Bob
```

person1\.greet\(\) 调用的是 person1 的 greet\(\) 函数方法，因此 this 指向 person1，这是显然的。关键在 person2：虽然该函数是在 person1 中定义的，但改为 person2 调用后，this 就变成 person2 了。

注意：这里并不是 person2 通过 person1 调用了函数，而是 person2 直接调用了函数，因此调用该函数的对象就是 person2。这里还是要按 “引用” 的想法来思考：该函数并不是 person1 独有的，而是由 person2、person1 共同**引用**的，它同时是 person2、person1 的方法。

还可以得到一个引申结论：普通函数作为对象方法调用时，this 通常指向点号左边的对象。（说“普通函数”，是因为箭头函数不是这样的）

#### 2、对象方法提取为普通函数后，this 也会改变

这是另外一个例子：

```
const person = {
    name: "Alice",
    greet: function() {
        console.log(this.name);
    }
};
const fun = person.greet;
fun();         // undefined (严格模式)
```

这个例子中，我们将 person 对象的 greet\(\) 函数方法提取了出来，并且赋给了 fun。我们发现，调用 person\.greet\(\) 和调用 fun\(\) 的 this 不同。

这仍然需要通过 “引用” 来解释。上面的行为实际上是把 person 对 greet\(\) 的**引用**复制给了 fun，fun 独立持有了 greet\(\) 函数的引用，因此 fun\(\) 直接调用了 greet\(\) 函数，不再需要经过 person 对象，this 自然就变成了 undefined（调用变成了普通函数调用）。

#### 3、嵌套对象，this 指向最近的一层对象

看看下面的情况：

```
const company = {
    name: "OpenAI",
    department: {
        name: "Research",
        showName: function() {
            console.log(this.name);
        }
    }
};
company.department.showName(); // Research
```

company 对象中嵌套了 department 对象。这时调用 showName\(\) 方法，this 不是最顶层的 company 对象，而是最近的 company\.department 对象。

事实上，this 指向的是直接调用它的那个对象。这里是通过 company 中的 department 对象调用 showName\(\)，因此直接调用对象是 department。

### （三）箭头函数的特殊 this 行为

与普通函数不同，箭头函数很特殊，它**没有自己的 this**。在箭头函数中使用 this 时，它会尝试从**定义箭头函数的外层作用域**中取得 this。例如：

```
const person = {
    name: "Alice",
    greet: function() {
        const say = () => {
            console.log(this.name);
        };
        say();
    }
};
person.greet(); // Alice
```

这里箭头函数没有自己的 this，因此它使用它的外层作用域（由 greet\(\) 函数创造）中的 this（这个 this 是函数 greet\(\) 提供的，指向person）。所以箭头函数并不是普通函数的简单简写，其行为和普通函数有重大差异。注意：**对象的花括号不会创建作用域**，这里箭头函数找的是外层的函数作用域。

下面的代码也得不到a，原因是一样的。箭头函数会试图在自己以外的作用域寻找 this，但对象字面量不会创建指向自己的 this，因此箭头函数得不到 a。

```
const a = {
    greet: () => console.log(this)
};
a.greet();
```

拓展：如果把箭头函数改为普通函数，例如：

```
const person = {
    name: "Alice",
    greet: function() {
        const say = function () {
            console.log(this.name);
        };
        say();
    }
};
person.greet();
```

JS 会返回 TypeError，不会有正常输出。因为这里的 say\(\) 函数是普通函数调用，虽然它有了 this，但它的 this 是 undefined，访问 undefined\.name 会得到 TypeError。

再三强调：决定 this 的并不是 this 的位置（如函数嵌套关系等），或者说，this 是 “这个调用者” 而不是 “这个定义者”。从之前的例子很容易想到 this 指向的是它外面的那个对象，因而这里可能错误地认为子函数的 this 指向父函数。事实上，this 和函数的嵌套结构并没有关系！

## 七、函数的 this 的重新指定

```
function introduce() {
    console.log(`我是 ${this.name}`);
}
const person1 = { name: "Alice" };
const person2 = { name: "Bob" };
```

如果我们直接使用 introduce\(\)，则严格模式下 this 会得到 undefined，introduce 函数并不能发挥作用。

如果我们想要使 introduce 函数在普通调用方式下，this 也能起到作用（例如让 this 指定为 person1），要怎么办？答案就是使用 call\(\)、apply\(\) 和 bind\(\) 三个函数。

### （一）call\(\) 和 apply\(\) 函数：调用时指定 this

call函数可以立即调用某个函数，并且指定被调函数的 this 的指向。使用方法是：

```
function.call(thisArg, 参数1, 参数2, ...);
```

例如：

```
introduce.call(person1);      //我是 Alice
```

call\(\) 的第一个参数是 this 的指向。如果被调函数有其他形式参数，则其他形参依次跟在 this 参数的后面。例如：

```
function introduce(age, city) {
    console.log(`${this.name}，${age}岁，来自${city}`);
}
const person = { name: "Alice" };
introduce.call(person, 20, "北京");
```

apply 函数的作用和 call 一致，但 apply 传入被调函数的形参时采用的是数组方法。例如：

```
introduce.call(person, 20, "北京");
introduce.apply(person, [20, "北京"]);
```

或者说 apply\(\) 函数只有两个形参，第一个是 this 的指向，第二个是被调函数的所需参数构成的一个数组。

### （二）bind\(\) 函数：创建新的函数

bind 函数并不会立即调用某个函数，而是返回一个绑定了指定 this 的新函数。例如：

```
function introduce() {
    console.log(`我是 ${this.name}`);
}
const person = { name: "Alice" };
const newIntroduce = introduce.bind(person);
newIntroduce();          // 我是 Alice
```

这相当于是复制了一个 introduce 函数（**不是引用**），然后将这个新函数的 this 绑定为 person。

甚至可以这样：

```
const person1 = { name: "Alice" };
const person2 = { name: "Bob" };
const newIntroduce = introduce.bind(person1);
newIntroduce.call(person2); // 仍然是 Alice
```

这是因为 bind 绑定的 this 会固定在新函数中，不会被后续操作改写。即使显示声明 call\(person2\)，新函数的 this 仍然会指向bind的 person1。

bind 函数也可以传入被调函数的形参，具体形式和 call 一致，都是追加在后面。但需要注意的是，bind 加入的形参和 this 一样，也会固定在新函数中，不会被后续操作改写。

### （三）重新指定 this 和形参有什么区别？

使用 call\(\)、apply\(\)、bind\(\) 函数定义函数的 this，具体效果和直接使用形参指定函数的操作对象是一致的。那为什么还要有 this 以及 call、apply、bind 呢？

这主要是设计哲学方面的考虑。确实可以直接用形参来代替这方面的 this 功能，但这并不一定是好用的。

JS 提供给了我们实现同一目的的多种工具（例如数组遍历的 forEach 和 for of），使我们可以根据实际情况灵活选择最适合的方法。this \+ call 等方法和直接指定函数的形参，确实都能实现相同的效果，但它们各有各的 “最切合的使用方式”。例如，this 是一个独立于函数形参的变量，需要使用 call\(\) 单独指定，因而语义上它的重要性被加强了，这样可以更直观地体现出变量间的主次关系，等等。