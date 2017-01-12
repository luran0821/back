import {getCookie} from '../common/get-cookie.js';
import {unix} from '../common/unix.js';
import {path} from '../common/configuration.js';
import {newajax} from '../common/ajax.js';

let token = getCookie("token");
let [array,array1,array2]=[[],[],[]];
let ajaxurl = path();
let deltop;
if($(".delete-bulletin").length!=0){
    var oTable = null;
    var initUserList = function () {
        var table = $('.delete-bulletin #table-delete');
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 20,//每页显示20条数据(会在ajax请求时发送由后台处理)
                "sAjaxSource": ajaxurl + "newsBoard",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                "columns": [
                    { "data": "nb_title" },
                    { "data": "nb_aid" },
                    { "data": "nb_publish_time" },
                    { "data": "nb_off_time" },
                    { "data": "nb_is_top" },
                    { "data": "nb_is_top"}// 默认留空,按钮位置
                ],
                //添加按钮
                "columnDefs" : [ {
                    "targets" : 5,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        // console.log(data);
                        var html = "";
                        if(data==1){
                            html = "<a href='javascript:void(0);' id='"+row._id +"' class='btn btn-primary btn-istop'> 取消置顶<a/>";
                        }else {
                            html = "<a href='javascript:void(0);' id='"+row._id +"' class='btn btn-primary btn-top'> 置顶<a/>";
                        }
                        html+= "<a href='show.html?id="+row._id+"' id='"+row._id +"' class='btn btn-primary btn-detail'> 查看详情<a/>";
                        html+= "<a href='javascript:void(0);' id='"+row._id +"'  class='btn btn-delete btn-primary'> 删除<a/>";
                        return html;
                    }
                },{
                    "targets" : 4,//操作按钮目标列
                    "data" : "nb_isTop",
                    "render" : function(data, type,row) {
                        var html ;
                        if(data==1){
                            html = "是"
                        }else {
                            html = "否"
                        }
                        return html;
                    }
                }]
            });
        }
    };

//参数执行函数
    function retrieveData(sSource, aoData, fnCallback) {
        //console.log(sSource,aoData,fnCallback);
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
            "type": "get",
            // "contentType": "text/json",
            "url": sSource,
            "dataType": "json",// json和jsonp有差别
            "data": aoData,
            "success": function (resp) {
                if (resp.code === 200) {
                    for (let [index,v] of resp.data.data.entries()){
                        if(v.nb_is_top==1){
                            deltop = v._id;
                        }
                    }
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
                alert("网络错误");
            }
        });
    }
    initUserList();
    $(document).on("click",".delete-bulletin #table-delete .btn-delete",function () {
        let id = $(this).attr("id");
        let list = {};
        list = {
            "token":token,
            "id":id
        }
        newajax(list,"post","newsBoard/del", callback);
        function callback(data) {
            console.log(data);
            if (oTable != null) {
                oTable.fnDestroy();
            }
            oTable = null;
            initUserList();
        }
    })
    $(document).on("click",".delete-bulletin #table-delete .btn-top",function () {
        let id = $(this).attr("id");
        let list ={
            "token":token,
            "id":id,
            "is_top":1
        }
        newajax(list,"post","newsBoard/put", callback2);
        function callback2(data) {
            // console.log(data);
            if (oTable != null) {
                oTable.fnDestroy();
            }
            oTable = null;
            initUserList();
        }
    })
    $(document).on("click",".delete-bulletin #table-delete .btn-istop",function () {
        let id = $(this).attr("id");
        let list ={
            "token":token,
            "id":id,
            "is_top":2
        }
        newajax(list,"post","newsBoard/put", callback1);
        function callback1() {
            if (oTable != null) {
                oTable.fnDestroy();
            }
            oTable = null;
            initUserList();
        }
    })
    // $(document).on("click",".delete-bulletin #table-delete .btn-detail",function () {
    //     let id = $(this).attr("id");
    //     let [arry,arry1,arry2] = [[],[],[]]
    //     arry1.push("token","id");
    //     arry2.push(token,id);
    //     arry.push(arry1,arry2);
    //     console.log(arry);
    //     comajax(arry, "news-InfoById", callback);
    //     function callback(data) {
    //         // console.log(data);
    //         if (oTable != null) {
    //             oTable.fnDestroy();
    //         }
    //         oTable = null;
    //         initUserList();
    //     }
    // })
}



