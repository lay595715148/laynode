var util      = require('util');
var url       = require('url');
var jade      = require('jade');
var Service   = require('../../../laynode/core/Service.js');
var Condition = require('../../../laynode/util/Condition.js');
var Cell      = require('../../../laynode/util/Cell.js');
var Sort      = require('../../../laynode/util/Sort.js');
var MD5       = require('../../../laynode/util/MD5.js');
var lang      = require('../lang/lang.js');
var sso       = require('../sso.js');

function OAuth2(serviceConfig) {
    Service.call(this,serviceConfig);
}

util.inherits(OAuth2, Service);

OAuth2.ERROR = lang.OAuth2.ERROR;
OAuth2.ERROR_DESC = lang.OAuth2.ERROR_DESC;
OAuth2.REQUEST_TYPE_CODE = 'code';
OAuth2.REQUEST_TYPE_TOKEN = 'token';
OAuth2.REQUEST_TYPE_PASSWORD = 'password';
OAuth2.REQUEST_TYPE_REFRESH_TOKEN = 'refresh_token';
OAuth2.RESPONSE_TYPE_CODE = 'code';
OAuth2.RESPONSE_TYPE_TOKEN = 'token';
OAuth2.GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
OAuth2.GRANT_TYPE_PASSWORD = 'password';
OAuth2.GRANT_TYPE_REFRESH_TOKEN = 'refresh_token';
OAuth2.CLIENT_TYPE_WEB = 'webApp';
OAuth2.CLIENT_TYPE_DESKTOP = 'desktopApp';
OAuth2.CLIENT_TYPE_JS = 'jsApp';
OAuth2.TOKEN_TYPE_ACCESS = 0;
OAuth2.TOKEN_TYPE_REFRESH = 1;

