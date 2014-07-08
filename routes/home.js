var mongoose = require('mongoose');
var dbHelper = require('../tools/dbHelper');
var Record = require('../model/record');
var recordAction = require('../action/record');



/**
 * 处理 / 请求
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
module.exports.v1 = {};
module.exports.v1.index = function(req, res) {
    var auth = req.headers['authorization']; 
    if (auth) {

        var tmp = auth.split(' ');   
        var buf = new Buffer(tmp[1], 'base64');  
        var plain_auth = buf.toString();        
        var creds = plain_auth.split(':');       
        var username = creds[0]; 
        var password = creds[1]; 

        if((username == 'gis') && (password == 'pwd')) {    
            recordAction.list().then(function (data) {
                res.render('home/index1', data);
            });
        } else { 
            res.statusCode = 401; 
            res.setHeader('WWW-Authenticate', 'Basic realm="auth-server"'); 
            res.end('<html><body>Need your passport...</body></html>');  
        } 

    }
    else {
        res.statusCode = 401; 
        res.setHeader('WWW-Authenticate', 'Basic realm="auth-server"'); 
        res.end('<html><body>Need your passport...</body></html>'); 
    }
};

/**
 * 处理 / 请求
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
module.exports.index = function(req, res) {
    var auth = req.headers['authorization']; 
    if (auth) {

        var tmp = auth.split(' ');   
        var buf = new Buffer(tmp[1], 'base64');  
        var plain_auth = buf.toString();        
        var creds = plain_auth.split(':');       
        var username = creds[0]; 
        var password = creds[1]; 

        if((username == 'gis') && (password == 'pwd')) {    
            recordAction.list().then(function (data) {
                res.render('home/index', data);
            });
        } else { 
            res.statusCode = 401; 
            res.setHeader('WWW-Authenticate', 'Basic realm="auth-server"'); 
            res.end('<html><body>Need your passport...</body></html>');  
        } 

    }
    else {
        res.statusCode = 401; 
        res.setHeader('WWW-Authenticate', 'Basic realm="auth-server"'); 
        res.end('<html><body>Need your passport...</body></html>'); 
    }
};

/**
 * 处理 /index.tmpl 请求
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
module.exports.tmpl = function(req, res) {
    res.render('home/main');
};

module.exports.editRecord = function(req, res) {
    res.render('home/editRecord');
};