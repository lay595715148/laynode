var util     = require('util');
var TBean    = require(basepath + '/core/TBean.js');

function OAuth2Token() {
    var pros = {
        'id' : 0, 
        'token' : '',
        'clientID' : '',
        'type' : '',
        'expires' : 0,
        'userid' : ''
    };
    TBean.call(this, pros);
}

util.inherits(OAuth2Token, TBean);

//module exports
module.exports = OAuth2Token;