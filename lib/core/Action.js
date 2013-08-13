var util        = require('util');
var querystring = require('querystring');
var url         = require('url');

var config      = global._laynode_config;
var rootpath    = global._laynode_rootpath;
var basepath    = global._laynode_basepath;
var Bean        = require(basepath + '/core/Bean.js');
var Service     = require(basepath + '/core/Service.js');
var Template    = require(basepath + '/core/Template.js');
var Scope       = require(basepath + '/util/Scope.js');
var Eventer     = require(basepath + '/core/Eventer.js');

var classes     = config['classes'];
var clazzes     = config['clazzes'];

function Action(actionConfig) {
    this.config = actionConfig;
    this.setMaxListeners(0);
    Eventer.call(this);
}

util.inherits(Action, Eventer);


Action.DISPATCH_KEY = 'a';
Action.DISPATCH_STYLE = '*';
Action.request = undefined;
Action.response = undefined;
Action.prototype.config = null;
Action.prototype.beans = {};
Action.prototype.services = {};
Action.prototype.template = {};
Action.prototype.init = function() {
    //var req = Action.request;
    //var res = Action.response;
    var actionConfig = this.config;
    var beans = actionConfig['beans'];
    var services = actionConfig['services'];

    //this.request = req;
    //this.response = res;
    this.initBean(beans);
    this.initService(services);
    this.initTemplate();
};
Action.prototype.initBean = function(beans) {
    var req = this.request;
    var res = this.response;

    if('object' == typeof beans || 'array' == typeof beans && beans.length > 0) {//动态加载Bean
        Scope.request = req;
        Scope.response = res;
        for(var index in beans) {
            var beanname = ('object' == typeof beans)?beans[index]:index;
            var beanConfig = {};
            var beanScope = 0;
            var beanObj = null;
            var autoBuild = false;
            var classname = false;
            if('string' == typeof beanname && config['beans'][beanname] && config['beans'][beanname]['classname']) {
                beanConfig = config['beans'][beanname];
                autoBuild = ('undefined' != typeof beanConfig['auto-build'])?beanConfig['auto-build']:Bean.AUTO_BUILD;
                beanScope = ('undefined' != typeof beanConfig['scope'])?beanConfig['scope']:Bean.SCOPE;
                classname = beanConfig['classname'];
            }
            if(classname) {
                var path = (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
                var BeanClass = require((path.indexOf(rootpath) == -1)?(rootpath+path):path);
                beanObj = new BeanClass();
            }
            if(beanObj) {
                this.beans[beanname] = beanObj;
                if(autoBuild == true) {
                    beanObj.build.call(beanObj,beanScope);//build
                }
            }
        }
    } else if('string' == typeof beans) {
        var beanname = beans;
        var beanConfig = {};
        var beanObj = null;
        var autoBuild = false;
        var classname = false;
        if(config['beans'][beanname] && config['beans'][beanname]['classname']) {
            beanConfig = config['beans'][beanname];
            autoBuild = ('undefined' != typeof beanConfig['auto-build'])?beanConfig['auto-build']:Bean.AUTO_BUILD;
            beanScope = ('undefined' != typeof beanConfig['scope'])?beanConfig['scope']:Bean.SCOPE;
            classname = beanConfig['classname'];
        }
        if(classname) {
            var path = (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
            var BeanClass = require((path.indexOf(rootpath) == -1)?(rootpath+path):path);
            beanObj = new BeanClass();
        }
        if(beanObj) {
            this.beans[beanname] = beanObj;
            if(autoBuild == true) {
                beanObj.build.call(beanObj,beanScope);//build
            }
        }
    }//console.log(this.beans);
};
Action.prototype.initService = function(services) {
    if('object' == typeof services || 'array' == typeof services && services.length > 0) {//动态加载Service
        for(var index in services) {
            var servicename = ('object' == typeof services)?services[index]:index;
            var serviceConfig = {};
            var serviceObj = null;
            var autoInit = false;
            var classname = false;
            if('string' == typeof servicename && config['services'][servicename] && config['services'][servicename]['classname']) {
                serviceConfig = config['services'][servicename];
                autoInit = ('undefined' != typeof serviceConfig['auto-init'])?serviceConfig['auto-init']:Service.AUTO_INIT;
                classname = serviceConfig['classname'];
            }
            if(classname) {
                var path = (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
                var ServiceClass = require((path.indexOf(rootpath) == -1)?(rootpath+path):path);
                serviceObj  = new ServiceClass(serviceConfig);
            }
            if(serviceObj) {
                this.services[servicename] = serviceObj;
                if(autoInit == true) {  
                    serviceObj.init.call(serviceObj);//init
                }
            }
        }
    } else if('string' == typeof services) {
        var servicename = services;
        var serviceConfig = {};
        var serviceObj = null;
        var autoInit = false;
        var classname = false;
        if(config['services'][servicename] && config['services'][servicename]['classname']) {
            serviceConfig = config['services'][servicename];
            autoInit = ('undefined' != typeof serviceConfig['auto-init'])?serviceConfig['auto-init']:Service.AUTO_INIT;
            classname = serviceConfig['classname'];
        }
        if(classname) {
            var path = (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
            var ServiceClass = require((path.indexOf(rootpath) == -1)?(rootpath+path):path);
            serviceObj  = new ServiceClass(serviceConfig);
        }
        if(serviceObj) {
            this.services[servicename] = serviceObj;
            if(autoInit == true) {  
                serviceObj.init.call(serviceObj);//init
            }
        }
    }
};
Action.prototype.initTemplate = function() {
    var req    = this.request;
    var res    = this.response;
    this.template = new Template();
    this.template.init.call(this.template,req,res);
};
Action.prototype.dispatch = function() {
    var req    = this.request;
    var res    = this.response;
    var parser = url.parse(req.url,true);
    var qs     = parser.query;
    var method = 'launch';
    var key    = (this.config['dispatch-key'])?this.config['dispatch-key']:Action.DISPATCH_KEY;
    var value  = (qs[key])?qs[key]:'';
    var style  = (this.config['dispatch-style'])?this.config['dispatch-style']:Action.DISPATCH_STYLE;

    if(value) {
        method = style.replace(/\*/,value);//Up first word,.substr(0,1).toUpperCase() + value.substr(1)
    }
    if('function' == typeof this[method]) {
        this.emit('dispatch',method);
    } else {
        this.emit('dispatch','launch');
    }
};
Action.prototype.launch = function() { this.emit('launch'); };//implements in child
Action.prototype.end = function() { this.emit('end'); };//implements in child

//module exports
module.exports = Action;
