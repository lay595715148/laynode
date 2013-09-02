var util    = require('util');
var TBean   = require(basepath + '/core/TBean.js');

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