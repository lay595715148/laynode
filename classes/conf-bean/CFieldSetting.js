var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CFieldSetting() {
    var pros = {
        'viewID' : 0,
        'viewType' : 0,
        'fieldID' : '',
        'fieldCaption' : '',
        'fieldType' : 0,
        'defaultWidth' : 0,
        'fieldAlign' : ''
    };
    TBean.call(this,pros);
};

util.inherits(CFieldSetting, TBean);

//module exports
module.exports = CFieldSetting;
