var fs = require('fs');
var _ = require('underscore');
var CONF = [
    {
        src: 'home/result',
        dest: 'home/tpl/result'
    }
];

_.each(CONF, function (item) {
    var data = fs.readFileSync('./views/' + item['src'] + '.ejs');
    
    fs.writeFileSync(
        './views/' + item['dest'] + '.ejs',
        data.toString().replace(/<%/g, '{%').replace(/%>/g, '%}')
    );
});