var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CChart() {
    var pros = {
        'id' : 0,
        'displayName' : '',
        'chartEnabled' : 0,
        'chartType' : 0,
        'lineType' : 0,
        'chartWidth' : 0,
        'chartHeight' : 0,
        'chartField'  : '',
        'addressType' : 0,
        'maxrecords' : 0,
        'sortType' : '',
        'showpercent' : '',
        'userid' : 0,
        'groupid' : 0,
        'viewid' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CChart, TBean);

//module exports
module.exports = CChart;
