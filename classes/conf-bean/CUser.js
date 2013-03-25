var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CUser() {
    var pros = {
        'id' : 0,
        'authtype' : 0,
        'authid' : 0,
        'username' : '',
        'password' : '',
        'isAdmin' : 0,
        'isCommonuser' : 0,
        'facilityHost' : '',
        'email' : '',
        'mobilePhone' : '',
        'isReadonly' : 0,
        'lastLogin' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CUser, TBean);

//module exports
module.exports = CUser;
