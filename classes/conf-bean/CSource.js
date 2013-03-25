var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CSource() {
    var pros = {
        'id' : 0,
        'name' : '',
        'description' : '',
        'dbTableName' : '',
        'fields' : '',
        'gatherFields' : '',
        'dbEnableRowCounting' : 0,
        'dbRecordsPerQuery' : 0,
        'userid' : 0,
        'groupid' : 0,
        'maintainTime' : 0,
        'maintainNumber' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CSource, TBean);

//module exports
module.exports = CSource;
