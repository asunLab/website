# PHP 指南

PHP 版是一个原生 C++ 扩展，直接面向关联数组、索引数组和 PHP 标量值工作。

## 最低版本

- PHP `8.4+`

## 实现方式

- 文本编码从 PHP 数组和值自动推断 schema。
- 文本解码读取文本里自带的 schema，返回 PHP 数组。
- 二进制解码需要显式 schema 参数，因为 binary ASON 不是自描述的。

## 当前支持

- `ason_encode`、`ason_encodeTyped`
- `ason_encodePretty`、`ason_encodePrettyTyped`
- `ason_decode`
- `ason_encodeBinary`、`ason_decodeBinary`

## 示例

```php
$users = [
    ['id' => 1, 'name' => 'Alice', 'active' => true],
    ['id' => 2, 'name' => 'Bob', 'active' => false],
];

$typed = ason_encodeTyped($users);
$rows = ason_decode($typed);

$bin = ason_encodeBinary($users);
$rows2 = ason_decodeBinary($bin, '[{id@int,name@str,active@bool}]');
```

## 说明

- `ason_decodeBinary` 需要 schema 参数。
- PHP 数组只是宿主语言的数据模型；ASON 本身已经没有独立 map 类型。
- 如果要表达键值集合，请统一用 entry-list 数组，例如 `[{key@str,value@str}]`。

## 构建与测试

```bash
cd ason-php
phpize
./configure --enable-ason
make -j4
make test REPORT_EXIT_STATUS=1 NO_INTERACTION=1
php -d extension=modules/ason.so examples/basic.php
php -d extension=modules/ason.so examples/bench.php
```
