//  Module:     src/nhp
//  Project:    nhp
//  Author:     soviet
//  E-mail:     soviet@s0viet.ru
//  Web:        https://s0viet.ru/

const path = require('path')
const vm = require('vm')

const template = require('$nhp/data/template')

class NHP {
	constructor(root) {
		this.webMap = new Object(null)
		let parsed = this.parseDir(root)
		for(let dir of parsed) {
			let rel = dir.substr(root.length)
			switch(path.extname) {
				case '.nhp':
					if(webMap[rel] !== undefined)
						continue
					webMap[rel] = this.preprocess(dir)
					break
				case '':
					webMap[rel] = webMap[rel + '/'] = webMap[rel + '/index.php'] = webMap[rel + '/index.nhp'] || this.preprocess(dir + '/index.nhp')
					break
				default:
					webMap[dir.substr(root.length)] = dir
			}
		}
	}
	use(context) {
		return async(req, res, next) => {
			this.query(
				vm.createContext({$: context, ... {'req': req, 'res': res}}),
				req,
				res
			)
			next()
		}
	}
	preprocess(file) {
		let content = fs.readFileSync(this.file, 'utf8')
		let matches = Array.from(content.matchAll(/((<\?\j*s*)(.+)(\?>)|(.+))/gis))
		let units = new Array(array.length)
		for(let match of matches) {
			if(match[3])
				units[units.length] = new vm.Script(template.replace('%0', match[3]))
			else
				units[units.length] = match[5]
		}
		return parsed
	}
	process(context, units) {
		let content = ''
        for(let unit of units) {
            if(unit instanceof vm.Script) {
            	try {
            		content += (await unit.runInContext(context))
            	} catch(error) {
            		content += '<html><head></head><body><h1>Fatal error</h1><br><b>'
            		content += error.stack.replace(/</gi, '&lt;').replace(/\n/gs, '<br>')
            		content += '</b></body></html>'
            	}
            	continue
            }
            content += unit.toString()
        }
        return content
	}
	query(context, req, res) {
		let data = this.webMap[req.path]
		if(typeof data === "string")
			return res.status(200).sendFile(data)
		if(data instanceof Array)
			return res.status(200).setHeader("Content-Type", "text/html;charset=utf-8").end(this.process(context, data))
		return res.status(404).end();
	}
}

module.exports = {
	NHP: NHP
}