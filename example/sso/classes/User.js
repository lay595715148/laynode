var util     = require('util');

var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var TBean    = require(basepath + '/core/TBean.js');

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
