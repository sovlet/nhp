const fs = require('fs');
const vm = require('vm');

class Preprocessor {
    constructor(file) {
        this.file = file;
    }
    process(template) {
        var content = fs.readFileSync(this.file, 'utf8');
        var last = 0;
        var fillers = Array.from(content.matchAll(/<\?js(.*?)\?>/gis));
        this.parsed = [];
        for (let i = 0; i < fillers.length; i++) {
            if (fillers[i].index > 0) {
                this.parsed.push(["plain", content.substring(last, fillers[i].index)]);
            }
            this.parsed.push(["js", new vm.Script(template.replace('<?code>', fillers[i][1]))]);
            last = fillers[i].index + fillers[i][0].length;
            if (i == fillers.length - 1) {
                this.parsed.push(["plain", content.substring(last)]);
            }
        };
        return this;
    }
    use($, req, res) {
        var ret = "";
        var context = vm.createContext({
            "$": extend($, {
                "req": req,
                "res": res,
                "extend": extend
            })
        });
        for (let i = 0; i < this.parsed.length; i++) {
            switch (this.parsed[i][0]) {
                case "plain":
                    ret = ret + this.parsed[i][1];
                    break;
                case "js":
                    this.parsed[i][1].runInContext(context);
                    ret = ret + context.$.return;
                    break;
                default:
                    break;
            }
        }
        return ret;
    }
}

module.exports = Preprocessor;