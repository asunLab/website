# Data Types

Current ASUN schema names are intentionally small and fixed. The only scalar schema names are:

- `int`
- `float`
- `str`
- `bool`

## Scalar Types

| ASUN type        | Example                | Notes                                     |
| ---------------- | ---------------------- | ----------------------------------------- |
| `int`            | `42`, `-100`, `0`      | Any `i64`-range integer                   |
| `float`          | `3.14`, `-0.5`, `1e10` | Floating-point text form                  |
| `bool`           | `true`, `false`        | Lowercase only                            |
| `str` (unquoted) | `Alice Smith`          | Outer whitespace is trimmed               |
| `str` (quoted)   | `" spaces "`           | Preserves whitespace and supports escapes |
| null / None      | _(empty slot)_         | Empty between commas                      |

## Composite Types

### Nested Struct

```asun
{id@int, address@{city@str, zip@str}}:(
  1,
  (Berlin, 10115)
)
```

### Array / List

```asun
{id@int, tags@[str]}:(1, [rust, go, wasm])
```

Arrays can be nested:

```asun
[{matrix@[[int]]}]:
  ([[1, 2], [3, 4]]),
  ([[5, 6], [7, 8]])
```

### Entry List

Keyed collections use an array of entry structs:

```asun
{attrs@[{key@str, value@int}]}:([(age, 30), (score, 95)])
```

### Option / Nullable

An empty slot means `null` / `None`:

```asun
[{id@int, score@float}]:
  (1, 9.5),
  (2,    )
```

## Cross-Language Type Mapping

| ASUN type         | Rust              | Go                           | Python                         | Java / Kotlin               | Swift                           | C                                 | C++                             | Zig          | C#                                           | Dart                            | JS / TS              | PHP                                   |
| ----------------- | ----------------- | ---------------------------- | ------------------------------ | --------------------------- | ------------------------------- | --------------------------------- | ------------------------------- | ------------ | -------------------------------------------- | ------------------------------- | -------------------- | ------------------------------------- |
| `int`             | `i64`             | `int64`                      | `int`                          | `long` / `Long`             | `Int64`                         | `int64_t`                         | `int64_t`                       | `i64`        | `long`                                       | `int`                           | `number` (integer)   | `int`                                 |
| `float`           | `f64`             | `float64`                    | `float`                        | `double` / `Double`         | `Double`                        | `double`                          | `double`                        | `f64`        | `double`                                     | `double`                        | `number`             | `float`                               |
| `bool`            | `bool`            | `bool`                       | `bool`                         | `boolean` / `Boolean`       | `Bool`                          | `bool`                            | `bool`                          | `bool`       | `bool`                                       | `bool`                          | `boolean`            | `bool`                                |
| `str`             | `String` / `&str` | `string`                     | `str`                          | `String`                    | `String`                        | `char*` / buffer field            | `std::string`                   | `[]const u8` | `string`                                     | `String`                        | `string`             | `string`                              |
| null / empty slot | `Option<T>`       | `nil` / pointer / empty slot | `None`                         | nullable field / empty slot | `nil` / optional                | nullable pointer / empty slot     | `std::optional<T>` / empty slot | `?T`         | nullable reference / nullable value          | `null`                          | `null` / `undefined` | `null`                                |
| `[T]`             | `Vec<T>`          | `[]T`                        | `list`                         | `List<T>`                   | `[T]`                           | array / repeated rows with schema | `std::vector<T>`                | `[]T`        | `List<T>` / array                            | `List<T>`                       | `T[]`                | indexed array                         |
| nested struct     | `struct`          | `struct`                     | `dict` / object factory result | class / data class          | `AsunValue.object` / host model | `struct` + schema descriptor      | `struct` + metadata macros      | `struct`     | class / record implementing schema interface | class implementing `AsunSchema` | plain object         | associative array / object-like array |

### Notes

- ASUN schema names stay the same in every language: only `int`, `float`, `bool`, `str`.
- A host language may use a different concrete type name for the same ASUN scalar. For example, Java uses `double` for `float`, and Zig commonly maps `str` to `[]const u8`.
- JS / TS only has one numeric runtime type, so `int` means “a number that is encoded as an integer”.
- Keyed collections use entry lists such as `[{key@str,value@str}]`.

## Language Support Overview

| Language      | Minimum version                                     | Implementation style                                   | Text decode expects                          | Binary decode expects                       |
| ------------- | --------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------- | ------------------------------------------- |
| Rust          | Rust `1.85+`                                        | `serde`-based generic codec                            | target type `T`                              | target type `T`                             |
| Go            | Go `1.24+`                                          | reflection + struct tags                               | output pointer                               | output pointer                              |
| Python        | Python `3.8+`                                       | compiled C++ extension over Python dict/list values    | self-describing text, returns Python objects | explicit schema string                      |
| Java / Kotlin | Java `21+`, Kotlin helper layer on `1.9+` toolchain | reflection + annotations + class metadata              | target `Class<T>` or Kotlin reified helper   | target `Class<T>` / Kotlin reified helper   |
| Swift         | Swift tools `5.9+`                                  | native Swift value model around `AsunValue`            | self-describing text, returns `AsunValue`    | self-describing binary, returns `AsunValue` |
| C             | C11                                                 | explicit schema descriptors / macros                   | schema descriptor + output buffer            | schema descriptor + output buffer           |
| C++           | C++17                                               | template metadata macros (`ASUN_FIELDS`, `ASUN_TYPES`) | target type `T`                              | target type `T`                             |
| Zig           | Zig `0.15.2+`                                       | comptime type introspection                            | target type `T` + allocator                  | target type `T` + allocator                 |
| C#            | `.NET 8+` (`net8.0`, `net10.0`)                     | `IAsunSchema` + factory-based typed decode             | field bag or factory function                | field names + field types + factory         |
| Dart          | Dart `3.0+`                                         | `AsunSchema` interface + factory-based typed decode    | field bag or factory function                | field names + field types + factory         |
| JS / TS       | ES2020-capable runtime                              | runtime object inspection                              | self-describing text, returns plain objects  | explicit schema string                      |
| PHP           | PHP `8.4+`                                          | native C++ extension over arrays / zvals               | self-describing text, returns arrays         | explicit schema argument                    |

### Reading the matrix

- Text ASUN carries its schema in the header, so many dynamic-language implementations can decode it without an external type definition.
- Binary ASUN is intentionally not self-describing. Most implementations therefore need either:
  - a target type,
  - a schema descriptor,
  - or an explicit schema string.
- Swift is the main exception in the current repository: its binary API carries enough typed information to round-trip directly into `AsunValue`.
- “Implementation style” explains how each language maps host-language data to the common ASUN text and binary formats. The wire format stays the same across languages.

## Binary Note

ASUN-BIN may use fixed-width host-language primitives internally, but those widths are **not** extra schema names.

- The public schema still only uses `int`, `float`, `bool`, and `str`.
- Binary encoding is little-endian across the official implementations.
- Fixed-width storage details belong to the binary codec implementation, not to the schema surface.
