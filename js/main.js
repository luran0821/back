//引入模块
var $ = require("./jquery.js");
require("./page/login.js");
import{getCookie} from './common/get-cookie.js';
import {path} from './common/configuration.js';
import{clearCache} from './common/clear-cache.js';
import{obtainimgId} from './common/obtain-imgId.js';
import {uploadimg} from './common/uploadimg.js';
import {unix2} from './common/unix.js';
// clearCache();
let pathurl = path();
let token = getCookie('token');
let bagId;
//页面加载完成后显示
$(function () {
    $("html").css({"display": 'block'});
});
if($(".index").length!=0){
    // 储存萌袋id
    function bagIdcallback(data) {
        bagId = data;
    }
    obtainimgId(pathurl,bagIdcallback);
}
// document.domain = "admin.lomocoin.com";
// alert(document.domain)
if($(".login").length==0) {
    //引入js文件
    require("./page/invite-code.js");
    require("./page/bag-statistics.js");
    require("./page/line-statistics.js");
    require("./page/Gross-statistics.js");
    require("./page/user-manage.js");
    require("./page/receive-lmc.js");
    require("./page/modify-password.js");
    require("./page/inquirie-bill.js");
    require("./page/bag-ranking.js");
    require("./page/inquiry-bag.js");
    require("./page/freeze-manage.js");
    require("./page/line-school.js");
    require("./page/bulletin-editor.js");
    require("./page/delete-bulletin.js");
    require("./page/white-list.js");
    require("./page/white-query.js");
    require("./page/manage-amb.js");
    require("./page/manage-inquiryamb.js");
    require("./page/regist-admin.js");
    require("./page/inquiry-amb.js");
    require("./page/spell-application.js");
    require("./page/system-module.js");
    require("./page/karakters.js");
    require("./page/show.js");
    require("./page/address-fence.js");
    require("./page/default-configuration.js");
    require("./page/fence-management.js");
    require("./page/lmc-reconciliation.js");
    require("./page/announcement.js");
    require("./page/flow-statement.js");
    require("./page/popup-announcement.js");
    require("./page/content-mod.js");
    require("./page/lmc-accounts.js");
    require("./page/red-accounts.js");
    require("./page/bag-activity.js");
    //右侧登录名称显示
    $(".navbar .dropdown .dropdown-menu li").eq(0).find("a").html(localStorage.user);
    // $(".title .col-lg-12 ul li").each(function () {
    //
    // })
    // alert($(".title .col-lg-12 ul li").length)
    //模块权限加载
    function rightlist () {
        //初始化,清空html
        $("#wrapper .navbar-default #side-menu").html("");
        $("#page-wrapper .title .col-lg-12 ul").html("");
        let [navlist,navlisttwo] = ["", ""];
        //获取到权限信息
        let access = JSON.parse(localStorage.access);
        let listuri;
        if (access&&access.length != 0) {
            // console.log(access)
            for (let [index,v] of access.entries()) {
                if (access[index].uri == "god") {
                    listuri = "###";
                } else {
                    listuri = access[index].uri;
                }
                // console.log(access[index].level)
                if (access[index].level == 1) {

                    navlist += `<li id="${ access[index].id }"><a href="${ listuri }" class="active"><i class="fa fa-fw"></i> ${ access[index].name }<span class="fa arrow"></span></a>
                    </li>`
                }

            }
            //左侧一级列表加载
            // console.log(navlist)
            $("#wrapper .navbar-default #side-menu").html(navlist);
            let menulist = $("#wrapper .navbar-default #side-menu li");
            let menulistnum = $("#wrapper .navbar-default #side-menu li").length;
            // console.log(menulist)
            for (let index = 0; index < menulistnum; index++) {
                for (let [ind,i] of access.entries()) {
                    if (menulist.eq(index).attr("id") == access[ind].pid) {
                        navlisttwo = menulist.eq(index).html();
                        navlisttwo += `<ul class="nav nav-second-level">
                                    <li><a href="${ access[ind].uri }" id="${ access[ind].id }" pid="${ access[ind].pid }">${ access[ind].name }</a></li>
                                    </ul>`;
                        //二级列表
                        menulist.eq(index).html(navlisttwo);
                        // console.log(navlisttwo)
                    }
                }
            }
            let level3 = [];
            let level3id;
            //通过判断头部标题和左侧列表是否匹配添加三级列表
            $("#side-menu li li a").each(function (i) {
                if($.trim($("#side-menu li li a").eq(i).html())==$.trim($("#page-wrapper .title .page-header").html())){
                    // console.log($(this).attr("id"))
                    level3id = $(this).attr("id");
                    level3ls();
                }

            })

            function level3ls() {
                for (let [ind,i] of access.entries()) {
                    if(access[ind].level==3&&access[ind].pid==level3id){
                        level3.push(access[ind]);
                    }
                }
                localStorage.setItem('level3',JSON.stringify(level3));
                level3 = [];
            }
            if(JSON.parse(localStorage.getItem('level3'))&&JSON.parse(localStorage.getItem('level3')).length!=0){
                let level3list = JSON.parse(localStorage.getItem('level3'));
                let level3html = "";
                // console.log(level3list)
                for (let [ind,i] of level3list.entries()) {
                    // level3html += level3list[ind];
                    level3html+=`<li><a href="${ level3list[ind].uri }">${ level3list[ind].name }</a></li>`
                }
                $("#page-wrapper .title .col-lg-12 ul").html(level3html);
            }

        } else {
            $("html").addClass("none");
            alert("权限错误");
            document.location = "../login.html"
        }
        //获取url后缀比较三级列表链接添加选中样式
        function pageName() {
            var strUrl=location.href;
            var arrUrl=strUrl.split("/");
            var strPage=arrUrl[arrUrl.length-1];
            var indexof = strPage.indexOf("?");
            if(indexof != -1){
                strPage = strPage.substr(0,strPage.indexOf("?"));
            }
            return strPage;
        }
        $("#page-wrapper .title .col-lg-12 ul li a").each(function (i) {
            if($("#page-wrapper .title .col-lg-12 ul li a").eq(i).attr("href")==pageName()){
               $(this).parent().addClass("active")
            }
        })
        $("#page-wrapper .title .col-lg-12 ul li").on("click",function () {
            localStorage.setItem('level3',localStorage.getItem('level4'));
        });

        if(pageName()=="index.html") {
            if ($(".title .col-lg-12 ul li").length != 0) {
                // document.location = $(".title .col-lg-12 ul li a").eq(0).attr("href");
                // console.log($(".title .col-lg-12 ul li a").eq(0).attr("href"))
                if ($(".title .col-lg-12 ul li a").eq(0).attr("href") != pageName()) {
                    document.location = $(".title .col-lg-12 ul li a").eq(0).attr("href");
                }
            }else {
                $("#side-menu li ul li a").each(function (i) {
                    if( $("#side-menu li ul li a").eq(i).attr("href")!="###"){
                        document.location = $("#side-menu li ul li a").eq(i).attr("href");
                    }
                })
            }
        }
    }

    rightlist();
    //限制输入框输入内容
    $(".index .center .top ul li").each(function (i) {
        if(i>0){
            $(".index .center .top ul li").eq(i).on("keypress",function () {
                onkeyPress();
            })
        }
    })
    function onkeyPress() {
        var keyCode = event.keyCode;
        if ((keyCode >= 48 && keyCode <= 57))
        {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    }

    $(function () {
        $("html").css({"display": 'block'});
        //地图要放在内容加载完毕后执行
        amap();
    });
    $(".dropdown-toggle").on("click", function () {
        $(this).siblings(".dropdown-menu").toggleClass('block');
    });
    //左侧列表展开隐藏
    var active = $('#side-menu li .active');
    active.on("click", function () {
        $(this).siblings('ul').slideToggle(300);
    });
    //选择时间插件调用
    var myDate = unix2(Date.parse(new Date())/1000);
    $('.time .datetimepicker_mask').datetimepicker({
        lang: 'ch',
        timepicker: true
        // format: 'Y/m/d H:m',
        // formatDate: 'Y/m/d H:m'
    });
    $('.bulletin-editor .time .datetimepicker_bulletin1,.bulletin-editor .time .datetimepicker_bulletin2').datetimepicker({
        lang: 'ch',
        timepicker: true
        // format: 'Y/m/d H:m',
        // formatDate: 'Y/m/d H:m'
    });
    $('.inquiry-amb .picker_inquiryAmb1').datetimepicker({
        lang: 'ch',
        timepicker: true,
        // format: 'Y/m/d H:m',
        // formatDate: 'Y/m/d H:m'
        value: "2016/03/01 11:00"
    });
    $('.inquiry-amb .picker_inquiryAmb2').datetimepicker({
        lang: 'ch',
        timepicker: true,
        // format: 'Y/m/d H:m',
        // formatDate: 'Y/m/d H:m'
        value: myDate
    });
    $('.lmc-reconciliation .picker_inquiryAmb1,.flow-statement .picker_inquiryAmb1').datetimepicker({
        lang:"ch",
        // format: 'Y/m/d H:m:s',
        timepicker:true,
        value: "2016/03/01 11:00"
    });
    $('.lmc-reconciliation .picker_inquiryAmb2,.flow-statement .picker_inquiryAmb2').datetimepicker({
        lang:"ch",
        timepicker:true,
        value: myDate
    });
    $('.Gross-statistics .picker_gross1').datetimepicker({
        lang: 'ch',
        timepicker: false,
        value: "2016/03/01 11:00"
    });
    $('.Gross-statistics .picker_gross2').datetimepicker({
        lang: 'ch',
        timepicker: false,
        value: myDate
    });
    $('.lmc-accounts .picker_inquiryAmb1').datetimepicker({
        lang: 'ch',
        timepicker: true,
        value: "2016/10/01 00:00"
    });
    $('.lmc-accounts .picker_inquiryAmb2').datetimepicker({
        lang: 'ch',
        timepicker: false,
        value: myDate
    });
    $('.red-accounts .picker_inquiryAmb1').datetimepicker({
        lang: 'ch',
        timepicker: true,
        value: "2016/10/01 00:00"
    });
    $('.red-accounts .picker_inquiryAmb2').datetimepicker({
        lang: 'ch',
        timepicker: false,
        value: myDate
    });
    let imguri = [];
    //地图接口调用
    let mypos = [];
    let posadd = [];
    let posadddetail = [];
    function amap() {
        //地图初始化
        let map = new AMap.Map('map', {
            zoom: 11,
            doubleClickZoom: false,
            center: [116.39, 39.9]
        });
        //输入提示

        AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){//回调函数
            //实例化Autocomplete,PlaceSearch
            var autoOptions = {
                city: "", //城市，默认全国
                input: "tipinput"
            };
            var auto = new AMap.Autocomplete(autoOptions);
            var placeSearch = new AMap.PlaceSearch({
                map: map
            });  //构造地点查询类
            AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
            function select(e) {
                placeSearch.search(e.poi.name);  //关键字查询查询
            }
        })
        function regeocoder(lnglatXY) {  //逆地理编码
            AMap.service('AMap.Geocoder', function () {//回调函数
                var geocoder = new AMap.Geocoder({
                    extensions: "all"
                });
                geocoder.getAddress(lnglatXY, function (status, result) {
                    console.log(result)
                    if(result.info === 'OK'){

                    }else {
                        alert("这太他妈偏了,换个地方");
                        return;
                    }
                    if (status === 'complete' && result.info === 'OK') {
                        geocoder_CallBack(result);
                        mypos.push(lnglatXY[0] + "," + lnglatXY[1]);
                        //alert(mypos);
                        new AMap.Marker({
                            map: map,
                            position: [lnglatXY[0], lnglatXY[1]],
                            icon: new AMap.Icon({
                                size: new AMap.Size(30, 30),  //图标大小
                                image: "../img/30.png",
                                imageOffset: new AMap.Pixel(0, 0)
                            })
                        });
                    }
                });
            });
        }
        function geocoder_CallBack(data) {
            var address = data.regeocode.formattedAddress; //返回地址描述
            let detail = [];
            detail.push(data.regeocode.addressComponent.province + data.regeocode.addressComponent.city);
            detail.push(data.regeocode.addressComponent.district);
            detail.push(data.regeocode.addressComponent.township);
            detail.push(data.regeocode.addressComponent.street + data.regeocode.addressComponent.streetNumber);
            posadd.push(address);
            posadddetail.push(detail);
            console.log(detail);
        }

        //地图点击事件
        function clickmap() {
            let clickEventListener = map.on('click', function (e) {
                regeocoder([e.lnglat.getLng(), e.lnglat.getLat()]);

            });
        }
        let fromefille,imgFile;
        $('.addimg .fromfile').on("change", function () {
            imgFile = this;
            var pattern = /(\.*.jpg$)|(\.*.png$)/;
            if (!pattern.test(imgFile.value)) {
                alert("系统仅支持jpg/png格式的照片！");
            } else {
                var reader = new FileReader();
                reader.readAsDataURL(imgFile.files[0]);
                reader.onload = function (e) {
                    // fromefille = e.target.result;
                    // console.log(e.target.result);
                    toUpdate(e.target.result);
                };
            }
        });

        function toUpdate(fromefille){
            uploadimg(bagId,"bag",fromefille,upimgback);
            function upimgback(data) {
                let bgimg =  $(imgFile).parent().prev(".i-plus").find(".bgimg");
                bgimg.css({"background-image": "url("+data+")"});
                bgimg.attr({"imgsrc": data});
                bgimg.addClass("bgwhite");
            }
        }
        $('.index .top .btn-group').on('click', function () {
            let $input = $('.index .top').find(" >div>ul>li input");
            console.log($input.eq(0).val());
            if ($input.eq(0).val() == "" || $input.eq(1).val() == "" || $input.eq(2).val() == "" || $input.eq(3).val() == "") {
                alert("请将信息填写完整")
            } else {
                clickmap();
            }
        });
        $(".index .preserved").on("click", function () {
            if (mypos != "") {
                imguri = [];
                let bgImgurl = $(".index .addimg .bgwhite");
                bgImgurl.each(function (i) {
                    let imgSrc = bgImgurl.eq(i).attr("imgsrc");
                    // let imgSrc = bgImgurl.eq(i).css("background-image");
                     //imgSrc = imgSrc.slice(5,imgSrc.length-2);
                    //imgSrc = imgSrc.substring(imgSrc.indexOf("(")+1,imgSrc.indexOf(")"));
                    // imgSrc = imgSrc.replace("url(","").replace(")","");
                    // console.log(imgSrc);
                    imguri.push(imgSrc);
                });
                bagCreate();
            } else {
                alert("请选择放置地点");
            }
        });
    }

