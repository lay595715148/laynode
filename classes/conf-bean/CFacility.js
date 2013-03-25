var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CFacility() {
    var pros = {
        'id' : 0,
        'sourceid' : 0,
        'sourcename' : '',
        'facilityhost' : '',
        'description' : ''
    };
    TBean.call(this,pros);
};

util.inherits(CFacility, TBean);

//module exports
module.exports = CFacility;
