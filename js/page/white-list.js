import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
$(document).ready(function () {
    let token = getCookie("token");
    let uid,access_reason;
    $(".white-list .btn-pull").on("click",function () {
        if($(".white-list .maker").hasClass("none")){
            $(".white-list .maker").removeClass("none");
        }
    })
    $(".white-list .btn-cancel").on("click",function () {
        if(!$(".white-list .maker").hasClass("none")){
            $(".white-list .maker").addClass("none");
        }
    })
    $(".white-list .checkbox div").on("click",function () {
        if($(this).find("p").hasClass("fa-check")){
            $(this).find("p").removeClass("fa-check");
        }else {
            $(this).find("p").addClass("fa-check");
        }
    })
    $(".white-list .btn-right").on("click",function () {
        let access=[]
        let list = {};
        if($(".white-list .searchuid input").val()!="") {
            $(".white-list .checkbox div p").each(function (i) {
                if ($(".checkbox div p").eq(i).hasClass("fa-check")) {
                    access.push($(".white-list .checkbox div p").eq(i).attr("value"));
                    // console.log($(".checkbox div p").eq(i).attr("value"))
                }
            })
            console.log(access)
            uid = $(".searchuid input").val();
            access_reason = $(".white-list .textarea textarea").val();
            if(access.length!=0) {
                list = {
                    "token":token,
                    "uid":uid,
                    "access":access,
                    "access_reason":access_reason
                }
                newajax(list, "post", "user/white", callback)
            }else {
                alert("请选择权限")
            }
        }else {
            alert("请输入uid")
        }
    })
    function callback(data) {
        // alert(data)
        if(data.code==200) {
            $(".white-list .maker").addClass("none");
            $(".white-list .btn-right").removeClass("none");
            $(".white-list .searchuid input").val("");
            $(".white-list .checkbox div p").each(function (i) {
                $(".white-list .checkbox div p").eq(i).removeClass("fa-check");
            })
            $(".white-list .textarea textarea").val("");
        }else {
            $(".white-list .maker").addClass("none");
        }
        // console.log(data)
    }
})