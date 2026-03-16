# JS / TS 指南

JavaScript / TypeScript 版面向普通对象和数组工作，同时提供 ESM、CJS 和 TypeScript 声明输出。

## 最低版本

- 任意支持 ES2020 的 JavaScript 运行时
- TypeScript 使用者可直接使用包内声明文件；仓库当前构建使用 TypeScript `5.7+`

## 实现方式

- 文本与二进制编码都从运行时值自动推断 schema。
- 文本解码读取文本中内嵌的 schema，返回普通对象或数组。
- 二进制解码需要显式 schema 字符串。

## 当前支持

- `encode`、`encodeTyped`
- `encodePretty`、`encodePrettyTyped`
- `decode`
- `encodeBinary`、`decodeBinary`

## 示例

```ts
import { encodeTyped, decode, encodeBinary, decodeBinary } from 'ason-js';

const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
];

const text = encodeTyped(users);
const rows = decode(text);

const blob = encodeBinary(users);
const rows2 = decodeBinary(blob, '[{id@int,name@str,active@bool}]');
```

## 说明

- JS / TS 运行时只有一种 `number`，因此这里的 `int` 表示“按整数形式编码的 number”。
- `encode()` 输出无类型文本；如果你希望 `decode()` 保留原始数值 / 布尔类型，请使用 `encodeTyped()`。
- 键值集合请使用 entry-list 数组。

## 构建与测试

```bash
cd ason-js
npm install
npm test
npm run build
node examples/basic.js
node examples/bench.js
```
