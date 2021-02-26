const path = require('path');
const Ext = require('./Ext.js');
const Preprocessor = require('./Preprocessor.js');
const Template = Ext.readTemplate('Template');

class NHP {
    constructor() {}
    genWebMap(baseDir) {
        var webMap = {};
        var directories = Ext.parseDirectories(baseDir);
        for (let i = 0; i < directories.length; i++) {
            var dir = directories[i];
            var rDir = dir.substr(baseDir.length);
            switch(path.extname(dir)) {
                case ".nhp":
                    if (!webMap[rDir]) {
                        try {
                            webMap[rDir] = new Preprocessor(dir).process(Template);
                        } catch (e) {
                            webMap[rDir] = e;
                        }
                    }
                    break;
                case "":
                    try {
                        webMap[rDir] = new Preprocessor(dir + "/index.nhp").process();
                        webMap[rDir + "/"] = webMap[rDir];
                        webMap[rDir + "/index.nhp"] = webMap[rDir];
                    } catch (e) {
                        webMap[rDir] = e;
                        webMap[rDir + "/"] = e;
                        webMap[rDir + "/index.nhp"] = e;
                    }
                    break;
                default:
                    webMap[dir.substr(baseDir.length)] = dir;
                    break;
            }
        }
        return webMap;
    }
    setWebMap(webMap) {
        this.webMap = webMap;
    }
    use($, req, res) {
        var elem = this.webMap[req.path];
        if (elem instanceof Preprocessor) {
            return res.setHeader("Content-Type", "text/html;charset=utf-8").end(elem.use($, req, res), 'utf8');
        }
        if (elem instanceof Error) {
            return res.setHeader("Content-Type", "text/html;charset=utf-8").end('<html><head></head><body><h1>NHP Error at: ' + req.path + '</h1><br><b>' + elem.stack.replace(/</gi, '&lt;').replace(/\n/gs, '<br>') + '</b></body></html>', 'utf8');
        }
        if (typeof(elem) == "string") {
            return res.status(200).sendFile(elem);
        }
        return res.status(404).end();
    }
}

module.exports = NHP;