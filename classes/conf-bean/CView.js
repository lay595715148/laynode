var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CView() {
    var pros = {
        'id' : 0,
        'displayName' : '',
        'columns' : '',
        'childColumns' : '',
        'realtimeColumns' : '',
        'gatherColumns' : '',
        'driver' : 0,
        'facilitySources' : '',
        'tabkeys' : '',
        'portlets' : '',
        'userid' : 0,
        'groupid' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CView, TBean);

//module exports
module.exports = CView;
