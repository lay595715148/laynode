var util    = require('util');
var Base    = require('./Base.js');

var config  = global.config;
var classes = config['classes'];
var clazzes = config['clazzes'];

function Service(serviceConfig) {
    this.config = serviceConfig;
    Base.call(this);
}

util.inherits(Service, Base);

Service.AUTO_INIT = true;
Service.prototype.config;
Service.prototype.store;
Service.prototype.init = function() {
    var serviceConfig = this.config;
    var suffix = '../../';

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
        var path  = suffix + (("undefined" != typeof classes[classname])?classes[classname]:clazzes[classname]);
        var Store = require(path);
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
