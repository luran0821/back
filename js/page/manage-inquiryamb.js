import {getCookie} from '../common/get-cookie.js';
import {comajax,newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {unix} from '../common/unix.js';
let token = getCookie("token");
let oTable = null;
let adminurl = path();
let listnum=[];
if ($('.manage-inquiryamb').length!=0) {
    let initUserList = function () {
        var table = $('.manage-inquiryamb #table-inquiryamb');
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 20,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": adminurl + "user/tag",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                // 表格填入数据
                "columns": [
                    { "data": "u_id" },
                    { "data": "u_nickname" },
                    { "data": "u_regtime" },
                    { "data": "u_CA_admin_name" },
                    { "data": "u_CA_admin_name" },
                    { "data": "u_CA_reason" }
                ],
                // //添加按钮
                "columnDefs" : [ {
                    "targets" : 2,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        //console.log(data,type,row)
                        var html = unix(row.u_regtime);
                        return html;
                    }
                } , {
                    "targets" : 4,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        //console.log(data,type,row)
                        var html = `<button data_reason="${row.u_CA_reason}" class="btn reason btn-primary">查看详情</button>`;
                        return html;
                    }
                } , {
                    "targets" : 5,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        //console.log(data,type,row)
                        var html = `<button data_uid="${row.u_id}" class="btn remove btn-danger">移除</button>`;
                        return html;
                    }
                }]
            });
        }
        //刷新Datatable，会自动激发retrieveData
        // oTable.fnDraw();
    };
    //参数执行函数
    function retrieveData(sSource, aoData, fnCallback) {
        console.log(listnum)
        let tokenval = {
            name:"token",
            value:token
        };
        let skip = {
            name:"skip",
            value:aoData[3].value
        };// 请求数据开始位置
        let limit = {
            name:"limit",
            value:aoData[4].value
        };//请求条数
        if(listnum.length!=0){
            if(listnum[0]=="user_name"){
                let username = {
                    name:"user_name",
                    value:listnum[1]
                };
                aoData.push(username);
            }else {
                let uid = {
                    name:"uid",
                    value:listnum[1]
                };
                aoData.push(uid);
            }
        }
        aoData.push(tokenval);
        aoData.push(skip);
        aoData.push(limit);
        /* ajax 方法调用*/
        $.ajax({
            "type": "get",  
            // "contentType": "text/json",
            "url": sSource,
            "dataType": "json",
            "data": aoData,
            "success": function (resp) {
                // console.log(resp)
                // 插件回调数据处理方法,
                console.log(resp);
                if (resp.code === 200) {
                    if(resp.data.length==0){
                        alert("没有数据");
                        oTable.fnDestroy();
                        $("#table-inquiryamb #tbody").html("");
                    }else {
                        fnCallback(resp.data);
                    }
                } else {
                    if (resp.msg == "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(resp.msg);
                        oTable.fnDestroy();
                        $("#table-inquiryamb #tbody").html("");
                    }
                }
            },
            "error":function (resp) {
                alert("网络错误");
            }
        });
    }
    initUserList();
    $(document).on("click",".manage-inquiryamb .reason",function () {
        $(".manage-inquiryamb .maker").removeClass("none");
        $(".manage-inquiryamb .maker p").html($(this).attr("data_reason"));
    })
    $(".manage-inquiryamb .maker .btn").on("click",function () {
        $(this).parents(".maker").addClass("none");
        $(this).siblings("p").html("");
    })
    $(document).on("click",".manage-inquiryamb .remove",function () {
        let uid = $(this).attr("data_uid");
        let list = {
            "token":token,
            "uid":uid,
            "campus_ambassador":"false"
        }
        newajax(list,'post',"user/tag", fnback)
    })
    function fnback(data) {
        oTable.fnDraw();
    }
    $(".manage-inquiryamb .searchuid .btn").on("click",function () {
        listnum = [];
        if($(".searchuid input").val()!="") {
            let typeval, type;
            type = $(this).siblings("select").val()
            typeval = $(this).siblings("input").val()
            listnum.push(type,typeval)
            oTable = null;
            initUserList();
            oTable.fnDraw();
        }else {
            alert("请填写uid");
        }
    });
    
}

