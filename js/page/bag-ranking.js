import {getCookie} from '../common/get-cookie.js';
import {unix} from '../common/unix.js';
import {newajax} from '../common/ajax.js';
$(document).ready(function () {
    // 表格配置
    if($(".bag-ranking").length!=0) {
        let inquiriebill = $('.bag-ranking #table-ranking');
        let token = getCookie("token");
        let DATA = [];
        let title, balance_lmc, total_lmc, join_num, total_num, start, end, pos, user_id;
        let table = inquiriebill.dataTable({
            "order": [[2, "desc"]]
        });
        inquiriebill.css("width", "100%");
        // 接口调用，传入参数
        let array1;
        array1 = {
            "token":token,
            "skip":0,
            "limit":100
        }
        newajax(array1, "get" , "bag/balance/hot", bgRank);// 键值对数组（ajax参数），接口后缀，成功请求回调
        function bgRank(data) {
            // console.log(data.data)
            table.fnDestroy();
            [DATA, title, balance_lmc, total_lmc, join_num, total_num, start, end, pos, user_id] = [[], [], [], [], [], [], [], [], [], []];
            for (let [index,v] of data.data.entries()) {
                title.push(v.b_title);
                // console.log(v.title)
                balance_lmc.push(v.b_balance);
                total_lmc.push(v.b_coins);
                join_num.push(v.b_join);
                total_num.push(v.b_limit);
                start.push(unix(v.b_time));
                end.push(unix(v.b_end));
                pos.push(v.b_pos);
                user_id.push(v.b_uid)
            }
            DATA.push(user_id, title, balance_lmc, total_lmc, join_num, total_num, start, end, pos);
            var Text = doT.template($("#dotpl-ranking").text());
            $(".bag-ranking #table-ranking tbody").html(Text(DATA));
            inquiriebill.dataTable({
                "order": [[2, "desc"]],
                "iDisplayLength": 100
            });
        }
    }
});



