# Rust Guide

Rust is the most mature ASON implementation in the repository and the best reference for the full API surface.

## Minimum Version

- Rust `1.85+`
- `serde` with `derive`

## Implementation Model

- Generic codecs are built on top of `serde::Serialize` and `serde::Deserialize`.
- Text and binary decode both use the target type `T`.
- Pretty and typed text output are first-class APIs.

## Current Support

- `encode`, `encode_typed`
- `encode_pretty`, `encode_pretty_typed`
- `decode`
- `encode_binary`, `decode_binary`
- Structs, enums, vectors, options, nested data, entry-list keyed collections

## Example

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

## Notes

- Rust uses host types such as `i64` and `f64`, but the ASON schema still only exposes `int`, `float`, `bool`, and `str`.
- Binary decode requires the target type, not a schema string.
- There is no standalone ASON map type; keyed collections should be explicit entry structs.

## Build and Test

```bash
cd ason-rs
cargo test
cargo run --release --example basic
cargo run --release --example complex
cargo run --release --example bench
```
