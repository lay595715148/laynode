var util   = require('util');
var url    = require('url');

var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var Action   = require(basepath + '/core/Action.js');
var Util     = require(basepath + '/util/Util.js');
var conf     = require('../sso.js');

function Resource(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Resource, Action);

Resource.prototype.headers;
Resource.prototype.content;
Resource.prototype.init = function() {
    Action.prototype.init.call(this);
};
Resource.prototype.launch = function() {
    var me     = this;
    var req    = this.request;
    var res    = this.response;
    var oauth2 = this.services["oauth2"];//new OAuth2();
    var parser = url.parse(req.url, true);
    var token,tokenobj,user;
    var $_GET = {}, $_POST = {}, $_REQUEST = {}, $_SESSION = {};
    var outHTML = me.services['oauth2'].checkRequest(req,'show');
    var callParent = function() { Action.prototype.launch.call(me); };
    
    if(req.method == "POST") {
        $_GET = req.query;
        $_POST = req.body;
        $_REQUEST = Util.extend(Util.clone($_GET),Util.clone($_POST));
    } else {
        $_GET = req.query;
        $_REQUEST = $_GET;
    }
    
    me.services['oauth2user'].on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'read') {
            user = result;
            me.template.push(user);
        }
        callParent();
    }).on('error',function(err) {
        me.template.push('error','invalid_userid');
        callParent();
    });
    me.services['oauth2token'].on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkSoftToken') {
            tokenobj = result;
            me.services['oauth2user'].read(tokenobj['userid']);
        } else {
            callParent();
        }
    }).on('error',function(err) {
        me.template.push('error','invalid_access_token');
        callParent();
    });
    
    if(outHTML) {
        token = $_POST['access_token'];
        me.services['oauth2token'].checkSoftToken(token,1);
    } else {
        me.template.push('error','invalid_request');
        callParent();
    }
};
Resource.prototype.end = function() {
    var me         = this;
    var req        = this.request;
    var res        = this.response;
    var parser     = url.parse(req.url, true);
    var callParent = function() { Action.prototype.end.call(me); };

    me.template.json();
    callParent();
};
//module exports
module.exports = Resource;
