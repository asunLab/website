# Benchmark Notes

This page exists to keep performance claims precise.

## Read This Before Quoting Numbers

ASUN does not have one universal speed multiplier across all languages.

Use benchmark claims carefully:

- quote a language, not just "ASUN"
- say whether the result is text or binary
- say whether the payload is flat rows, deep nesting, or a tiny single object
- say whether the benchmark is throughput, latency, round-trip, encode only, or decode only

## What Usually Transfers Across Languages

- token savings on repeated rows
- smaller text payloads than repeated-key JSON
- better parsing shape for repeated schema-driven data
- binary mode usually outperforming text mode inside one runtime

## What Does Not Automatically Transfer

- Rust numbers do not automatically apply to Go, Java, Python, or other ports
- a native implementation does not predict a dynamic-runtime result
- a binary benchmark does not justify a text benchmark claim
- a large-array benchmark does not justify a tiny single-object claim

## Current Ecosystem Notes

| Language family | Notes                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| Rust            | Most mature benchmark set in this repo; best source for detailed snapshots   |
| Go              | Strong fit for repeated structs and service-style workloads                  |
| Java            | Good fit for managed-runtime structured data workloads                       |
| Python          | Benefits more from compact structure and schema reuse than from raw VM speed |
| C / C++ / Zig   | Good candidates for high-throughput native workloads                         |

## Recommended Wording

Good:

- "Rust shows strong decode wins on repeated rows."
- "Binary mode is usually the fastest path within one runtime."
- "Performance varies by language and payload shape."

Avoid:

- "ASUN is always 7x faster than JSON."
- "All language ports show the same parse speedup."
- "Binary numbers prove text-mode performance."

## Where to Look Next

- [Performance](/reference/performance)
- [Rust guide](/languages/rust)
- [Go guide](/languages/go)
- [Python guide](/languages/python)
