var util        = require('util');
var querystring = require('querystring');
var url         = require('url');
var Bean        = require('../core/Bean.js');
var Service     = require('../core/Service.js');
var Scope       = require('../util/Scope.js');
var Base        = require('./Base.js');

var config      = global.config;
var classes     = config['classes'];
var clazzes     = config['clazzes'];

function Action(actionConfig) {
    this.config = actionConfig;
    Base.call(this);
}

util.inherits(Action, Base);

Action.DISPATCH_KEY = 'key';
Action.DISPATCH_STYLE = 'do*';
Action.prototype.config = null;
Action.prototype.beans = {};
Action.prototype.services = {};
Action.prototype.init = function(req, res) {
    var actionConfig = this.config;
    var beans = actionConfig['beans'];
    var services = actionConfig['services'];
    var suffix = '../../';

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
                var path = suffix+ (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
                var BeanClass = require(path);
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
            var path = suffix+ (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
            var BeanClass = require(ptah);
            beanObj = new BeanClass();
        }
        if(beanObj) {
            this.beans[beanname] = beanObj;
            if(autoBuild == true) {
                beanObj.build.call(beanObj,beanScope);//build
            }
        }
    }console.log(this.beans);

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
                var path = suffix+ (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
                var ServiceClass = require(path);
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
            var path = suffix+ (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
            var ServiceClass = require(path);
            serviceObj  = new ServiceClass(serviceConfig);
        }
        if(serviceObj) {
            this.services[servicename] = serviceObj;
            if(autoInit == true) {  
                serviceObj.init.call(serviceObj);//init
            }
        }
    }
    this.emit('dispatch');
};
Action.prototype.dispatch = function(req, res) {
    var parser = url.parse(req.url,true);
    var qs     = parser.query;
    var method = 'launch';
    var key    = (this.config['dispatch-key'])?this.config['dispatch-key']:Action.DISPATCH_KEY;
    var value  = (qs[key])?qs[key]:'';
    var style  = (this.config['dispatch-style'])?this.config['dispatch-style']:Action.DISPATCH_STYLE;

    if(value) {
        method = style.replace(/\*/,value.substr(0,1).toUpperCase() + value.substr(1));//Up first word
    }
    if('function' == typeof this[method]) {
        this[method].call(this, req, res);
    } else {
        this.emit('error');
    }
};
Action.prototype.launch = function(req, res) { this.emit('launch'); };//implements in child
Action.prototype.end = function(req, res) { this.emit('end'); };//implements in child

//module exports
module.exports = Action;