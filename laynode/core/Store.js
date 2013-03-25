var util   = require('util');
var Base   = require('./Base.js');

var config = global.config;

function Store(storeConfig) {
    this.config = storeConfig;
    Base.call(this);
}

util.inherits(Store, Base);

Store.AUTO_CONNECT = true;
Store.prototype.config = null;
Store.prototype.connect = function() {};//implements by child

//module exports
module.exports = Store;
