/**
 * @authors ZhangLiBing
 * @date    2017-08-15 21:45:54
 */

//引入商务通
document.write('<script language="javascript" src="http://kht.zoosnet.net/JS/LsJS.aspx?siteid=KHT98825282&float=1&lng=cn"></script>')

$('body').on('click','.consulting,.contactHer,.contactHer-click img',function(){
    // $('#LRfloater0').trigger('click');
    openZoosUrl('chatwin');
})
//返回顶部
$.fn.extend({
    //返回顶部
    backTop: function (oh) {
        var oh = oh || 300;
        var top;
        var t;
        var that = this;
        this.hide();
        $(window).scroll(function () {
            if ($(window).scrollTop() > oh) {
                that.show();
                clearTimeout(t);
                t = setTimeout(function () {
                    that.animate({bottom: 120}, 200, function () {
                        that.animate({bottom: 102}, 200);
                    });
                }, 200);
            } else {
                that.hide();
            }
        });
        this.click(function () {
            $({someValue: $(window).scrollTop()}).animate(
                {someValue: 0}, {
                    duration: 700,
                    step: function () {
                        $(window).scrollTop(this.someValue);
                    }
                })
        })
    }

})
$('.backTop').backTop();

//验证
var Validate = function () {
    //检查手机号码是否正确
    this.checkPhone = function (phone) {
        var preg = /^1[34578]\d{9}$/;
        if (preg.test(phone)) {
            return true;
        }
        return false;
    }
    //检查电话号码是否正确
    this.checkTel = function (tel) {
        var reg = /^0\d{2,3}-?\d{7,8}$/;
        if (reg.test(tel)) {
            return true;
        }
        return false;
    }
    //检查字符串长度是否超过最大长度
    this.checkMaxLength = function (str, maxLength) {
        if ($.trim(str).length > maxLength) {
            return false;
        }
        return true;
    }
    //检查字符串长度是否超过最小长度
    this.checkMinLength = function (str, minLength) {
        if ($.trim(str).length < minLength) {
            return false;
        }
        return true;
    }
    //检查是否为空
    this.checkEmpty = function (str) {
        if ($.trim(str).length <= 0) {
            return true;
        }
        return false;
    }

    //检查密码格式是否正确
    this.checkPassword = function (str) {
        //var str= $.trim(str);
        // var preg=/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,12}$/;
        if (str.length < 6) {
            return false;
        }
        return true;
    }
    //检验字符串是否是汉字（只能输入汉字）
    this.checkChinese = function (str) {
        var str = $.trim(str);
        var reg = /[\u4E00-\u9FA5]/g;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    }
    //检验字符串是否是汉字或字母
    this.checkChineseOrLetter = function (str) {
        var str = $.trim(str);
        var reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    }
    //检验字符串是否是数字或大写字母
    this.checkNumOrLetter = function (str) {
        var str = $.trim(str);
        var reg = /[A-Z0-9]/;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    }
    //检验邮箱格式是否正确
    this.checkEmail = function (str) {
        var str = $.trim(str);
        if (!str) {
            utils.msg('邮箱不能为空');
            return false;
        }
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (!reg.test(str)) {
            utils.msg('请输入正确的邮箱');
            return false;
        }
        return true;
    }
    //检验QQ是否正确
    this.checkQQ = function (str) {
        var str = $.trim(str);
        if (!str) {
            utils.msg('QQ不能为空');
            return false;
        }
        if (str.search(/^[1-9]\d{4,9}$/) != -1) {
            return true;
        }
        utils.msg('请输入正确的QQ');
        return false;
    }
    //检验密码强度
    this.checkStrong = function (val) {
        var modes = 0;
        if (val.length < 6) return false;
        if (/\d/.test(val)) modes++; //数字
        if (/[a-zA-Z]/.test(val)) modes++; //大写小写
        if (/\W/.test(val)) modes++; //特殊字符
        return modes;
    };
}
var validate = new Validate();


