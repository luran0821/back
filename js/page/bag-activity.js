/**
 * Created by ran on 2016/12/26.
 */
import {path} from '../common/configuration.js';
import {getCookie} from '../common/get-cookie.js';
let token = getCookie("token");
let ajaxurl = path();
let oTable = null;
let status = null;
$(document).ready(function () {
    $('.tab .create').on('click', function () {
        $('.center .manage').hide();
        $('.center .create').show();
        $('.tab li:eq(1)').removeClass('active');
        $('.tab li:eq(0)').addClass('active');
    });
    $('.tab .manage').on('click', function () {
        $('.center .manage').show();
        $('.center .create').hide();
        $('.tab li:eq(0)').removeClass('active');
        $('.tab li:eq(1)').addClass('active');
        $('#addess-url').hide();
    });

/**
 *输入验证
 */
    $('#defaultForm')
        .bootstrapValidator({
            fields: {
                people: {
                    validators: {
                        notEmpty: {
                            message: '人数不能为空'
                        },
                        regexp: {
                            regexp: /^[0-9]*[1-9][0-9]*$/,
                            message: '请输入数字！'
                        }
                    }
                },
                coin: {
                    validators: {
                        notEmpty: {
                            message: '币量不能为空'
                        },
                        regexp: {
                            regexp: /^[0-9]*[1-9][0-9]*$/,
                            message: '请输入数字！'
                        }
                    }
                },
                id: {
                    validators: {
                        notEmpty: {
                            message: 'id不能为空！'
                        },
                        regexp: {
                            regexp: /^[A-Za-z]+$/,
                            message: 'id为字母'
                        }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            // Prevent form submission
            e.preventDefault();
            // Get the form instance
            //var $form = $(e.target);
            // Get the BootstrapValidator instance
            //var bv = $form.data('bootstrapValidator');
            // Use Ajax to submit form da
            var limit = $('#people-num').val();
            var coin = $('#coin-num').val();
            var activity = $('#channel-id').val();
            linkajax(limit, coin, activity);
            $('#addess-url').show();
            status = 1;
            return status;
        });

    function linkajax(limit, coin, activity) {
        $.ajax({
            type: 'get',
            url: ajaxurl+'/luckmoney/create',
            dataType: 'jsonp',
            data: {
                token: token,
                limit: limit,
                coin: coin,
                activity: activity
            },
            success: function (data) {
                if (data.code === 200) {
                    $('#addess-url').html(data.data);
                } else {
                    if (data.msg === "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(data.msg);
                    }
                }
            },
            error:function (data) {
                alert("网络错误");
            }
        });
    }

    if($('#table-bgrecon').length!=0) {
        function isEmptyObject(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        }
        let oTable = null;
        var initUserList = function () {
            var table = $('#table-bgrecon');
            table.css("width", "100%");// 重新设置初始化宽度
            if (oTable === null) { //仅第一次检索时初始化Datatab
                oTable = table.dataTable({
                    "bLengthChange": true, //改变每页显示数据数量
                    "bFilter": true, //过滤功能
                    "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                    "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                    "iDisplayLength": 15,//每页显示10条数据(会在ajax请求时发送由后台处理)
                    //ajax地址
                    "sAjaxSource": ajaxurl + '/luckmoney/index',// 请求路径
                    "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                    // 选择展示条数
                    "bFilter": false,
                    // "bJQueryUI" : true,
                    "bLengthChange": false,
                    // 表格填入数据
                    "columns": [
                        {"data": null, "targets": 0},
                        {"data": "created_at"},//创建时间
                        {"data": "lm_create_name"},//创建人
                        {"data": "lm_start_limit"},//领取人数
                        {"data": "lm_coin"},//单人币量
                        {"data": "lm_activity"},//渠道id
                        {"data": "lm_limit"},//已领人数
                        {"data": "lm_url"},//红包链接
                        {"data": "lm_status"}//红包管理
                    ],//添加按钮
                    "columnDefs": [{
                        "targets": 7,//操作按钮目标列
                        render: function (data, type, row, meta) {
                            return '<button class="btn btn-default btn-block copy-url" data-clipboard-text= ' + row.lm_url + '>复制</button>';
                        }
                    }, {
                        "targets": 8,//操作按钮目标列
                        "data": null,
                        "render": function (data, type, row) {
                            if(row.lm_status ===1){
                            return '<button  class="btn btn-default btn-block close-status" id = '+ row._id +' name ="close" value=' + row.lm_status + '>关闭</button>';
                        }else if(row.lm_status ===2){
                                return '<button  class="btn btn-default btn-block close-status" id = '+ row._id +' name ="close" value=' + row.lm_status + ' disabled="false">已关闭</button>';
                            }
                        }

                    }],

                    "fnDrawCallback": function () {
                        var api = this.api();
                        //var startIndex= api.context[0]._iDisplayStart;//获取到本页开始的条数
                        api.column(0).nodes().each(function (cell, i) {
                            //此处 startIndex + i + 1;会出现翻页序号不连续，主要是因为startIndex 的原因,去掉即可。
                            //cell.innerHTML = startIndex + i + 1;
                            cell.innerHTML = i + 1;
                        });
                    }

                });

            }
        };

        //参数执行函数
        function retrieveData(sSource, aoData, fnCallback) {
            // 自定义请求参数并对应插件本身加载数据
            let skip = {
                name: "skip",
                value: aoData[3].value
            };// 请求数据开始位置
            let limit = {
                name: "limit",
                value: aoData[4].value
            };//请求条数
            let tokenval = {
                name: "token",
                value: token
            };//请求条数
            // 添加到参数列表
            aoData.push(tokenval);
            aoData.push(skip);
            aoData.push(limit);
            /* ajax 方法调用*/
            $.ajax({
                type: "get",
                // contentType: "text/json",
                url: sSource,
                dataType: "json",
                data: aoData,
                success: function (resp) {
                    if (resp.code === 200) {
                        if (resp.data.length == 0 || isEmptyObject(resp.data)) {
                            oTable.fnDestroy();
                            alert("没有数据");
                        } else {
                            fnCallback(resp.data);
                        }
                    } else {
                        if (resp.msg == "TOKEN无效") {
                            document.location = "../login.html"
                        } else {
                            oTable.fnDestroy();
                            alert(resp.msg);
                        }
                    }
                },
                "error": function (resp) {
                    alert("网络错误")
                }
            });
        }

       initUserList();

    }

    (function copyUrlLink(){
        var clipboard = new Clipboard('.copy-url');
        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            alert('红包链接已复制到剪贴板');
            e.clearSelection();
            return false;
        });

        clipboard.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }());

    $('#table-bgrecon tbody').on('click', 'button', function () {
        let name = $(this).attr('name');
        if( name !=undefined && name == 'close'){
            let _id = $(this).attr('id');
            let lm_status = $(this).val();
            if(confirm("是否确认关闭该红包链接？关闭后将不可再次开启？"))
            {
                if (lm_status==1) {
                    $(this).html('已关闭');
                    $(this).attr('disabled','false');
                    closeBag(_id);
                }
            }
        }

    });
    function closeBag(_id) {
        $.ajax({
            type: 'get',
            url: ajaxurl+'/luckmoney/close',
            dataType: 'json',
            data: {
                token: token,
                id: _id
            },
            success: function (data) {
                if (data.code === 200) {
                    console.log(data);
                } else {
                    if (data.msg === "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(data.msg);
                    }
                }
            },
            error:function (data) {
                alert("网络错误");
            }
        });
    }

    $('#bag-manage').on('click', function () {
        if(status === 1){
            var table = $('#table-bgrecon').DataTable();
            table.ajax.reload();
        }
    });
});