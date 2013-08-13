var util    = require('util');
var mongodb = require('mongodb');
var Store   = require('../core/Store.js');
var config  = require('../config.js');

function MongoDB(storeConfig) {
    Store.call(this,storeConfig);
};

util.inherits(MongoDB, Store);

//module exports
module.exports = MongoDB;
