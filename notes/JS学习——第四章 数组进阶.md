# JS学习——第四章 数组进阶

## 一、查询——find()函数

find函数用于查找数组中符合条件的元素，它会依次对各个元素执行回调函数，若回调函数返回 truthy，则将元素返回，同时结束find语句的执行。

find函数的基础使用方法和filter类似，但还是有一些区别：

- find返回的是元素，filter返回的是数组。
- 找不到时，find返回undefined，而filter返回 []（空数组）。
- find找到第一个符合条件的元素后就会停止执行。

```
const products = [
  { name: "键盘", price: 120 },
  { name: "鼠标", price: 60 },
  { name: "显示器", price: 900 }
];
const result = products.find(product => product.price > 100);
console.log(result);          //{ name: "键盘", price: 120 }
```

和filter、map、forEach一样，find函数也有item、index、array三个提供给回调函数的参数，分别是当前元素、索引（下标）和原数组。

## 二、检查——some()和every()函数

这两个函数的作用是判断数组中有无符合条件的元素。使用方法和find()函数类似，都利用了回调函数。

some与every函数和find函数一样，也有item、index、array三个提供给回调函数的参数，这里只用第一个。

### （一）some()函数

some函数判断数组中是否至少有一个符合条件的元素，返回值是布尔值（false/true）。

```
const scores = [45, 52, 88, 56];
const result = scores.some(score => score >= 60);
console.log(result); // true
```

如果任意一个元素执行回调函数后返回true，则some()函数立即返回true，并且停止继续检查；反之返回false。

### （二）every()函数

every函数判断数组中是否全部元素都符合某个条件，其他和some函数类似。

任意一个元素的回调函数返回falsy，则every函数立即返回false，并且停止继续检查；否则返回true。

### （三）特殊情况

```
[].some(n => n > 0);  // false
[].every(n => n > 0); // true
```

some函数只检查“符合条件”的部分，如果没有，则false；而every函数只检查“不符合条件”的部分，如果没有，则true。因此，空数组的some结果是false，而every结果是true——因为没有元素能不符合条件（当然也没有元素能符合条件），这有些反直觉。

## 三、汇总——reduce()函数

reduce函数的核心作用，是将数组中的多个元素逐步汇总，最终得到一个结果值。

### （一）基本语法

```
array.reduce(回调函数,汇总初始值)
array.reduce(fun(sum,item,index,array), initial);        //回调函数的返回值会作为新的汇总值
```

reduce函数执行的基本流程是：

- 先将sum的值取为initial；
- 开始对array的每个元素执行回调函数fun，传入sum和剩下的三个值（这三个值和find等是一样的）；
- 回调函数执行完成后，其返回值作为sum的新值；
- 继续对下一个元素执行回调函数，重复上面两步，直到结束。
- 结束时，reduce()函数返回sum的最终值。

所以reduce函数引入了sum这个汇总值（并且将initial作为它的初始值），然后由回调函数决定sum如何累加，回调函数的返回值作为新的sum值。

如果 initial 形参缺省，则JS会采用数组的第一个元素作为sum的初始值，然后从第二个元素开始执行reduce（因此回调函数会被少执行一次）。不过不建议这样做，因为当数组是空数组时，这样会导致报错（而不是输出0），因为第一个元素也不存在。

### （二）实际使用

```
const numbers = [10, 20, 30];
const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);
```

在这里，reduce函数实现了累加numbers数组中的全部数字。

```
const passedCount = scores.reduce((count, score) => {
  if (score >= 60) {
    return count + 1;
  }
  return count;
}, 0);
console.log(passedCount); // 3
```

注意：reduce不一定只能用来累加。回调函数可以通过条件判断，确定什么情况下才对sum执行累加。例如，上面的代码只会对及格学生执行加法，返回的结果是学生的及格人数。

### （三）典型错误：漏掉return

```
const countPassed = scores => scores.reduce((count,score)=>{
  if(score >= 60) return count + 1;
},0);
```

上面的代码是错误的，执行到最后得不到正确结果。原因是只有score >= 60时才会return count + 1，若score < 60，则JS函数找不到 return，默认返回 undefined，同时 undefined 又被作为回调函数的返回值赋给了 count，导致 count 原有的数字被破坏，得不到结果。因此，正确的代码是 score < 60 时返回 count 本身。

正确的代码是：

