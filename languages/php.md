# PHP Guide

The PHP implementation is a native C++ extension that works with associative arrays, indexed arrays, and PHP scalars.

## Minimum Version

- PHP `8.4+`

## Implementation Model

- Text encode infers schema from PHP arrays and values.
- Text decode reads the schema embedded in the text and returns PHP arrays.
- Binary decode requires an explicit schema argument because binary ASUN is not self-describing.

## Current Support

- `asun_encode`, `asun_encodeTyped`
- `asun_encodePretty`, `asun_encodePrettyTyped`
- `asun_decode`
- `asun_encodeBinary`, `asun_decodeBinary`

## Example

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

## Notes

- `asun_decodeBinary` needs a schema argument.
- For keyed data, keep using entry-list arrays such as `[{key@str,value@str}]`.

## Build and Test

```bash
cd asun-php
phpize
./configure --enable-asun
make -j4
make test REPORT_EXIT_STATUS=1 NO_INTERACTION=1
php -d extension=modules/asun.so examples/basic.php
php -d extension=modules/asun.so examples/bench.php
```
