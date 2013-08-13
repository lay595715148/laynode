var util     = require("util");
var events   = require('events');

var rootpath = global._laynode_rootpath;
var basepath = global._laynode_basepath;
var Base     = require(basepath + '/core/Base.js');

function Eventer() {
    Base.call(this);
    events.EventEmitter.call(this);
}

util.inherits(Eventer, events.EventEmitter);

//module exports
module.exports = Eventer;