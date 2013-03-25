var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function Topic() {
    var pros = {
        'name' : '',
        'data' : 0
    };
    TBean.call(this,pros);
};

util.inherits(Topic, TBean);

//module exports
module.exports = Topic;
