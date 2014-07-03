/**
 * @file ejson格式ajax模块
 * @author leon <lupengyu@baidu.com>
 */
define(function (require) {
  
    var $ = require('jquery');

    /**
     * 通用错误处理器的缓存池
     * 
     * @type {Object}
     */
    var handlers = {};

    /**
     * 发送ejson请求
     * 
     * @param {Object} options jQuery.ajax的参数们
     * @param {boolean} catchedErrorBubble 是否将已经被通用错误处理器处理过的错误返回给调用者
     * @return {Promise}
     */
    function request(options, catchedErrorBubble) {

        var defer = $.Deferred();
        var ajax = $.ajax(options).then(function (res) {

            try {
                if ($.type(res) === 'string') {
                    res = $.parseJSON(res);
                }
            } catch (e) {
                defer.reject({
                    status: 1000
                });
                return;
            }

            if (res.status === 0) {
                defer.resolve(res.data);
                return;
            }

            var handlersQueue = handlers[res.status];

            // 没有通用错误处理器，直接将错误数据返回给调用者
            if (!handlersQueue || !handlersQueue.length ) {
                defer.reject(res);
                return;
            }

            // 调用通用错误处理器
            $.each(handlersQueue, function (i, handler) {
                handler(res);
            });

            // 一般情况，通用处理器处理过的错误不需要再额外处理了
            // 但有特殊情况仍然需要更多的处理，那么可以将catchedErrorBubble设为true
            // 这样我们会将错误信息返回给调用者
            if (!catchedErrorBubble) {
                return;
            }

            // 设定通用处理器处理完成的标识
            res.catched = true;
            defer.reject(res);

        }, function (error) {
            defer.reject({
                status: 1002,
                statusInfo: error
            });
        }).always(function () {
            ajax = null;
        });

        var promise = defer.promise();

        promise.abort = function () {
            ajax && ajax.abort();
            defer.reject({
                status: 1001
            });
        };

        return promise;

    }

    var exports = {

        /**
         * 发送GET方式的ejson请求
         * 
         * @public
         * @param {string} url 请求地址
         * @param {object} options 请求参数
         * @param {boolean} catchedErrorBubble 是否将已经被通用错误处理器处理过的错误返回给调用者
         * @return {Promise}
         */
        get: function (url, options, catchedErrorBubble) {

            options = $.extend(
                {}, 
                options, 
                {
                    url: url,
                    type: 'GET'
                }
            );

            return request(options, catchedErrorBubble);
        },

        /**
         * 发送POST方式的ejson请求
         * 
         * @public
         * @param {string} url 请求地址
         * @param {object} options 请求参数
         * @param {boolean} catchedErrorBubble 是否将已经被通用错误处理器处理过的错误返回给调用者
         * @return {Promise}
         */
        post: function (url, options, catchedErrorBubble) {
            options = $.extend(
                {}, 
                options, 
                {
                    url: url,
                    type: 'POST'
                }
            );

            return request(options, catchedErrorBubble);
        },

        /**
         * 添加一个通用错误处理器
         * 
         * @public
         * @param {number} status 错误码
         * @param {function} handler 处理器
         */
        addErrorHandler: function (status, handler) {

            var handlerQueue = handlers[status];

            if (!handlerQueue) {
                handlerQueue = handlers[status] = [];
            }

            handlerQueue.push(handler);

        }

    };

    return exports;

});