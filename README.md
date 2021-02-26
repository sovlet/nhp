# Node.JS Hypertext Preprocessor

[![Package Version](https://img.shields.io/npm/v/@sovietxd/nhp.svg)](https://www.npmjs.org/package/@sovietxd/nhp)

What is it?
--------
Node.JS Hypertext Preprocessor is a fast hypertext preprocessor 'aka PHP'.

Example of usage
--------
```js
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const NHP = require('@sovietxd/nhp');

var nhp = new NHP(); // Create NHP object
var nhpCtx = {       // Create NHP context object (these properties will be available under $ object in all .nhp scripts)
	"process": process,
	"app": app
}

nhp.setWebMap(nhp.genWebMap(path.join(__dirname, 'www'))); // Set main directory to ./www

app.use('/', (req, res) => {
	nhp.use(nhpCtx, req, res) // Use NHP handler
});

app.listen(port, () => {})
```

License
-----
NHP is licensed under [GPL 2.0](LICENSE.md)