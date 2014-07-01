var mongoose = require('mongoose');
var dbHelper = require('../tools/dbHelper');
var User = require('../model/user');
var ejson = require('../tools/ejson');
var User = require('../model/user');
var when = require('when');
var _ = require('underscore');

/*
 * GET users listing.
 */
var User = require('../model/user');
var user = {};

/**
 * 查询用户信息   
 * 
 * @param  {string}    name    user name
 * @return {Promise}           promise
 */
user.findName = function (name) {
    var promise = when.defer();

    dbHelper.open().then(function () {

        User.find({name: name}, function (err, userInfo) {

            if (err) {
                return console.error(err);
            }
            promise.resolve(userInfo);
        });
    });

    return promise.promise;
};


/**
 * 查询用户信息   
 * 
 * @param  {string}    name    user name
 * @return {Promise}           promise
 */
user.findById = function (id) {
    var promise = when.defer();

    dbHelper.open().then(function () {

        User.find({_id: id}, function (err, userInfo) {

            if (err) {
                return console.error(err);
            }

            promise.resolve(userInfo);
        });
    });

    return promise.promise;
};

/**
 * 保存用户信息
 * 
 * @param  {string}    name    user name
 * @return {Promise}           promise
 */

user.save = function (name) {
    var promise = when.defer();
    var userModel = new User({name: name});

    dbHelper.open().then(function () {

        userModel.save(function (err, userInfo) {

            if (err) {
                return console.error(err);
            }

            promise.resolve(userInfo);
        });
    });

    return promise.promise;
}

/**
 * 删除指定id的user
 * @param  {number}    id       user id
 * @return {Promise}            promise
 */
user.removeById = function (id) {
    var promise = when.defer();
    var userModel = new User({_id: id});

    userModel.remove(function (err, userInfo) {

        if (err) {
            return console.error(err);
        }

        promise.resolve(userInfo);
    });

    return promise.promise;
}


/**
 * 修改user信息
 * 
 * @return {number} id
 */
user.update = function (id, name) {
    var promise = when.defer();

    User.update(
        {_id: id},
        {name: name},
        function (err) {
            
            if (err) {
                return console.error(err);
            }

            user.findById(id).then(function (userInfo) {
                promise.resolve(userInfo);
            });
        }
    );

    return promise.promise;
}

module.exports = user;