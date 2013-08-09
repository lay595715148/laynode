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
		"Action":"/laynode/core/Action.js",
		"Base":"/laynode/core/Base.js",
		"Bean":"/laynode/core/Bean.js",
		"Service":"/laynode/core/Service.js",
		"Store":"/laynode/core/Store.js",
		"TBean":"/laynode/core/TBean.js",
		"Eventer":"/laynode/core/Eventer.js",
		"Template":"/laynode/core/Template.js",
        "Ldap":"/laynode/store/Ldap.js",
        "Mysql":"/laynode/store/Mysql.js",
        "MongoDB":"/laynode/store/MongoDB.js",
        "Cell":"/laynode/util/Cell.js",
        "Condition":"/laynode/util/Condition.js",
        "Paging":"/laynode/util/Paging.js",
        "Scope":"/laynode/util/Scope.js",
        "Sort":"/laynode/util/Sort.js",
        "Search":"/laynode/util/Search.js",
        "Timer":"/laynode/util/Timer.js",
        "Util":"/laynode/util/Util.js",
        "DefaultService":"/laynode/service/DefaultService.js"
    },
    template_path: '/template'
};

// Module exports;
module.exports = config;
