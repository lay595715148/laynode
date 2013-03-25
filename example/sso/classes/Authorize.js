var util   = require('util');
var url    = require('url');
var Action = require('../../../laynode/core/Action.js');
var OAuth2 = require('./OAuth2.js');

function Authorize(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Authorize, Action);

Authorize.prototype.headers;
Authorize.prototype.content;
Authorize.prototype.init = function(req, res) {
    Action.prototype.init.call(this,req, res);
};
Authorize.prototype.launch = function(req, res) {
    var oauth2 = this.services["oauth2"];//new OAuth2();
    var parser = url.parse(req.url, true);
    var authorize = this;
    var params;
    if(req.method == "POST") {
        params = req.body;
        for(var i in parser.query) {
            params[i] = parser.query[i];
        }
    } else {
        params = parser.query;
    }

    oauth2.on('finishClientAuthorization',function(result) {
        authorize.headers = result.headers;console.log('wai');
        authorize.content = result.content;
        authorize.emit('launch');
    }).finishClientAuthorization(params, req, res);
};
Authorize.prototype.end = function(req, res) {
    var authorize = this;

    if('string' != typeof authorize.content) {
        authorize.content = JSON.stringify(authorize.content);
    }

    if(authorize.headers.length > 0) {
        for(var i in authorize.headers) {
            for(var prop in authorize.headers[i]) {
                if(prop === 'Status') {
                    res.statusCode = authorize.headers[i][prop];
                } else {
                    res.setHeader(prop, authorize.headers[i][prop]);
                }
            }
        }
    }
    if('string' === typeof authorize.content && authorize.content) {
        res.end(authorize.content);
    } else {
        res.end('no content!');
    }
    authorize.emit('end');
};
//module exports
module.exports = Authorize;
