var util        = require('util');
var Base        = require('../core/Base.js');
//var Application = require('../Application.js');

function Scope() {
    Base.call(this);
};

util.inherits(Scope, Base);

Scope.request;
Scope.response;
Scope.REQUEST = 0;
Scope.SESSION = 1;
Scope.COOKIES = 2;
Scope.parse = function(scope) {
    var scopeObject = Scope.request.query;
    if('number' == typeof scope) {
        switch(scope) {
            case Scope.REQUEST:
                scopeObject = Scope.request.query;
                break;
            case Scope.SESSION:
                scopeObject = Scope.request.session;
                break;
            case Scope.COOKIES:
                scopeObject = Scope.request.cookies;
                break;
        }
    } else if('object' == typeof scope){
        scopeObject = scope;
    }
    return scopeObject;
};

//module exports
module.exports = Scope;
