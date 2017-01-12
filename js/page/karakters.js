import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
if($(".karakters").length==1) {
    let token = getCookie("token");
    function isEmptyObject(e) {
        var t;
        for (t in e)
            return !1;
        return !0
    }
    $(".karakters .addModule").on("click",function () {
        let date;
        let sys_modules = [];
        if($(this).siblings("input").val()!=""){
            console.log($(this).siblings("select").val()!="");
            let group_name = $(this).siblings(".moduleInformation").val();
            if($(".karakters .module ul li .fa-check").length!=0) {
                $(".karakters .module ul li .fa-check").each(function (i) {
                    sys_modules.push($(".karakters .module ul li .fa-check").eq(i).attr("id"));
                })
                // console.log(sys_modules);
                if ($(this).siblings("select").val() != "") {
                    let pid = $(this).siblings("select").val();
                    date = {
                        "token":token,
                        "group_name":group_name,
                        "pid":pid,
                        "sys_modules":sys_modules
                    }
                } else {
                    date = {
                        "token":token,
                        "group_name":group_name,
                        "pid":"god",
                        "sys_modules":sys_modules
                    }
                }
                    newajax(date, "post", "access/userGroup", addback);
            } else {
                alert("请选择对应权限");
            }
        }else {
            alert("请填写用户名称");
        }
    })
    function addback(data) {
        // console.log(data);
        alert("添加成功");
        $(".karakters .addModule").siblings(".moduleInformation").val("");
        // syslist();
        userlist();
        $(".karakters .module ul li p").each(function (i) {
            $(".karakters .module ul li p").eq(i).removeClass("fa-check")
        })
    }
    let moduleulhtml='';
    let list = {
        "token":token
    }
    let [modulesid,moduleslist,modulestitle,modulespid,moduleslevel] = [[],[],[],[],[]];
    function syslist() {
        [modulesid,moduleslist,modulestitle,modulespid,moduleslevel] = [[],[],[],[],[]];
        moduleulhtml='';
        newajax(list,"get","access/systemModules", listback);
        function listback(data) {
            if(!isEmptyObject(data.data)) {
                for (let [index,v] of data.data.entries()) {
                    modulesid.push(v.id);
                    moduleslist.push(v.name);
                    modulestitle.push(v.title);
                    modulespid.push(v.pid);
                    moduleslevel.push(v.level)
                }
                for (let [index,v] of modulesid.entries()) {
                    moduleulhtml += "<li><p level='"+moduleslevel[index]+"' pid='"+modulespid[index]+"' id='" + modulesid[index] + "' class='fa'></p><div>" + modulestitle[index] + "</div></li>"
                    $(".karakters .module ul").html(moduleulhtml);
                    $(".karakters .maker div").html(moduleulhtml+"<div class='btn btn-primary'>确定修改</div>");
                }
            }

        }
    }
    syslist();
    let [userid,usertitle,username] = [[],[],[]];
    let usermodules = [];
    let userls = {
        "token":token
    }
    function userlist() {
        [userid,usertitle,username,usermodules] = [[],[],[],[]];
        newajax(userls,"get","access/userGroup", userlsback);
    }
    function userlsback(data) {
        
        // console.log(data);
        console.log(isEmptyObject(data.data));
        if(!isEmptyObject(data.data)) {
            for (let [index,v] of data.data.entries()) {
                userid.push(v.id);
                usertitle.push(v.title);
                username.push(v.name);
                usermodules.push(v.modules);
            }
            listli();
            addselect();
        }else {
            // alert("没有数据")
            listli();
            addselect();
        }
    }
    userlist();

    function listli() {
        let ulhtml= "";
        let phtml = "" ;
        // console.log(phtml)
        if(!isEmptyObject(usertitle)) {
            for (let [index,v] of usertitle.entries()) {
                // console.log(usermodules)
                for (let [ind,i] of usermodules[index].entries()) {
                    // console.log(usermodules[index][ind])
                    phtml += "<p> &nbsp&nbsp&nbsp" + usermodules[index][ind].sys_name+"</p>";
                }
                ulhtml += "<div><h4 class='first'>角色用户组:</h4><h4 id=" + userid[index] + " >" + username[index] + "&nbsp&nbsp&nbsp</h4> <h4 class='qx'>拥有权限:</h4>" + phtml +
                    "<div id = " + userid[index] + " class= 'btn btn-primary addqx'> 更改权限</div><div id=" + userid[index] + " class= 'btn btn-primary deleteModule'> 删除用户组</div></>";
                phtml = "";
            }
        }else {
            ulhtml= "";
        }
        $(".karakters .center .nav-second-level").html(ulhtml);
    }
    function addselect() {
        let optionhtml="<option value= ''> </option>";
        for (let [index,v] of usertitle.entries()) {
            optionhtml += "<option value='" + userid[index]  + "'>" + usertitle[index]+"</option>"
            // console.log( optionhtml);
        }
        $(".karakters .center select").each(function (i) {
            $(".karakters .center select").html(optionhtml);
        })
    }

    $(document).on("click",".karakters .module ul li p",function () {
        let pid = $(this).attr("pid");
        let id = $(this).attr("id");
        let level = $(this).attr("level");
        if(level=="1"||level=="2"){
            if($(this).hasClass("fa-check")){
                $(".karakters .module ul li p").each(function (i) {
                    if (id == $(".karakters .module ul li p").eq(i).attr("pid")) {
                        // alert(333)
                        $(".karakters .module ul li p").eq(i).removeClass("fa-check");
                        let level2id = $(".karakters .module ul li p").eq(i).attr("id");
                        // console.log(level2pid)
                        $(".karakters .module ul li p").each(function (i) {
                            if (level2id == $(".karakters .module ul li p").eq(i).attr("pid")) {
                                // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                                $(".karakters .module ul li p").eq(i).removeClass("fa-check");
                            }
                        });
                    }
                })
            }else {
                $(".karakters .module ul li p").each(function (i) {
                    if (id == $(".karakters .module ul li p").eq(i).attr("pid")) {
                        // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                        $(".karakters .module ul li p").eq(i).addClass("fa-check");
                        let level2id = $(".karakters .module ul li p").eq(i).attr("id");
                        // console.log(level2pid)
                        $(".karakters .module ul li p").each(function (i) {
                            if (level2id == $(".karakters .module ul li p").eq(i).attr("pid")) {
                                // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                                $(".karakters .module ul li p").eq(i).addClass("fa-check");
                            }
                        });
                    }
                })
            }
        }
        if(level=="2"||level=="3") {
            $(".karakters .module ul li p").each(function (i) {
                if (pid == $(".karakters .module ul li p").eq(i).attr("id")) {
                    // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                    $(".karakters .module ul li p").eq(i).addClass("fa-check");
                    let level2pid = $(".karakters .module ul li p").eq(i).attr("pid");
                    // console.log(level2pid)
                    $(".karakters .module ul li p").each(function (i) {
                        if (pid != "god" && level2pid == $(".karakters .module ul li p").eq(i).attr("id")) {
                            // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                            $(".karakters .module ul li p").eq(i).addClass("fa-check");
                        }
                    });
                }
            })
        }
        if($(this).hasClass("fa-check")){
            $(this).removeClass("fa-check");
        }else {
            $(this).addClass("fa-check");
        }
    })
    $(".karakters").on("click",".center .deleteModule",function () {
        let id = $(this).attr("id");
        let delet = {
            "token":token,
            "id":id
        }
        // console.log(delete2);
        newajax(delet, "post" , "access/userGroup/del", deleteback);
        function deleteback(data) {
            alert("删除成功");
            userlist();
        }
    });
    
    $(document).on("click",".karakters .addqx",function () {
        let id = $(this).attr("id");
        newajax(userls,"get","access/userGroup", makerback);
        $(".karakters .maker").removeClass("none");
        $(".karakters .maker .btn").attr("id",id)
        function makerback(data) {
            if(!isEmptyObject(data.data)) {
                for (let [index,v] of data.data.entries()) {
                    if(v.id==id){
                        for (let [ind,i] of v.modules.entries()) {
                            for (let b=0; b<$(".maker li p").length; b++) {
                                if($(".karakters .maker li p").eq(b).attr("id")==i.sys_id){
                                    $(".karakters .maker li p").eq(b).addClass("fa-check");
                                }
                            }
                        }
                    }

                }
            }else {
                $(".karakters .maker div").html("");
            }
        }
    });
    $(document).on("click", ".karakters .maker div", function () {
        return false
    })
    $(document).on("click", ".karakters .maker", function () {
        $(".karakters .maker").addClass("none");
        for (let b=0; b<$(".maker li p").length; b++) {
            $(".maker li p").eq(b).removeClass("fa-check");
        }
    })
    $(document).on("click",".karakters .maker li p",function () {
        let pid = $(this).attr("pid");
        let id = $(this).attr("id");
        let level = $(this).attr("level");
        if(level=="1"||level=="2"){
            if($(this).hasClass("fa-check")){
                $(".karakters .maker li p").each(function (i) {
                    if (id == $(".karakters .maker li p").eq(i).attr("pid")) {
                        // alert(333)
                        $(".karakters .maker li p").eq(i).removeClass("fa-check");
                        let level2id = $(".karakters .maker li p").eq(i).attr("id");
                        // console.log(level2pid)
                        $(".karakters .maker li p").each(function (i) {
                            if (level2id == $(".karakters .maker li p").eq(i).attr("pid")) {
                                // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                                $(".karakters .maker li p").eq(i).removeClass("fa-check");
                            }
                        });
                    }
                })
            }else {
                $(".karakters .maker li p").each(function (i) {
                    if (id == $(".karakters .maker li p").eq(i).attr("pid")) {
                        // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                        $(".karakters .maker li p").eq(i).addClass("fa-check");
                        let level2id = $(".karakters .maker li p").eq(i).attr("id");
                        // console.log(level2pid)
                        $(".karakters .maker li p").each(function (i) {
                            if (level2id == $(".karakters .maker li p").eq(i).attr("pid")) {
                                // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                                $(".karakters .maker li p").eq(i).addClass("fa-check");
                            }
                        });
                    }
                })
            }
        }
        if(level=="2"||level=="3") {
            $(".karakters .maker li p").each(function (i) {
                if (pid == $(".karakters .maker li p").eq(i).attr("id")) {
                    // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                    $(".karakters .maker li p").eq(i).addClass("fa-check");
                    let level2pid = $(".karakters .maker li p").eq(i).attr("pid");
                    // console.log(level2pid)
                    $(".karakters .maker li p").each(function (i) {
                        if (pid != "god" && level2pid == $(".karakters .maker li p").eq(i).attr("id")) {
                            // console.log($(".karakters .module ul li p").eq(i).siblings("div").html())
                            $(".karakters .maker li p").eq(i).addClass("fa-check");
                        }
                    });
                }
            })
        }
        if($(this).hasClass("fa-check")){
            $(this).removeClass("fa-check");
        }else {
            $(this).addClass("fa-check");
        }
    })
    $(document).on("click", ".karakters .maker .btn", function () {
        let list;
        let sys_mod = [];
        let id = $(this).attr("id");
        $(".karakters .maker li .fa-check").each(function (i) {
            sys_mod.push($(".karakters .maker li .fa-check").eq(i).attr("id"));
        })
        // console.log(sys_mod)
        list = {
            "token":token,
            "id":id,
            "sys_modules":sys_mod
        }
        newajax(list, "post" , "access/userGroup/save", ugupback);
        function ugupback(data) {
            alert("修改成功");
            // console.log(data);
            $(".karakters .maker").addClass("none");
            for (let b=0; b<$(".maker li p").length; b++) {
                $(".maker li p").eq(b).removeClass("fa-check");
            }
        }
    })
}