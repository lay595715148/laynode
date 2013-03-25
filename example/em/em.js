var em = {
    prefix : 'EventsMaster',
    display_error : true,
    actions : {
        'init.php' : {
        }
    },
    mapping : {
        "tables" : {
            "CChart" : "emcon_charts",
            "CConfig" : "emcon_config",
            "CContentMapping" : "emcon_contentmapping",
            "CCustomizeField" : "emcon_customize_fields",
            "CFacility" : "emcon_facilities",
            "CField" : "emcon_fields",
            "CFieldSetting" : "emcon_fields_setting",
            "CGroupMember" : "emcon_groupmembers",
            "CGroup" : "emcon_groups",
            "CReport" : "emcon_reports",
            "CSearch" : "emcon_searches",
            "CShibbolethUser" : "emcon_shibbolethusers",
            "CSource" : "emcon_sources",
            "CUser" : "emcon_users",
            "CView" : "emcon_views",
            "CTab" : "emcon_tabs",
            "CPortlet" : "emcon_portlets",
            "Task" : "evtmast_task"
        },
        "CChart" : {
            "id" : "ID",
            "displayName" : "DisplayName",
            "chartEnabled" : "chart_enabled",
            "chartType" : "chart_type",
            "lineType" : "LineType",
            "chartWidth" : "chart_width",
            "chartHeight" : "chart_height",
            "chartField"  : "chart_field",
            "addressType" : "address_type",
            "maxrecords" : "maxrecords",
            "sortType" : "sortType",
            "showpercent" : "showpercent",
            "userid" : "userid",
            "groupid" : "groupid",
            "viewid" : "viewid"
        },
        "CConfig" : {
            "propname" : "propname",
            "propvalue" : "propvalue",
            "propvalueText" : "propvalue_text",
            "isGlobal" : "is_global",
            "userid" : "userid",
            "groupid" : "groupid"
        },
        "CContentMapping" : {
            "id" : "ID",
            "name" : "Name",
            "description" : "Description",
            "type" : "Type",
            "fileName" : "FileName"
        },
        "CCustomizeField" : {
            "customizeFieldID" : "CustomizeFieldID",
            "fieldID" : "FieldID",
            "contentMappingID" : "ContentMappingID",
            "searchFlag" : "SearchFlag"
        },
        "CFacility" : {
            "id" : "ID",
            "sourceid" : "sourceid",
            "sourcename" : "sourcename",
            "facilityhost" : "facilityhost",
            "description" : "description"
        },
        "CField" : {
            "fieldID" : "FieldID",
            "fieldCaption" : "FieldCaption",
            "fieldType" : "FieldType",
            "searchFlag" : "searchFlag"
        },
        "CFieldSetting" : {
            "viewID" : "ViewID",
            "viewType" : "ViewType",
            "fieldID" : "FieldID",
            "fieldCaption" : "FieldCaption",
            "fieldType" : "FieldType",
            "defaultWidth" : "DefaultWidth",
            "fieldAlign" : "FieldAlign"
        },
        "CGroupMember" : {
            "userid" : "userid",
            "groupid" : "groupid",
            "isMember" : "is_member"
        },
        "CGroup" : {
            "id" : "ID",
            "groupName" : "groupname",
            "groupDescription" : "groupdescription",
            "groupType" : "grouptype"
        },
        "CReport" : {
            "id" : "ID",
            "name" : "name",
            "reportEnabled" : "report_enabled",
            "viewid" : "viewid",
            "reportType" : "report_type",
            "addressType" : "address_type",
            "chartType" : "chart_type",
            "reportField" : "report_field",
            "countField" : "count_field",
            "userid" : "userid",
            "groupid" : "groupid"
        },
        "CSearch" : {
            "id" : "ID",
            "displayName" : "DisplayName",
            "searchQuery" : "SearchQuery",
            "userid" : "userid",
            "groupid" : "groupid"
        },
        "CShibbolethUser" : {
            "id" : "id",
            "uid" : "uid",
            "username" : "username",
            "isAdmin" : "is_admin",
            "isCommonuser" : "is_commonuser",
            "isReadonly" : "is_readonly",
            "facilityHost" : "facilityhost",
            "lastLogin" : "last_login",
            "domain" : "domain",
            "email" : "email",
            "typeof" : "typeof",
            "isVerify" : "is_verify"
        },
        "CSource" : {
            "id" : "ID",
            "name" : "Name",
            "description" : "Description",
            "dbTableName" : "DBTableName",
            "fields" : "Fields",
            "gatherFields" : "GatherFields",
            "dbEnableRowCounting" : "DBEnableRowCounting",
            "dbRecordsPerQuery" : "DBRecordsPerQuery",
            "userid" : "userid",
            "groupid" : "groupid",
            "maintainTime" : "MaintainTime",
            "maintainNumber" : "MaintainNumber"
        },
        "CUser" : {
            "id" : "ID",
            "authtype" : "authtype",
            "authid" : "authid",
            "username" : "username",
            "password" : "password",
            "isAdmin" : "is_admin",
            "isCommonuser" : "is_commonuser",
            "facilityHost" : "facilityhost",
            "email" : "email",
            "mobilePhone" : "mobilephone",
            "isReadonly" : "is_readonly",
            "lastLogin" : "last_login"
        },  
        "CView" : {
            "id" : "ID",
            "displayName" : "DisplayName",
            "columns" : "Columns",
            "childColumns" : "childColumns",
            "realtimeColumns" : "realtimeColumns",
            "gatherColumns" : "GatherColumns",
            "driver" : "driver",
            "facilitySources" : "FacilitySources",
            "tabkeys" : "tabkeys",
            "portlets" : "portlets",
            "userid" : "userid",
            "groupid" : "groupid"
        },
        "CTab" : {
            "tabid" : "tabid",
            "key" : "tabkey",
            "text" : "text"
        },
        "CPortlet" : {
            "pid" : "pid",
            "userid" : "userid",
            "tabkey" : "tabkey",
            "chartid" : "chartid",
            "reportid" : "reportid",
            "height" : "height",
            "width" : "width",
            "columnType" : "columnType",
            "infomation" : "infomation"
        },
        "Topic" : {
            "name" : "Topic",
            "data" : "TotalCount"
        },
        "Task" : {
            "userid" : "userid",
            "name" : "name",
            "timereported" : "timereported"
        }
    },
    classes : {

        "InitGenerator"    : "./classes/InitGenerator.js",
        "InitService"      : "./classes/InitService.js",
        "CFGGenerator"     : "./classes/CFGGenerator.js",
        "MenuGenerator"    : "./classes/MenuGenerator.js",
        "LoginGenerator"   : "./classes/LoginGenerator.js",
        "RealtimeGenerator": "./classes/RealtimeGenerator.js",
        "EventsGenerator"  : "./classes/EventsGenerator.js",
        "ChartGenerator"   : "./classes/ChartGenerator.js",
        "ReportGenerator"  : "./classes/ReportGenerator.js",
        "DiagramGenerator" : "./classes/DiagramGenerator.js",
        "ScanGenerator"    : "./classes/ScanGenerator.js",
        "PortletGenerator" : "./classes/PortletGenerator.js",
        "SysviewGenerator" : "./classes/SysviewGenerator.js",
        "SnapshotGenerator": "./classes/SnapshotGenerator.js",
        "CUserAction"      : "./classes/CUserAction.js",
        "PortletService"   : "./classes/PortletService.js",
        "DataService"      : "./classes/DataService.js",
        "ChartService"     : "./classes/ChartService.js",
        "DiagramService"   : "./classes/DiagramService.js",
        "ReportService"    : "./classes/ReportService.js",
        "ScanService"      : "./classes/ScanService.js",

        "SecurityGenerator": "./classes/SecurityGenerator.js",
        "ImageGenerator"   : "./classes/ImageGenerator.js",
        "Translation"      : "./classes/util/Translation.js",

        "ViewForm"         : "./classes/form-bean/ViewForm.js",
        "ReportForm"       : "./classes/form-bean/ReportForm.js",
        "ChartForm"        : "./classes/form-bean/ChartForm.js",

        "CChart"           : "./classes/conf-bean/CChart.js",
        "CConfig"          : "./classes/conf-bean/CConfig.js",
        "CContentMapping"  : "./classes/conf-bean/CContentMapping.js",
        "CCustomizeField"  : "./classes/conf-bean/CCustomizeField.js",
        "CFacility"        : "./classes/conf-bean/CFacility.js",
        "CField"           : "./classes/conf-bean/CField.js",
        "CFieldSetting"    : "./classes/conf-bean/CFieldSetting.js",
        "CGroupMember"     : "./classes/conf-bean/CGroupMember.js",
        "CGroup"           : "./classes/conf-bean/CGroup.js",
        "CReport"          : "./classes/conf-bean/CReport.js",
        "CSearch"          : "./classes/conf-bean/CSearch.js",
        "CShibbolethUser"  : "./classes/conf-bean/CShibbolethUser.js",
        "CSource"          : "./classes/conf-bean/CSource.js",
        "CUser"            : "./classes/conf-bean/CUser.js",
        "CView"            : "./classes/conf-bean/CView.js",

        "CTab"             : "./classes/conf-bean/CTab.js",
        "CPortlet"         : "./classes/conf-bean/CPortlet.js",

        "Topic"            : "./classes/data-bean/Topic.js",
        "Task"             : "./classes/data-bean/Task.js",
        "DyncBean"         : "./classes/data-bean/DyncBean.js"
    }
};

//module exports
module.exports = em;
