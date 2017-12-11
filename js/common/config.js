//
// var pcUrl='http://localhost:63342/web/index.html';
// var phoneUrl='http://localhost:63342/web/phone/index.html';

//正式
var pcUrl='http://www.jizhaojk.com/index.html';
var phoneUrl='http://www.jizhaojk.com/phone/index.html';

function IsPhone()  {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}
if(IsPhone()){
    window.location.href=phoneUrl;
}