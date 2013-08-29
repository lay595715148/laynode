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

function OAuth2UserService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2UserService, Service);

OAuth2UserService.prototype.checkUser = function(username, password) {
    console.log('checkUser');
    //this.emit('error',{'id':1,'username':'student','password':'','group':1});
    this.emit('data',{method:'checkUser', result:{'id':1, 'username':'student', 'password':'', 'group':1}});
};
OAuth2UserService.prototype.read = function(userid) {
    console.log('read');
    this.emit('data',{method:'read', result:{'id':1, 'username':'student', 'password':'', 'group':1}});
};

//module exports
module.exports = OAuth2UserService;