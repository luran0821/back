import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {unix} from '../common/unix.js';
let token = getCookie("token");
let username,usergroupid,usergroupname,userpsd,phonenum,email,userpsd2;
$(document).ready(function () {
    if($(".regist-admin").length==1) {
        let moduleulhtml = '';
        let list ={
            "token":token
        }
        let [modulesid,moduleslist,modulestitle] = [[],[],[]];
        function syslist() {
            [modulesid,moduleslist,modulestitle] = [[],[],[]];
            moduleulhtml='';
            newajax(list,"get","access/userGroup", listback);
            function listback(data) {
                for (let [index,v] of data.data.entries()) {
                    modulesid.push(v.id);
                    moduleslist.push(v.name);
                    modulestitle.push(v.title);
                }
                for (let [index,v] of modulesid.entries()) {
                    moduleulhtml += "<option value='"+ modulesid[index] +"' modulename='"+moduleslist[index]+"'>"+modulestitle[index]+"</option>"
                    // moduleulhtml +="<li><p id='"+ modulesid[index] +"' class='fa'></p><div>"+modulestitle[index]+"</div></li>"
                    $(".regist-admin .usergroup select").html(moduleulhtml);
                }

            }
        }
        syslist();


        function isphone(inputString) {
            let partten = /^1[3,5,8]\d{9}$/;
            if (partten.test(inputString)) {
                //alert('是手机号码');
                return true;
            } else {
                alert('手机号格式错误');
                return false;
            }
        }

        function isemail(inputString) {
            // console.log(inputString)
            let pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            console.log(pattern.test(inputString));
            if (!pattern.test(inputString)) {
                alert("请输入正确的邮箱地址");
                return false;
            } else {
                return true;
            }
        }
        $(".regist-admin .btn-pull").on("click", function () {
            $(".regist-admin .content div input").each(function (i) {
                if ($(".regist-admin .content div input").eq(i).val() == "") {
                    alert("请将信息填写完整");
                    return false;
                } else {
                    username = $(".regist-admin .content .username input").val();
                    usergroupid = $(".regist-admin .content .usergroup select").val();
                    usergroupname = $(".regist-admin .content .usergroup select").find(" option:selected").attr("modulename");
                    userpsd = $(".regist-admin .content .userpsd input").val();
                    userpsd2 = $(".regist-admin .content .userpsd2 input").val();
                    phonenum = $(".regist-admin .content .phonenum input").val();
                    email = $(".regist-admin .content .useremail input").val();
                    if (userpsd.length < 6) {
                        alert("密码至少大于等于6位");
                        return false;
                    };
                    if (userpsd != userpsd2) {
                        alert("确认密码不对");
                        return false;
                    };
                    if(!isphone(phonenum)){
                        return false;
                    };
                    if(!isemail(email)){
                        return false;
                    };
                    // alert(3);
                    let list = {
                        "token":token,
                        "user_name":username,
                        "user_group_name":usergroupname,
                        "user_group_id":usergroupid,
                        "psd":userpsd,
                        "phone_num":phonenum,
                        "email":email,
                        "type":"1"
                    }
                    newajax(list,"post","admin", callback);
                    return false;
                }
            })
        })
        function callback(data) {
            $(".regist-admin .content .username input").val("");
            $(".regist-admin .content .userpsd input").val("");
            $(".regist-admin .content .userpsd2 input").val("");
            $(".regist-admin .content .phonenum input").val("");
            $(".regist-admin .content .useremail input").val("");
        }
    }
})