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
var lang      = require('../lang/lang.js');
var conf      = require('../sso.js');

function ShowService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(ShowService, Service);

ShowService.prototype.find = function(req) {
	var me = this;
	
	me.store.on('find',function(result) {
		console.log();
		me.emit('data',{method:'find',result:true});
	}).on('error',function(err) {
		me.emit('error',{method:'find',result:false});
	});
	me.store.find();
}

//module exports
module.exports = ShowService;
