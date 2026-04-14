# Zig Guide

The Zig implementation uses comptime type information instead of runtime reflection.

## Minimum Version

- Zig `0.15.2+`

## Implementation Model

- Schema generation is driven from the target type at comptime.
- Text and binary decode both require a target type `T` and an allocator.
- Binary decode can be zero-copy for some string data depending on the target shape.

## Current Support

- Compact text encode/decode
- Typed text encode/decode
- Binary encode/decode
- Structs, slices, optionals, nested structs, entry-list keyed collections

## Example

```zig
const User = struct {
    id: i64,
    name: []const u8,
    active: bool,
};

const typed = try asun.encodeTyped(User, .{
    .id = 1,
    .name = "Alice",
    .active = true,
}, allocator);

const restored = try asun.decode(User, typed, allocator);
```

## Notes

- Zig commonly maps ASUN `str` to `[]const u8`.
- Binary decode requires the target type because binary ASUN does not embed its schema.
- Use entry structs instead of any map-like field model.

## Build and Test

```bash
cd asun-zig
zig build test
zig build run-basic
zig build run-complex
zig build run-bench
```
