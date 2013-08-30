var util     = require('util');

var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var TBean    = require(basepath + '/core/TBean.js');

function OAuth2User() {
    var pros = {
        'id' : 0,
        'username' : '',
        'password' : '',
        'group' : 0
    };
    TBean.call(this, pros);
}

util.inherits(OAuth2User, TBean);

TBean.prototype.rowToInfoArray = function(row) {
    var classname = this._classname;
    var bean,arr  = {};

    if('object' == typeof row) {
        bean = this.rowToEntity.call(this,row);
        arr  = bean.toArray.call(bean);
        if('undefined' != typeof arr['password']) delete arr['password'];
    }
    return arr;
};

//module exports
module.exports = OAuth2User;
