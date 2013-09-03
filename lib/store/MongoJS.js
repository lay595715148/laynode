var util            = require('util');
var mongodb         = require('mongodb');
var mongojs         = require('mongojs');
var Store           = require('../core/Store.js');

function MongoJS(storeConfig) {
    this._link = null;
    this._result = null;
    Store.call(this,storeConfig);
};

util.inherits(MongoJS, Store);

MongoJS.prototype._link;
MongoJS.prototype._result;
MongoJS.prototype.link = function() {
    if(!this._link) {
        this.connect();
    }
    return this._link;
};
MongoJS.prototype.connect = function() {
    logger.log('connect');
    this._link = mongojs(this.config.user + ':' + this.config.password + '@' + this.config.host + ':' + this.config.port + '/' + this.config.database);
    //this._link = new mongodb.Db(this.config.database,new mongodb.Server(this.config.host,this.config.port),{safe:false});
    //logger.log(this._link);
};
MongoJS.prototype.find = function() {
    var me = this;
    var link = me.link();
    var coll = link.collection("lay_sso_oauth2_client");logger.log(link);
    
    
    link.open(function(err) {
        link.coll.find({id:{$gt:0}}, function(err, doc) {
            if(err) {
                me.emit('error',err);
            } else {
                me.emit('find', doc);
                link.close();
            }
        });
    });
};

//module exports
module.exports = MongoJS;
