# 数据类型

当前 ASUN 的 Schema 标量名是固定且精简的，只有：

- `int`
- `float`
- `str`
- `bool`

## 标量类型

| ASUN 类型         | 示例                   | 说明                 |
| ----------------- | ---------------------- | -------------------- |
| `int`             | `42`, `-100`, `0`      | 任意 `i64` 范围整数  |
| `float`           | `3.14`, `-0.5`, `1e10` | 浮点值的文本表示     |
| `bool`            | `true`, `false`        | 严格小写             |
| `str`（不带引号） | `Alice Smith`          | 首尾空白会被 trim    |
| `str`（带引号）   | `" spaces "`           | 保留空白并支持转义   |
| null / None       | _（空槽）_             | 两个逗号之间没有字符 |

## 复合类型

### 嵌套结构体

```asun
{id@int, address@{city@str, zip@str}}:(
  1,
  (Berlin, 10115)
)
```

### 数组 / 列表

```asun
{id@int, tags@[str]}:(1, [rust, go, wasm])
```

数组也可以嵌套：

```asun
[{matrix@[[int]]}]:
  ([[1, 2], [3, 4]]),
  ([[5, 6], [7, 8]])
```

### 条目列表

键值集合建模为条目结构体数组：

```asun
{attrs@[{key@str, value@int}]}:([(age, 30), (score, 95)])
```

### 可选值 / 可空

空槽表示 `None` / `null`：

```asun
[{id@int, score@float}]:
  (1, 9.5),
  (2,    )
```

## 跨语言类型映射

| ASUN 类型   | Rust              | Go                  | Python                | Java / Kotlin         | Swift                         | C                        | C++                       | Zig          | C#                           | Dart                   | JS / TS              | PHP                   |
| ----------- | ----------------- | ------------------- | --------------------- | --------------------- | ----------------------------- | ------------------------ | ------------------------- | ------------ | ---------------------------- | ---------------------- | -------------------- | --------------------- |
| `int`       | `i64`             | `int64`             | `int`                 | `long` / `Long`       | `Int64`                       | `int64_t`                | `int64_t`                 | `i64`        | `long`                       | `int`                  | `number`（整数）     | `int`                 |
| `float`     | `f64`             | `float64`           | `float`               | `double` / `Double`   | `Double`                      | `double`                 | `double`                  | `f64`        | `double`                     | `double`               | `number`             | `float`               |
| `bool`      | `bool`            | `bool`              | `bool`                | `boolean` / `Boolean` | `Bool`                        | `bool`                   | `bool`                    | `bool`       | `bool`                       | `bool`                 | `boolean`            | `bool`                |
| `str`       | `String` / `&str` | `string`            | `str`                 | `String`              | `String`                      | `char*` / 缓冲区字段     | `std::string`             | `[]const u8` | `string`                     | `String`               | `string`             | `string`              |
| null / 空槽 | `Option<T>`       | `nil` / 指针 / 空槽 | `None`                | 可空字段 / 空槽       | `nil` / optional              | 可空指针 / 空槽          | `std::optional<T>` / 空槽 | `?T`         | 可空引用 / 可空值类型        | `null`                 | `null` / `undefined` | `null`                |
| `[T]`       | `Vec<T>`          | `[]T`               | `list`                | `List<T>`             | `[T]`                         | 数组 / 重复行            | `std::vector<T>`          | `[]T`        | `List<T>` / 数组             | `List<T>`              | `T[]`                | 索引数组              |
| 嵌套结构体  | `struct`          | `struct`            | `dict` / 工厂返回对象 | class / data class    | `AsunValue.object` / 宿主模型 | `struct` + schema 描述符 | `struct` + 元数据宏       | `struct`     | class / record + schema 接口 | 实现 `AsunSchema` 的类 | 普通对象             | 关联数组 / 对象式数组 |

### 说明

