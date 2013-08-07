var sso = {
    prefix : 'SSO',
    display_error : true,
    actions : {
        "authorize" : {
            "classname":"Authorize",
            "auto-dispatch":true,
            "beans":[],
            "services":["oauth2"]
        },
        "token" : {
            "classname":"Token",
            "auto-dispatch":true,
            "beans":[],
            "services":["oauth2"]
        },
        "resource" : {
            "classname":"Resource",
            "auto-dispatch":true,
            "beans":[],
            "services":["oauth2"]
        }
    },
    beans : {
        "user" : {
            "auto-build":true,
            "classname": "User",
            "scope":2
        }
    },
    services : {
        "oauth2" : {
            "auto-init":true,
            "classname":"OAuth2",
            "store":"mysql-sso"
        }
    },
    stores:{
        "mysql-sso" : {
            "auto-connect":false,
            "classname":"Mysql",
            "host":"localhost",
            "port":3306,
            "user":"lay",
            "password":"123456",
            "database":"laysoft",
            "encoding":"UTF8",
            "show-sql":true
        }
    },
    mapping : {
        'tables' : {
            'users' : 'users'
        },
        'users' : {
            "userid" : "uid",
            "username" : "username",
            "isAdmin" : "is_admin"
        }
    },
    classes : {
        'User' : './example/sso/classes/User.js',
        'OAuth2' : './example/sso/classes/OAuth2.js',
        'Authorize' : './example/sso/classes/Authorize.js',
        'Token' : './example/sso/classes/Token.js',
        'Resource' : './example/sso/classes/Resource.js'
    },
    auth_code_lifetime : 100,
    access_token_lifetime : 1800,
    refresh_token_lifetime : 86400,
    use_refresh_token : true
};

//module exports
module.exports = sso;
