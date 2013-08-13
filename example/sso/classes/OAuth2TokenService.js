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

var conf      = require('../sso.js');

function OAuth2TokenService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2TokenService, Service);

OAuth2TokenService.prototype.gen = function(client,userid,refresh) {
	refresh = refresh || false;
    console.log('gen',this.store);
	this.store.once('data',function() {
	});
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