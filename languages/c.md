# C Guide

The C implementation is the lowest-level ASUN runtime in the repository. It uses explicit schema descriptors and does not rely on reflection or code generation at runtime.

## Minimum Version

- C11
- No external runtime dependency beyond the C standard library

## Implementation Model

- You define an `AsunSchema` explicitly with field metadata.
- Text and binary encode/decode both use that schema descriptor.
- There is no native ASUN `map` type. Keyed collections should be modeled as arrays of entry structs.

## Current Support

- Compact text encode/decode
- Pretty text encode/decode
- Binary encode/decode
- Scalars, arrays, nested structs, struct arrays, optional / empty-slot values

Binary decode is not self-describing. You must pass the schema descriptor.

## Core API

```c
#include "asun.h"

AsunBuffer *asun_encode(const AsunSchema *schema, const void *data, size_t count);
AsunBuffer *asun_encode_pretty(const AsunSchema *schema, const void *data, size_t count);
int asun_decode(const char *text, const AsunSchema *schema, void *out, size_t *count);

AsunBuffer *asun_encode_bin(const AsunSchema *schema, const void *data, size_t count);
int asun_decode_bin(const uint8_t *data, size_t len,
                    const AsunSchema *schema, void *out, size_t *count);
```

## Example

```c
typedef struct {
    int64_t id;
    char name[64];
    bool active;
} User;

static const AsunField user_fields[] = {
    { "id",     ASUN_INT,  offsetof(User, id)     },
    { "name",   ASUN_STR,  offsetof(User, name)   },
    { "active", ASUN_BOOL, offsetof(User, active) },
};

static const AsunSchema user_schema = {
    .fields = user_fields,
    .field_count = 3,
    .struct_size = sizeof(User),
};
```

## Notes

- Schema names in text remain only `int`, `float`, `str`, and `bool`.
- C uses explicit descriptors because the language itself has no reflection layer.
- For keyed data, model `[{key@str,value@T}]` with an ordinary entry struct array.

## Build and Test

```bash
cd asun-c
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```
