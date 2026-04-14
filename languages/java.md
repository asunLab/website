# Java / Kotlin Guide

The JVM implementation targets Java first and also ships Kotlin helpers in the same artifact.

## Minimum Version

- Java `21+`
- Kotlin consumers should use a `1.9+` toolchain if they want the bundled Kotlin helper layer

## Implementation Model

- Java uses reflection, annotations, and cached class metadata.
- Text and binary decode use a target `Class<T>`.
- Kotlin gets inline reified helpers on top of the same runtime.

## Current Support

- Compact text encode/decode
- Pretty text encode/decode
- Binary encode/decode
- Lists, nested classes, optional / nullable fields, entry-list modeling for keyed data

There is no standalone ASUN `map` type. Use `List<Entry>` style data instead.

## Core API

```java
String text = Asun.encode(user);
String typed = Asun.encodeTyped(user);
String pretty = Asun.encodePrettyTyped(user);

User restored = Asun.decode(text, User.class);
List<User> rows = Asun.decodeList(text, User.class);

byte[] bin = Asun.encodeBinary(user);
User restored2 = Asun.decodeBinary(bin, User.class);
```

## Kotlin Helpers

```kotlin
val user: User = decode(text)
val rows: List<User> = decodeList(text)
```

## Notes

- Java and Kotlin still use the same public ASUN schema names: `int`, `float`, `str`, `bool`.
- Binary decode requires a target class because binary ASUN does not carry schema metadata inline.
- If you need keyed data, model it as a list of entry objects instead of `Map<K, V>`.

## Build and Test

```bash
cd asun-java
./gradlew test
./gradlew runBasicExample
./gradlew runComplexExample
./gradlew runBenchExample
```
