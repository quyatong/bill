define(['ejs', '../common/ejson'], function (ejs, ejson) {
    // 配置ejs开始结束标签
    ejs.open = '{%';
    ejs.close = '%}';
    
    var refreshResult = function () {

        ejson.get('/record/list', {}).then(function (data) {
            $('#result').html(ejs.render($('#result-tpl').html(), data));
        });

    };

    var enter = function () {

        // 添加用户
        $('#btn-add').click(function () {
            $('#btn-add-area').show();
            $('#btn-add').hide();
        });

        // 添加用户-取消
        $('#btn-add-cancel').click(function () {
            $('#btn-add-area').hide();
            $('#btn-add').show();
        });

        // 添加用户-确认
        $('#btn-add-confirm').click(function () {
            var userName = $('#user-name').val();

            ejson.get('/user/add/' + userName).then(function (data) {
                var userInfo = data.userInfo;
                var name = userInfo.name;
                var id = userInfo._id;
                
                $('#outMan')[0].add(new Option(userInfo.name, userInfo._id));
                $(''
                    + '<label value="' + id + '">'
                    + '<input type="checkbox" value="' + id + '" />' 
                    + name 
                    + '<div class="close-btn">x</div>'
                    + '</label>'
                )
                .insertBefore($('#btn-add-area'));

                $('#btn-add-area').hide();
                $('#btn-add').show();

                refreshResult();
            });
        });

        $('.customer-container').click(function (e) {
            var target = e.target;
            if ($(target).hasClass('close-btn')) {
                var id = $(target).parent().attr('value');
                if (confirm('您确定要删除' + $(target).parent().text() + '吗？')) {
                    ejson.get('/user/remove/' + id).then(
                        function (data) {
                            $(target).parent().remove();
                            refreshResult();
                        }
                    );
                }
                e.preventDefault();
                e.stopPropagation();
            }
            
        });

        $('#result').click(function (e) {
            var target = e.target;

            if ($(target).hasClass('record-delete')) {
                var recordId = $(target).attr('value');
                if (confirm('您确定要删除这条记录吗？')) {
                    ejson.get('/record/remove/' + recordId).then(
                        function (data) {
                            $(target).parent().parent().remove();
                            refreshResult();
                        }
                    );
                }

                e.preventDefault();
                e.stopPropagation();
            }
        });
        $('#bill-form').submit(function (e) {

            var outerMan = $('#outMan').val();
            var money = $('#money').val();
            var time = $('#time').val();
            var comment = $('#comment').val();
            var customers = [];

            $('.customer-container label input').each(function (key, item) {

                if (item.checked) {
                    customers.push($(item).attr('value'));
                }

            });

            var params = {
                outerId: outerMan,
                money: money,
                time: time,
                comment: comment,
                customers: JSON.stringify(customers)
            };

            ejson.get('/record/add', {data: params}).then(function (data) {
                refreshResult();
            });

            e.preventDefault();
        });
    }

    return {
        enter: enter
    };
});