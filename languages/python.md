# Python Guide

The Python implementation is a compiled extension module that works with Python dicts, lists, and scalar values.

## Minimum Version

- Python `3.8+`
- Building from source currently requires a C++17-capable compiler such as `g++ 11+`

## Implementation Model

- Text encoding infers schema from Python values.
- `decode()` reads the schema carried by the text header and returns Python objects.
- `decodeBinary()` needs an explicit schema string because binary ASON is not self-describing.

## Current Support

- `encode`, `encodeTyped`
- `encodePretty`, `encodePrettyTyped`
- `decode`
- `encodeBinary`, `decodeBinary`

## Example

```python
import ason

users = [
    {"id": 1, "name": "Alice", "active": True},
    {"id": 2, "name": "Bob", "active": False},
]

typed = ason.encodeTyped(users)
restored = ason.decode(typed)

blob = ason.encodeBinary(users)
restored2 = ason.decodeBinary(blob, "[{id@int,name@str,active@bool}]")
```

## Notes

- `encode()` writes schema text without scalar hints; decoding that form returns string values because the text header does not carry those scalar hints.
- `encodeTyped()` is the safer default for type-preserving round-trips.
- Keyed collections should be modeled as entry lists.

## Build and Test

```bash
cd ason-py
python3 -m pip install -e .
python3 -m pytest tests -v
python3 examples/basic.py
python3 examples/complex.py
python3 examples/bench.py
```
