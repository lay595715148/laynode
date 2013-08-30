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
    
    me.store().once('query', function(rows, fields) {
        console.log('query code gen', rows);
        me.emit('data',{method:'gen',result:code});
        me.clean();//清除过期的
    }).on('error', function(err) {
        me.emit('error', err);
    });
    me.store().insert(table, fields, values, false, false);
};
OAuth2CodeService.prototype.checkCode = function(code, clientID) {
    console.log('checkCode');
    
    var me = this;
    var criteria = {};
    var oauth2code = new OAuth2Code();
    var table = oauth2code.toTable();
    var fields = oauth2code.toFields();
    var cof = oauth2code.toField('code');
    var cif = oauth2code.toField('clientID');
    var exf = oauth2code.toField('expires');
    var time = Math.floor(new Date().getTime()/1000);
    var cond = new Condition();
    
    cond.push(Cell.parseFilterString('expires:>' + time));
    criteria[cof] = code,criteria[exf] = cond,criteria[cif] = clientID;
    
    me.store().once('query',function(rows,fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data',{method:'checkCode',result:oauth2code.rowToArray(rows[0])});
        } else {
            me.emit('error','no correspond code');
        }
    }).on('error',function(err) {
        me.emit('error',err);
    });
    me.store().select(table, fields, criteria);
};
OAuth2CodeService.prototype.clean = function() {
    console.log('clean');
    
    var me = this;
    var oauth2code = new OAuth2Code();
    var table = oauth2code.toTable();
    var exf = oauth2code.toField('expires');
    var time = Math.floor(new Date().getTime()/1000);
    var cond = new Condition();
    
    cond.push(Cell.parseFilterString('expires:<' + time));
    
    me.store().once('query',function(rows,fs) {
        if(rows) {
            console.log('query delete');
            me.emit('data',{method:'clean',result:rows});
        } else {
            console.log('delete in error');
            me.emit('error','no correspond code');
        }
    }).on('error',function(err) {
        console.log('delete error');
        me.emit('error',err);
    });
    me.store().delete(table, cond);
}

//module exports
module.exports = OAuth2CodeService;