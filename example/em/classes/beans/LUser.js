var util  = require('util');
var TBean = require(basepath + '/core/TBean.js');

function LUser() {
    var pros = {
        'id' : 0,
        'username' : '',
        'password' : ''
    };
    TBean.call(this,pros);
};

util.inherits(LUser, TBean);

//module exports
module.exports = LUser;
