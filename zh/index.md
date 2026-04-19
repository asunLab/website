---
layout: home

hero:
  name: "ASUN"
  text: "数组模式对象符号"
  tagline: "比 JSON 更省 Token。Schema 只写一次。人类可读，也适合 LLM。"
  image:
    src: /logo.svg
    alt: ASUN
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/getting-started
    - theme: alt
      text: 为什么选择 ASUN？
      link: /zh/guide/why-asun
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/asunLab/asun

features:
  - icon: 🚀
    title: Token 更省
    details: Schema 只声明一次，数据行只保留值，不再重复 Key。非常适合 LLM 上下文和降低 API 成本。
    link: /zh/guide/why-asun
    linkText: 查看对比

  - icon: ⚡
    title: 解析模型更有优势
    details: ASUN 避免重复字段匹配，解析器可以按 schema 顺序工作。具体性能收益取决于语言、运行时、载荷形态和实现成熟度。
    link: /zh/reference/performance
    linkText: 性能说明

  - icon: 🧠
    title: 适合 LLM
    details: 行导向语法加 schema 分离，让模型更容易生成稳定的结构化输出，而不是一遍遍重复 JSON key。
    link: /zh/guide/llm-integration
    linkText: LLM 集成

  - icon: 📖
    title: 人类可读
    details: 语法紧凑，大多数字符串无需引号。列表读起来更像表格，而不是层层嵌套的大括号。
    link: /zh/reference/syntax
    linkText: 语法参考

  - icon: 🌐
    title: 多语言实现
    details: 官方实现覆盖 Rust、Go、Python、Java / Kotlin、Swift、C、C++、Zig、C#、Dart、JS / TS、PHP，并共享跨语言兼容性测试。
    link: /zh/languages/rust
    linkText: 语言指南

  - icon: 🔧
    title: 规范与工具
    details: 规范、语法高亮、编辑器工具和兼容性矩阵一起保证各语言实现保持一致。
    link: /zh/spec
    linkText: 查看规范
---

<div class="vp-doc" style="max-width:900px;margin:0 auto;padding:2rem 1.5rem">

## ASUN vs JSON

```json
{
  "users": [
    { "id": 1, "name": "Alice", "active": true },
    { "id": 2, "name": "Bob", "active": false },
    { "id": 3, "name": "Carol", "active": true }
  ]
}
```

```asun
[{id@int, name@str, active@bool}]:
  (1, Alice, true),
  (2, Bob,   false),
  (3, Carol, true)
```

Schema 只写一次，`:` 后面每一行都是纯数据。ASUN 的大部分 token 与解析优势，都来自这个结构设计。

## 快速安装

::: code-group

```toml [Rust]
[dependencies]
asun = "1.0"
serde = { version = "1", features = ["derive"] }
```

```bash [Go]
go get github.com/asunLab/asun-go
```

```bash [Python]
pip install asun
```

```bash [JS / TS]
npm install @athanx/asun
```

```bash [Java]
implementation 'io.asun:asun:1.0.0'
```

```swift [Swift]
// Package.swift
.package(url: "https://github.com/asunLab/asun-swift", from: "1.0.0")
```

```bash [C#]
dotnet add package Asun
```

```yaml [Dart]
# pubspec.yaml
dependencies:
  asun: ^1.0.0
```

```bash [PHP]
pecl install asun
```

```c [C]
// 头文件方式：引入 asun.h + 链接 asun.c
#include "asun.h"
```

```cmake [C++]
# 头文件方式或通过 Conan
find_package(asun-cpp REQUIRED)
```

```zig [Zig]
// build.zig.zon — 添加 asun 依赖
zig fetch https://github.com/asunLab/asun-zig/archive/v1.0.0.tar.gz --save
```

:::

## 性能说明

ASUN 相比 JSON 的结构优势是稳定的，但性能倍数不是所有语言都一样。

- 原生实现通常收益最大。
- 托管运行时也可能表现很强。
- 动态语言在重复结构数据上往往仍有明显收益，但不一定每次都领先。
- 对很小的单对象文本载荷，收益可能不明显。

先看 [性能概览](/zh/reference/performance)，再看 [benchmark notes](/zh/reference/benchmark-notes) 里的实现级说明。

</div>
