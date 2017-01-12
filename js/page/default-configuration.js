import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {uploadimg} from '../common/uploadimg.js';
import {obtainimgId} from '../common/obtain-imgId.js';
let token = getCookie("token");
let pathurl = path();
let upId;
if($(".defconf").length!=0){
    function bagIdcallback(data) {
        upId = data;
    }
    obtainimgId(pathurl,bagIdcallback);
    function onkeyPress() {
        var keyCode = event.keyCode;
        if ((keyCode >= 48 && keyCode <= 57))
        {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    }

    let fromefille,imgFile;
    $(document).on("change",".fromfile",function () {
        imgFile = this;
        var pattern = /(\.*.jpg$)|(\.*.png$)/;
        if (!pattern.test(imgFile.value)) {
            alert("系统仅支持jpg/png格式的照片！");
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(imgFile.files[0]);
            reader.onload = function (e) {
                fromefille = e.target.result;
                uploadimg(upId,"fence",fromefille,imgsrc)
            };
        }
    })
    function imgsrc(data) {
        console.log(data);
        $(imgFile).attr("imgsrc",data);
        $(imgFile).parent().find("span").html("上传成功");
        $(imgFile).parent().addClass("btn-success");
    }

    // 添加事件按钮
    $(".determine").on("click",function () {
        $(".eventlist").append($(".eventlist .bs-docs-example").eq(0).clone());
        cloneHandle();
        $(".eventlist .bs-docs-example .top input").each(function (i) {
            $(".bs-docs-example .top input").eq(i).on("keypress",function () {
                onkeyPress();
            })
        })
    })
    //clone或者删除之后处理函数
    function cloneHandle() {
        $(".eventlist .bs-docs-example").each(function (i) {
            if(i>0) {
                $(".eventlist .bs-docs-example").eq(i).removeClass("bs-docs-last");
                $(".eventlist .bs-docs-example").eq(i).find("h4").html("事件" + (i + 1));
                if ($(".eventlist .bs-docs-example").eq(i).find("select").val() == "not-happen") {
                    $(".eventlist .bs-docs-example").eq(i).find(".isthere").addClass("none");
                }
            }else {
                $(".eventlist .bs-docs-example").eq(i).find("h4").html("事件" + (i + 1));
                if ($(".eventlist .bs-docs-example").eq(i).find("select").val() == "not-happen") {
                    $(".eventlist .bs-docs-example").eq(i).find(".isthere").addClass("none");
                }
            }
        })
        if($(".eventlist .bs-docs-example").length>1) {
            $(".eventlist .bs-docs-example:last").addClass("bs-docs-last").siblings("div").removeClass("bs-docs-last");
            $(".eventlist .bs-docs-last .weight").val("");
            $(".eventlist .bs-docs-last .go-online").val("");
            $(".eventlist .bs-docs-last .notice>input").val("");
            $(".eventlist .bs-docs-last select").get(0).selectedIndex = 0;
            $(".eventlist .bs-docs-last .notice a input").removeAttr("imgsrc");
            $(".eventlist .bs-docs-last .notice a").removeClass("btn-success");
            $(".eventlist .bs-docs-last .notice a span").html("上传图片");
        }
    }
    cloneHandle();
    //更改选中事件
    $(document).on("change",".eventlist .bs-docs-example select",function () {
        selectHandle($(this));
    })
    //改变选中事件处理
    function selectHandle(_this) {
        if(_this.val()=="not-happen"||_this.val()=="opposite-sex"){
            _this.parents(".bs-docs-example").find(".isthere").addClass("none");
        }else {
            _this.parents(".bs-docs-example").find(".isthere").removeClass("none");
        }
        if(_this.val()=="not-happen"){
            _this.parents(".bs-docs-example").attr('val','4');
        }else if(_this.val()=="obtain-lmc"){
            _this.parents(".bs-docs-example").attr('val','1');
        }else if(_this.val()=="obtain-strength"){
            _this.parents(".bs-docs-example").attr('val','2');
        }else if(_this.val()=="opposite-sex"){
            _this.parents(".bs-docs-example").attr('val','3');
        }
    }

    //删除事件
    $(document).on('click',".fa-trash",function () {
        if($(".bs-docs-example").length>1) {
            $(this).parents(".bs-docs-example").remove();
            cloneHandle();
        }
    })

    let neceCond = function () {
        let isundefind = true;
        $(".eventlist .bs-docs-example .from-empty").each(function (i) {
            if($(".eventlist .bs-docs-example .from-empty").eq(i).hasClass("none")==false) {
                if ($(".eventlist .bs-docs-example .from-empty").eq(i).val() == "") {
                    isundefind = false;
                }
            }
        })
        $(".eventlist .bs-docs-example .notice a input").each(function (i) {
            if($(".eventlist .bs-docs-example .notice a input").eq(i).attr("imgsrc")==undefined){
                isundefind = false;
            }
        })
        return isundefind;
    }

    function parameter () {
        let datajson = {};
        let parameter = {};
        let fm = [];
        $(".eventlist .bs-docs-example").each(function (i) {
            datajson.fm_event_id = $(".eventlist .bs-docs-example").eq(i).attr("val");
            if($(".eventlist .bs-docs-example .from-min").eq(i).val()!="") {
                datajson.fm_min = $(".eventlist .bs-docs-example .from-min").eq(i).val();
                datajson.fm_max = $(".eventlist .bs-docs-example .from-max").eq(i).val();
            }else {
                datajson.fm_min = 1;
                datajson.fm_max = 1;
            }
            datajson.fm_weight = $(".eventlist .bs-docs-example .weight").eq(i).val();
            if($(".eventlist .bs-docs-example .go-online").eq(i).val()=='') {
                datajson.fm_count = -1;
            }else {
                datajson.fm_count = $(".eventlist .bs-docs-example .go-online").eq(i).val();
            }
            datajson.fm_tip = $(".eventlist .bs-docs-example .notice>input").eq(i).val();
            datajson.fm_img = $(".eventlist .bs-docs-example .notice a input").eq(i).attr("imgsrc");
            fm.push(datajson);
            datajson = {};
        })
        let events = fm;
        return parameter = {
            token : token,
            id : 1,
            events : events
        }
    }

    $(".reset").on("click",function () {
        console.log(parameter())
        if(neceCond()){
            newajax(parameter(),"post","fenceMap/default",parback)
            function parback(data) {
                alert("成功");
            }
        }else {
            alert("请将信息填写完整");
        }
    })


    // 获取事件列表
    let list = {
        "token":token,
        "id":1
    }
    newajax(list,"get","fenceMap/default",listback)
    function listback(data) {
        let listdata = data.data.fm_events;
        if((listdata.length-1)>0){
            for (let i=0; i<(listdata.length-1); i++){
                $(".determine").click();
            }
            for (let i=0; i<listdata.length; i++){
                console.log(listdata[i])
                for (let [index,v] of listdata.entries()){
                    $(".eventlist .bs-docs-example").eq(index).attr("val",v.fm_event_id);
                    $(".eventlist .bs-docs-example .weight").eq(index).val(v.fm_weight);
                    $(".eventlist .bs-docs-example .go-online").eq(index).val(v.fm_count);
                    $(".eventlist .bs-docs-example .notice>input").eq(index).val(v.fm_tip);
                    if(v.fm_event_id==4){
                        $(".eventlist .bs-docs-example select").eq(index).get(0).selectedIndex = 0;
                    }else {
                        $(".eventlist .bs-docs-example select").eq(index).get(0).selectedIndex = v.fm_event_id;
                    }
                    $(".eventlist .bs-docs-example .notice a input").eq(index).attr("imgsrc",v.fm_img);
                    $(".eventlist .bs-docs-example .notice a").eq(index).addClass("btn-success");
                    $(".eventlist .bs-docs-example .notice a").eq(index).find("span").html("上传成功");
                    if(v.fm_max!=1){
                        $(".eventlist .bs-docs-example").eq(index).find(".isthere").removeClass("none");
                        $(".eventlist .bs-docs-example .from-min").eq(index).val(v.fm_min);
                        $(".eventlist .bs-docs-example .from-max").eq(index).val(v.fm_max);
                    }
                }
            }
        }else if(listdata.length==1){
            for (let [index,v] of listdata.entries()){
                $(".eventlist .bs-docs-example").eq(index).attr("val",v.fm_event_id);
                $(".eventlist .bs-docs-example .weight").eq(index).val(v.fm_weight);
                $(".eventlist .bs-docs-example .go-online").eq(index).val(v.fm_count);
                $(".eventlist .bs-docs-example .notice>input").eq(index).val(v.fm_tip);
                if(v.fm_event_id==4){
                    $(".eventlist .bs-docs-example select").eq(index).get(0).selectedIndex = 0;
                }else {
                    $(".eventlist .bs-docs-example select").eq(index).get(0).selectedIndex = v.fm_event_id;
                }
                $(".eventlist .bs-docs-example .notice a input").eq(index).attr("imgsrc",v.fm_img);
                $(".eventlist .bs-docs-example .notice a").eq(index).addClass("btn-success");
                $(".eventlist .bs-docs-example .notice a").eq(index).find("span").html("上传成功");
            }
        }else {
            alert("没有数据");
        }

    }
}