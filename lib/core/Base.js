
function Base() {
    if(typeof(Base.prototype.instances) == 'number') Base.prototype.instances++
    this._classname = this.constructor.toString().match(/function\s+([^\s\(]+)/)[1];
}

Base.prototype._classname = '';

module.exports = Base;
