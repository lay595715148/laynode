var util = require('util');
var Base = require('../core/Base.js');

var rootpath = global._laynode_rootpath;
var basepath = global._laynode_basepath;
var resolved = util.isArray(global._laynode_resolved)?global._laynode_resolved:[];
/**
 * <Util> is a powerful class,there are so many useful method in it.
 * If you don't like it,you are fool
 */
function Util(obj) {
    Base.call(this);
};

util.inherits(Util, Base);


Util.toGet = function(request) {
    return Util.resolve(request)[0];
};
Util.toPost = function(request) {
    return Util.resolve(request)[1];
};
Util.toRequest = function(request) {
    return Util.resolve(request)[2];
};
Util.toCookie = function(request) {
    return Util.resolve(request)[3];
};
Util.toSession = function(request) {
    return Util.resolve(request)[4];
};
Util.resolve = function(request, reset) {
    var $_GET = {}, $_POST = {}, $_REQUEST = {},$_COOKIE = {},$_SESSION = {};
    if(util.isArray(resolved) && resolved.length > 0 && !reset) return resolved;
    if('object' == typeof request) {
        if(request.method == "POST") {
            $_GET = request.query;
            $_POST = request.body;
            $_REQUEST = Util.extend(Util.clone($_GET),Util.clone($_POST));
        } else {
            $_GET = request.query;
            $_REQUEST = $_GET;
        }
        $_SESSION = request.session;
        $_COOKIE = request.cookies;
    }
    resolved = [$_GET,$_POST,$_REQUEST,$_COOKIE,$_SESSION];
    return resolved;
};
Util.s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};
Util.guid = function() {
  return Util.s4() + Util.s4() + '-' + Util.s4() + '-' + Util.s4() + '-' + Util.s4() + '-' + Util.s4() + Util.s4() + Util.s4();
};
Util.clone = function(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = Util.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = Util.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};
Util.extend = function(o,n,override) {
    for(var p in n) {
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) o[p]=n[p];
    }
    return o;
};
Util.json2xml = function(json) {
    var strXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    if(arguments.length==2) { 
        strXml= arguments[1];
    }
    for(var tag in json) {
        strXml = strXml.appendFlagBegin(tag);
        if(json[tag].constructor==Object||json[tag].constructor==Array) {
            strXml = Util.json2xml(json[tag],strXml);
        } else if(json[tag].constructor==String) {
            strXml = strXml.appendText(json[tag]);
        }
        strXml = strXml.appendFlagEnd(tag);
    }
    return strXml;
};
//下面是json转xml使用到的代码
String.prototype.regulStr = function () {
    if(this=="")return "";
    var s=this;
    var spacial = ["<",">","\"","'","&"];
    var forma = ["&lt;","&gt;","&quot;","&apos;","&amp;"]
    for(var i=0;i<spacial.length;i++)
    {
        s=s.replace(new RegExp(spacial[i],"g"),forma[i]);
    }
    return s;
};

String.prototype.appendText = function(s) {
    s = s.regulStr();
    return s==""?this:this+s+"\n";
};


String.prototype.appendFlagBegin = function(s) {
    return this+"<"+s+">\n";
};

String.prototype.appendFlagEnd = function(s) {
    return this+"</"+s+">\n";
};

//module exports
module.exports = Util;
