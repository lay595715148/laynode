var util      = require('util');
var url       = require('url');
var jade      = require('jade');

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
    logger.log('Into OAuth2ClientService::checkSoftClient');
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
    var criteria = {};
    criteria[cidf] = cidv;criteria[redf] = redv;logger.log(criteria);
    
        //logger.log(fields);
    me.store().on('query',function(rows,fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data',{method:'checkSoftClient',result:client.rowToArray(rows[0])});
        } else {
            me.emit('error','no correspond client');
        }
    }).on('error',function(err) {
        logger.log(err);
        me.emit('error',err);
    });
    me.store().select(table,fields,criteria);
};
OAuth2ClientService.prototype.checkClient = function(client) {
    logger.log('Into OAuth2ClientService::checkClient');
    if(!(client instanceof OAuth2Client)) { this.emit('error',{method:'checkClient',result:false});}
    
    var me = this;
    var table = client.toTable();
    var fields = client.toFields();
    var cidf = client.toField('clientID');
    var csef = client.toField('clientSecret');
    var ctyf = client.toField('clientType');
    var redf = client.toField('redirectURI');
    var cidv = client.getClientID();
    var ctyv = client.getClientType();
    var redv = client.getRedirectURI();
    var criteria = {};
    criteria[cidf] = cidv;criteria[ctyf] = ctyv;criteria[redf] = redv;
    
        //logger.log(fields);
    me.store().on('query',function(rows, fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data', {method:'checkClient',result:client.rowToArray(rows[0])});
        } else {
            me.emit('error', 'no correspond client');
        }
    }).on('error', function(err) {
        logger.log(err);
        me.emit('error', err);
    });
    me.store().select(table, fields, criteria);
    
    //this.emit('data',{method:'checkClient',result:{'clientID':'lay_sso_person','clientName':'lay_sso_person','clientType':1,'redirectURI':'/person'}});
};
OAuth2ClientService.prototype.checkHardClient = function(client) {
    logger.log('Into OAuth2ClientService::checkHardClient');
    if(!(client instanceof OAuth2Client)) { this.emit('error',{method:'checkHardClient',result:false});}
    
    var me = this;
    var ret;
    var table = client.toTable();
    var fields = client.toFields();
    var cidf = client.toField('clientID');
    var csef = client.toField('clientSecret');
    var ctyf = client.toField('clientType');
    var redf = client.toField('redirectURI');
    var cidv = client.getClientID();
    var csev = client.getClientSecret();
    var ctyv = client.getClientType();
    var redv = client.getRedirectURI();
    var criteria = {};
    criteria[cidf] = cidv;criteria[csef] = csev;criteria[ctyf] = ctyv;criteria[redf] = redv;
    
        //logger.log(fields);
    me.store().on('query',function(rows, fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data', {method:'checkHardClient', result:client.rowToArray(rows[0])});
        } else {
            me.emit('error', 'no correspond client');
        }
    }).on('error',function(err) {
        logger.log(err);
        me.emit('error',err);
    });
    me.store().select(table, fields, criteria);
};
OAuth2ClientService.prototype.checkSoftHardClient = function(client) {
    logger.log('Into OAuth2ClientService::checkSoftHardClient');
    if(!(client instanceof OAuth2Client)) { this.emit('error',{method:'checkSoftHardClient',result:false});}
    
    var me = this;
    var ret;
    var table = client.toTable();
    var fields = client.toFields();
    var cidf = client.toField('clientID');
    var csef = client.toField('clientSecret');
    var redf = client.toField('redirectURI');
    var cidv = client.getClientID();
    var csev = client.getClientSecret();
    var redv = client.getRedirectURI();
    var criteria = {};
    criteria[cidf] = cidv;criteria[csef] = csev;criteria[redf] = redv;logger.log(criteria);
    
        //logger.log(fields);
    me.store().on('query',function(rows, fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data', {method:'checkSoftHardClient', result:client.rowToArray(rows[0])});
        } else {
            me.emit('error', 'no correspond client');
        }
    }).on('error',function(err) {
        logger.log(err);
        me.emit('error',err);
    });
    me.store().select(table, fields, criteria);
};

//module exports
module.exports = OAuth2ClientService;