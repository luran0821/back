// 获取图片上传id
import {getCookie} from './get-cookie.js';
import {path} from './configuration.js';
let pathurl = path();
let token = getCookie("token");
let id;
function obtainimgId (ajaxurl,callback) {
    $.ajax({
        type: "get",
        url: pathurl+"newID",
        dataType: "json",
        data: {
            token:token
        },
        success: function (data) {
            if (data.code === 200) {
                callback(data.data.id);
                // console.log(data.DATA.id);
            } else {
                alert(data.msg);
            }
        },
        error:function (data) {
            alert("获取图片上传id失败");
        }
    });
}
// obtainimgId(pathurl,callback);
export {obtainimgId};