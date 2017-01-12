import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {obtainimgId} from '../common/obtain-imgId.js';
import {uploadimg} from '../common/uploadimg.js';
let token = getCookie("token");
let pathurl = path();
if($(".fence-manage").length!=0) {
    let oTable = null;
    var initUserList = function () {
        var table = $('.fence-manage #table-fence');
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 10,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": pathurl + "fenceMap",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                // 选择展示条数
                "bFilter" : false,
                // "bJQueryUI" : true,
                "bLengthChange": false,
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
                    { "data": "fm_start_time" },
                    { "data": "fm_remarks" },
                    { "data": "fm_pos_address" },
                    { "data": "fm_radius" },
                    { "data": "fm_view_range" },
                    { "data": "暂无" },
                    { "data": "fm_create_uname" },
                    { "data": " "}
                ],
                //添加按钮
                "columnDefs" : [ {
                    "targets" : 2,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        //console.log(data,type,row)
                        var html = "<div href='javascript:void(0);' data_adress="+row.fm_pos_address+" class='btn btn-default btn-adress' > 查看详情<div/>";
                        return html;
                    }
                }, {
                    "targets" : 7,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        //console.log(data,type,row)
                        if(row.fm_status==2) {
                            var html = "<div href='javascript:void(0);' data_id=" + row._id + " class='btn btn-default btn-danger' > 已终止<div/>";
                            return html;
                        }else if(row.fm_status==1){
                            var html = "<div href='javascript:void(0);' data_id=" + row._id + " class='btn btn-default btn-end' > 终止<div/>";
                            return html;
                        }else {
                            var html = "无法标示"
                            return html;
                        }
                    }
                }, {
                    "targets" : 5,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        var html = "暂无数据"
                        return html;
                    }
                } ]
            });
        }
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
        // 添加到参数列表
        aoData.push(skip);
        aoData.push(limit);
        aoData.push(tokenval);
        /* ajax 方法调用*/
        $.ajax({
            type: "get",
            // contentType: "text/json",
            url: sSource,
            dataType: "json",
            data: aoData,
            success: function (resp) {
                if (resp.code === 200) {
                    if(resp.data.length==0){
                        oTable.fnDestroy();
                        alert("没有数据");
                    }else {
                        fnCallback(resp.data);
                        // oTable.fnDraw();
                    }

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
        $(document).on("click",".btn-adress",function () {
            let conent = $(this).attr("data_adress");
            $(".maker p").html(conent);
            $(".maker").removeClass("none");
        })
        $(document).on("click", ".maker,.maker .btn", function () {
            $(".maker").addClass("none");
        })
        $(document).on("click", ".maker .out,.maker2 .out", function () {
            return false;
        })
        $(document).on("click", ".maker2,.maker2 .btn-cancel", function () {
            $(".maker2").addClass("none");
        })
        $(document).on("click",".btn-end",function () {
            $(".maker2").removeClass("none")
            $(".maker2 .btn-right").attr('data_id',$(this).attr("data_id"))
        })

        $(document).on("click",".maker2 .btn-right",function () {
            let array;
            let id = $(this).attr("data_id");
            array = {
                "token":token,
                "id":id,
                "status":2
            }
            newajax(array,"post","fenceMap/save",callback);
        })
        function callback(data) {
            alert("已终止");
            $(".maker2").addClass("none");
            oTable.fnDraw();
        }
    })
}