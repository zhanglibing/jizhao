/**
 * Created by ZhangLiBing on 2017/8/25.
 */

$(function () {
    utils.AccessPermissions(0);

    //获取省市区
    var getAddrss = new GetProvince({isInit:true,isNeedEvent:true});

    //获取擅长领域
    var getGoodFields = new GetGoodFields();
    getGoodFields.init();

    //初始化页面
    function _init() {
        // 1先判断已审核到第几步
        var goTabIndex = userInfo.StatusForConsultant;
        goTabIndex = goTabIndex ? goTabIndex + 1 : 1;
        // goTabIndex=1  //模拟通过第几步
        if(goTabIndex==4){ //审核未通过
            goTabIndex=3;
            $('.ok-box').hide();
            $('.error-box').show();
        }
        _goTab(goTabIndex);
    }
    _init()


    //------------------------------基本信息提交--------------------------------
    $('.basic_submit').on('click', function () {
        var RealName = $.trim($('.RealName').val());      //真实姓名
        var Gender = $.trim($('.sex-box .active').text());  //F:女  M:男
        var Pid = $('.province option:selected').val();
        var Cid = $('.city option:selected').val();
        var Aid = $('.area option:selected').val();
        var IDPicture=$('#photoId-btn').attr('dataid');
        var IDType = $('.IDType option:selected').val(); //身份证类型
        var IDNumber = $('.IDNumber').val(); //身份证号
        var Education = $('.Education option:selected').val();
        var WeChat = $('.WeChat').val();
        var Address1 = $('.Address1').val();
        var Birthday = '1992-09-04';
        var Pid1 = $('.province option:selected').text();
        var Cid1 = $('.city option:selected').text();
        var Aid1 = $('.area option:selected').text();
        var Address2=Pid1+"-"+Cid1+"-"+Aid1;
        var option = {
            RealName: RealName,
            Gender: Gender,
            Pid: Pid,
            Cid: Cid,
            Aid: Aid,
            IDPicture:IDPicture,
            // imageStream: imageStream,
            IDType: IDType,
            IDNumber: IDNumber,
            Education: Education,
            WeChat: WeChat,
            Birthday: Birthday,
            customerId: userInfo.customerId,
            Address1:Address1,  //面询地址
            Address2:Address2
        }
        console.log(option);
        if(!checkBasic(option)){return false;}
        api.setExpertBasic(option, setExpertBasicSuc);
    })

    function setExpertBasicSuc(data,option) {
        console.log(data);
        if (!data.Success) {
            if (data.Code == "201") {
                return false;
            }
            return utils.msg("请求出错");
        }
        if(!userInfo.StatusForConsultant){
            userInfo.StatusForConsultant=1;
        }
        userInfo=$.extend(userInfo,option.params);
        saveUserInfo();
        _goTab(2);
    }


    //-------------------------------从业背景提交----------------------------------
    //返回上一步
    $('.pre-btn').on('click', function () {
        _goTab(1);
    })

    //从业背景提交
    $('.background_submit').on('click', function () {
        var ProfessionalLicensesTitle = $('.ProfessionalLicensesTitle option:selected').val();//资质名称
        var ProfessionalLicenses=$('#qualification-btn').attr('dataId');//资质证明照片
        var ProfessionalLicenseNumber = $('.ProfessionalLicenseNumber').val();  //证件编号
        var WorkingYears = $('.WorkingYears').val();//执业年限
        var ConsultingHours = $('.ConsultingHours').val();//计咨询时长
        var CareerBackground = utils.textEncode($('.CareerBackground').val());
        var SerivcePrice = $('.SerivcePrice').val();//服务费用
        var PersonalIntroduction = utils.textEncode($('.PersonalIntroduction').val());//个人简介
        // var PracticeStyle = utils.textEncode($('.PracticeStyle').val());//执业风格   暂时取消
        var PracticeStyle = '暂时取消';
        var Recommender = $('.Recommender').val();//推荐人
        var Skilled=utils.getSkilled();
        var option = {
            ProfessionalLicensesTitle: ProfessionalLicensesTitle,
            ProfessionalLicenses:ProfessionalLicenses,
            ProfessionalLicenseNumber: ProfessionalLicenseNumber,
            WorkingYears: WorkingYears,
            ConsultingHours: ConsultingHours,
            ConsultingNumber: 0, //预留参数 咨询数据
            CustomerNumber: 0, //预留参数 客户数据
            ArticleNumber: 0, //预留参数 文章数据
            Income: 0, //预留参数  收入
            SerivcePrice: SerivcePrice,
            CareerBackground: CareerBackground,
            PersonalIntroduction: PersonalIntroduction,
            PracticeStyle: PracticeStyle,
            Recommender: Recommender,
            customerId: userInfo.customerId,
            Skilled:Skilled
        }
        console.log(option)
        if(!checkBackground(option)){return false;}
        api.setBackground(option, setBackgroundSuc);
    })

    function setBackgroundSuc(data,option) {
        console.log(data);
        if (!data.Success) {
            if (data.Code == "201") {
                return false;
            }
            return utils.msg("请求出错");
        }
        if(userInfo.StatusForConsultant==1){
            userInfo.StatusForConsultant=2;
        }
        userInfo=$.extend(userInfo,option.params);
        saveUserInfo(); //
        _goTab(3);
    }

    //重新修改
    $('.toModify').on('click', function () {
        _goTab(1);
    })

    //擅长选择
    $('.good-list').on('click', 'span', function () {
        $(this).toggleClass('active');
    })


    //---------------启动图片上传----------------
    function initUploadImg() {
        var uploadOptions1 = {
            uploadBtn: 'avatar-btn',
            fileInput: 'avatar',
            path: 'UploadAvatar',
            customerId: userInfo.customerId
        }
        utils.addAvatar(uploadOptions1);
        var uploadOptions2 = {
            uploadBtn: 'photoId-btn',
            fileInput: 'photoId',
            path: 'UploadIDPicture',
            type: 1,   //
            customerId: userInfo.customerId
        }
        utils.addAvatar(uploadOptions2);
        var uploadOptions3 = {
            uploadBtn: 'qualification-btn',
            fileInput: 'qualification',
            type: 2,
            path: 'UploadIDPicture',
            customerId: userInfo.customerId
        }
        utils.addAvatar(uploadOptions3);
    }
    initUploadImg()


    //跳转进度
    function _goTab(index) {
        if (index == 1) {
            initBasic();
            getAddrss.init(); //第一步获取省市区
            utils.zooming( $('.upList'))
        }
        if (index == 2) {
            initBack();
            utils.zooming( $('.background .upList'))
        }
        $('.progress>li:lt(' + index + ')').addClass('active');
        $('.main>li').eq(index - 1).addClass('active').siblings().removeClass('active');

    }

    // 渲染基本信息
    function initBasic() {
        var Names = ["Username", "RealName", "AvatarUrl", "IdPictureUrl", "IDNumber", "WeChat","Address1"];
        for (var i = 0; i < Names.length; i++) {
            $('.' + Names[i]).val(userInfo[Names[i]]);
        }
        var GenderIndex = userInfo.Gender == 'F' ? 1 : 0;
        $('.sex-box b').removeClass('active');
        $('.sex-box>div').eq(GenderIndex).find('b').addClass('active');
        $('.avatarImg').attr('src', userInfo.AvatarUrl);
        $('.Education option[value=' + userInfo.Education + ']').attr('selected', true);
        $('.IdPictureImg').attr('src', userInfo.IdPictureUrl);
        $('#photoId-btn').attr('dataid',userInfo.IDPicture);//图片id
        if(userInfo.IdPictureUrl){
            $('.basicInfo .upList i').remove();
        }
    }

    //渲染从业背景
    function initBack() {
        var Names = ["ProfessionalLicensesUrl", "ProfessionalLicenseNumber", "WorkingYears", "ConsultingHours", "Recommender", "SerivcePrice"];
        for (var i = 0; i < Names.length; i++) {
            var val=userInfo[Names[i]];
            if(val){
                $('.' + Names[i]).val(val);
            }

        }
        $('.ProfessionalLicenses img').attr('src',userInfo.ProfessionalLicensesUrl);
        $('.ProfessionalLicensesTitle option[value=' + userInfo.ProfessionalLicensesTitle + ']').attr('selected', true);
        if(userInfo.CareerBackground){
            $('.CareerBackground').html(utils.textAreaDecode(userInfo.CareerBackground));
            $('.PersonalIntroduction').html(utils.textAreaDecode(userInfo.PersonalIntroduction));
            $('.PracticeStyle').html(utils.textAreaDecode(userInfo.PracticeStyle));
        }
        $('#qualification-btn').attr('dataid',userInfo.ProfessionalLicenses); //图片id
        if(userInfo.ProfessionalLicensesUrl){
            $('.upList i').remove();
        }

    }
    //核对基本信息
    function checkBasic(option){
        if(!option.RealName){return utils.msg("真实姓名不能为空")}
        if(!option.IDPicture){return utils.msg("请上传手持身份证照片")}
        if(!option.Aid){return utils.msg("请选择所在城市")}
        if(!option.IDNumber){return utils.msg("证件号码不能为空")}
        if(!option.IDNumber){return utils.msg("请选择学历")}
        if(!option.Education){return utils.msg("请选择学历")}
        if(!option.WeChat){return utils.msg("微信号不能为空")}
        if(!option.Address1){return utils.msg("面询地址不能为空")}
        return true;
    }

    //核对从业背景
    function checkBackground(option){
        if(!option.ProfessionalLicensesTitle){return utils.msg("请选择资质名称")}
        if(!option.ProfessionalLicenses){return utils.msg("请上传资质证明照片")}
        if(!option.ProfessionalLicenseNumber){return utils.msg("请填写证件编号")}
        if(!option.WorkingYears){return utils.msg("请填写从业年限")}
        if(!option.ConsultingHours){return utils.msg("累计个案不能为空")}
        if(!option.CareerBackground){return utils.msg("受训背景不能为空")}
        if(!option.PersonalIntroduction){return utils.msg("个人介绍不能为空")}
        if(!option.Skilled){return utils.msg("擅长领域不能为空")}
        if(!option.PracticeStyle){return utils.msg("职业风格不能为空")}
        if(!option.Recommender){return utils.msg("推荐人不能为空")}
        if(!option.SerivcePrice){return utils.msg("咨询费用不能为空")}
        return true;
    }

})


