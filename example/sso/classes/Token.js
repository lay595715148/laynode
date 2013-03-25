var util   = require('util');
var url    = require('url');
var Action = require('../../../laynode/core/Action.js');
var OAuth2 = require('./OAuth2.js');

function Token(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Token, Action);

Token.prototype.headers;
Token.prototype.content;
Token.prototype.init = function(req, res) {
    Action.prototype.init.call(this, req, res);
};
Token.prototype.launch = function(req, res) {
    var oauth2 = this.services["oauth2"];//new OAuth2();
    var parser = url.parse(req.url, true);
    var token = this;

    oauth2.on('grantAccessToken',function(result) {
        token.headers = result.headers;
        token.content = result.content;
        token.emit('launch');
    }).grantAccessToken(parser.query, req, res);
};
Token.prototype.end = function(req, res) {
    if('string' != typeof this.content) {
        this.content = JSON.stringify(this.content);
    }

    if(this.headers.length > 0) {
        for(var i in this.headers) {
            for(var prop in this.headers[i]) {
                if(prop === 'Status') {
                    res.statusCode = this.headers[i][prop];
                } else {
                    res.setHeader(prop, this.headers[i][prop]);
                }
            }
        }
    }
    if('string' === typeof this.content && this.content) {
        res.end(this.content);
    } else {
        res.end('no content!');
    }
    this.emit('end');
};
//module exports
module.exports = Token;
