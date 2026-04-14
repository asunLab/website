# Dart 指南

Dart 版通过显式 `AsunSchema` 接口和 factory-based typed decode 工作。

## 最低版本

- Dart `3.0+`

## 实现方式

- 用户类型实现 `AsunSchema`。
- 文本解码既可以返回 field bag，也可以通过 `decodeWith` / `decodeListWith` 还原类型对象。
- 二进制解码需要字段名、字段类型和 factory 函数。

## 当前支持

- `encode`、`encodeTyped`
- `encodePretty`、`encodePrettyTyped`
- `decode`、`decodeWith`、`decodeListWith`
- `encodeBinary`、`decodeBinaryWith`、`decodeBinaryListWith`

## 示例

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

## 说明

- 如果希望 round-trip 保留类型，优先使用 `encodeTyped`。
- 二进制解码是 schema-driven 的，因此需要显式字段元数据和 factory。
- 键值集合请统一建模为 entry-list 数组。

## 构建与测试

```bash
cd asun-dart
dart analyze
dart test
dart run example/basic.dart
dart run example/bench.dart
```
