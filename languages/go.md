# Go Guide

The Go implementation uses reflection and struct tags to map Go structs and slices to ASON text and binary formats.

## Minimum Version

- Go `1.24+`

## Implementation Model

- Struct fields use `ason:"name"` tags, with `json` tag fallback.
- Text decode writes into an output pointer.
- Binary decode also writes into an output pointer, because the binary format is not self-describing.

## Current Support

- `Encode`, `EncodeTyped`
- `EncodePretty`, `EncodePrettyTyped`
- `Decode`
- `EncodeBinary`, `DecodeBinary`
- Nested structs, slices, optional / empty-slot fields, entry-list modeling for keyed data

## Example

```go
type User struct {
    ID     int64  `ason:"id"`
    Name   string `ason:"name"`
    Active bool   `ason:"active"`
}

users := []User{
    {ID: 1, Name: "Alice", Active: true},
    {ID: 2, Name: "Bob", Active: false},
}

text, _ := ason.EncodeTyped(users)

var out []User
_ = ason.Decode(text, &out)
```

## Notes

- Use `EncodeTyped` when you want `Decode` to restore numeric and boolean types directly.
- Use entry structs instead of maps, for example `[]EnvEntry` with `key` and `value` fields.
- Binary decode requires only the output value, because Go reflection uses the target type as the schema plan.

## Build and Test

```bash
cd ason-go
go test ./...
go run ./examples/basic
go run ./examples/complex
go run ./examples/bench
```
