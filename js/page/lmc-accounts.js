import {getCookie} from '../common/get-cookie.js';
import {unix} from '../common/unix.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
let ajaxurl = path();
$(document).ready(function () {
    if($(".lmc-accounts").length!=0) {
        let adminurl = path();
        let token = getCookie("token");
        let startTime,endTime,uid;
        var typeval = 0;
        var oTable = null;
        var initUserList = function () {
            var table = $('.lmc-accounts #table-accounts');
            table.css("width", "100%");// 重新设置初始化宽度
            if (oTable == null) { //仅第一次检索时初始化Datatable
                oTable = table.dataTable({
                    "bLengthChange": true, //改变每页显示数据数量
                    "bFilter": true, //过滤功能
                    "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                    "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                    "iDisplayLength": 20,//每页显示10条数据(会在ajax请求时发送由后台处理)
                    //ajax地址
                    "sAjaxSource": adminurl + "pay",// 请求路径
                    "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                    // 表格填入数据
                    "columns": [
                        {"data": null},
                        {"data": "ps_uid"},
                        {"data": "nick_name"},
                        {"data": "address"},
                        {"data": "ps_coin"},
                        {"data": "ps_lmc"},
                        {"data": "ps_channel"},
                        {"data": "ps_amount"},
                        {"data": "lmc_status"},
                        {"data": "lmc_time"},
                        {"data": "null"}
                    ],
                    //添加按钮
                    "columnDefs": [{
                        "targets": 0,//操作按钮目标列
                        "data": null,
                        "render": function (data, type, row) {
                            return unix(row.created_at)
                        }
                    },{
                        "targets": 8,//操作按钮目标列
                        "data": null,
                        "render": function (data, type, row) {
                            var html = '';
                            if(row.lmc_status==3){
                                html = "已到账"
                            }else {
                                html = "等待确认"
                            }
                            return html;
                        }
                    },{
                        "targets": 10,//操作按钮目标列
                        "data": null,
                        "render": function (data, type, row) {
                            var html = '';
                            if(row.ps_type==1){
                                html = "创建未付款"
                            }else  if(row.ps_type==2){
                                html = "已经付款"
                            }else {
                                html = "失败"
                            }
                            return html;
                        }
                    }]
                });
            }
            //刷新Datatable，会自动激发retrieveData
            // oTable.fnDraw();
        };
        function retrieveData(sSource, aoData, fnCallback) {
            // console.log(sSource,fnCallback,aoData)
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
            };
            let start_time = {
                name:"start_time",
                value:startTime
            }
            let end_time = {
                name:"end_time",
                value:endTime
            }
            let type = {
                name: "type",
                value: typeval
            };
            let uidnum = {
                name:"uid",
                value:uid
            }
            // 添加到参数列表
            aoData.push(skip);
            aoData.push(limit);
            aoData.push(tokenval);
            aoData.push(start_time);
            aoData.push(end_time);
            aoData.push(uidnum);
            aoData.push(type);
            /* ajax 方法调用*/
            $.ajax({
                "type": "get",
                // "contentType": "text/json",
                "url": sSource,
                "dataType": "json",// json和jsonp有差别
                "data": aoData,
                "success": function (data) {
                    // console.log(resp)
                    // 插件回调数据处理方法,
                    // console.log(resp.DATA.data);
                    if (data.code === 200) {
                        fnCallback(data.data); //服务器端返回的对象的returnObject部分是要求的格式
                    } else {
                        // document.location = "../login.html";
                        if (data.msg == "TOKEN无效") {
                            document.location = "../login.html"
                        }else {
                            alert(data.msg);
                        }
                    }
                }
            });
        }

        jQuery(document).ready(function () {
            startTime = new Date($(".picker_inquiryAmb1").val()).getTime()/1000;
            endTime = new Date($(".picker_inquiryAmb2").val()).getTime()/1000;
            // startTime = $(".picker_inquiryAmb1").val()
            // endTime = $(".picker_inquiryAmb2").val()
            initUserList();
            $('.search').on('click',function () {
                startTime = new Date($(".picker_inquiryAmb1").val()).getTime()/1000;
                endTime = new Date($(".picker_inquiryAmb2").val()).getTime()/1000;
                uid = $('.uid').val();
                typeval = $(".pay_type").val();
                allback()
            });
            function allback() {
                // if (oTable != null) {
                //     oTable.fnDestroy();
                // }
                // oTable = null;
                // initUserList();
                if(oTable){
                    oTable.fnDraw();
                }else {
                    initUserList();
                }
            }
        });

    }
});