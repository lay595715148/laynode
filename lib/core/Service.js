var util     = require('util');

var config   = global._laynode_config;
var Eventer  = require(basepath + '/core/Eventer.js');

var classes  = config['classes'];
var clazzes  = config['clazzes'];

function Service(serviceConfig) {
    this.config = serviceConfig;
    this.setMaxListeners(0);
    this._store = null;
    Eventer.call(this);
}

util.inherits(Service, Eventer);

Service.AUTO_INIT = true;
Service.prototype.config = null;
Service.prototype._store = null;
Service.prototype.init = function() {
    if(this.config['auto-init-store']) {
        this.store();
    }
};
Service.prototype.store = function() {
    if(!this._store) {
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
            var StoreClass = require(( path.indexOf(rootpath) == -1)?(rootpath + path):path );
        }
        if(StoreClass) {
            storeObj  = new StoreClass(storeConfig);
            this._store = storeObj;
            if(autoConnect == true) {  
                storeObj.connect.call(storeObj);//init
            }
        }
    }
    return this._store;
};

//module exports
module.exports = Service;
