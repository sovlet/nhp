const fs = require('fs');
const path = require('path');

Ext = {
    readTemplate: function(name) {
        return fs.readFileSync(path.join(__dirname, name + '.nhp'), 'utf8');
    },
    parseDirectories: function(dir) {
        const dirents = fs.readdirSync(dir, {
            withFileTypes: true
        });
        var ret = [dir];
        for (const dirent of dirents) {
            const res = path.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                ret = ret.concat(this.parseDirectories(res));
            } else {
                ret.push(res);
            }
        }
        return ret;
    },
    extend: function() {
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }
        var merge = function(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    }
}

module.exports = Ext;