var util     = require('util');

var Scope    = require(basepath + '/util/Scope.js');
var Base     = require(basepath + '/core/Base.js');

function Bean(pros) {
    this._properties = pros;
    if('object' == typeof this._properties) {
        for(var pro in this._properties) {
            var setter = 'set' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            var getter = 'get' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            var code = '' + 
                //'this._' + pro + ' = this._properties.' + pro + ';' + //无效
                'this.' + setter + ' = function(val) { this._properties.' + pro + ' = val; };' + 
                'this.' + getter + ' = function() { return this._properties.' + pro + '; };';
            eval(code);
        }
    }
    Base.call(this);
}

util.inherits(Bean, Base);

Bean.AUTO_BUILD = true;
Bean.SCOPE      = 0;
Bean.prototype._properties = {};
Bean.prototype.set = function(pro,val) {
    if('undefined' != this._properties[pro]) {
        this._properties[pro] = val;
    }
};
Bean.prototype.get = function(pro) {
    if('undefined' != this._properties[pro]) {
        return this._properties[pro];
    } else {
        return false;
    }
};
Bean.prototype.toArray = function() {
    return this._properties;
};
Bean.prototype.build = function(scope) {
    var s = ('undefined' == typeof scope)?Bean.SCOPE:scope;
    var scopeObject = Scope.parse(s);
    if('object' == typeof this._properties) {
        for(var pro in this._properties) {
            var set = 'set' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            var val = scopeObject[pro];
            this[set].call(this,val);
        }
    }
};

//module exports
module.exports = Bean;
