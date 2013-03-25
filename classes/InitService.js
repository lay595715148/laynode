var util        = require('util');
var Service     = require('../laynode/core/Service.js');
//var CChart      = require('./conf-bean/CChart.js');
var config      = require('../laynode/config.js');
var Application = require('../laynode/Application.js');
var Cell        = require('../laynode/util/Cell.js');
var Condition   = require('../laynode/util/Condition.js');

var classes     = config['classes'];
var clazzes     = config['clazzes'];

function InitService(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(InitService, Service);

InitService.prototype.read = function(classname,callback) {
    console.log('InitService read ' + classname);
    var res = Application._RESPONSE;
    var suffix = '../';
    var path = suffix+ (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
    var CBeanClass = require(path);
    var cbean = new CBeanClass();

    var table  = cbean.toTable.call(cbean);
    var fields = cbean.toFields.call(cbean);
    var topics = {};
    var events = function(err,rows) {
        if(err || 'function' != typeof callback) {
            res.write('Error');
            res.end();
        } else {
            topics = cbean.rowsToArray.call(cbean,rows);
            callback(topics);
        }
    };
    this.store.select.call(this.store,events,table,fields);
};
InitService.prototype.readCount = function(classname,callback) {
    console.log('InitService readCount ' + classname);
    var res = Application._RESPONSE;
    var suffix = '../';
    var path = suffix+ (('undefined' != typeof classes[classname])?classes[classname]:clazzes[classname]);
    var CBeanClass = require(path);
    var cbean = new CBeanClass();

    var cells = Cell.parseFilterString('id:-17,18&kajs:-100,200&abc:%as&uias:+1021,78&js:-1,2,3,4,5,6,7');
    var condition = new Condition();
        condition.putCell.call(condition,cells);

    var table  = cbean.toTable.call(cbean);
    var fields = cbean.toFields.call(cbean);
    var topics = {};
    var events = function(err,count) {
        if(err || 'function' != typeof callback) {
            res.write('Error');
            res.end();
        } else {
            callback(count);
        }
    };
    this.store.count.call(this.store,events,table,condition);
};
/*InitService.prototype.readCChart = function(callback) {
    console.log('InitService readCCahrt');
    var res = Application._RESPONSE;
    //req.params.id = 1000;
    //req.params.displayName = "myname";
    var cchart = new CChart();
    //cchart.build.call(cchart);
    //console.log(typeof req.params.ID);
    //cchart.setID.call(cchart,1000);
    //cchart.setDisplayName.call(cchart,"myname");
    //var displayname = cchart.getDisplayName.call(cchart);

    var table = cchart.toTable.call(cchart);
    var fields = cchart.toFields.call(cchart);//console.log(fields);
    var topics = {};
    var events = function(err,rows) {
        topics = cchart.rowsToArray.call(cchart,rows);
        if('function' == typeof callback) {
            callback(topics);
        } else {
            res.end();
        }
    };
    this.store.select.call(this.store,events,table,fields);
    //return {'topics':topics,'totalCount':count};
};*/

//module exports
module.exports = InitService;
