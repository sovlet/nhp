//  Module:     data/template
//  Project:    nhp
//  Author:     soviet
//  E-mail:     soviet@s0viet.ru
//  Web:        https://s0viet.ru/

module.exports = 'function echo(...a){for(s of a)__return__+=s}function exit(){if(__return__===""&&!res.writableEnded){res.end();};throw new Error("\u0127")}async function __main__(){%0}__return__="";__run__=async function(){try{await __main__();exit();}catch(a){("\u0127")!=a.message&&(__return__="<html><head></head><body><h1>Internal error</h1><br><b>"+a.stack.replace(/</gi,"&lt;").replace(/\\n/gs,"<br>")+"</b></body></html>")}};'