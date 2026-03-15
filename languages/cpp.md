# C++ Guide

The C++ implementation is header-only and builds on compile-time metadata macros rather than runtime reflection.

## Minimum Version

- C++17

## Implementation Model

- Types declare schema metadata with `ASON_FIELDS(...)` and `ASON_TYPES(...)`.
- Text and binary decode both use the target type `T`.
- There is no standalone ASON `map` type. Use entry structs plus `std::vector`.

## Current Support

- Compact text encode/decode
- Pretty text encode/decode
- Binary encode/decode
- `std::optional`, `std::vector`, nested structs, struct arrays

Binary decode is not self-describing. You decode into a target type such as `decode_bin<T>(...)`.

## Core API

```cpp
#include "ason.hpp"

std::string encode(const T &value);
std::string encode_typed(const T &value);
std::string encode_pretty(const T &value);
std::string encode_pretty_typed(const T &value);

T decode<T>(std::string_view text);
std::vector<T> decode_vec<T>(std::string_view text);

std::vector<uint8_t> encode_bin(const T &value);
T decode_bin<T>(std::span<const uint8_t> data);
```

## Example

```cpp
struct User {
    int64_t id;
    std::string name;
    bool active;

    ASON_FIELDS(id, name, active)
    ASON_TYPES("int", "str", "bool")
};
```

## Notes

- The public schema surface still only uses `int`, `float`, `str`, and `bool`.
- C++ metadata macros are the bridge between host types and common ASON wire format.
- For keyed data, use an entry type such as `struct Attr { std::string key; int64_t value; };`.

## Build and Test

```bash
cd ason-cpp
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```
