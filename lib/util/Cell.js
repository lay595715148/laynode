var util = require('util');
var Bean = require('../core/Bean.js');

function Cell(name, value, mode, type, extra) {
    var pros = {
        'name' : ('undefined' == typeof name || 'string' != typeof name)?'name':name,
        'mode' : ('undefined' == typeof mode || 'number' != typeof mode || mode < 0 || mode > 8)?0:mode,
        'value' : ('string' == typeof value || 'number' == typeof value || 'object' == typeof value || 'array' == typeof value)?value:'',//string, number, if mode = 6 or 7 it can be an array
        'type' : ('undefined' == typeof type || 'number' != typeof type)?0:type,
        'extra' : ('undefined' == typeof type)?false:extra
    };
    Bean.call(this,pros);
};

util.inherits(Cell, Bean);

Cell.MODEL_EQUAL = 0;
Cell.MODEL_UNEQUAL = 1;
Cell.MODEL_GREATER = 2;
Cell.MODEL_LESS = 3;
Cell.MODEL_IN = 4;
Cell.MODEL_NOTIN = 5;
Cell.MODEL_LIKE = 6;
Cell.MODEL_UNLIKE = 7;
Cell.MODEL_FUNCTION = 8;
Cell.MODEL_FORMAT_EQUAL = ':=';
Cell.MODEL_FORMAT_UNEQUAL = ':~';
Cell.MODEL_FORMAT_GREATER = ':>';
Cell.MODEL_FORMAT_LESS = ':<';
Cell.MODEL_FORMAT_IN = ':+';
Cell.MODEL_FORMAT_NOTIN = ':-';
Cell.MODEL_FORMAT_LIKE = ':%';
Cell.MODEL_FORMAT_UNLIKE = ':^';
Cell.FLAG_CONNECT = '&';
Cell.FLAG_EXPLODE = ',';
Cell.TYPE_STRING = 0;
Cell.TYPE_NUMBER = 1;

Cell.parseFilterString = function(filter) {//static
    var cells  = [];
    if('string' == typeof filter && filter) {
        var filters = filter.split(Cell.FLAG_CONNECT);
        for(var index in filters) {
            var str = ('array' == typeof filters)?index:filters[index];
            var matches = str.match(/^(.*)(:[=|~|>|<|+|\-|%|\^]{1})(.*)/);
            if(!matches) { continue; }
            var cell = new Cell();
            var name = matches[1];
            var value = matches[3];
            cell.setName.call(cell,name);
            cell.setValue.call(cell,value);
            switch(matches[2]) {
                case Cell.MODEL_FORMAT_EQUAL:
                    cell.setMode.call(cell,Cell.MODEL_EQUAL);
                    break;
                case Cell.MODEL_FORMAT_UNEQUAL:
                    var values = value.split(Cell.FLAG_EXPLODE);
                    cell.setValue.call(cell,values);
                    cell.setMode.call(cell,Cell.MODEL_UNEQUAL);
                    break;
                case Cell.MODEL_FORMAT_GREATER:
                    cell.setMode.call(cell,Cell.MODEL_GREATER);
                    break;
                case Cell.MODEL_FORMAT_LESS:
                    cell.setMode.call(cell,Cell.MODEL_LESS);
                    break;
                case Cell.MODEL_FORMAT_IN:
                    var values = value.split(Cell.FLAG_EXPLODE);
                    cell.setValue.call(cell,values);
                    cell.setMode.call(cell,Cell.MODEL_IN);
                    break;
                case Cell.MODEL_FORMAT_NOTIN:
                    var values = value.split(Cell.FLAG_EXPLODE);
                    cell.setValue.call(cell,values);
                    cell.setMode.call(cell,Cell.MODEL_NOTIN);
                    break;
                case Cell.MODEL_FORMAT_LIKE:
                    var values = value.split(Cell.FLAG_EXPLODE);
                    cell.setValue.call(cell,values);
                    cell.setMode.call(cell,Cell.MODEL_LIKE);
                    break;
                case Cell.MODEL_FORMAT_UNLIKE:
                    var values = value.split(Cell.FLAG_EXPLODE);
                    cell.setValue.call(cell,values);
                    cell.setMode.call(cell,Cell.MODEL_UNLIKE);
                    break;
            }
            cells.push(cell);
        }
    }
    return cells;
    
};

