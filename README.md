# Node.JS Hypertext Preprocessor

[![Package Version](https://img.shields.io/npm/v/@sovietxd/nhp.svg)](https://www.npmjs.org/package/@sovietxd/nhp)

What is it?
--------
Node.JS Hypertext Preprocessor is a fast hypertext preprocessor "aka PHP"

Example of usage
--------
```js
const express = require('express')
const app = express()

const www = './www'
const port = process.env.PORT || 3000

const { NHP } = require('nhp');

var nhp = new NHP('./www');
var ctx = {
    process: process,
    app: app
}

app.use('/', nhp.use(ctx))
app.listen(port, () => {})
```

License
-----
NHP is licensed under [GPL v2.0](LICENSE.md)