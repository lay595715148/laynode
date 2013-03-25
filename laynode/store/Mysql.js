var util        = require('util');
var mysql       = require('mysql');
var emitter     = require('events').EventEmitter;
var Store       = require('../core/Store.js');
var Condition   = require('../util/Condition.js');
var Sort        = require('../util/Sort.js');

var config      = global.config;
var mapping     = config.mapping;
 
function Mysql(storeConfig) {
    Store.call(this,storeConfig);
};

util.inherits(Mysql, Store);

Mysql.SHOW_SQL = true;
Mysql.ENCODING = 'UTF8';
Mysql.prototype.incident;
Mysql.prototype.link;
Mysql.prototype.result;
Mysql.prototype.connect = function() {
    this.link = mysql.createConnection(this.config);
    this.link.connect();
};
Mysql.prototype.query = function(sql,encoding,showsql) {
    var me = this;
    var err,rows,fields;
    var storeConfig = me.config;
    if('string' != typeof sql || !sql || !me.link) {
        me.emit('error',err,rows,fields);
        return false;
    }

    if('undefined' == typeof showsql || 'boolean' != typeof showsql) {
        showsql = ('undefined' == typeof storeConfig['show-sql'] || 'boolean' != typeof storeConfig['show-sql'])?Mysql.SHOW_SQL:storeConfig['show-sql'];
    }
    if('undefined' == typeof encoding || 'string' != typeof encoding) {
        encoding = ('undefined' == typeof storeConfig['encoding'] || 'string' != typeof storeConfig['encoding'])?Mysql.ENCODING:storeConfig['encoding'];
    }

    if(encoding) {
        me.link.query('SET NAMES ' + encoding);
    }
    if(showsql) {
        console.log(sql);
    }
    if('string' == typeof sql && sql.length > 0) {
        me.link.query(sql,function(err,rows,fields) {
            console.log(me.$classname);
            me.result = rows;
            me.emit('query',err,rows,fields);
        });
    } else {
        me.emit('error',err,rows,fields);
    }
};
Mysql.prototype.insert = function(table,fields,values) {
};
Mysql.prototype.delete = function(table,condition) {
};
Mysql.prototype.update = function(table,fields,values,condition) {
};
Mysql.prototype.select = function(table,fields,condition,group,order,limit) {
    var me  = this;
    var err,rows,fields;
    var sql = '';
    if('string' != typeof table || !table || !me.link) {
        me.emit('error',err,rows,fields);
        return false;
    }

    if('array' == typeof fields || 'object' == typeof fields) {
        fields = me.array2Field.call(me,fields,table);
    } else if(fields && 'string' != typeof fields) {
        return false;
    } else {
        fields = ' * ';
    }
    if(condition instanceof Condition) {
        condition = me.condition2Where.call(me,condition,table);
    } else if('object' == typeof condition) {
        condition = me.array2Where.call(me,condition,table);
    } else if('string' != typeof condition) {
        condition = 'WHERE 1';
    }
    if('string' != typeof group) {
        group = '';
    }
    if(order instanceof Sort) {
        order = me.sort2Order.call(me,order,table);
    } else if('object' == typeof order) {
        order = me.array2Order.call(me,order,table);
    } else if('string' != typeof order) {
        order = '';
    }
    if('string' != typeof limit) {
        limit = '';
    }

    sql = 'SELECT ' + fields + ' FROM `' + table + '`' + ((condition)?' ' + condition:'') + ((group)?' ' + group:'') + ((order)?' ' + order:'') + ((limit)?' ' + limit:'');
    me.query.call(me,sql);
};
Mysql.prototype.count = function(table,condition,group) {
    var me  = this;
    var err,rows,fields;
    var sql = '';

    if('string' != typeof table || !table || !me.link) {
        me.emit('error',err,rows,fields);
        return false;
    }

    if(condition instanceof Condition) {
        condition = me.condition2Where.call(me,condition,table);
    } else if('object' == typeof condition) {
        condition = me.array2Where.call(me,condition,table);
    } else if('string' != typeof condition) {
        condition = 'WHERE 1';
    }

    sql = 'SELECT count(*) as num FROM `' + table + '` ' + condition;
    me.query.call(me,sql);
};
Mysql.prototype.toArray = function(count, result) {
    var i = 0;
    var rows = [];
        result = ('array' == typeof result || 'object' == typeof result)?result:this.result;
        count = ('number' == typeof count)?count:0;
    if(count <= 0 && result) {
        for(i in result) {
            rows.push(result[i]);
        }
    } else if(count == 1) {
        for(i in result) {
            rows = result[i];
            break;
        }
    } else {
        for(;i < count && result;i++) {
            if(result[i]) {
                rows[i] = result[i];
            } else {
                break;
            }
        }
    }
    return rows;
};
Mysql.prototype.toResult = function() {
    return this.result;
};

