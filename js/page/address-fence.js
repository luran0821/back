import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {uploadimg} from '../common/uploadimg.js';
import {obtainimgId} from '../common/obtain-imgId.js';
import {unix} from '../common/unix.js';
let pathurl = path();
let token = getCookie("token");
let upId;
let amap_icon = "http://upload-img.lomocoin.com/news-57bc2024ddc5de104a8b5646/14719468099921.png";
if($(".addressfance").length!=0){
    // 储存萌袋id
    function bagIdcallback(data) {
        upId = data;
    }
    obtainimgId(pathurl,bagIdcallback);

    // 获取事件列表
    let list = {
        "token":token,
        "id":1
    }
    newajax(list,"get","fenceMap/default",listback)
    function listback(data) {
        let listdata = data.data.fm_events;
        var json = [{
            fm_count : "1000",
            fm_event_id : "4",
            fm_img : "http://upload-img.lomocoin.com/news-57ab31d8ddc5de920e8b6220/14708372092250.jpeg",
            fm_max : "1",
            fm_min : "1",
            fm_tip : "沙河回复哈哈哈",
            fm_weight :  "100"
        },{
            fm_count : "100",
            fm_event_id : "1",
            fm_img : "http://upload-img.lomocoin.com/news-57ab31d8ddc5de920e8b6220/14708372092250.jpeg",
            fm_max : "234002",
            fm_min : "24234939",
            fm_tip : "lalalla",
            fm_weight :  "100"
        }]
        // listdata = json;
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

    // 添加事件按钮
    $(".add-new").on("click",function () {
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
            $(".eventlist .bs-docs-example:last").addClass("bs-docs-last")
            $(".eventlist .bs-docs-last .weight").val("");
            $(".eventlist .bs-docs-last .go-online").val("");
            $(".eventlist .bs-docs-last .notice>input").val("");
            $(".eventlist .bs-docs-last select").get(0).selectedIndex = 0;
            $(".eventlist .bs-docs-last .notice a input").removeAttr("imgsrc");
            $(".eventlist .bs-docs-last .notice a").removeClass("btn-success");
            $(".eventlist .bs-docs-last .notice a span").html("上传图片 ");
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
                uploadimg(upId,"fence",fromefille,imgsrc);
            };
        }
    })
    $(document).on("change",".glyphicon",function () {
        imgFile = this;
        var pattern = /(\.*.jpg$)|(\.*.png$)/;
        if (!pattern.test(imgFile.value)) {
            alert("系统仅支持jpg/png格式的照片！");
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(imgFile.files[0]);
            reader.onload = function (e) {
                fromefille = e.target.result;
                uploadimg(upId,"fence",fromefille,imgsrc2);
            };
        }
    })
    function imgsrc(data) {
        console.log(data);
        $(imgFile).attr("imgsrc",data);
        $(imgFile).parent().find("span").html("上传成功");
        $(imgFile).parent().addClass("btn-success");
        if($(imgFile).hasClass('glyphicon')){
            console.log($(imgFile).parents(".from1").find(".bgimg"))
            $(imgFile).parents(".from1").find(".bgimg").css({"background-image":"url("+data+")"})
        }
    }
    function imgsrc2(data) {
        amap_icon = data;
        $(imgFile).attr("imgsrc",data);
        $(imgFile).parent().find("span").html("上传成功");
        $(imgFile).parent().addClass("btn-success");
        if($(imgFile).hasClass('glyphicon')){
            console.log($(imgFile).parents(".from1").find(".bgimg"))
            $(imgFile).parents(".from1").find(".bgimg").css({"background-image":"url("+data+")"})
        }
    }
    let neceCond = function () {
        let isundefind = true;
        $(".commontips .tips .from-fence").each(function (i) {
            if($(".commontips .tips .from-fence").eq(i).val()==""){
                isundefind = false;
            }
        })
        $(".commontips .tips a input").each(function (i) {
            if($(".commontips .tips a input").eq(i).attr("imgsrc")==undefined){
                isundefind = false;
            }
        })
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
    let btnsucces = function () {
        let isundefind = true;
        $(".center .top .form-control").each(function (i) {
            if($(".center .top .form-control").eq(i).val()==""){
                isundefind = false;
                return isundefind;
            }
        })
        return isundefind;
    }

    //限制输入框输入内容
    $(".addressfance .center .top ul li").each(function (i) {
        if(i!=0){
            $(".addressfance .center .top ul li").eq(i).on("keypress",function () {
                onkeyPress();
            })
        }
    })
    $(".eventlist .bs-docs-example .top input").each(function (i) {
        $(".bs-docs-example .top input").eq(i).on("keypress",function () {
            onkeyPress();
        })
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
    let mypos = [];
    let posadd,posadddetail;
    function fanceamap() {
        // [posadddetail,mypos] = [[],[]];
        posadd = "";
        mypos = [];
        posadddetail = "";
        //地图初始化
        let map = new AMap.Map('fancemap', {
            zoom: 11,
            doubleClickZoom: false,
            center: [116.39, 39.9]
        });
        //输入提示
        AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {//回调函数
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
                    if (status === 'complete' && result.info === 'OK') {
                        geocoder_CallBack(result);
                    }
                });
            });
        }

        function geocoder_CallBack(data) {
            let detail = [];
            detail.push(data.regeocode.addressComponent.province + data.regeocode.addressComponent.city);
            detail.push(data.regeocode.addressComponent.district,data.regeocode.addressComponent.township);
            detail.push(data.regeocode.addressComponent.street + data.regeocode.addressComponent.streetNumber);
            posadd = data.regeocode.formattedAddress;
            posadddetail = detail;
            // console.log(detail);
        }

        //地图点击事件
        function clickmap() {
            AMap.event.addListener(map,"click", function (e) {
                mypos = [];
                mypos.push(e.lnglat.getLng(),e.lnglat.getLat());
                regeocoder([e.lnglat.getLng(), e.lnglat.getLat()]);
                var marker =  new AMap.Marker({
                    map: map,
                    position: [e.lnglat.getLng(), e.lnglat.getLat()],
                    icon: new AMap.Icon({
                        size: new AMap.Size(30, 30),  //图标大小
                        image: amap_icon,
                        imageOffset: new AMap.Pixel(0, 0)
                    })
                });
                AMap.event.addListener(map,"click", function (e) {
                    mypos = [];
                    mypos.push(e.lnglat.getLng(),e.lnglat.getLat());
                    regeocoder([e.lnglat.getLng(), e.lnglat.getLat()]);
                    marker.setMap(null);
                    console.log(mypos)
                })
            })
            // let clickEventListener = map.on('click', function (e) {
            //     mypos = [];
            //     mypos.push(e.lnglat.getLng(),e.lnglat.getLat());
            //     regeocoder([e.lnglat.getLng(), e.lnglat.getLat()]);
            //     var marker =  new AMap.Marker({
            //         map: map,
            //         position: [e.lnglat.getLng(), e.lnglat.getLat()],
            //         icon: new AMap.Icon({
            //             size: new AMap.Size(30, 30),  //图标大小
            //             image: "../img/30.png",
            //             imageOffset: new AMap.Pixel(0, 0)
            //         })
            //     });
            //     clickagain = map.on('click', function (e) {
            //         mypos = [];
            //         mypos.push(e.lnglat.getLng(),e.lnglat.getLat());
            //         regeocoder([e.lnglat.getLng(), e.lnglat.getLat()]);
            //         marker.setMap(null);
            //         console.log(mypos)
            //     })
            // });

        }
        let isclick = true;
        $(".center .top .btn-primary").on("click",function () {
            if(btnsucces()&&isclick){
                clickmap();
                isclick = false;
            }else {
                if(isclick){
                    alert("请将信息填写完整")
                }else {
                    alert("更改参数请刷新页面")
                }
            }
        })
    }
    fanceamap();
    
    function parameter() {
        let fm = [];
        let datajson = {};
        let parameter = {};
        $(".eventlist .bs-docs-example").each(function (i) {
            datajson.fm_event_id = $(".eventlist .bs-docs-example").eq(i).attr("val");
            if($(".eventlist .bs-docs-example .from-min").eq(i).val()!="") {
                datajson.fm_min = $(".eventlist .bs-docs-example .from-min").eq(i).val();
                datajson.fm_max = $(".eventlist .bs-docs-example .from-max").eq(i).val();
            }else {
                datajson.fm_min = 1;
                datajson.fm_max = 1;
            }
            if($(".eventlist .bs-docs-example .go-online").eq(i).val()!=""){
                datajson.fm_count = $(".eventlist .bs-docs-example .go-online").eq(i).val();
            }else {
                datajson.fm_count = 2;
            }
            datajson.fm_weight = $(".eventlist .bs-docs-example .weight").eq(i).val();
            datajson.fm_tip = $(".eventlist .bs-docs-example .notice>input").eq(i).val();
            datajson.fm_img = $(".eventlist .bs-docs-example .notice a input").eq(i).attr("imgsrc");
            fm.push(datajson);
            datajson = {};
        })
        let remarks = $(".center .top ul").eq(0).find("li").eq(0).find("input").val();
        let radius = $(".center .top ul").eq(0).find("li").eq(3).find("input").val();
        // let view_range = $(".center .top ul").eq(1).find("li").eq(0).find("input").val();
        let pos = mypos;
        let pos_address = posadd;
        let pos_img = amap_icon;
        let click_text = $(".commontips .tips li").eq(0).find("input").val();
        let click_img = $(".commontips .tips li").eq(0).find("a input").attr("imgsrc");
        let in_text = $(".commontips .tips li").eq(1).find("input").val();
        let in_img = $(".commontips .tips li").eq(1).find("a input").attr("imgsrc");
        let out_text = $(".commontips .tips li").eq(2).find("input").val();
        let out_img = $(".commontips .tips li").eq(2).find("a input").attr("imgsrc");
        let events = fm;
        let start_time = Date.parse(new Date($(".center .top ul").eq(0).find("li").eq(1).find("input").val()))/1000;
        let end_time = $(".center .top ul").eq(0).find("li").eq(2).find("input").val()*24*60*60+Date.parse(new Date())/1000;
        console.log(events)
        // alert(pos);
        return parameter = {
            token : token,
            group_id:upId,
            remarks : remarks,
            radius : radius,
            view_range : "1",
            pos : pos,
            pos_address : pos_address,
            pos_img : pos_img,
            click_text : click_text,
            click_img : click_img,
            in_text : in_text,
            in_img : in_img,
            out_text : out_text,
            out_img : out_img,
            events : events,
            start_time : start_time,
            end_time : end_time
        }
    }
    $(".reset").on("click",function () {
        console.log(parameter());
        // parameter();
        if(neceCond()){
            newajax(parameter(),"post","fenceMap",callback);
            function callback(data) {
                alert("成功");
                // location.reload([true]);
            }
        }else if(mypos.length=0) {
            alert("请选择放置位置");
        }else {
            alert("请将信息填写完整");
        }
    })
}