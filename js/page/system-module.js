import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
if($(".jurisdiction").length==1) {
    let token = getCookie("token");
    function isEmptyObject(e) {
        var t;
        for (t in e)
            return !1;
        return !0
    }
    $(".jurisdiction .addModule").on("click",function () {
        let list;
        if($(this).siblings("input").val()!=""){
            console.log($(this).siblings("select").val()!="");
            let modules_name = $(this).siblings(".moduleInformation").val();
            let uri = $(this).siblings(".modulePath").val();
            if($(this).siblings("select").val()!="") {
                let pid = $(this).siblings("select").val();
                list = {
                    "token":token,
                    "modules_name":modules_name,
                    "pid":pid,
                    "uri":uri
                }
            }else {
                list = {
                    "token":token,
                    "modules_name":modules_name,
                    "uri":uri
                }
            }
            newajax(list,"post","access/systemModules", addback);
        }else {
            alert("请填写模块名称");
        }
    })
    function addback(data) {
        console.log(data);
        alert("添加成功");
        $(".jurisdiction .addModule").siblings(".moduleInformation").val("");
        $(".jurisdiction .addModule").siblings(".modulePath").val("");
        syslist();
    }
    let list = {
        "token":token
    }
    let [modulesid,moduleslist,modulestitle] = [[],[],[]];
    function syslist() {
        [modulesid,moduleslist,modulestitle] = [[],[],[]];
        newajax(list,"get","access/systemModules", listback);
        function listback(data) {
            if(!isEmptyObject(data.data)) {
                for (let [index,v] of data.data.entries()) {
                    modulesid.push(v.id);
                    moduleslist.push(v.name);
                    modulestitle.push(v.title)
                }
                // console.log(modulesid);
                addselect();
                listli();
            }else {
                addselect();
                listli();
            }
        }
    }
    syslist();
    function addselect() {
        let optionhtml="<option value= ''> </option>";
        for (let [index,v] of modulesid.entries()) {
            optionhtml += "<option value='" + modulesid[index]  + "'>" + modulestitle[index]+"</option>"
            // console.log( optionhtml);
        }
        $(".jurisdiction .center select").each(function (i) {
            $(".jurisdiction .center select").html(optionhtml);
        })
    }
    function listli() {
        let ulhtml="";
        if(!isEmptyObject(modulestitle)) {
            for (let [index,v] of modulestitle.entries()) {
                ulhtml += "<li id=" + modulesid[index] + " >" + modulestitle[index] + "" +
                    "<div class= 'btn btn-primary deleteModule'> 删除模块</div></li>"
            }
        }else {
            ulhtml="";
        }
        $(".jurisdiction .center .nav-second-level").html(ulhtml);
    }

    $(".jurisdiction").on("click",".center .deleteModule",function () {
        let id = $(this).parent().attr("id");
        let delet = {
            'token':token,
            "id":id
        };
        newajax(delet,"post","access/systemModules/del", deleteback);
        function deleteback(data) {
            alert("删除成功");
            console.log(data);
            syslist();
        }
    })
}