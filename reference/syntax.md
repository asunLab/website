# Syntax Reference

Complete reference for the current ASUN text syntax.

## Document Shapes

Single row:

```asun
{id@int, name@str}:(1, Alice)
```

Multiple rows:

```asun
[{id@int, name@str}]:
  (1, Alice),
  (2, Bob)
```

The schema appears before `:`. Data appears after `:` as one or more tuples.

## Schema

### Field syntax

```asun
{id, name, active}
{id@int, name@str, active@bool}
```

In text ASUN, `@` is the field binding marker. Scalar hints are optional. When present, the only scalar names are:

- `int`
- `float`
- `str`
- `bool`

For complex fields, the same `@` marker is a required structural binding:

- `@{...}` nested struct
- `@[type]` array
- `@[{...}]` array of structs

Examples:

```asun
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[{key@str, value@str}]}
```

`id` and `id@int` are layout-equivalent, but `profile@{...}` and `tags@[...]` must keep `@` so the parser can see the nested structure boundary.

### Field names

Simple names may be unquoted:

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

## Data

Data is positional. Values follow schema order.

```asun
{id@int, name@str, active@bool}:(1, Alice, true)
```

For nested structs, data is written as nested tuples:

```asun
{user@{id@int, name@str}}:((1, Alice))
```

Inline object literals are not part of the current format.

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

### Unquoted strings

Unquoted strings are allowed for simple values:

```asun
Alice
hello world
```

Rules:

- outer whitespace is trimmed
- reserved syntax characters should be quoted instead
- if a value contains `@`, quote it to avoid confusion with schema syntax

```asun
{name@str}:("@Alice")
```

### Quoted strings

Use quotes when you need to preserve whitespace or include reserved characters:

```asun
"value with, comma"
"  leading spaces  "
"line\nbreak"
```

Supported escapes include `\"`, `\\`, `\n`, `\t`, and `\r`.

## Arrays

```asun
[{name@str, scores@[int]}]:
  (Alice, [90, 85, 92]),
  (Bob,   [76, 88])
```

Nested arrays are also allowed:

```asun
[{matrix@[[int]]}]:
  ([[1, 2], [3, 4]])
```

## Entry Lists

Write keyed collections as entry lists:

```asun
[{name@str, attrs@[{key@str, value@int}]}]:
  (Alice, [(age, 30), (score, 95)])
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

## Whitespace

- whitespace between structural tokens is ignored
- unquoted strings are trimmed at the outer edges
- pretty multi-line layout is recommended but not required
