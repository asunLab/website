# What is ASON?

ASON stands for **Array-Schema Object Notation**.

It is a serialization format built around one idea: declare schema once, then send rows as values only.

```ason
[{id@int, name@str, active@bool}]:
  (1, Alice, true),
  (2, Bob,   false),
  (3, Carol, true)
```

## Why It Exists

ASON is designed for workloads where JSON repeats the same field names over and over:

- LLM prompts and responses
- internal APIs that move repeated records
- caches and storage for structured rows
- logs and exports that are mostly table-shaped

## Two Formats

| Format | Best for |
|--------|----------|
| ASON text | human-readable exchange, LLMs, APIs |
| ASON-BIN | internal runtime-to-runtime performance |

## Core Properties

- schema and data are separated
- rows are compact and easy to scan
- text can be written with or without scalar hints
- binary encoding is available for runtime-local use
- official libraries share a common spec and compatibility matrix

## What to Expect

- significant token and payload savings on repeated rows
- better parsing characteristics than repeated-key JSON
- implementation-specific speedups rather than one universal multiplier

If you need the detailed comparison, continue to [Why ASON over JSON?](/guide/why-ason).
