import {getCookie} from '../common/get-cookie.js';
import {path} from '../common/configuration.js';
let pathurl = path();
$(".modify-password .btn").on("click",function(){
    let token = getCookie("token");
    let passValue = $(".modify-password .center ul li input");
    let oldPass,newPass,confirmPass;
    let value = ()=>{
        oldPass = passValue.eq(0).val();
        newPass = passValue.eq(1).val();
        confirmPass = passValue.eq(2).val();
        if(oldPass!=""&&newPass!=""&&confirmPass!=""&&newPass==confirmPass){
            posswordajax(pathurl);
        }else{
            alert("信息输入有误")
        }
    }
    value ();
    function posswordajax(ajaxurl) {
        $.ajax({
            type: "post",
            url: ajaxurl+"admin/pass/save",
            dataType: "json",
            data: {
                token: token,
                old_pass: oldPass,
                new_pass: newPass,
                confirm_pass: confirmPass
            },
            success: function (data) {
                if (data.code === 200) {
                    document.location = "../login.html"
                } else {
                    if (data.msg == "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(data.msg);
                    }
                }
            }
        });
    }
});