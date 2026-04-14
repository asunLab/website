# ASUN 是什么？

ASUN 的全称是 **Array-Schema Unified Notation**。

它围绕一个核心想法构建：schema 只声明一次，后续每一行只传值。

```asun
[{id@int, name@str, active@bool}]:
  (1, Alice, true),
  (2, Bob,   false),
  (3, Carol, true)
```

## 它为什么存在

ASUN 主要面向那些 JSON 会反复重复字段名的场景：

- LLM 提示词和响应
- 传输重复记录的内部 API
- 结构化行数据的缓存与存储
- 本质更像表格的日志与导出

## 两种格式

| 格式      | 更适合                   |
| --------- | ------------------------ |
| ASUN 文本 | 人类可读交换、LLM、API   |
| ASUN-BIN  | 同一运行时内部的性能路径 |

## 核心特性

- schema 与数据分离
- 行式结构紧凑且易读
- 同时支持 typed 与 untyped 文本
- 可选二进制编码用于运行时内场景
- 官方库共享统一规范和兼容性矩阵

## 你可以期待什么

- 在重复行数据上显著节省 token 和载荷
- 相比重复 key 的 JSON 具有更好的解析特征
- 具体速度收益取决于实现，而不是一个全局统一倍数

如果要看更详细的对比，继续阅读 [为什么选择 ASUN？](/zh/guide/why-asun)。
