var util   = require('util');
var url    = require('url');
var Action = require('../../../laynode/core/Action.js');
var OAuth2 = require('./OAuth2.js');

function Resource(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Resource, Action);

Resource.prototype.headers;
Resource.prototype.content;
Resource.prototype.init = function(req, res) {
    Action.prototype.init.call(this, req, res);
};
Resource.prototype.launch = function(req, res) {
    var oauth2 = this.services["oauth2"];//new OAuth2();
    var parser = url.parse(req.url, true);
    var resource = this;

    oauth2.on('verifyAccessToken',function(result) {
        resource.headers = result.headers;
        resource.content = result.content;
        resource.emit('launch');
    }).verifyAccessToken(parser.query, req, res);
};
Resource.prototype.end = function(req, res) {
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
module.exports = Resource;
