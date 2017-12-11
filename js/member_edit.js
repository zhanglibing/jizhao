$(function () {
    utils.AccessPermissions();  //设置访问权限
    //------------------获取省市区----------------------------/
    var getAddrss=new GetProvince({isInit:true,isNeedEvent:true});
    getAddrss.init()

    //---------------------初始化页面------------------------/
    function init(){
        utils.avatarInit();
        if(!userInfo.Gender){  //未上传过信息
            return false;
        }
        var GenderIndex = userInfo.Gender == 'F' ? 1 : 0;
        $('.sex-box b').removeClass('active');
        $('.sex-box>div').eq(GenderIndex).find('b').addClass('active');
        $('.Birthday').val(userInfo.Birthday.slice(0,10))
        var inputArr=["Email","QQ","NickName","RealName"]
        for (var j = 0; j < inputArr.length; j++) {
            $('.' + inputArr[j]).val(userInfo[inputArr[j]]);
        }
    }
    init()

    //手动输入生日
    $('input[name=Birthday]').on('keyup',function(){
        var ageLength = $(this).val();
        var flagage = ageLength.indexOf('-');
        if (flagage== -1) {
            if (ageLength.length == 8) {
                var yy = ageLength.substr(0,4);
                var mm = ageLength.substr(4,2);
                var dd = ageLength.substr(6);
                $(this).val(yy+'-'+mm+'-'+dd);
            }
        }
        return false;
    })
   //--------------------保存个人信息-------------------------/
   $('.submit_info').on('click',function(){
      var NickName=$('.NickName').val();
      var RealName=$('.RealName').val();
      var Birthday=$('.Birthday').val();
      var Gender=$('.sex-box .active').text();  //F:女  M:男
      var Pid=$('.province option:selected').val();
      var Cid=$('.city option:selected').val();
      var Aid=$('.area option:selected').val();

      var Email=$('.Email').val();
      var QQ=$('.QQ').val();
      var option= {
           NickName:NickName,
           RealName:RealName,
           Birthday:Birthday,
           Gender:Gender,
           Pid:Pid,
           Cid:Cid,
           Aid:Aid,
           Email:Email,
           QQ:QQ,
           customerId:userInfo.customerId
      }
      if(check(option)){
          api.setMemberInfo(option,setMemberInfoSuc)
      }
    })

   function setMemberInfoSuc(data,option){
        console.log(data)
        if(!data.Success){
            if(data.Code=="201"){
              return false
            }
            return utils.msg("请求出错");
        }
        utils.msg('保存成功');
        userInfo=$.extend(userInfo,option.params) //跟新缓存
        userInfo.ProvinceId=option.params.Pid;
        userInfo.CityId=option.params.Cid;
        userInfo.AreaId=option.params.Aid;
        saveUserInfo();  //保存到缓存
        window.location.href="member_center.html";

   }
    //核对所有信息
    function check(option){
        if(!option.NickName){return utils.msg("昵称不能为空")}
        if(option.NickName.length>6){return utils.msg("请将昵称控制到6位")}
        if(!option.RealName){return utils.msg("真实姓名不能为空")}
        if(option.RealName.length<1){return utils.msg("请输入正确的姓名")}
        if(!option.Birthday){return utils.msg("生日不能为空")}
        if(!option.Aid){return utils.msg("请填选择在城市")}
        if(!validate.checkEmail(option.Email)){return false;}
        if(!validate.checkQQ(option.QQ)){return false;}
        return true;
    }
})