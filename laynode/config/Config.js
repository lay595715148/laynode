


function Config() {};

Config['auto-dispatch'] = true;
Config['dispatch-key'] = 'key';
Config['dispatch-style'] = 'do*';
Config['auto-build'] = true;//bean auto build
Config['auto-init'] = true;//service auto init
Config['auto-connect'] = true;//store auto connect
Config['scope'] = 0;//bean auto build scope

// Module exports;
module.exports = Config;
