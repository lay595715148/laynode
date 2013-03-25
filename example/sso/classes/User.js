var util  = require('util');
var TBean = require('../../../laynode/core/TBean.js');

function User() {
    var pros = {
        'uid' : 0,
        'username' : '',
        'isAdmin' : 0
    };
    TBean.call(this, pros);
}

util.inherits(User, TBean);

//module exports
module.exports = User;
