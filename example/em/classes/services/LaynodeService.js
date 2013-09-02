var util    = require('util');
var Service = require(basepath + '/core/Service.js');

function LaynodeService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(LaynodeService, Service);

LaynodeService.prototype.do = function() {
    logger.log('It\'s great too!');
};

module.exports = LaynodeService;