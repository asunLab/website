# Dart Guide

The Dart implementation uses an explicit `AsunSchema` interface and factory-based typed decode helpers.

## Minimum Version

- Dart `3.0+`

## Implementation Model

- User types implement `AsunSchema`.
- Text decode can return a field bag or use `decodeWith` / `decodeListWith` for typed values.
- Binary decode requires field names, field types, and a factory function.

## Current Support

- `encode`, `encodeTyped`
- `encodePretty`, `encodePrettyTyped`
- `decode`, `decodeWith`, `decodeListWith`
- `encodeBinary`, `decodeBinaryWith`, `decodeBinaryListWith`

## Example

```dart
class User implements AsunSchema {
  final int id;
  final String name;
  final bool active;

  User({required this.id, required this.name, required this.active});

  @override List<String> get fieldNames => ['id', 'name', 'active'];
  @override List<String?> get fieldTypes => ['int', 'str', 'bool'];
  @override List<dynamic> get fieldValues => [id, name, active];
}
```

## Notes

- `encodeTyped` is the better default when you want round-trip type preservation.
- Binary decode is schema-driven and therefore needs explicit field metadata plus a factory.
- Keyed collections should be modeled as entry-list arrays.

## Build and Test

```bash
cd asun-dart
dart analyze
dart test
dart run example/basic.dart
dart run example/bench.dart
```
