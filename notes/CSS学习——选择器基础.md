# CSS学习——选择器基础

## 一、选择器的种类

CSS 选择器用于选择一定的 DOM（*Document Object Model*）节点，从而允许开发者对 HTML 元素的样式进行描述。

### （一）全局选择器（通配）

全局选择器的符号是 “ \* ”，会选中 DOM 中的所有元素。例如：

```
<p>ChatGPT 6.2-Sol</p>
<a>Hello!</a>
```

```
* {
  color:red;
}
```

则两段文本都是红色的。

注意：全局选择器会依次为所有元素应用样式。仅当一个属性必须加在全部元素上时，才应将其放入全局选择器；否则应当使用属性继承方法。

### （二）元素选择器

没有任何符号，直接写 HTML 标签名，则选中所有该标签。例如：

```
<p>Hello World!</p>
<p>HyperText Markup Language</p>
```

```
p {
  color:red;
}
```

最后两段文字的颜色都是红色的。

此外还有伪元素选择器（在伪类与伪元素一节中详细介绍）：

```
::before {
  color:red;
}
```

### （三）ID 选择器

每个 HTML 元素都可以具有一个 ID 属性，每个具有 ID 的元素，其 ID 都是全文档唯一的。使用 “\#ID名” 可选中具有某个 ID 的元素。例如：

```
<p id="hello">Hello</p>
<p id="me">World</p>
```

```
#hello {
  color:red;
}
#me {
  color:black;
}
```

第一行字是红色的，第二行字则是黑色的。

### （四）属性选择器

属性是写在 HTML 标签内的对元素的描述。例如：

```
<img src="1.png" id="hello" class="avatar" data-hello="yes" />
```

src、id、class 均为<img\>的属性。可以使用这些属性来选中这个标签。

#### 1、类选择器

class 属性无疑是对 CSS 最重要的 HTML 属性，使用“ \. \+ 属性名 ”选中。例如：

```
.avatar {
  color:red
}
```

过于经典，不再介绍。

#### 2、其他属性选择器

若要选择其他属性，可使用 \[属性名="属性内容"\] 来选择。例如：

```
[data-hello="yes"] {
  color:red;
}
```

方括号属性选择器的语法如下：

| 选择器 | 简介 | 含义 | 例 |
| --- | --- | --- | --- |
| \[a\] | 存在属性即可 | 只要求属性存在，不管值 | \[data\-type\] |
| \[a=v\] | 精确匹配 | 值完全等于 v | \[class="btn"\] 不匹配 class="btn primary" |
| \[a\~=v\] | 宽泛匹配 | 值按空白分隔后，含某个单词等于 v | \[class\~="btn"\] 匹配 class="btn primary" |
| \[a\|=v\] | —— | 等于 v，或等于 v\- 开头（语言子码场景） | \[lang\|="zh"\] 匹配 zh\-CN |
| \[a^=v\] | 开头匹配 | 以 v 开头 | \[href^="https"\] |
| \[a$=v\] | 结尾匹配 | 以 v 结尾 | \[href$="\.pdf"\] |
| \[a\*=v\] | 子字符串 | 包含子串 v | \[href\*="example"\] |

总之，方括号选择器中，“=” 表示完全相等、“\~=” 按空白分割后存在相等项、“^=”、“$=” 分别表示以 v 开头/结尾、“ \*= ” 表示包含子字符串。

例如：

```
<p data-type="hello good.pdf"></p>
```

```css
/* 不能选中的写法 */
[data-type="hello"] {}
/* 可以选中的写法 */
[data-type~="good.pdf"] {}
[data-type] {}
[data-type^="hello"] {}
[data-type$=".pdf"] {}
[data-type*="ello"] {}
```

方括号属性选择器可以选普通 HTML 属性，例如 \[href^="https://"\]、\[id="me"\] 等。

#### 3、伪类选择器

在伪类与伪元素一节中详细介绍。

```css
:hover {
  color:red;
}
```

