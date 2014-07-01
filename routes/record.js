var ejson = require('../tools/ejson');
var recordAction = require('../action/record');
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
    var customers = params.customers;

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
record.index = function (req, res) {
    recordAction.list().then(function (records) {
        res.send(ejson.format({
            data: {
                records: records
            }
        })); 
    });
};

module.exports = record;