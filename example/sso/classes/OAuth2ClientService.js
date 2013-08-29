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

var OAuth2Client = require('./OAuth2Client.js');

function OAuth2ClientService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2ClientService, Service);

OAuth2ClientService.prototype.checkSoftClient = function(client) {
    console.log('checkSoftClient');console.log(client instanceof OAuth2Client);
    if(!(client instanceof OAuth2Client)) { this.emit('error',{method:'checkSoftClient',result:false});}
    var me = this;
    var ret;
    var table = client.toTable();
    var fields = client.toFields();
    var cidf = client.toField('clientID');
    var csef = client.toField('clientSecret');
    var redf = client.toField('redirectURI');
    var cidv = client.getClientID();
    var redv = client.getRedirectURI();
    var cond = {};
    cond[cidf] = cidv;cond[redf] = redv;console.log(cond);
    
        console.log(fields);
    me.store().on('query',function(rows,fields) {
        console.log(rows);
        me.emit('data',{method:'checkSoftClient',result:{'clientID':'lay_sso_person','clientName':'lay_sso_person','clientType':1,'redirectURI':'/person'}});
    }).on('error',function(err) {
        console.log(err);
        me.emit('error',err);
    });
    me.store().select(table,fields,cond);
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