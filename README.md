# nvpqs [![Build Status](https://travis-ci.org/ruiquelhas/nvpqs.png)](https://travis-ci.org/ruiquelhas/nvpqs)

Utilities for name-value pair encoded querystrings.


## What is this

It's basically [querystring](https://nodejs.org/api/querystring.html) but for a string enconded as one or more name-value pairs, which keys might represent nested objects or arrays.


## How it works

Assuming you have the following querystring:

```
primitive=value1&
nested.primitive=value2&
nested.nested.primitive=value3&
array.0.primitive=value4&
array.0.nested.primitive=value5&
array.1.primitive=value6&
array.1.nested.primitive=value7
```

You call `parse` and you get the following object:

```
{
  primitive: "value1",
  nested: {
    primitive: "value2",
    nested: {
      primitive: "value3"
    }
  },
  array: [
    {
      primitive: "value4",
      nested: {
        primitive: "value5"
      }
    },
    {
      primitive: "value6",
      nested: {
        primitive: "value7"
      }
    }
  ]
}
```

Of course it also works the other way around, you just need to call `stringify`.

By default it works for name-value pairs encoded using dot notation (`.`), but you can specify a custom delimiter. And, again, like [querystring](https://nodejs.org/api/querystring.html) you can also specify custom separator and assigment characters.

### Parsing

```
nvpqs.parse(string, [del], [sep], [eq]);
```

### Stringifying

```
nvpqs.stringify(object, [del], [sep], [eq]);
```


## Usage

```javascript
var nvpqs = require('nvpqs');

var obj = nvpqs.parse('a=b&c.d=e&f.0=g')); // { a: 'b', c: { d: 'e' }, f: ['g']}
var qs = nvpqs.stringify(obj); // 'a=b&c.d=e&f.0=g'
```

## Issues and comments

You [know](https://github.com/ruiquelhas/nvpqs/issues) the [drill](https://github.com/ruiquelhas/nvpqs/pulls).
