import {getCookie} from '../common/get-cookie.js';
$(document).ready(function () {
    let invite = $('#invite');
    let DATA;
    invite.css({"width":"100%"});
    var table = invite.dataTable();
    $(".generate .btn").on('click',function(){
        let count = $(".generate input").val();
        let token = getCookie('token');
        function inviteajax(ajaxurl) {
            $.ajax({
                type: "POST",
                url: ajaxurl+"mm-keys",
                dataType: "jsonp",
                data: {
                    token: token,
                    count: count
                },
                success: function (data) {
                    if (data.ISOK === 1) {
                        //table.fnClearTable(); //清空一下table
                        table.fnDestroy(); //还原初始化了的datatable
                        DATA = data;
                        var Text = doT.template($("#dotpl-invite").text());
                        $("#invite #tbody").html(Text(DATA));
                        invite.dataTable();
                    } else {
                        alert(data.MSG);
                    }
                }
            });
        }
        // type(inviteajax);
    });

});

