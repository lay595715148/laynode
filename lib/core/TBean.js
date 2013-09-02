var util     = require('util');

var config   = global._laynode_config;
var Bean     = require(basepath + '/core/Bean.js');

var mapping  = config.mapping;
var classes  = config.classes;
var clazzes  = config.clazzes;

function TBean(pros) {
    Bean.call(this,pros);
}

util.inherits(TBean, Bean);


TBean.prototype.toField = function(pro) {
    var classname = this._classname;
    var map = mapping[classname];
    var field;
    
    if(map && 'string' == typeof map[pro]) {
        field = map[pro];
    }
    return field;
};
TBean.prototype.toFields = function() {
    var classname = this._classname;
    var map = mapping[classname];
    var fields = [];
    if('object' == typeof map) {
        for(var index in map) {
            fields.push(map[index]);
        }
    }
    return fields;
};
TBean.prototype.toInsertFields = function() {
    var classname = this._classname;
    var map = mapping[classname];
    var fields = [];
    if('object' == typeof map) {
        for(var index in map) {
            if(index != 'id') fields.push(map[index]);
        }
    }
    return fields;
};
TBean.prototype.toTable = function() {
    var classname = this._classname;
    var map = mapping['tables'];
    return map[classname];
};
TBean.prototype.toValues = function() {
    var classname = this._classname;
    var map = mapping[classname];
    var values = {};
    
    if('object' == typeof map) {
        for(var index in map) {
            values[map[index]] = this.get(index);
        }
    }
    return values;
};
TBean.prototype.rowToArray = function(row) {
    var classname = this._classname;
    var arr       = {};

    if('object' == typeof row) {
        var bean = this.rowToEntity.call(this,row);
        arr      = bean.toArray.call(bean);
    }
    return arr;
};
TBean.prototype.rowsToArray = function(rows) {
    var classname = this._classname;
    var map       = mapping[classname];
    var path      = rootpath + (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
    var BeanClass = require(path);//require class file
    var arrs      = [];
    if('object' == typeof rows || 'array' == typeof rows) {
        for(var index in rows) {
            var row = rows[index];
            if('object' == typeof row) {
                var bean = new BeanClass();
                var arr  = bean.rowToArray.call(bean,row);
                arrs.push(arr);
            }
        }
    }
    return arrs;
};
TBean.prototype.rowToEntity = function(row) {
    var classname = this._classname;
    var map       = mapping[classname];

    if('object' == typeof row && map) {
        for(var index in this.toArray.call(this)) {
            var pro = index;
            var key = (map[pro])?map[pro]:pro;
            var set = 'set' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            this[set].call(this,row[key]);
        }
    }
    return this;
};
TBean.prototype.rowsToEntities = function(rows) {
    var classname = this._classname;
    var map       = mapping[classname];
    var path      = rootpath + (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
    var BeanClass = require(path);//require class file
    var entities = [];
    if('object' == typeof rows || 'array' == typeof rows) {
        for(var index in rows) {
            var row = rows[index];
            if('object' == typeof row) {
                var bean   = new BeanClass();
                var entity = bean.rowToEntity.call(bean,row);
                entities.push(entity);
            }
        }
    }
    return entities;
};

//module exports
module.exports = TBean;
