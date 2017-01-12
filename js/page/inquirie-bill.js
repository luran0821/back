import {getCookie} from '../common/get-cookie.js';
import {path} from '../common/configuration.js';
import {unix} from '../common/unix.js';
$(document).ready(function () {
    let ajaxurl = path();
    let token = getCookie("token");
// datatables 服务福端配置 需要后台配置相关代码
    var oTable = null;
    var initUserList = function () {
        var table = $('.inquirie-bill #table-bill');
        table.css("width", "100%");// 重新设置初始化宽度
        // if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 20,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": ajaxurl + "user/bill",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                // 表格填入数据
                "columns": [
                    { "data": "time" },
                    { "data": "type" },
                    { "data": "name" },
                    { "data": "coins" }
                ],
                //添加按钮
                "columnDefs" : [ {
                    "targets" : 0,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        return unix(row.time)
                    }
                } ]
            });
        // }
        //刷新Datatable，会自动激发retrieveData
        // oTable.fnDraw();
    };

//参数执行函数
    function retrieveData(sSource, aoData, fnCallback) {
        // console.log(sSource,fnCallback,aoData)
        // 自定义请求参数并对应插件本身加载数据
        let skip = {
            name:"skip",
            value:aoData[3].value
        };// 请求数据开始位置
        let limit = {
            name:"limit",
            value:aoData[4].value
        };//请求条数
        let UID = {
            name:"uid",
            value:$(".inquirie-bill .generate input").val()
        };
        let tokenval = {
            name:"token",
            value:token
        };//请求条数
        // 添加到参数列表
        aoData.push(skip);
        aoData.push(limit);
        aoData.push(tokenval);
        aoData.push(UID);
        /* ajax 方法调用*/
        $.ajax({
            "type": "get",
            // "contentType": "text/json",
            "url": sSource,
            "dataType": "json",// json和jsonp有差别
            "data": aoData,
            "success": function (resp) {
                // console.log(resp)
                if (resp.code === 200) {
                    if(resp.data.length==0){
                        oTable.fnDestroy();
                        alert("没有数据");
                    }else {
                        fnCallback(resp.data);
                    }
                } else {
                    oTable.fnDestroy();
                    if (resp.msg == "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(resp.msg);
                    }
                }
            }
        });
    }
    $(".inquirie-bill .generate .btn").on("click",function(){
        if(oTable){
            oTable.fnDraw();
        }else {
            initUserList();
        }
    })
})