Mysql.prototype.getClassByTable = function(table) {
    var tables    = mapping['tables'];
    var classname = '';
    for(var index in tables) {
        if(tables[index] == table) {
            classname = index;
            break;
        }
    }
    return classname;
};
Mysql.prototype.array2Field = function(fields,table) {
    var me        = this;
    var str       = '';
    var count     = 0;
    var classname = me.getClassByTable.call(me,table);
    var map       = mapping[classname];

    for(var i in fields) {
        var field = ('string' == typeof fields[i])?fields[i]:i;
        for(var index in map) {
            if((field == index || field == map[index]) && count > 0) {
                str += ',`'+ map[index] + '`';
                count++;
            } else if((field == index || field == map[index]) && count == 0) {
                str += '`' + map[index] + '`';
                count++;
            }
        }
    }

    return str;
};
Mysql.prototype.array2Order = function(order,table) {
    var me        = this;
    var str       = '';
    var count     = 0;
    var classname = me.getClassByTable.call(me,table);
    var map       = mapping[classname];

    for(var i in order) {
        var field = ('string' == typeof order[i])?order[i]:i;
        for(var index in map) {
            if((field == index || field == map[index]) && count > 0) {
                str += ',`'+ map[index] + '` DESC';
                count++;
            } else if((field == index || field == map[index]) && count == 0) {
                str += '`' + map[index] + '` DESC';
                count++;
            }
        }
    }

    return ('' != str)?'ORDER BY ' + str:'';
};
Mysql.prototype.sort2Order = function(order,table) {
};
Mysql.prototype.array2Where = function(condition,table) {
    var me        = this;
    var str       = '';
    var count     = 0;
    var classname = me.getClassByTable.call(me,table);
    var map       = mapping[classname];

    for(var i in condition) {
        var field = i;
        var value = condition[i];
        if('string' == typeof value) { value = value.replace(/\'/,'\\\''); }
        for(var index in map) {
            if((field == index || field == map[index]) && count > 0) {
                str += ' AND `' + map[index] + '` = \'' + value + '\'';
                count++;
                break;
            } else if((field == index || field == map[index]) && count == 0) {
                str += '`' + map[index] + '` = \'' + value + '\'';
                count++;
                break;
            }
        }
    }

    return ('' != str)?'WHERE ' + str:'WHERE 0';
};
Mysql.prototype.condition2Where = function(condition,table) {
    var me        = this;
    var str       = '';
    var classname = me.getClassByTable.call(me,table);
    var map       = mapping[classname];
    var orpos     = condition.getOrpos.call(condition);
    var conds     = condition.getConds.call(condition);

    var k   = 0;
    for(var index in conds) {
        var cell = ('array' == typeof conds)?index:conds[index];
            k = ('array' == typeof conds)?k:index;

        var field = cell.getName.call(cell);
        var value = cell.getValue.call(cell);
        var tmp   = [];
        if('array' == typeof value || 'object' == typeof value) {
            for(var i in value) {
                if('array' == typeof value) {
                    tmp.push(i.replace('\'','\\\''));
                } else {
                    value[i] = value[i].replace('\'','\\\'');
                }
                if(tmp.length > 0) { value = tmp; }
            }
        } else {
            value = value.replace('\'','\\\'');
        }
        cell.setValue.call(cell,value);

        for(var index in map) {
            if((field == index || field == map[index]) && str === '') {
                cell.setName.call(cell,map[index]);
                str += cell.toSQLString.call(cell);
                break;
            } else if((field == index || field == map[index])) {
                cell.setName.call(cell,map[index]);
                str += ( orpos === true || 'number' == typeof orpos && k >= orpos )?' OR ':' AND ';
                str += cell.toSQLString.call(cell);
                break;
            }
        }
        k++;
    }
    return (str)?'WHERE ' + str:'WHERE 0';
};

//module exports
module.exports = Mysql;
