import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {uploadimg} from '../common/uploadimg.js';
import {obtainimgId} from '../common/obtain-imgId.js';
let pathurl = path();
let token = getCookie("token");
let upId;
if($(".content-mod").length!=0) {

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
            $(imgFile).siblings(".bgimg").attr("imgsrc",data)
            $(imgFile).siblings(".bgimg").css({"background-image":"url("+data+")"})
        }
    }
    let isdefined = true;
    function isempty() {
        let bag_img = false;
        if($(".bag-icon .bgimg").attr("imgsrc")==undefined){
            alert("请上传萌袋图标");
            return isdefined = false;
        }
        $(".bag-img .bgimg").each(function (i) {
            if($(".bag-img .bgimg").eq(i).attr("imgsrc")!=undefined){
                return bag_img = true;
            }
        })
        console.log(bag_img);
        if(!bag_img){
            alert("请上传萌袋图片");
            return isdefined = false;
        }
        if($(".center .title").val()==""){
            alert("输入萌袋文字");
            return isdefined = false;
        }
        if($(".center .href").eq(0).val()!=""){
            if(!isURL($(".center .href").eq(0).val())){
                alert("请输入正确的图片超链");
                return isdefined = false;
            }
        }
        if($(".center .href").eq(1).val()!=""){
            if(!isURL($(".center .href").eq(1).val())){
                alert("请输入正确的文字超链");
                return isdefined = false;
            }
        }
        return isdefined;
    }
    $(".btn-default").on("click",function () {
        console.log(isempty())
        if(isempty()){
            let list = {};
            let imgs = [];
            let uimg = $(".bag-icon .bgimg").attr("imgsrc");
            let subtitle = $(".center .title").val();
            let subtitle_src,uimg_src;
            $(".bag-img .bgimg").each(function (i) {
                if($(".bag-img .bgimg").eq(i).attr("imgsrc")!=undefined){
                    imgs.push($(".bag-img .bgimg").eq(i).attr("imgsrc"));
                }
            })
            if($(".center .href").eq(0).val()!=""&&$(".center .href").eq(1).val()!=""){
                uimg_src = $(".center .href").eq(0).val();
                subtitle_src = $(".center .href").eq(1).val();
                list = {
                    token:token,
                    imgs:imgs,
                    uimg:uimg,
                    subtitle:subtitle,
                    uimg_src:uimg_src,
                    subtitle_src:subtitle_src
                };
            }else if($(".center .href").eq(0).val()!=""){
                uimg_src = $(".center .href").eq(0).val();
                list = {
                    token:token,
                    imgs:imgs,
                    uimg:uimg,
                    subtitle:subtitle,
                    uimg_src:uimg_src
                };
            }else if($(".center .href").eq(1).val()!=""){
                subtitle_src = $(".center .href").eq(1).val();
                list = {
                    token:token,
                    imgs:imgs,
                    uimg:uimg,
                    subtitle:subtitle,
                    subtitle_src:subtitle_src
                };
            }else {
                list = {
                    token:token,
                    imgs:imgs,
                    uimg:uimg,
                    subtitle:subtitle
                };
            }
            newajax(list,"post","bagDefault",callback);
        }
    })
    function callback(data) {
        console.log(data);
        alert("提交成功");
        // location.reload([true]);
    }
}