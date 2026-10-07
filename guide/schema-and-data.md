# Schema & Data

The most important ASUN idea is that **schema** describes structure once, and **data** only supplies ordered values.

## The Split

Schema:

```asun
{name@str, age@int, active@bool}
```

Data:

```asun
(Alice, 30, true)
```

Combined:

```asun
{name@str, age@int, active@bool}:(Alice, 30, true)
```

For a list, write the schema once and then multiple tuples:

```asun
[{name@str, age@int}]:
  (Alice, 30),
  (Bob,   25)
```

## Schema Rules

Each field uses `@` as the field binding marker. A scalar field may be written as:

```text
name
name@type
```

Scalar hint names are only:

- `int`
- `float`
- `str`
- `bool`

Complex fields use the same `@` as a required structural binding:

- `@{...}` nested struct
- `@[type]` array
- `@[{...}]` array of structs
- `@[K:V]` map

Examples:

```asun
{profile@{id@int, name@str}}
{tags@[str]}
{attrs@[str:str]}
```

This means:

- `name` and `name@str` produce the same structural layout
- `address@{...}`, `tags@[...]` and `attrs@[str:str]` cannot drop `@`, because it binds the field to the nested schema

## Field Names

Plain field names contain only ASCII letters, digits, and `_`:

```asun
{id, name, active, 65}
```

Quoted field names are required when a field name contains spaces, `+`, `-`, `.`, or syntax characters:

```asun
{"id uuid"@int, "a+b"@str, "{}[]@\""@str}
```

## Data Rules

Data is positional, not keyed. The first value matches the first field, the second value matches the second field, and so on.

Nested struct data uses nested tuples:

```asun
{address@{city@str, zip@str}}:((Berlin, 10115))
```

Arrays use square brackets:

```asun
{tags@[str]}:([rust, go, zig])
```

Maps use `key:value` entries:

```asun
{attrs@[str:str]}:([lang:zig, tier:prod])
```

`_` represents null:

```asun
{id@int, score@float}:(1, _)
[1, _, 3]
```

Every position holds a value: blank positions such as `(1, )` or `[1,,3]` and trailing commas are errors. `"_"` is the string `_`; decoders also accept the keyword `null`. An array holding a single null is `[_]`.

## What ASUN Does Not Do

Current ASUN text does **not** use inline object literals in the data section:

```asun
{user@{id@int}}:({id: 1})   /* not current ASUN */
```

Key-value collections are maps declared in the schema, not objects in the data:

```asun
{attrs@[str:str]}:([lang:zig, tier:prod])
```

There are no blank positions and no backslash escapes outside quotes:

```asun
{a@int, b@str}:(1, )        /* not current ASUN: write (1, _) */
{a@str}:(x\,y)              /* not current ASUN: write ("x,y") */
```

## Short Grammar Summary

```text
single   = schema ":" tuple
slice    = "[" schema "]" ":" rows
schema   = "{" fields "}"
field    = name ["@" type]
type     = "int" | "float" | "str" | "bool" | schema
         | "[" type "]"                    /* array */
         | "[" [keytype] ":" [type] "]"    /* map   */
rows     = tuple ("," tuple)*
tuple    = "(" [values] ")"
values   = value ("," value)*
value    = scalar | "_" | tuple | "[" [values] "]" | "[" entries "]"
entries  = key ":" value ("," key ":" value)*
```

See the full [Syntax Reference](/reference/syntax) for string, escaping, whitespace, and comment rules.
