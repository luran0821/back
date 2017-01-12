import {getCookie} from '../common/get-cookie.js';
import {comajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {obtainimgId} from '../common/obtain-imgId.js';
import {uploadimg} from '../common/uploadimg.js';
import {unix} from '../common/unix.js';
let token = getCookie("token");
let pathurl = path();
let uid,starttime,endtime;
if($(".flow-statement").length!=0){
    function isEmptyObject(e) {
        var t;
        for (t in e)
            return !1;
        return !0
    }
    let oTable = null;
    var initUserList = function () {
        var table = $('#table-recon');
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 30,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": pathurl + "flow",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                // 选择展示条数
                "bFilter" : false,
                // "bJQueryUI" : true,
                "bLengthChange": false,
                // 表格填入数据
                "columns": [
                    { "data": "fl_time" },
                    { "data": "fl_uid" },
                    { "data": "nickname" },
                    { "data": "fl_phone" },
                    { "data": "fl_provider" },
                    { "data": "fl_volume" },
                    { "data": "fl_sum" },
                    { "data": "fl_pricelmc" },
                    { "data": "fl_status" }
                ],
                "columnDefs": [{
                    "targets": 8,//操作按钮目标列
                    "data": null,
                    "render": function (data, type, row) {
                        var html ;
                        console.log(row.fl_status)
                        if(row.fl_status==1){
                            html = '成功'
                        }else if(row.fl_status==2){
                            html = '失败'
                        }else if(row.fl_status==0){
                            html = '已提交'
                        }
                        return html;
                    }
                }]
            });
        }
    };

    //参数执行函数
    function retrieveData(sSource, aoData, fnCallback) {
        // 自定义请求参数并对应插件本身加载数据
        console.log(uid,starttime,endtime)
        let start_time = {
            name:"start_time",
            value:starttime
        };
        let end_time = {
            name:"end_time",
            value:endtime
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
        aoData.push(start_time);
        aoData.push(end_time);
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
                    if(resp.data.length==0||isEmptyObject(resp.data)){
                        oTable.fnDestroy();
                        alert("没有数据");
                    }else {
                        fnCallback(resp.data);
                    }
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
    function search() {
        uid = $(".center .top input").eq(0).val();
        starttime = new Date($(".picker_inquiryAmb1").val()).getTime()/1000;
        endtime = new Date($(".picker_inquiryAmb2").val()).getTime()/1000;
        if(starttime>endtime){
            alert("开始时间不能在结束时间之后");
            return false;
        }
        if(oTable!=null) {
            oTable.fnDestroy();
        }
        oTable = null;
        initUserList();
    }
    $(function () {
        search();
        $(".search").on("click",function () {
            let isempty = false;
            $(".center .top input").each(function (i) {
                if ($(".center .top input").eq(i).val() == "") {
                    isempty = true;
                    return isempty;
                }
            })
            if(isempty){
                alert("请检查参数是否正确");
            }  else {
                search();
            }
        })
    })

}
