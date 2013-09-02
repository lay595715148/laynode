var util   = require('util');
var url    = require('url');

var Action   = require(basepath + '/core/Action.js');
var Util     = require(basepath + '/util/Util.js');
var conf     = require('../sso.js');

function Show(actionConfig) {
    Action.call(this, actionConfig);
}

util.inherits(Show, Action);

Show.prototype.init = function() {
    Action.prototype.init.call(this);
};
Show.prototype.launch = function() {
    var me     = this;
    var req    = this.request;
    var res    = this.response;
    var parser = url.parse(req.url, true);
    var token,tokenobj,user;
    var $_GET = me.scope().get(), $_POST = me.scope().post(), $_REQUEST = me.scope().request(), $_SESSION = me.scope().session();
    var callParent = function() { me.emit('launch'); };
    //logger.log(req.cookies);
    //res.clearCookie('test');
    //logger.log(req.cookies);
    logger.log(me.service('show'));
    me.service('show').on('data',function(data) {
        result = data.result;
        method = data.method;logger.log(data);
        if(method === 'find') {
            me.template().push('result',result);
        }
        callParent();
    }).on('error',function(err) {
        me.template().push('error','invalid_userid');
        callParent();
    });
    
    me.service('show').find();
};
Show.prototype.end = function() {
    var me         = this;
    var req        = this.request;
    var res        = this.response;
    var parser     = url.parse(req.url, true);
    var callParent = function() { me.emit('end'); };

    me.template().json();
    callParent();
};
//module exports
module.exports = Show;
