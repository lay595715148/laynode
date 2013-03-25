var util        = require('util');
var Action      = require('../laynode/core/Action.js');
var Paging      = require('../laynode/util/Paging.js');
var Application = require('../laynode/Application.js');
var Cell        = require('../laynode/util/Cell.js');
var Condition   = require('../laynode/util/Condition.js');

function InitGenerator(actionConfig) {
    Action.call(this,actionConfig);
}

util.inherits(InitGenerator, Action);

InitGenerator.prototype.init = function() {
    Action.prototype.init.call(this);
    //console.log('InitGenerator init');
};
InitGenerator.prototype.launch = function() {
    console.log('launch');
    var req = Application._REQUEST;
    var res = Application._RESPONSE;
    var actionConfig = this.config;
    var initService = this.services['initService'];
    var paging = new Paging();

    paging.build.call(paging);
    //paging.carry.call(paging);
    var pages = paging.toPages.call(paging);
    var limit = paging.toLimit.call(paging);
    var cells = Cell.parseFilterString('name:^myname,as&kajs:-100,200&abc:%as&uias:+1021,78&js:-1,2,3,4,5,6,7');
    var cond  = new Condition();
        cond.putCell.call(cond,cells);
    var cell = new Cell('yours',['mine','his'],0);
    var filter = cell.toFilterString.call(cell);
        cond.setOrpos.call(cond,3);
    var sql = cond.toSQLString.call(cond);
    initService.readCount.call(initService,'CChart',function(count) {
        //res.write("<pre>");
        //res.header('Content-Type', 'text/plain');
        //res.write(JSON.stringify(req.session) + "\n");
        //res.write(JSON.stringify(req.cookies) + "\n");
        res.write(JSON.stringify('CChart count:' + count) + "\n");
        res.write(JSON.stringify('Paging limit:' + limit) + "\n");
        res.write(JSON.stringify(sql) + "\n");
        res.write(JSON.stringify(req.headers) + "\n");
        res.write(JSON.stringify(actionConfig) + "\n");
        //res.write("</pre>");
        res.end();
    });
    /*req.cookies = null;
    req.session = null;
    res.clearCookie('SSID');
    res.clearCookie('SID');
    res.clearCookie('name');
    res.clearCookie('rememberme');

    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });*/

    /*if("undefined" == typeof cookies['name']) {
        //req.cookies.username = 'user';
        //req.cookies.isadmin = 0;
        //req.cookies = {username:'user',isadmin:0};
        res.cookie('name', 'tobi', { path: '/',expires: new Date(Date.now() + 60*60*1000), httpOnly:true });
        res.cookie('rememberme', '1', { path: '/', expires: new Date(Date.now() + 60*60*1000), httpOnly:true });
        console.log('set cookie');
    }
    if("undefined" != typeof req.session) {
        req.session = {username:'admin',isadmin:1};
    }*/
    
};
InitGenerator.prototype.doLaunch = function() {
    console.log('doLaunch');
    var req = Application._REQUEST;
    var res = Application._RESPONSE;
    var actionConfig = this.config;
    var initService = this.services['initService'];

    //var methods = ['readCChart','readCConfig'];
    var cclasses = ['CChart','CConfig','CFacility','CReport','CSource','CUser','CView','CField','CTab','CFieldSetting','CPortlet'];
    //var total   = methods.length;
    var topics  = {};
    var total   = cclasses.length;
    var count   = 0;
    var callback = function(rows) {
        if(count == 0) {
            //res.header('Content-Type', 'text/plain');
        } else {
            topics[cclasses[count-1]] = rows;
            //res.write(JSON.stringify(rows) + "\n");
        }
        if(count < total) {
            //initService[methods[count]].call(initService,callback);
            initService.read.call(initService,cclasses[count],callback);
        } else {
            res.write(JSON.stringify(topics[cclasses[count-1]]) + "\n");
            res.end();
        }
        count++;
    };

    callback();
};

//module exports
module.exports = InitGenerator;
