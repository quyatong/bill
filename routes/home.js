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
module.exports.index = function(req, res) {

    res.render('home');
    // recordAction.list().then(function (data) {
            
    //     }
    // );
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