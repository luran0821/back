require("../jquery.datetimepicker.js");
import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {uploadimg} from '../common/uploadimg.js';
import {obtainimgId} from '../common/obtain-imgId.js';
//选择时间插件在main.js中调用
let pathurl = path();
let upId;
$(document).ready(function () {
    if($(".bulletin-editor").length!=0) {
        function bagIdcallback(data) {
            upId = data;
        }
        obtainimgId(pathurl,bagIdcallback);
        var ue = UE.getEditor('editor', {
            toolbars: [
                [
                    'source', //源代码
                    'undo', //撤销
                    'redo', //重做
                    'bold', //加粗
                    // 'indent', //首行缩进
                    // 'snapscreen', //截图
                    'italic', //斜体
                    'underline', //下划线
                    'strikethrough', //删除线
                    'subscript', //下标
                    'fontborder', //字符边框
                    // 'superscript', //上标
                    // 'formatmatch', //格式刷
                    // 'blockquote', //引用
                    // 'pasteplain', //纯文本粘贴模式
                    // 'selectall', //全选
                    // 'print', //打印
                    // 'preview', //预览
                    // 'horizontal', //分隔线
                    // 'removeformat', //清除格式
                    'time', //时间
                    'date', //日期
                    // 'unlink', //取消链接
                    // 'insertrow', //前插入行
                    // 'insertcol', //前插入列
                    // 'mergeright', //右合并单元格
                    // 'mergedown', //下合并单元格
                    // 'deleterow', //删除行
                    // 'deletecol', //删除列
                    // 'splittorows', //拆分成行
                    // 'splittocols', //拆分成列
                    // 'splittocells', //完全拆分单元格
                    // 'deletecaption', //删除表格标题
                    // 'inserttitle', //插入标题
                    // 'mergecells', //合并多个单元格
                    // 'deletetable', //删除表格
                    // 'cleardoc', //清空文档
                    // 'insertparagraphbeforetable', //"表格前插入行"
                    // 'insertcode', //代码语言
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    // 'simpleupload', //单图上传
                    'insertimage', //多图上传
                    // 'edittable', //表格属性
                    // 'edittd', //单元格属性
                    'link', //超链接
                    // 'emotion', //表情
                    'spechars', //特殊字符
                    'searchreplace', //查询替换
                    'map', //Baidu地图
                    // 'gmap', //Google地图
                    // 'insertvideo', //视频
                    // 'help', //帮助
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'fullscreen', //全屏
                    'directionalityltr', //从左向右输入
                    'directionalityrtl', //从右向左输入
                    'rowspacingtop', //段前距
                    'rowspacingbottom', //段后距
                    // 'pagebreak', //分页
                    // 'insertframe', //插入Iframe
                    // 'imagenone', //默认
                    'imageleft', //左浮动
                    'imageright', //右浮动
                    // 'attachment', //附件
                    'imagecenter', //居中
                    // 'wordimage', //图片转存
                    'lineheight', //行间距
                    // 'edittip ', //编辑提示
                    'customstyle', //自定义标题
                    // 'autotypeset', //自动排版
                    // 'webapp', //百度应用
                    // 'touppercase', //字母大写
                    // 'tolowercase', //字母小写
                    'background', //背景
                    // 'template', //模板
                    // 'scrawl', //涂鸦
                    // 'music', //音乐
                    // 'inserttable', //插入表格
                    // 'drafts', // 从草稿箱加载
                    // 'charts', // 图表
                ]
            ],
            autoHeightEnabled: true,
            autoFloatEnabled: true
        });
        let token = getCookie("token");
        let fromefille,imgFile,bagId;
        let ImgeFileurl = [];
        $(document).on("change",".bulletin-editor .uploadimg input",function () {
            imgFile = this;
            var pattern = /(\.*.jpg$)|(\.*.png$)/;
            if (!pattern.test(imgFile.value)) {
                alert("系统仅支持jpg/png格式的照片！");
            } else {
                var reader = new FileReader();
                reader.readAsDataURL(imgFile.files[0]);
                reader.onload = function (e) {
                    fromefille = e.target.result;
                    uploadimg(upId,"news",fromefille,upimgback)
                };
            }
        })
        $(document).on("change",".bulletin-editor .covers input",function () {
            imgFile = this;
            var pattern = /(\.*.jpg$)|(\.*.png$)/;
            if (!pattern.test(imgFile.value)) {
                alert("系统仅支持jpg/png格式的照片！");
            } else {
                var reader = new FileReader();
                reader.readAsDataURL(imgFile.files[0]);
                reader.onload = function (e) {
                    fromefille = e.target.result;
                    uploadimg(upId,"news",fromefille,upimgback2)
                };
            }
        })
        function upimgback(data) {
            $(".bulletin-editor .imghref").css({"background-image":"url("+data+")"});
            $(".bulletin-editor .imghref").siblings("p").html(data);
            console.log(data);
        }
        let coverurl;
        function upimgback2(data) {
            coverurl = data;
            $(".bulletin-editor .covers .image").css({"background-image":"url("+data+")"});
        }
        let title,isTop, publishTime, offTime, contents;
        $(".bulletin-editor .preserved").on("click", function () {
            title = $(".bulletin-editor .title input").val();
            if($(".bulletin-editor .isTop select").val()=="是"){
                isTop = 1
            }else {
                isTop = 2;
            }
            publishTime = new Date($(".bulletin-editor .publishTime input").val()).getTime()/1000;
            offTime = new Date($(".bulletin-editor .offTime input").val()).getTime()/1000;
            contents = ue.getContent();
            // console.log(contents)
            if(publishTime!=""&&offTime!=""&&title!=""&&coverurl&&contents!=""){
                toUpdate();
            }else {
                alert("请将信息填写完整");
            }

        });
        function toUpdate(){
            var data = {
                token:token,
                id:upId,
                title:title,
                img:coverurl,
                is_top:isTop,
                publish_time:publishTime,
                off_time:offTime,
                contents:contents
            };
            newajax(data,"post","newsBoard",newsback);
            function newsback(data) {
                alert("上传成功");
                location.reload([true]);
            }
        }
    }
});
        