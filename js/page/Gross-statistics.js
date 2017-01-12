import {getCookie} from '../common/get-cookie.js';
import {path} from '../common/configuration.js';
$(function(){
    let token = getCookie('token');
    let ajaxurl = path();
    let starttime,endtime;
    let oTable = null;
    if($(".Gross-statistics").length!=0) {
        function ambevery () {
            let initUserList = function () {
                var table = $('.Gross-statistics #table-gross');
                table.css("width", "100%");// 重新设置初始化宽度
                if (oTable == null) { //仅第一次检索时初始化Datatable
                    oTable = table.dataTable({
                        "bLengthChange": true, //改变每页显示数据数量
                        "bFilter": true, //过滤功能
                        "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                        "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                        "iDisplayLength": 50,//每页显示10条数据(会在ajax请求时发送由后台处理)
                        //ajax地址
                        "sAjaxSource": ajaxurl + "statistical/everyday",// 请求路径
                        "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                        // 表格填入数据
                        "columns": [
                            { "data": "day_time" },
                            { "data": "day_user_sum" },
                            { "data": "day_user_new" },
                            { "data": "day_user_sumbindid" },
                            { "data": "day_user_sumfreezeduser" },
                            { "data": "day_coin_sum" },
                            { "data": "day_coin_new" },
                            { "data": "day_usercoin_sum" },
                            { "data": "day_usercoin_new" },
                            { "data": "day_user_sumfreezedcoin" },
                            { "data": "day_coin_newtowallet" },
                            { "data": "day_coin_sumfromwallet" },
                            { "data": ""},
                            { "data": "day_bag_sum"},
                            { "data": "day_bag_new"},
                            { "data": "day_bag_newuserbag"},
                        ],
                        //添加按钮
                        "columnDefs" : [ {
                            "targets" : 0,//操作按钮目标列
                            "data" : null,
                            "render" : function(data, type,row) {
                                return row.day_time;
                            }
                        },{
                            "targets" : 12,//操作按钮目标列
                            "data" : null,
                            "render" : function(data, type,row) {
                                return "暂无";
                            }
                        }]
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
                let start_time = {
                    name:"start_time",
                    value:starttime
                };
                let end_time = {
                    name:"end_time",
                    value:endtime
                };
                let tokenval = {
                    name:"token",
                    value:token
                };//请求条数
                // 添加到参数列表
                aoData.push(start_time);
                aoData.push(end_time);
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
                        console.log(resp.data);
                        if (resp.code === 200) {
                            if(resp.recordsTotal==0) {
                                alert("没有数据");
                                return false;
                            }else {
                                fnCallback(resp.data); //服务器端返回的对象的returnObject部分是要求的格式
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
                        alert("网络错误");
                    }
                });
            }
            initUserList();
        }
        $(".Gross-statistics .center .top .btn").on("click",function () {
            starttime = new Date($(".Gross-statistics .picker_gross1").val()).getTime()/1000;
            endtime = new Date($(".Gross-statistics .picker_gross2").val()).getTime()/1000
            console.log(new Date($(".Gross-statistics .picker_gross1").val()).getTime()/1000);
            if(starttime>=endtime) {
                alert("时间区间选择不正确")
            }else{
                if(oTable!=null) {
                    oTable.fnDestroy();
                }
                oTable = null;
                ambevery();
            }
        })
    }
    // day_bag_new:8327 //新增萌袋
    // day_bag_newuserbag:41 //新增用户萌袋
    // day_bag_sum:356339 // 萌袋总数
    // day_bag_sumuserbag:8169 // 用户萌袋总数
    // day_coin_new:178982.79350002 // 昨日发币量
    // day_coin_newfromwallet:0 //新增转出钱包的币数
    // day_coin_newtowallet:136360.2 //新增转到钱包的币数
    // day_coin_sum:9390412.3652509 //发币量总量
    // day_coin_sumfromwallet:0 // 转出钱包的币数总和
    // day_coin_sumtowallet:7408125.1 // 转到钱包的币数总和
    // day_time:1468432512 //统计时间
    // day_user_new:559 // 昨日新增用户数
    // day_user_newbindid:343 // 昨日新增绑定用户数
    // day_user_sum:59629 //用户总量
    // day_user_sumbindid:16995 //绑定用户总数
    // day_user_sumfreezedcoin:2178225.7757188//冻结用户总持币数
    // day_user_sumfreezeduser:3870 // 冻结用户总数
    // day_usercoin_new:181382.28350003 // 昨日用户发币量
    // day_usercoin_sum:9364641.1852509 // 用户发币总量
    $(".Gross-statistics .center .top .btn").click();
});
