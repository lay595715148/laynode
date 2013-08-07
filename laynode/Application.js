var util        = require('util');
var querystring = require('querystring');
var url         = require('url');
var config      = require('./config.js');

var configs     = config.configs;
var actions     = config.actions;
var beans       = config.beans;
var services    = config.services;
var stores      = config.stores;
var mapping     = config.mapping;
var classes     = config.classes;
var clazzes     = config.clazzes;
var instance    = null;

global._laynode_config = config;

function Application() {
}

Application.DELIMITER = '.';
Application.initialize = function() {
    if('object' == typeof configs) {
        for(var prop in configs) {
            var path = configs[prop],
                conf = require(path),
                as   = conf.actions,
                bs   = conf.beans,
                ss   = conf.services,
                ts   = conf.stores,
                ms   = conf.mapping,
                cs   = conf.classes,
                pre  = conf.prefix;
                //cds  = 
            if('object' == typeof as) {
                for(var p in as) {
                    if('undefined' !=  typeof actions[p] && !pre) {
                        actions[prop + Application.DELIMITER + p] = as[p];
                    } else if('undefined' ==  typeof actions[p]) {
                        actions[p] = as[p];
                    }
                    if(pre && 'string' == typeof pre) {
                        actions[pre + Application.DELIMITER + p] = as[p];
                    }
                }
            }
            if('object' == typeof bs) {
                for(var p in bs) {
                    if('undefined' !=  typeof beans[p] && !pre) {
                        beans[prop + Application.DELIMITER + p] = bs[p];
                    } else if('undefined' ==  typeof beans[p]) {
                        beans[p] = bs[p];
                    }
                    if(pre && 'string' == typeof pre) {
                        beans[pre + Application.DELIMITER + p] = bs[p];
                    }
                }
            }
            if('object' == typeof ss) {
                for(var p in ss) {
                    if('undefined' !=  typeof services[p] && !pre) {
                        services[prop + Application.DELIMITER + p] = ss[p];
                    } else if('undefined' ==  typeof services[p]) {
                        services[p] = ss[p];
                    }
                    if(pre && 'string' == typeof pre) {
                        services[pre + Application.DELIMITER + p] = ss[p];
                    }
                }
            }
            if('object' == typeof ts) {
                for(var p in ts) {
                    if('undefined' !=  typeof stores[p] && !pre) {
                        stores[prop + Application.DELIMITER + p] = ts[p];
                    } else if('undefined' ==  typeof stores[p]) {
                        stores[p] = ts[p];
                    }
                    if(pre && 'string' == typeof pre) {
                        stores[pre + Application.DELIMITER + p] = ts[p];
                    }
                }
            }
            if('object' == typeof ms) {
                for(var p in ms) {
                    if(p === 'tables') {
                        for(var mp in ms[p]) {
                            if('undefined' != typeof mapping['tables'][mp] && !pre) {
                                mapping['tables'][prop + Application.DELIMITER + mp] = ms[p][mp];
                            } else if('undefined' ==  typeof mapping['tables'][mp]) {
                                mapping['tables'][mp] = ms[p][mp];
                            }
                            if(pre && 'string' == typeof pre) {
                                mapping['tables'][pre + Application.DELIMITER + mp] = ms[p][mp];
                            }
                        }
                    } else {
                        if('undefined' !=  typeof mapping[p] && !pre) {
                            mapping[prop + Application.DELIMITER + p] = ms[p];
                        } else if('undefined' ==  typeof mapping[p]) {
                            mapping[p] = ms[p];
                        }
                        if(pre && 'string' == typeof pre) {
                            mapping[pre + Application.DELIMITER + p] = ms[p];
                        }
                    }
                }
            }
            if('object' == typeof cs) {
                for(var p in cs) {
                    if('undefined' !=  typeof classes[p] && !pre) {
                        classes[prop + Application.DELIMITER + p] = cs[p];
                    } else if('undefined' ==  typeof classes[p]) {
                        classes[p] = cs[p];
                    }
                    if(pre && 'string' == typeof pre) {
                        classes[pre + Application.DELIMITER + p] = cs[p];
                    }
                }
            }
        }
    }
    //console.log(config);
};
Application.start = function(req,res) {
    var application = Application.getInstance();
        application.run(req,res);
};
Application.getInstance = function() {
    if(instance == null) {
        instance = new Application();
    }
    return instance;
};

Application.prototype.run = function(req,res) {
    var st = new Date().getTime();
    var parser  = url.parse(req.url,true);
    var actionName = parser.pathname.substr(1);
    var suffix = '../';

    if(actions[actionName] && actions[actionName]['classname']) {
        var actionConfig = actions[actionName];
        var classname = actionConfig['classname'];
        var path = suffix+ (("undefined" != typeof classes[classname])?classes[classname]:clazzes[classname]);
        var ActionClass = require(path);//加载类
        var actionObj = new ActionClass(actionConfig);
		var Action = require('./core/Action.js');

        Action.request = req;
        Action.response = res;
        actionObj.on('init',function() {
            console.log('event init');
            actionObj.init.call(actionObj);
        }).on('dispatch',function() {
            console.log('event dispatch');
            if('undefined' == typeof actionConfig['auto-dispatch'] || 'boolean' != typeof actionConfig['auto-dispatch']) {
                actionConfig['auto-dispatch'] = true;
            }
            if(actionConfig['auto-dispatch']) {
                actionObj.dispatch.call(actionObj);
            } else {
                actionObj.launch.call(actionObj, req, res);
            }
        }).on('launch',function() {
            console.log('event launch');
            actionObj.end.call(actionObj,req,res);
        }).on('end',function() {
            console.log('event end');
            var et = new Date().getTime();
            console.log('st: ' + st + ' ---- et: ' + et);
        }).on('error',function() {
            console.log('event error');
            var et = new Date().getTime();
            console.log('Error ==== st: ' + st + ' ---- et: ' + et);
        });
        actionObj.emit('init');
    } else {
        res.end('error');
    }
};

// Module exports;
module.exports = Application;
