var util   = require('util');
var url    = require('url');
var jade   = require('jade');
var fs     = require('fs');

var rootpath     = global._laynode_rootpath;
var basepath     = global._laynode_basepath;

var Action       = require(basepath + '/core/Action.js');
var Util         = require(basepath + '/util/Util.js');
var User         = require('./User.js');
var OAuth2Client = require('./OAuth2Client.js');
var conf         = require('../sso.js');

function Authorize(actionConfig) {
    Action.call(this, actionConfig);
}
/**
 * <Authorize> inherits <Action>
 */
util.inherits(Authorize, Action);

/**
 * must call parent method ::init(),after ::init() go into method ::dispatch() or ::launch(),
 * so you can do like this:
 * {
 *     Action.prototype.init.call(this);
 *     this.template.path(conf.template_path);
 * }
 */
Authorize.prototype.init = function() {
    Action.prototype.init.call(this);
    this.template.path(conf.template_path);
};
/**
 * must call parent method ::launch() or emit event 'launch',
 * if dispatch to other method,you must do it in that method.
 * 
 * All of this has no returns,you need push result into {this.template} that is an object of Template.
 */
Authorize.prototype.launch = function() {console.log('Authorize launch');
    var me        = this;
    var req       = this.request;
    var res       = this.response;
    var parser    = url.parse(req.url, true);
    var oauth2client,client,result,method;
    var params;
    var $_GET = Util.toGet(req), $_POST = Util.toPost(req), $_REQUEST = Util.toRequest(req);
    var response_type = parser.query['response_type'] || 'code';
    var outHTML = me.services['oauth2'].checkRequest(req);
    var callParent = function() { Action.prototype.launch.call(me); };
    
    me.services["oauth2client"].on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkSoftClient') {
            client = result;
            me.template.push({pageTitle:'Authorize',response_type:response_type,client_id:$_GET.client_id,redirect_uri:$_GET.redirect_uri});
            me.template.css('login.css');
            me.template.template('/tpl_oauth2_login.jade');
        }
        callParent();
    }).on('error',function(err) {
        me.template.push('error','invalid_client');
        callParent();
    });


    if(outHTML) {
        oauth2client = new OAuth2Client();
        console.log('outHTML');
        oauth2client.setClientID($_GET['client_id']);
        oauth2client.setRedirectURI($_GET['redirect_uri']);
        me.services["oauth2client"].checkSoftClient(oauth2client);
    } else {
        me.template.push('error','invalid_request');
        callParent();
    }
};
/**
 * like this which is dispathed from method ::dispatch(),you need call parent method ::launch() or emit event 'launch'.
 */
Authorize.prototype.submit = function() {console.log('Authorize submit');
    var me        = this;
    var req       = this.request;
    var res       = this.response;
    var parser    = url.parse(req.url, true);
    var oauth2client,client,result,method,user;
    var response_type = parser.query['response_type'] || 'code';
    var params;
    var $_GET = Util.toGet(req), $_POST = Util.toPost(req), $_REQUEST = Util.toRequest(req), $_SESSION = Util.toSession(req);
    var callParent = function() { Action.prototype.launch.call(me); };
    
    me.services['oauth2user'].on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkUser') {
            user = result;
            $_SESSION['userID'] = user.id;
            $_SESSION['userName'] = user.username;
            if(response_type == 'token') {
                me.services['oauth2token'].gen(client,$_SESSION['userID'],conf.use_refresh_token);
            } else {
                me.services['oauth2code'].gen(client,$_SESSION['userID']);
            }
        } else {
            callParent();
        }
    }).on('error', function(err) {
        me.template.push('error',err);
        callParent();
    });
    me.services['oauth2client'].on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkClient') {
            client = result;
            if($_SESSION['userID'] && $_SESSION['userName']) {
                if(response_type == 'token') {
                    me.services['oauth2token'].gen(client, $_SESSION['userID'], conf.use_refresh_token);
                } else {
                    me.services['oauth2code'].gen(client, $_SESSION['userID']);
                }
            } else {
                me.services['oauth2user'].checkUser($_POST['username'],$_POST['password']);
            }
        } else {
            callParent();
        }
    }).on('error', function(err) {
        me.template.push('error','invalid_client');
        callParent();
    });
    me.services['oauth2code'].on('data',function(data) {
        result = data.result;
        method = data.method;console.log(data);
        if(method === 'gen') {
            var code = result;
            me.template.header('Status', 302);
            me.template.header('Location:' + client['redirectURI'] + '?code=' + encodeURIComponent(code));
        }
        callParent();
    }).on('error', function(err) {
        me.template.push('error',err);
        callParent();
    });
    me.services['oauth2token'].on('data',function(data) {
        result = data.result;
        method = data.method;console.log(result);
        if(method === 'gen') {
            if(conf.use_refresh_token) {
                var token = result[0];
                var rtoken = result[1];
                me.template.push('userid',$_SESSION['userID']);
                me.template.push('access_token',token);
                me.template.push('expires',conf.access_token_lifetime);
                me.template.push('refresh_token',rtoken);
                me.template.push('refresh_expires',conf.refresh_token_lifetime);
                me.template.header('Status', 302);
                me.template.header('Location', client['redirectURI'] + '#token=' + encodeURIComponent(token) + '&expires=' + conf.access_token_lifetime + '&refresh_token=' + encodeURIComponent(rtoken) + '&refresh_expires=' + conf.refresh_token_lifetime);
            } else {
                var token = result;
                me.template.push('userid',$_SESSION['userID']);
                me.template.push('access_token',token);
                me.template.push('expires',conf.access_token_lifetime);
                me.template.header('Status', 302);
                me.template.header('Location', client['redirectURI'] + '#token=' + encodeURIComponent(token) + '&expires=' + conf.access_token_lifetime);
            }
        }
        callParent();
    }).on('error', function(err) {
        me.template.push('error',err);
        callParent();
    });
    
    var outHTML = me.services['oauth2'].checkRequest(req);
    if(outHTML) {
        oauth2client = new OAuth2Client();
        oauth2client.setClientID($_GET['client_id']);
        oauth2client.setClientType((response_type == 'token')?3:1);
        oauth2client.setRedirectURI($_GET['redirect_uri']);
        client = oauth2client.toArray();
        if('undefined' == typeof $_POST['username'] || 'undefined' == typeof $_POST['password']) {
            if($_SESSION['userID'] && $_SESSION['userName']) {
                outHTML = me.services['oauth2client'].checkClient(oauth2client);
            } else {
                me.template.push('error','invalid_request');
                callParent();
            }
        } else {
            outHTML = me.services['oauth2client'].checkClient(oauth2client);
        }
    } else {
        me.template.push('error','invalid_request');
        callParent();
    }
    
};
/**
 * must call parent method ::end() or emit event 'end'
 */
Authorize.prototype.end = function() {
    var req        = this.request;
    var res        = this.response;
    var parser     = url.parse(req.url, true);
    var me         = this;
    var callParent = function() { Action.prototype.end.call(me); };
    
    this.template.display();
    callParent();
};
//module exports
module.exports = Authorize;
