/**
 *
 * @authors zhanglibing (1053081179@qq.com)
 * @date    2017-7-17 13:48:30
 *
 */
//--------------PC、微信公众号支付-----------------/
function Pay(obj){
    var _this=this;
    this.ProductId=''; //产品Id
    this.ProductNum=''; //数量
    this.ProductName='';  //产品名称
    this.price='';      //单价
    this.ProductType=obj.ProductType;  //ZS:证书 V:视频  A:音频 ZXS:咨询师服务
    this.orderTotal='';  //总金额
    this.countLast=360; //倒计时数  轮询订单状态
    this.orderId=''; //轮询订单id
    this.time=null;  //轮询时间函数
    this.isPhone=utils.isPhone();
    this.isProcess=obj.isProcess;
    this.role="member"  //默认会员
    //初始化
    this.init=function(){
        if(_this.isProcess){ //微信端订单处理中
            _this.orderId=userInfo.orderId; //用于轮询订单
            _this.ProductType=userInfo.ProductType;
            _this.ProductName=userInfo.ProductName;
            _this.orderTotal=userInfo.orderTotal;
            _this.state=utils.getRequest().state; //0:付款成功   1：掉起支付失败   -1：取消付款
            // var orderNum=urlData.orderNum;
            if(userInfo.SystemName=="Consultant"){
                _this.role="expert" //专家
            }
            _this.pollingOrder();
            return false;
        }
        _this.event();
        console.log(_this.orderId)
    }
    //点击事件
    this.event=function(){
        //选择支付类型
        $('body').on('click','.pay_select .btn',function(){
            var payType=$(this).hasClass('wechat_pay')?"WXP":"ALP"; //支付类型
            if(_this.isPhone&&_this.isWeiXin()&&payType=="ALP"){
                return utils.msg("微信端不支持调用支付宝支付");
            }
            _this.payType=payType;
            _this.placeOrder();
        })

        //再次获取二维码
        $('body').on('click','.getQrcodeAgain',function(){
            _this.placeOrder();
        })
        //取消弹框
        $('body').on('click', '.bounces_box .close_btn,.mask,.cancel', function () {
            $('.bounces_box').remove();
        })
    }
    //下单获取支付二维码、支付链接(微信端支付)
    this.placeOrder=function(){
        var option={
            ProductId :_this.ProductId,
            ProductNum:_this.ProductNum,
            ProductName:_this.ProductName,
            price:_this.price*100,
            ProductType:_this.ProductType,
            orderTotal:_this.orderTotal*100,
            payType:_this.payType,
            customerId:userInfo.customerId
        }
        if(_this.isPhone){ //手机端暂时只支持微信支付
            if(_this.isWeiXin()){ //判断是否微信端支付
                option.frontUrl="http://www.jizhaojk.com/phone/order_process.html"; //付款成功后跳转的页面
                api.wxOeder(option,_this.placeOrderSuc);
                userInfo.ProductType=_this.ProductType;
                userInfo.ProductName=_this.ProductName;
                userInfo.orderTotal=_this.orderTotal;
                saveUserInfo();
                return false;
            }

            return utils.msg("请关注阿拉丁微信公众号或者电脑端支付");
        }
         _this.createPayHtml('payment');
         api.payment(option,_this.placeOrderSuc);

    }
    //获取二维码成功返回函数
    this.placeOrderSuc=function(data){
        console.log(data)
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        //微信端支付
        if(_this.isPhone){
            var data=data.WXOeder;
            var link=data.requestUrl;
            var option={
                CustomOrderNumber:data.CustomOrderNumber,
                Id:data.Id
            }
            userInfo.orderId=data.Id; //保存订单id 订单处理页面进行轮询用到
            saveUserInfo();
            api.WXStartINQY(option,_this.WXStartSuc) //请求后台开启查询连接
            window.open(link,"_blank");
            return false;
        }
        //pc端支付
        var data=data.PCOrder;
        $('.getQrcodeAgain').hide();
        var text=_this.payType=="WXP"?"微信":"支付宝";
        $('.pay_title h1').text(text+'支付二维码');
        $('.pay_Qrcode img').attr('src',data.imagestream);
        _this.orderId=data.Id;
        _this.pollingOrder();

    }
    this.WXStartSuc=function(data){
        console.log(data)
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
    }
    //轮询订单状态
    this.pollingOrder=function() {
       _this.time = setInterval(function(){
            _this.countLast -= 3;
            if(_this.countLast>0){
                api.getOrderStatusForPay({orderId:_this.orderId},_this.getOrderStatusSuc)
            }else{// 二维码失效
                _this.clearTime();
                $('.pay_title h1').text('二维码已失效');
                $('.getQrcodeAgain').show();
                $('.pay_Qrcode img').attr('src','images/pay/qrCodeFail.png');
            }
        },3000)
    }
    //清除轮询时间函数
    this.clearTime=function(){
        clearInterval(_this.time);
        _this.countLast = 180;
    }
    //轮询返回函数
    this.getOrderStatusSuc=function(data){
        console.log(data);
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        if(data.FoS){ //付款成功
            if(_this.isProcess){
                if(_this.state=="-1"||_this.state=="0"){
                    window.location.href=_this.role+"_orderList.html";
                }
            }
           _this.paySuccess();
        }
    }
    //付款成功执行函数
    this.paySuccess=function(){
        _this.clearTime() //停止轮询订单状态
        _this.createPayHtml('pay_success'); //付款成功提示
        setTimeout(function(){ $('.bounces_box').remove();},9000);
        var option={
            tel:userInfo.Username,
            Frompage:_this.ProductType,
            ProductTitle:_this.ProductName+_this.orderTotal+"元",
            customerGuid:userInfo.CustomerGuid
        }
        //发送短信提醒内容
        api.setOrderSendSMS(option,_this.SendSMSSuc);
        if(_this.isProcess){
            setTimeout(function(){
                window.location.href=_this.role+"_orderList.html";
            },1000)

            return fasle;
        }

    }
    //成功后请求后台发送短信
    this.SendSMSSuc=function(data){
       console.log(data)
    }
    //判断是否在微信端
    this.isWeiXin=function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }
    //创建弹框html
    this.createPayHtml=function(type) {
        $('.bounces_box').remove();
        var htm = '<div class="bounces_box">' +
            '<div class="mask"></div>' +
            '<div class="bounces_content">' +
            '<div class="close_btn"><img src="images/close.png" alt=""></div>';
        if (type == "paySelect") {
            htm += '<div class="common pay_select">' +
                '<div class="pay_title">' +
                '<h1>支付选择</h1>' +
                '<p>PAYMENT OPTIONS</p>' +
                '</div>' +
                '<div class="img-box clear">' +
                '<div class="weChat d-6">' +
                '<img src="images/pay/wechat.png" alt="">' +
                '</div>' +
                '<div class="alipay d-6">' +
                '<img src="images/pay/alipay.png" alt="">' +
                '</div>' +
                '</div>' +
                '<div class="btn_box">' +
                '<button class="wechat_pay btn">微信支付</button>' +
                '<button class="alipay_pay btn">支付宝支付</button>' +
                '</div>' +
                '</div>'
        }
        else if (type == 'pay_success') {
            htm += '<div class="common pay_success">' +
                '<div class="pay_result">' +
                '<img src="images/pay/pay_success.png" alt="">' +
                '</div>' +
                '<h1>支付成功</h1>' +
                '<p>感谢您的信任，谢谢。</p>' +
                '</div>';
        }
        else if (type == 'pay_fail') {
            htm += '<div class="common pay_fail">' +
                '<div class="pay_result">' +
                '<img src="images/pay/pay_fail.png" alt="">' +
                '</div>' +
                '<h1>支付失败，请联系客服</h1>' +
                '<p class="phone">电话：400-232-2324</p>' +
                '</div>'
        }
        else if (type == 'payment') {
            htm += '<div class="common payment">' +
                '<div class="pay_title">' +
                '<h1>支付二维码</h1>' +
                '<p>PAYMENT</p>' +
                '</div>' +
                '<div class="pay_Qrcode">' +
                '<img src="images/load.gif" alt="">' +
                '</div>' +
                '<div class="btn getQrcodeAgain">重新获取</div>' +
                '</div>';
        }

        htm += '</div></div>';
        $('body').append(htm);
    }
}
