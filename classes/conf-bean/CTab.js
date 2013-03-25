var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CTab() {
    var pros = {
            'tabid' : 0,
            'key' : '',
            'text' : ''
    };
    TBean.call(this,pros);
};

util.inherits(CTab, TBean);

//module exports
module.exports = CTab;
