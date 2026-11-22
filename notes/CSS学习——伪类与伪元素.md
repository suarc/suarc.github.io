# CSS学习——伪类与伪元素

## 一、介绍

伪类和伪元素是 CSS3 的重要特性之一。它允许开发者仅使用 CSS，就能根据元素的一些特定状态或属性（例如元素被鼠标点击了、元素是父容器的第一个子元素）来对元素（或者它的一部分）的样式进行修改，从而避免了使用大量 JS 代码来修改样式的麻烦操作。

#### 

- 伪类用于描述一个元素的特定状态或条件（例如 hover、focus），从而选择符合条件的元素。
- 伪元素则是用于选择或创建元素的某个特定部分（例如 first\-letter、before），从而实现一定的样式效果。

## 二、伪类

伪类使用 :（单个冒号）来表述。注意：大部分的伪类都作用于元素本身，而不是“元素的子元素”或“父元素”。

### （一）交互伪类

交互伪类描述的是元素的交互状态。

#### 1、hover、active

```css
.diva:hover {...}
.diva:active {...}
```

这两个伪类分别描述了鼠标移动到 diva 上、鼠标点击 diva 时的状态。

#### 2、focus、focus\-within

```
.diva:focus {...}
.diva:focus-within {...}
```

这两个伪类描述了元素作为焦点时的状态（例如，文本输入框被点击了，等待用户输入）。

focus\-within 和 focus 的区别是：focus 要求获得焦点的必须是元素本身，而 focus\-within 则只要元素**或元素的子元素**获得焦点就可以被触发。例如，文本输入框被点击了，整个表单都变得高亮，这时就采用 focus\-within。

### （二）结构伪类

结构性伪类描述的是元素在其 DOM 树结构中的位置属性。

#### **1、\-child 伪类**

```css
.parentDiv {
  .diva:first-child {...}
  .diva:last-child {...}
  .diva:only-child {...}
}

```

这三种伪类分别描述的是：parentDiv 下的第一个 \.diva、最后一个 \.diva、唯一的一个 \.diva。这种选择器很好用，因为有时相连的一堆同种元素，其首尾元素可能需要一些特殊属性（如加上一半的 border\-radius）。

#### **2、\-of\-type 伪类**

如果要区分**类型**（如第一个 h1），则需要使用 \-of\-type 伪类。例如：

```
.parentDiv {
  p:first-of-type {...}
  h1:last-of-type {...}
}
```

这两种伪类分别选中的是第一个同种元素、最后一个同种元素。这里显然没有 :only\-of\-type。

#### 3、nth\-\(\) 伪类

这是 CSS 伪类的一个重要部分，它允许根据数学表达式来确定选中第几个元素。它包含：

```
diva:nth-child() {...}
diva:nth-of-type() {...}
```

它们分别意味着取第 n 个元素、第 n 个同类元素。

括号内可以直接写数字，表示取第 n 个元素。例如，下面是取第二个元素：

```
diva:nth-child(2) { color:red; }
```

还可以写数学表达式。例如：

```
diva:nth-child(odd) { color:red }
diva:nth-child(even) { color:red }
```

odd 是奇数的意思，even 是偶数的意思。这代表着选中第奇数个和第偶数个元素。

```
diva:nth-child(3n+1) { color:red }
```

这代表着取第 1、4、7、10 ···· 个元素。

这样的功能非常有用。例如，有时我们可能想给一个表格设置样式、期望行的背景颜色以一定的规律变化，这里就可以用到 nth\- 伪类。

#### 4、root 伪类

这是一个特殊的伪类，指代整个文档的根元素（<html\>）。例如：

```
:root {
  background-color:blue;
}
```

这意味着 <html\> 元素的背景颜色为蓝色。

:root 不能简单等价于 html 选择器，因为 :root 的优先级比 html 高。

### （三）关系伪类

关系伪类表示的是具有某种选择器条件的元素，需要配合其他 CSS 选择器使用。

下面的三个关系伪类，其作用有些类似编程语言中 IF 条件判断的 NOT 和 OR。

#### 1、not\(\) 伪类

表示的是不具有某种选择器的元素。例如：

```
.diva:not(img) {
  color:red;
}
.diva:not(:last-child) {
  color:red;
}
```

上面的内容分别表示的是：不是 img 的 diva 元素和不是其父元素的最后一个子元素的 diva 元素。

#### 2、is\(\) 和 where\(\) 伪类

用于把多个选择器合并起来，语法（以 is 为例）是 is\(a,b,c\)。例如：

```
.diva:is(img,#me,.box) {
  border-radius:20px;
}
```

上面的伪类选中了自己同时是 img、\#me 或 \.box 中一者的 diva 元素。其效果和下面的 CSS 是等价的：

```
img.diva,
#me.diva,
.box.diva {
    border-radius:20px;
}
```

where\(\) 的语法和作用与 is\(\) 基本相同，但 where\(\) 的优先度是始终最低的，这使它在 CSS 的属性覆盖上有一些作用。

#### 3、has\(\) 伪类

用于选中具有某种属性的**子元素**的父元素（is、where 选中的是父元素本身）。例如：

