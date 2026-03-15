# C++ 指南

C++ 版是 header-only 实现，依靠编译期元数据宏而不是运行时反射。

## 最低版本

- C++17

## 实现方式

- 类型通过 `ASON_FIELDS(...)` 和 `ASON_TYPES(...)` 声明 schema 元数据。
- 文本与二进制解码都依赖目标类型 `T`。
- ASON 没有独立 `map` 类型；键值集合请用 entry struct + `std::vector`。

## 当前支持

- 紧凑文本编解码
- 美化文本编解码
- 二进制编解码
- `std::optional`、`std::vector`、嵌套结构体、结构体数组

二进制解码不是自描述的，因此通过 `decode_bin<T>(...)` 依赖目标类型。

## 核心 API

```cpp
#include "ason.hpp"

std::string encode(const T &value);
std::string encode_typed(const T &value);
std::string encode_pretty(const T &value);
std::string encode_pretty_typed(const T &value);

T decode<T>(std::string_view text);
std::vector<T> decode_vec<T>(std::string_view text);

std::vector<uint8_t> encode_bin(const T &value);
T decode_bin<T>(std::span<const uint8_t> data);
```

## 示例

```cpp
struct User {
    int64_t id;
    std::string name;
    bool active;

    ASON_FIELDS(id, name, active)
    ASON_TYPES("int", "str", "bool")
};
```

## 说明

- 对外 schema 仍然只使用 `int`、`float`、`str`、`bool`。
- 元数据宏是 C++ 宿主类型和公共 ASON wire format 之间的桥。
- 键值集合请显式建模成 entry type。

## 构建与测试

```bash
cd ason-cpp
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```
