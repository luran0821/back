import {getCookie} from '../common/get-cookie.js';
import {path} from '../common/configuration.js';
let pathurl = path();
$(document).ready(function () {
    if($(".bag-statistics").length!=0) {
        let tatistics = $('#table-statistics');
        tatistics.css("width", "100%");
        let token = getCookie('token');
        let DATA = [];
        function bagstatisticsajax(ajaxurl) {
            $.ajax({
                type: "get",
                url: ajaxurl + "statistical/bag",
                dataType: "json",
                data: {
                    token: token,
                    skip: 0,
                    limit: 1
                },
                success: function (data) {
                    if (data.code === 200) {
                        let area = "全国";
                        let coin = parseFloat(data.data.list[0].bag_coin_sum).toLocaleString(); // 总发出lmc数量
                        let count = parseFloat(data.data.list[0].bag_count).toLocaleString();// 总发出萌袋数量
                        let balance = parseFloat(data.data.list[0].bag_balance_sum.toFixed(4)).toLocaleString();// 剩余lmc数量
                        let under = parseFloat((data.data.list[0].bag_coin_sum - data.data.list[0].bag_balance_sum).toFixed(4)).toLocaleString(); // 已领lmc
                        let balance_per = (data.data.list[0].bag_balance_sum.toFixed(4) / data.data.list[0].bag_coin_sum * 100).toFixed(2) + "%";
                        let under_per = ((data.data.list[0].bag_coin_sum - data.data.list[0].bag_balance_sum).toFixed(4) / data.data.list[0].bag_coin_sum * 100).toFixed(2) + "%";
                        DATA.push(area, count, coin, under, under_per, balance, balance_per);
                        let Text = doT.template($("#dotpl-statistics").text());
                        $("#table-statistics #tbody").html(Text(DATA));
                        tatistics.dataTable();
                    } else {
                        if (data.msg == "TOKEN无效") {
                            document.location = "../login.html"
                            //alert(data.MSG);
                        }else {
                            alert(data.msg);
                        }
                    }
                },
                error:function (data) {
                    alert(data.MSG)
                }
            });
        }
        bagstatisticsajax(pathurl)
    }
});
