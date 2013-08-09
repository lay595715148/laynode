//var util   = require("util");
//var events = require('events');

function Base() {
    this._classname = this.constructor.toString().match(/function\s+([^\s\(]+)/)[1];
    //console.log('ClassName: ' + this.$classname);
    //events.EventEmitter.call(this);
}

//util.inherits(Base, events.EventEmitter);

Base.prototype._classname = '';

//module exports
module.exports = Base;
