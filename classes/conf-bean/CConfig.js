var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CConfig() {
    var pros = {
        'propname' : '',
        'propvalue' : '',
        'propvalueText' : '',
        'isGlobal' : 0,
        'userid' : 0,
        'groupid' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CConfig, TBean);

//module exports
module.exports = CConfig;
