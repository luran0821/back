import {getCookie} from '../common/get-cookie.js';
import {unix} from '../common/unix.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
let adminurl = path();
let token = getCookie("token");
var oTable = null;
var datademo = {
    ISOK: 1,
    DATA: [{
        _id: 100039,
        ij_unickname: "小蠢蠢",
        level_one_count: 1,
        level_two_count: 0,
        level_three_count: 0,
        level_four_count: 0,
        level_five_count: 0,
        level_six_count: 0,
        level_seven_count: 0,
        level_eight_count: 0,
        level_nine_count: 0,
        level_ten_count: 0
    }]
};

$(document).ready(function () {
    if($(".inquiry-amb").length!=0) {
        // ambamount();
        // ambevery();
    }

    function isempty () {
        let uid,starttime,endtime;
        if($(".inquiry-amb .picker_inquiryAmb1").val()==""&&$(".inquiry-amb .picker_inquiryAmb2").val()==""){
            starttime = new Date().getTime()/1000;
            endtime = new Date().getTime()/1000+1*60*60*24;
        }else if($(".inquiry-amb .picker_inquiryAmb1").val()==""||$(".inquiry-amb .picker_inquiryAmb2").val()=="") {
            alert("请填写完整");
            return false;
        }else {
            starttime = new Date($(".inquiry-amb .picker_inquiryAmb1").val()).getTime()/1000;
            endtime = new Date($(".inquiry-amb .picker_inquiryAmb2").val()).getTime()/1000;
        }
        // console.log($(".inquiry-amb .picker_inquiryAmb2").val())
        if(starttime>endtime){
            alert("开始时间不能在结束时间之后");
            return false;
        }
        let array;
        if($(".inquiry-amb .condition").val().length==6) {
            uid = $(".inquiry-amb .condition").val();
        }else {
            alert("请填写6位的uid")
            return false;
        }
        array = {
            "token":token,
            "uid":uid,
            "start_time":starttime,
            "end_time":endtime,
        }
        newajax(array, 'get', "statistical/student/levelAll", lineSchool);
        return true;
        // lineSchool();
        function lineSchool(data) {
            let datacs = data.data[0];
            if(data.data.length==0){
                $(".inquiry-amb #table-inquiryAmb1 tbody").html("没有数据");
            } else {
                let b = [];
                let level_count = datacs.level_one_count+datacs.level_two_count+datacs.level_three_count+datacs.level_four_count+datacs.level_five_count;
                level_count = level_count+datacs.level_six_count+datacs.level_seven_count+datacs.level_eight_count+datacs.level_nine_count+datacs.level_ten_count;
                b.push(datacs._id,datacs.ij_unickname,datacs.level_one_count,datacs.level_two_count,datacs.level_three_count,datacs.level_four_count);
                b.push(datacs.level_five_count,datacs.level_six_count,datacs.level_seven_count,datacs.level_eight_count,datacs.level_nine_count,datacs.level_ten_count,level_count);
                console.log(datacs)
                let Text = doT.template($("#dotpl-inquiryAmb").text());
                $(".inquiry-amb #table-inquiryAmb1 tbody").html(Text(b));
            }
        }
    }

    let initUserList = function () {
        var table = $('.inquiry-amb #table-inquiryAmb2');
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 20,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": adminurl + "statistical/student/levelDays",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                // 表格填入数据
                "columns": [
                    { "data": "ij_statistics_time" },
                    { "data": "ij_uid" },
                    { "data": "ij_unickname" },
                    { "data": "ij_level_one_new_num" },
                    { "data": "ij_level_two_new_num" },
                    { "data": "ij_level_three_new_num" },
                    { "data": "ij_level_four_new_num" },
                    { "data": "ij_level_five_new_num" },
                    { "data": "ij_level_six_new_num" },
                    { "data": "ij_level_seven_new_num" },
                    { "data": "ij_level_eight_new_num" },
                    { "data": "ij_level_nine_new_num" },
                    { "data": "ij_level_ten_new_num"},
                    { "data": " "},// 默认留空,按钮位置
                ],
                //添加按钮
                "columnDefs" : [ {
                    "targets" : 1,//操作按钮目标列
                    "data" : null,
                    "render" : function(data, type,row) {
                        //console.log(data,type,row)
                        var html = row.ij_level_one_new_num+row.ij_level_two_new_num+row.ij_level_three_new_num+row.ij_level_four_new_num+row.ij_level_five_new_num;
                        html += row.ij_level_six_new_num+row.ij_level_seven_new_num+row.ij_level_eight_new_num+row.ij_level_nine_new_num+row.ij_level_ten_new_num;
                        return html;
                    }
                } ]
            });
        }
        //刷新Datatable，会自动激发retrieveData
        // oTable.fnDraw();
    };
    //参数执行函数
    function retrieveData(sSource, aoData, fnCallback) {
        // console.log(sSource,fnCallback,aoData)
        // 自定义请求参数并对应插件本身加载数据
        let starttime,endtime;
        if($(".inquiry-amb .picker_inquiryAmb1").val()==""&&$(".inquiry-amb .picker_inquiryAmb2").val()==""){
            starttime = {
                name:"start_time",
                value:Date.parse(new Date())/1000
            };
            endtime = {
                name:"end_time",
                value:Date.parse(new Date())/1000+1*60*60*24
            };
        }else if($(".inquiry-amb .picker_inquiryAmb1").val()==""||$(".inquiry-amb .picker_inquiryAmb2").val()=="") {
            // alert("请填写完整");
            return false;
        }else {
            starttime = {
                name:"start_time",
                value:new Date($(".inquiry-amb .picker_inquiryAmb1").val()).getTime()/1000
            };
            endtime = {
                name:"end_time",
                value:new Date($(".inquiry-amb .picker_inquiryAmb2").val()).getTime()/1000
            };
        }
        if(starttime>endtime){
            alert("开始时间不能在结束时间之后");
            return false;
        }
        let skip = {
            name:"skip",
            value:aoData[3].value
        };// 请求数据开始位置
        let limit = {
            name:"limit",
            value:aoData[4].value
        };//请求条数
        let UID = "";
        if($(".inquiry-amb .condition").val().length==6) {
            UID = {
                name: "uid",
                value: $(".inquiry-amb .condition").val()
            };
        }else {
            // alert("请填写6位的uid")
            return false;
        }
        let tokenval = {
            name:"token",
            value:token
        };//请求条数
        // 添加到参数列表
        aoData.push(UID);
        aoData.push(starttime);
        aoData.push(endtime);
        aoData.push(skip);
        aoData.push(limit);
        aoData.push(tokenval);
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
                        alert("没有数据")
                        oTable.fnDestroy();
                    }else {
                        fnCallback(resp.data);
                    }
                } else {
                    if (resp.msg == "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(resp.msg);
                        oTable.fnDestroy();
                    }
                }
            },
            "error":function (resp) {
                alert("网络错误");
            }
        });
    }
    $(".inquiry-amb .center .top .btn").on("click",function () {
        console.log(isempty())
        if(isempty()){
            if(oTable){
                oTable.fnDraw();
            }else {
                initUserList();
            }
        }
    });
});