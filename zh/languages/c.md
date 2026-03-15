# C 指南

C 版是仓库里最底层的 ASON 实现。它依赖显式 schema 描述符，不使用运行时反射。

## 最低版本

- C11
- 除 C 标准库外无额外运行时依赖

## 实现方式

- 由你显式定义 `AsonSchema` 和字段元数据。
- 文本与二进制编解码都依赖同一份 schema 描述符。
- ASON 不再提供原生 `map` 类型；键值集合请建模为 entry struct 数组。

## 当前支持

- 紧凑文本编解码
- 美化文本编解码
- 二进制编解码
- 标量、数组、嵌套结构体、结构体数组、可空 / 空槽值

二进制解码不是自描述的，因此必须传入 schema 描述符。

## 核心 API

```c
#include "ason.h"

AsonBuffer *ason_encode(const AsonSchema *schema, const void *data, size_t count);
AsonBuffer *ason_encode_pretty(const AsonSchema *schema, const void *data, size_t count);
int ason_decode(const char *text, const AsonSchema *schema, void *out, size_t *count);

AsonBuffer *ason_encode_bin(const AsonSchema *schema, const void *data, size_t count);
int ason_decode_bin(const uint8_t *data, size_t len,
                    const AsonSchema *schema, void *out, size_t *count);
```

## 示例

```c
typedef struct {
    int64_t id;
    char name[64];
    bool active;
} User;

static const AsonField user_fields[] = {
    { "id",     ASON_INT,  offsetof(User, id)     },
    { "name",   ASON_STR,  offsetof(User, name)   },
    { "active", ASON_BOOL, offsetof(User, active) },
};
```

## 说明

- 对外 schema 名仍然只有 `int`、`float`、`str`、`bool`。
- C 之所以使用显式描述符，是因为语言本身没有反射层。
- 键值集合请用 entry struct 数组表示，例如 `[{key@str,value@T}]`。

## 构建与测试

```bash
cd ason-c
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
ctest --test-dir build --output-on-failure
```
