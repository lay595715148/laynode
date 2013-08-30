var sso = {
    namespace : 'sso',
    display_error : true,
    actions : {
        authorize : {
            'classname':'Authorize',
            'auto-dispatch':true,
            'auto-init-template':true,
            'auto-init-bean':false,
            'auto-init-service':false,
            'beans':[],
            'services':['oauth2','oauth2client','oauth2token','oauth2code','oauth2user']
        },
        token : {
            'classname':'Token',
            'auto-dispatch':true,
            'auto-init-template':true,
            'beans':[],
            'services':['oauth2','oauth2client','oauth2token','oauth2code','oauth2user']
        },
        resource : {
            'classname':'Resource',
            'auto-dispatch':true,
            'auto-init-template':true,
            'beans':[],
            'services':['oauth2','oauth2client','oauth2token','oauth2user']
        },
        show : {
            'classname':'Show',
            'auto-dispatch':true,
            'auto-init-template':true,
            'beans':[],
            'services':['show']
        },
        person : {
            'classname':'Show',
            'auto-dispatch':true,
            'auto-init-template':true,
            'beans':[],
            'services':['show']
        }
    },
    beans : {
        'user' : {
            'auto-build':true,
            'classname': 'User',
            'scope':2
        }
    },
    services : {
        'show' : {
            'auto-init':true,
            'classname':'ShowService',
            'store':'mongo-sso'
        },
        'oauth2' : {
            'auto-init':true,
            'classname':'OAuth2Service',
            'store':'mysql-sso'
        },
        'oauth2user' : {
            'auto-init':true,
            'classname':'OAuth2UserService',
            'store':'mysql-sso'
        },
        'oauth2client' : {
            'auto-init':true,
            'classname':'OAuth2ClientService',
            'store':'mysql-sso'
        },
        'oauth2code' : {
            'auto-init':true,
            'classname':'OAuth2CodeService',
            'store':'mysql-sso'
        },
        'oauth2token' : {
            'auto-init':true,
            'classname':'OAuth2TokenService',
            'store':'mysql-sso'
        }
    },
    stores:{
        'mysql-sso' : {
            'auto-connect':false,
            'classname':'Mysql',
            //see more https://github.com/felixge/node-mysql#connection-options
            'host':'localhost',
            'port':3306,
            'user':'lay',
            'password':'123456',
            'database':'laysoft',
            'encoding':'UTF8',
            'show-sql':true
        },
        'mongo-sso' : {
            'auto-connect':false,
            'classname':'MongoDB',
            //'host':'192.168.159.81',
            'host':'127.0.0.1',
            'port':27017,
            'user':'lay',
            'password':'123456',
            'database':'laysoft',
            'encoding':'UTF8',
            'show-sql':true
        }
    },
    mapping : {
        tables : {
            'users' : 'users',
            'OAuth2User' : 'lay_person',
            'OAuth2Code' : 'lay_sso_oauth2_code',
            'OAuth2Token' : 'lay_sso_oauth2_token',
            'OAuth2Client' : 'lay_sso_oauth2_client'
        },
        'users' : {
            'userid' : 'uid',
            'username' : 'username',
            'isAdmin' : 'is_admin'
        },
        'OAuth2User' : {
            'id' : 'id',
            'username' : 'username',
            'password' : 'password',
            'group' : 'group'
        },
        'OAuth2Code' : {
            'id' : 'id',
            'code' : 'code',
            'clientID' : 'client_id',
            'redirectURI' : 'redirect_uri',
            'expires' : 'expires',
            'userid' : 'userid'
        },
        'OAuth2Token' : {
            'id' : 'id',
            'token' : 'token',
            'clientID' : 'client_id',
            'type' : 'type',
            'expires' : 'expires',
            'userid' : 'userid'
        },
        'OAuth2Client' : {
            'id' : 'id',
            'clientID' : 'client_id',
            'clientName' : 'client_name',
            'clientSecret' : 'client_secret',
            'clientType' : 'client_type',
            'redirectURI' : 'redirect_uri',
            'scope' : 'scope',
            'clientLocation' : 'client_location',
            'clientDescription' : 'client_description',
            'logoURI' : 'logo_uri',
            'isUsing' : 'is_using',
            'isDisplay' : 'is_display'
        }
    },
    classes : {
        'User' : '/example/sso/classes/User.js',
        'OAuth2Code' : '/example/sso/classes/OAuth2Code.js',
        'OAuth2Token' : '/example/sso/classes/OAuth2Token.js',
        'OAuth2User' : '/example/sso/classes/OAuth2User.js',
        'OAuth2Service' : '/example/sso/classes/OAuth2Service.js',
        'OAuth2Client' : '/example/sso/classes/OAuth2Client.js',
        'OAuth2ClientService' : '/example/sso/classes/OAuth2ClientService.js',
        'OAuth2CodeService' : '/example/sso/classes/OAuth2CodeService.js',
        'OAuth2TokenService' : '/example/sso/classes/OAuth2TokenService.js',
        'OAuth2UserService' : '/example/sso/classes/OAuth2UserService.js',
        'Authorize' : '/example/sso/classes/Authorize.js',
        'Token' : '/example/sso/classes/Token.js',
        'Resource' : '/example/sso/classes/Resource.js',
        'Show' : '/example/sso/classes/Show.js',
        'ShowService' : '/example/sso/classes/ShowService.js'
    },
    template_path: '/example/sso/template',
    auth_code_lifetime : 60,
    access_token_lifetime : 1800,
    refresh_token_lifetime : 86400,
    use_refresh_token : false
};

//module exports
module.exports = sso;
