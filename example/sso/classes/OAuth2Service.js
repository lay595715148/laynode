var util      = require('util');
var url       = require('url');
var jade      = require('jade');

var basepath  = global._laynode_basepath;
var rootpath  = global._laynode_rootpath;
var Service   = require(basepath + '/core/Service.js');
var Condition = require(basepath + '/util/Condition.js');
var Cell      = require(basepath + '/util/Cell.js');
var Sort      = require(basepath + '/util/Sort.js');
var MD5       = require(basepath + '/util/MD5.js');
var Util      = require(basepath + '/util/Util.js');
var lang      = require('../lang/lang.js');
var conf      = require('../sso.js');

function OAuth2Service(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2Service, Service);

OAuth2Service.ERROR = lang.OAuth2.ERROR;
OAuth2Service.ERROR_DESC = lang.OAuth2.ERROR_DESC;
OAuth2Service.REQUEST_TYPE_CODE = 'code';
OAuth2Service.REQUEST_TYPE_TOKEN = 'token';
OAuth2Service.REQUEST_TYPE_PASSWORD = 'password';
OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN = 'refresh_token';
OAuth2Service.REQUEST_TYPE_SHOW = 'show';
OAuth2Service.RESPONSE_TYPE_CODE = 'code';
OAuth2Service.RESPONSE_TYPE_TOKEN = 'token';
OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
OAuth2Service.GRANT_TYPE_PASSWORD = 'password';
OAuth2Service.GRANT_TYPE_REFRESH_TOKEN = 'refresh_token';
OAuth2Service.CLIENT_TYPE_WEB = 'webApp';
OAuth2Service.CLIENT_TYPE_DESKTOP = 'desktopApp';
OAuth2Service.CLIENT_TYPE_JS = 'jsApp';
OAuth2Service.TOKEN_TYPE_ACCESS = 1;
OAuth2Service.TOKEN_TYPE_REFRESH = 2;

OAuth2Service.prototype.result = {headers:[],content:''};

OAuth2Service.prototype.getRequestType = function(req) {
    var request_type,grant_type;
    var $_GET = {}, $_POST = {}, $_REQUEST = {};
    if(req.method == "POST") {
        $_GET = req.query;
        $_POST = req.body;
        $_REQUEST = Util.extend(Util.clone($_GET),Util.clone($_POST));
    } else {
        $_GET = req.query;
        $_REQUEST = $_GET;
    }
    
    if('undefined' == typeof $_REQUEST['grant_type']) {
        grant_type = OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE;
    } else {
        grant_type = $_REQUEST['grant_type'];
    }
    switch(grant_type) {
        case OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE:
            request_type = OAuth2Service.REQUEST_TYPE_TOKEN;
            break;
        case OAuth2Service.GRANT_TYPE_PASSWORD:
            request_type = OAuth2Service.REQUEST_TYPE_PASSWORD;
            break;
        case OAuth2Service.GRANT_TYPE_REFRESH_TOKEN:
            request_type = OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN;
            break;
        default:
            grant_type  = OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE;
            request_type = OAuth2Service.REQUEST_TYPE_TOKEN;
            break;
    }
    return request_type;
}
OAuth2Service.prototype.checkRequest = function(req,request_type) {
    
    var ret = true;
    var $_GET = {}, $_POST = {}, $_REQUEST = {};
    
    request_type = request_type || OAuth2Service.REQUEST_TYPE_CODE;
    
    if(req.method == "POST") {
        $_GET = req.query;
        $_POST = req.body;
        $_REQUEST = Util.extend(Util.clone($_GET),Util.clone($_POST));
    } else {
        $_GET = req.query;
        $_REQUEST = $_GET;
    }console.log(request_type);
    
    switch(request_type) {
        case OAuth2Service.REQUEST_TYPE_CODE:
            if('undefined' == typeof $_GET['client_id'] || 'undefined' == typeof $_GET['redirect_uri']) {
                ret = false;
            } else if('undefined' != typeof $_GET['response_type'] && $_GET['response_type'] != 'code' 
                && $_GET['response_type'] != 'token') {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_TOKEN:
            if('undefined' == typeof $_POST['client_id'] || 'undefined' == typeof $_POST['redirect_uri']
                || 'undefined' == typeof $_POST['client_secret'] || 'undefined' == typeof $_POST['code']) {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_PASSWORD:
            if('undefined' == typeof $_POST['client_id'] || 'undefined' == typeof $_POST['client_secret']
                || 'undefined' == typeof $_POST['grant_type'] || 'undefined' == typeof $_POST['username']
                || 'undefined' == typeof $_POST['password']) {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN:
            if('undefined' == typeof $_POST['client_id'] || 'undefined' == typeof $_POST['client_secret']
                || 'undefined' == typeof $_POST['grant_type'] || 'undefined' == typeof $_POST['refresh_token']) {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_SHOW:
            if('undefined' == typeof $_POST['access_token'] || 'undefined' == typeof $_POST['userid']) {
                ret = false;
            }
            break;
        default:
            ret = false;
            break;
    }
    return ret;
};

//module exports
module.exports = OAuth2Service;
