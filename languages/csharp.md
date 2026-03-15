# C# Guide

The .NET implementation uses an explicit schema interface plus factory-based typed decode helpers.

## Minimum Version

- `.NET 8+`
- The package currently targets `net8.0` and `net10.0`

## Implementation Model

- Types can implement `IAsonSchema` to expose field names, field types, and field values.
- Text decode can return a field bag or use a factory function for typed objects.
- Binary decode requires field names, field types, and a factory because binary ASON is not self-describing.

## Current Support

- `Ason.encode`, `Ason.encodeTyped`
- `Ason.encodePretty`, `Ason.encodePrettyTyped`
- `Ason.decode`, `Ason.decodeWith`, `Ason.decodeListWith`
- `Ason.encodeBinary`, `Ason.decodeBinaryWith`

## Example

```csharp
record User(long Id, string Name, bool Active) : IAsonSchema
{
    static readonly string[] Names = ["id", "name", "active"];
    static readonly string?[] Types = ["int", "str", "bool"];

    public ReadOnlySpan<string> FieldNames => Names;
    public ReadOnlySpan<string?> FieldTypes => Types;
    public object?[] FieldValues => [Id, Name, Active];
}
```

## Notes

- Schema names remain only `int`, `float`, `str`, and `bool`.
- Use entry-list arrays for keyed data, not `Dictionary<K, V>` as a schema type.
- The runtime is optimized for spans, pooled buffers, and binary primitives, but the public format stays aligned with the repository-wide spec.

## Build and Test

```bash
cd ason-cs
dotnet test tests/Ason.Tests/Ason.Tests.csproj -f net10.0
dotnet run --project examples/Basic/Ason.Examples.Basic.csproj -f net10.0
dotnet run --project examples/Bench/Ason.Examples.Bench.csproj -f net10.0
```
