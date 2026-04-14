# C# 指南

.NET 版采用显式 schema 接口和 factory-based typed decode。

## 最低版本

- `.NET 8+`
- 当前包目标框架为 `net8.0` 和 `net10.0`

## 实现方式

- 类型可以实现 `IAsunSchema` 来暴露字段名、字段类型和字段值。
- 文本解码既可以返回 field bag，也可以通过 factory 构造强类型对象。
- 二进制解码需要字段名、字段类型和 factory，因为 binary ASUN 不是自描述的。

## 当前支持

- `Asun.encode`、`Asun.encodeTyped`
- `Asun.encodePretty`、`Asun.encodePrettyTyped`
- `Asun.decode`、`Asun.decodeWith`、`Asun.decodeListWith`
- `Asun.encodeBinary`、`Asun.decodeBinaryWith`

## 示例

```csharp
record User(long Id, string Name, bool Active) : IAsunSchema
{
    static readonly string[] Names = ["id", "name", "active"];
    static readonly string?[] Types = ["int", "str", "bool"];

    public ReadOnlySpan<string> FieldNames => Names;
    public ReadOnlySpan<string?> FieldTypes => Types;
    public object?[] FieldValues => [Id, Name, Active];
}
```

## 说明

- 对外 schema 名仍然只有 `int`、`float`、`str`、`bool`。
- 键值集合请用 entry-list 数组，不要把 `Dictionary<K, V>` 当成 ASUN schema 类型。
- 实现层虽然使用了 span、池化缓冲区和 binary primitives 优化，但公共格式仍和仓库规范保持一致。

## 构建与测试

```bash
cd asun-cs
dotnet test tests/Asun.Tests/Asun.Tests.csproj -f net10.0
dotnet run --project examples/Basic/Asun.Examples.Basic.csproj -f net10.0
dotnet run --project examples/Bench/Asun.Examples.Bench.csproj -f net10.0
```
