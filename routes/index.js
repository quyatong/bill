var mongoose = require('mongoose');
var dbHelper = require('../tools/dbHelper');
var Record = require('../model/record');

/**
 * 处理 / 请求
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
module.exports = function(req, res) {
	dbHelper.open().then(function () {
		var record = new Record();
		Record.find({}, function (err, records) {
			if (err) {
				return console.error(err);
			}
	  	res.render('index', {records: records.toString()});
		});
	});
}; 