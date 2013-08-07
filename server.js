var http    = require('http');
var express = require('express');
var laynode = require('./laynode/Application.js');

//init laynode Application
laynode.initialize();

//by http
/*var port    = 1337;
var server  = http.createServer();

server.listen(port);
server.on('request',function(req, res) {
    laynode.start(req, res);
});
console.log('Server running at http://127.0.0.1:' + port + '/');*/

//by express
var app = express();
app.configure(function() {
    app.set('views', __dirname + '/template');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret:'laynode',cookie: { maxAge: 60 * 60 * 1000 }}));
});
app.use(express.static(__dirname + '/static'));
app.use("/css", express.static(__dirname + '/static/css'));
app.use("/js", express.static(__dirname + '/static/js'));
app.use("/image", express.static(__dirname + '/static/image'));
app.all(/./,function(req, res) {
    laynode.start(req, res);
});

app.listen(3000);
console.log('Server running at http://127.0.0.1:' + 3000 + '/');
