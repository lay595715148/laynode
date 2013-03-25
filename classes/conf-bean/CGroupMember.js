var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CGroupMember() {
    var pros = {
        'userid' : 0,
        'groupid' : 0,
        'isMember' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CGroupMember, TBean);

//module exports
module.exports = CGroupMember;
