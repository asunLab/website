# ASUN Specification

This page is the concise website specification for the current ASUN format used by the implementations in this repository.

For deeper detail, continue to:

- [Syntax Reference](/reference/syntax)
- [Data Types](/reference/data-types)
- [Schema & Data](/guide/schema-and-data)

## Core Shape

ASUN separates **schema** from **data**.

The text format also permits plain arrays and bare scalar values for schema-less dynamic data, but schema objects and schema object arrays are the primary interchange form.

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

Bare field names may contain only ASCII letters, digits, and `_`; digits are allowed at the start.

Quoted field names are required when a field name:

- contains spaces
- contains `+`, `-`, `.`, or other punctuation
- contains syntax characters such as `{ } [ ] @ "`

```asun
{65@bool, "id uuid"@int, "a+b"@str, "{}[]@\""@str}
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
1.5e-3
```

Tokens such as `.5`, `5.`, `+5`, `1e`, and `1e+` are strings, not numbers.

### `bool`

```asun
true
false
```

### null / optional

An empty slot inside a tuple or array means null / absent:

```asun
{id@int, label@str}:(1, )
```

A comma is a pure separator: `n` commas make `n + 1` slots, so a final comma adds a null. `(a,b,)` has three values and `(,)` has two nulls. `null` is also a keyword (`"null"` is the string). An array holding a single null is written `[null]`, because `[]` is empty.

## Strings

ASUN has two string forms.

Unquoted strings:

- work for simple values
- are trimmed at the outer edges
- may contain raw `:`, `@`, `/`, `*`, `<`, and `>` (`alice@example.com`, `12:30`, `https://a.com`)
- must not contain raw `, ( ) [ ] { } " \` or control characters
- treat `/*` as a block comment opener, not as string content

Quoted strings:

- preserve whitespace
- allow reserved characters
- follow JSON rules: `"`, `\` and control characters must be escaped
- support escapes such as `\"`, `\\`, `\/`, `\n`, `\t`, `\r`, `\b`, `\f`, structural escapes, and `\uXXXX`

Examples:

```asun
Alice
"Alice Smith"
"  padded  "
"value with, comma"
```

In schema, `@` is structural syntax. In data, `@` and `:` are ordinary characters:

```asun
{name@str, email@str, at@str}:(@Alice, alice@example.com, 12:30)
```

Keywords (`true`, `false`, `null`) and type names (`int`, `float`, `str`, `bool`) are case-sensitive: `TRUE` is a string and `@INT` is an error.

## Comments

ASUN supports block comments wherever optional whitespace is allowed:

```asun
/* user list */
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

Line comments are not part of the format.

Comments are layout, like whitespace: they may appear between any two tokens, including inside tuples and arrays, but never inside a quoted string, plain string, number or keyword. Outside quotes, `/*` always opens a comment, so `(x /* note */)` is the string `x`.

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