- 所有语言共享同一套 ASUN schema 名称，只有 `int`、`float`、`bool`、`str`。
- 宿主语言的具体类型名可以不同，但对应的 ASUN 语义相同。例如 Java 用 `double` 承载 `float`，Zig 常用 `[]const u8` 承载 `str`。
- JS / TS 运行时只有一种 `number`，因此这里的 `int` 表示“以整数形式编码的 number”。
- 键值集合统一写成 entry-list，例如 `[{key@str,value@str}]`。

## 语言支持总览

| 语言          | 最低版本                                     | 实现方式                                    | 文本解码需要什么                         | 二进制解码需要什么                           |
| ------------- | -------------------------------------------- | ------------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| Rust          | Rust `1.85+`                                 | 基于 `serde` 的泛型编解码                   | 目标类型 `T`                             | 目标类型 `T`                                 |
| Go            | Go `1.24+`                                   | 反射 + struct tag                           | 输出指针                                 | 输出指针                                     |
| Python        | Python `3.8+`                                | 基于 Python dict/list 的 C++ 扩展           | 文本自带 schema，直接返回 Python 对象    | 显式 schema 字符串                           |
| Java / Kotlin | Java `21+`，Kotlin helper 基于 `1.9+` 工具链 | 反射 + 注解 + 类元数据                      | 目标 `Class<T>` 或 Kotlin reified helper | 目标 `Class<T>` / Kotlin reified helper      |
| Swift         | Swift tools `5.9+`                           | 围绕 `AsunValue` 的原生 Swift 值模型        | 文本自带 schema，返回 `AsunValue`        | binary 自带足够 typed 信息，返回 `AsunValue` |
| C             | C11                                          | 显式 schema 描述符 / 宏                     | schema 描述符 + 输出缓冲区               | schema 描述符 + 输出缓冲区                   |
| C++           | C++17                                        | 模板元数据宏（`ASUN_FIELDS`、`ASUN_TYPES`） | 目标类型 `T`                             | 目标类型 `T`                                 |
| Zig           | Zig `0.15.2+`                                | comptime 类型推导                           | 目标类型 `T` + allocator                 | 目标类型 `T` + allocator                     |
| C#            | `.NET 8+`（`net8.0`、`net10.0`）             | `IAsunSchema` + 工厂式类型化解码            | field bag 或 factory                     | 字段名 + 字段类型 + factory                  |
| Dart          | Dart `3.0+`                                  | `AsunSchema` 接口 + 工厂式类型化解码        | field bag 或 factory                     | 字段名 + 字段类型 + factory                  |
| JS / TS       | 支持 ES2020 的运行时                         | 运行时对象推断                              | 文本自带 schema，返回普通对象            | 显式 schema 字符串                           |
| PHP           | PHP `8.4+`                                   | 面向数组 / zval 的原生 C++ 扩展             | 文本自带 schema，返回数组                | 显式 schema 参数                             |

### 如何理解这张表

- 文本 ASUN 会把 schema 写在 header 里，所以很多动态语言可以直接从文本恢复数据。
- 二进制 ASUN 刻意不做自描述，因此大多数实现都需要额外提供：
  - 目标类型，
  - schema 描述符，
  - 或 schema 字符串。
- 当前仓库里的 Swift 是主要例外：它的 binary API 会携带足够的 typed 信息，因此可以直接 round-trip 成 `AsunValue`。
- “实现方式”描述的是各语言如何把宿主语言数据映射到同一套 ASUN 文本 / 二进制格式；wire format 本身在官方实现之间保持一致。

## 二进制说明

ASUN-BIN 内部可能会使用定宽宿主语言原语来存储值，但这些宽度**不是**额外的 schema 类型名。

- 对外 schema 仍然只有 `int`、`float`、`bool`、`str`。
- 官方实现的二进制编码统一使用小端序。
- 定宽存储细节属于 binary codec 实现层，不属于 schema 语义层。
