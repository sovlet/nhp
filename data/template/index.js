//  Module:     data/template
//  Project:    nhp
//  Author:     soviet
//  E-mail:     soviet@s0viet.ru
//  Web:        https://s0viet.ru/

module.exports = 'function echo(...r){for(s of r)__return__+=s}function exit(){throw new Error({})}__return__="",async function(){await async function(){try{%0;exit()}catch(r){r.message!={}&&(__return__="<html><head></head><body><h1>Internal error</h1><br><b>"+r.stack.replace(/</gi,"&lt;").replace(/\\n/gs,"<br>")+"</b></body></html>")}}(),__return__}();'