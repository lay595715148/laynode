var util   = require("util");
var events = require('events');
var Base   = require('./Base.js');

function Eventer() {
    Base.call(this);
    events.EventEmitter.call(this);
}

util.inherits(Eventer, events.EventEmitter);

//module exports
module.exports = Eventer;