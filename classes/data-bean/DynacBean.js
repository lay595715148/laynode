var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function DyncBean(pros) {
    TBean.call(this,pros);
};

util.inherits(DyncBean, TBean);

//module exports
module.exports = DyncBean;
