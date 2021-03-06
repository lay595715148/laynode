var http    = require('http');
var express = require('express');
var fs      = require('fs');
var laynode = require('./lib');

//by express
var app = express();
app.configure(function() {
    //init laynode Application
    laynode.rootpath(__dirname);
    laynode.config({sso:'/example/sso/sso.js'});
    laynode.config({em:'/example/em/em.js'});
    laynode.initialize();
    //console.log(_laynode_config);

    app.set('views', __dirname + '/template');
    app.set('view engine', 'jade');
    app.use("/css", express.static(__dirname + '/static/css'));
    app.use("/js", express.static(__dirname + '/static/js'));
    app.use("/image", express.static(__dirname + '/static/image'));

    app.use(express.logger({stream: fs.createWriteStream(__dirname + '/logs/express.log', {flags: 'a'})}));
    //app.use(app.router);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret:'laynode',cookie: { maxAge: 60 * 60 * 1000 }}));
    app.use(express.static(__dirname + '/static'));
    
    var tmp = setInterval(function() {
        laynode.start(null, null, 'authorize', 'clean');
    },60000);/**/
    
    
});
app.all('/:a/:m',function(req, res) {
    var action = req.params.a, method = req.params.m;
    logger.log('Start:', JSON.stringify(req.route));
    laynode.start(req, res, action, method);
});
app.all('/:a',function(req, res) {
    var action = req.params.a;
    logger.log('Start:', JSON.stringify(req.route));
    laynode.start(req, res, action);
});

app.listen(3000);
logger.log('Server running at http://127.0.0.1:' + 3000 + '/');
