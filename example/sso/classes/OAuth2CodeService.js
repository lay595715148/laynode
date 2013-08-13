var util      = require('util');
var url       = require('url');
var jade      = require('jade');

var basepath  = global._laynode_basepath;
var rootpath  = global._laynode_rootpath;
var Service   = require(basepath + '/core/Service.js');
var Condition = require(basepath + '/util/Condition.js');
var Cell      = require(basepath + '/util/Cell.js');
var Sort      = require(basepath + '/util/Sort.js');
var MD5       = require(basepath + '/util/MD5.js');
var Util      = require(basepath + '/util/Util.js');

function OAuth2CodeService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2CodeService, Service);

OAuth2CodeService.prototype.gen = function(client,userID) {
    console.log('gen');
    this.emit('data',{method:'gen',result:MD5.hex_md5(Util.guid())});
};
OAuth2CodeService.prototype.checkCode = function(code,clientID) {
    console.log('checkCode');
    this.emit('data',{method:'checkCode',result:{code:code,clientID:clientID,userid:'lay'}});
};

//module exports
module.exports = OAuth2CodeService;