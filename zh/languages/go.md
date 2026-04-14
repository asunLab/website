# Go 指南

Go 版通过反射和 struct tag 将 Go 结构体、切片映射到 ASUN 文本与二进制格式。

## 最低版本

- Go `1.24+`

## 实现方式

- 结构体字段使用 `asun:"name"` 标签，缺省时可回退到 `json` tag。
- 文本解码写入输出指针。
- 二进制解码同样写入输出指针，因为二进制格式不是自描述的。

## 当前支持

- `Encode`、`EncodeTyped`
- `EncodePretty`、`EncodePrettyTyped`
- `Decode`
- `EncodeBinary`、`DecodeBinary`
- 嵌套结构体、切片、可空 / 空槽字段、entry-list 键值集合

## 示例

```go
type User struct {
    ID     int64  `asun:"id"`
    Name   string `asun:"name"`
    Active bool   `asun:"active"`
}

users := []User{
    {ID: 1, Name: "Alice", Active: true},
    {ID: 2, Name: "Bob", Active: false},
}

text, _ := asun.EncodeTyped(users)

var out []User
_ = asun.Decode(text, &out)
```

## 说明

- 如果希望 `Decode` 直接恢复数值和布尔类型，优先使用 `EncodeTyped`。
- 键值集合请用 entry struct 切片，不要把宿主语言 `map` 当成 ASUN schema 类型。
- 二进制解码只需要输出值，因为 Go 会通过目标类型建立 schema 计划。

## 构建与测试

```bash
cd asun-go
go test ./...
go run ./examples/basic
go run ./examples/complex
go run ./examples/bench
```
