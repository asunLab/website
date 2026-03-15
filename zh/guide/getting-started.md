# 快速开始

下面按语言给出一轮最短上手示例。

## Rust

```toml
[dependencies]
ason = "0.1"
serde = { version = "1", features = ["derive"] }
```

```rust
use ason::{decode, encode_typed, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
struct User {
    id: i64,
    name: String,
    active: bool,
}

fn main() -> Result<()> {
    let users = vec![
        User { id: 1, name: "Alice".into(), active: true },
        User { id: 2, name: "Bob".into(), active: false },
    ];

    let text = encode_typed(&users)?;
    let restored: Vec<User> = decode(&text)?;
    assert_eq!(users, restored);
    Ok(())
}
```

查看完整 [Rust 指南](/zh/languages/rust)。

## Go

```bash
go get github.com/ason-lab/ason-go
```

```go
package main

import (
    "fmt"
    ason "github.com/ason-lab/ason-go"
)

type User struct {
    ID     int64  `ason:"id"`
    Name   string `ason:"name"`
    Active bool   `ason:"active"`
}

func main() {
    users := []User{
        {ID: 1, Name: "Alice", Active: true},
        {ID: 2, Name: "Bob", Active: false},
    }

    text, _ := ason.EncodeTyped(users)
    var out []User
    _ = ason.Decode(text, &out)
    fmt.Println(out)
}
```

查看完整 [Go 指南](/zh/languages/go)。

## Python

```bash
cd ason-py
python3 -m pip install -e .
```

```python
import ason

users = [
    {"id": 1, "name": "Alice", "active": True},
    {"id": 2, "name": "Bob", "active": False},
]

text = ason.encodeTyped(users)
restored = ason.decode(text)

assert restored == users
```

查看完整 [Python 指南](/zh/languages/python)。

## 其他语言

| 语言 | 指南 |
|------|------|
| C# | [C# 指南](/zh/languages/csharp) |
| Dart | [Dart 指南](/zh/languages/dart) |
| JS / TS | [JS / TS 指南](/zh/languages/js) |
| PHP | [PHP 指南](/zh/languages/php) |
| C | [C 指南](/zh/languages/c) |
| C++ | [C++ 指南](/zh/languages/cpp) |
| Java / Kotlin | [Java / Kotlin 指南](/zh/languages/java) |
| Zig | [Zig 指南](/zh/languages/zig) |

## 语言支持矩阵

| 语言 | 最低版本 | 主要模型 | 二进制解码需要什么 |
|------|----------|----------|--------------------|
| Rust | Rust `1.85+` | `serde` derive / 目标类型 | 目标类型 `T` |
| Go | Go `1.24+` | 反射 + struct tag | 输出指针 |
| Python | Python `3.8+` | Python dict/list + 编译扩展 | schema 字符串 |
| Java / Kotlin | Java `21+` | 反射 + `Class<T>` / Kotlin helper | 目标类 |
| C# | `.NET 8+` | `IAsonSchema` + factory | 字段名 + 类型 + factory |
| Dart | Dart `3.0+` | `AsonSchema` + factory | 字段名 + 类型 + factory |
| JS / TS | 支持 ES2020 的运行时 | 普通对象 + 运行时推断 | schema 字符串 |
| PHP | PHP `8.4+` | 原生扩展上的数组模型 | schema 参数 |
| C | C11 | 显式 schema 描述符 | schema 描述符 |
| C++ | C++17 | 目标类型上的元数据宏 | 目标类型 `T` |
| Zig | Zig `0.15.2+` | comptime 目标类型 | 目标类型 `T` + allocator |

如果你需要看某个语言的准确 API 名称、示例和当前实现边界，请继续进入对应语言页。

## 工具

- 规范以 [ASON 格式规范](/zh/spec) 为准。
- VS Code 插件可提供语法高亮与预览。
- 兼容性与 benchmark 页面适合做实现对比。
