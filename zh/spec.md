# ASON 格式规范

本页是网站版的当前 ASON 简明规范，与本仓库中的实现保持一致。

如果你需要更完整的边界规则和更多示例，请继续阅读：

- [语法参考](/zh/reference/syntax)
- [数据类型](/zh/reference/data-types)
- [Schema 与数据](/zh/guide/schema-and-data)

## 核心形态

ASON 把 **Schema** 与 **数据** 分开写。

单个值：

```ason
{id@int, name@str, active@bool}:(1, Alice, true)
```

多行列表：

```ason
[{id@int, name@str, active@bool}]:
  (1, Alice, true),
  (2, Bob, false)
```

Schema 只写一次，`:` 后面的元组按 Schema 顺序取值。

## Schema 规则

字段定义只有两种基本形态：

```text
name
name@type
```

当前唯一支持的标量 Schema 类型名只有：

- `int`
- `float`
- `str`
- `bool`

结构型写法同样用 `@` 引出：

- `@{...}` 嵌套结构体
- `@[type]` 数组
- `@[{...}]` 对象数组

例如：

```ason
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[{key@str, value@str}]}
```

键值集合应写成条目列表，例如 `[{key@str, value@str}]`。

## 字段名

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

## 数据规则

数据是位置型的，不按 key 匹配。第一个值对应第一个字段，第二个值对应第二个字段，依此类推。

嵌套结构体的数据写成嵌套元组：

```ason
{user@{id@int, name@str}}:((1, Alice))
```

当前格式不支持在数据区写对象字面量。

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

ASON 有两种字符串形式。

不带引号字符串：

- 适合简单值
- 首尾空白会被 trim
- 不应包含保留语法字符

带引号字符串：

- 保留空白
- 可包含保留字符
- 支持 `\"`、`\\`、`\n`、`\t`、`\r` 等转义

例如：

```ason
Alice
"Alice Smith"
"  padded  "
"value with, comma"
```

在 Schema 中，`@` 是结构语法；在数据中，`@` 只是普通内容。为避免歧义，值里出现 `@` 时应加引号：

```ason
{name@str}:("@Alice")
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

## 二进制说明

ASON-BIN 不像文本 ASON 那样天然自描述。实际使用中，二进制解码通常需要外部 schema、目标类型或两端一致的字段布局。

适合文本 ASON 的场景：

- 需要人工可读
- 需要跨语言交换
- 需要 payload 自带 schema

适合 ASON-BIN 的场景：

- 机器内部传输
- 更紧凑的机器表示
- 双方实现已经明确对齐
