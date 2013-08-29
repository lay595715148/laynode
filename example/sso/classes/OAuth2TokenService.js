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

var OAuth2Token = require('./OAuth2Token.js');

var conf      = require('../sso.js');

function OAuth2TokenService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2TokenService, Service);

OAuth2TokenService.prototype.gen = function(clientID, userID, refresh) {
    refresh = refresh || false;
    console.log('gen token', refresh);
    var me = this;
    var access_token = false;
    var refresh_token = false;
    var oauth2token = new OAuth2Token();
    var needAccess = true;
    var accessToken = MD5.hex_md5(Util.guid());
    var refreshToken = MD5.hex_md5(Util.guid());
    var time = Math.floor(new Date().getTime()/1000);
    var accessExpires = time + conf.access_token_lifetime;
    var refreshExpires = time + conf.refresh_token_lifetime;
    
    oauth2token.setToken(accessToken);
    oauth2token.setClientID(clientID);
    oauth2token.setType(1);
    oauth2token.setUserid(userID);
    oauth2token.setExpires(accessExpires);
    var table  = oauth2token.toTable();
    var fields = oauth2token.toInsertFields();
    var values = oauth2token.toValues();
    
    me.store().on('query',function(rows, fs) {
        if(refresh) {
            if(access_token) {
                refresh_token = refreshToken;
            } else {
                access_token = accessToken;
            }
            if(refresh_token) {
                me.emit('data',{method:'gen',result:[access_token,refresh_token]});
            } else {
                oauth2token.setToken(refreshToken);
                oauth2token.setClientID(clientID);
                oauth2token.setType(2);
                oauth2token.setUserid(userID);
                oauth2token.setExpires(refreshExpires);
                values = oauth2token.toValues();console.log('in oauth2tokenservice');
                me.store().insert(table, fields, values, false, false);
            }
        } else {
            access_token = accessToken;
            me.emit('data',{method:'gen',result:[access_token]});
        }
    }).on('error',function(err) {console.log('error in oauth2tokenservice', err);
        me.emit('error',err);
    });
    
    me.store().insert(table, fields, values, false, false);
    
    /*if(refresh) {
        this.emit('data',{method:'gen',result:[MD5.hex_md5(Util.guid()),MD5.hex_md5(Util.guid())]});
    } else {
        this.emit('data',{method:'gen',result:MD5.hex_md5(Util.guid())});
    }*/
};
OAuth2TokenService.prototype.checkSoftToken = function(token,type) {
    console.log('checkSoftToken');
    type = parseInt(type) || 1;
    this.emit('data',{method:'checkSoftToken',result:{token:token,userid:1,type:type}});
};
OAuth2TokenService.prototype.checkToken = function(token,clientid,type) {
    console.log('checkToken');
    type = parseInt(type) || 1;
    this.emit('data',{method:'checkToken',result:{token:token,userid:1,type:type}});
};

//module exports
module.exports = OAuth2TokenService;