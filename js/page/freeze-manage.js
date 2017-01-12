import {getCookie} from '../common/get-cookie.js';
import {path} from '../common/configuration.js';
import {newajax} from '../common/ajax.js';
import {unix} from '../common/unix.js';
let adminurl = path();
let token = getCookie("token");
// datatables 服务福端配置 需要后台配置相关代码
var oTable = null;
var initUserList = function () {
    var table = $('.freeze-manage #tableManage-freeze');
    table.css("width", "100%");// 重新设置初始化宽度
    if (oTable == null) { //仅第一次检索时初始化Datatable
        oTable = table.DataTable({
            "bLengthChange": true, //改变每页显示数据数量
            "bFilter": true, //过滤功能
            "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
            "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
            "iDisplayLength": 10,//每页显示10条数据(会在ajax请求时发送由后台处理)
            //ajax地址
            "sAjaxSource": adminurl + "user/freezing",// 请求路径
            "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))

            //默认排序
            // "order": [
            //     [0, 'asc']//第一列正序
            // ],
            // 选择展示条数
            // "lengthMenu": [
            //     [5, 15, 20, -1],
            //     [5, 15, 20, "All"] // change per page values here
            // ],
            // set the initial value
            // "pageLength": 1,
            //向服务器传额外的参数
            // "fnServerParams": function (aoData) {
            //     aoData.push(
            //         { "name": "UserName", "value": $('#txt_UserName').val() },//员工名字
            //         { "name": "Division", "value": $('#Sel_Division').val() })//所处Division
            // },
            //配置列要显示的数据
            // 表格填入数据
            "columns": [
                { "data": "u_id" },
                { "data": "u_nickname" },
                { "data": "u_phone" },
                { "data": "u_balance" },
                { "data": "u_freezed" },
                { "data": "u_cbalance" },
                { "data": "u_noconfirm"},
                { "data": "u_regtime" },
                { "data": " "},// 默认留空,按钮位置
                { "data": " "}
            ],
            //添加按钮
            "columnDefs" : [ {
                "targets" : 8,//操作按钮目标列
                "data" : null,
                "render" : function(data, type,row) {
                     //console.log(data,type,row)
                    var html = "<div href='javascript:void(0);' data_type= "+ row.u_status +" data_id ="+ row.u_id + " class='btn btn-primary btn-danger relieve' > 解冻<div/>";
                    return html;
                }
            } , {
                "targets" : 9,//操作按钮目标列
                "data" : null,
                "render" : function(data, type,row) {
                    //console.log(row.freezing_data[0]);
                    if(row.freezing_data.length==0){
                        var html = "<div href='javascript:void(0);' executor_name=暂无  reason=暂无  time=暂无  class='btn btn-primary detail' > 查看详情<div/>";
                        return html;
                    }else {
                        var time = row.freezing_data.uf_time?unix(row.freezing_data.uf_time):unix(row.freezing_data.uf_time);
                        var reason = row.freezing_data.uf_reason;
                        var html = "<div href='javascript:void(0);' time=" + time + "  executor_name=" + row.freezing_data.uf_executor_name +"  class='btn btn-primary detail' reason="+reason+"> 查看详情<div/>";
                        return html;
                    }
                }
            } ]
            //语言配置--页面显示的文字
            // "language": {
            //     "aria": {
            //         "sortAscending": ": activate to sort column ascending",
            //         "sortDescending": ": activate to sort column descending"
            //     },
            //     "emptyTable": "No data available in table",
            //     "info": "Showing _START_ to _END_ of _TOTAL_ entries",
            //     "infoEmpty": "No entries found",
            //     "infoFiltered": "(filtered1 from _MAX_ total entries)",
            //     "lengthMenu": "Show _MENU_ entries",
            //     "search": "Search:",
            //     "zeroRecords": "No matching records found"
            // }
        });
    }

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
    let tokenval = {
        name:"token",
        value:token
    };//请求条数
    let status = {
        name:"status",
        value:-1
    }
    // 添加到参数列表
    aoData.push(skip);
    aoData.push(limit);
    aoData.push(tokenval);
    aoData.push(status);
    /* ajax 方法调用*/
    $.ajax({
        "type": "get",
        // "contentType": "text/json",
        "url": sSource,
        "dataType": "json",// json和jsonp有差别
        "data": aoData,
        "success": function (resp) {
            // console.log(resp)
            // 插件回调数据处理方法,
            if (resp.code === 200) {
                fnCallback(resp.data); //服务器端返回的对象的returnObject部分是要求的格式
            } else {
                if (resp.msg == "TOKEN无效") {
                    document.location = "../login.html"
                }else {
                    alert(resp.msg);
                }
            }
        },
        "error":function (resp) {
            alert("网络错误")
        }
    });
}

jQuery(document).ready(function () {
        initUserList();
    //冻结按钮
    $(document).on("click","#tableManage-freeze .relieve",function () {
        //alert(3)
        var _this = $(this);
        let id = $(_this).attr("data_id");
        let status = $(_this).attr("data_type");
        if(status==1){
            status = -1;
        }else {
            status = 1;
        }
        let list = {
            "token":token,
            "uid":id,
            "status":status
        }
        newajax(list,"post","user/freezing",callback);
        function callback (data) {
            if(status==1){
                $(_this).attr("data_type","1");
                $(_this).removeClass("btn-danger");
                $(_this).html("冻结");
            }else {
                $(_this).attr("data_type","0");
                $(_this).html("解冻");
                $(_this).addClass("btn-danger");
            }
        }
    });
    // 查看详情
    $(document).on("click","#tableManage-freeze .detail",function(){
        let _this = this;
        $(".freeze-manage .maker").removeClass("none");
        $(_this).attr("executor_name");
        $(_this).attr("reason");
        $(_this).attr("time");
        let array = [];
        array.push($(_this).attr("time"),$(_this).attr("executor_name"),$(_this).attr("reason"));
        $(".freeze-manage .out span").each(function(i){
            $(this).html(array[i]);
        });
    });
    // 查看详情确定
    $(".freeze-manage .maker .btn").on("click",function(){
        $(this).parents(".maker").addClass("none");
        $(".freeze-manage .out span").each(function(i){
            $(this).html();
        });
    });
});