Cell.prototype.toFilterString = function() {
    var filter = '',
        name   = this.getName.call(this),
        type   = this.getType.call(this),
        mode   = this.getMode.call(this),
        value  = this.getValue.call(this);
    switch(mode) {
        case Cell.MODEL_EQUAL:
            filter = name + Cell.MODEL_FORMAT_EQUAL + value;
            break;
        case Cell.MODEL_UNEQUAL:
            if('array' == typeof value || 'object' == typeof value) {
                filter = name + Cell.MODEL_FORMAT_UNEQUAL + value.join(Cell.FLAG_EXPLODE);
            } else {
                filter = name + Cell.MODEL_FORMAT_UNEQUAL + value;
            }
            break;
        case Cell.MODEL_GREATER:
            filter = name + Cell.MODEL_FORMAT_GREATER + value;
            break;
        case Cell.MODEL_LESS:
            filter = name + Cell.MODEL_FORMAT_LESS + value;
            break;
        case Cell.MODEL_IN:
            if('array' == typeof value || 'object' == typeof value) {
                filter = name + Cell.MODEL_FORMAT_IN + value.join(Cell.FLAG_EXPLODE);
            } else {
                filter = name + Cell.MODEL_FORMAT_IN + value;
            }
            break;
        case Cell.MODEL_NOTIN:
            if('array' == typeof value || 'object' == typeof value) {
                filter = name + Cell.MODEL_FORMAT_NOTIN + value.join(Cell.FLAG_EXPLODE);
            } else {
                filter = name + Cell.MODEL_FORMAT_NOTIN + value;
            }
            break;
        case Cell.MODEL_LIKE:
            if('array' == typeof value || 'object' == typeof value) {
                filter = name + Cell.MODEL_FORMAT_LIKE + value.join(Cell.FLAG_EXPLODE);
            } else {
                filter = name + Cell.MODEL_FORMAT_LIKE + value;
            }
            break;
        case Cell.MODEL_UNLIKE:
            if('array' == typeof value || 'object' == typeof value) {
                filter = name + Cell.MODEL_FORMAT_UNLIKE + value.join(Cell.FLAG_EXPLODE);
            } else {
                filter = name + Cell.MODEL_FORMAT_UNLIKE + value;
            }
            break;
        default:
            break;
    }
    return filter;
};
Cell.prototype.toSQLString = function() {
    var sql   = '',
        name  = this.getName.call(this),
        type  = this.getType.call(this),
        mode  = this.getMode.call(this),
        value = this.getValue.call(this);

    switch(mode) {
        case Cell.MODEL_EQUAL:
            if(('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER) {
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'OR `' + name + '` = ' + v + '':'( `' + name + '` = ' + v + ' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'OR `' + name + '` = \'' + v + '\'':'( `' + name + '` = \'' + v + '\' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(!('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER){
                sql = '( `' + name + '` = ' + value + ' )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` = \'' + value + '\' )';
            }
            break;
        case Cell.MODEL_UNEQUAL:
            if(('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER) {
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` <> ' + v + '':'( `' + name + '` <> ' + v + ' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` <> \'' + v + '\'':'( `' + name + '` <> \'' + v + '\' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(!('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER){
                sql = '( `' + name + '` <> ' + value + ' )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` <> \'' + value + '\' )';
            }
            break;
        case Cell.MODEL_GREATER:
            if(('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER) {
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` > ' + v + '':'( `' + name + '` > ' + v + ' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` > \'' + v + '\'':'( `' + name + '` > \'' + v + '\' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(!('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER){
                sql = '( `' + name + '` > ' + value + ' )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` > \'' + value + '\' )';
            }
            break;
        case Cell.MODEL_LESS:
            if(('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER) {
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` < ' + v + '':'( `' + name + '` < ' + v + ' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` < \'' + v + '\'':'( `' + name + '` < \'' + v + '\' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(!('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER){
                sql = '( `' + name + '` < ' + value + ' )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` < \'' + value + '\' )';
            }
            break;
        case Cell.MODEL_IN:
            if(('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER) {
                sql = '( `' + name + '` IN ( ' + value.join(' , ') + ' ) )';
            } else if(('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` IN ( \'' + value.join('\' , \'') + '\' ) )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER){
                sql = '( `' + name + '` IN ( ' + value + ' ) )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` IN ( \'' + value + '\' ) )';
            }
            break;
        case Cell.MODEL_NOTIN:
            if(('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER) {
                sql = '( `' + name + '` NOT IN ( ' + value.join(' , ') + ' ) )';
            } else if(('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` NOT IN ( \'' + value.join('\' , \'') + '\' ) )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type === Cell.TYPE_NUMBER){
                sql = '( `' + name + '` NOT IN ( ' + value + ' ) )';
            } else if(!('array' == typeof value || 'object' == typeof value) && type != Cell.TYPE_NUMBER){
                sql = '( `' + name + '` NOT IN ( \'' + value + '\' ) )';
            }
            break;
        case Cell.MODEL_LIKE:
            if('array' == typeof value || 'object' == typeof value) {
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` LIKE \'%' + v + '%\'':'( `' + name + '` LIKE \'%' + v + '%\' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(!('array' == typeof value || 'object' == typeof value)){
                sql = '( `' + name + '` LIKE \'%' + value + '%\' )';
            }
            break;
        case Cell.MODEL_UNLIKE:
            if('array' == typeof value || 'object' == typeof value) {
                sql = '';
                for(var index in value) {
                    var v = ('array' == typeof value)?index:value[index];
                    sql += (sql)?'AND `' + name + '` NOT LIKE \'%' + v + '%\' ':'( `' + name + '` NOT LIKE \'%' + v + '%\' ';
                }
                sql += (value.length > 0)?')':'';
            } else if(!('array' == typeof value || 'object' == typeof value)){
                sql = '( `' + name + '` LIKE \'%' + value + '%\' )';
            }
            break;
        case Cell.MODEL_FUNCTION:
            break;
        default:
            break;
    }
    return sql;
};

//module exports
module.exports = Cell;
