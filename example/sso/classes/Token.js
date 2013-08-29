var util     = require('util');
var url      = require('url');

var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var Action   = require(basepath + '/core/Action.js');
var Util     = require(basepath + '/util/Util.js');

var OAuth2Client = require('./OAuth2Client.js');
var OAuth2User   = require('./OAuth2User.js');

var conf         = require('../sso.js');

function Token(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Token, Action);

Token.prototype.headers;
Token.prototype.content;
Token.prototype.init = function() {
    Action.prototype.init.call(this);
};
Token.prototype.launch = function() {
    var me     = this;
    var req    = this.request;
    var res    = this.response;
    //var parser = url.parse(req.url, true);
    var oauth2client,client,codeobj,code,oauth2user,user,userid,method,result;
    var $_GET = me.scope().get(), $_POST = me.scope().post(), $_REQUEST = me.scope().request(), $_SESSION = me.scope().session();
    var request_type = me.service('oauth2').getRequestType($_REQUEST);
    var outHTML = me.service('oauth2').checkRequest($_GET, $_POST, $_REQUEST, request_type);
    var callParent = function() { me.emit('launch'); };
    
    me.service('oauth2user').on('data',function(data) {
        method = data.method;
        user = data.result;
        if(method === 'checkUser') {
            userid = user['id'];
            me.service('oauth2token').gen(client,user['id'],conf.use_refresh_token);
        } else {
            callParent();
        }
    }).on('error',function(err) {
        me.template().push('error','invalid_gant');
        callParent();
    });
    me.service('oauth2client').on('data',function(data) {
        client = data.result;
        method = data.method;
        if(method === 'checkHardClient') {
            if(code) {
                me.service('oauth2code').checkCode(code,client['clientID']);
            } else {
                oauth2user = new OAuth2User();
                oauth2user.setUsername($_REQUEST['username']);
                oauth2user.setPassword($_REQUEST['password']);
                me.service('oauth2user').checkUser($_REQUEST['username'], $_REQUEST['password']);
            }
        } else if(method === 'checkSoftHardClient') {
            var refresh_token = $_POST['refresh_token'];
            me.service('oauth2token').checkToken(refresh_token,client['clientID'],2);
        } else {
            callParent();
        }
    }).on('error',function(err) {
        me.template().push('error','invalid_client');
        callParent();
    });
    me.service('oauth2code').on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkCode') {
            codeobj = result;
            userid = codeobj['userid'];
            me.service('oauth2token').gen(client,userid,conf.use_refresh_token);
        } else {
            callParent();
        }
    }).on('error',function(err) {
        me.template().push('error','invalid_gant');
        callParent();
    });
    me.service('oauth2token').on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'gen') {
            if(conf.use_refresh_token && request_type != 'refresh_token') {
                var token = result[0];
                var rtoken = result[1];
                me.template().push('userid',userid);
                me.template().push('access_token',token);
                me.template().push('expires',conf.access_token_lifetime);
                me.template().push('refresh_token',rtoken);
                me.template().push('refresh_expires',conf.refresh_token_lifetime);
            } else {
                var token = result;
                me.template().push('userid',userid);
                me.template().push('access_token',token);
                me.template().push('expires',conf.access_token_lifetime);
            }
            callParent();
        } else if(method === 'checkToken') {
            var token = result;
                userid = token['userid'];
            me.service('oauth2token').gen(client,token['userid']);
        } else {
            callParent();
        }
    }).on('error', function(err) {
        me.template().push('error','invalid_request');
        callParent();
    });
    
    if(outHTML) {
        oauth2client = new OAuth2Client();
        oauth2client.setClientID($_GET['client_id']);
        oauth2client.setClientSecret($_GET['client_secret']);
        oauth2client.setRedirectURI($_GET['redirect_uri']);
        if(request_type == 'token') {
            code = $_GET['code'];
            oauth2client.setClientType(1);
            me.service('oauth2client').checkHardClient(oauth2client);
        } else if(request_type == 'password'){
            oauth2client.setClientType(2);
            me.service('oauth2client').checkHardClient(oauth2client);
        } else if(request_type == 'refresh_token') {
            me.service('oauth2client').checkSoftHardClient(oauth2client);
        }
        client = oauth2client.toArray();
    } else {
        me.template().push('error','invalid_request');
        callParent();
    }
};
Token.prototype.end = function() {
    var me         = this;
    var req        = this.request;
    var res        = this.response;
    var parser     = url.parse(req.url, true);
    var callParent = function() { console.log('emit','end');me.emit('end'); };

    me.template().json();
    callParent();
};
//module exports
module.exports = Token;
