# Performance

ASUN has a structural performance advantage over JSON, but the multiplier depends on the implementation.

## What Usually Helps

ASUN parsers can:

- parse schema once
- decode rows by schema order
- avoid repeating key matching for every object
- reuse the same field layout across many rows

This tends to help most on:

- arrays of homogeneous structs
- repeated records with the same shape
- binary encoding inside one runtime
- larger payloads where repeated keys dominate

## What Varies by Language

The exact result depends on:

- language and runtime
- implementation maturity
- text vs binary mode
- flat vs nested payloads
- allocation strategy
- benchmark methodology

So this site does not treat performance as one universal number.

| Implementation style    | Typical outcome                             |
| ----------------------- | ------------------------------------------- |
| Native/system languages | Often the strongest gains                   |
| Managed runtimes        | Often strong on real workloads              |
| Dynamic runtimes        | Can still be competitive on repetitive rows |
| Less mature ports       | May lag until tuned                         |

## Practical Rules

- Text mode usually shines when you have repeated rows, not tiny one-off objects.
- Binary mode is usually best for internal services, caches, and storage.
- Token savings and payload reduction are more portable across languages than raw speed multipliers.
- A small single-object benchmark is not representative of list-heavy workloads.

## Rust Snapshot

Rust currently has the most mature benchmark set in this repo. On Apple M-series hardware, it shows:

- clear wins on repeated flat rows
- strong wins on binary encode/decode
- smaller gains on tiny text round-trips
- workload-dependent results on deep nesting

These numbers are useful, but they are still Rust-specific.

## Benchmark Notes

Use [benchmark notes](/reference/benchmark-notes) for language-by-language interpretation and publishing guidance for benchmark claims.

## Run Benchmarks

```bash
cd asun-rs && cargo run --release --example bench
cd asun-go && go test -bench=. -benchmem ./...
cd asun-c && cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build && ./build/examples/bench
```
