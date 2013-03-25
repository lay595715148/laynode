var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CGroup() {
    var pros = {
        'id' : 0,
        'groupName' : '',
        'groupDescription' : '',
        'groupType' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CGroup, TBean);

//module exports
module.exports = CGroup;
