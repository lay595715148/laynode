var util   = require("util");
var events = require('events');

function Eventer() {
    events.EventEmitter.call(this);
}

util.inherits(Base, events.EventEmitter);

//module exports
module.exports = Base;