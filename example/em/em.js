var em = {
    namespace : 'laynode',
    display_error : true,
    actions : {
        'init' : {
            'classname' : 'LaynodeAction',
            'services' : ['laynode']
        }
    },
    services : {
        'laynode' : {
            'classname' : 'LaynodeService',
            'store' : 'mongodb-laysoft'
        }
    },
    stores : {
        'mongodb-laysoft' : {
            'auto-connect':false,
            'classname':'MongoDB',
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
        'tables' : {//or collections
            'LUser' : 'lay_users'
        },
        'LUser' : {
            'id' : 'id',
            'username' : 'username',
            'password' : 'password'
        }
    },
    classes : {
        'LUser' : '/example/em/classes/beans/LUser.js',
        'LaynodeAction' : '/example/em/classes/LaynodeAction.js',
        'LaynodeService' : '/example/em/classes/services/LaynodeService.js'
    }
};

//module exports
module.exports = em;
