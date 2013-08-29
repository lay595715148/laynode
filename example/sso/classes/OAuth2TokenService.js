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

OAuth2TokenService.prototype.gen = function(client,userid,refresh) {
    refresh = refresh || false;
    console.log('gen token');
    var me = this;
    var access_token = '';
    var refresh_token = '';
    var oauth2token = new OAuth2Token();
    var needAccess = true;
    var accessToken = MD5.hex_md5(Util.guid());
    var refreshToken = MD5.hex_md5(Util.guid());
    
    me.store().on('query',function(rows, fields) {
        if(refresh) {
            if(access_token) {
                refresh_token = refreshToken;
            } else {
                access_token = accessToken;
            }
            if(refresh_token) {
                me.emit('data',{method:'gen',result:[access_token,refresh_token]});
            } else {
                me.store().insert(table, fields, values);
            }
        } else {
            me.emit('data',{method:'gen',result:[access_token]});
        }
    }).on('error',function(err) {
        //me.emit('error',err);
    });
    
    //me.store().insert(table, fields, values);
    
    if(refresh) {
        this.emit('data',{method:'gen',result:[MD5.hex_md5(Util.guid()),MD5.hex_md5(Util.guid())]});
    } else {
        this.emit('data',{method:'gen',result:MD5.hex_md5(Util.guid())});
    }
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