var ejson = require('../tools/ejson');
var _ = require('underscore');
var EventProxy = require('eventproxy');
var recordAction = require('../action/record');
var userAction = require('../action/user');
var record = {};

/**
 * 添加
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
record.add = function (req, res) {

    var params = req.query;

    // 出钱人 
    var outerId = params.outerId;

    // 出钱数
    var money = params.money;

    // 时间
    var time = params.time;

    // 消费者
    var customers = JSON.parse(params.customers);

    // 事由
    var comment = params.comment;

    recordAction.save(outerId, time, money, customers, comment).then(
        function (recordInfo) {
            res.send(ejson.format({
                data: recordInfo
            })); 
        }
    );
};

/**
 * 列出全部
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
record.list = function (req, res) {
    recordAction.list().then(function (data) {
        res.send(ejson.format({
            data: data
        })); 
    });
};

/**
 * 删除
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
record.remove = function (req, res) {
    var id = req.params.id;

    recordAction.remove(id).then(function () {
        res.send(ejson.format()); 
    });
};

/**
 * 页面展现
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
record.index = function (req, res) {

    recordAction.list().then(function (data) {
            res.render('index', data);
        }
    );
};

module.exports = record;