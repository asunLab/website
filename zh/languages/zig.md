# Zig 指南

Zig 版依赖 comptime 类型信息，而不是运行时反射。

## 最低版本

- Zig `0.15.2+`

## 实现方式

- schema 由目标类型在 comptime 阶段生成。
- 文本与二进制解码都需要目标类型 `T` 和 allocator。
- 对某些字符串数据，binary decode 可以做到零拷贝。

## 当前支持

- 紧凑文本编解码
- typed 文本编解码
- 二进制编解码
- 结构体、切片、可选值、嵌套结构体、entry-list 键值集合

## 示例

```zig
const User = struct {
    id: i64,
    name: []const u8,
    active: bool,
};

const typed = try ason.encodeTyped(User, .{
    .id = 1,
    .name = "Alice",
    .active = true,
}, allocator);

const restored = try ason.decode(User, typed, allocator);
```

## 说明

- Zig 里 ASON `str` 常映射为 `[]const u8`。
- 二进制解码依赖目标类型，因为 binary ASON 不内嵌 schema。
- 键值集合请统一使用 entry struct，而不是 map 风格字段。

## 构建与测试

```bash
cd ason-zig
zig build test
zig build run-basic
zig build run-complex
zig build run-bench
```
