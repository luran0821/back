import {getCookie} from '../common/get-cookie.js';
import {comajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {unix} from '../common/unix.js';
let adminurl = path();
let token = getCookie("token");
// datatables 服务福端配置 需要后台配置相关代码
if ($('.white-query').length!=0) {
    var oTable = null;
    var initUserList = function () {
        var table = $('.white-query #tablewhite-query');
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 50,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": adminurl + "user/white",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                //配置列要显示的数据
                // 表格填入数据
                "columns": [
                    {"data": "u_uid"},
                    {"data": "u_nickname"},
                    {"data": "u_access"},
                    {"data": "u_time"},
                    {"data": "u_access_admin_name"},
                    {"data": "u_time"},
                    {"data": " "}
                ],
                //添加按钮
                "columnDefs": [{
                    "targets": 6,//操作按钮目标列
                    "data": null,
                    "render": function (data, type, row) {
                        //console.log(data,type,row)
                        var html = "<div href='javascript:void(0);' id = "+ row._id +" data_id ="+ row.u_uid + " class='btn btn-primary btn-danger remove-white' > 移除<div/>";
                        return html;
                    }
                },{
                    "targets": 3,//操作按钮目标列
                    "data": null,
                    "render": function (data, type, row) {
                        if(row.updated_at) {
                            return unix(row.updated_at)
                        }else {
                            return unix(row.u_time)
                        }
                    }
                },{
                    "targets": 5,//操作按钮目标列
                    "data": null,
                    "render": function (data, type, row) {
                        //console.log(data,type,row)
                        var html = "<div href='javascript:void(0);' class='btn btn-primary com' data_details ="+ row.u_access_reason +" > 查看详情<div/>";
                        return html;
                    }
                }]
            });
        }
    };

//参数执行函数
    let uploaduid = false;
    function retrieveData(sSource, aoData, fnCallback,sechuid) {
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

        let userName = {
            name: "userName",
            value: ""
        };
        //请求条数
        // 添加到参数列表
        aoData.push(skip);
        aoData.push(limit);
        aoData.push(tokenval);
        // aoData.push(uid);
        if(uploaduid){
            let uid = {
                name: "uid",
                value: uploaduid
            };
            aoData.push(uid);
        }else {

        }
        /* ajax 方法调用*/
        $.ajax({
            "type": "get",
            // "contentType": "text/json",
            "url": sSource,
            "dataType": "json",// json和jsonp有差别
            "data": aoData,
            success: function (resp) {
                if (resp.code === 200) {
                    fnCallback(resp.data);
                } else {
                    if (resp.msg == "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        oTable.fnDestroy();
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
    });
    $(document).on("click",".white-query .maker2 .btn-primary",function () {
        let id =$(this).attr("id")
        let _this = this;
        $.ajax({
            type: "post",
            url: adminurl+"user/white/del",
            dataType: "json",
            data: {
                token:token,
                id:id
            },
            success: function (data) {
                if (data.code === 200) {
                    $(".maker2").addClass("none");
                    if(oTable!=null) {
                        oTable.fnDestroy();
                    }
                    oTable = null;
                    initUserList();
                } else {
                    alert(data.msg);
                }
            },
            error:function () {
                alert("上传错误")
            }
        });
    })
    $(".white-query .searchuid .btn").on("click",function () {
        uploaduid = $(".white-query .searchuid input").val();
        // uploaduid = 100001;
        if(oTable!=null) {
            oTable.fnDestroy();
        }
        oTable = null;
        initUserList();
    })
    $(document).on("click",".white-query .com",function () {
        $(".white-query .maker").removeClass("none");
        if($(this).attr("data_details")==""){
            $(".white-query .maker p").html("暂无");
        }else {
            $(".white-query .maker p").html($(this).attr("data_details"));
        }

    })
    $(".white-query .maker .btn").on("click",function () {
        $(this).parents(".maker").addClass("none");
        $(this).siblings("p").html("");
    })

    $(document).on("click", ".maker2 .out", function () {
        return false;
    })
    $(document).on("click", ".maker2,.maker2 .btn-cancel", function () {
        $(".maker2").addClass("none");
    })
    $(document).on("click",".remove-white",function () {
        $(".maker2").removeClass("none")
        $(".maker2 .btn").attr('data_id',$(this).attr("data_id"));
        $(".maker2 .btn").attr('id',$(this).attr("id"))
    })
}