## 二、选择器层级关系

### （一）继承关系

CSS 具有**继承（inheritance）**关系：父元素的可继承属性可以继承给子元素。对于一个可继承属性来说，当子元素无该属性时，会试图去父元素中获得该属性。

例如：

```
.parentDiv {
  color:red;
}
```

```
<div class="parentDiv">
  <p class="text">Hello!</p>
</div>
```

p 虽然没有设定颜色，但从 parentDiv 继承了 color:red，从而变为红色。

### （二）可继承属性

显然，并不是所有的 CSS 属性都应当继承。常见的不继承属性如下：

```css
display、position、margin、padding、border、width/height、background-*、overflow、float、z-index、opacity、transform、box-shadow、vertical-align、text-decoration
```

这些属性显然不应当继承，因为它们描述的是**一个（而不是一类）**元素本身应当具有的特殊的属性，我们称之为**非继承属性**。像是 color、font\-size 等属性是用于描述一个区域的所有元素的属性的，因此它们属于**可继承属性**，将其写于父元素上，即可作用于整个父元素下的 DOM 子树。

## 三、选择器的构造

有时一个选择器并不能解决问题，我们需要组合使用多种选择器来精确地选中某个元素（例如，id为me且class为button的按钮），这就是选择器的构造。

### （一）并列构造

并列构造，就是一个元素同时满足多个条件时，使用多个选择器来选择一个元素的方式。例如：

```
<div class="parentDiv">
  <p class="text" id="me"></p>
</div>
```

如果我们想要选中 class=“text” 且 id=“me” 的 p 元素，就需要对 class 和 id 选择器进行构造。

#### 1、复合选择器（AND）

如果想要选中同时满足两个选择器的元素，则直接将两个选择器直接连在一起，例如 \.text\#me。

例如：

```
<p class="text" id="me" data-type="title">Hello!</p>
```

```
p.text#me:hover[data-type~="title"] {
  color:red;
}
```

上面的选择器可以选中上面的被 hover 的 p 元素。

为什么两个选择器可以直接拼成一个字符串呢？因为 CSS 选择器具有分隔符（\# \. \[\] :），可以很容易地划分各个选择器。

此外还有：

```
*::before {
  color:red;
}
```

这样可以选中所有元素的 ::before。

注意：CSS 标准规定，**伪元素选择器**（如 ::before ）在复合选择器中**必须放到最后**；**元素选择器必须放在最前面**，因为元素选择器没有分隔符。

#### 2、任意选择器（OR）

如果想要选中符合任意一个选择器的元素，则将不同选择器用逗号（，）分隔。

例如：

```
<p class="text" data-type="title">Hello!</p>
<p id="me"></p>
```

```
.text, #me, [data-type="title"] { 
  color:red;
}
```

这个选择器同时选中了 class=“text”、id=“me”、data\-type=“title”。

### （二）层级构造

层级构造允许我们根据元素之间的父子关系来选中元素。例如：

```
<div class="parentDiv">
  <p class="text"></p>
</p>
<p class="text">
```

如果我们需要选中 parentDiv 下的 text 而不选中外面的 text，则需要使用层级构造。

#### 1、范围层级构造

如果我们想选中父元素下所有具有某种选择器的元素，则使用空格分隔。例如：

```
.parentDiv .text {
  color:red;
}
```

当然，更加现代的方法是使用 CSS 嵌套：

```
.parentDiv {
  .text {
    color:red;
  }
}
```

这种方法不限制层级深度，意味着下面的 p 元素也会被选中。

```
<div class="parentDiv">
  <div class="content">
    <p class="text"></p>
  </div>
</div>
```

#### 2、直属层级构造

如果想选中父元素直属的子元素，则使用 \> 作为分隔符。例如：

```
<div class="parentDiv">
  <p class="text" id="test1">Helao</p>
  <div class="content">
    <p class="text" id="test2">Helao</p>
  </div>
</div>
```

