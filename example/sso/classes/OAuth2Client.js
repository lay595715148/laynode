var util     = require('util');

var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var TBean    = require(basepath + '/core/TBean.js');

function OAuth2Client() {
    var pros = {
        'id' : 0,
        'clientID' : '',
        'clientName' : '',
        'clientSecret' : '',
        'clientType' : 1,
        'redirectURI' : '',
        'scope' : '',
        'clientLocation' : '',
        'clientDescription' : '',
        'logoURI' : '',
        'isUsing' : 0,
        'isDisplay' : 0
    };
    TBean.call(this, pros);
}

util.inherits(OAuth2Client, TBean);

//module exports
module.exports = OAuth2Client;