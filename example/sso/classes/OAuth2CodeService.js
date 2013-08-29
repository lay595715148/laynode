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
var OAuth2Code = require('./OAuth2Code.js');

var conf      = require('../sso.js');

function OAuth2CodeService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2CodeService, Service);

OAuth2CodeService.prototype.gen = function(clientID, redirectURI, userID) {
    console.log('gen code');
    var me = this;
    var code = MD5.hex_md5(Util.guid());
    var oauth2code = new OAuth2Code();
    var expires = Math.floor(new Date().getTime()/1000) + conf.auth_code_lifetime;
    oauth2code.setCode(code);
    oauth2code.setClientID(clientID);
    oauth2code.setRedirectURI(redirectURI);
    oauth2code.setUserid(userID);
    oauth2code.setExpires(expires);
    
    var table  = oauth2code.toTable();
    var fields = oauth2code.toInsertFields();
    var values = oauth2code.toValues();
    
    me.store().on('query', function(rows, fields) {
        console.log(rows);
        me.emit('data',{method:'gen',result:code});
    }).on('error', function(err) {
        me.emit('error', err);
    });
    me.store().insert(table, fields, values, false, false);
};
OAuth2CodeService.prototype.checkCode = function(code, clientID) {
    console.log('checkCode');
    
    var me = this;
    var cond = {};
    var oauth2code = new OAuth2Code();
    var table = oauth2code.toTable();
    var fields = oauth2code.toFields();
    var cof = oauth2code.toField('code');
    var cif = oauth2code.toField('clientID');
    cond[cof] = code,cond[cif] = clientID;
    
    me.store().on('query',function(rows,fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data',{method:'checkCode',result:oauth2code.rowToArray(rows[0])});
        } else {
            me.emit('error','no correspond code');
        }
    }).on('error',function(err) {
        me.emit('error',err);
    });
    me.store().select(table, fields, cond);
    
    //this.emit('data',{method:'checkCode',result:{code:code,clientID:clientID,userid:'lay'}});
};

//module exports
module.exports = OAuth2CodeService;