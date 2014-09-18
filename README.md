# nvpqs

Utilities for name-value pair encoded querystrings.


## How it works

Input querystring format:

```
primitive=value1&
nested.primitive=value2&
nested.nested.primitive=value3&
array.0.primitive=value4&
array.0.nested.primitive=value5&
array.1.primitive=value6&
array.1.nested.primitive=value7
```

Output JSON format:

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
