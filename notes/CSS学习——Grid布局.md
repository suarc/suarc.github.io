# CSS Grid布局方法学习

## 一、父元素基础属性

```
display:grid;
```

**（一）基础属性**

这部分和flexbox很像，不用单独学习。

- grid-template-rows、grid-template-columns规定行列数及其宽度。
- grid-auto-flow规定了内容自动排列的方向，有点类似flex-direction（但实际上并不同）。row、column对应行、列。
- justify/align-content/items规定了内容的布局方式。在GridBox中，justify始终对应横轴，而align始终对应纵轴。
- gap控制间距，row-gap和column-gap可以控制不同方向上的间距。gap可以简写：

```
gap: 行间距 列间距
```

**（二）定义基准行列**

单位：fr规定按比例分配，也可直接写px。

```
grid-template-rows:1fr 200px 200px;
grid-template-columns:50px 50px 50px;
```

这样规定了3行3列，第2、3行固定200px，第1行按比例“1”分空间。由于只有第1行按比例分空间，因此第1行分剩下的全部空间。

过多行列则采用repeat语法：

```
grid-template-rows:repeat(3,1fr) repeat(2,100px);
```

这意味着一共5行，前3行等分剩余空间，而4~5行固定100px。

repeat语法允许auto-fit，即自动决定repeat几次（这实际上是根据剩余空间来决定行/列数）。例如：

```
grid-template-rows:repeat(auto-fit,100px);
```

此外grid布局还支持minmax语法，规定了行/列的最低/高。例如：

```
grid-template-rows:repeat(2,minmax(200px,1fr));
```

这规定了2行，并且每行的最低高度是200px，最高高度是按1fr分配。

**（三）按区域划分**

允许事先定义grid的area，再使用grid-area来划定行列区域。这样在某些情况下会比较直观。

```
grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";
```

这样事实上规定了一个3行2列Grid结构。子元素要引用区域时，可使用grid-area: header。（空单元格使用“.”占位）

注意：这种方法实际上是跨行/列结构。所以如果在HTML中输入了多个含sidebar和main的div，它们会重叠在同样的行列中。

如果在CSS中同时定义了多个相同area，如下所示：

```
grid-template-areas:
  "header header"
  "sidebar main"
  "sidebar main"
  "footer footer";
```

这实际上规定了sidebar是一个横跨第二行和第三行的grid结构，而不是同时存在两个为sidebar的div。

**（四）隐式行列**

当元素超出模板时，可通过设置隐式行列，规定子元素超出模板时自动为其生成的新行列的参数。

```
grid-auto-rows: 100px;
grid-auto-columns: 100px;
```

## 二、子元素基础属性

除了align-self和justify-self外，子元素还有一个重要属性是跨行（row）和跨列（column）。

**（一）横跨行列**

先定义行/列线：它们是Grid二维布局的分隔线。例如，一个两行、三列表格结构，则有3条行线、4条纵线（要算上两侧和中间）。一般状态下，行线/纵线的起点是上侧/左侧，终点反之。

下面是另外一个示例：

```
grid-row:2/5;
grid-column:2/4;
```

grid-row:2/5规定了这个表格在行方向中，从第2条**行线**开始，到第5条行线结束，横跨3行。

这里使用的是正数，指的是从行起点开始的第1条线~第3条线。如果使用负数，如-3/-1，则是从行终点开始倒数的第3条线~第1条线。

当然，还有span写法：

```
grid-row:span 2;
grid-column:span 3;
```

这实际上规定了从此grid子元素的基准格出发，向横/纵向占据几格。例如，row:span 2规定了纵向占2格。span必须是正整数。

span写法直观，但行列线写法也有优点，例如：

```
  grid-row: 1 / -1;
  grid-column: 1 / -1;
```

这样可以快速占满行/列。

**（二）GRID-AREA**

grid-area除了划定区域外，还可以当作grid-column和grid-row的合并写法。具体写法是：

```
grid-area: 行起点 / 列起点 / 行终点 / 列终点;
grid-area: 1 / 2 / 3 / 4;
```

使用负数时的效果与grid-column和grid-row相同。对于初学者来说，目前只建议掌握把四种属性全部写全的写法。

**（三）其他**

另外：position:sticky和top:0可以帮助首行保持固定在顶部。

Grid 项目默认有类似 min-width: auto 的行为，内容可能把 1fr 撑开，导致溢出。常见解决：minmax(0, 1fr) 或给项目 min-width: 0;。这是实际写响应式 Grid 很容易踩的坑。