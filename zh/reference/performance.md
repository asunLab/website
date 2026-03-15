# 性能概览

ASON 相比 JSON 有稳定的结构优势，但最终倍数取决于具体实现。

## 通常为什么会更快

ASON 解析器通常可以：

- schema 只解析一次
- 按 schema 顺序解码每一行
- 不再为每个对象重复做字段匹配
- 在多行之间复用同一套字段布局

这些优势在下面场景最明显：

- 同构结构体数组
- 大量重复记录
- 同一运行时内部的二进制编码
- 重复 key 占比较高的大载荷

## 为什么不同语言差异会很大

最终结果会受到这些因素影响：

- 语言与运行时
- 实现成熟度
- 文本还是二进制
- 平面结构还是深层嵌套
- 分配策略
- benchmark 方法

所以网站不再把性能写成一个全语言统一数字。

| 实现类型        | 常见表现                         |
| --------------- | -------------------------------- |
| 原生 / 系统语言 | 通常收益最大                     |
| 托管运行时      | 在真实负载里也常常很强           |
| 动态运行时      | 在重复结构数据上仍可能很有竞争力 |
| 还不成熟的实现  | 在继续调优前可能落后             |

## 实际判断规则

- 文本模式更适合重复行，不适合用极小单对象 benchmark 下结论。
- 二进制模式通常更适合内部服务、缓存和存储。
- Token 节省和载荷变小，比“固定多少倍更快”更容易跨语言成立。
- 单对象小 benchmark 并不能代表列表型真实负载。

## Rust 快照

Rust 目前在这个仓库里拥有最成熟的 benchmark 集。它在 Apple M 系列机器上通常表现为：

- 重复平面结构体有明显优势
- 二进制编解码优势很强
- 很小的文本 round-trip 收益较小
- 深层嵌套结果会随负载变化

## Benchmark Notes

更细的按语言说明和如何引用 benchmark 的建议，请看 [benchmark notes](/zh/reference/benchmark-notes)。

## 运行 benchmark

```bash
cd ason-rs && cargo run --release --example bench
cd ason-go && go test -bench=. -benchmem ./...
cd ason-c && cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build && ./build/examples/bench
```
