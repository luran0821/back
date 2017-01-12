import {path} from '../common/configuration.js';
import{obtainimgId} from '../common/obtain-imgId.js';
let  ajaxurl = path();
if($(".login").length==1) {
    function login($username, $password) {
        $.ajax({
            type: "POST",
            url: ajaxurl + "login",
            dataType: "json",
            data: {
                user: $username,
                pass: $password
            },
            success: function (data) {
                if (data.code === 200) {
                    localStorage.user = $username;
                    document.cookie = "token=" + data.data._id;
                    var objStr = JSON.stringify(data.data.tk_val.access);
                    localStorage.access = objStr;
                    console.log(objStr)
                    // return;
                    document.location = "./html/index.html"
                } else {
                    if (data.msg == "TOKEN无效") {
                        document.location = "./login.html"
                        //alert(data.MSG);
                    } else {
                        alert(data.msg);
                    }
                }
            },
            error: function (data) {
                alert("网络错误")
            }
        });
    }

    $(".login .panel-body .btn").on("click", function () {
        let $username = $(".login .user").val();
        let $password = $(".login .pass").val();
        login($username, $password);
    });
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            let $username = $(".login .user").val();
            let $password = $(".login .pass").val();
            login($username, $password);
        }
    };
}