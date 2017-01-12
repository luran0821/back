// 上传图片
import {getCookie} from './get-cookie.js';
import {obtainimgId} from './obtain-imgId.js';
import {path} from './configuration.js';
// let ImgeFile,imguri,bag_id;
let token = getCookie('token');
let ajaxurl = path();
//上传图片并转换为base64文件
function previewImage(imgFile,fromefille,callback,previewback) {
    var pattern = /(\.*.jpg$)|(\.*.png$)/;
    if (!pattern.test(imgFile.value)) {
        alert("系统仅支持jpg/png格式的照片！");
    } else {
        var path = void 0;
        path = URL.createObjectURL(imgFile.files[0]);
        var reader = new FileReader();
        reader.readAsDataURL(imgFile.files[0]);
        reader.onload = function (e) {
            fromefille = e.target.result;
            previewback(fromefille);
            obtainimgId(ajaxurl,callback);
            // console.log(e.target.result);
        };
    }
}
function uploadimg (bagId,prefix,fromefille,callback) {
    console.log(bagId)
    $.ajax({
        type: "POST",
        url: ajaxurl + "upload/base64Img",
        dataType: "json",
        data: {
            token:token,
            id:bagId,
            prefix:prefix,
            img:fromefille
        },
        success: function (data) {
            if (data.code === 200) {
                callback(data.data.uri);
                console.log(data)
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
export {previewImage,uploadimg};