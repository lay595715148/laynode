var util        = require('util');
var Base        = require('../core/Base.js');
var Util        = require('../util/Util.js');

function Scope(request,response) {
    this._request = request;
    this._response = response;
    this._resolve = null;
    Base.call(this);
};

util.inherits(Scope, Base);

Scope.REQUEST = 0
Scope.GET     = 1;
Scope.POST    = 2;
Scope.SESSION = 3;
Scope.COOKIE  = 4;
Scope.prototype._resolve;
Scope.prototype._request;
Scope.prototype._response;
Scope.prototype.get = function(request) {
    request = request || this._request;
    return this.resolve(request)[0];
};
Scope.prototype.post = function(request) {
    request = request || this._request;
    return this.resolve(request)[1];
};
Scope.prototype.request = function(request) {
    request = request || this._request;
    return this.resolve(request)[2];
};
Scope.prototype.cookie = function(request) {
    request = request || this._request;
    return this.resolve(request)[3];
};
Scope.prototype.session = function(request) {
    request = request || this._request;
    return this.resolve(request)[4];
};
Scope.prototype.resolve = function(request, reset) {
    var $_GET = {}, $_POST = {}, $_REQUEST = {},$_COOKIE = {},$_SESSION = {};
    if(util.isArray(this._resolve) && this._resolve.length > 0 && !reset) return this._resolve;
    logger.log('resolve', 1);
    if('object' == typeof request) {
        if(request.method == "POST") {
            $_GET = request.query;
            $_POST = request.body;
            $_REQUEST = Util.extend(Util.clone($_GET),Util.clone($_POST));
        } else {
            $_GET = request.query;
            $_REQUEST = $_GET;
        }
        $_SESSION = request.session;
        $_COOKIE = request.cookies;
    }
    this._resolve = [$_GET,$_POST,$_REQUEST,$_COOKIE,$_SESSION];
    return this._resolve;
};
Scope.prototype.parse = function(scope) {
    if('number' == typeof scope) {
        switch(scope) {
            case Scope.REQUEST:
                scopeObject = this.request();
                break;
            case Scope.GET:
                scopeObject = this.get();
                break;
            case Scope.POST:
                scopeObject = this.post();
                break;
            case Scope.SESSION:
                scopeObject = this.session();
                break;
            case Scope.COOKIE:
                scopeObject = this.cookie();
                break;
            default:
                scopeObject = this.request();
                break;
        }
    } else if('object' == typeof scope){
        scopeObject = scope;
    }
    return scopeObject;
};

//module exports
module.exports = Scope;
