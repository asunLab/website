# Python 指南

Python 版是一个编译扩展模块，直接面向 Python 的 dict、list 和标量值工作。

## 最低版本

- Python `3.8+`
- 从源码构建时当前需要 C++17 编译器，例如 `g++ 11+`

## 实现方式

- 文本编码会从 Python 值自动推断 schema。
- `decode()` 读取文本 header 里的 schema，并返回 Python 对象。
- `decodeBinary()` 需要显式 schema 字符串，因为二进制 ASON 不是自描述的。

## 当前支持

- `encode`、`encodeTyped`
- `encodePretty`、`encodePrettyTyped`
- `decode`
- `encodeBinary`、`decodeBinary`

## 示例

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

## 说明

- `encode()` 输出无类型文本；解码这种形式时，标量值会按字符串返回。
- 如果你需要类型保真的 round-trip，优先使用 `encodeTyped()`。
- 键值集合请用 entry-list，不要把宿主语言 `dict` 理解成 ASON 的独立 map 类型。

## 构建与测试

```bash
cd ason-py
python3 -m pip install -e .
python3 -m pytest tests -v
python3 examples/basic.py
python3 examples/complex.py
python3 examples/bench.py
```
