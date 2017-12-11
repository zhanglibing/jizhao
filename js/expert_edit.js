$(function(){
    //---------------------------------------------手机、pc端公用----------------------------------------
    utils.AccessPermissions(1);  //设置访问权限

    //------------------获取省市区----------------------------/
    var getAddrss=new GetProvince({isInit:true,isNeedEvent:true});
    getAddrss.init()

    //获取擅长领域
    var getGoodFields=new GetGoodFields()
    getGoodFields.init();
    //擅长选择
    $('.good-list').on('click','span',function(){
        $(this).toggleClass('active');
    })

    //初始化页面
    function _init() {   // -----所在城市未渲染
        utils.avatarInit();
        var textArr=["RealName","Birthday","Education","ProfessionalLicensesTitle","ProfessionalLicenseNumber"];
        var Gender=userInfo.Gender == 'F' ? "女" :"男";
        $('.Gender').text(Gender);
        for (var i = 0; i < textArr.length; i++) {
            $('.' + textArr[i]).text(userInfo[textArr[i]]);
        }
        var inputArr=["Email","QQ","WeChat","SerivcePrice","WorkingYears","ConsultingHours","Address1"]
        for (var j = 0; j < inputArr.length; j++) {
            $('.' + inputArr[j]).val(userInfo[inputArr[j]]);
        }
        $('.Birthday').text(userInfo.Birthday.slice(0,10))
        // $('.').val(userInfo.Addresses[0].Address1); //面询地址
        $('.CareerBackground').val(utils.textAreaDecode(userInfo.CareerBackground)) //受训背景
        $('.PersonalIntroduction').val(utils.textAreaDecode(userInfo.PersonalIntroduction)) //个人介绍
    }
    _init()

    //点击保存
    $('.edit_submit').on('click',function(){
       var Email=$('.Email').val();
       var QQ=$('.QQ').val();
       var WeChat=$('.WeChat').val();
       var SerivcePrice=$('.SerivcePrice').val();
       var WorkingYears=$('.WorkingYears').val();
       var ConsultingHours=$('.ConsultingHours').val();
       var CareerBackground=utils.textEncode($('.CareerBackground').val());
       var PersonalIntroduction=utils.textEncode($('.PersonalIntroduction').val());
       var Skilled=utils.getSkilled();
       var Address1=$('.Address1').val();
       var Pid=$('.province option:selected').val();
       var Cid=$('.city option:selected').val();
       var Aid=$('.area option:selected').val();
        var option={
            Email:Email,
            QQ:QQ,
            WeChat:WeChat,
            SerivcePrice:SerivcePrice,
            WorkingYears:WorkingYears,
            ConsultingHours:ConsultingHours,
            CareerBackground:CareerBackground,
            PersonalIntroduction:PersonalIntroduction,
            Address1:Address1,
            Skilled: Skilled,
            customerId:userInfo.customerId,
            Pid:Pid,
            Cid:Cid,
            Aid:Aid
        }
        if(!check(option)){return false;}
        api.changeExpertBasic(option,changeExpertBasicSuc)
        console.log(option)
    })

    function changeExpertBasicSuc(data,option){
        console.log(data)
        if(!data.Success){
            if(data.Code=="201"){
                return false
            }
            return utils.msg("请求出错");
        }
        utils.msg('保存成功');
        userInfo=$.extend(userInfo,option.params);
        userInfo.ProvinceId=option.params.Pid;
        userInfo.CityId=option.params.Cid;
        userInfo.AreaId=option.params.Aid;
        saveUserInfo();  //保存到缓存
    }

    //核对信息
    function check(option){
        if(!validate.checkEmail(option.Email)){return false}
        if(!validate.checkQQ(option.QQ)){return false}
        if(!option.WeChat){return utils.msg("微信号不能为空")}
        if(!option.SerivcePrice){return utils.msg("咨询费用不能为空")}
        if(!option.WorkingYears){return utils.msg("从业年限不能为空")}
        if(!option.ConsultingHours){return utils.msg("累计个案小时不能为空")}
        if(!option.CareerBackground){return utils.msg("受训背景不能为空")}
        if(!option.PersonalIntroduction){return utils.msg("个人介绍不能为空")}
        if(!option.Skilled){return utils.msg("请选择擅长领域")}
        if(!option.Address1){return utils.msg("面询地址不能为空")}
        return true;
    }

})