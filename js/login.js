
document.write('<script src="js/login_data.js"></script>')
//pc、手机端公用
function LoginInit(option){
    var _this=this;
    this.imgCode=''; //保存图片验证码
    this.isCanReg=true;  //用来判断手机号是否已经注册
    this.isPhone=option.isPhone; //是否为手机端
    this.countdown = 60;
    this.timeFlag = true;
    this.text = '获取验证码';
    this.init=function(){
        if(_this.isPhone){
            _this.createLoginHtml('login');
        }
        _this.event();
    }
    //事件
    this.event=function(){
        //用户登录提交
        $('body').on('click','.login-submit', function () {
            var Username = $('input[name=userPhone]').val(); //用户手机号
            var Password = $('input[name=loginPsd]').val(); //密码
            if (!_this.checkPhone(Username)) {
                return
            }
            if (_this.isCanReg) {
                return utils.msg("该手机号未注册")
            }
            if (Password.length < 6) {
                return utils.msg("请输入正确的密码")
            }
            var option = {
                Username: Username,
                Password: Password
            }
            api.userLogin(option, _this.loginSuccess)
        })
        //---------------------用户找回密码提交、注册提交-----------------------
        //下一步
        $('body').on('click', '.next-submit', function () {  //下一步
            var userPhone = $('input[name=userPhone]').val();       //用户手机号
            if (!_this.checkPhone(userPhone)) {
                return;
            }
            if (!_this.checkImgCode()) {
                return false;
            }
            if ($(this).hasClass('regSub')) {//注册下一步
                if(!_this.isCanReg){return utils.msg("该手机号已注册")}
                _this.createLoginHtml('regSet', userPhone);
                return false;
            }
            if(_this.isCanReg){return utils.msg("该手机号未注册")}
            _this.createLoginHtml('backPsdSet', userPhone); //找回密码下一步
        })
        // 确认提交
        $('body').on('click', '.backPsd-submit,.reg-submit', function () {
            var Username = $('.userPhone').text(); //用户手机号
            var VerificationCode = $('input[name=SMSCode]').val(); //短信验证码
            var Password = $('input[name=psd]').val();
            var rePassword = $('input[name=rePsd]').val();
            if (!VerificationCode) {return utils.msg("短信验证码不能为空");}
            if (!_this.checkRePsd(Password, rePassword)) {return false;}
            var option = {
                Username: Username,
                VerificationCode: VerificationCode,
                Password: Password
            }
            if($(this).hasClass('reg-submit')){ //注册账号
                api.Register(option, _this.RegisterSuc);
                return false;
            }
            api.userBackPsd(option, _this.backPsdSuccess) //找回密码
        })

        //登录注册、找回密码弹框创建、以及关闭
        $('body').on('click','.goLogin', function () {
            _this.createLoginHtml('login');
        })
        $('body').on('click','.goReg', function () {
            $('.msg').remove();
            _this.createLoginHtml('reg');
        })
        $('body').on('click','.goForget', function () {
            _this.createLoginHtml('backPsd');
        })
        if(!_this.isPhone){ //pc端显示
            $('body').on('click','.close,.mask', function () {
                $('.login-wrapper').remove();
            })
        }


        //点击切换图片
        $('body').on('click','.imgCode', function () {
            api.getImgCode({}, _this.getImgCodeSuc);
        })

        //判断手机号是否已注册
        $('body').on('blur','input[name=userPhone]', function () {
            var phone = $.trim($(this).val());
            if (!phone) {
                return false;
            }
            if (_this.checkPhone(phone)) {  //手机号码格式是否正确
                params = {
                    Username: phone
                }
                api.phoneIsReg(params, _this.isRegSuc);
            }
        })

        //发送短信验证码
        $('body').on('click','.sendCode', function () {
            var tel=$.trim($('.sendCodeBox .userPhone').text());
            var fromPage=$('.regSet-box').length?"注册":"修改密码"
            _this.countdown=60; //重置时间
            _this.settime($(this));
            api.SendSMS({tel:tel,Frompage:fromPage},_this.SendSMSSuc);
        })
        //点击回车登录事件
        if(!_this.isPhone){
            document.onkeydown = function (e) {
                var ev = document.all ? window.event : e;
                if (ev.keyCode == 13&&$('.triggerSubmit').length) {
                    // $('.login-submit').click();//处理事件
                    $('.triggerSubmit').trigger('click')
                }
            }
        }

    }
    //成功callBack返回函数
    this.loginSuccess=function(data) {
        console.log(data)
        if (!data.Success) {
            if (data.Code !== "201") {
                //  密码或账号有误
                return utils.msg(data.customer);
            }
            return utils.msg("请求出错");
        }
        $('.login-wrapper').remove();
        saveloginData(data.customer);
        if(_this.isPhone){  //手机端
            window.location.href='index.html';
            return false;
        }
        initIsLogin(); //初始化登录按钮、显示头像
    }
    this.backPsdSuccess=function(data) {
        console.log(data)
        if (!data.Success) {
            if (data.Code !== "201") {
                //提示修改的密码和之前密码重复
                return utils.msg(data.ChagePassword);
            }
            return utils.msg("请求出错");
        }
        utils.msg("密码修改成功");
        setTimeout(function(){
            _this.createLoginHtml('login');
        })

    }
    this.RegisterSuc=function(data) {
        console.log(data)
        if (!data.Success) {
            if (data.Code == "201") {
                return false
            }
            return utils.msg("请求出错");
        }
        utils.msg("注册成功");
        setTimeout(function(){
            _this.createLoginHtml('login');
        })
    }
    this.SendSMSSuc=function(data) {
        console.log(data)
        if (!data.Success) {
            if (data.Code !== "201") {
            }
            return utils.msg("请求出错");
        }
        utils.msg("发送成功")
    }
    this.isRegSuc=function(data) {
        if (!data.Success) {
            if (data.Code !== "201") {
            }
            return utils.msg("请求出错");
        }
        var isReg = $('.reg-box').length; //是否为注册页面
        _this.isCanReg = data.CheckUsernameAvailability;//true:未注册  false:已经注册
        if (_this.isCanReg && !isReg) {
            utils.msg('该手机号未注册');
        }
        if (!_this.isCanReg && isReg) {
            utils.msg('该手机号已注册');
        }

    }
    this.getImgCodeSuc=function (data) {
        if (data.Success != "true") {
            if (data.Code == "201") {

            }
        }
        _this.imgCode = data.CaptchaCode.code.toLowerCase();
        $('.imgCode').attr('src', data.CaptchaCode.imagestream)

    }
    //创建html函数
    this.createLoginHtml=function (type,val){ //val 下一步时传递的手机号
        $('.login-wrapper').empty(); //先清空
        if(_this.isPhone){
            var navTitle="登录";
            var htm='';
            if(type=="login"){ //登录
                htm+='<div class="login-box wrapper">'+
                    '<div class="row">'+
                    '<p>手机号</p>'+
                    '<input type="text" class="Username" name="userPhone" placeholder="请输入手机号" />'+
                    '</div>'+
                    '<div class="row">'+
                    '<p>密码</p>'+
                    '<input type="password" class="Password" name="loginPsd" placeholder="请输入密码" />'+
                    '</div>'+
                    '<div class="help clear">'+
                    '<span class="goReg">没有账号？注册</span>'+
                    '<span class="goForget">忘记密码</span>'+
                    '</div>'+
                    '<button class="login-submit btn">登录</button>'+
                    '</div>'
            }
            else if(type=="reg"){//注册
                navTitle="注册"
                htm+='<div class="reg-box wrapper">'+
                    '<div class="row margin-max">'+
                    '<p>手机号</p>'+
                    '<input type="text" name="userPhone" class="regPhone" placeholder="请输入手机号">'+
                    '</div>'+
                    '<div class="row">'+
                    '<p>验证码<img class="imgCode" src=""/></p>'+
                    '<input type="text" name="VerificationCode" placeholder="请输入验证码">'+
                    '</div>'+
                    '<div class="agreement">'+
                    '注册及同意<a href="studentAgreement.html" target="_blank">”阿拉丁教育用户协议”</a>'+
                    '</div>'+
                    '<div class="goLogin">已有账号?</div>'+
                    '<button class="next-submit regSub btn">下一步</button>'+
                    '</div>';
            }
            else if(type=='regSet'){ //注册设置
                navTitle="注册设置"
                htm+='<div class="regSet-box wrapper">'+
                    '<div class="row">'+
                    '<p class="sending">验证码已发送至手机：</p>'+
                    '<div class="sendCodeBox">'+
                    '<span class="userPhone">'+val +'</span><button class="btn sendCode">重发(45s)</button><button class="changePhone goReg btn">更换手机</button>'+
                    '</div>'+
                    '</div>'+
                    '<div class="row">'+
                    '<p>短信验证码</p>'+
                    '<input type="text" name="SMSCode" placeholder="请输入短信验证码">'+
                    '</div>'+
                    '<div class="row ">'+
                    '<p>设置密码</p>'+
                    '<input type="password" name="psd" placeholder="设置密码(长度6-16)">'+
                    '</div>'+
                    '<div class="row">'+
                    '<p>验证密码</p>'+
                    '<input type="password" name="rePsd" placeholder="验证密码(长度6-16)">'+
                    '</div>'+
                    // '<div class="row">'+
                    // '<p>设置昵称</p>'+
                    // '<input type="text" name="userNickName" placeholder="请设置一个昵称(6字以内)">'+
                    // '</div>'+
                    // '<div class="sex-box">'+
                    // '<div class="male"><b class="active">1</b><span>男</span></div>'+
                    // '<div class="female"><b>0</b><span>女</span></div>'+
                    // '</div>'+
                    '<button class="reg-submit btn">完成注册</button>'+
                    '</div>'
            }
            else if(type=='backPsdSet'){ //找回密码设置
                navTitle="找回密码设置"
                htm+='<div class="backPsdSet-box wrapper">'+
                    '<div class="row">'+
                    '<p class="sending">验证码已发送至手机:</p>'+
                    '<div class="sendCodeBox">'+
                    '<span class="userPhone">'+ val +'</span><button class="sendCode btn">重发(45s)</button>'+
                    '</div>'+
                    '</div>'+
                    '<div class="row">'+
                    '<p>短信验证码</p>'+
                    '<input type="text" name="SMSCode" placeholder="请输入短信验证码">'+
                    '</div>'+
                    '<div class="row ">'+
                    '<p>设置密码</p>'+
                    '<input type="password" name="psd" placeholder="设置密码(长度6-16)">'+
                    '</div>'+
                    '<div class="row">'+
                    '<p>验证密码</p>'+
                    '<input type="password" name="rePsd" placeholder="验证密码(长度6-16)">'+
                    '</div>'+
                    '<button class="backPsd-submit btn">确认修改</button>'+
                    '</div>'
            }
            else{
                navTitle="找回密码"
                htm+='<div class="backPsd-box wrapper">'+
                    '<div class="row margin-max">'+
                    '<p>手机号</p>'+
                    '<input type="text" name="userPhone" placeholder="请输入手机号">'+
                    '</div>'+
                    '<div class="row">'+
                    '<p>验证码<img class="imgCode" src=""/></p>'+
                    '<input type="text" name="VerificationCode" placeholder="请输入验证码">'+
                    '</div>'+
                    '<div class="goLogin">已有账号?</div>'+
                    '<button class="next-submit backSub  btn">下一步</button>'+
                    '</div>';
            }
            $('.nav-box .title').text(navTitle);
            $('title').text(navTitle);
        }else{
            var htm = '<div class="login-wrapper"><div class="mask"></div>';
            if (type == "login") { //登录
                htm += '<div class="login-box wrapper"><div class="close"></div>' +
                    '<div class="title"><span>登录</span></div>' +
                    '<div class="row">' +
                    '<p>手机号</p>' +
                    '<input type="text" name="userPhone" placeholder="请输入手机号" />' +
                    '</div>' +
                    '<div class="row">' +
                    '<p>密码</p>' +
                    '<input type="password" name="loginPsd" placeholder="请输入密码" />' +
                    '</div>' +
                    '<div class="help clear">' +
                    '<span class="goReg">没有账号？注册</span>' +
                    '<span class="goForget">忘记密码</span>' +
                    '</div>' +
                    '<button class="login-submit triggerSubmit  btn">登录</button>' +
                    '</div></div>'
            }
            else if (type == "reg") {//注册
                htm += '<div class="reg-box wrapper"><div class="close"></div>' +
                    '<div class="title"><span>注册</span></div>' +
                    '<div class="row margin-max">' +
                    '<p>手机号</p>' +
                    '<input type="text" name="userPhone" class="regPhone" placeholder="请输入手机号">' +
                    '</div>' +
                    '<div class="row">' +
                    '<p>验证码<img class="imgCode" src=""/></p>' +
                    '<input type="text" name="VerificationCode" placeholder="请输入验证码">' +
                    '</div>' +
                    '<div class="agreement">' +
                    '注册及同意<a href="studentAgreement.html" target="_blank">”阿拉丁教育用户协议”</a>' +
                    '</div>' +
                    '<div class="goLogin">已有账号?</div>' +
                    '<button class="next-submit triggerSubmit regSub btn">下一步</button>' +
                    '</div></div>';
            }
            else if (type == 'regSet') { //注册设置
                htm += '<div class="regSet-box wrapper"><div class="close"></div>' +
                    '<div class="title"><span>设置密码</span></div>' +
                    '<div class="row">' +
                    '<p class="sending">验证码已发送至手机：</p>' +
                    '<div class="sendCodeBox">' +
                    '<span class="userPhone">' + val + '</span><button class="btn sendCode">重发(45s)</button><button class="changePhone goReg btn">更换手机</button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<p>短信验证码</p>' +
                    '<input type="text" name="SMSCode" placeholder="请输入短信验证码">' +
                    '</div>' +
                    '<div class="row ">' +
                    '<p>设置密码</p>' +
                    '<input type="password" name="psd" placeholder="设置密码(长度6-16)">' +
                    '</div>' +
                    '<div class="row">' +
                    '<p>验证密码</p>' +
                    '<input type="password" name="rePsd" placeholder="验证密码(长度6-16)">' +
                    '</div>' +
                    // '<div class="row">'+
                    // '<p>设置昵称</p>'+
                    // '<input type="text" name="userNickName" placeholder="请设置一个昵称(6字以内)">'+
                    // '</div>'+
                    // '<div class="sex-box">'+
                    // '<div class="male"><b class="active">1</b><span>男</span></div>'+
                    // '<div class="female"><b>0</b><span>女</span></div>'+
                    // '</div>'+
                    '<button class="reg-submit triggerSubmit btn">完成注册</button>' +
                    '</div></div>'
            }
            else if (type == 'backPsdSet') { //找回密码设置
                htm += '<div class="backPsdSet-box wrapper"><div class="close"></div>' +
                    '<div class="title"><span>设置密码</span></div>' +
                    '<div class="row">' +
                    '<p class="sending">验证码已发送至手机:</p>' +
                    '<div class="sendCodeBox">' +
                    '<span class="userPhone">' + val + '</span><button class="sendCode btn">重发(45s)</button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<p>短信验证码</p>' +
                    '<input type="text" name="SMSCode" placeholder="请输入短信验证码">' +
                    '</div>' +
                    '<div class="row ">' +
                    '<p>设置密码</p>' +
                    '<input type="password" name="psd" placeholder="设置密码(长度6-16)">' +
                    '</div>' +
                    '<div class="row">' +
                    '<p>验证密码</p>' +
                    '<input type="password" name="rePsd" placeholder="验证密码(长度6-16)">' +
                    '</div>' +
                    '<button class="backPsd-submit triggerSubmit btn">完成注册</button>' +
                    '</div></div>'
            }
            else {
                htm += '<div class="backPsd-box wrapper"><div class="close"></div>' +
                    '<div class="title"><span>找回密码</span></div>' +
                    '<div class="row margin-max">' +
                    '<p>手机号</p>' +
                    '<input type="text" name="userPhone" placeholder="请输入手机号">' +
                    '</div>' +
                    '<div class="row">' +
                    '<p>验证码<img class="imgCode" src=""/></p>' +
                    '<input type="text" name="VerificationCode" placeholder="请输入验证码">' +
                    '</div>' +
                    '<div class="goLogin">已有账号?</div>' +
                    '<button class="next-submit triggerSubmit backSub  btn">下一步</button>' +
                    '</div></div>';
            }
        }
        if(_this.isPhone){
            $('.login-wrapper').empty().append(htm);
        }else{
            $('body').append(htm);
        }

        if(type=='login'){
            //先将手机框聚焦、防止未检测是否未注册
            $('input[name=userPhone]').focus();
        }
        //获取图片验证码
        if(type=="reg"||type=='backPsd'){
            $('.imgCode').trigger('click');
        }
        if(type=='regSet'||type=='backPsdSet'){ //发送短信验证码
            $('.sendCode').trigger('click');
        }

    }
    //短信发送倒计时
    this.settime = function (obj, text) {  //text：用来区分两个引用未发送默认值
        _this.text = text ? text : '获取验证码';
        if (_this.timeFlag) {
            if (_this.countdown == 0) {
                obj.removeAttr("disabled");
                obj.text(_this.text);
                _this.countdown = 60;
                return;
            } else {
                obj.attr("disabled", true);
                obj.text( "重发"+_this.countdown+"s");
                _this.countdown--;
            }
        } else {
            obj.removeAttr("disabled");
            obj.text(_this.text);
            _this.countdown = 60;
            return false;
        }
        setTimeout(function () {
            _this.settime(obj)

        }, 1000)
    }
    //核对信息
    this.checkImgCode=function() {
        var val = $('input[name=VerificationCode]').val().toLowerCase();
        if (!val) {
            utils.msg('验证码不能为空');
            return false;
        }
        if (val != _this.imgCode) {
            utils.msg('验证码输入有误');
            return false;
        }
        return true
    }
    this.checkRePsd=function(psd, rePsd) {
        if (!_this.checkPsd(psd)) {
            return false;
        }
        if (!rePsd) {
            utils.msg("验证密码不能为空");
            return false;
        }
        if (psd !== rePsd) {
            utils.msg("两次密码输入不一致");
            return false;
        }
        return true;
    }
    this.checkPhone=function (phone) {
        if (!phone) {
            utils.msg("手机号不能为空");
            return false;
        }
        if (!validate.checkPhone(phone)) {
            utils.msg("请输入正确的手机号");
            return false;
        }
        return true;
    }
    this.checkPsd=function (psd) {
        if (!psd) {
            utils.msg("密码不能为空");
            return false;
        }
        if (psd.length < 6) {
            utils.msg("密码长度至少为6位");
            return false;
        }
        return true;
    }
}

if($('.loginPage').length){
    var loginInit=new LoginInit({isPhone:true});
    loginInit.init();
}else{
    var loginInit=new LoginInit({isPhone:false});
    loginInit.init();
}






