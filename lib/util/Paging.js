var util  = require('util');
var Util  = require('../util/Util.js');
var Bean  = require('../core/Bean.js');
var Scope = require('../util/Scope.js');

function Paging() {
    var pros = {
        'page' : 0,//当前页码,默认为1,第1页即为1,尾页为-1
        'pageSize' : 0,//一页内记录数,默认为20,不分页为-1
        'pageCount' : 0,//页数
        'count' : 0,//总记录数
        'text' : '',//总记录数
        'href' : 0//指向页
    };
    Bean.call(this,pros);
};

util.inherits(Paging, Bean);

Paging.prototype.build = function(scope) {
    var _scope = ('undefined' == typeof scope)?Bean.SCOPE:scope;
    var scopeObject = Scope.parse(_scope);
    if('object' == typeof this.properties) {
        for(var pro in this.properties) {
            var set = 'set' + pro.substr(0,1).toUpperCase() + pro.substr(1);
            var val = scopeObject[pro];
            if(pro == 'text') {
                this[set].call(this,(val)?val + '':'');
            } else {
                this[set].call(this,(val)?parseInt(val,10):0);
            }
        }
    }
};
/**
 * 运算分页
 */
Paging.prototype.carry = function() {
    var page      = this.getPage.call(this);
    var pageSize  = this.getPageSize.call(this);
    var pageCount = this.getPageCount.call(this);
    var count     = this.getCount.call(this);
    if(page == 0) { page = 1; }
    if(pageSize == 0) { pageSize = 10; }
    if(pageSize > 0) {
        pageCount = Math.floor((count + pageSize - 1)/pageSize);
    }
    if(page == -1 || page > pageCount) {
        page = pageCount;
    }

    this.setPage.call(this,page);
    this.setPageSize.call(this,pageSize);
    this.setPageCount.call(this,pageCount);
    this.setCount.call(this,count);
};
Paging.prototype.toPaging = function() {
    if(this.getPageSize.call(this) == -1) return;
    var pages = this.toPages.call(this);
    var page  = this.toArray.call(this);
    return {'page':page,'pages':pages};
};
Paging.prototype.toPages = function(count,display) {
        if('undefined' == typeof count || 'number' != typeof count) { count = 5; }
        if('undefined' == typeof display || 'boolean' != typeof display) { display = false; }
        this.carry.call(this);
        var page      = this.getPage.call(this);
        var pageCount = this.getPageCount.call(this);
        var paging    = this.toArray.call(this);
        var morePre   = true;
        var moreNext  = true;
        var pages     = [];
        var diff      = 0;
        if(page - count <= 1) {
            diff      = (display)?0:1;
        } else if(page - count > 1){
            diff      = page - count - 2;
        }

        paging.href = page + '';
        paging.text = page + '';
        pages[page-diff] = paging;
        for(var i = count;i > 0;i--) {
            var pre  = page - i;
            var next = page + i;
            if(pre > 0) {
                var clone = Util.clone(paging);
                clone.page = pre;
                clone.href = pre + '';
                clone.text = pre + '';
                pages[pre-diff] = clone;
                if(pre == 1) { morePre = false; }
            } else {
                morePre = false;
            }
            if(next <= pageCount) {
                var clone = Util.clone(paging);
                clone.page  = next;
                clone.href  = next + '';
                clone.text  = next + '';
                pages[next-diff] = clone;
                if(next == pageCount) { moreNext = false; }
            } else {
                moreNext = false;
            }
        }
        if(morePre) {
            var clone = Util.clone(paging);
            var morep = page - count - count;
            morep      = (morep > 0)?morep:1;
            clone.page = morep;
            clone.href = morep + '';
            clone.text = '...';
            pages[1] = clone;

            var clone = Util.clone(paging);
            clone.page = 1;
            clone.href = '1';
            clone.text = '首页';
            pages[0] = clone;
        } else if(display) {
            var clone = Util.clone(paging);
            clone.page = 1;
            clone.href = '1';
            clone.text = '首页';
            pages[0] = clone;
        }

        if(moreNext) {
            var clone = Util.clone(paging);
            var moren = page + count + count;
            moren     = (moren > pageCount)?pageCount:moren;
            clone.page = moren;
            clone.href = moren + '';
            clone.text = '...';
            pages.push(clone);

            var clone = Util.clone(paging);
            clone.page = pageCount;
            clone.href = pageCount + '';
            clone.text = '尾页';
            pages.push(clone);
        } else if(display) {
            var clone = Util.clone(paging);
            clone.page = pageCount;
            clone.href = pageCount + '';
            clone.text = '尾页';
            pages.push(clone);
        }
        return pages;
};
/**
 * 转换为 SQL LIMIT 部分
 */
Paging.prototype.toLimit = function() {
    var pageSize = this.getPageSize.call(this);
    var limit    = '';
    if(pageSize && pageSize > 0) {
        this.carry.call(this);
        var page      = this.getPage.call(this);
        var pageCount = this.getPageCount.call(this);
        var count     = this.getCount.call(this);
        if(page && page == 1) 
            limit = 'LIMIT ' + parseInt(page*pageSize,10);
        else if(page && page > 1)
            limit = 'LIMIT ' + parseInt((page-1)*pageSize,10) + ',' + pageSize;
        else if(page && page == -1)
            limit = 'LIMIT ' + parseInt((pageCount-1)*pageSize,10) + ',' + pageSize;
    }
    return limit;
}

//module exports
module.exports = Paging;