OAuth2.prototype.result = {headers:[],content:''};
OAuth2.prototype.verifyAccessToken = function(params, req, res) {//读取入口函数
    if('undefined' == typeof params) { return false; }

    var access_token = params.access_token,
        state = params.state,
        token,
        client_id,
        username,
        scope,
        client_info,
        resource,
        oauth2 = this;

    oauth2.on('checkToken',function(res) {
        console.log('checkToken');
        token = res;
        //2.检查token的合法性，
        if(!token) {
            console.log('errorJsonResponse : token');
            oauth2.errorJsonResponse(400, OAuth2.ERROR.INVALID_TOKEN, OAuth2.ERROR_DESC.INVALID_TOKEN);
            oauth2.emit('verifyAccessToken',oauth2.result);
        } else {
            client_id = token.client_id;
            client_info = oauth2.readClient(client_id);
        }
    }).on('readClient',function(res) {
        console.log('readClient');
        client_info = res;
        //3.检查client的合法性，
        if(!client_info) {
            console.log('errorJsonResponse : client_info');
            oauth2.errorJsonResponse(400, OAuth2.ERROR.INVALID_CLIENT, OAuth2.ERROR_DESC.INVALID_CLIENT);
            oauth2.emit('verifyAccessToken',oauth2.result);
        } else {
            username = token.username;
            scope = client_info.scope;
            oauth2.loadResource(username,scope);
        }
    }).on('loadResource',function(res) {
        resource = res;
        if('undefined' != typeof state) { resource['state'] = state; }

        oauth2.result.content = resource;
        oauth2.emit('verifyAccessToken',oauth2.result);
    }).on('error',function(res) {
        var et = new Date().getTime();
        console.log('event error [verifyAccessToken]');
        oauth2.emit('verifyAccessToken',oauth2.result);
    });

    //1.检查请求的合法性，
    if(!access_token) {
        console.log('errorJsonResponse : access_token');
        oauth2.errorJsonResponse(400, OAuth2.ERROR.INVALID_REQUEST, OAuth2.ERROR_DESC.INVALID_REQUEST);
        oauth2.emit('verifyAccessToken',oauth2.result);
    } else {
        token = oauth2.checkToken({'oauthToken':access_token, 'type':OAuth2.TOKEN_TYPE_ACCESS});
    }
    //oauth2.emit('verifyAccessToken',oauth2.result);
};
OAuth2.prototype.grantAccessToken = function(params, req, res) {//获取授权入口函数
    if('undefined' == typeof params) { return false; }

    var request_type = '',
        grant_type = params.grant_type,
        client_type,
        client_info,
        client_id = params.client_id,
        client_secret = params.client_secret,
        redirect_uri = params.redirect_uri,
        state = params.state,
        username,
        authCode,
        token,
        oauth2 = this;

    oauth2.on('checkClient',function(res) {
        console.log('event checkClient');
        client_info = res;
        //3.检查客户端是否注册(没有注册的话提示“非法用户“)
        if(!client_info) {
            oauth2.errorJsonResponse(400, OAuth2.ERROR.INVALID_CLIENT, OAuth2.ERROR_DESC.INVALID_CLIENT);

            oauth2.emit('grantAccessToken',oauth2.result);
        } else {

            //4.根据不同情况获得验证码或令牌(请求地址合法性和用户的合法性已经在上面处理过)
            switch(grant_type) {
                case OAuth2.GRANT_TYPE_AUTHORIZATION_CODE:
                    username = 'username';
                    break;
                case OAuth2.GRANT_TYPE_PASSWORD:
                    //$CFG['use_refresh_token'] = true;
                    username = 'username_password';
                    break;
                case OAuth2.GRANT_TYPE_REFRESH_TOKEN:
                    //如果请求中存在刷新令牌，判断其合法性，否则提示刷新令牌非法
                    username = 'username_session';
                    break;
            }

            //问题所在：产生了多余的一个无用户id的访问令牌和一个刷新令牌,如何解决呢？
            //这里始终都会产生一个访问令牌和一个刷新令牌
            //问题是：你自己无论如何都能在这产生一个新的访问令牌和一个刷新令牌，那么在之前判断请求的刷新令牌是否合法有什么意义呢？
	        //answer:一旦请求错误，立即返回错误信息，结束方法
            token = oauth2.createToken(client_id,username);//产生token
        }
    }).on('createToken',function(res) {
        console.log('event createToken');
        authCode = res;
        if('undefined' != typeof state) { authCode['state'] = state; }

        oauth2.result.content = authCode;
        oauth2.emit('grantAccessToken',oauth2.result);
    }).on('error',function(res) {
        var et = new Date().getTime();
        console.log('event error [grantAccessToken]');
        oauth2.emit('grantAccessToken',oauth2.result);
    });

    //通过grant_type获取request_type
    switch(grant_type) {
        case OAuth2.GRANT_TYPE_AUTHORIZATION_CODE:
            request_type = OAuth2.REQUEST_TYPE_TOKEN;
            break;
        case OAuth2.GRANT_TYPE_PASSWORD:
            request_type = OAuth2.REQUEST_TYPE_PASSWORD;
            break;
        case OAuth2.GRANT_TYPE_REFRESH_TOKEN:
            request_type = OAuth2.REQUEST_TYPE_REFRESH_TOKEN;
            break;
        default:
            grant_type  = OAuth2.GRANT_TYPE_AUTHORIZATION_CODE;
            request_type = OAuth2.REQUEST_TYPE_TOKEN;
            break;
    }

    if(!oauth2.checkUriInvalid(params, request_type)) {
        //1.检查请求地址的合法性，
        oauth2.errorJsonResponse(400, OAuth2.ERROR.INVALID_REQUEST, OAuth2.ERROR_DESC.INVALID_REQUEST);
        oauth2.emit('grantAccessToken',oauth2.result);
    } else if(grant_type != OAuth2.GRANT_TYPE_AUTHORIZATION_CODE && grant_type != OAuth2.GRANT_TYPE_PASSWORD && grant_type != OAuth2.GRANT_TYPE_REFRESH_TOKEN) {
        //2.判断授权的应用类型
        oauth2.errorJsonResponse(400, OAuth2.ERROR.UNSUPPORTED_GRANT_TYPE, OAuth2.ERROR_DESC.UNSUPPORTED_GRANT_TYPE);
        oauth2.emit('grantAccessToken',oauth2.result);
    } else {
        switch(grant_type) {
            case OAuth2.GRANT_TYPE_AUTHORIZATION_CODE:
                client_type = OAuth2.CLIENT_TYPE_WEB;
                client_info = oauth2.checkClient({'clientId':client_id, 'clientType':client_type, 'clientSecret':client_secret, 'redirect_uri':redirect_uri});
                break;
            case OAuth2.GRANT_TYPE_PASSWORD:
                client_ype = OAuth2.CLIENT_TYPE_DESKTOP;
                client_info = oauth2.checkClient({'clientId':client_id, 'clientType':client_type, 'clientSecret':client_secret});
                break;
            case OAuth2.GRANT_TYPE_REFRESH_TOKEN:
                client_info = oauth2.checkClient({'clientId':client_id, 'clientSecret':client_secret});
                break;
        }
    }
};
OAuth2.prototype.finishClientAuthorization = function(params, req, res) {//请求授权入口函数
    if('undefined' == typeof params) { return false; }

    var client_id = params.client_id,
        response_type = params.response_type,
        redirect_uri = params.redirect_uri,
        username = params.username,
        password = params.password,
        state = params.state,
        client_type,
        scope,
        client_info,
        owner,
        result = {},
        session = req.session,
        authCode,
        token,
        oauth2 = this;

    switch(response_type) {
        case OAuth2.RESPONSE_TYPE_CODE:
            client_type = OAuth2.CLIENT_TYPE_WEB;
            break;
        case OAuth2.RESPONSE_TYPE_TOKEN:
            client_type = OAuth2.CLIENT_TYPE_JS;
            break;
        default:
            response_type = OAuth2.RESPONSE_TYPE_CODE;
            client_type = OAuth2.CLIENT_TYPE_WEB;
            break;
    }

    oauth2.on('createAuthCode',function(res) {
        console.log('event createAuthCode');
        authCode = res;
        if('undefined' != typeof state) { authCode['state'] = state; }

        oauth2.result.content = authCode;
        oauth2.emit('finishClientAuthorization',oauth2.result);
    }).on('createToken',function(res) {
        console.log('event createToken');
        token = res;
        if('undefined' != typeof state) { token['state'] = state; }

        oauth2.result.content = token;
        oauth2.emit('finishClientAuthorization',oauth2.result);
    }).on('checkResourceOwner',function(res) {
        console.log('event checkResourceOwner');
        owner = res;
        //3.1检测用户是否登录成功
        if(owner) {
            if(response_type == OAuth2.RESPONSE_TYPE_CODE){
                authCode = oauth2.createAuthCode(client_id,redirect_uri);
            } else if(response_type == OAuth2.RESPONSE_TYPE_TOKEN){
                token = oauth2.createToken(client_id, username);
            }
        } else {
            oauth2.doCreateHtml('authenticate.html');
            oauth2.emit('finishClientAuthorization',oauth2.result);
        }
    }).on('checkClient',function(res) {
        console.log('event checkClient');
        client_info = res;
        //1.检测client的合法性，2.检查请求的合法性，
        if(!client_info || !oauth2.checkUriInvalid(params,OAuth2.REQUEST_TYPE_CODE)) {
            console.log('error client_info or checkUriInvalid: ');

            if(!redirect_uri) {
                var error = client_info ? OAuth2.ERROR.INVALID_REQUEST : OAuth2.ERROR.INVALID_CLIENT;
                var error_description = client_info ? OAuth2.ERROR_DESC.INVALID_REQUEST : OAuth2.ERROR_DESC.INVALID_CLIENT;
                oauth2.errorJsonResponse(400, error, error_description);
            } else if(response_type == OAuth2.RESPONSE_TYPE_TOKEN) {
                result['fragment'] = {};
                result['fragment']['error'] = client_info ? OAuth2.ERROR.INVALID_REQUEST : OAuth2.ERROR.INVALID_CLIENT;
                if('undefined' != typeof state) { result['fragment']['state'] = state; }
                oauth2.doRedirectUriCallback(redirect_uri, result);
            } else {
                result['query'] = {};
                result['query']['error'] = client_info ? OAuth2.ERROR.INVALID_REQUEST : OAuth2.ERROR.INVALID_CLIENT;
                if('undefined' != typeof state) { result['query']['state'] = state; }
                oauth2.doRedirectUriCallback(redirect_uri, result);
            }

            oauth2.emit('finishClientAuthorization',oauth2.result);
        } else {
            //3.检测是不是用户提交登录
            if('undefined' != typeof username && 'undefined' != typeof password && req.method == "POST") {
                scope = client_info.scope;
                owner = oauth2.checkResourceOwner(username,password,scope);
            } else {
                //username = '';
                //3.2检测用户登录状态
                if(!session['SESSION_LOGGEDIN']){
                    console.log('session');
                    var obj = {
                        'REDIRECT_URI' : redirect_uri,
                        'CLIENT_ID' : client_id,
                        'RESPONSE_TYPE' : response_type,
                        'STATE' : ('undefined' != typeof state)?state:false
                    }
                    var options = {
                        filename : '../template/authenticate.jade'
                    };

                    // Compile a function
                    var fn = jade.compile('string of jade', options);
                    console.log(fn(obj));
                    //$CFG['REDIRECT_URI'] = redirect_uri;
                    //$CFG['STATE'] = state;
                    //$CFG['RESPONSE_TYPE'] = response_type;
                    oauth2.doCreateHtml('authenticate.html', obj);
                } else if(!session['loggedin']){
                    //$CFG['IS_LOGIN'] = true;
                    //$CFG['USERNAME'] = username;
                    //$CFG['REDIRECT_URI'] = redirect_uri;
                    //$CFG['STATE'] = state;
                    //$CFG['RESPONSE_TYPE'] = response_type;
                    oauth2.doCreateHtml('authenticate.html');
                } else if(session['loggedin']) {
                    if(accept == "其他帐号") {
                        //unset($_SESSION['SESSION_LOGGEDIN']);
                        //unset($_SESSION['SESSION_USERNAME']);
                        //MemSession::setSession();
                        //$CFG['REDIRECT_URI'] = redirect_uri;
                        //$CFG['STATE'] = state;
                        //$CFG['RESPONSE_TYPE'] = response_type;
                        oauth2.doCreateHtml('authenticate.html');
                    }
                }

                oauth2.emit('finishClientAuthorization',oauth2.result);
            }
        }
    }).on('error',function(res) {
        var et = new Date().getTime();
        console.log('event error [finishClientAuthorization]');
        oauth2.emit('finishClientAuthorization',oauth2.result);
    }).on('finishClientAuthorization',function(res) {
        console.log('lei');
    });

    client_info = oauth2.checkClient({'clientId':client_id, 'clientType':client_type, 'redirectURI':redirect_uri});
};

