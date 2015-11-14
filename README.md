# nvpqs

[NVP](https://developer.paypal.com/docs/classic/api/NVPAPIOverview/#id09C2F0D0DX4) parser. Like [querystring](https://nodejs.org/api/querystring.html), but for pairs where the name encodes primitive types, objects or arrays.

[![NPM Version][fury-img]][fury-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Dependencies][david-img]][david-url]

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [`parse(string, [del], [sep], [eq])`](#parsestring-del-sep-eq)
    - [`stringify(object, [del], [sep], [eq])`](#stringifyobject-del-sep-eq)

## Installation

Install via [NPM](https://www.npmjs.org).

```sh
$ npm install nvqps
```

## Usage

### `parse(string, [del], [sep], [eq])`

Deserialize a NVP query string to an object. Optionally  override the default delimiter (`.`), separator (`&`) and assignment (`=`) characters.

#### Example

```js
const nvpqs = require('nvpqs');

nvpqs.parse('a=b&c.d=e&f.0=g')); // { a: 'b', c: { d: 'e' }, f: ['g']}
```

### `stringify(object, [del], [sep], [eq])`

Serialize an object to a NVP query string. Optionally override the default delimiter (`.`), separator (`&`) and assignment (`=`) characters.

#### Example

```js
var nvpqs = require('nvpqs');

nvpqs.stringify(obj); // 'a=b&c.d=e&f.0=g'
```

## Contributing

Feel free to open [issues](https://github.com/ruiquelhas/nvpqs/issues) or submit [pull requests](https://github.com/ruiquelhas/nvpqs/pulls).

[coveralls-img]: https://coveralls.io/repos/ruiquelhas/nvpqs/badge.svg
[coveralls-url]: https://coveralls.io/github/ruiquelhas/nvpqs
[david-img]: https://david-dm.org/ruiquelhas/nvpqs.svg
[david-url]: https://david-dm.org/ruiquelhas/nvpqs
[fury-img]: https://badge.fury.io/js/nvpqs.svg
[fury-url]: https://badge.fury.io/js/nvpqs
[travis-img]: https://travis-ci.org/ruiquelhas/nvpqs.svg
[travis-url]: https://travis-ci.org/ruiquelhas/nvpqs
