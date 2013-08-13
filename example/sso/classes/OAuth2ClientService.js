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

function OAuth2ClientService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2ClientService, Service);

OAuth2ClientService.prototype.checkSoftClient = function(client) {
    console.log('checkSoftClient');
    this.emit('data',{method:'checkSoftClient',result:{'clientID':'lay_sso_person','clientName':'lay_sso_person','clientType':1,'redirectURI':'/person'}});
};
OAuth2ClientService.prototype.checkClient = function(client) {
    console.log('checkClient');
    this.emit('data',{method:'checkClient',result:{'clientID':'lay_sso_person','clientName':'lay_sso_person','clientType':1,'redirectURI':'/person'}});
};
OAuth2ClientService.prototype.checkHardClient = function(client) {
    console.log('checkHardClient');
    this.emit('data',{method:'checkHardClient',result:{'clientID':'lay_sso_person','clientName':'lay_sso_person','clientType':1,'redirectURI':'/person'}});
};
OAuth2ClientService.prototype.checkSoftHardClient = function(client) {
    console.log('checkSoftHardClient');
    this.emit('data',{method:'checkSoftHardClient',result:{'clientID':'lay_sso_person','clientName':'lay_sso_person','clientType':1,'redirectURI':'/person'}});
};

//module exports
module.exports = OAuth2ClientService;