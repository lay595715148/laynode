var util    = require('util');
var Action  = require(basepath + '/core/Action.js');

function LaynodeAction(actionConfig) {
    Action.call(this,actionConfig);
}

util.inherits(LaynodeAction, Action);

LaynodeAction.prototype.launch = function() {
    var me = this;
    var callParent = function() {Action.prototype.launch.call(me)};
    logger.log('It\'s great!');
    me.service('laynode').do();
    callParent();
};
LaynodeAction.prototype.end = function() {
    var me = this;
    var callParent = function() {Action.prototype.end.call(me)};
    
    logger.log('It\'s good!');
    me.template().display();
    callParent();
};

module.exports = LaynodeAction;