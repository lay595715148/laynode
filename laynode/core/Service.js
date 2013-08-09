var util     = require('util');
var Eventer  = require('./Eventer.js');

var config   = global._laynode_config;
var rootpath = global._laynode_rootpath;
var classes  = config['classes'];
var clazzes  = config['clazzes'];

function Service(serviceConfig) {
    this.config = serviceConfig;
    this.setMaxListeners(0);
    Eventer.call(this);
}

util.inherits(Service, Eventer);

Service.AUTO_INIT = true;
Service.prototype.config;
Service.prototype.store;
Service.prototype.init = function() {
    var serviceConfig = this.config;

    var storename = serviceConfig['store'];
    var storeConfig = {};
    var storeObj = null;
    var autoConnect = false;
    var classname = false;

    if(storename && config['stores'][storename] && config['stores'][storename]['classname']) {
        storeConfig = config['stores'][storename];
        autoConnect = ("undefined" != typeof storeConfig['auto-connect'])?storeConfig['auto-connect']:Config['auto-connect'];
        classname = storeConfig['classname'];
    }
    if(classname) {
        var path  = ("undefined" != typeof classes[classname])?classes[classname]:clazzes[classname];
        var Store = require(( path.indexOf(rootpath) == -1)?(rootpath + path):path );
        storeObj  = new Store(storeConfig);
    }
    if(storeObj) {
        this.store = storeObj;
        if(autoConnect == true) {  
            storeObj.connect.call(storeObj);//init
        }
    }
};

//module exports
module.exports = Service;
