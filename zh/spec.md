# ASUN 格式规范

本页是网站版的当前 ASUN 简明规范，与本仓库中的实现保持一致。

如果你需要更完整的边界规则和更多示例，请继续阅读：

- [语法参考](/zh/reference/syntax)
- [数据类型](/zh/reference/data-types)
- [Schema 与数据](/zh/guide/schema-and-data)

## 核心形态

ASUN 把 **Schema** 与 **数据** 分开写。

文本格式也允许普通数组和裸标量值，用于 schema-less 动态数据；但 schema 对象和 schema 对象数组仍是主要交换形态。

单个值：

```asun
{id@int, name@str, active@bool}:(1, Alice, true)
```

多行列表：

```asun
[{id@int, name@str, active@bool}]:
  (1, Alice, true),
  (2, Bob, false)
```

Schema 只写一次，`:` 后面的元组按 Schema 顺序取值。

## Schema 规则

字段定义使用 `@` 作为字段绑定符。对于基本类型字段，可写成：

```text
name
name@type
```

对基本类型字段，当前唯一支持的提示名只有：

- `int`
- `float`
- `str`
- `bool`

对复杂字段，`@` 会变成必需的结构绑定：

- `@{...}` 嵌套结构体
- `@[type]` 数组
- `@[{...}]` 对象数组

例如：

```asun
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[{key@str, value@str}]}
```

键值集合应写成条目列表，例如 `[{key@str, value@str}]`。

简而言之：

- `id` 与 `id@int` 在结构布局上等价，但 `@int` 提供额外的基本类型提示
- `profile@{...}`、`tags@[...]` 这类复杂字段必须保留 `@`，因为它负责标记嵌套结构边界

## 字段名

简单字段名可以不加引号：

```asun
{id, name, active}
```

裸字段名只能包含 ASCII 字母、数字和 `_`；数字可以出现在开头。

如果字段名：

- 含空格
- 含 `+`、`-`、`.` 或其它标点
- 含 `{ } [ ] @ "` 等语法字符

就必须加引号：

```asun
{65@bool, "id uuid"@int, "a+b"@str, "{}[]@\""@str}
```

## 数据规则

数据是位置型的，不按 key 匹配。第一个值对应第一个字段，第二个值对应第二个字段，依此类推。

嵌套结构体的数据写成嵌套元组：

```asun
{user@{id@int, name@str}}:((1, Alice))
```

当前格式不支持在数据区写对象字面量。

## 标量值

### `int`

```asun
42
-7
0
```

### `float`

```asun
3.14
-0.5
1e10
1.5e-3
```

`.5`、`5.`、`+5`、`1e`、`1e+` 这些 token 是字符串，不是数字。

### `bool`

```asun
true
false
```

### null / optional

元组或数组里的空槽表示 null / 缺失：

```asun
{id@int, label@str}:(1, )
```

逗号是纯分隔符：`n` 个逗号分出 `n + 1` 个槽，所以末尾逗号会多出一个 null。`(a,b,)` 有三个值，`(,)` 是两个 null。`null` 也是关键字（`"null"` 才是字符串）。只含一个 null 的数组写作 `[null]`，因为 `[]` 是空数组。

## 字符串

ASUN 有两种字符串形式。

不带引号字符串：

- 适合简单值
- 首尾空白会被 trim
- 可以包含原始 `:`、`@`、`/`、`*`、`<`、`>`（`alice@example.com`、`12:30`、`https://a.com`）
- 不能包含原始 `, ( ) [ ] { } " \` 或控制字符
- `/*` 会被视为块注释开始，而不是字符串内容

带引号字符串：

- 保留空白
- 可包含保留字符
- 遵循 JSON 规则：`"`、`\` 和控制字符必须转义
- 支持 `\"`、`\\`、`\/`、`\n`、`\t`、`\r`、`\b`、`\f`、结构字符转义和 `\uXXXX`

例如：

```asun
Alice
"Alice Smith"
"  padded  "
"value with, comma"
```

在 Schema 中，`@` 是结构语法；在数据中，`@` 和 `:` 只是普通字符：

```asun
{name@str, email@str, at@str}:(@Alice, alice@example.com, 12:30)
```

关键字（`true`、`false`、`null`）和类型名（`int`、`float`、`str`、`bool`）区分大小写：`TRUE` 是字符串，`@INT` 是错误。

## 注释

ASUN 在可出现可选空白的位置支持块注释：

```asun
/* user list */
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

行注释不是格式的一部分。

注释与空白一样属于布局：可以出现在任意两个 token 之间（包括元组和数组内部），但不能出现在带引号字符串、不带引号字符串、数字或关键字内部。引号之外的 `/*` 总是开启注释，所以 `(x /* 备注 */)` 的值是 `x`。

## 二进制说明

ASUN-BIN 不像文本 ASUN 那样天然自描述。实际使用中，二进制解码通常需要外部 schema、目标类型或两端一致的字段布局。

适合文本 ASUN 的场景：

- 需要人工可读
- 需要跨语言交换
- 需要 payload 自带 schema

适合 ASUN-BIN 的场景：

- 机器内部传输
- 更紧凑的机器表示
- 双方实现已经明确对齐
