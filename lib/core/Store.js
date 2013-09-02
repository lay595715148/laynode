var util    = require('util');

var config   = global._laynode_config;
var Eventer  = require(basepath + '/core/Eventer.js');

function Store(storeConfig) {
    this.config = storeConfig;
    this.setMaxListeners(0);
    Eventer.call(this);
}

util.inherits(Store, Eventer);

Store.AUTO_CONNECT = true;
Store.prototype.config = null;
Store.prototype.connect = function() {};//implements by child

//module exports
module.exports = Store;
