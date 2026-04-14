# JS / TS Guide

The JavaScript / TypeScript implementation works with plain objects and arrays and ships ES module, CommonJS, and TypeScript declaration output.

## Minimum Version

- Any ES2020-capable JavaScript runtime
- TypeScript consumers can use the bundled declaration files; the repository build currently uses TypeScript `5.7+`

## Implementation Model

- Text and binary encode infer schema from runtime values.
- Text decode reads the schema embedded in the text and returns plain objects or arrays.
- Binary decode requires an explicit schema string.

## Current Support

- `encode`, `encodeTyped`
- `encodePretty`, `encodePrettyTyped`
- `decode`
- `encodeBinary`, `decodeBinary`

## Example

```ts
import { encodeTyped, decode, encodeBinary, decodeBinary } from "asun-js";

const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
];

const text = encodeTyped(users);
const rows = decode(text);

const blob = encodeBinary(users);
const rows2 = decodeBinary(blob, "[{id@int,name@str,active@bool}]");
```

## Notes

- JS / TS only has one numeric runtime type, so `int` means “encoded as an integer-valued number”.
- `encode()` writes schema text without scalar hints. Use `encodeTyped()` if you need type-preserving `decode()`.
- Keyed data should use entry-list arrays.

## Build and Test

```bash
cd asun-js
npm install
npm test
npm run build
node examples/basic.js
node examples/bench.js
```
