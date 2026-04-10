# 语法参考

ASON 当前文本语法的完整参考。

## 文档形态

单行单值：

```ason
{id@int, name@str}:(1, Alice)
```

多行列表：

```ason
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

`:` 前面是 Schema，后面是一条或多条元组数据。

## Schema

### 字段写法

```ason
{id, name, active}
{id@int, name@str, active@bool}
```

在文本 ASON 中，`@` 是字段绑定符。基本类型提示是可选的。若出现，当前只允许：

- `int`
- `float`
- `str`
- `bool`

对复杂字段，同一个 `@` 会变成必需的结构绑定：

- `@{...}` 嵌套结构体
- `@[type]` 数组
- `@[{...}]` 对象数组

例如：

```ason
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[{key@str, value@str}]}
```

`id` 与 `id@int` 在结构布局上等价；但 `profile@{...}`、`tags@[...]` 必须保留 `@`，否则解析器无法识别嵌套结构边界。

### 字段名

简单字段名可以不加引号：

```ason
{id, name, active}
```

如果字段名：

- 含空格
- 以数字开头
- 含 `{ } [ ] @ "` 等语法字符

就必须加引号：

```ason
{"id uuid"@int, "65"@bool, "{}[]@\""@str}
```

## 数据

数据是位置型的，值严格按 Schema 顺序对应。

```ason
{id@int, name@str, active@bool}:(1, Alice, true)
```

嵌套结构体的数据写成嵌套元组：

```ason
{user@{id@int, name@str}}:((1, Alice))
```

当前格式不支持内联对象字面量。

## 标量值

### `int`

```ason
42
-7
0
```

### `float`

```ason
3.14
-0.5
1e10
```

### `bool`

```ason
true
false
```

### null / optional

空槽表示 null / 缺失：

```ason
{id@int, label@str}:(1, )
```

## 字符串

### 不带引号字符串

简单值可以不加引号：

```ason
Alice
hello world
```

规则：

- 首尾空白会被 trim
- 出现保留语法字符时应改用引号
- 值里若出现 `@`，应加引号，避免与 Schema 语法混淆

```ason
{name@str}:("@Alice")
```

### 带引号字符串

需要保留空白或包含保留字符时使用引号：

```ason
"value with, comma"
"  leading spaces  "
"line\nbreak"
```

常见转义包括 `\"`、`\\`、`\n`、`\t`、`\r`。

## 数组

```ason
[{name@str, scores@[int]}]:
  (Alice, [90, 85, 92]),
  (Bob,   [76, 88])
```

也允许嵌套数组：

```ason
[{matrix@[[int]]}]:
  ([[1, 2], [3, 4]])
```

## 条目列表

键值集合写成条目列表：

```ason
[{name@str, attrs@[{key@str, value@int}]}]:
  (Alice, [(age, 30), (score, 95)])
```

## 注释

ASON 支持块注释：

```ason
/* user list */
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

行注释不是格式的一部分。

## 空白规则

- 结构 token 之间的空白会被忽略
- 不带引号字符串会在外层自动 trim
- 推荐使用多行美化布局，但不是必须
