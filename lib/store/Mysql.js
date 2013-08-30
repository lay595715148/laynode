var util        = require('util');
var mysql       = require('mysql');

var config      = global._laynode_config;
var basepath    = global._laynode_basepath;
var rootpath    = global._laynode_rootpath;
var Store       = require(basepath + '/core/Store.js');
var Condition   = require(basepath + '/util/Condition.js');
var Sort        = require(basepath + '/util/Sort.js');

var mapping     = config.mapping;
 
function Mysql(storeConfig) {
    Store.call(this,storeConfig);
};

util.inherits(Mysql, Store);

Mysql.SHOW_SQL = true;
Mysql.ENCODING = 'UTF8';
Mysql.QUERY_MODEL_INSERT = 1;
Mysql.QUERY_MODEL_DELETE = 2;
Mysql.QUERY_MODEL_UPDATE = 3;
Mysql.QUERY_MODEL_SELECT = 4;
Mysql.QUERY_MODEL_COUNT = 5;
Mysql.QUERY_MODEL_OTHER = 6;
Mysql.prototype.incident;
Mysql.prototype.link;
Mysql.prototype.result;
Mysql.prototype.connect = function() {
    this.link = mysql.createConnection(this.config);
    this.link.connect();
};
Mysql.prototype.query = function(sql, model, encoding, showsql) {
    var me = this;
    var err,rows,fields;
    var storeConfig = me.config;
    
    model = model || Mysql.QUERY_MODEL_SELECT;

    if(!me.link) {
        this.connect();
    }

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

    if(showsql) {
        console.log(sql);
    }
    if(encoding) {
        //console.log(encoding);
        me.link.query('SET NAMES ' + encoding);
    }
    if('string' == typeof sql && sql.length > 0) {
        me.link.query(sql,function(err,rows,fields) {
            //console.log(me._classname);
            if(err) {
                me.emit('error',err);
            } else {
                me.result = rows;
                switch(model) {
                    case Mysql.QUERY_MODEL_INSERT:
                        if(me.returnid) {
                            me.emit('query', rows.insertId, fields);
                        } else {
                            me.emit('query', rows, fields);
                        }
                        break;
                    case Mysql.QUERY_MODEL_DELETE:
                        me.emit('query', rows, fields);
                        break;
                    case Mysql.QUERY_MODEL_UPDATE:
                        me.emit('query', rows, fields);
                        break;
                    case Mysql.QUERY_MODEL_SELECT:
                        me.emit('query', rows, fields);
                        break;
                    case Mysql.QUERY_MODEL_COUNT:
                        var count = 0;
                        if(util.isArray(rows) && rows.length > 0) {
                            count = rows[0]['num'];
                        }
                        me.emit('query', count, fields);
                        break;
                    default:
                        me.emit('query', rows, fields);
                        break;
                }
            }
        });
    } else {
        me.emit('error','invalid sql');
    }
};
Mysql.prototype.insert = function(table, fields, values, replace, returnid) {
    var me  = this;
    if('string' != typeof table || !table) {
        me.emit('error', 'no table');
        return false;
    }
    if(returnid === true) {
        me.returnid = true;
    } else {
        me.returnid = false;
    }
    
    var sql = me.insertSQL(table, fields, values, replace);
    
    me.query(sql, Mysql.QUERY_MODEL_INSERT);
};
Mysql.prototype.delete = function(table, condition) {
    var me  = this;
    if('string' != typeof table || !table) {
        me.emit('error','no table');
        return false;
    }
    
    var sql = me.deleteSQL(table, condition);
    me.query(sql, Mysql.QUERY_MODEL_DELETE);
};
Mysql.prototype.update = function(table, fields, values, condition) {
    var me  = this;
    if('string' != typeof table || !table) {
        me.emit('error','no table');
        return false;
    }
    
    var sql = me.updateSQL(table, fields, values, condition);
    me.query(sql, Mysql.QUERY_MODEL_UPDATE);
};
Mysql.prototype.select = function(table, fields, condition, group, order, limit) {
    var me  = this;
    if('string' != typeof table || !table) {
        me.emit('error', 'no table');
        return false;
    }

    var sql = me.selectSQL(table, fields, condition, group, order, limit);
    
    me.query(sql, Mysql.QUERY_MODEL_SELECT);//.call(me,sql);
};
Mysql.prototype.count = function(table, condition, group) {
    var me  = this;
    if('string' != typeof table || !table) {
        me.emit('error','no table');
        return false;
    }
    
    var sql = me.countSQL(table, condition, group);
    me.query(sql, Mysql.QUERY_MODEL_COUNT);
};
Mysql.prototype.insertSQL = function(table, fields, values, replace) {
    var me = this;
    if('string' != typeof table || !table) { return false; }

    if('object' == typeof values) {
        values = this.array2Value(fields, values, table);
    } else if('string' != typeof values) {
        return false;
    }
    if('object' == typeof fields) {
        fields = this.array2Field(fields, table);
    } else if('string' != typeof fields) {
        return false;
    }
    
    return ((replace)?'REPLACE':'INSERT') + ' INTO ' + table + ' ( ' + fields + ' ) VALUES ( ' + values + ' )';
};
Mysql.prototype.deleteSQL = function(table, condition) {
    var me = this;
    if('string' != typeof table || !table) { return false; }
    
    if(condition instanceof Condition) {
        condition = me.condition2Where(condition,table);
    } else if('object' == typeof condition) {
        condition = me.array2Where(condition,table);
    } else if('string' != typeof condition) {
        condition = 'WHERE 0';
    }
    
    return 'DELETE FROM ' + table + ' ' + condition;
};
Mysql.prototype.selectSQL = function(table, fields, condition, group, order, limit) {
    var me = this;
    if('string' != typeof table || !table) { return false; }
    
    if('array' == typeof fields || 'object' == typeof fields) {
        fields = me.array2Field(fields,table);//.call
    } else if(fields && 'string' != typeof fields) {
        return false;
    } else {
        fields = ' * ';
    }
    if(condition instanceof Condition) {
        condition = me.condition2Where(condition,table);
    } else if('object' == typeof condition) {
        condition = me.array2Where(condition,table);
    } else if('string' != typeof condition) {
        condition = 'WHERE 0';
    }
    if('string' != typeof group) {
        group = '';
    }
    if(order instanceof Sort) {
        order = me.sort2Order(order,table);
    } else if('object' == typeof order) {
        order = me.array2Order(order,table);
    } else if('string' != typeof order) {
        order = '';
    }
    if('string' != typeof limit) {
        limit = '';
    }

    return 'SELECT ' + fields + ' FROM `' + table + '`' + ((condition)?' ' + condition:'') + ((group)?' ' + group:'') + ((order)?' ' + order:'') + ((limit)?' ' + limit:'');
};
Mysql.prototype.countSQL = function(table, condition, group) {
    var me = this;
    if('string' != typeof table || !table) { return false; }

    if(condition instanceof Condition) {
        condition = me.condition2Where(condition,table);
    } else if('object' == typeof condition) {
        condition = me.array2Where(condition,table);
    } else if('string' != typeof condition) {
        condition = 'WHERE 0';
    }

    return 'SELECT count(*) as num FROM `' + table + '` ' + condition;
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
Mysql.prototype.array2Field = function(fields, table) {
    var me        = this;
    var str       = '';
    var count     = 0;
    var classname = me.getClassByTable(table);
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
Mysql.prototype.array2Value = function(fields, values, table) {
    var str       = '';
    var count     = 0;
    var classname = this.getClassByTable(table);
    var map       = mapping[classname];

    if('object' == typeof fields && 'object' == typeof values) {
        for(var i in fields) {
            var k = fields[i];
            var v = values[k];
            //v = mysql_real_escape_string(v);
            for(var index in map) {
                if((k == index || k == map[index]) && count > 0) {
                    str += ",'" + v + "'";
                    count++;
                } else if((k == index || k == map[index]) && count == 0) {
                    str += "'" + v + "'";
                    count++;
                }
            }
        }
    }

    return str;
};
Mysql.prototype.array2Order = function(order,table) {
    var me        = this;
    var str       = '';
    var count     = 0;
    var classname = me.getClassByTable(table);
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
    var classname = me.getClassByTable(table);
    var map       = mapping[classname];

    for(var i in condition) {
        var field = i;
        var value = condition[i];
        if('string' == typeof value || 'number' == typeof value) {
            if('string' == typeof value) value = value.replace(/\'/,'\\\''); 
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
        } else if(value instanceof Condition) {
            if(count > 0) {
                str += ' AND ' + me.condition2Where(value,table).substr(6);
                count++;
            } else if(count == 0) {
                str += me.condition2Where(value,table).substr(6);
                count++;
            }
        }
    }

    return ('' != str)?'WHERE ' + str:'WHERE 0';
};
Mysql.prototype.condition2Where = function(condition,table) {
    var me        = this;
    var str       = '';
    var classname = me.getClassByTable(table);
    var map       = mapping[classname];
    var orpos     = condition.getOrpos();
    var conds     = condition.getConds();

    var k   = 0;
    for(var index in conds) {
        var cell = ('array' == typeof conds)?index:conds[index];
            k = ('array' == typeof conds)?k:index;

        var field = cell.getName();
        var value = cell.getValue();
        var tmp   = [];
        if('array' == typeof value || 'object' == typeof value) {
            for(var i in value) {
                if('array' == typeof value) {
                    tmp.push(('string' == typeof i) ? i.replace('\'','\\\'') : i);
                } else {
                    if('string' == typeof value[i]) value[i] = value[i].replace('\'','\\\'');
                }
                if(tmp.length > 0) { value = tmp; }
            }
        } else {
            if('string' == typeof value) value = value.replace('\'','\\\'');
        }
        cell.setValue(value);

        for(var index in map) {
            if((field == index || field == map[index]) && str === '') {
                cell.setName(map[index]);
                str += cell.toSQLString();
                break;
            } else if((field == index || field == map[index])) {
                cell.setName(map[index]);
                str += ( orpos === true || 'number' == typeof orpos && k >= orpos )?' OR ':' AND ';
                str += cell.toSQLString();
                break;
            }
        }
        k++;
    }
    return (str)?'WHERE ' + str:'WHERE 0';
};

//module exports
module.exports = Mysql;
