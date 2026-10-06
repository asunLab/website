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

Integers are LEB128 varints (signed ones zigzag-encoded first), floats are fixed-width little-endian, and strings and sequences are length-prefixed. See [SPEC §11](https://github.com/asunLab/asun/blob/main/docs/SPEC.md#11-asun-binary-format-specification) for the byte-level rules and the limits a decoder must enforce on untrusted input.

| Type                  | Encoding                                         |
| --------------------- | ------------------------------------------------ |
| `bool`                | 1 byte, `0x00` / `0x01`                          |
| `i8` / `u8`           | 1 raw byte                                       |
| `i16` / `i32` / `i64` | zigzag + varint                                  |
| `u16` / `u32` / `u64` | varint                                           |
| `f32` / `f64`         | 4 / 8 bytes LE                                   |
| `str` / `String`      | `[varint len][UTF-8 bytes]`                      |
| `Option<T>`           | `[0x00]` or `[0x01][payload]`                    |
| `Vec<T>`              | `[varint count][elements...]`                    |
| `struct`              | fields in declaration order                      |
| `enum` (Rust)         | `[varint variant index][fields...]`              |

Binary payloads are not self-describing in the same way as text ASUN. In practice, decoding usually needs:

- an explicit schema string
- a target type
- or a matched field layout on both sides

## Interoperability

ASUN-BIN is best treated as an implementation-local wire format. If different languages need to communicate, use ASUN text unless you have explicitly matched binary implementations.
