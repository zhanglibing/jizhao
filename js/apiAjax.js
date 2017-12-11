var apiAjax = function () {
    var _this = this;
    // this.host ='http://skyblue.imwork.net/'; //开发测试
    this.host = 'http://121.43.167.104:8088/'; //正式服务器
    this.post = function (options, success) {
        $.ajax({
            type: 'POST',
            url: _this.host + options.path,
            data: options.params,
            // data: JSON.stringify(options.params),
            crossDomain: true, //解决post请求自动变为get请求
            dataType: 'json',
            // dataType: 'jsonp',
            // ContentType: "application/x-www-form-urlencoded",
            success: function (msg) {
                success(msg, options);
            },
            error: function (msg) {
                console.log(msg)
                // utils.msg(msg.message)
            }
        });
    }

    //--------------------------------登录、注册、找回密码-----------------------------------------/
    this.Register = function (params, success) {  //用户注册
        var options = {
            path: 'CustomerHandle/Register',
            params: params
        }
        this.post(options, success);
    }
    this.userLogin = function (params, success) {  //用户登录  ***ok
        var options = {
            path: 'CustomerHandle/LoginNew',
            params: params
        }
        this.post(options, success);
    }
    this.SendSMS = function (params, success) {  //发送短信验证码  ***ok
        var options = {
            path: 'CustomerHandle/SendSMS',
            params: params
        }
        this.post(options, success);
    }
    this.phoneIsReg = function (params, success) {  //用户是否已注册  ***ok
        var options = {
            path: 'CustomerHandle/CheckUsernameAvailability',
            params: params
        }
        this.post(options, success);
    }
    this.userBackPsd = function (params, success) {  //用户找回密码
        var options = {
            path: 'CustomerHandle/ChagePassword',   //Username 参数
            params: params
        }
        this.post(options, success);
    }
    this.setLogout = function (params, success) {  //用户注销
        var options = {
            path: 'CustomerHandle/Logout',
            params: params
        }
        this.post(options, success);
    }
    this.getImgCode = function (params, success) {  //获取图片验证码 ***ok
        var options = {
            path: 'CustomerHandle/CaptchaCode',
            params: params
        }
        this.post(options, success);
    }

    this.getProvinces = function (params, success) {  //获取省市区 ***ok
        var options = {
            path: 'CustomerHandle/GetPCA',
            params: params
        }
        this.post(options, success);
    }
    this.getBlogList = function (params, success) {  //获取分页文章\以审核文章
        var options = {
            path: 'BlogHandle/GetAllBlogList',
            params: params
        }
        this.post(options, success);
    }
    this.CreateBlogPost = function (params, success) {  //发表文章
        var options = {
            path: 'BlogHandle/CreateBlogpost',
            params: params
        }
        this.post(options, success);
    }
    this.CreateTopic = function (params, success) {  //发表话题
        var options = {
            path: 'ForumsHandle/TopicCreate',
            params: params
        }
        this.post(options, success);
    }

    this.setMemberInfo = function (params, success) {  //设置会员个人信息
        var options = {
            path: 'CustomerHandle/EditCustomerInfo',
            params: params
        }
        this.post(options, success);
    }
    this.changeExpertBasic = function (params, success) {  //修改专家基本信息 ***ok
        var options = {
            path: 'CustomerHandle/EditConsultanInfo',
            params: params
        }
        this.post(options, success);
    }
    this.setExpertBasic = function (params, success) {  //设置专家基本信息 ***ok
        var options = {
            path: 'CustomerHandle/BeConsultant_one',
            params: params
        }
        this.post(options, success);
    }
    this.setBackground = function (params, success) {  //设置专家从业背景 ***ok
        var options = {
            path: 'CustomerHandle/BeConsultant_confirm',
            params: params
        }
        this.post(options, success);
    }
    this.GetGoodFields = function (params, success) {  //获取擅长领域 ***ok
        var options = {
            path: 'CustomerHandle/GetGoodFields',
            params: params
        }
        this.post(options, success);
    }

    this.getAllTopics = function (params, success) {  //获取公益解答
        var options = {
            path: 'ForumsHandle/GetAllTopics',
            params: params
        }
        this.post(options, success);
    }

    this.getTopicsView = function (params, success) {  //获取公益解答详情页面   TopicId
        var options = {
            path: 'ForumsHandle/Topic',
            params: params
        }
        this.post(options, success);
    }
    this.postCreate = function (params, success) {  //回复话题
        var options = {
            path: 'ForumsHandle/postCreate',
            params: params
        }
        this.post(options, success);
    }
    this.postPostCreate = function (params, success) {  //话题回复的回复
        var options = {
            path: 'ForumsHandle/postpostCreate',
            params: params
        }
        this.post(options, success);
    }
    this.getBlogPost = function (params, success) {  //获取文章详情页面   Id
        var options = {
            path: 'BlogHandle/GetBlogpostById',
            params: params
        }
        this.post(options, success);
    }

    this.search = function (params, success) {  //咨询师页面搜索
        var options = {
            path: 'CustomerHandle/SearchCustomers',
            params: params
        }
        this.post(options, success);
    }

    this.getConsultantInfo = function (params, success) {  //咨询师详情页
        var options = {
            path: 'CustomerHandle/GetConsultantInfo',
            params: params
        }
        this.post(options, success);
    }
    this.getAllValidProducts = function (params, success) {  //所有有效产品列表 \考试报名
        var options = {
            path: 'ProductHandle/GetAllValidProducts',
            params: params
        }
        this.post(options, success);
    }
    this.getProductDetails = function (params, success) {  //获取产品详情 \考试报名
        var options = {
            path: 'ProductHandle/ProductDetails',
            params: params
        }
        this.post(options, success);
    }

    this.getAllNews = function (params, success) {  //获取新闻列表
        var options = {
            path: 'NewsHandle/GetAllNews',
            params: params
        }
        this.post(options, success);
    }
    this.getNews = function (params, success) {  //获取新闻详情
        var options = {
            path: 'NewsHandle/News',
            params: params
        }
        this.post(options, success);
    }
    this.getNewNews = function (params, success) {  //获取最新新闻详情
        var options = {
            path: 'NewsHandle/GetNewNews',
            params: params
        }
        this.post(options, success);
    }

    this.getMemberOrderList = function (params, success) {  //获取会员订单列表
        var options = {
            path: 'OrderHandle/GetCustomerOrderList',
            params: params
        }
        this.post(options, success);
    }
    this.getExpertOrderList = function (params, success) {  //获取专家订单列表
        var options = {
            path: 'OrderHandle/GetConsultantOrderList',
            params: params
        }
        this.post(options, success);
    }
    this.setComplete = function (params, success) {  //专家订单完成
        var options = {
            path: 'OrderHandle/CompleteOrderStauts',
            params: params
        }
        this.post(options, success);
    }
    this.payment = function (params, success) {  //付款
        var options = {
            path: 'OrderHandle/PCOrder',
            params: params
        }
        this.post(options, success);
    }
    this.wxOeder = function (params, success) {  //微信公众号付款
        var options = {
            path: 'OrderHandle/WXOeder',
            params: params
        }
        this.post(options, success);
    }
    this.WXStartINQY = function (params, success) {  //微信公众号付款启动
        var options = {
            path: 'OrderHandle/WXStartINQY',
            params: params
        }
        this.post(options, success);
    }
    this.getOrderStatusForPay = function (params, success) { //轮询订单状态
        var options = {
            path: 'OrderHandle/GetOrderStatusForPay',
            params: params
        }
        this.post(options, success);
    }
    this.setOrderSendSMS = function (params, success) { //轮询订单状态
        var options = {
            path: 'OrderHandle/SendSMS',
            params: params
        }
        this.post(options, success);
    }

    // this.test11 = function (params, success) { //轮询订单状态
    //     var options = {
    //         path: 'Handler/notify_url.ashx',
    //         params: params
    //     }
    //     this.post(options, success);
    // }


    // this.getTestQR = function (params, success) { //而魏玛
    //     var options = {
    //         path: 'OrderHandle/testQR',
    //         params: params
    //     }
    //     this.post(options, success);
    // }



}
var api = new apiAjax();


