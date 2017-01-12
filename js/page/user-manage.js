import {getCookie} from '../common/get-cookie.js';
import {unix} from '../common/unix.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
let ajaxurl = path();
$(document).ready(function () {
    if($(".user-manage").length!=0) {
        let tatistics = $('#table-manage');
        let token = getCookie("token");
        let DATA, managetype, managevalue;
        tatistics.css({"width": "100%"});
        let table = tatistics.dataTable({
            "iDisplayLength": 10
        });

        function manageajax(ajaxurl) {
            let array = [];
            let [u_id,u_nickname,u_phone,u_balance,u_freezed,u_cbalance,u_noconfirm,u_status,u_regtime,freeze,choice]=[[], [], [], [], [], [], [], [], [], [], []];
            $.ajax({
                type: "get",
                url: ajaxurl + "user",
                dataType: "jsonp",
                data: {
                    token: token,
                    type: managetype,
                    value: managevalue
                },
                success: function (data) {
                    if (data.code === 200) {
                        DATA = data.list[0];
                        //console.log(data.DATA);

                        for (let [index,v] of data.list.entries()) {
                            u_id.push(v.u_id);
                            u_nickname.push(v.u_nickname);
                            u_phone.push(v.u_phone);
                            u_balance.push(v.u_balance.toFixed(4));
                            u_freezed.push(v.u_freezed.toFixed(4));
                            u_cbalance.push(v.u_cbalance.toFixed(4));
                            u_noconfirm.push(v.u_noconfirm.toFixed(4));
                            u_status.push(v.u_status);
                            u_regtime.push(unix(v.u_regtime));
                            if (u_status[index] == 1) {
                                freeze.push("冻结");
                            } else if (u_status[index] == -1) {
                                freeze.push("解冻");
                            } else if (u_status[index] == 0) {
                                freeze.push("未激活");
                            }
                            choice = ["解冻"]
                        }
                        //alert(typeof (u_noconfirm[0]));
                        let Text = doT.template($("#dotpl-manage").text());
                        array.push(u_id, u_nickname, u_phone, u_balance, u_freezed, u_cbalance, u_noconfirm, u_regtime, freeze, u_status, choice);
                        table.fnDestroy();
                        $(".user-manage #tbody").html(Text(array));
                        tatistics.dataTable({
                            "iDisplayLength": 100
                        });
                    } else {
                        if (data.msg == "TOKEN无效") {
                            document.location = "../login.html"
                        } else {
                            alert(data.msg);
                        }
                    }
                },
                error: function (data) {
                    alert("网络错误")
                }
            });

        }

        // 是否冻结账户
        let freezingid, freestatus, reason, _this;
        $(".user-manage").on("click", ".center tbody tr td .btn-handle", function () {
            //console.log($(this));
            freezingid = $(this).parents("tr").find("td").eq(0).html();
            freestatus = $(this).attr("data_type");
            _this = this;
            let list = {
                "token":token,
                "uid":freezingid,
                "status":1
            }
            if (freestatus == 1) {
                //冻结
                $(".user-manage .maker").removeClass("none");
                $(".user-manage .maker .btn").attr("id",freezingid);
                $(".user-manage .maker .btn").attr("status",freestatus);
            } else {
                // 解冻
                newajax(list,"post","user/freezing",callback);
            }
            function callback(data) {
                manageajax(ajaxurl)
            }
        });
        $(".user-manage .maker .btn").on("click", function () {
            let _this = $(this);
            $(this).parents(".maker").addClass("none");
            let id = $(".user-manage .maker .btn").attr("id");
            let status = $(".user-manage .maker .btn").attr("status");
            reason = $(this).siblings("input").val();
            let list = {
                "token" : token,
                "uid" : id,
                "status" : 0,
                "reason" : reason
            }
            newajax(list,"post","user/freezing",callback);
            function callback(data) {
                manageajax(ajaxurl)
                $(_this).siblings("input").val("");
                // $(this).addClass("btn-danger");
            }
            console.log(reason);
        })
        $(".user-manage .top .btn-primary").on("click", function () {
            let typenum = $(".user-manage .center .top .select select").val();
            if (typenum == "用户名") {
                managetype = 1;
            } else if (typenum == "UID") {
                managetype = 2;
            } else if (typenum == "手机号") {
                managetype = 3;
            }
            managevalue = $(".user-manage .center .top .select input").val();
            manageajax(ajaxurl);
        });

        $(document).on("click", ".user-manage .particulars", function () {
            $(".user-manage .maker2").removeClass("none");
            //console.log($(this).parents("tr").find("td").html());
            let uid = $(this).parents("tr").find("td").eq(0).html();
            let list = {
                "token":token,
                "uid":uid
            }
            newajax(list, "get" , "user/freezingLog", callback);
            function callback(data) {
                let listarray = [];
                listarray.push(data.data[0].uf_time, data.data[0].uf_executor_name, data.data[0].uf_reason);
                $(".user-manage .maker2 .out span").each(function (i) {
                    $(this).html(listarray[i]);
                });
                console.log(data.data[0]);
            };
        });

        $(".user-manage .maker2 .btn").on("click", function () {
            $(this).parents(".maker2").addClass("none");
            $(".user-manage .maker2 .out span").each(function (i) {
                $(this).html();
            });
        });
    }
});