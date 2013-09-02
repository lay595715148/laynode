var util      = require('util');
var url       = require('url');
var jade      = require('jade');

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
    logger.log('gen token', refresh);
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
    
    me.store().once('query',function(rows, fs) {
        if(refresh) {
            if(access_token) {
                refresh_token = refreshToken;
            } else {
                access_token = accessToken;
            }
            if(refresh_token) {
                me.emit('data',{method:'gen',result:[access_token,refresh_token]});
                //me.clean();//清除过期的
            } else {
                oauth2token.setToken(refreshToken);
                oauth2token.setClientID(clientID);
                oauth2token.setType(2);
                oauth2token.setUserid(userID);
                oauth2token.setExpires(refreshExpires);
                values = oauth2token.toValues();logger.log('in oauth2tokenservice');
                me.store().insert(table, fields, values, false, false);
            }
        } else {
            access_token = accessToken;
            me.emit('data',{method:'gen',result:access_token});
            //me.clean();//清除过期的
        }
    }).once('error',function(err) {logger.log('error in oauth2tokenservice', err);
        me.emit('error',err);
    });
    
    me.store().insert(table, fields, values, false, false);
};
OAuth2TokenService.prototype.checkSoftToken = function(token,type) {//no client id
    logger.log('checkSoftToken');
    type = parseInt(type) || 1;
    //this.emit('data',{method:'checkSoftToken',result:{token:token,userid:1,type:type}});
    
    var me = this;
    var criteria = {};
    var oauth2token = new OAuth2Token();
    var table = oauth2token.toTable();
    var fields = oauth2token.toFields();
    var tof = oauth2token.toField('token');
    var cif = oauth2token.toField('clientID');
    var tyf = oauth2token.toField('type');
    var exf = oauth2token.toField('expires');
    var time = Math.floor(new Date().getTime()/1000);
    var cond = new Condition();
    
    cond.push(Cell.parseFilterString('expires:>' + time));
    criteria[tof] = token,criteria[exf] = cond,criteria[tyf] = type;logger.log('criteria',criteria);
    
    me.store().once('query',function(rows,fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data',{method:'checkSoftToken',result:oauth2token.rowToArray(rows[0])});
        } else {
            me.emit('error','no correspond token');
        }
    }).once('error',function(err) {
        me.emit('error',err);
    });
    me.store().select(table, fields, criteria);
};
OAuth2TokenService.prototype.checkToken = function(token,clientID,type) {
    logger.log('checkToken');
    type = parseInt(type) || 1;
    var me = this;
    var criteria = {};
    var oauth2token = new OAuth2Token();
    var table = oauth2token.toTable();
    var fields = oauth2token.toFields();
    var tof = oauth2token.toField('token');
    var cif = oauth2token.toField('clientID');
    var tyf = oauth2token.toField('type');
    var exf = oauth2token.toField('expires');
    var time = Math.floor(new Date().getTime()/1000);
    var cond = new Condition();
    
    cond.push(Cell.parseFilterString('expires:>' + time));
    criteria[tof] = token,criteria[cif] = clientID,criteria[exf] = cond,criteria[tyf] = type;
    
    me.store().once('query',function(rows,fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data',{method:'checkToken',result:oauth2token.rowToArray(rows[0])});
        } else {
            me.emit('error','no correspond token');
        }
    }).once('error',function(err) {
        me.emit('error',err);
    });
    me.store().select(table, fields, criteria);
    //this.emit('data',{method:'checkToken',result:{token:token,userid:1,type:type}});
};
OAuth2TokenService.prototype.clean = function() {
    logger.log('clean');
    
    var me = this;
    var oauth2token = new OAuth2Token();
    var table = oauth2token.toTable();
    var exf = oauth2token.toField('expires');
    var time = Math.floor(new Date().getTime()/1000);
    var cond = new Condition();
    
    cond.push(Cell.parseFilterString('expires:<' + time));
    
    me.store().once('query',function(rows,fs) {
        if(rows) {
            logger.log('query delete');
            me.emit('data',{method:'clean',result:rows});
        } else {
            logger.log('delete in error');
            me.emit('error','no correspond code');
        }
    }).once('error',function(err) {
        logger.log('delete error');
        me.emit('error',err);
    });
    me.store().delete(table, cond);
}

//module exports
module.exports = OAuth2TokenService;