```
.parentDiv:has(img) {}
```

选中的是具有 img 子元素的 parentDiv。

has\(\)、is\(\)、where\(\) 的选择器本身还能再嵌套，这样就能实现更多从前需要 JS 才能实现的复杂功能。例如：

```
.parentDiv:has(.content > .button:hover) {
    background-color: #ffecec;
}
```

选中的是具有直属于 \.content、同时又处在被 hover 状态下的 \.button 对应的 parentDiv。

has 方法非常有用。在 has 方法之前，CSS 只能根据父元素选择子元素（\.parentDiv \> \.me），而 has 方法则允许 CSS 根据子元素选择父元素。

例如，如果我们要实现 “当按钮被 hover 时，整个 parentDiv 背景变白”，可以这么写：

```
.parentDiv:has(.button:hover) {
  background-color:white;
}
```

### （四）嵌套语法

伪类支持在嵌套语法中使用。例如：

```
.div:hover {
  p { color:red; }
}
```

这段 CSS 的含义是：当 \.div 被 hover 时，其下属的 p 元素变为红色。

此外，伪类的嵌套语法也可以加在嵌套的内部，例如：

```
.parentDiv {
  :last-child {...}
  >:first-child {...}
}
```

这两个选择器分别表示：在 parentDiv 的子元素中，所有容器（不包括 parentDiv）的最后一个子元素、parentDiv 直属的第一个子元素。

如果想在嵌套中表示 parentDiv 的某种属性，则需要使用 & 符号。例如：

```
.parentDiv {
  &:hover {...}
}
```

这等价于 \.parentDiv:hover \{\}。

### （五）扩展：表单伪类

这部分涉及到了 HTML 表单（HTTP GET/POST方法）的元素处理方式，暂时不做深入研究。

| 伪类 | 含义 |
| --- | --- |
| :enabled | 可用的表单元素 |
| :disabled | 被禁用的表单元素 |
| :checked | 已选中的复选框或单选框 |
| :required | 必填字段 |
| :optional | 非必填字段 |
| :valid | 满足验证条件 |
| :invalid | 不满足验证条件 |
| :read\-only | 只读字段 |
| :placeholder\-shown | 正在显示 placeholder 的输入框 |

## 三、伪元素

伪类描述的是 “具有某种性质的现有元素”，而伪元素则是将现有元素的一部分 “元素化”，使之能参与 CSS 的样式描述。例如，伪类可以描述 “一个现有的 button 被 hover 后所应当具有的样式”，而伪元素可以描述 “一段英文文本的第一个字母所需要具有的样式”。

伪类使用 :: 来表述（两个英文冒号）。

### （一）::before 和 ::after

#### 1、DOM 结构

经典的两个伪元素，它们可分别在 div 内的前后位置插入两个 “子元素”，并且设定属性。

```
.diva::before {
  content:"2026";
}
.diva::after {
  content:"2027";
}
```

这段 CSS 参与生成的 DOM 结构如下：

```
<div class="diva">
::before
<!--省略 diva 原有内容-->
::after
</div>
```

#### 2、content 属性和 ::before ::after 运用

content 属性决定了 ::before、::after 在 DOM 结构中的显示内容。例如：

```
::before { content:"Hello" }
```

这段内容在 DOM 中可以认为等价于：

```
<div>Hello</div>
```

::before、::after 强制要求 content 属性，否则不会显示；如果不需要 content 属性，则可设置 content:""。

content 中存放的文字主要是装饰作用的。例如一个列表，每行的行首都需要加一个 “★” 图标，则可以这样写：

```
.line::before {
  content:"★";
}
```

这样写可以免去 HTML 中利用 JS 批量给元素的文本内容增加 ★ 符号的工作量。

强烈建议 content 中只存放装饰性文字，而不存放重要的语义内容。推荐的前端模式是：HTML 存放结构和内容，CSS 存放样式，而 JS 存放动作。使用 HTML 存放样式（如 style=""）、CSS 存放内容等会打乱这个模式，导致前端项目难以维护。

此外，::before、::after 本身也可以直接作为普通元素使用，用来做装饰性的色块等。

### （二）其他伪元素

其他伪元素基本上都是对元素内的文本内容（如 first\-letter ）进行操作的。

#### 1、::selection

div 中文字被选中时采用的样式。

#### 2、::placeholder

input 的占位文本的样式。

#### 3、::marker

列表中项目的序号（数字、符号）的样式。

#### 4、::first\-line 和 ::first\-letter

块级元素的文本内容中第一行、第一个字母（或数字、符号等）的样式。

### （三）伪元素的嵌套语法

伪元素的嵌套语法和伪类是类似的。例如：

```
.parentDiv {
  &::before {
    content:"Hello";
  }
  >::after {
    content:"World";
  }
  ::selection {
    background-color:#0068AD;
  }
}
```

上面三个选择器，选中的分别是（假设子元素为 diva）：\.parentDiv 的 ::before，\.parentDiv 直属的 \.diva 的 ::after，\.parentDiv 下的所有元素的 ::selection。

### （四）综合使用

同时使用两者时，伪类要在伪元素的前面，例如：

```
.div:active::before {
  content:"";
}
```