OAuth2.prototype.checkClient = function(props) {
    var store = this.store;
    var clients;
    var oauth2 = this;
    var client_info = {id:19, client_id:'sso_client', client_secret:'3e52dcaa08449e7a10a39de3b545f675', client_type:'webApp', client_name:'SSO管理客户端', client_describe:'SSO管理客户端', redirect_uri:'http://localhost/SSO/src/admin/index.php', scope:'uid,username,role'};

    store.on('query',function(err, rows, fields) {
        clients = store.toArray.call(store, 1);
        oauth2.emit('checkClient', clients);
    }).on('error',function(err, rows, fields) {
        console.log(3);
        oauth2.emit('checkClient', client_info);
    });
    var cond = new Condition();
    var sort = new Sort();
    var cells = Cell.parseFilterString('uid:>2&username:%ufsso');//console.log(cells);
    cond.putCell(cells);
    //store.query('SELECT * FROM clients ORDER BY `id` DESC LIMIT 10');
    store.select('users',['uid','username','user_id'],cond,'',['uid'],'LIMIT 2');

    return client_info;
};
OAuth2.prototype.checkToken = function(props) {
    var oauthToken = props.oauthToken,
        type = props.type,
        token = {'oauthToken':oauthToken, 'client_id':'sso_client', 'expires':1372020909, 'type':type, 'username':'username'};
    this.emit('checkToken', token);
    return token;
};
OAuth2.prototype.checkResourceOwner = function(username, password, scope) {
    var user_info = {'uid':'10000','username':'李某某','role':'学生'};
    this.emit('checkResourceOwner', user_info);
    return user_info;
};
OAuth2.prototype.readClient = function(client_id) {
    var client_info = {id:19, client_id:'sso_client', client_secret:'3e52dcaa08449e7a10a39de3b545f675', client_type:'webApp', client_name:'SSO管理客户端', client_describe:'SSO管理客户端', redirect_uri:'http://localhost/SSO/src/admin/index.php', scope:'uid,username,role'};
    this.emit('readClient', client_info);
    return client_info;
};
OAuth2.prototype.loadResource = function(username, scope) {
    var resource = {'uid':'10000', 'username':'李某某', 'role':'学生'};

    this.emit('loadResource', resource);
    return resource;
};
OAuth2.prototype.createAuthCode = function(client_id, redirect_uri) {
    var date = new Date();
    var username = 'username_session';
    var authCode = {
        "code":this.generateCode()
    };
    var authCodeObj = {
        "code":authCode["code"],
        "clientId":client_id,
        "redirectURI":redirect_uri,
        "expires":Math.floor(date.getTime()/1000) + sso.auth_code_lifetime,
        "username":username,
    };
    //AuthCodeManager::create($authCodeArray);

    //this.result.content = authCode;
    this.emit('createAuthCode', authCode);
    return authCode;
};
OAuth2.prototype.createToken = function(client_id, username) {
    var date = new Date();
    var token = {
        "access_token":this.generateCode(),
        "token_type":"access",
        "expires_in":1800
    };
    var tokenObj = {
        'oauthToken':token["access_token"], 
        'clientId':client_id, 
        'expires':Math.floor(date.getTime()/1000) + sso.access_token_lifetime, 
        'username':username, 
        'type':OAuth2.TOKEN_TYPE_ACCESS
    };
    //TokenManager::create(tokenObj);//存入数据库

    if(sso.use_refresh_token) {
        token["refresh_token"] = this.generateCode();
        tokenObj = {
            'oauthToken':token["refresh_token"], 
            'clientId':client_id, 
            'expires':Math.floor(date.getTime()/1000) + sso.refresh_token_lifetime, 
            'username':username, 
            'type':OAuth2.TOKEN_TYPE_REFRESH
        };
        //TokenManager::create(tokenObj);//存入数据库
    }

    //this.result.content = token;
    this.emit('createToken', token);
    return token;
};
OAuth2.prototype.generateCode = function() {
    return MD5.hex_md5('' + Math.random() + new Date().getTime());
};
OAuth2.prototype.doCreateHtml = function(template) {
    this.result.content = 'doCreateHtml:' + template;
    return this.result;
};
OAuth2.prototype.doRedirectUriCallback = function(redirect_uri, params) {
    this.result.headers.push({"Status":302});
    this.result.headers.push({"Cache-Control":"no-cache, no-store, must-revalidate"});
    this.result.headers.push({"Content-Type":"text/plain"})
    this.result.headers.push({"Location":this.buildUri(redirect_uri, params)});
    return this.result;
};
OAuth2.prototype.buildUri = function(uri, params) {
    console.log('buildUri: ');
    var parse_url = url.parse(uri);//'http://192.168.0.245/mail/?_task=link_attachment'
    return uri;
};
OAuth2.prototype.errorJsonResponse = function(http_status_code, error, error_description, error_uri) {
    var result = {};
        result['error'] = error;

    if (sso['display_error'] && error_description) {
        result['error_description'] = error_description;
    }

    if (sso['display_error'] && error_uri) {
        result['error_uri'] = error_uri;
    }
    console.log({errorJsonResponse:1});

    //header("HTTP/1.1 " . $http_status_code);去除状态码
    this.result.headers.push({'Content-Type':'application/json'});
    this.result.headers.push({'Cache-Control':'no-store'});
    this.result.content = JSON.stringify(result);
};
OAuth2.prototype.checkUriInvalid = function(params,request_type) {
    console.log(params);
    var bool = true;
    switch(request_type) {
        case OAuth2.REQUEST_TYPE_CODE:
            if('undefined' == typeof params.client_id || 'undefined' == typeof params.redirect_uri) {
                bool = false;
            } else if('undefined' != typeof params.response_type && params.response_type != OAuth2.RESPONSE_TYPE_CODE && params.response_type != OAuth2.RESPONSE_TYPE_TOKEN) {
                bool = false;
            }
            break;
        case OAuth2.REQUEST_TYPE_TOKEN:
            if('undefined' == typeof params.client_id || 'undefined' == typeof params.redirect_uri || 'undefined' == typeof params.client_secret || 'undefined' == typeof params.code) {
                bool = false;
            }
            break;
        case OAuth2.REQUEST_TYPE_PASSWORD:
            if('undefined' == typeof params.client_id || 'undefined' == typeof params.client_secret
                || 'undefined' == typeof params.grant_type || 'undefined' == typeof params.username
                || 'undefined' == typeof params.password) {
                bool = false;
            }
            break;
        case OAuth2.REQUEST_TYPE_REFRESH_TOKEN:
            if('undefined' == typeof params.client_id || 'undefined' == typeof params.client_secret || 'undefined' == typeof params.grant_type || 'undefined' == typeof params.refresh_token) {
                bool = false;
            }
            break;
        default:
            bool = false;
            break;
    }
    return bool;
};

//module exports
module.exports = OAuth2;
