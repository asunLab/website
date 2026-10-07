# Syntax Reference

Complete reference for the current ASUN text syntax.

## Document Shapes

ASUN text has four top-level shapes:

- schema object: `{schema}:(values)`
- schema object array: `[{schema}]:(values),(values)`
- plain array: `[value, value]`
- bare value: `value`

Single object:

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
- `@[K:V]` map; `K` is `str`, `int` or omitted, so `@[:]` is an untyped map

Examples:

```asun
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[str:int]}
```

`id` and `id@int` are layout-equivalent, but `profile@{...}`, `tags@[...]` and `attrs@[str:int]` must keep `@` so the parser can see the nested structure boundary.

### Field names

Simple names may be unquoted:

```asun
{id, name, active}
```

Bare field names may contain only ASCII letters, digits, and `_`. Digits may appear at the start.

Quoted field names are required when a field name:

- contains spaces
- contains `+`, `-`, `.`, or other punctuation
- contains syntax characters such as `{ } [ ] @ "`

```asun
{65@bool, "id uuid"@int, "a+b"@str, "{}[]@\""@str}
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
1.5e-3
-1.0E+100
```

Numbers follow the JSON number grammar. Floats require digits before the decimal point. If a decimal point is present, it must have at least one digit after it. Exponents use `e` or `E` with optional `+`/`-`. The integer part has no leading zeros.

These are plain strings, not numbers: `.5`, `5.`, `+5`, `1e`, `1e+`, `007`, `01.5`. Under an `@int` or `@float` hint they are errors.

### `bool`

```asun
true
false
```

### null / optional

Null is written `_`:

```asun
{id@int, label@str}:(1, _)
[1, _, 3]
```

Every position holds a value. A blank position (`(1, )`, `(,)`, `[1,,3]`) and a trailing comma are errors; `()` is a tuple with zero elements, used only by the empty schema `{}`. `"_"` is the string `_`, and `null` is not a keyword: unquoted, it is the string `"null"`. An array holding a single null is `[_]`.

## Strings

### Unquoted strings

Unquoted strings are allowed for simple values:

```asun
Alice
hello world
```

Rules:

- outer whitespace is trimmed
- raw `, ( ) [ ] { } " \` and control characters are not allowed
- raw `:`, `@`, `/`, `*`, `<`, and `>` are allowed, but `/*` starts a block comment
- there are no escapes outside quotes: quote any value that needs a reserved character

```asun
{path@str}:(path/to/file)
{name@str, email@str, url@str}:(@Alice, alice@example.com, https://a.com/x)
```

### Quoted strings

Use quotes when you need to preserve whitespace or include reserved characters:

```asun
"value with, comma"
"  leading spaces  "
"line\nbreak"
```

Quoted strings are JSON strings: `"`, `\` and control characters (U+0000–U+001F) must be escaped. Supported escapes are `\"`, `\\`, `\/`, `\n`, `\t`, `\r`, `\b`, `\f`, and `\uXXXX` (surrogate pairs combine; a lone surrogate is an error). Any other escape, such as `\,` or `\(`, is an error. Structural characters need no escape inside quotes.

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

## Maps

A map field is declared as `@[K:V]` and written as `key:value` entries:

```asun
[{name@str, attrs@[str:int]}]:
  (Alice, [age:30, score:95]),
  (Bob,   [])
```

| Schema          | Data                   |
| --------------- | ---------------------- |
| `m@[str:int]`   | `[a:1, b:2]`           |
| `m@[int:str]`   | `[1:one, 2:two]`       |
| `m@[str:{x,y}]` | `[a:(1,2), b:(3,4)]`   |
| `m@[str:[int]]` | `[a:[1,2], b:[]]`      |
| `m@[:]`         | `[a:1, b:x]`           |

Rules:

- a value is a map only when its binding is `@[K:V]`; elsewhere `[a:1]` is an array holding the string `a:1`
- keys are strings or integers, never `_`, booleans or floats
- the first `:` ends the key: quote a key that contains `:` (`["12:30":5]`); values may contain `:` (`[start:12:30]`)
- duplicate keys are an error; `[]` is the empty map
- a map is never a top-level value

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

## Whitespace

- whitespace between structural tokens is ignored
- unquoted strings are trimmed at the outer edges
- pretty multi-line layout is recommended but not required
