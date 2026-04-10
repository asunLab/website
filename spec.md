# ASON Specification

This page is the concise website specification for the current ASON format used by the implementations in this repository.

For deeper detail, continue to:

- [Syntax Reference](/reference/syntax)
- [Data Types](/reference/data-types)
- [Schema & Data](/guide/schema-and-data)

## Core Shape

ASON separates **schema** from **data**.

Single value:

```ason
{id@int, name@str, active@bool}:(1, Alice, true)
```

List of rows:

```ason
[{id@int, name@str, active@bool}]:
  (1, Alice, true),
  (2, Bob, false)
```

The schema is written once. Tuples after `:` follow schema order.

## Schema Rules

A field definition uses `@` as the field binding marker. A scalar field may be written as:

```text
name
name@type
```

For scalar fields, the only hint names are:

- `int`
- `float`
- `str`
- `bool`

For complex fields, the same `@` marker becomes a required structural binding:

- `@{...}` nested struct
- `@[type]` array
- `@[{...}]` array of structs

Examples:

```ason
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[{key@str, value@str}]}
```

Keyed collections use entry lists such as `[{key@str, value@str}]`.

In short:

- `id` and `id@int` have the same layout, but `@int` adds scalar type clarity
- `profile@{...}` and `tags@[...]` must keep `@` because it marks the nested structure boundary

## Field Names

Simple field names may be unquoted:

```ason
{id, name, active}
```

Quoted field names are required when a field name:

- contains spaces
- starts with digits
- contains syntax characters such as `{ } [ ] @ "`

```ason
{"id uuid"@int, "65"@bool, "{}[]@\""@str}
```

## Data Rules

Data is positional, not keyed. The first value matches the first field, the second value matches the second field, and so on.

Nested struct values are written as nested tuples:

```ason
{user@{id@int, name@str}}:((1, Alice))
```

Inline object literals in the data section are not part of the current format.

## Scalars

### `int`

```ason
42
-7
0
```

### `float`

```ason
3.14
-0.5
1e10
```

### `bool`

```ason
true
false
```

### null / optional

An empty slot means null / absent:

```ason
{id@int, label@str}:(1, )
```

## Strings

ASON has two string forms.

Unquoted strings:

- work for simple values
- are trimmed at the outer edges
- should not contain reserved syntax characters

Quoted strings:

- preserve whitespace
- allow reserved characters
- support escapes such as `\"`, `\\`, `\n`, `\t`, and `\r`

Examples:

```ason
Alice
"Alice Smith"
"  padded  "
"value with, comma"
```

In schema, `@` is structural syntax. In data, `@` is ordinary content. To avoid ambiguity, values containing `@` should be quoted:

```ason
{name@str}:("@Alice")
```

## Comments

ASON supports block comments:

```ason
/* user list */
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

Line comments are not part of the format.

## Binary Note

ASON-BIN is not self-describing in the same way as text ASON. In practice, binary decoding usually needs an external schema, target type, or matched field layout.

Use text ASON when you want:

- human-readable payloads
- cross-language interchange
- schema carried in the payload

Use ASON-BIN when you want:

- compact machine-oriented transport
- high-performance runtime-to-runtime exchange
- matched implementations on both sides
