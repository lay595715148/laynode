var util  = require('util');
var Scope = require('../util/Scope.js');
var Base  = require('./Base.js');

function Bean(pros) {
    this.properties = pros;
    if('object' == typeof this.properties) {
        for(var pro in this.properties) {
            var setter = 'set' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            var getter = 'get' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            var code = '' + 
                'this.' + pro + ' = this.properties.' + pro + ';' + 
                'this.' + setter + ' = function(val) { this.properties.' + pro + ' = val; };' + 
                'this.' + getter + ' = function() { return this.properties.' + pro + '; };';
            eval(code);
        }
    }
    Base.call(this);
}

util.inherits(Bean, Base);

Bean.AUTO_BUILD = true;
Bean.SCOPE      = 0;
Bean.prototype.properties = {};
Bean.prototype.set = function(pro,val) {
    if('undefined' != this.properties[pro]) {
        this.properties[pro] = val;
    }
};
Bean.prototype.get = function(pro) {
    if('undefined' != this.properties[pro]) {
        return this.properties[pro];
    } else {
        return false;
    }
};
Bean.prototype.toArray = function() {
    return this.properties;
};
Bean.prototype.build = function(scope) {
    var _scope = ('undefined' == typeof scope)?Bean.SCOPE:scope;
    var scopeObject = Scope.parse(_scope);
    if('object' == typeof this.properties) {
        for(var pro in this.properties) {
            var set = 'set' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            var val = scopeObject[pro];
            this[set].call(this,val);
        }
    }
};

//module exports
module.exports = Bean;
