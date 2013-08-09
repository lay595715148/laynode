var util        = require('util');
var querystring = require('querystring');
var url         = require('url');
var fs          = require('fs');

var basepath    = __dirname;
var rootpath    = __dirname + '\\..';
var instance    = null;

global._laynode_basepath = basepath;//string 非引用
global._laynode_rootpath = rootpath;//string 非引用

var config      = require('./config.js');

global._laynode_config = config;

var configs     = config.configs;
var actions     = config.actions;
var beans       = config.beans;
var services    = config.services;
var stores      = config.stores;
var mapping     = config.mapping;
var classes     = config.classes;
var clazzes     = config.clazzes;

function Laynode() {
}

Laynode.DELIMITER = '.';
Laynode.basepath = function(bp) {
    if('string' == typeof bp && global._laynode_basepath == __dirname && fs.existsSync(bp)) {
        global._laynode_basepath = bp;
        basepath = bp;
    }
};
Laynode.rootpath = function(rp) {
    if('string' == typeof rp && global._laynode_rootpath == __dirname + '\\..' && fs.existsSync(rp)) {
        global._laynode_rootpath = rp;
        rootpath = rp;
    }
};
Laynode.config = function(cs) {
    if('object' == typeof cs) {
        for(var prop in cs) {
            configs[prop] = cs[prop];
        }
    }
};
Laynode.action = function(as, pre) {
    if('object' == typeof as) {
        for(var p in as) {
            if('undefined' !=  typeof actions[p] && !pre) {
                actions[prop + Laynode.DELIMITER + p] = as[p];
            } else if('undefined' ==  typeof actions[p]) {
                actions[p] = as[p];
            }
            if(pre && 'string' == typeof pre) {
                actions[pre + Laynode.DELIMITER + p] = as[p];
            }
        }
    }
};
Laynode.bean = function(bs, pre) {
    if('object' == typeof bs) {
        for(var p in bs) {
            if('undefined' !=  typeof beans[p] && !pre) {
                beans[prop + Laynode.DELIMITER + p] = bs[p];
            } else if('undefined' ==  typeof beans[p]) {
                beans[p] = bs[p];
            }
            if(pre && 'string' == typeof pre) {
                beans[pre + Laynode.DELIMITER + p] = bs[p];
            }
        }
    }
};
Laynode.service = function(ss, pre) {
    if('object' == typeof ss) {
        for(var p in ss) {
            if('undefined' !=  typeof services[p] && !pre) {
                services[prop + Laynode.DELIMITER + p] = ss[p];
            } else if('undefined' ==  typeof services[p]) {
                services[p] = ss[p];
            }
            if(pre && 'string' == typeof pre) {
                services[pre + Laynode.DELIMITER + p] = ss[p];
            }
        }
    }
};
Laynode.store = function(ts, pre) {
    if('object' == typeof ts) {
        for(var p in ts) {
            if('undefined' !=  typeof stores[p] && !pre) {
                stores[prop + Laynode.DELIMITER + p] = ts[p];
            } else if('undefined' ==  typeof stores[p]) {
                stores[p] = ts[p];
            }
            if(pre && 'string' == typeof pre) {
                stores[pre + Laynode.DELIMITER + p] = ts[p];
            }
        }
    }
};
Laynode.mapping = function(ms, pre) {
    if('object' == typeof ms) {
        for(var p in ms) {
            if(p === 'tables') {
                for(var mp in ms[p]) {
                    if('undefined' != typeof mapping['tables'][mp] && !pre) {
                        mapping['tables'][prop + Laynode.DELIMITER + mp] = ms[p][mp];
                    } else if('undefined' ==  typeof mapping['tables'][mp]) {
                        mapping['tables'][mp] = ms[p][mp];
                    }
                    if(pre && 'string' == typeof pre) {
                        mapping['tables'][pre + Laynode.DELIMITER + mp] = ms[p][mp];
                    }
                }
            } else {
                if('undefined' !=  typeof mapping[p] && !pre) {
                    mapping[prop + Laynode.DELIMITER + p] = ms[p];
                } else if('undefined' ==  typeof mapping[p]) {
                    mapping[p] = ms[p];
                }
                if(pre && 'string' == typeof pre) {
                    mapping[pre + Laynode.DELIMITER + p] = ms[p];
                }
            }
        }
    }
};
Laynode.class = function(cs, pre) {
    if('object' == typeof cs) {
        for(var p in cs) {
            if('undefined' !=  typeof classes[p] && !pre) {
                classes[prop + Laynode.DELIMITER + p] = cs[p];
            } else if('undefined' ==  typeof classes[p]) {
                classes[p] = cs[p];
            }
            if(pre && 'string' == typeof pre) {
                classes[pre + Laynode.DELIMITER + p] = cs[p];
            }
        }
    }
};
Laynode.initialize = function() {
    if('object' == typeof configs) {
        for(var prop in configs) {
            var path = rootpath + configs[prop],
                conf = require(path),
                as   = conf.actions,
                bs   = conf.beans,
                ss   = conf.services,
                ts   = conf.stores,
                ms   = conf.mapping,
                cs   = conf.classes,
                pre  = conf.prefix;

            Laynode.action(as, pre);
            Laynode.bean(bs, pre);
            Laynode.service(ss, pre);
            Laynode.store(ts, pre);
            Laynode.mapping(ms, pre);
            Laynode.class(cs, pre);
        }
    }
    //console.log(config);
};
Laynode.start = function(req,res) {
    var laynode = Laynode.getInstance();
        laynode.run(req,res);
};
Laynode.getInstance = function() {
    if(instance == null) {
        instance = new Laynode();
    }
    return instance;
};

Laynode.prototype.run = function(req,res) {
    var st = new Date().getTime();
    var parser  = url.parse(req.url,true);
    var actionName = parser.pathname.substr(1);

    if(actions[actionName] && actions[actionName]['classname']) {
        var actionConfig = actions[actionName];
        var classname = actionConfig['classname'];
        var path = (("undefined" != typeof classes[classname])?classes[classname]:clazzes[classname]);
        var ActionClass = require((path.indexOf(rootpath) == -1)?(rootpath+path):path);//加载类
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
module.exports = Laynode;
