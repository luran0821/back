import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
if($(".spell-application").length==1) {
    let adminurl = path();
    let token = getCookie("token");
    let status = 0;

// datatables 服务端配置 需要后台配置相关代码
    var oTable = null;
    let last = $(".spell-application .col-lg-9 ul li div:last-child");
    let firist = $(".spell-application .col-lg-9 ul li div:first-child");
    let imges = [];
    var initUserList = function () {
        var table = $('.spell-application #tableManage-spell');
        table.css("width", "100%");// 重新设置初始化宽度
        if (oTable == null) { //仅第一次检索时初始化Datatable
            oTable = table.dataTable({
                "bLengthChange": true, //改变每页显示数据数量
                "bFilter": true, //过滤功能
                "bProcessing": true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好
                "bServerSide": true, //开启服务器模式，使用服务器端处理配置datatable。注意：sAjaxSource参数也必须被给予为了给datatable源代码来获取所需的数据对于每个画。 这个翻译有点别扭。
                "iDisplayLength": 20,//每页显示10条数据(会在ajax请求时发送由后台处理)
                //ajax地址
                "sAjaxSource": adminurl + "user/appeal",// 请求路径
                "fnServerData": retrieveData,//执行方法(对应函数有三个参数分别是 url(sAjaxSource)、data(传入参数)、回调函数(接收返回数据并有插件作出处理))
                // 表格填入数据
                "columns": [
                    {"data": "u_time"},
                    {"data": "u_id"},
                    {"data": "m_nickname"},
                    {"data": "m_bindphone"},
                    {"data": "m_idname"},
                    {"data": "m_bindid"},
                    {"data": ""},
                    {"data": " "},// 默认留空,按钮位置
                ],
                //添加按钮
                "columnDefs": [{
                    "targets": 7,//操作按钮目标列
                    "data": null,
                    "render": function (data, type, row) {
                        //console.log(data,type,row)
                        if (row.m_nikename == "") {
                            row.m_nikename = "空";
                        }
                        if (row.u_explanation == "") {
                            row.u_explanation = "空";
                        }

                        if (row.u_name == "") {
                            row.u_name = "空";
                        }
                        if (row.u_phone == "") {
                            row.u_phone = "空";
                        }
                        if (row.u_bindid == "") {
                            row.u_bindid = "空";
                        }
                        if (row.u_imgs == "") {
                            row.u_imgs = "空";
                        }
                        // console.log(row.u_phone)
                        var html = "<div href='javascript:void(0);' data_id =" + row.u_id + " data_time ='" + row.u_time + "' data_nickname =" + row.m_nickname + " data_explanation =" + row.u_explanation + " data_bindphone =" + row.u_bindphone + " data_name =" + row.u_name + " data_phone =" + row.u_phone + "  data_bindid =" + row.u_bindid + "  data_imgs =" + row.u_imgs + " data_status =" + row.u_status + " data_recovery="+ row.u_recovery+" data_recovery_uname="+ row.u_recovery_uname+"   data_$id =" + row._id + " class='btn btn-primary btn-application' > 查看<div/>";
                        return html;
                    }
                }, {
                    "targets": 6,//操作按钮目标列
                    "data": null,
                    "render": function (data, type, row) {
                        //console.log(data,type,row)
                        var html = "<div href='javascript:void(0);' data_id =" + row.u_id + " data_$id =" + row._id + "  class='btn btn-primary freeze-spell' > 查看<div/>";
                        return html;
                    }
                }]
            });
        }
        //刷新Datatable，会自动激发retrieveData
        // oTable.fnDraw();
    };

//参数执行函数
    function retrieveData(sSource, aoData, fnCallback) {
        // console.log(sSource,fnCallback,aoData)
        // 自定义请求参数并对应插件本身加载数据
        let skip = {
            name: "skip",
            value: aoData[3].value
        };// 请求数据开始位置
        let limit = {
            name: "limit",
            value: aoData[4].value
        };//请求条数
        let tokenval = {
            name: "token",
            value: token
        };//请求条数
        let statu = {
            name:"status",
            value:status
        }
        // 添加到参数列表
        aoData.push(skip);
        aoData.push(limit);
        aoData.push(tokenval);
        aoData.push(statu);
        /* ajax 方法调用*/
        $.ajax({
            "type": "get",
            // "contentType": "text/json",
            "url": sSource,
            "dataType": "json",// json和jsonp有差别
            "data": aoData,
            "success": function (data) {
                // console.log(resp)
                // 插件回调数据处理方法,
                // console.log(resp.DATA.data);
                if (data.code === 200) {
                    imges = data.data.u_imgs;
                    fnCallback(data.data); //服务器端返回的对象的returnObject部分是要求的格式
                } else {
                    // document.location = "../login.html";
                    if (data.msg == "TOKEN无效") {
                        document.location = "../login.html"
                    }else {
                        alert(data.msg);
                    }
                }
            }
        });
    }

    jQuery(document).ready(function () {
        initUserList();
        $(document).on("click", ".spell-application .freeze-spell", function () {
            let array;
            let uid = $(this).attr("data_id");
            array = {
                token:token,
                uid:uid
            }
            newajax(array, "get", "user/freezingLog", callback);
        });
        function callback(data) {
            $(".spell-application .maker").removeClass("none");
            let list = [];
            list.push(data.data[0].uf_time, data.data[0].uf_executor_name, data.data[0].uf_reason);
            $(".spell-application .maker .out span").each(function (i) {
                $(this).html(list[i]);
            });
            // console.log(data.DATA[0]);
        };
        $(".spell-application .maker .btn").on("click", function () {
            $(this).parents(".maker").addClass("none");
            $(".spell-application .maker .out span").each(function (i) {
                $(this).html("");
            });
        });
        $(document).on("click", ".maker", function () {
            $(".bigimg").addClass("none");
            $(this).addClass("none");
            last.eq(7).find("img").addClass("visibility");
        })
        $(document).on("click", ".maker .out", function () {
            return false;
        })
        let recoverydet = $(".col-lg-9 .recovery>div:last-child").html();
        $(document).on("click", ".spell-application .btn-application", function () {
            $(".col-lg-9").removeClass("none")
            // console.log($(this).attr("data_$id"));
            last.eq(8).attr("uid", $(this).attr("data_id"));
            last.eq(8).attr("id", $(this).attr("data_$id"));
            // last.eq(8).attr("data_time",$(this).attr("data_time"));
            last.eq(0).html($(this).attr("data_time"));
            last.eq(1).html($(this).attr("data_nickname"));
            last.eq(2).html($(this).attr("data_explanation"));
            last.eq(3).html($(this).attr("data_bindphone"));
            last.eq(4).html($(this).attr("data_name"));
            last.eq(5).html($(this).attr("data_bindid"));
            last.eq(6).html($(this).attr("data_phone"));
            let imgs = $(this).attr("data_imgs");
            if ($(this).attr("data_imgs") == "空") {
                // alert("没有图片");
            } else if ($(this).attr("data_imgs").indexOf(",") != -1) {
                let images = imgs.split(",");
                // console.log(images[0]);
                $.each(images, function (i, value) {
                    last.eq(7).find("img").eq(i).removeClass("visibility");
                    last.eq(7).find("img").eq(i).attr("src", adminurl + images[i]);
                });
            } else {
                last.eq(7).find("img").eq(0).removeClass("visibility");
                last.eq(7).find("img").eq(0).attr("src", adminurl + $(this).attr("data_imgs"));
            }
            if($(this).attr("data_status")!=0){

                console.log(recoverydet)
                $(".col-lg-9 .choice").addClass("none");
                $(".col-lg-9 textarea").addClass("none");
                // $(".col-lg-9 .recovery>div:last-child").html("事发后掉还是符合非团购还诶 可是对方客户 认定该房间号多少件韩国四大皆空是是否记得回家上课上的飞机我没让姐嗯好的哈健康刚开始按时色弱我我爱诶嘿卡萨丁啊啊哈哈发客户覅无人好的噶我无二UI人接电话开黑的粉红色");
                $(".col-lg-9 .recovery div:last-child").html("处理人&nbsp:&nbsp"+$(this).attr("data_recovery_uname")+"<br/>原因&nbsp:&nbsp"+$(this).attr("data_recovery"));
            }else {
                $(".col-lg-9 .recovery>div:last-child").html(recoverydet);
            }
            init_table();
        });
        $(document).on("click", ".spell-application .thawing", function () {
            let recovery = $(this).parent().siblings("textarea").val();
            let array;
            let uid = $(this).parents(".border").attr("uid");
            let id = $(this).parents(".border").attr("id");
            if (recovery == "") {
                alert("请填写原因");
                return;
            } else {
                array = {
                    token:token,
                    id:id,
                    uid:uid,
                    status:1,
                    recovery:recovery
                }
                $(".col-lg-9").addClass("none");
                $(".col-lg-9 textarea").val("");
                newajax(array,"post","user/appeal", allback);
                return;
            }
        });

        $(document).on("click", ".spell-application .reject", function () {
            let recovery = $(this).parent().siblings("textarea").val();
            let array;
            let uid = $(this).parents(".border").attr("uid");
            let id = $(this).parents(".border").attr("id");
            if (recovery == "") {
                // console.log(recovery)
                alert("请填写原因");
                return;
            } else {
                array = {
                    token:token,
                    id:id,
                    uid:uid,
                    status:2,
                    recovery:recovery
                }
                $(".col-lg-9").addClass("none");
                $(".col-lg-9 textarea").val("");
                newajax(array,"post","user/appeal", allback);
                return;
            }
        });
        function allback() {
            if (oTable != null) {
                oTable.fnDestroy();
            }
            oTable = null;
            initUserList();
        }

        $(document).on("click", ".col-lg-9", function () {
            $(".bigimg").addClass("none");
            $(this).addClass("none");
            last.eq(7).find("img").addClass("visibility");
        })
        $(document).on("click", ".col-lg-9 div", function () {
            return false
        })
        $(document).on("click", ".bindidimg img", function () {
            let src = $(this).attr("src");
            $(".bigimg img").attr("src", src);
            $(".bigimg").removeClass("none");
            // console.log($(this).attr("src"));
        })
        $(document).on("click", ".bigimg", function () {
            $(".bigimg").addClass("none");
            $(".bigimg img").attr("src", "");
        })
    });

    $(".center .top .btn").on("click",function () {
        let i = $(this).index();
        status = i;
        if (oTable != null) {
            oTable.fnDestroy();
        }
        oTable = null;
        initUserList();
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    })
    function init_table() {
        $(".col-lg-9").removeClass("none");
        last.each(function (i) {
            // console.log($(".spell-application .col-lg-9 ul li div:last-child").eq(i).outerHeight())
            last.parents("li").eq(i).find("div").addClass("border");
            firist.eq(i).height(last.eq(i).height()+2);
            firist.eq(i).css({"line-height": last.eq(i).outerHeight() + "px"})
            // last.eq(i).height(last.eq(i).outerHeight());
        })
    }
    let oBox = $(".col-lg-9").get(0);
    var params = {left: 0, top: 0, currentX: 0, currentY: 0, flag: false};
    var getCss = function (b, a) {
        return b.currentStyle ? b.currentStyle[a] : document.defaultView.getComputedStyle(b, false)[a];
    };
    var startDrag = function (a, b) {
        if (getCss(b, "left") !== "auto") {
            params.left = getCss(b, "left")
        }
        if (getCss(b, "top") !== "auto") {
            params.top = getCss(b, "top")
        }
        a.onmousedown = function (c) {
            params.flag = true;
            if (!c) {
                c = window.event;
                a.onselectstart = function () {
                    return false
                }
            }
            var d = c;
            params.currentX = d.clientX;
            params.currentY = d.clientY
        };
        document.onmouseup = function () {
            params.flag = false;
            if (getCss(b, "left") !== "auto") {
                params.left = getCss(b, "left")
            }
            if (getCss(b, "top") !== "auto") {
                params.top = getCss(b, "top")
            }
        };
        document.onmousemove = function (h) {
            var i = h ? h : window.event;
            if (params.flag) {
                var d = i.clientX, c = i.clientY;
                var g = d - params.currentX, f = c - params.currentY;
                b.style.left = parseInt(params.left) + g + "px";
                b.style.top = parseInt(params.top) + f + "px"
            }
        }
    };
    try {
        startDrag(oBox, oBox);
    } catch (err) {
        // console.log(err);
    }
}
