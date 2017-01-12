import {getCookie} from '../common/get-cookie.js';
import {path} from '../common/configuration.js';
let pathurl = path();
let token = getCookie('token');
var echarts = require('echarts');
$(document).ready(function () {
    if($(".receive-lmc").length!=0) {
        let tablereceive = $('#table-receive');
        tablereceive.css("width", "100%");
        let receiveuser, u_balance, u_id, u_username, u_index, DATA, arraycut_arrayend;
        function receiveajax(ajaxurl) {
            $.ajax({
                type: "get",
                url: ajaxurl + "statistical/user/coins",
                dataType: "json",
                data: {
                    token: token,
                    skip: 0,
                    limit: 1
                },
                success: function (data) {
                    //console.log(data);
                    if (data.code === 200) {
                        receiveuser = data.data.list[0].user_coin_list;
                        u_balance = [];
                        u_id = [];
                        u_username = [];
                        u_index = [];
                        for (let [index,v] of receiveuser.entries()) {
                            //console.log(v.us_uid);
                            u_balance.push(v.u_balance);
                            u_id.push(v.u_id);
                            u_username.push(v.u_nickname);
                            u_index.push(index + 1);
                        }
                        DATA = {
                            u_balance: u_balance,
                            u_id: u_id,
                            u_username: u_username,
                            u_index: u_index
                        };
                        //console.log(u_balance);
                        var objarray = DATA.u_balance;
                        var arraynum = 10;
                        arraycut_arrayend = arraycut(objarray, arraynum);
                        //console.log(arraycut_arrayend)
                        try {
                            myChart_echarts();
                        } catch (e) {

                        }
                        var Text = doT.template($("#dotpl-receive").text());
                        $("#table-receive tbody").html(Text(DATA));
                        tablereceive.dataTable({
                            "iDisplayLength": 100
                        });
                    } else {
                        if (data.msg == "TOKEN无效") {
                            document.location = "../login.html"
                        }else {
                            alert(data.msg);
                        }
                    }
                },
                error:function (data) {
                    alert("网络错误")
                }
            });
        }

        receiveajax(pathurl);

        function arraycut(objarray, arraynum) {
            var array = objarray;
            var num = arraynum;
            var portion = array[0] / num;
            var arrayfisrt = array[0] + portion;
            var array1 = [];
            var array_interval = [];
            for (var i = 0; i <= num - 1; i++) {
                $("<li></li>").appendTo($(".arraycut_interval"));
                $("<li></li>").appendTo($(".arraycut_value"));
                array_interval.push(Math.ceil(arrayfisrt - portion) + "-" + Math.ceil(arrayfisrt - portion - portion));
                $(".arraycut_interval li").eq(i).html(array_interval[i]);
                $("#table-arraycut thead tr th").eq(i).html(array_interval[i]);
                arrayfisrt = arrayfisrt - portion;
                for (var c = 0; c <= num; c++) {
                    if (i == c) {
                        var arraylength = "";
                        var length = 0;
                        for (var b = 0; b <= array.length; b++) {
                            if (array[b] > Math.ceil(arrayfisrt - portion)) {
                                length++;
                            }
                        }
                        arraylength = length;
                        array1.push(arraylength);
                    }
                }
            }
            if (num <= 6) {
                $(".arraycut_interval li,.arraycut_value li").css({width: (100 / 6) + "%"})
            } else {
                $(".arraycut_interval li,.arraycut_value li").css({width: (100 / num) + "%"})
            }
            var array2 = [];
            for (var g = 0; g <= array1.length; g++) {
                if (g == 0) {
                    array2.push(array1[g]);
                }
                if (g <= array1.length - 2) {
                    array2.push(array1[g + 1] - array1[g]);
                }
            }
            $(".arraycut_interval li").each(function (i) {
                $(".arraycut_value li").eq(i).html(array2[i]);
                $("#table-arraycut tbody tr td").eq(i).html(array2[i]);
            });
            var arraycut_array = [];
            arraycut_array.push(array_interval, array2);
            return arraycut_array;
        }

        var myChart_echarts = function () {
            // 初始化echarts实例
            var main_echarts = document.getElementById('main_echarts');
            var myChart = echarts.init(main_echarts);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: ' '
                },
                tooltip: {
                    showContent: true,
                    alwaysShowContent: true
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    },
                    right: "12%"
                },
                legend: {
                    data: ['持币量']
                },
                xAxis: {
                    data: arraycut_arrayend[0]
                },
                yAxis: {},
                series: [{
                    name: '持币量',
                    type: 'bar',
                    data: arraycut_arrayend[1]
                }]
            };
            myChart.setOption(option);
            window.onresize = myChart.resize;
        };
    }
});