```
const countPassed = scores => scores.reduce((count,score)=>{
  if(score >= 60) {
    return count + 1;
  } else {
    return count;
  }
},0);
```

或者使用简短的三元运算符：

```
const countPassed = scores => scores.reduce((count,score)=>{
  return score >= 60 ? count + 1 : count ;
},0);
```

### （四）进阶用法——构建对象

reduce函数中的sum不一定一定要是数字，也可以是数组、对象，从而实现更多功能。reduce函数本质上是从一个 “初始汇总” 出发，在数组循环过程中对每一个元素执行回调函数，再将执行结果返还给 “汇总内容”，全部执行完后给出 “最终汇总内容”。（最初内容 ==> 循环【汇总内容 ==回调函数==> 新的汇总内容】==> 最终汇总内容）

下面的函数实现了统计数组中各个数字出现了多少次的功能，结果以对象呈现。“初始汇总”是 {}（一个空对象）。

```
function test(numbers) {
  return numbers.reduce((newobj,item)=>{
    if(newobj[item] == undefined) newobj[item] = 0;
    newobj[item]++;
    return newobj;
  },{});
}
```

因此，reduce可以将一组数据处理为另外一组数据。

## 四、排序 —— sort() 函数

排序数组有很多种算法，如冒泡排序、快速排序等。JavaScript 可采用 sort() 函数对数组中的元素进行排序。

### （一）基本方法

sort() 可以接受一个比较函数，它会向被调函数传入a、b两个元素，然后根据回调函数的返回值决定两个元素的排序：

- 若 <0，则a排在b前面；
- 若 =0，则a、b顺序视为相等，保持原有相对位置不变；
- 若 >0，则b排在a前面。
- 记忆方法：a - b 是升序。

例如：

```
arr.sort((a,b)=> a-b);
```

若a>b，则a-b>0，则b在a前面，因此这样可以使数组元素从小到大排列。

注意：不能直接使用 sort() 函数（不写回调内容），因为 sort() 函数默认会将内容转化为字符串，再按 UTF-16 码元顺序比较，而不是按数值大小比较。

### （二）如果想要新数组？

与 map、filter、reduce 等函数不同，sort 函数返回的不是新数组，它默认会**直接修改原数组**，并且返回原数组本身。因此，如果想要新数组，需要先显式声明一个新的、从原数组浅拷贝过来的数组，再对其执行 sort()。

```
const numbers = [3, 1, 2];
const result = [...numbers].sort((a, b) => a - b);
console.log(numbers); // [3, 1, 2]
console.log(result);  // [1, 2, 3]
```

这里的 ... 是之前学习数组基础时学过的 **展开语法**（浅拷贝）。之前曾经用 { ...obj } 来浅拷贝对象，同样可以用 [...arr] 来浅拷贝数组。例如，下面复制了一个新的数组：

```
const newarr = [...arr];
```

## 五、去重 —— includes 与 Set 集合

### （一）includes() 函数

includes 函数可以判定数组中是否存在某元素。如果存在，则返回 true；反之则返回false。下面是一个例子：

```
const arr=[1,2,3,4];
console.log(arr.includes(1));           //true
console.log(arr.includes(0));           //false
```

借用 includes 函数，可以通过传统方法给数组去重。例如，下面实现了一个数组去重函数。

```
function test(arr)
{
  const newarr=[];
  arr.forEach(item=>{
    if(!newarr.includes(item)) newarr.push(item);
  });
  return newarr;
}
```

注意：“是否相同”仍然和引用有关。例如：

```
const newarr=[ { name:"Alice" } ];
console.log(newarr.includes({ name:"Alice" }));      //false
```

上面的例子中，两处 { name:"Alice" } 只是字面量相同，但实际上代表两个不同的对象，因此并不相等。而下面的写法则是相等的：

```
const a={ name:"Alice" };
const newarr=[a];
console.log(newarr.includes(a));      //true
```

### （二）一种新的数据结构 —— 集合

数组（Array）允许保存多个相同的元素。除了数组外，JS还有另外一种数据结构——**集合**（Set）。集合只允许保存不同元素，如元素相同，则自动去重。

#### 1、基础知识

定义集合的方法是 const setName = new Set(可迭代对象，如对象、数组等)。**注意 Set 首字母必须大写**。例如：

```
const mySet = new Set([1,2,3,3,4]);             //set=[1,2,3,4]
```

