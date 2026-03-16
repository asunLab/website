# Schema & Data

The most important ASON idea is that **schema** describes structure once, and **data** only supplies ordered values.

## The Split

Schema:

```ason
{name@str, age@int, active@bool}
```

Data:

```ason
(Alice, 30, true)
```

Combined:

```ason
{name@str, age@int, active@bool}:(Alice, 30, true)
```

For a list, write the schema once and then multiple tuples:

```ason
[{name@str, age@int}]:
  (Alice, 30),
  (Bob,   25)
```

## Schema Rules

Each field is either:

```text
name
name@type
```

Scalar schema types are only:

- `int`
- `float`
- `str`
- `bool`

Structured types use `@` plus structure:

- `@{...}` nested struct
- `@[type]` array
- `@[{...}]` array of structs

Examples:

```ason
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[{key@str, value@str}]}
```

## Field Names

Plain field names work for simple identifiers:

```ason
{id, name, active}
```

Quoted field names are required when a field name contains spaces, starts with digits, or contains syntax characters:

```ason
{"id uuid"@int, "65"@bool, "{}[]@\""@str}
```

## Data Rules

Data is positional, not keyed. The first value matches the first field, the second value matches the second field, and so on.

Nested struct data uses nested tuples:

```ason
{address@{city@str, zip@str}}:((Berlin, 10115))
```

Arrays use square brackets:

```ason
{tags@[str]}:([rust, go, zig])
```

An empty slot represents null / missing:

```ason
{id@int, score@float}:(1, )
```

## What ASON Does Not Do

Current ASON text does **not** use inline object literals in the data section:

```ason
{user@{id@int}}:({id: 1})   // not current ASON
```

Write key-value collections as entry lists:

```ason
{attrs@[{key@str, value@str}]}:([(lang, zig), (tier, prod)])
```

## Short Grammar Summary

```text
single   = schema ":" tuple
slice    = "[" schema "]" ":" rows
schema   = "{" fields "}"
field    = name ["@" type]
type     = "int" | "float" | "str" | "bool" | schema | "[" type "]"
rows     = tuple ("," tuple)*
tuple    = "(" values ")"
values   = value ("," value)*
value    = scalar | tuple | "[" values "]" | ""
```

See the full [Syntax Reference](/reference/syntax) for string, escaping, whitespace, and comment rules.
