# Swift 指南

Swift 版采用原生 `AsunValue` 值模型，而不是反射或外部 schema 描述符。

## 最低版本

- Swift tools `5.9+`
- 当前包平台：macOS `13+`、iOS `15+`

## 实现方式

- Swift 侧的数据通过 `AsunValue` 表达。
- 文本解码读取文本里内嵌的 schema，并返回 `AsunValue`。
- 当前 binary API 会携带足够的 typed 信息，因此可以直接 round-trip 回 `AsunValue`，不需要额外 schema 字符串。

## 当前支持

- `encode`
- `encodeTyped`
- `encodePretty`
- `encodePrettyTyped`
- `decode`
- `encodeBinary`
- `decodeBinary`

## 快速使用

```swift
import AsunSwift

let user: AsunValue = .object([
  "id": .int(1),
  "name": .string("Alice"),
  "active": .bool(true)
])

let text = try encodeTyped(user)
let parsed = try decode(text)

let bin = try encodeBinary(user)
let back = try decodeBinary(bin)
```

## 说明

- Swift 当前主要工作在动态 `AsunValue` 模型上，而不是宿主类型反射。
- 对外 schema 名仍然只有 `int`、`float`、`str`、`bool`。
- 键值集合请统一使用 entry-list 数组。

## 构建与测试

```bash
cd asun-swift
swift run basic
swift run complex
swift run cross_compat
swift run bench -c release
swift run run_tests
```
