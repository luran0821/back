import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
$(document).ready(function () {
    let levelnum = 10;
    let uid;
    let btn = $(".line-school .center .top .btn");
    let token = getCookie("token");
    let [array,array1,array2]=[[],[],[]];
    btn.on("click",function(){
        uid = $(".line-school .center .top input").val();
        array = {
            "token":token,
            "uid":uid,
            "level_num":levelnum,
        };
        if(uid!=100001){
            newajax(array,'get',"statistical/infiniteJunior",lineSchool);
        }else {
            alert("不要乱查")
        }

    });
    function lineSchool (data){
        console.log(data.data);
        let [b,c] = [[], []];
        if(data.data.data){
            for (let [index,v] of data.data.data.entries()) {
                b.push(data.data.data[index].arrCount);
                if (index >= data.data.data.length - 1) {
                    if (index < 10) {
                        let d = 10 - index;
                        for (var j = 0; j < d - 1; j++) {
                            b.push(0);
                        }
                    }
                    b.push(data.data.totalCount);
                }
            }
        }else {
            alert("该用户没有跟班")
        }
        let Text = doT.template($("#dotpl-school").text());
        $(".line-school #table-school tbody").html(Text(b));
    }
});