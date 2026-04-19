# Getting Started

Pick your language below for a quick first round-trip.

## Rust

```toml
[dependencies]
asun = "1.0"
serde = { version = "1", features = ["derive"] }
```

```rust
use asun::{decode, encode_typed, Result};
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

See the full [Rust guide](/languages/rust).

## Go

```bash
go get github.com/asunLab/asun-go
```

```go
package main

import (
    "fmt"
    asun "github.com/asunLab/asun-go"
)

type User struct {
    ID     int64  `asun:"id"`
    Name   string `asun:"name"`
    Active bool   `asun:"active"`
}

func main() {
    users := []User{
        {ID: 1, Name: "Alice", Active: true},
        {ID: 2, Name: "Bob", Active: false},
    }

    text, _ := asun.EncodeTyped(users)
    var out []User
    _ = asun.Decode(text, &out)
    fmt.Println(out)
}
```

See the full [Go guide](/languages/go).

## Python

```bash
pip install asun
```

```python
import asun

users = [
    {"id": 1, "name": "Alice", "active": True},
    {"id": 2, "name": "Bob", "active": False},
]

text = asun.encodeTyped(users)
restored = asun.decode(text)

assert restored == users
```

See the full [Python guide](/languages/python).

## Other Languages

| Language      | Guide                                  |
| ------------- | -------------------------------------- |
| Swift         | [Swift guide](/languages/swift)        |
| C#            | [C# guide](/languages/csharp)          |
| Dart          | [Dart guide](/languages/dart)          |
| JS / TS       | [JS / TS guide](/languages/js)         |
| PHP           | [PHP guide](/languages/php)            |
| C             | [C guide](/languages/c)                |
| C++           | [C++ guide](/languages/cpp)            |
| Java / Kotlin | [Java / Kotlin guide](/languages/java) |
| Zig           | [Zig guide](/languages/zig)            |

## Language Support Matrix

| Language      | Minimum version        | Main model                              | Binary decode requirement     |
| ------------- | ---------------------- | --------------------------------------- | ----------------------------- |
| Rust          | Rust `1.85+`           | `serde` derive / target type            | target type `T`               |
| Go            | Go `1.24+`             | reflection + struct tags                | output pointer                |
| Python        | Python `3.8+`          | Python dict/list + compiled extension   | schema string                 |
| Java / Kotlin | Java `21+`             | reflection + `Class<T>` / Kotlin helper | target class                  |
| Swift         | Swift tools `5.9+`     | `AsunValue` value model                 | built into binary payload     |
| C#            | `.NET 8+`              | `IAsunSchema` + factory                 | field names + types + factory |
| Dart          | Dart `3.0+`            | `AsunSchema` + factory                  | field names + types + factory |
| JS / TS       | ES2020-capable runtime | plain objects + runtime inference       | schema string                 |
| PHP           | PHP `8.4+`             | arrays via native extension             | schema argument               |
| C             | C11                    | explicit schema descriptor              | schema descriptor             |
| C++           | C++17                  | metadata macros on target type          | target type `T`               |
| Zig           | Zig `0.15.2+`          | comptime target type                    | target type `T` + allocator   |

Use the language guide pages for the exact install steps, minimal examples, and current implementation limits for each runtime.

## Tooling

- Read the [spec](/spec) for the canonical format definition.
- Use the VS Code extension for syntax highlighting and preview.
- Use the compatibility and benchmark pages when comparing implementations.
