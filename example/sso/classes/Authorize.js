var util   = require('util');
var url    = require('url');
var jade   = require('jade');
var fs     = require('fs');

var rootpath    = global._laynode_rootpath;
var basepath    = global._laynode_basepath;

var Action = require(basepath + '/core/Action.js');
var Util   = require(basepath + '/util/Util.js');
var User   = require('./User.js');
var conf   = require('../sso.js');

function Authorize(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Authorize, Action);

Authorize.prototype.init = function() {
    Action.prototype.init.call(this);
};
Authorize.prototype.launch = function() {
    var me        = this;
    var req       = Action.request;
    var res       = Action.response;
    var parser    = url.parse(req.url, true);
    var authorize = this;
    var params;
    if(req.method == "POST") {
        params = req.body;
        for(var i in parser.query) {
            params[i] = parser.query[i];
        }
        //params = Util.extend(parser.query,params);
    } else {
        params = parser.query;
    }

    var client_id = params.client_id;
    var redirect_uri = params.redirect_uri;
    var callParent = function() { Action.prototype.launch.call(me); };


    this.services["oauth2"].on('finishClientAuthorization',function(result) {
        try {
            if(result.headers && result.headers.length > 0) {
                me.template.header(result.headers);
            }
            me.template.path(conf.template_path);
            me.template.push({pageTitle:'Authorize',client_id:client_id,redirect_uri:redirect_uri});
            me.template.template('/authenticate.jade');
            callParent();
        } catch(e) {
            console.log(e);
            callParent();
        }
    }).on('error',function(error) {
        callParent();
    }).finishClientAuthorization(params, req, res);
};
Authorize.prototype.end = function() {
    var req        = Action.request;
    var res        = Action.response;
    var parser     = url.parse(req.url, true);
    var me         = this;
    var callParent = function() { Action.prototype.end.call(me); };
    
    this.template.display();
    callParent();
};
//module exports
module.exports = Authorize;
