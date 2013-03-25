var util    = require('util');
var Service = require('../core/Service.js');

function DefaultService() {
    Service.call(this);
}

util.inherits(DefaultService, Service);

// Module exports;
module.exports = config;
