var util = require('util');
var TBean = require('../../laynode/core/TBean.js');

function ViewForm() {
    var pros = {
        "viewid":"",
        "facilityhost":""
    };
    TBean.call(this,pros);
};

util.inherits(ViewForm, TBean);

//module exports
module.exports = ViewForm;
