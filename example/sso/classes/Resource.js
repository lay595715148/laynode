var util   = require('util');
var url    = require('url');

var Action   = require(basepath + '/core/Action.js');
var Util     = require(basepath + '/util/Util.js');
var conf     = require('../sso.js');

function Resource(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Resource, Action);

Resource.prototype.init = function() {
    Action.prototype.init.call(this);
};
Resource.prototype.launch = function() {
    var me     = this;
    var req    = this.request;
    var res    = this.response;
    //var oauth2 = this.services["oauth2"];//new OAuth2();
    //var parser = url.parse(req.url, true);
    var token,tokenobj,user;
    var $_GET = me.scope().get(), $_POST = me.scope().post(), $_REQUEST = me.scope().request(), $_SESSION = me.scope().session();
    var outHTML = me.service('oauth2').checkRequest($_GET, $_POST, $_REQUEST, 'show');
    var callParent = function() { me.emit('launch'); };
    
    me.service('oauth2user').on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'read') {
            user = result;
            me.template().push(user);
        }
        callParent();
    }).on('error',function(err) {
        me.template().push('error','invalid_userid');
        callParent();
    });
    me.service('oauth2token').on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkSoftToken') {
            tokenobj = result;
            me.service('oauth2user').read(tokenobj['userid']);
        } else {
            callParent();
        }
    }).on('error',function(err) {
        me.template().push('error','invalid_access_token');
        callParent();
    });
    
    if(outHTML) {
        token = $_POST['access_token'];
        me.service('oauth2token').checkSoftToken(token,1);
    } else {
        me.template().push('error','invalid_request');
        callParent();
    }
};
Resource.prototype.end = function() {
    var me         = this;
    var req        = this.request;
    var res        = this.response;
    //var parser     = url.parse(req.url, true);
    var callParent = function() { me.emit('end'); };

    me.template().json();
    callParent();
};
//module exports
module.exports = Resource;