利用 Set 和展开语法，可以实现数组去重（数组转为集合，集合再转回数组）。

```
let numbers = [1, 2, 2, 3, 3, 4];
const mySet = new Set(numbers);      //数组转为集合
numbers = [...mySet];                //集合转为数组
numbers = [...new Set(numbers)];     //这样直接写也可以
```

这里再对展开语法做一些补充：展开语法并不仅限于数组等，而是对于**一切可迭代对象**都有效。数组、集合等都属于可迭代对象，具有层级数据结构。利用展开语法，一些情况下可以很方便地在对象、数组、集合等可展开对象之间转换。

注意：对象本身不属于可迭代对象，但可以使用对象展开语法 { ...obj } 复制其自身的可枚举属性。

### 2、基础方法

集合也有自己的一套操作元素的方法，如下所示。

- add(value)	添加元素
- has(value)	判断是否包含元素（类似数组的 includes）
- delete(value)	删除指定元素
- clear()	清空集合
- size	获取元素数量（类似数组的 length）

Set 也可以用 for...of 遍历，但没有 filter、map 等数组功能。

## 六、组合与复制 —— concat() 与 slice() 函数

使用 concat() 和 slice() 函数，可以很方便地拆分和合并多个数组。

### （一）concat() 函数

#### 1、基础用法

concat() 函数可以合并一个或多个数组，并且返回一个新数组（不修改原数组）。其基本语法如下：

```
const newarr = arr1.concat(arr2);
```

例如：

```
const arr1=[1,2,3];
const arr2=[4,5,6];
console.log(arr1.concat(arr2));         //[1,2,3,4,5,6]
console.log(arr2.concat(arr1));         //[4,5,6,1,2,3]
```

arr1和arr2的位置可以交换，但会影响元素的出现顺序。

如果不用 concat() 函数，可以使用普通的浅拷贝方法，例如：

```
const newarr = [...arr1,...arr2];
```

#### 2、扩展用法

concat() 函数不仅可以接受数组，也可以接受基础值。例如：

```
const arr1=[1,2,3];
console.log(arr1.concat(4,5));      //[1,2,3,4,5]
```

事实上 concat 会把传入的数组展开一层，例如 concat([1,2,3]) 实际上就等于 concat(1,2,3)。如果传入数组的元素还是数组，concat() 不会将其展开，而是将其直接当作一个元素合并进来，保留其原有结构。例如：

```
const arr1=[1,2,3];
const arr2=[4,5,[6,7]];
console.log(arr1.concat(arr2));        //[1,2,3,4,5,[6,7]]
```

concat() 函数还可以同时接受多个数组：

```
const newarr = arr1.concat(arr2,arr3,arr4);
```

合并后元素的顺序取决于 concat() 函数中数组的出现顺序。例如，上面的示例中，newarr 中会依次出现 arr1、arr2、arr3、arr4 的所有元素。

### **（二）slice() 函数**

#### 1、截取数组

slice() 函数可以截取一个数组的特定部分，返回一个新的数组。其基本语法为：

```
const newarr = arr1.slice(start, end);
```

注意：start 是起始元素的索引（从0开始），end 是结束元素的索引。截取出来的数组是 **左闭右开**，newarr 包含 arr1[start] 但**不包含 arr1[end]**。下面是一个示例：

```
const numbers = [10,20,30,40,50];
const result = numbers.slice(1, 4);
console.log(result); // [20, 30, 40]
```

start、end 可以使用负数，负数意味着从数组末尾倒数。注意倒数第一个元素的索引是 -1 而不是 0（如果要取最后一位元素，则 end 不写），截取结果仍然按原数组顺序（从左到右）排列。例如：

```
const numbers = [10,20,30,40,50];
const result = numbers.slice(-3, -1);
console.log(result); // [30, 40]
```

如果参数缺省，会出现如下情况：

- 若 end 参数缺省，则默认截取到数组的末尾（包含最后一位）；
- start 参数不可缺省，因为第一位参数只能是 start；
- end、start 参数均缺省，则按照下面说的行为复制数组。

#### 2、复制数组

slice() 函数在不传入任何参数时，会完整复制整个旧数组（但仍然是浅拷贝），形成一个新数组。因此，下面的方法都可以复制一个新数组：

```
const a = [...numbers];
const b = numbers.slice();
const c = numbers.concat();
```

——