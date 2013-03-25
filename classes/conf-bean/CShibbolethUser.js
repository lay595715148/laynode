var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CShibbolethUser() {
    var pros = {
        'id' : 0,
        'uid' : '',
        'username' : '',
        'isAdmin' : 0,
        'isCommonuser' : 0,
        'isReadonly' : 0,
        'facilityHost' : '',
        'lastLogin' : 0,
        'domain' : '',
        'email' : '',
        'typeof' : '',
        'isVerify' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CShibbolethUser, TBean);

//module exports
module.exports = CShibbolethUser;
