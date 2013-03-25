var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function CContentMapping() {
    var pros = {
        'id' : '',
        'name' : '',
        'description' : '',
        'type' : '',
        'fileName' : ''
    };
    TBean.call(this,pros);
};

util.inherits(CContentMapping, TBean);

//module exports
module.exports = CContentMapping;
