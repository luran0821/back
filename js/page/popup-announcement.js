import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {uploadimg} from '../common/uploadimg.js';
import {obtainimgId} from '../common/obtain-imgId.js';
let pathurl = path();
let token = getCookie("token");
let upId;
if($(".popup-announ").length!=0) {

    function isURL(str_url) {// 验证url
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN（域名）
            + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // 端口- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re = new RegExp(strRegex);
        return re.test(str_url);
    }

    // 储存萌袋id
    function bagIdcallback(data) {
        upId = data;
    }
    obtainimgId(pathurl,bagIdcallback);
    let imgFile;
    $('.fromfile').on("change", function () {
        imgFile = this;
        var pattern = /(\.*.jpg$)|(\.*.png$)/;
        if (!pattern.test(imgFile.value)) {
            alert("系统仅支持jpg/png格式的照片！");
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(imgFile.files[0]);
            reader.onload = function (e) {
                toUpdate(e.target.result);
            };
        }
    });

    function toUpdate(fromefille) {
        uploadimg(upId, "popup", fromefille, upimgback);
        function upimgback(data) {
            $(imgFile).siblings(".bgimg").attr("imgsrc",data);
            $(imgFile).siblings(".bgimg").css({"background-image":"url("+data+")"})
        }
    }

    $(".runto select").on("change",function () {
        if($(this).val()!=1){
            $(this).siblings("input").addClass("none")
        }else {
            $(this).siblings("input").removeClass("none")
        }
    })
    let isdefined  = true;
    function isempty() {
        if($(".bgimg").attr("imgsrc")==undefined){
            alert("请上传图片");
            return isdefined = false;
        }
        if($("textarea.isempty").val()==""){
            alert("请将填写公告文字");
            return isdefined = false;
        }
        if(isNaN($("input.isempty").val())||$("input.isempty").val()==""){
            alert("推送天数请填写整数");
            return isdefined = false;
        }
        if($(".runto input").hasClass("none")==false&&$(".runto input").val()==""){
            alert("请填写链接");
            return isdefined = false;
        }else {
            if (!isURL($(".runto input").val())){
                alert("请填写正确格式的链接");
                return isdefined = false;
            }
        }
        return isdefined;
    }
    
    $(".btn-default").on("click",function () {
        if(isempty()){
            let title = $(".center .title").val();
            let img = $(".bgimg").attr("imgsrc");
            let days_num = $(".days_num").val();
            let type = $(".runto select").val();
            let clicksrc;
            let list = {};
            if($(".runto select").val()==1){
                clicksrc = $(".runto input").val();
                list = {
                    token:token,
                    title:title,
                    img:img,
                    click_type:type,
                    click_src:clicksrc,
                    push_days_num:days_num
                }
            }else{
                list = {
                    title:title,
                    img:img,
                    click_type:type,
                    push_days_num:days_num
                }
            }
            newajax(list,"post","appBannersNewsDefault",callback)
        }
    })
    function callback(data) {
        console.log(data);
        alert("提交成功");
        location.reload([true]);
    }
}