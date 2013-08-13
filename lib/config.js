var basepath = global._laynode_basepath;
var rootpath = global._laynode_rootpath;
var config = {
    configs : {
    },
    actions:{
        "initGenerator.php" : {
            "classname":"InitGenerator",
            "auto-dispatch":true,
            "beans":["cchart","viewForm"],
            "services":["initService"]
        }
    },
    beans:{
        "cchart" : {
            "auto-build":true,
            "classname": "CChart",
            "scope":1
        },
        "viewForm" : {
            "auto-build" : true,
            "classname" : "ViewForm"
        }
    },
    services:{
        "initService" : {
            "auto-init":true,
            "classname":"InitService",
            "store":"mysql-conf"
        },
        "defaultService" : {
            "auto-init":true,
            "classname":"DefaultService",
            "store":"mysql"
        }
    },
    stores:{
        "mysql" : {
            "auto-connect":true,
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

    //mapping ---------------------------------------------------- mapping
    mapping:{
        "tables" : {
        }
    },

    //classes ---------------------------------------------------- classes
    classes : {
        "Action":"/lib/core/Action.js",
        "Base":"/lib/core/Base.js",
        "Bean":"/lib/core/Bean.js",
        "Service":"/lib/core/Service.js",
        "Store":"/lib/core/Store.js",
        "TBean":"/lib/core/TBean.js",
        "Eventer":"/lib/core/Eventer.js",
        "Template":"/lib/core/Template.js",
        "Ldap":"/lib/store/Ldap.js",
        "Mysql":"/lib/store/Mysql.js",
        "MongoDB":"/lib/store/MongoDB.js",
        "Cell":"/lib/util/Cell.js",
        "Condition":"/lib/util/Condition.js",
        "Paging":"/lib/util/Paging.js",
        "Scope":"/lib/util/Scope.js",
        "Sort":"/lib/util/Sort.js",
        "Search":"/lib/util/Search.js",
        "Timer":"/lib/util/Timer.js",
        "Util":"/lib/util/Util.js",
        "DefaultService":"/lib/service/DefaultService.js"
    },
    template_path: '/template'
};

// Module exports;
module.exports = config;
