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

var OAuth2User= require('./OAuth2User.js');

function OAuth2UserService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2UserService, Service);

OAuth2UserService.prototype.checkUser = function(username, password) {
    console.log('checkUser');
    var oauth2user = new OAuth2User();

    var me = this;
    var table = oauth2user.toTable();
    var fields = oauth2user.toFields();
    var cusf = oauth2user.toField('username');
    var cpaf = oauth2user.toField('password');
    var cond = {};
    cond[cusf] = username;cond[cpaf] = MD5.hex_md5(password);
    
    //this.emit('error',{'id':1,'username':'student','password':'','group':1});
    this.store().on('query',function(rows, fields) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data',{method:'checkUser', result:oauth2user.rowToInfoArray(rows[0])});
        } else {
            me.emit('error', 'no correspond user');
        }
    }).on('error',function(err) {
        me.emit('error', err);
    });

    me.store().select(table, fields, cond);
};
OAuth2UserService.prototype.read = function(userID) {
    console.log('read');
    var me = this;
    var cond = {};
    var oauth2user = new OAuth2User();
    var table = oauth2user.toTable();
    var fields = oauth2user.toFields();
    var idf = oauth2user.toField('id');
    cond[idf] = userID;
    
    me.store().on('query',function(rows,fs) {
        if(util.isArray(rows) && rows.length > 0) {
            me.emit('data',{method:'read',result:oauth2user.rowToInfoArray(rows[0])});
        } else {
            me.emit('error','no correspond token');
        }
    }).on('error',function(err) {
        me.emit('error',err);
    });
    me.store().select(table, fields, cond);
};

//module exports
module.exports = OAuth2UserService;