var when = require('when');
var _ = require('underscore');
var clone = require('clone');
var dbHelper = require('../tools/dbHelper');
var User = require('../model/user');
var Record = require('../model/record');
var EventProxy = require('eventproxy');
var record = {};


/**
 * 记录保存
 * 
 * @param  {string} outerId   outerman id
 * @param  {string} time      time
 * @param  {string} money     money
 * @param  {Array}  customers 消费者数组
 * @param  {string} comment   备注
 * @return {Promise}          Promise
 */
record.save = function (outerId, time, money, customers, comment) {
    var promise = when.defer();

    var recordModel = new Record({
        outerId: outerId,
        time: time,
        money: money,
        customers: customers,
        comment: comment
    });

    dbHelper.open().then(function () {

        recordModel.save(function (err, recordInfo) {
            
            if (err) {
                return console.error(err);
            }

            promise.resolve(recordInfo);
        });

    });

    return promise.promise;
};


/**
 * 列出全部记录
 * 
 * @return {Promise}  Promise
 */
record.list = function () {
    var promise = when.defer();

    dbHelper.open().then(function () {

        // 事件代理
        var ep = EventProxy.create(
            'records', 'users', 
            function (records, users) {

                // 支出
                var expents = clone(users);

                // 收入
                var incomes = clone(users)

                _.each(expents, function (user) {
                    user.summary = 0;
                });

                _.each(incomes, function (user) {
                    user.summary = 0;
                });

                _.each(records, function (record) {
                    var customers = clone(users);
                    var consumerNum = record.customers.length;
                    var money = record.money;
                    var avgPrice = money / consumerNum;

                    record.outerMan = _.find(users, function (user) {
                        return user._id + '' == record.outerId + '';
                    });

                    _.each(record.customers, function (customerId) {

                        _.each(customers, function (customer) {
                            if (customer._id + '' == customerId) {

                                customer['consume'] = true;

                                // 计算消费
                                var user = _.findWhere(expents, {_id: customerId});
                                user.summary = user.summary + avgPrice;
                            }
                        });
                    });

                    var user = _.findWhere(incomes, {_id: record.outerMan._id});
                    if (user) {
                        user.summary = user.summary - money;
                    }

                    record.customers = customers;
                });

                // 支出 + 收入汇总
                var summarys = incomes;
                for (var i = 0; i < incomes.length; i++) {
                    summarys[i].summary += expents[i].summary;
                    summarys[i].summary.toFixed(2);
                };

                promise.resolve({
                    records: records,
                    summarys: summarys,
                    users: users
                });
            }
        );

        // 查询所有records
        Record.find({}, function (err, records) {

            if (err) {
                return console.error(err);
            }

            records = _.each(records, function (item, index) {
                records[index] = item.toJSON();
                records[index]._id = records[index]._id + '';
            });

            ep.emit('records', records);
        });

        // 查询所有用户
        User.find({}, function (err, users) {

            if (err) {
                return console.error(err);
            }

            users = _.each(users, function (item, index) {
                users[index] = item.toJSON();
                users[index]._id = users[index]._id + '';
            });
           
            ep.emit('users', users);
        });
    });

    return promise.promise;
};

/**
 * 删除对应记录
 * 
 * @param  {number}   id id
 * @return {Promise}     Promise
 */
record.remove = function (id) {
    var promise = when.defer();

    dbHelper.open().then(function () {

        Record.remove({_id: id}, function (err) {
            if (err) {
                return console.error(err);
            }

            promise.resolve();
        });
    });

    return promise.promise;
};

module.exports = record;