//公用方法
var utils = {
    /*提示信息*/
    url: api.host,
    msg: function (title) {
        if ($(".msg").length > 0) $(".msg").remove();
        var msg = $("<div class='msg'>提示：" + title + "</div>").appendTo("body");
        msg.css({"opacity": "1", "z-index": "100000000000"});
        setTimeout(function () {
            msg.css({"opacity": "0", "z-index": "-1"});
        }, 2000);
    },
    //头像、图片上传
    addAvatar: function (options) {  //图片上传
        var that = this;
        var isHttp=options.fileInput=="publish"?false:true;
        var type='';
        if(options.type){
            type='&type='+options.type
        }
        var url=that.url + 'CustomerHandle/'+options.path+'?customerId='+options.customerId+type;
        var uploader = new plupload.Uploader({
            browse_button: options.uploadBtn,
            url:url,
            flash_swf_url: 'js/common/Moxie.swf',
            silverlight_xap_url: 'js/common/Moxie.xap',
            max_file_size: '4mb',
            chunk_size: 0,
            multi_selection: false,
            filters: {
                prevent_duplicates: true //不允许队列中存在重复文件
            }
        });
        uploader.init();
        uploader.bind('FilesAdded', function (uploader, files) {
            uploader.start();
            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                var $li = $(uploader.settings.browse_button).closest('.upList');
                var $image = $li.find('.uploadPreview').children('img');
                var preloader = new mOxie.Image();
                preloader.onload = function () {
                    if(isHttp){ //不发送请求时不压缩图片
                        preloader.downsize(150, 150);
                    }else{
                        var btn= $(uploader.settings.browse_button);
                        btn.closest('.upList').find('a').css("background","transparent");//清除提示上传背景图片
                        btn.css({'fontSize':0}) //上传按钮字体隐藏
                        utils.msg('图片上传成功')
                    }
                    $image.attr("src", preloader.getAsDataURL());
                    // console.log(preloader.getAsDataURL())
                };

                preloader.load(file.getSource());
            }
        });
        uploader.bind('Error', function (uploader, errObject) {
            if(isHttp){
                utils.msg(errObject.message);
            }

        })
        uploader.bind('fileUploaded', function (uploader, file, response) {
            if(!isHttp){
                return false;
            }
            var data = JSON.parse(response.response);
            console.log(data);
            if(data.Success){
                utils.msg("图片上传成功");
                var btn=$('#'+options.uploadBtn)
                // btn.css("fontSize",0);
                btn.closest('.upList').find('i').remove();
                if(options.type){  //返回图片id 、保存到按钮中
                    btn.attr('dataId',data.UploadIDPicture.IDPictureId);
                    var saveUrl=options.type==1?"IdPictureUrl":"ProfessionalLicensesUrl";
                    userInfo[saveUrl]=data.UploadIDPicture.IDPictureUrl;
                    // userInfo.ProfessionalLicensesUrl=data.UploadIDPicture.IDPictureUrl;

                    saveUserInfo();
                    return false;
                }
                var imgPath=data.UploadAvatar.AvatarUrl;
                userInfo.AvatarUrl=imgPath;//跟新本地缓存头像
                $('.loginAvatar img').attr('src',imgPath);
                $('#' + options.fileInput).val(imgPath);
                saveUserInfo();
            }
        })
    },
    //获取搜索框值函数
    getRequest: function () {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                //之前用了unescape()
            }
        }
        return theRequest;
    },
    //转义  将html标签转义
    HTMLEncode: function (html) {
        var temp = document.createElement("div");
        (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    //反转义 将html标签反转义
    HTMLDecode: function (text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    },
    textDecode:function(str){
		if(!str){return "";}
        str = str.replace(/_@/g, '<br/>');//IE9、FF、chrome
        str = str.replace(/\s/g, '&nbsp;');//空格处理
        return str;
    },
    textAreaDecode:function(str){
        str = str.replace(/_@/g, '\n').replace(/_#/g, '\r');
        return str;
    },
    textEncode:function(str){
        str = str.replace(/\n/g, '_@').replace(/\r/g, '_#');
        return str;
    },
    //获取以选择擅长领域、并且以逗号隔开
    getSkilled:function(){
        var SkilledArr=[];
        $.each($('.good-list span.active'),function(i,v){
            SkilledArr.push($(v).text())
        })
        return SkilledArr.join(',');
    },
    setSkilled:function(data){
		if(!data){return '';}
        var goodArr=data.split(',');
        var htm=''
        for(var i=0;i<goodArr.length;i++){
            htm+='<span>'+goodArr[i]+'</span>';
        }
        return htm;
    },
    //访问页面权限设置
    AccessPermissions:function(type){ //type:0、或者未传参数设置会员 、1:专家权限
        if(type){
            if(!userInfo||userInfo.SystemName!="Consultant"){ //权限
                window.location.href="index.html";
            }
        }else{
            if(!userInfo){ //权限
                window.location.href="index.html";
            }
        }
    },
    //检测是否为pc端
    isPhone:function()  {
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
    },
    //是否已登录
    isLogin:function(option){
        if(!userInfo){ //权限
            if(option.isPhone){
                window.location.href='login.html'
            }
            loginInit.createLoginHtml('login');
            return false;
        }
        return true;
    },
    //公用上传头像
    avatarInit:function(){
        var avatarPath=userInfo.AvatarUrl?userInfo.AvatarUrl:"http://www.jizhaojk.com/images/login_avatar.png";
        if(avatarPath){
            $('input[name=avatar]').val(avatarPath);
            $('.AvatarUrl').attr('src',avatarPath)
        }
        utils.zooming($('.upList'));
        var uploadOptions = {
            uploadBtn: 'avatar-btn',
            fileInput: 'avatar',
            path: 'UploadAvatar',
            customerId:userInfo.customerId
        }
        utils.addAvatar(uploadOptions);
    },
    //转换图片路径
    imgReset:function(target){
        var imgSrc=utils.pathTogether(target.find('img').attr('src'))
        target.find('img').attr({'src':imgSrc});
        target.find('img').css({'maxWidth':'100%','height':'auto'});
    },
    pathTogether:function(src){
        if(src){
            return "http://121.43.167.104:8088"+src;
        }
        return false;
    },
    //图片等比例缩放
    zooming:function(target){
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


}
//保存登录返回信息
function saveloginData(data) {
    var customer = data.customer;
    var Roles = customer.CustomerRoles[0]; //专家时数组有两个值 第一个暂时是最新的
    var obj = {
        AvatarUrl: data.AvatarUrl,
        Gender: data.Gender,
        IdPictureUrl: data.IdPictureUrl,
        ProfessionalLicensesUrl: data.ProfessionalLicensesUrl,
        customerId: customer.Id,
        Email:customer.Email,
        QQ:customer.QQ,
        NickName: customer.NickName,
        RealName: customer.RealName,
        Username: customer.Username,  //账号
        SystemName: Roles.SystemName,//Registered:用户   Consultant:咨询师
        StatusForConsultant: customer.StatusForConsultant,  //审核到第几部 0、null未审核  1第一步审核完
        WeChat: customer.WeChat,
        Birthday:data.dateOfBirth,
        CustomerGuid:customer.CustomerGuid
    };
    var newObj = $.extend({}, obj, customer.ConsultantInfo,customer.Addresses[0])
    userInfo = newObj;
    saveUserInfo();  //保存到缓存
}


//-------------------------获取省市区信息、并渲染已有值-------------------------------
function GetProvince(option) {
    var _this = this;
    this.isNeedEvent = option? true : false; //是否需要触发点击是事件（选择省市区）
    this.isInit = option? true : false; //是否需要渲染省市区
    this.AddressData = []; //保存省市区
    this.init = function () {
        api.getProvinces({}, _this.getProvinceSuc);
        if (_this.isNeedEvent) {
            this.event();
        }
    }
    this.event = function () {
        //切换省份
        $('.province').change(function () {
            _this.removeAddSet.call($(this), 0);
        })
        //切换城市
        $('.city').change(function () {
            _this.removeAddSet.call($(this), 1);
        })
    }
    this.getProvinceSuc = function (data) {
        console.log(data)
        if (!data.Success) {
            if (data.Code == "201") {

            }
            return utils.msg(data.message);
        }
        _this.AddressData = data.GetPCA;
        //列出省份
        var htm = _this.createAddressSelect(0);
        $('.province').append(htm);
        if(_this.isInit){
             _this.initBasic();
        }
    }
    this.removeAddSet = function (type) {
        var arr = [".city", ".area"];
        var id = $(this).val();
        var htm = _this.createAddressSelect(id);
        for (var i = type; i <= arr.length; i++) {
            $(arr[i]).find('option:gt(0)').remove();
        }
        $(arr[type]).append(htm);
    }
    this.createAddressSelect = function (parentId) {
        var htm = '';
        for (var i = 0; i < _this.AddressData.length; i++) {
            if (_this.AddressData[i].parentid == parentId) {
                htm += '<option value="' + _this.AddressData[i].childid + '">' + _this.AddressData[i].areaname + '</option>';
            }
        }
        return htm;
    }
    this.initBasic = function () {
        if (userInfo.StatusForConsultant||userInfo.AreaId) { //如果已审核第一步
            $('.province option[value=' + userInfo.ProvinceId + ']').attr('selected', true);
            _this.createSelected(userInfo.ProvinceId, userInfo.CityId, $('.city'));
            _this.createSelected(userInfo.CityId, userInfo.AreaId, $('.area'));
        }
    }
    //根据省市区由低级别确定高级别option内容以及选中值
    this.createSelected = function (pid, cid, target) {
        var optionsHtm = _this.createAddressSelect(pid);
        target.find('option:gt(0)').remove();
        target.append(optionsHtm);
        target.find('option[value=' + cid + ']').attr('selected', true);
    }
}

//--------------------------获取擅长领域、缓存到本地、并渲染已有值---------------------------------
function GetGoodFields(isSelect) {
    var _this = this;
    this.isSelect=isSelect?true:false;//是否创建select下拉框
    this.init = function () {
        var goodFields = JSON.parse(sessionStorage.getItem("goodFields")); //先获取本地数据、
        if(goodFields){//如果本地有则不从服务器获取数据
            _this.initData(goodFields);  //渲染数据
            return false;
        }
        api.GetGoodFields({}, _this.GetGoodFieldsSuc);
    }
    this.GetGoodFieldsSuc = function (data) {
        console.log(data)
        if (!data.Success) {
            if (data.Code == "201") {

            }
            return utils.msg("请求出错");
        }
        var data = data.GetGoodFields;
        var goodFields = JSON.stringify(data);
        sessionStorage.setItem("goodFields", goodFields); //保存到本地
        _this.initData(data);  //渲染数据

    }
    this.initData=function(data){
        //擅长领域赋值
        var htm = '';
        if(_this.isSelect){
            htm='<option value="">请选择擅长领域</option>'
        }
        for (var i = 0; i < data.length; i++) {
            var val=data[i].GoodField;
            if(_this.isSelect){
                htm+='<option value="' + val + '">' + val + '</option> '
            }else{
                htm += '<span>' + val + '</span> '
            }

        }
        $('.good-list').empty().append(htm);
        if(!_this.isSelect&&userInfo.Skilled){//如果缓存有值并且是选择擅长领域时渲染
            var SkilledArr=userInfo.Skilled.split(',');
            $.each($('.good-list span'),function(i,v){
                for(var j=0;j<SkilledArr.length;j++){
                    if($(this).text()==SkilledArr[j]){
                        $(this).addClass('active');
                    }
                }

            })
        }
    }


}


//---------------------话题获取、渲染 、点击到详情页、处理请求无数据不在请求--------------------
function TopicsInit(){
    var _this=this;
    this.TopicsType = 0;  //0:全部  1：已解答  2：未解答
    this.TopicsIndex = 1;
    this.isPhone=utils.isPhone();
    this.PageSize=5; //默认一次刷新5条
    this.totlePage=1;
    this.init=function(){
        _this.getTopics();
        _this.event();
    }
    //获取内容
    this.getTopics=function () {
        var option = {
            Page: _this.TopicsIndex,
            PageSize:_this.PageSize,
            type: _this.TopicsType
        }
        api.getAllTopics(option, _this.getAllTopicsSuc)
    }
    this.getAllTopicsSuc=function(data) {
        console.log(data);
        if (!data.Success) {
            if (data.Code == "201") {
                return false
            }
            return utils.msg("请求出错");
        }

        _this.totlePage=Math.ceil(Number(data.Total/_this.PageSize));
        _this.createTopicsHtml(data.GetAllTopics);
        if(!_this.isPhone){
            _this.pagination(_this.TopicsIndex,data.Total);
        }

    }
    //创建公益解答列表
    this.createTopicsHtml=function(data) {
        var htm = '';
        for (var i = 0; i < data.length; i++) {
            htm += '<li class="list_item" dataId="'+data[i].Id +'">' +
                '<h2 class="answer_title">'+data[i].Subject+' </h2>' +
                '<div class="answer_content">'+utils.textDecode(data[i].Details)+'</div>' +
                '<div class="answer_info">' +
                '<span class="answer_author">'+data[i].Customer.RealName+'</span>' +
                '<span class="answer_time">'+data[i].CreatedOnUtc+'</span>' +
                '<span class="answer_views">浏览数：<i class="view_num">'+data[i].Views+'</i></span>' +
                '<a class="look_all" href="javascript:;">查看全文 》</a>' +
                '</div>' +
                '</li>';
        }
        $('.answer_list').empty().append(htm);
    }
    this.event=function(){
        //话题详情
        $('.answer_list').on('click','li', function () {
            var Id=$(this).attr('dataId');
            window.location.href = 'grow_topic.html?Id='+Id;
        })
        $('.tab_link li').on('click', function () {
            if ($(this).hasClass()) { //点击本身返回
                return false;
            }
            $(this).addClass('active').siblings().removeClass('active');
            _this.TopicsType = $(this).index();
            _this.TopicsIndex = 1;
            _this.getTopics();
        })
        $('.answerPre').on('click',function(){
             _this.TopicsIndex-=1;
            if(_this.TopicsIndex<1){
                _this.TopicsIndex=1;
                return utils.msg('已经是第一页')
            }
            _this.getTopics();

        })
        $('.answerNext').on('click',function(){
            _this.TopicsIndex+=1;
            if(_this.TopicsIndex>_this.totlePage){
                console.log(_this.totlePage)
                _this.TopicsIndex=_this.totlePage;
                return utils.msg('已经是最后一页')
            }
            _this.getTopics();
        })

    }
    //启动分页插件
    this.pagination=function(currentPage,total) {
        var totalPage = Math.ceil(total / _this.PageSize);
        //分页函数
        $("#pagination2").pagination({
            currentPage: currentPage,
            totalPage: totalPage,
            prevPageText: "《",// 上一页文本
            nextPageText: "》",// 下一页文本
            callback: function (current) { //返回当前页面
                _this.TopicsIndex=current;
                _this.getTopics();
            }
        });
    }
}

//------------------渲染文章详情--------------
function InitBlogPost(){
    this.urlData=utils.getRequest();
    var _this=this;
    this.init=function(){
        if(_this.urlData.type){
            $('title').text('共享文章详情页');
            var htm='<a href="training_grow.html">培训成长</a><span>》共享文章详情页</span>';
            $('.nav-title').empty().append(htm);
        }
        api.getBlogPost({Id:_this.urlData.Id},_this.getBlogPostSuc);
    }
    this.getBlogPostSuc=function(data){
        console.log(data)
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        // utils.msg('请求成功');
        _this._initData(data)

    }
    this._initData=function(data){
        $('.view_img img').attr('src',data.PictureUrl);
        var data=data.blogpost;
        $('.information-title').text(data.Title);
        $('.time').text(data.CreatedOnUtc);
        $('.through-total').text(data.Views);
        $('.information-view-box .content').html(utils.textDecode(data.Body));
    }
}


//-------------------会员、专家中心初始化页面-------
function InitCenter(type){
    var _this=this;
    this.type=type; //0会员  1：专家
    this.init=function () {
        utils.AccessPermissions(_this.type) //访问权限
        var sexImg=userInfo.Gender=="F"?'images/center/female-ava.png':'images/center/male-ava.png';
        var AvatarUrl= userInfo.AvatarUrl?userInfo.AvatarUrl:"http://www.jizhaojk.com/images/login_avatar.png";
        $('.center-avatar img').attr('src',AvatarUrl);
        $('.center-name').text(userInfo.RealName);
        $('.info-con img').attr('src',sexImg);
        utils.zooming($('.center-avatar'));
        _this.event();
    }
    this.event=function () {
        //注销账号
        $('.cancellation_btn').on('click',function(){
            api.setLogout({Username:userInfo.Username},_this.setLogoutSuc);
            setTimeout(function(){
                sessionStorage.removeItem("ss_userInfo");//清除缓冲
                window.location.href='index.html';
            },1000)
        })
    }
    this.setLogoutSuc=function(data){
        console.log(data)
        if (!data.Success) {
            if (data.Code == "201") {
                return false
            }
            return utils.msg("请求出错");
        }
    }
}

//会员订单列表
function InitMemberOrder(option){
    var _this=this;
    this.stateObj={10:"未付款", 11:"已付款", 12:"付款失败", 13:"取消付款",14:"已完成", 15:"已取消"} //状态对应
    this.isPhone=option.isPhone;
    this.init=function(){
        utils.AccessPermissions();
        api.getMemberOrderList({customerId: userInfo.customerId}, _this.getMemberOrderListSuc);
    }
    this.getMemberOrderListSuc=function(data) {
        console.log(data);
        if (!data.Success) {
            if (data.Code == "201") {
                return false
            }
            return utils.msg("请求出错");
        }
        var data=data.GetCustomerOrderList;
        _this.createHtml(data)
    }

    this.createHtml=function(data) {
        var htm = '';
        for(var i=0;i<data.length;i++){
            if(_this.isPhone){
                htm+=' <li class="item">'+
                    '<div class="box">'+
                    '<div><span class="name">'+data[i].ProductTitle+'</span><span class="price">￥'+data[i].OrderTotal+'</span></div>'+
                    '<div><span class="state">'+_this.stateObj[data[i].OrderStatus]+'</span><span class="time-box">'+data[i].CreatedOnUtc+'</span></div>'+
                    '</div>'+
                    '<button class="btn">联系客服</button>'+
                    '</li>'
            }else{
                htm += '<li class="item">' +
                    '<ul class="clear">' +
                    '<li class="list-name">'+data[i].ProductTitle+'</li>' +
                    '<li class="price">'+data[i].OrderTotal+'</li>' +
                    '<li class="time-box"><p>'+data[i].CreatedOnUtc+'</p></li>' +
                    '<li class="state">'+_this.stateObj[data[i].OrderStatus]+'</li>' +
                    '<li class="btnClass"><button class="btn">联系客服</button></li>' +
                    '</ul>' +
                    '</li>'
            }

        }
        $('.list-items').empty().append(htm);
    }
}

//导航栏点击事件
var navLink=['index','testReg','training_grow','consultation','expertsIn','brand_display','about']
$('.nav_link li,.menu_list li').on('click',function(){
    var index=$(this).index();
    window.open(navLink[index]+'.html','_blank');
})

var timer;
timer=setInterval(function(){
    if($('#LRfloater0').length){
        if(!utils.isPhone()){
            $('#LRfloater0').css({display:'none'});
            $('.contactHer-click').css({display:'block'});
        }else{
            $('#LRfloater0').css({top:'150px'});
        }
        clearInterval(timer)
    }
},200)

