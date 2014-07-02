var fs = require('fs');
var _ = require('underscore');
var CONF = [
    'result'
];

_.each(CONF, function (filename) {
    var data = fs.readFileSync('./views/' + filename + '.ejs');
    fs.writeFileSync(
        './views/tpl/' + filename + '.ejs',
        data.toString().replace(/<%/g, '{%').replace(/%>/g, '%}')
    );
});