var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CPortlet() {
    var pros = {
        'pid' : 0,
        'userid' : 0,
        'tabkey' : '',
        'chartid' : 0,
        'reportid' : 0,
        'height' : 0,
        'width' : 0,
        'columnType' : '',
        'infomation' : ''
    };
    TBean.call(this,pros);
};

util.inherits(CPortlet, TBean);

//module exports
module.exports = CPortlet;
