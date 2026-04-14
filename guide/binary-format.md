# Binary Format (ASUN-BIN)

ASUN-BIN is the binary companion to ASUN text. It targets internal service communication, caches, and storage where readability is no longer required.

## When to Use It

| Scenario                     | Recommended format |
| ---------------------------- | ------------------ |
| LLM prompts and responses    | ASUN text          |
| Human-readable files or logs | ASUN text          |
| Internal service boundaries  | ASUN-BIN           |
| Cache values                 | ASUN-BIN           |
| Disk snapshots               | ASUN-BIN           |

## What It Optimizes For

- compact typed representation
- stable field order
- fast encode and decode in one runtime
- less text parsing work

## Performance Notes

Binary mode is usually where ASUN shows its strongest speed profile, but the result is still implementation-specific.

- Rust currently has the most mature binary benchmark set.
- Native implementations usually benefit the most.
- Cross-language interchange should still prefer ASUN text.

For implementation-level notes, see [benchmark notes](/reference/benchmark-notes).

## Wire Model

All integers are little-endian. Strings are length-prefixed.

| Type             | Encoding                   |
| ---------------- | -------------------------- |
| `bool`           | 1 byte                     |
| `i8` / `u8`      | 1 byte                     |
| `i16` / `u16`    | 2 bytes LE                 |
| `i32` / `u32`    | 4 bytes LE                 |
| `i64` / `u64`    | 8 bytes LE                 |
| `f32`            | 4 bytes LE                 |
| `f64`            | 8 bytes LE                 |
| `str` / `String` | `[u32 len][UTF-8 bytes]`   |
| `Option<T>`      | `[tag][payload]`           |
| `Vec<T>`         | `[u32 count][elements...]` |
| `struct`         | fields in schema order     |

Binary payloads are not self-describing in the same way as text ASUN. In practice, decoding usually needs:

- an explicit schema string
- a target type
- or a matched field layout on both sides

## Interoperability

ASUN-BIN is best treated as an implementation-local wire format. If different languages need to communicate, use ASUN text unless you have explicitly matched binary implementations.
