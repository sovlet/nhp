const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const NHP = require('@sovietxd/nhp');

var nhp = new NHP();
var nhpCtx = {
	"process": process,
	"app": app
}

nhp.setWebMap(nhp.genWebMap(path.join(__dirname, 'www')));

app.use('/', (req, res) => {
	nhp.use(nhpCtx, req, res)
});

app.listen(port, () => {})