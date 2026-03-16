# Swift Guide

The Swift implementation uses a native `AsonValue` model instead of reflection or external schema descriptors.

## Minimum Version

- Swift tools `5.9+`
- Current package platforms: macOS `13+`, iOS `15+`

## Implementation Model

- Swift values are represented as `AsonValue`.
- Text decode reads the schema embedded in the text and returns `AsonValue`.
- The current binary API carries enough typed information to round-trip directly back into `AsonValue`, so it does not require an external schema string.

## Current Support

- `encode`
- `encodeTyped`
- `encodePretty`
- `encodePrettyTyped`
- `decode`
- `encodeBinary`
- `decodeBinary`

## Quick Use

```swift
import AsonSwift

let user: AsonValue = .object([
  "id": .int(1),
  "name": .string("Alice"),
  "active": .bool(true)
])

let text = try encodeTyped(user)
let parsed = try decode(text)

let bin = try encodeBinary(user)
let back = try decodeBinary(bin)
```

## Notes

- Swift currently works on the dynamic `AsonValue` model rather than host-type reflection.
- Schema names are still only `int`, `float`, `str`, and `bool`.
- Keyed data should be modeled as entry-list arrays.

## Build and Test

```bash
cd ason-swift
swift run basic
swift run complex
swift run cross_compat
swift run bench -c release
swift run run_tests
```
