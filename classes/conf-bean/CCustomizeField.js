var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CCustomizeField() {
    var pros = {
        'customizeFieldID' : '',
        'fieldID' : '',
        'contentMappingID' : '',
        'searchFlag' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CCustomizeField, TBean);

//module exports
module.exports = CCustomizeField;
