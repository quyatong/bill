var when = require('when');
var _ = require('underscore');
var dbHelper = require('../tools/dbHelper');
var User = require('../model/user');
var Record = require('../model/record')
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

        var ep = EventProxy.create('records', 'users', function (records, users) {

            _.each(records, function (record) {

                record.outerMan = _.findWhere(users, {_id: record.outerId});
                record.customerNames = [];

                _.each(record.customers, function (id) {
                    record.customerNames.push(
                        _.findWhere(users, {_id: id})
                    );
                });
            });

            promise.resolve(records);
        });

        Record.find({}, function (err, records) {

            if (err) {
                return console.error(err);
            }

            records = _.each(records, function (item) {return item.toJSON();});

            ep.emit('records', records);
        });


        User.find({}, function (err, users) {

            if (err) {
                return console.error(err);
            }

            users = _.each(users, function (item) {return item.toJSON();});
           
            ep.emit('users', users);
        });
    });

    return promise.promise;
};

module.exports = record;