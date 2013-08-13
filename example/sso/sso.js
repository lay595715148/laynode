var sso = {
    namespace : 'sso',
    display_error : true,
    actions : {
        "authorize" : {
            "classname":"Authorize",
            "auto-dispatch":true,
            "beans":[],
            "services":["oauth2","oauth2client","oauth2token","oauth2code","oauth2user"]
        },
        "token" : {
            "classname":"Token",
            "auto-dispatch":true,
            "beans":[],
            "services":["oauth2","oauth2client","oauth2token","oauth2code","oauth2user"]
        },
        "resource" : {
            "classname":"Resource",
            "auto-dispatch":true,
            "beans":[],
            "services":["oauth2","oauth2client","oauth2token","oauth2user"]
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
            "classname":"OAuth2Service",
            "store":"mysql-sso"
        },
		"oauth2user" : {
            "auto-init":true,
            "classname":"OAuth2UserService",
            "store":"mysql-sso"
		},
		"oauth2client" : {
            "auto-init":true,
            "classname":"OAuth2ClientService",
            "store":"mysql-sso"
		},
		"oauth2code" : {
            "auto-init":true,
            "classname":"OAuth2CodeService",
            "store":"mysql-sso"
		},
		"oauth2token" : {
            "auto-init":true,
            "classname":"OAuth2TokenService",
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
        },
		'oauth2user' : {
			'id' : 'id',
			'username' : 'username',
			'password' : 'password',
			'group' : 'group'
		}
    },
    classes : {
        'User' : '/example/sso/classes/User.js',
		'OAuth2Code' : '/example/sso/classes/OAuth2Code.js',
		'OAuth2User' : '/example/sso/classes/OAuth2User.js',
        'OAuth2Service' : '/example/sso/classes/OAuth2Service.js',
        'OAuth2Client' : '/example/sso/classes/OAuth2Client.js',
        'OAuth2ClientService' : '/example/sso/classes/OAuth2ClientService.js',
		'OAuth2CodeService' : '/example/sso/classes/OAuth2CodeService.js',
		'OAuth2TokenService' : '/example/sso/classes/OAuth2TokenService.js',
		'OAuth2UserService' : '/example/sso/classes/OAuth2UserService.js',
        'Authorize' : '/example/sso/classes/Authorize.js',
        'Token' : '/example/sso/classes/Token.js',
        'Resource' : '/example/sso/classes/Resource.js'
    },
    template_path: '/example/sso/template',
    auth_code_lifetime : 100,
    access_token_lifetime : 1800,
    refresh_token_lifetime : 86400,
    use_refresh_token : true
};

//module exports
module.exports = sso;
