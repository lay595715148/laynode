var util        = require('util');
var querystring = require('querystring');
var url         = require('url');

var config      = global._laynode_config;logger.log(global._laynode_config);
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
    this._beans = {};
    this._services = {};
    this._template = null;
    this._scope = null;
    Eventer.call(this);
}

util.inherits(Action, Eventer);


Action.DISPATCH_KEY = 'a';
Action.DISPATCH_STYLE = '*';
Action.prototype.config = null;
Action.prototype._beans = {};
Action.prototype._services = {};
Action.prototype._template = null;
Action.prototype._scope = null;
Action.prototype.init = function() {
    logger.log('Into Action::init()');
    //var req = Action.request;
    //var res = Action.response;
    var actionConfig = this.config;
    var beans = actionConfig['beans'];
    var services = actionConfig['services'];

    //this.request = req;
    //this.response = res;
    if(actionConfig['auto-init-bean']) {
        this.initBean(beans);
    }
    if(actionConfig['auto-init-service']) {
        this.initService(services);
    }
    if(actionConfig['auto-init-template']) {
        this.initTemplate();
    }
    this.initScope();
};
Action.prototype.initBean = function(beans) {
    var req = this.request;
    var res = this.response;

    if('object' == typeof beans || 'array' == typeof beans && beans.length > 0) {//动态加载Bean
        for(var index in beans) {
            var beanname = ('object' == typeof beans)?beans[index]:index;
            this.bean(beanname);
        }
    } else if('string' == typeof beans) {
        var beanname = beans;
        this.bean(beanname);
    }//logger.log(this._beans);
};
Action.prototype.bean = function(beanname) {
    if(!this._beans[beanname]) {
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
        } else {
            throw new Error('no bean reference!');
        }
        if(classname) {
            var path = (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
            var BeanClass = require((path.indexOf(rootpath) == -1)?(rootpath+path):path);
        } else {
            throw new Error('no class name for bean!');
        }
        if(BeanClass) {
            beanObj = new BeanClass();
            this._beans[beanname] = beanObj;
            logger.log('New bean<'+ beanObj._classname +'> instance');
            if(autoBuild == true) {
                beanObj.build.call(beanObj,beanScope);//build
            }
        } else {
            throw new Error('no class file for bean!');
        }
    }
    return this._beans[beanname];
};
Action.prototype.initService = function(services) {
    if('object' == typeof services || 'array' == typeof services && services.length > 0) {//动态加载Service
        for(var index in services) {
            var servicename = ('object' == typeof services)?services[index]:index;
            this.service(servicename);
        }
    } else if('string' == typeof services) {
        var servicename = services;
        this.service(servicename);
    }
};
Action.prototype.service = function(servicename) {
    if(!this._services[servicename]) {
        var serviceConfig = {};
        var serviceObj = null;
        var autoInit = false;
        var classname = false;
        if('string' == typeof servicename && config['services'][servicename] && config['services'][servicename]['classname']) {
            serviceConfig = config['services'][servicename];
            autoInit = ('undefined' != typeof serviceConfig['auto-init'])?serviceConfig['auto-init']:Service.AUTO_INIT;
            classname = serviceConfig['classname'];
        } else {
            throw new Error('no service reference!');
        }
        if(classname) {
            var path = (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
            var ServiceClass = require((path.indexOf(rootpath) == -1)?(rootpath+path):path);
        } else {
            throw new Error('no class name for service!');
        }
        if(ServiceClass) {
            serviceObj  = new ServiceClass(serviceConfig);
            this._services[servicename] = serviceObj;
            logger.log('New service<'+ serviceObj._classname +'> instance');
            if(autoInit == true) {  
                serviceObj.init.call(serviceObj);//init
            }
        } else {
            throw new Error('no class file for service!');
        }
    }
    return this._services[servicename];
};
Action.prototype.initTemplate = function() {
    this.template();
};
Action.prototype.template = function() {
    var req = this.request;
    var res = this.response;
    if(!this._template) {
        this._template = new Template();
        logger.log('New template<'+ this._template._classname +'> instance');
        this._template.init.call(this._template,req,res);
    }
    return this._template;
};
Action.prototype.initScope = function() {
    this.scope();
};
Action.prototype.scope = function() {
    if(!this._scope) {
        this._scope = new Scope(this.request,this.response);
        logger.log('New scope<'+ this._scope._classname +'> instance');
    }
    return this._scope;
};
Action.prototype.dispatch = function() {
    logger.log('Into Action::dispatch()');
    var req    = this.request;
    var res    = this.response;
    var parser = url.parse(req.url,true);
    var qs     = parser.query;
    var method = 'launch';
    var actionConfig = this.config;
    var key    = (actionConfig['dispatch-key'])?actionConfig['dispatch-key']:Action.DISPATCH_KEY;
    var value  = (qs[key])?qs[key]:'';
    var style  = (actionConfig['dispatch-style'])?actionConfig['dispatch-style']:Action.DISPATCH_STYLE;

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