```
.parentDiv > .text {
  color:red;
}
```

只有 id 为 test1 的 p 元素才会被选中，因为只有它是 parentDiv 的直接子元素。

当然，直属层级构造也支持嵌套语法：

```
.parentDiv {
  >.text {
    color:red;
  }
  .text {
    color:blue;
  }
}
```

顺带指出：\>\.text 和 \.text 的级别是相同的，因此最后 p 元素呈现为蓝色。

#### 3、相同层级构造

如果我们想选中的不是下属子元素，而是某元素后面的兄弟元素呢？例如：

```
<p class="text">Hello World Program</p>
<h1 class="title">The language to write it:</h1>
<p class="text">C language</p>
<p class="text">JavaScript</p>
```

如果我们想选中 title 后的第一个兄弟 text，则使用 \+ 连接符：

```
.title + .text {
  font-weight:600;
}
```

如果我们想选中 title 后面的全部 text，则使用 \~ 连接符：

```
.title ~ .text {
  font-weight:600;
}
```

这样 “C language” 和 “JavaScript” 两段文本都会被加粗。

### （三）总结

| 多选择器的分割方式 | 被选中的前提 |
| --- | --- |
| 直接连接 | 同时成立 |
| 逗号 | 任意成立 |
| 空格 | 任意后代子元素 |
| \> | 直属子元素 |
| \+ | 同级的第一个后续兄弟元素 |
| \~ | 同级的所有后续兄弟元素 |

## 四、选择器优先级

CSS选择器中，可选中同一元素的选择器可能有多种，它们之间存在优先级关系。

### （一）优先级相同时

当优先级相同时，**后出现**的选择器的优先级更高。例如：

```
p {
  color:red;
}
p {
  color:black;
}
```

最终 p 的颜色是黑色，因为后出现的属性覆盖了前面出现的属性。

### （二）优先级不同时

#### 1、优先级

CSS 中，优先级有四个档次：ID 选择器（\#name）\> 类、属性、伪类选择器（\.class1、\[href="https://example\.com"\]、:hover） \> 标签、伪元素（p、::before） \> 通配符（\*）。

例如：

```
<a class="hello" id="test" href="https://example.com">Hello World!</a>
```

```
* { color:red; }
a { color:white; }
a::first-letter { color:blue; }
.hello, [href="https://example.com"], :hover { color:black; }
#test { color:yellow; }
```

最后<a\>的颜色是 yellow（a 处于 hover 状态）。前面的描述都被最后最高级的 ID 选择器覆盖了。

#### 2、优先级计算

实际使用时，多种选择器往往是组合使用的，这时就不能单纯用上面的四档划分法来判定优先度。这时我们先规定如下的基本选择器规则：

| 选择器类型 | 优先级权重 |
| :---: | :---: |
| 内联样式（如<p style=""\></p\>） | 1,0,0,0 |
| ID 选择器 | 0,1,0,0 |
| 类、属性、伪类 | 0,0,1,0 |
| 标签、伪元素 | 0,0,0,1 |
| 通配符 \* | 0,0,0,0 |

在复合选择器时，依次对四位进行加法运算，然后逐位比较，高位 \> 低位、大数值 \> 小数值，从而得到优先度。

例如：

```
[data-type="button"].class1 {
  color:red;
}
.class1 {
  color:black;
}
#paragraph {
  color:blue;
}
```

若上述选择器选中了同一个<p\>元素，最终该元素的颜色是蓝色。分别计算优先级，得到：

- 第一个选择器的优先度是 0,0,2,0。
- 第二个选择器的优先度是 0,0,1,0。
- 第三个选择器的优先级是 0,1,0,0。

因此选择器3 \> 选择器1 \> 选择器2。

记忆基本优先级时，可以按 “内联 \> ID \> 属性 \> 标签 \> 通配” 的方法记忆，而把类归为class属性、伪类归为类、伪元素归为标签（::before \~ <div\>），不过这只是一种思维记忆方法。