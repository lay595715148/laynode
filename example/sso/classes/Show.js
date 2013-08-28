var util   = require('util');
var url    = require('url');

var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var Action   = require(basepath + '/core/Action.js');
var Util     = require(basepath + '/util/Util.js');
var conf     = require('../sso.js');

function Show(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Show, Action);

Show.prototype.init = function() {
    Action.prototype.init.call(this);
};
Show.prototype.launch = function() {
    var me     = this;
    var req    = this.request;
    var res    = this.response;
    var oauth2 = this.services["oauth2"];//new OAuth2();
    var parser = url.parse(req.url, true);
    var token,tokenobj,user;
    var $_GET = Util.toGet(req), $_POST = Util.toPost(req), $_REQUEST = Util.toRequest(req), $_SESSION = Util.toSession(req), $_COOKIE = Util.toCookie(req);
    var callParent = function() { Action.prototype.launch.call(me); };
    //console.log(req.cookies);
    //res.clearCookie('test');
    //console.log(req.cookies);
    
    me.services['show'].on('data',function(data) {
        result = data.result;
        method = data.method;console.log(data);
        if(method === 'find') {
            me.template.push('result',result);
        }
        callParent();
    }).on('error',function(err) {
        me.template.push('error','invalid_userid');
        callParent();
    });
    
    me.services['show'].find();
};
Show.prototype.end = function() {
    var me         = this;
    var req        = this.request;
    var res        = this.response;
    var parser     = url.parse(req.url, true);
    var callParent = function() { Action.prototype.end.call(me); };

    me.template.json();
    callParent();
};
//module exports
module.exports = Show;
