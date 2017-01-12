import {path} from '../common/configuration.js';
function comdata (ajaxurl,array,type,suffix,isok) {
    let datajson={};
    let typejson = "json";
    let typepl;
    array[0].forEach(function(ele,i){
        datajson[ele]=array[1][i]
    });
    console.log(datajson);
    if(type&&type!=''){
        typepl = type
    }else {
        typepl = 'post'
    }
    $.ajax({
        type: typepl,
        url: ajaxurl+suffix,
        async:"false",
        dataType: typejson,
        data: datajson,
        success: function (data) {
            if (data.code === 200) {
                isok(data);
            } else {
                if (data.msg == "TOKEN无效") {
                    document.location = "../login.html"
                }else {
                    alert(data.msg);
                }
            }
        },
        error:function (data) {
            alert("网络错误");
        }
    });
}
function comajax (array,type,suffix,isok) {
    let ajaxurl = path();
    comdata(ajaxurl,array,type,suffix,isok);
}


function comdata2 (ajaxurl,json,type,suffix,isok) {
    let datajson = json;
    let typejson = "json";
    let typepl;
    if(type&&type!=''){
        typepl = type
    }else {
        typepl = 'post'
    }
    $.ajax({
        type: typepl,
        url: ajaxurl+suffix,
        async:"false",
        dataType: typejson,
        data: datajson,
        success: function (data) {
            if (data.code === 200) {
                isok(data);
            } else {
                if (data.msg == "TOKEN无效") {
                    document.location = "../login.html"
                }else {
                    alert(data.msg);
                }
            }
        },
        error:function (data) {
            alert("网络错误");
        }
    });
}
function newajax (json,type,suffix,isok) {
    let ajaxurl = path();
    comdata2(ajaxurl,json,type,suffix,isok);
}



export {comajax,newajax};