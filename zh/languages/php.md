# PHP 指南

PHP 版是一个原生 C++ 扩展，直接面向关联数组、索引数组和 PHP 标量值工作。

## 最低版本

- PHP `8.4+`

## 实现方式

- 文本编码从 PHP 数组和值自动推断 schema。
- 文本解码读取文本里自带的 schema，返回 PHP 数组。
- 二进制解码需要显式 schema 参数，因为 binary ASUN 不是自描述的。

## 当前支持

- `asun_encode`、`asun_encodeTyped`
- `asun_encodePretty`、`asun_encodePrettyTyped`
- `asun_decode`
- `asun_encodeBinary`、`asun_decodeBinary`

## 示例

```php
$users = [
    ['id' => 1, 'name' => 'Alice', 'active' => true],
    ['id' => 2, 'name' => 'Bob', 'active' => false],
];

$typed = asun_encodeTyped($users);
$rows = asun_decode($typed);

$bin = asun_encodeBinary($users);
$rows2 = asun_decodeBinary($bin, '[{id@int,name@str,active@bool}]');
```

## 说明

- `asun_decodeBinary` 需要 schema 参数。
- 如果要表达键值集合，请统一用 entry-list 数组，例如 `[{key@str,value@str}]`。

## 构建与测试

```bash
cd asun-php
phpize
./configure --enable-asun
make -j4
make test REPORT_EXIT_STATUS=1 NO_INTERACTION=1
php -d extension=modules/asun.so examples/basic.php
php -d extension=modules/asun.so examples/bench.php
```
