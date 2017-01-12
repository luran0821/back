/**
 * get-query-string.js
 * [获取 URL 中的参数]
 * @param {string} key [要获取的参数的 key]
 */
function GetQuery  (key)  {
    let query = window.location.search.substring(1);
    const qs = {};
    const vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof qs[pair[0]] === "undefined") {
            qs[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof qs[pair[0]] === "string") {
            var arr = [qs[pair[0]], decodeURIComponent(pair[1])];
            qs[pair[0]] = arr;
        } else {
            qs[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return qs[key];
};
export {GetQuery};