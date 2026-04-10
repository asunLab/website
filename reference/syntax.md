# Syntax Reference

Complete reference for the current ASON text syntax.

## Document Shapes

Single row:

```ason
{id@int, name@str}:(1, Alice)
```

Multiple rows:

```ason
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

The schema appears before `:`. Data appears after `:` as one or more tuples.

## Schema

### Field syntax

```ason
{id, name, active}
{id@int, name@str, active@bool}
```

In text ASON, `@` is the field binding marker. Scalar hints are optional. When present, the only scalar names are:

- `int`
- `float`
- `str`
- `bool`

For complex fields, the same `@` marker is a required structural binding:

- `@{...}` nested struct
- `@[type]` array
- `@[{...}]` array of structs

Examples:

```ason
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[{key@str, value@str}]}
```

`id` and `id@int` are layout-equivalent, but `profile@{...}` and `tags@[...]` must keep `@` so the parser can see the nested structure boundary.

### Field names

Simple names may be unquoted:

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

## Data

Data is positional. Values follow schema order.

```ason
{id@int, name@str, active@bool}:(1, Alice, true)
```

For nested structs, data is written as nested tuples:

```ason
{user@{id@int, name@str}}:((1, Alice))
```

Inline object literals are not part of the current format.

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

### Unquoted strings

Unquoted strings are allowed for simple values:

```ason
Alice
hello world
```

Rules:

- outer whitespace is trimmed
- reserved syntax characters should be quoted instead
- if a value contains `@`, quote it to avoid confusion with schema syntax

```ason
{name@str}:("@Alice")
```

### Quoted strings

Use quotes when you need to preserve whitespace or include reserved characters:

```ason
"value with, comma"
"  leading spaces  "
"line\nbreak"
```

Supported escapes include `\"`, `\\`, `\n`, `\t`, and `\r`.

## Arrays

```ason
[{name@str, scores@[int]}]:
  (Alice, [90, 85, 92]),
  (Bob,   [76, 88])
```

Nested arrays are also allowed:

```ason
[{matrix@[[int]]}]:
  ([[1, 2], [3, 4]])
```

## Entry Lists

Write keyed collections as entry lists:

```ason
[{name@str, attrs@[{key@str, value@int}]}]:
  (Alice, [(age, 30), (score, 95)])
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

## Whitespace

- whitespace between structural tokens is ignored
- unquoted strings are trimmed at the outer edges
- pretty multi-line layout is recommended but not required
