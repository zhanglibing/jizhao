/**

 * @authors zhanglibing
 * @date    2017-09-01 09:49:57
 * @version $Id$
 */

document.write('<script src="js/apiAjax.js"></script>')
document.write('<script src="js/common/common.js"></script>')
// 定义个人信息数组
var userInfo = []

//保存个人信息到session
function saveUserInfo() {
    var string_userInfo = JSON.stringify(userInfo);//数组转换成字符串
    sessionStorage.setItem("ss_userInfo", string_userInfo);
}
function openUserInfo() {
    var stemp = sessionStorage.getItem("ss_userInfo"); //将字符串转换为数组
    userInfo = JSON.parse(stemp);
}

function saveAutoLogin(code, pwd) {  //保存登陆账号密码
    var old = getAutoLogin();
    if (old.userCode == code && old.userPwd == pwd) { //账号密码都相等时不保存
        return false;
    }
    setCookie('docuserCode', code, 3);
    setCookie('docuserPwd', pwd, 3);
}
function getAutoLogin() {   //获取登陆账号密码
    var code = getCookie('userCode');
    var pwd = getCookie('userPwd');
    var params = {userCode: code, userPwd: pwd};
    return params;
}
function clearAutoLogin() {  //清除登陆账号密码
    clearCookie('serCode');
    clearCookie('userPwd');
}
function setCookie(c_name, value, expiredays)  //保存函数
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(c_name)  //根据键名获得对应的键值函数
{
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));//解码并截取我们要值
        }
    }
    return "";
}

//清除cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}
//获取登录信息
openUserInfo();

//性别选择  公用
$('body').on('click', '.sex-box b', function () {
    $('.sex-box b').removeClass('active');
    $(this).addClass('active');
})

//点击头像进入个人中心页面
$('.loginAvatar').on('click', function () {
    var hrefPath = '';
    if (userInfo.SystemName == "Registered") { //Registered:用户   Consultant:咨询师
        hrefPath = 'member';
    } else {
        hrefPath = 'expert';
    }
    window.location.href = hrefPath + '_center.html';
})

function zooming(target){
    target.each(function(i,v){
        var that=$(this);
        var w = that.width();
        var h = that.height();
        var img=that.find('img');
        var src=img.attr('src');
        var image = new Image();
        image.src=src;
        image.onload = function () {
            var W = image.width;
            var H = image.height;
            if ((w / h) < (W / H)) {
                img.addClass('active');
            } else {
                img.removeClass('active');
            }
        }
    })
}

//判断是否已登录
function initIsLogin() {
    if (userInfo) {
        console.log(userInfo)
        var avatarPath = userInfo.AvatarUrl;
        avatarPath = avatarPath ? avatarPath : 'images/login_avatar.png';
        var hasLogin = $('.loginAvatar');
        $('.login-entrance').removeClass('active');
        hasLogin.addClass('active').find('img').attr('src', avatarPath);
        zooming(hasLogin);

    }else{
        $('.login-entrance').addClass('active');
    }
}
initIsLogin()


