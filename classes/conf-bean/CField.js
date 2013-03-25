var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CField() {
    var pros = {
        'fieldID' : '',
        'fieldCaption' : '',
        'fieldType' : 0,
        'searchFlag' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CField, TBean);

//module exports
module.exports = CField;
