import {getCookie} from '../common/get-cookie.js';
import {newajax} from '../common/ajax.js';
import {path} from '../common/configuration.js';
import {GetQuery} from '../common/get-query-string.js';
let pathurl = path();
let token = getCookie("token");
$(document).ready(function () {
    // console.log(GetQuery)
    if($(".announcement").length!=0) {
        let id = GetQuery('id');
        let arry;
        arry = {
            token:token,
            id:id
        }
        newajax(arry,"get","newsBoard/"+id, callback);
        function callback(data) {
            function escape2Html(str) {
                var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
                return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
            }
            let d = escape2Html(data.data.nb_contents);
            // console.log(d);
            $("body .content").get(0).innerHTML = `${ d }`;
        }

    }
})

