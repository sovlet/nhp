//  Module:     src/nhp
//  Project:    nhp
//  Author:     soviet
//  E-mail:     soviet@s0viet.ru
//  Web:        https://s0viet.ru/

const vm = require('vm')
const fs = require('fs')
const path = require('path')

const template = require('@nhp/data/template')

class NHP {
	constructor(root) {
		this.webMap = new Object(null)
		let full = path.join(process.cwd(), root)
		let parsed = this.parseDir(full)
		for(let dir of parsed) {
			let rel = dir.substr(full.length).replace(/\\\\*/g, '/')
			switch(path.extname(dir)) {
				case '.php':
				case '.nhp':
					this.webMap[rel] = {
						type: 'script',
						units: this.preprocess(dir)
					}
					break
				/* 
				case '.htm':
					this.webMap[rel] = {
						type: 'html',
						content: fs.readFileSync(dir, 'utf8')
					}
					break
				*/
				case '':
					let dest = this.webMap[rel + '/'] = this.webMap[rel + '/index.nhp'] || this.webMap[rel + '/index.php'] || this.webMap[rel + '/index.html'] || this.webMap[rel + '/index.htm']
					if(dest === undefined)
						break
					this.webMap[rel] = {
						type: 'redirect',
						dest: rel + '/'
					}
					break
				default:
					this.webMap[rel] = {
						type: 'file',
						path: dir
					}
			}
		}
	}
	parseDir(dir) {
		let array = []
		let elems = fs.readdirSync(dir, {withFileTypes: true})
		for(let elem of elems) {
			if(elem.isDirectory()) {
				array = array.concat(this.parseDir(path.resolve(dir, elem.name)))
				continue
			}
			array.push(path.resolve(dir, elem.name))
		}
		array.push(dir)
		return array
	}
	use(context) {
		return async(req, res, next) => {
			if(false === await this.query(
				vm.createContext({$: context, ... {'req': req, 'res': res}}),
				req,
				res
			)) next()
		}
	}
	preprocess(file) {
		if(!fs.existsSync(file))
			return
		let content = fs.readFileSync(file, 'utf8')
		let matches = Array.from(content.matchAll(/((<\?\j*s*)(.+)(\?>)|(.+))/gis))
		let units = []
		for(let match of matches) {
			if(match[3])
				units.push(new vm.Script(template.replace('%0', match[3])))
			else
				units.push(match[5])
		}
		return units
	}
	async process(context, units) {
		let content = ''
		for(let unit of units) {
			if(unit instanceof vm.Script) {
				try {
					await unit.runInContext(context)
					content += context.__return__
				} catch(error) {
					content += '<html><head></head><body><h1>Fatal error</h1><br><b>'
					content += error.stack.replace(/</gi, '&lt').replace(/\n/gs, '<br>')
					content += '</b></body></html>'
				}
				continue
			}
			content += unit.toString()
		}
		return content
	}
	async query(context, req, res) {
		let data = this.webMap[req.path]
		if(data === undefined)
			return false
		switch(data.type) {
			case 'script':
				let result = await this.process(context, data.units)
				if(result === '')
					return
				return res.status(200).setHeader("Content-Type", "text/html;charset=utf-8").end(result, 'utf8')
			case 'html':
				return res.status(200).setHeader("Content-Type", "text/html;charset=utf-8").end(data.content, 'utf8')
			case 'file':
				return res.status(200).sendFile(data.path)
			case 'redirect':
				return res.redirect(301, data.dest + (req._parsedUrl.query === null ? '' : ('?' + req._parsedUrl.query)))
		}
	}
}

module.exports = {
	NHP: NHP
}