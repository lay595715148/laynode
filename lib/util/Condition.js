var util   = require('util');
var Base   = require('../core/Base.js');
var Cell   = require('../util/Cell.js');

function Condition() {
    this.index = 0;
    this.conds = [];
    this.orpos = false;
    Base.call(this);
}

util.inherits(Condition, Base);

Condition.prototype.index = 0;
Condition.prototype.conds = [];
Condition.prototype.orpos = false;

Condition.prototype.push = Condition.prototype.putCell = function(cell) {
    var ret = this.index;

    if('array' == typeof cell || 'object' == typeof cell) {
        for(var index in cell) {
            var c = ('array' == typeof cell)?index:cell[index];
            if(!(c instanceof Cell)) { continue; }
            this.conds.push(c);
            this.index++;
        }
    } else {
        if(!(c instanceof Cell)) { return false; }
        this.conds.push(c);
        this.index++;
    }

    return ret;
};
Condition.prototype.pop = Condition.prototype.removeCell = function(index) {
    if('number' == typeof index && this.conds.length > index) {
        return this.conds.splice(index,1);
    } else {
        return false;
    }
};
Condition.prototype.toSQLString = function() {
    var sql = '';
    var k   = 0;
    for(var index in this.conds) {
        var cell = ('array' == typeof this.conds)?index:this.conds[index];
            k = ('array' == typeof this.conds)?k:index;
        if(sql === '') {
            sql += cell.toSQLString.call(cell);
        } else {
            sql += ( this.orpos === true || 'number' == typeof this.orpos && k >= this.orpos )?' OR ':' AND ';
            sql += cell.toSQLString.call(cell);
        }
        k++;
    }
    return sql;
};
Condition.prototype.getConds = function() {
    return this.conds;
};
Condition.prototype.setOrpos = function(orpos) {
    this.orpos = orpos;
};
Condition.prototype.getOrpos = function() {
    return this.orpos;
};

//module exports
module.exports = Condition;
