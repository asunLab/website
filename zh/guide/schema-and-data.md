# Schema 与数据

ASUN 最重要的思想是：**Schema** 只描述一次结构，**数据** 只负责按顺序给值。

## 分离方式

Schema：

```asun
{name@str, age@int, active@bool}
```

数据：

```asun
(Alice, 30, true)
```

合起来：

```asun
{name@str, age@int, active@bool}:(Alice, 30, true)
```

如果是列表，Schema 写一次，后面跟多条元组：

```asun
[{name@str, age@int}]:
  (Alice, 30),
  (Bob,   25)
```

## Schema 规则

每个字段都使用 `@` 作为字段绑定符。对基本类型字段，可写成：

```text
name
name@type
```

当前允许的基本类型提示名只有：

- `int`
- `float`
- `str`
- `bool`

复杂字段则使用同一个 `@` 作为必需的结构绑定：

- `@{...}` 嵌套结构体
- `@[type]` 数组
- `@[{...}]` 对象数组
- `@[K:V]` Map

例如：

```asun
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[str:str]}
```

这意味着：

- `name` 与 `name@str` 的结构布局相同
- `address@{...}`、`tags@[...]`、`attrs@[str:str]` 这类复杂字段不能去掉 `@`，因为它负责把字段绑定到嵌套 schema

## 字段名

简单字段名只能包含 ASCII 字母、数字和 `_`：

```asun
{id, name, active, 65}
```

如果字段名包含空格、`+`、`-`、`.` 或语法字符，就必须加引号：

```asun
{"id uuid"@int, "a+b"@str, "{}[]@\""@str}
```

## 数据规则

数据是位置型的，不是按 key 匹配。第一个值对应第一个字段，第二个值对应第二个字段，依此类推。

嵌套结构体的数据写成嵌套元组：

```asun
{address@{city@str, zip@str}}:((Berlin, 10115))
```

数组使用方括号：

```asun
{tags@[str]}:([rust, go, zig])
```

Map 使用 `key:value` 条目：

```asun
{attrs@[str:str]}:([lang:zig, tier:prod])
```

`_` 表示 null：

```asun
{id@int, score@float}:(1, _)
[1, _, 3]
```

每个位置都必须有值：`(1, )`、`[1,,3]` 这样的空位和尾逗号都是错误。`"_"` 是字符串 `_`；解码器也接受关键字 `null`。只含一个 null 的数组写作 `[_]`。

## ASUN 当前不做什么

当前 ASUN 文本格式**不支持**在数据区使用内联对象字面量：

```asun
{user@{id@int}}:({id: 1})   /* 不是当前 ASUN */
```

键值集合是在 Schema 中声明的 Map，而不是数据区里的对象：

```asun
{attrs@[str:str]}:([lang:zig, tier:prod])
```

没有空位，引号外也没有反斜杠转义：

```asun
{a@int, b@str}:(1, )        /* 不是当前 ASUN：应写 (1, _) */
{a@str}:(x\,y)              /* 不是当前 ASUN：应写 ("x,y") */
```

## 语法概要

```text
single   = schema ":" tuple
slice    = "[" schema "]" ":" rows
schema   = "{" fields "}"
field    = name ["@" type]
type     = "int" | "float" | "str" | "bool" | schema
         | "[" type "]"                    /* array */
         | "[" [keytype] ":" [type] "]"    /* map   */
rows     = tuple ("," tuple)*
tuple    = "(" [values] ")"
values   = value ("," value)*
value    = scalar | "_" | tuple | "[" [values] "]" | "[" entries "]"
entries  = key ":" value ("," key ":" value)*
```

完整的字符串、转义、空白与注释规则见 [语法参考](/zh/reference/syntax)。
