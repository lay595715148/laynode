var util   = require('util');
var url    = require('url');
var jade   = require('jade');
var fs     = require('fs');
var Action = require('../../../laynode/core/Action.js');
//var OAuth2 = require('./OAuth2.js');
var User   = require('./User.js');

function Authorize(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Authorize, Action);

Authorize.prototype.headers;
Authorize.prototype.content;
Authorize.prototype.init = function() {
    Action.prototype.init.call(this);
};
Authorize.prototype.launch = function() {console.log(global._laynode_rootpath);console.log(global._laynode_basepath);
    var me     = this;
    var req    = Action.request;
    var res    = Action.response;
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

    var client_id = params.client_id;
    var redirect_uri = params.redirect_uri;
    var u1 = new User();u1.set('uid',1);
    var u2 = new User();u2.set('uid',2);console.log([this.services,u1.toArray(),u2]);


    oauth2.on('finishClientAuthorization',function(result) {
        authorize.headers = result.headers;console.log('wai');
        authorize.content = '';
        fs.readFile(__dirname + '/../template/authenticate.jade', function (err, data) {
            if (err) console.log( err );
            authorize.content = jade.render(data, {pageTitle:'Authorize',client_id:client_id,redirect_uri:redirect_uri});
            console.log(me.template);
            authorize.emit('launch');
        });
    }).finishClientAuthorization(params, req, res);
};
Authorize.prototype.end = function() {
    var req       = Action.request;
    var res       = Action.response;
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
