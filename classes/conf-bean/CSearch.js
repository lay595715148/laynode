var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CSearch() {
    var pros = {
        'id' : 0,
        'displayName' : '',
        'searchQuery' : '',
        'userid' : 0,
        'groupid' : 0
    };
    TBean.call(this,pros);
};

util.inherits(CSearch, TBean);

//module exports
module.exports = CSearch;
