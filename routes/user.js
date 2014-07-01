var userAction = require('../action/user');
var ejson = require('../tools/ejson');
var _ = require('underscore');

var user = {};

/**
 * 成功后回调
 * 
 * @param  {Object} res      response
 * @param  {Object} userInfo 用户信息
 */
var success = function (res, userInfo) {
    res.send(ejson.format({
        data: {
            userInfo: userInfo
        }
    }));
};

/**
 * 添加账户
 * 
 * @param {object} 请求
 * @param {object} 回应
 */
user.add = function (req, res) {

	var name = req.params.name;
    
    userAction
    .findName(new RegExp(name, 'i'))
    .then(function (userInfo) {

        userInfo = _.each(userInfo, function (item) {return item.toJSON();});
        
        // 已有账户
        if (userInfo.length) {
            var names = _.pluck(userInfo, 'name');

            var maxName = _.max(names, function (item) {
                var segs = item.split('_');
                return parseInt(segs[1] ? segs[1] : 0, 10);
            });
            var segs = maxName.split('_');
            var num = segs[1] ? maxName.split('_')[1] : 0;

            name = segs[0] + '_' + (num - 0 + 1);
        }

        userAction.save(name).then(function (userInfo) {
            success(res, userInfo);
        });
    });
};


/**
 * delete user
 * @param  {Object} req request
 * @param  {Object} res response
 */
user.remove = function (req, res) {
    var id = req.params.id;

    userAction.removeById(id).then(function (userInfo) {
        success(res, userInfo);
    });
};


/**
 * 列出所有的user
 * 
 * @param  {Object} req request
 * @param  {Object} res response
 */
user.list = function (req, res) {
    userAction.findName(/.*/g).then(
        function () {
            success(res, userInfo);
        }, 
        function () {
            success(res, userInfo);
        }
    );
};


user.edit = function (req, res) {
    var id = req.params.id;
    var name = req.params.name;

    userAction.update(id, name).then(function (userInfo) {
        success(res, userInfo);
    }); 
};


module.exports = user;