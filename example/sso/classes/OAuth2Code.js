var util     = require('util');

var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var TBean    = require(basepath + '/core/TBean.js');

function OAuth2Code() {
    var pros = {
		'id' : 0, 
        'code' : '',
        'clientID' : '',
        'redirectURI' : '',
        'expires' : 0,
        'userid' : ''
    };
    TBean.call(this, pros);
}

util.inherits(OAuth2Code, TBean);

//module exports
module.exports = OAuth2Code;