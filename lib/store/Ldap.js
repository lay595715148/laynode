var util        = require('util');
var ldapjs      = require('ldapjs');
var emitter     = require('events').EventEmitter;
var Store       = require('../core/Store.js');
var Condition   = require('../util/Condition.js');
var Sort        = require('../util/Sort.js');

var config      = global.config;
var mapping     = config.mapping;

function Ldap(storeConfig) {
    Store.call(this, storeConfig);
}

util.inherits(Ldap, Store);

Ldap.prototype.bind = function() {
};
Ldap.prototype.insert = function() {
};
Ldap.prototype.delete = function() {
};
Ldap.prototype.update = function() {
};
Ldap.prototype.select = function() {
};

//module exports
module.exports = Ldap;

