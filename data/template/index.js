//  Module:     data/template
//  Project:    nhp
//  Author:     soviet
//  E-mail:     soviet@s0viet.ru
//  Web:        https://s0viet.ru/

module.exports = 'function echo(..._){for(s of _)__return__+=s}function exit(){throw new Error({})}function __main__(){%0}__return__="",async function(){try{__main__(),exit()}catch(_){_.message!={}&&(__return__="<html><head></head><body><h1>Internal error</h1><br><b>"+_.stack.replace(/</gi,"&lt;").replace(/\\n/gs,"<br>")+"</b></body></html>")}}(),__return__;'