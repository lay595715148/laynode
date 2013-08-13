var util     = require('util');
var jade     = require('jade');
var fs       = require('fs');

var config   = global._laynode_config;
var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var Base     = require(basepath + '/core/Base.js');
var Action   = require(basepath + '/core/Action.js');
var Util     = require(basepath + '/util/Util.js');

function Template() {
    Base.call(this);
}

Template.prototype._request    = undefined;
Template.prototype._response   = undefined;
Template.prototype._engine     = jade;
Template.prototype._path       = '/template';
Template.prototype._vars       = {};
Template.prototype._headers    = [];
Template.prototype._metas      = {};
Template.prototype._jses       = [];
Template.prototype._javascript = [];
Template.prototype._csses      = [];
Template.prototype._file       = '';
Template.prototype._template   = '';
Template.prototype._lans       = {};

Template.prototype.init = function(req,res) {
    var lang  = config['language'];
    var langs = config['languages'];
    if(lang && util.isArray(langs) && 'string' == typeof langs[lang] && langs[lang]) {
        ;
    }
    this._vars = {};
    this._headers = [];
    this._metas = {};
    this._jses = [];
    this._javascript = [];
    this._csses = [];
    this._file = '';
    this._template = '';
    this._request = req;
    this._response = res;
    this.path(this._path);
};
Template.prototype.path = function(p) {
    if('string' == typeof p) {console.log('p:' + p);
        if(p.indexOf(rootpath) != -1) {
            this._path = p;
        } else {
            this._path = rootpath + p;
        }
    }
};
Template.prototype.header = function(headers, val) {
    if('string' == typeof headers) {
        if('undefined' == typeof val) {
            var index = headers.indexOf(':');
            if(index > 0) {
                var i = headers.substr(0,index).trim();
                var val = headers.substr(index+1,headers.length - index).trim();
                var tmp = {};
                tmp[i] = val;
                this._headers.push(tmp);
            }
        } else {
            var tmp = {};tmp[headers] = val;
            this._headers.push(tmp);
        }
    } else if(util.isArray(headers)){
        for(var i in headers) {
            this._headers.push(headers[i]);
        }
    } else if(util.isObject(headers)) {
        for(var i in headers) {
            var tmp = {};tmp[i] = headers[i];
            this._headers.push(tmp);
        }
    }
};
Template.prototype.title = function(str,head) {
    if('undefined' == typeof this._vars['title']) {
        this._vars['title'] = str;
    } else {
        if(head === true) {
            this._vars['title'] = this._vars['title'] + str;
        } else {
            this._vars['title'] += str;
        }
    }
};
Template.prototype.push = function(name,val) {
    if('string' == typeof name) {
        this._vars[name] = val;
    } else if('object' == typeof name) {
        for(var n in name) {
            this._vars[n] = name[n];
        }
    }
};
//for root path or absolute path
Template.prototype.file = function(f,outer) {
    if('string' == typeof f) {
        if(f.indexOf(rootpath) != -1) {
            this._file = f;
        } else if(outer){
			this._file = f;
		} else {
            this._file = rootpath + f;
        }
    }
};
Template.prototype.template = function(tpl) {
    if('string' == typeof tpl && 'undefined' != typeof this._path) {
        if(tpl.indexOf(this._path) != -1) {
            this._template = tpl;
        } else {
            this._template = this._path + tpl;
        }
    }
};
Template.prototype.meta = function(metas) {
    if(util.isObject(metas)){
        for(var i in metas) {
            this._metas[i] = metas[i];
        }
    }
};
Template.prototype.js = function(jses) {
    if('string' == typeof jses) {
        this._jses.push(jses);
    } else if(util.isArray(jses) || util.isObject(jses)) {
        for(var i in jses) {
            this._jses.push(jses[i]);
        }
    }
};
Template.prototype.javascript = function(jses) {
    if('string' == typeof jses) {
        this._javascript.push(jses);
    } else if(util.isArray(jses) || util.isObject(jses)) {
        for(var i in jses) {
            this._javascript.push(jses[i]);
        }
    }
};
Template.prototype.css = function(csses) {
    if('string' == typeof csses) {
        this._csses.push(csses);
    } else if(util.isArray(csses) || util.isObject(csses)) {
        for(var i in csses) {
            this._csses.push(jses[i]);
        }
    }
};
Template.prototype.vars = function() {
    return this._vars;
};
Template.prototype.attachment = function() {
    var res = this._response;
	
    if(this._file && fs.existsSync(this._file)) {
        res.attachment(this._file);
    } else {
        res.end();
    }
};
Template.prototype.json = function() {
    var res = this._response;

    if(this._vars) {
        res.json(this._vars);
    } else {
        res.json({});
    }
};
Template.prototype.jsonp = function() {
    var res = this._response;

    if(this._vars) {
        res.jsonp(this._vars);
    } else {
        res.jsonp({});
    }
}
Template.prototype.xml = function() {
    var res = this._response;
    var content = Util.json2xml(this._vars);

    if(this._headers.length > 0) {
        for(var i in this._headers) {
            for(var prop in this._headers[i]) {
                if(prop.toUpperCase() === 'STATUS' || prop.toUpperCase() === 'STATUSCODE') {
                    res.statusCode = this._headers[i][prop];
                } else {
                    res.setHeader(prop, this._headers[i][prop]);
                }
            }
        }
    }
    if('string' === typeof content && content) {
        res.end(content);
    } else {
        res.end("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
    }
};
Template.prototype.out = function() {
    var content = '';
    try {
        var n = Util.extend(this._vars,{_lans:this._lans});
        if(fs.existsSync(this._template)) content = this._engine.render(fs.readFileSync(this._template), n);
    } catch(e) {
        console.log(e);
    }
    return content;
};
Template.prototype.display = function() {
    var req = this._request;
    var res = this._response;
    var content = '';
    try {
        var n = Util.extend(this._vars,{_lans:this._lans});
        if(fs.existsSync(this._template)) content = this._engine.render(fs.readFileSync(this._template), n);
    } catch(e) {
        console.log(e);
    }
    
    if(this._headers.length > 0) {
        for(var i in this._headers) {
            for(var prop in this._headers[i]) {
                if(prop.toUpperCase() === 'STATUS' || prop.toUpperCase() === 'STATUSCODE') {
                    res.statusCode = this._headers[i][prop];
                } else {
                    res.setHeader(prop, this._headers[i][prop]);
                }
            }
        }
    }

    if('string' === typeof content && content) {
        res.end(content);
    } else {
        res.end('no content');
    }
};

//module exports
module.exports = Template;