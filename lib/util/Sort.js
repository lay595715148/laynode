var util   = require('util');
var Base   = require('../core/Base.js');

function Sort() {
    Base.call(this);
}

util.inherits(Sort, Base);

Sort.prototype.sorts = [];

//module exports
module.exports = Sort;
