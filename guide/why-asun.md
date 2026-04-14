# Why ASUN over JSON?

ASUN was built to solve real problems that JSON cannot solve without compromising on either readability or efficiency. This page provides a detailed comparison.

## 1. Token Efficiency

JSON repeats field names for every object in an array. With 1 000 rows and 5 fields, that's 5 000 redundant key strings flying across the wire (or into an LLM context window).

```json
// JSON — 100 tokens
{
  "users": [
    { "id": 1, "name": "Alice", "active": true },
    { "id": 2, "name": "Bob", "active": false }
  ]
}
```

```asun
// ASUN — ~35 tokens (65% reduction)
[{id@int, name@str, active@bool}]:
  (1, Alice, true),
  (2, Bob,   false)
```

### Measured savings across payload sizes

| Payload                            | JSON size | ASUN Text | ASUN-BIN  | Text savings |
| ---------------------------------- | --------- | --------- | --------- | ------------ |
| 1 000 flat structs (8 fields)      | 121 675 B | 56 716 B  | 74 454 B  | **53%**      |
| 100 deep nested structs (5 levels) | 438 112 B | 174 611 B | 225 434 B | **60%**      |

## 2. Parsing Advantage

### Zero Key-Hashing

JSON parsers must hash every field name and look it up in the target struct on every row. With 1 000 rows × 5 fields = 5 000 redundant hash operations.

ASUN parsers build a **positional index** once from the schema (`field 0 → id`, `field 1 → name`, …), then assign values by array index — `O(1)`, no hashing.

### Schema-Driven Parsing

JSON parsers dynamically infer types by peeking at the next character (`"`, `t`, `f`, `[`, `{`, digit). This causes CPU branch mispredictions.

ASUN parsers know field types from the schema: they can go straight to the expected parse path instead of rediscovering structure on every row.

### Performance Depends on the Implementation

The important point is not that every ASUN implementation has the same multiplier over JSON. They do not.

Actual results vary based on:

- language and runtime
- implementation maturity
- text vs binary format
- flat rows vs deeply nested payloads
- payload size
- allocation strategy
- benchmark methodology

What stays consistent across implementations is the model:

- the schema is parsed once
- rows carry only values
- decoding can follow schema order instead of rediscovering keys each time

In practice, that usually means:

| Implementation style                            | Typical outcome                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| Native/system languages (Rust, C, C++, Go, Zig) | Strongest speedups, especially on binary and large repeated rows         |
| Managed runtimes (Java, C#)                     | Usually strong results, often competitive with native for real workloads |
| VM/dynamic runtimes (JavaScript, Python)        | Can still be very competitive, especially on repetitive structured data  |
| Less mature ports                               | May lag until the parser and allocator paths are tuned                   |

So the website should treat performance as **implementation-specific** and **workload-specific**, not as one universal multiplier.

If you want hard numbers, show them per language guide or per benchmark page, not as a single site-wide parse claim.

## 3. LLM Output Quality

LLMs generating JSON frequently hallucinate mismatched braces, trailing commas, and incorrectly quoted strings. ASUN's syntax is more forgiving:

- Most string values are **unquoted** — the parser auto-trims whitespace
- Structure is **visually linear** — one tuple per line, aligned columns
- Schema is **declarative** — the model only needs to learn the header once per session

In practice this means fewer retries, fewer validation errors, and lower token cost per structured response.

## 4. Human Readability

Despite its compression, ASUN remains highly readable:

```asun
[{id@int, name@str, role@str, score@float}]:
  (1, Alice, admin,   9.5),
  (2, Bob,   viewer,  7.2),
  (3, Carol, editor,  8.8)
```

Columns line up naturally when padded. The schema acts as a header row — familiar to anyone who has read a CSV or a markdown table.

## 5. Comparison Table

| Feature           | JSON       | ASUN Text                                | ASUN-BIN        |
| ----------------- | ---------- | ---------------------------------------- | --------------- |
| Human-readable    | ✅         | ✅                                       | ❌              |
| Token-efficient   | ❌         | ✅                                       | N/A             |
| Schema separation | ❌         | ✅                                       | ✅              |
| Fast serialize    | ✗ baseline | Often better on repeated structured data | Often strongest |
| Fast deserialize  | ✗ baseline | Usually better when schema reuse matters | Often strongest |
| Zero-copy strings | ❌         | ❌                                       | ✅              |
| LLM-friendly      | ⚠️         | ✅                                       | ❌              |
| Universal tooling | ✅         | growing                                  | growing         |

## When to Keep JSON

ASUN is not a universal JSON replacement. Stick with JSON when:

- You need ad-hoc object structures (not arrays of uniform structs)
- You are integrating with external APIs that require JSON
- The overhead is irrelevant (tiny payloads, low frequency)

ASUN shines with **arrays of homogeneous structs** — which is the dominant pattern in data pipelines, LLM prompts, and internal service communication.
