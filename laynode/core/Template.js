var util   = require('util');
var Base   = require('./Base.js');

var config = global._laynode_config;

function Template() {
    Base.call(this);
}

Template.prototype._vars       = [];
Template.prototype._headers    = [];
Template.prototype._metas      = [];
Template.prototype._jses       = [];
Template.prototype._javascript = [];
Template.prototype._csses      = [];
Template.prototype._file       = '';

Template.prototype.init = function() {
    var lang  = config['language'];
    var langs = config['languages'];
    if(lang && util.isArray(langs));
};
Template.prototype.header = function() {
};
Template.prototype.title = function() {
};
Template.prototype.push = function() {
};
Template.prototype.file = function() {
};
Template.prototype.template = function() {
};
Template.prototype.meta = function() {
};
Template.prototype.js = function() {
};
Template.prototype.javascript = function() {
};
Template.prototype.json = function() {
};
Template.prototype.xml = function() {
};
Template.prototype.out = function() {
};
Template.prototype.display = function() {
};

//module exports
module.exports = Template;