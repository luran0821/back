import {getCookie} from '../common/get-cookie.js';
import {path} from '../common/configuration.js';
let pathurl = path();
let token = getCookie("token");
let oTable = null;
let levelnum = 1;
$(document).ready(function () {
    if($(".line-statistics").length!=0) {
        let initUserList = function () {
            var table = $('#line-statistics');
            table.css("width", "100%");// 重新设置初始化宽度
            if (oTable == null) { //仅第一次检索时初始化Datatable
                oTable = table.dataTable({
                    "bLengthChange": true, //改变每页显示数据数量
                    "bFilter": true, //过滤功能
                    "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                    "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                    "iDisplayLength": 100,//每页显示10条数据(会在ajax请求时发送由后台处理)
                    "showRowNumber":true,
                    "rowReorder": true,
                    //ajax地址
                    "sAjaxSource": pathurl + "statistical/user/level",// 请求路径
                    "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                    // 表格填入数据
                    "columns": [
                        {"data": null,"targets": 0},
                        { "data": "us_name" },
                        { "data": "us_uid" },
                        { "data": null },
                    ],
                    //添加按钮
                    "columnDefs" : [ {
                        "targets" : 3,//操作按钮目标列
                        "data" : null,
                        "render" : function(data, type,row) {
                            console.log(row)
                            if(levelnum==1){
                                var html = row.us_level1;
                                return html;
                            }else {
                                var html = row.us_level2;
                                return html;
                            }
                        }
                    } ],
                    "fnDrawCallback": function(){
                        var api = this.api();
                        //var startIndex= api.context[0]._iDisplayStart;//获取到本页开始的条数
                        api.column(0).nodes().each(function(cell, i) {
                            //此处 startIndex + i + 1;会出现翻页序号不连续，主要是因为startIndex 的原因,去掉即可。
                            //cell.innerHTML = startIndex + i + 1;
                            cell.innerHTML =  i + 1;
                        });
                    }
                });
            }
            //刷新Datatable，会自动激发retrieveData
            // oTable.fnDraw();
        };
        //参数执行函数
        function retrieveData(sSource, aoData, fnCallback) {
            // console.log(sSource,fnCallback,aoData)
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
            };
            let level = {
                name:"level",
                value:levelnum
            }
            // 添加到参数列表
            aoData.push(skip);
            aoData.push(limit);
            aoData.push(tokenval);
            aoData.push(level);
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
        initUserList();
        let btnistnum = 1;
        $(".btnist").on("click",function () {
            if (btnistnum == 1) {
                btnistnum = 2;
                levelnum = 2;
                oTable.fnDraw();
                $(this).html("切换一级人数");
                $("#line-statistics thead tr th:last-child").html("二级人数");
            } else {
                btnistnum = 1;
                levelnum = 1;
                oTable.fnDraw();
                $(this).html("切换二级人数");
                $("#line-statistics thead tr th:last-child").html("一级人数");
            }
        })
    }
});

