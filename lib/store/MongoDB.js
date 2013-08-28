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
    Store.call(this,storeConfig);
};

util.inherits(MongoDB, Store);

MongoDB.prototype.link;
MongoDB.prototype.result;
MongoDB.prototype.connect = function() {
    //this.link = mongodb.createConnection(this.config);
    //this.link.connect();
    //mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/test',function() {
    //});
    this.link = new mongodb.Db(this.config.database,new mongodb.Server(this.config.host,this.config.port),{safe:false});
    //this.collection = this.link.collection("simple_document_insert_collection_no_safe");
};
MongoDB.prototype.find = function() {
    var me = this;console.log(me);
    if(!me.link) {
        me.connect();
    }
    
    me.link.open(function(err, db) {
        me.link.authenticate(me.config.user, me.config.password, function(err, res) {
            if(err) {
                me.emit('error',err);
            } else {
                var coll = me.link.collection("lay_sso_oauth2_client");
                coll.findOne({client_id:'lay_sso_person'}, function(err, result) {
                    if(err) {
                        me.emit('error',err);
                    } else {
                        me.emit('find',result);
                        me.link.close();
                    }
                });
            }
        });

    });
};

//module exports
module.exports = MongoDB;