//确定发布萌袋
    function bagCreate() {
        let type = 1;
        let title, limit, coins, end, subtitle;
        let $input = $(".index .top>div>ul>li input");
        // console.log($input);
        if ($input.eq(0).val() != "" && $input.eq(1).val() != "" && $input.eq(2).val() != "" && $input.eq(3).val() != "") {
            title = $input.eq(0).val();
            limit = $input.eq(2).val();
            coins = $input.eq(1).val();
            // new Date($(".time input").val()).getTime()
            end = $input.eq(3).val()*24*60*60+Date.parse(new Date())/1000;
            console.log(end);
        }
        // console.log(imguri);
        subtitle = $(".textarea textarea ").val();
        $.ajax({
            type: "post",
            url: pathurl + "bag",
            dataType: "json",
            data: {
                token: token,
                group_id: bagId,
                type: type,
                title: title,
                limit: limit,
                coins: coins,
                end: end,
                pos: mypos,
                subtitle: subtitle,
                imgs: imguri,
                add: posadd,
                adddetail: posadddetail
            },
            success: function (data) {
                if (data.code === 1) {
                    alert("发布成功");
                    location.reload([true]);
                    // $(".index .maker").removeClass("none");
                } else {
                    if (data.msg == "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(data.msg);
                    }
                }
            },
            error:function () {
                alert("上传错误")
            }
        });
    }
    $(".index .maker .btn").on("click",function () {
        $(this).parents("maker").addClass("none");
        location.reload([true]);
    })

}