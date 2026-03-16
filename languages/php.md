# PHP Guide

The PHP implementation is a native C++ extension that works with associative arrays, indexed arrays, and PHP scalars.

## Minimum Version

- PHP `8.4+`

## Implementation Model

- Text encode infers schema from PHP arrays and values.
- Text decode reads the schema embedded in the text and returns PHP arrays.
- Binary decode requires an explicit schema argument because binary ASON is not self-describing.

## Current Support

- `ason_encode`, `ason_encodeTyped`
- `ason_encodePretty`, `ason_encodePrettyTyped`
- `ason_decode`
- `ason_encodeBinary`, `ason_decodeBinary`

## Example

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

## Notes

- `ason_decodeBinary` needs a schema argument.
- For keyed data, keep using entry-list arrays such as `[{key@str,value@str}]`.

## Build and Test

```bash
cd ason-php
phpize
./configure --enable-ason
make -j4
make test REPORT_EXIT_STATUS=1 NO_INTERACTION=1
php -d extension=modules/ason.so examples/basic.php
php -d extension=modules/ason.so examples/bench.php
```
