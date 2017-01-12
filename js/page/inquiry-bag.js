import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
let adminurl = path();
$(document).ready(function () {
    let token = getCookie("token");
    let inquiryBag = $(".inquiry-bag #table-inquiryBag");
    let skipstart,limitend,typeuid,prmval,counter,table,DATA,counter2;
    let array,array_l;
    let oTable = null;
    inquiryBag.css("width", "100%");
    var initUserList = function () {
        var table = inquiryBag;
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 10,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": adminurl + "bag",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                "bFilter" : false,
                "bLengthChange": false,
                // 表格填入数据
                "columns": [
                    { data: "b_unick" },// 用户名
                    { data: 'b_title' }, // 萌袋名
                    { data: 'b_balance' }, // 余额
                    { data: 'b_coins' }, // 总量
                    { data: 'b_join' }, // 已领人数
                    { data: 'b_limit' },
                    { data: 'b_time' },
                    { data: 'b_end' },
                    { data: 'b_pos' },
                    { data: null }
                ],
                "columnDefs" : [ {
                    "targets" : 9,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        var html = "<div href='javascript:void(0);' class='btn btn-primary btn-details' data_id = "+ data._id + "> 查看详情<div/>"
                        return html;
                    }
                } ,{
                    "targets" : 10,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        var html = "<div href='javascript:void(0);' class='btn btn-primary btn-del' data_id = "+ data._id + "> 删除<div/>"
                        return html;
                    }
                },{
                    "targets" : 11,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        var html = "<div href='javascript:void(0);' class='btn btn-primary btn-downlist' data_id = "+ data._id + "> 下榜<div/>"
                        return html;
                    }
                } ]
            });
        }
    };

//参数执行函数
    function retrieveData(sSource, aoData, fnCallback) {
        // 自定义请求参数并对应插件本身加载数据
        skipstart = 0;
        limitend = 100;
        // table.fnDestroy();
        typeuid = $(".inquiry-bag .top .btn-inquiryBag").siblings("select").val();
        prmval = $(".inquiry-bag .top .btn-inquiryBag").siblings("input").val();
        let prm = {
            name:"prm",
            value:prmval
        };// 请求数据开始位置
        let type = {
            name:"type",
            value:typeuid
        };
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
        aoData.push(tokenval);
        aoData.push(skip);
        aoData.push(limit);
        aoData.push(prm);
        aoData.push(type);
        /* ajax 方法调用*/
        $.ajax({
            "type": "post",
            "contentType": "text/json",
            "url": sSource,
            "dataType": "jsonp",// json和jsonp有差别
            "data": aoData,
            "success": function (resp) {
                console.log(resp)
                // 插件回调数据处理方法,

                if (resp.code == 200) {
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
                alert(resp.MSG)
            }
        });
    }


    $(".inquiry-bag .top .btn-inquiryBag").on("click",function () {
        if (oTable != null) {
            oTable.fnDraw();
        }
        oTable = null;
        initUserList();
    });

    $(document).on("click",".btn-del",function () {
        let _this = this;
        let id = $(this).attr("data_id");
        let list = {
            token:token,
            id:id
        };
        newajax(list,"post","bag/del",callback);
        function callback(data) {
            let del = $(_this).parents("tr");
            // if (oTable != null) {
            //     oTable.fnDraw();
            // }
            // oTable = null;
            // initUserList();
            oTable.api().row(del).remove().draw(false);
        }
    })

    $(document).on("click",".inquiry-bag #tbody td .btn-details",function () {
        let data_id = $(this).attr("data_id");
        array_l = {
            "token":token
        }
        newajax(array_l,"get","bag/"+data_id+"/join",inqBag2);
    });
    //萌袋点赞下排行榜
    $(document).on("click",".inquiry-bag #tbody td .btn-downlist",function () {
        let _this = this;
        let data_id = $(this).attr("data_id");
        let list = {
            "token":token,
            "bid":data_id
        };
        $.ajax({
            type: "post",
            url: adminurl+"bag/admire",
            async:"false",
            dataType: "json",
            data: list,
            success: function (data) {
                if (data.code === 200) {
                    $(_this).html("已下榜").addClass("btn-success");
                } else if(data.code===422&&data.msg==="萌袋编号在排行榜中不存在!"){
                    $(_this).html("未上榜").removeClass("btn-downlist btn-primary").addClass("btn-danger");
                }
            },
            error:function (data) {
                alert(data.msg);
            }
        });
    });
    let namepeople;
    let maker = $(".inquiry-bag .maker .btn");
    function inqBag2(res) {
        namepeople = "";
        if(res.data.length!=0) {
            for (let [index,v] of res.data.data.entries()) {
                namepeople += res.data.data[index].bj_nick + ",";
            }
        }else {
            namepeople = "";
        }
        maker.parents('.maker').removeClass("none");
        if(namepeople=="") {
            maker.parents('.maker').find("p").html("未领取");
        }else {
            maker.parents('.maker').find("p").html(namepeople);
        }
    }
    maker.on("click",function () {
        $(this).parents('.maker').addClass("none");
        $(this).parents('.maker').find("p").html();
    })
});
