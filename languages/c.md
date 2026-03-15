# C Guide

The C implementation is the lowest-level ASON runtime in the repository. It uses explicit schema descriptors and does not rely on reflection or code generation at runtime.

## Minimum Version

- C11
- No external runtime dependency beyond the C standard library

## Implementation Model

- You define an `AsonSchema` explicitly with field metadata.
- Text and binary encode/decode both use that schema descriptor.
- There is no native ASON `map` type. Keyed collections should be modeled as arrays of entry structs.

## Current Support

- Compact text encode/decode
- Pretty text encode/decode
- Binary encode/decode
- Scalars, arrays, nested structs, struct arrays, optional / empty-slot values

Binary decode is not self-describing. You must pass the schema descriptor.

## Core API

```c
#include "ason.h"

AsonBuffer *ason_encode(const AsonSchema *schema, const void *data, size_t count);
AsonBuffer *ason_encode_pretty(const AsonSchema *schema, const void *data, size_t count);
int ason_decode(const char *text, const AsonSchema *schema, void *out, size_t *count);

AsonBuffer *ason_encode_bin(const AsonSchema *schema, const void *data, size_t count);
int ason_decode_bin(const uint8_t *data, size_t len,
                    const AsonSchema *schema, void *out, size_t *count);
```

## Example

```c
typedef struct {
    int64_t id;
    char name[64];
    bool active;
} User;

static const AsonField user_fields[] = {
    { "id",     ASON_INT,  offsetof(User, id)     },
    { "name",   ASON_STR,  offsetof(User, name)   },
    { "active", ASON_BOOL, offsetof(User, active) },
};

static const AsonSchema user_schema = {
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
cd ason-c
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```
