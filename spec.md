# ASUN Specification

This page is the concise website specification for the current ASUN format used by the implementations in this repository.

For deeper detail, continue to:

- [Syntax Reference](/reference/syntax)
- [Data Types](/reference/data-types)
- [Schema & Data](/guide/schema-and-data)

## Core Shape

ASUN separates **schema** from **data**.

Single value:

```asun
{id@int, name@str, active@bool}:(1, Alice, true)
```

List of rows:

```asun
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

```asun
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

```asun
{id, name, active}
```

Quoted field names are required when a field name:

- contains spaces
- starts with digits
- contains syntax characters such as `{ } [ ] @ "`

```asun
{"id uuid"@int, "65"@bool, "{}[]@\""@str}
```

## Data Rules

Data is positional, not keyed. The first value matches the first field, the second value matches the second field, and so on.

Nested struct values are written as nested tuples:

```asun
{user@{id@int, name@str}}:((1, Alice))
```

Inline object literals in the data section are not part of the current format.

## Scalars

### `int`

```asun
42
-7
0
```

### `float`

```asun
3.14
-0.5
1e10
```

### `bool`

```asun
true
false
```

### null / optional

An empty slot means null / absent:

```asun
{id@int, label@str}:(1, )
```

## Strings

ASUN has two string forms.

Unquoted strings:

- work for simple values
- are trimmed at the outer edges
- should not contain reserved syntax characters

Quoted strings:

- preserve whitespace
- allow reserved characters
- support escapes such as `\"`, `\\`, `\n`, `\t`, and `\r`

Examples:

```asun
Alice
"Alice Smith"
"  padded  "
"value with, comma"
```

In schema, `@` is structural syntax. In data, `@` is ordinary content. To avoid ambiguity, values containing `@` should be quoted:

```asun
{name@str}:("@Alice")
```

## Comments

ASUN supports block comments:

```asun
/* user list */
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

Line comments are not part of the format.

## Binary Note

ASUN-BIN is not self-describing in the same way as text ASUN. In practice, binary decoding usually needs an external schema, target type, or matched field layout.

Use text ASUN when you want:

- human-readable payloads
- cross-language interchange
- schema carried in the payload

Use ASUN-BIN when you want:

- compact machine-oriented transport
- high-performance runtime-to-runtime exchange
- matched implementations on both sides
