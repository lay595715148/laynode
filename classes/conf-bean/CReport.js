var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CReport() {
    var pros = {
        'id' : 0,
        'name' : '',
        'reportEnabled' : 0,
        'viewid' : 0,
        'reportType' : 0,
        'addressType' : 0,
        'chartType' : 0,
        'reportField' : '',
        'countField' : '',
        'userid' : 0,
        'groupid' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CReport, TBean);

//module exports
module.exports = CReport;
