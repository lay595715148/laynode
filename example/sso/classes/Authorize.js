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
    this.template().path(conf.template_path);
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
    //var parser    = url.parse(req.url, true);
    var oauth2client,client,result,method;
    var $_GET = me.scope().get(), $_POST = me.scope().post(), $_REQUEST = me.scope().request(), $_SESSION = me.scope().session();
    var response_type = $_REQUEST['response_type'] || 'code';
    var outHTML = me.service('oauth2').checkRequest($_GET, $_POST, $_REQUEST);
    var callParent = function() { console.log('emit','launch');me.emit('launch'); };
    var headerError = function(err) {//if header error,this has called parent
        me.template().error(err);
        callParent();
    };
    
    me.service('oauth2client').on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkSoftClient') {
            client = result;
            if($_SESSION['userID'] && $_SESSION['userName']) {
                me.template().push({'logined':true, 'username':$_SESSION['userName'], 'client_name':client.clientName});
            }
            me.template().push({pageTitle:'Authorize',response_type:response_type,client_id:$_GET.client_id,redirect_uri:$_GET.redirect_uri});
            me.template().css('login.css');
            me.template().template('/tpl_oauth2_login.jade');
            callParent();
        } else {
            headerError('invalid_client');
        }
    }).on('error',function(err) {
        headerError(err);
    });


    if(outHTML) {
        oauth2client = new OAuth2Client();
        console.log('outHTML');
        oauth2client.setClientID($_GET['client_id']);
        oauth2client.setRedirectURI($_GET['redirect_uri']);
        me.service('oauth2client').checkSoftClient(oauth2client);
    } else {
        headerError('invalid_request');
    }
};
/**
 * like this which is dispathed from method ::dispatch(),you need call parent method ::launch() or emit event 'launch'.
 */
Authorize.prototype.submit = function() {console.log('Authorize submit');
    var me        = this;
    var req       = this.request;
    var res       = this.response;
    //var parser    = url.parse(req.url, true);
    var oauth2client,client,result,method,user;
    var $_GET = me.scope().get(), $_POST = me.scope().post(), $_REQUEST = me.scope().request(), $_SESSION = me.scope().session();
    var response_type = $_REQUEST['response_type'] || 'code';
    var outHTML = me.service('oauth2').checkRequest($_GET, $_POST, $_REQUEST);
    var callParent = function() { console.log('emit','launch');me.emit('launch'); };
    var headerError = function(err) {//if header error,this has called parent
        me.template().error(err);
        callParent();
    };
    
    //me.service('oauth2user');
    
    me.service('oauth2user').on('data',function(data) {
        result = data.result;
        method = data.method;
        if(method === 'checkUser') {
            user = result;
            $_SESSION['userID'] = user.id;
            $_SESSION['userName'] = user.username;
            $_SESSION['userGroup'] = user.group;
            if(response_type == 'token') {
                me.service('oauth2token').gen(client.clientID, $_SESSION['userID'], conf.use_refresh_token);
            } else {
                me.service('oauth2code').gen(client.clientID, client.redirectURI, $_SESSION['userID']);
            }
        } else {
            headerError('invalid_user');
        }
    }).on('error', function(err) {
        console.log(err);
        
        me.template().push({'pageTitle':'Authorize', 'response_type':response_type, 'client_id':client.clientID, 'redirect_uri':client.redirectURI});
        me.template().css('login.css');
        me.template().template('/tpl_oauth2_login.jade');
        callParent();
    });
    me.service('oauth2client').on('data',function(data) {
        result = data.result;
        method = data.method;console.log(data);
        if(method === 'checkClient') {
            client = result;//console.log('session',$_POST);$_SESSION['userID'] = false;
            if($_SESSION['userID'] && $_SESSION['userName']) {
                if(response_type == 'token') {
                    me.service('oauth2token').gen(client.clientID, $_SESSION['userID'], conf.use_refresh_token);
                } else {
                    me.service('oauth2code').gen(client.clientID, client.redirectURI, $_SESSION['userID']);
                }
            } else {
                me.service('oauth2user').checkUser($_POST['username'],$_POST['password']);
            }
        } else {
            headerError('invalid_client');
        }
    }).on('error', function(err) {
        console.log(1);
        headerError(err);
    });
    me.service('oauth2code').on('data',function(data) {
        result = data.result;
        method = data.method;
        console.log(data);
        if(method === 'gen') {
            var code = result;
            me.template().header('Status', 302);
            me.template().header('Location:' + client['redirectURI'] + '?code=' + encodeURIComponent(code));
            callParent();
        } else {
            console.log(6);
            headerError('invalid_grant');
        }
    }).on('error', function(err) {
        console.log(2);
        headerError(err);
    });
    me.service('oauth2token').on('data',function(data) {
        result = data.result;
        method = data.method;console.log(result);
        if(method === 'gen') {console.log('userID',$_SESSION);
            if(conf.use_refresh_token) {
                var token = result[0];
                var rtoken = result[1];
                /*me.template().push('userid',$_SESSION['userID']);
                me.template().push('access_token',token);
                me.template().push('expires',conf.access_token_lifetime);
                me.template().push('refresh_token',rtoken);
                me.template().push('refresh_expires',conf.refresh_token_lifetime);*/
                me.template().header('Status', 302);
                me.template().header('Location', client['redirectURI'] + '#userid=' + $_SESSION['userID'] + '&token=' + encodeURIComponent(token) + '&expires=' + conf.access_token_lifetime + '&refresh_token=' + encodeURIComponent(rtoken) + '&refresh_expires=' + conf.refresh_token_lifetime);
            } else {
                var token = result;
                /*me.template().push('userid',$_SESSION['userID']);
                me.template().push('access_token',token);
                me.template().push('expires',conf.access_token_lifetime);*/
                me.template().header('Status', 302);
                me.template().header('Location', client['redirectURI'] + '#userid=' + $_SESSION['userID'] + '&token=' + encodeURIComponent(token) + '&expires=' + conf.access_token_lifetime);
            }
            callParent();
        } else {
            console.log(5);
            headerError('invalid_token');
        }
    }).on('error', function(err) {
        console.log(3);
        headerError(err);
    });
    
    if(outHTML) {
        oauth2client = new OAuth2Client();
        oauth2client.setClientID($_GET['client_id']);
        oauth2client.setClientType((response_type == 'token')?3:1);
        oauth2client.setRedirectURI($_GET['redirect_uri']);
        client = oauth2client.toArray();
        if('undefined' == typeof $_POST['username'] || 'undefined' == typeof $_POST['password']) {
            if($_SESSION['userID'] && $_SESSION['userName']) {
                outHTML = me.service('oauth2client').checkClient(oauth2client);
            } else {
                headerError('invalid_request');
            }
        } else {
            outHTML = me.service('oauth2client').checkClient(oauth2client);
        }
    } else {
        console.log(4);
        headerError('invalid_request');
    }
    
};
Authorize.prototype.logout = function() {
    var me         = this;
    var $_SESSION  = this.scope().session();
    var callParent = function() { console.log('emit','launch');me.emit('launch'); };
    delete $_SESSION['userID'];
    delete $_SESSION['userName'];
    delete $_SESSION['userGroup'];
    
    me.template().header('Status',302);
    me.template().header('Location','/');
    callParent();
};
/**
 * must call parent method ::end() or emit event 'end'
 */
Authorize.prototype.end = function() {
    var req        = this.request;
    var res        = this.response;
    var me         = this;
    var callParent = function() { console.log('emit','end');me.emit('end'); };
    
    this.template().display();
    callParent();
};
//module exports
module.exports = Authorize;
