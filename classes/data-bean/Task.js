var util  = require('util');
var TBean = require('../../laynode/core/TBean.js');

function Task() {
    var pros = {
        'userid' : 0,
        'name' : '',
        'timereported' : ''
    };
    TBean.call(this,pros);
};

util.inherits(Task, TBean);

//module exports
module.exports = Task;
