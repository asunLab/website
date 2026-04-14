---
layout: home

hero:
  name: "ASUN"
  text: "Array-Schema Unified Notation"
  tagline: "Fewer tokens than JSON. Compact schema-first rows. Human-readable. LLM-native."
  image:
    src: /logo.svg
    alt: ASUN
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Why ASUN?
      link: /guide/why-asun
    - theme: alt
      text: View on GitHub
      link: https://github.com/asun-lab/asun

features:
  - icon: 🚀
    title: 65% Token Reduction
    details: Schema is declared once. Data rows carry only values, not repeated keys. Ideal for LLM context windows and lower API cost.
    link: /guide/why-asun
    linkText: See comparison

  - icon: ⚡
    title: Parsing That Scales
    details: ASUN removes repeated key matching and lets decoders follow schema order. Actual speedups depend on language, runtime, payload shape, and implementation maturity.
    link: /reference/performance
    linkText: Performance notes

  - icon: 🧠
    title: LLM-Native Design
    details: Row-oriented syntax with schema separation is easier for language models to generate and validate than repeated JSON objects.
    link: /guide/llm-integration
    linkText: LLM integration

  - icon: 📖
    title: Human-Readable
    details: Clean, compact syntax. Most strings do not need quotes. Lists read like tables instead of nested braces.
    link: /reference/syntax
    linkText: Syntax reference

  - icon: 🌐
    title: Multi-Language
    details: Official implementations cover Rust, Go, Python, Java / Kotlin, Swift, C, C++, Zig, C#, Dart, JS / TS, and PHP, with shared cross-language compatibility tests.
    link: /languages/rust
    linkText: Language guides

  - icon: 🔧
    title: Tooling and Spec
    details: Formal specification, syntax highlighting, editor tooling, and compatibility matrices keep implementations aligned.
    link: /spec
    linkText: Read the spec
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

Schema is written once. Each row after `:` is pure data. That is where most of ASUN's token and parsing advantage comes from.

## Quick Install

::: code-group

```toml [Rust]
[dependencies]
asun = "0.1"
serde = { version = "1", features = ["derive"] }
```

```bash [Go]
go get github.com/asun-lab/asun-go
```

```bash [Python]
cd asun-py
python3 -m pip install -e .
```

:::

## Performance

ASUN has a structural advantage over JSON on repeated, schema-shaped data, but the multiplier is not universal across languages.

- Native implementations usually show the strongest gains.
- Managed runtimes can still be highly competitive.
- Dynamic runtimes often benefit on repetitive rows, but less consistently.
- Small single-object payloads may show little or no win for text mode.

Use the [performance overview](/reference/performance) for the model, and [benchmark notes](/reference/benchmark-notes) for implementation-specific context.

</div>
