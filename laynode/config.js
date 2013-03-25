var config = {
    configs : {
        "sso":"../example/sso/sso.js",
        "em":"../example/em/em.js"
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
            "user":"root",
            "password":"dcuxpasswd",
            "database":"emconfigdb",
            "encoding":"UTF8",
            "show-sql":true
        },
        "mysql-conf" : {
            "auto-connect":true,
            "classname":"Mysql",
            "host":"localhost",
            "port":3306,
            "user":"root",
            "password":"dcuxpasswd",
            "database":"emconfigdb",
            "encoding":"UTF8",
            "show-sql":true
        },
        "mysql-data" : {
            "auto-connect":true,
            "classname":"Mysql",
            "host":"localhost",
            "port":3306,
            "user":"root",
            "password":"dcuxpasswd",
            "database":"emdatadb",
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
        "Paging":"./laynode/util/Paging.js",
        "Search":"./laynode/util/Search.js",
        "Mysql":"./laynode/store/Mysql.js",
        "MongoDB":"./laynode/store/MongoDB.js",
        "Util":"./laynode/util/Util.js",
        "DefaultService":"./laynode/service/DefaultService.js"
    },

    //clazzes ---------------------------------------------------- clazzes
    clazzes : {
    }
};

// Module exports;
module.exports = config;
