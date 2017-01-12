import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
$(document).ready(function () {
    let token = getCookie("token");
    $(".manage-amb .btn-pull").on("click",function () {
        let uid = $(".manage-amb .searchuid input").val();
        let reason = $(".manage-amb .textarea textarea").val();
        if(uid!=""){
            let array;
            array ={
                "token":token,
                "uid":uid,
                "campus_ambassador":"true",
                "ca_reason":reason,
            }
            newajax(array, 'post', "user/tag", callback)
        }else {
            alert("请填写uid");
        }

    })
    function callback(data) {
        alert("添加成功");
        $(".manage-amb .searchuid input").val("");
        $(".manage-amb .textarea textarea").val("");
    }
})