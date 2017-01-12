import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
let pathurl = path();
let token = getCookie("token");
$(document).ready(function () {
    // console.log(GetQuery)
    function unix (nS) {
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1,                 //月份
                "d+": this.getDate(),                    //日
                "h+": this.getHours(),                   //小时
                "m+": this.getMinutes(),                 //分
                "s+": this.getSeconds(),                 //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds()             //毫秒
            };
            //console.log(o);
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }

            }
            return fmt;
        };
        return (new Date(parseInt(nS) * 1000)).Format("yyyy-MM-dd");
    }
    if($(".show").length!=0) {
        let length,arry;
        // array1.push("token","id");
        arry = {
            token:token,
            skip:0,
            limit:100
        }
        newajax(arry,"get","newsBoard", callback);
        function callback(data) {
            let datalist = data.data.data;
            length = data.data.data.length;
            for (let [index,v] of datalist.entries()) {
                let _index = index;
                $(".card .title").eq(index).html(v.nb_title);
                $(".card .date").eq(index).html(v.nb_publish_time);
                $(".card").eq(index).css({"background-image":"url(http://img0.imgtn.bdimg.com/it/u=734871889,913283513&fm=21&gp=0.jpg)" });
                $(".card").eq(index).attr("href","./announcement.html?id="+v._id);
            }
        }
    }
})

