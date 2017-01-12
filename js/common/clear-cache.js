import {getCookie} from './get-cookie.js';
import {comajax} from './ajax.js';
import {path} from './configuration.js';
function clearCache () {
    let url = path();
    let token = getCookie("token");
    let [array,array1,array2] = [[], [], []]
    array1 = ["token"];
    array2 = [token];
    array.push(array1, array2);
    comajax(array, "clean-languageCache",callback);
    comajax(array, "clean-urlCache",back);
    function callback(data) {
        console.log(data);
    }
    function back(data) {
        console.log(data)
    }
}
export {clearCache};
