var util           = require('util');
var mongodb        = require('mongodb');
var DB             = mongodb.Db,
    MongoClient    = mongodb.MongoClient,
    Server         = mongodb.Server,
    ReplSetServers = mongodb.ReplSetServers,
    ObjectID       = mongodb.ObjectID,
    Binary         = mongodb.Binary,
    GridStore      = mongodb.GridStore,
    Grid           = mongodb.Grid,
    Code           = mongodb.Code,
    BSON           = mongodb.pure().BSON;
var assert  = require('assert');
var Store   = require('../core/Store.js');
var config  = require('../config.js');

function MongoDB(storeConfig) {
    this._link = null;
    Store.call(this,storeConfig);
};

util.inherits(MongoDB, Store);

MongoDB.prototype._link;
MongoDB.prototype._result;
MongoDB.prototype.link = function() {
    if(!this._link) {
        this.connect();
    }
    return this._link;
};
MongoDB.prototype.connect = function() {
    this._link = new mongodb.Db(this.config.database,new mongodb.Server(this.config.host,this.config.port),{safe:false});
};
/**
 * @param callback function(err, res) {};
 */
MongoDB.prototype.auth = function(callback) {
    var me = this;
    var link = me.link();
    
    link.open(function(err) {
        if(err) {
            callback(err, false);
        } else {
            link.authenticate(me.config.user, me.config.password, function(err, res) {
                callback(err, res);
            });
        }
    });
};
MongoDB.prototype.find = function() {
    var me = this;
    var link = me.link();
    
    me.auth(function(err, res) {
        if(err) {
            me.emit('error',err);
        } else {
            var coll = link.collection("lay_sso_oauth2_client");
            coll.findOne({client_id:'lay_sso_person'}, function(err, result) {console.log(11);
                if(err) {
                    me.emit('error',err);
                } else {
                    me.emit('find',result);
                    link.close();
                }
            });
        }
    });
};

//module exports
module.exports = MongoDB;
