# Java / Kotlin 指南

JVM 版以 Java 为主，同时在同一个 artifact 中附带 Kotlin helper。

## 最低版本

- Java `21+`
- Kotlin 使用者如果要用 helper 层，建议使用 `1.9+` 工具链

## 实现方式

- Java 侧基于反射、注解和缓存后的类元数据。
- 文本与二进制解码都依赖目标 `Class<T>`。
- Kotlin 在相同运行时之上额外提供 inline reified helper。

## 当前支持

- 紧凑文本编解码
- 美化文本编解码
- 二进制编解码
- 列表、嵌套类、可空字段、entry-list 键值集合

ASON 不再提供独立 `map` 类型。键值集合请统一建模为 `List<Entry>`。

## 核心 API

```java
String text = Ason.encode(user);
String typed = Ason.encodeTyped(user);
String pretty = Ason.encodePrettyTyped(user);

User restored = Ason.decode(text, User.class);
List<User> rows = Ason.decodeList(text, User.class);

byte[] bin = Ason.encodeBinary(user);
User restored2 = Ason.decodeBinary(bin, User.class);
```

## Kotlin Helper

```kotlin
val user: User = decode(text)
val rows: List<User> = decodeList(text)
```

## 说明

- Java / Kotlin 对外暴露的 ASON schema 名同样只有 `int`、`float`、`str`、`bool`。
- 二进制解码依赖目标类，因为 binary ASON 不内嵌 schema。
- 如果要表达键值集合，请使用 entry object 列表，而不是 `Map<K, V>`。

## 构建与测试

```bash
cd ason-java
./gradlew test
./gradlew runBasicExample
./gradlew runComplexExample
./gradlew runBenchExample
```
