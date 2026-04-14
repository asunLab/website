# Rust 指南

Rust 版是仓库里最成熟的一条 ASUN 实现，也是最适合观察完整 API 形态的参考实现。

## 最低版本

- Rust `1.85+`
- `serde` + `derive`

## 实现方式

- 泛型编解码建立在 `serde::Serialize` 和 `serde::Deserialize` 之上。
- 文本与二进制解码都依赖目标类型 `T`。
- 美化输出和 typed 文本输出都是一等 API。

## 当前支持

- `encode`、`encode_typed`
- `encode_pretty`、`encode_pretty_typed`
- `decode`
- `encode_binary`、`decode_binary`
- 结构体、枚举、向量、可选值、嵌套数据、entry-list 键值集合

## 示例

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
    let text = encode_typed(&User {
        id: 1,
        name: "Alice".into(),
        active: true,
    })?;

    let restored: User = decode(&text)?;
    assert_eq!(restored.id, 1);
    Ok(())
}
```

## 说明

- Rust 宿主侧常用 `i64`、`f64`，但对外 ASUN schema 仍只有 `int`、`float`、`str`、`bool`。
- 二进制解码依赖目标类型，不需要额外 schema 字符串。
- 键值集合请显式建模成 entry struct。

## 构建与测试

```bash
cd asun-rs
cargo test
cargo run --release --example basic
cargo run --release --example complex
cargo run --release --example bench
```
