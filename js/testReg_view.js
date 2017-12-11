function InitTestView(){
       var _this=this;
       this.Id=utils.getRequest().Id;
       this.ProductData=[];
       this.isPhone=utils.isPhone();
       this._pay=new Pay({ProductType:"ZS"});
       this.init=function(){
           _this._pay.init();
           //获取详细信息
           api.getProductDetails({productId:_this.Id},_this.getProductDetailsSuc);
           _this.event();
       }
       this.getProductDetailsSuc=function(data){
           console.log(data)
           if(!data.Success){
               if(data.Code!=="201"){
               }
               return utils.msg("请求出错");
           }
           var data=data.ProductDetails;
           _this._pay.ProductId=data.Id;
           _this.ProductData=data.ProductAttributeValueList;
           _this.InitBacise(data)
           _this._init(_this.ProductData[0]); //默认渲染一级
       }
       this._init=function(data){
           $('.img-view img').attr('src',data.Picture1);
           for(var i=1;i<5;i++){
               $('.Picture'+i).find('img').attr('src',data['Picture'+i]);
           }
           var Product=data.ProductAttributeValue;
           $('.total-price-num').text(Product.ProductPrice); //价格
           $('.purchas_name').text(Product.ProductTitle); //产品名称
           $('.requirements').text(Product.ProductDescription);//报考条件
       }
       this.InitBacise=function(data){
           var details=$('.details-box');
           details.empty().html(data.FullDescription);//证件详情
           //图片转化连接
           utils.imgReset(details);

           $('.ProductAttributeName').text(data.ProductAttributeName);
           var htm='';
           for(var i=0;i<_this.ProductData.length;i++){
               htm+='<span class="item">'+ _this.ProductData[i].ProductAttributeValue.Name+'</span>'
           }
           $('.level-list').append(htm);
           $('.level-list .item').eq(0).addClass('active');
       }
       this.event=function(){
           $('.documents-box li').bind({
               click:function(){
                   var index=$(this).index();
                   $(this).addClass('active').siblings().removeClass('active');
                   $('.details-wrapper li').eq(index).addClass('active').siblings().removeClass('active')
               }
           })

           //图片选择放大
           $('.img-list li').on('click',function(){
               var imgPath=$(this).find('img').attr('src');
               $(this).addClass('active').siblings().removeClass('active');
               $('.img-view img').attr('src',imgPath);
           })
           //级别选择
           $('.level-list').on('click','.item',function(){
               if($(this).hasClass('active')){return false;}
               var index=$(this).index();
               $(this).addClass('active').siblings().removeClass('active');
               _this._init(_this.ProductData[index])
           })
           //立即购买
           $('.submit-buy').on('click',function(){
               if(!utils.isLogin({isPhone:_this.isPhone})){return false};
               var ProductName=$('.purchas_name').text();
               var price=Number($('.total-price-num').text()).toFixed(2);
               //设置支付参数
               // _pay.ProductId ="2";  详情获取成功已赋值
               _this._pay.ProductNum=1; //数量暂时只有1
               _this._pay.ProductName=ProductName;
               _this._pay.price=price;
               _this._pay.orderTotal=price;

               _this._pay.createPayHtml('paySelect');
           })
           if(_this.isPhone){
               var sw=new Swiper('#test_view',{
                   direction:'horizontal', //vertical
                   loop: true,
                   autoplay : 2000,
                   // height:40
                   // 分页器
                   pagination: '.swiper-pagination'
               })
           }
       }
   }

var _initTest=new InitTestView()
_initTest.init();

var views=[
    {
        name:"刘**",
        content:"课程非常实用，报考服务周到，信息反馈很快，感觉很值。网络的力量真强大，感谢一路的陪伴，我们单位的同事好几个也准备考健康管理师，社会工作者证书。",
        time:'2017/02/23'
    },
    {
        name:"李**",
        content:"考证服务很好，课程讲解很清晰，脉络很清晰，考试复习贴近考点，考试复习资料很实用。面对越来越严峻的生活就业压力，考个证书，放心多了哈哈，谢谢霁朝健康和阿拉丁教育",
        time:'2017/02/25'
    },
    {
        name:"张**",
        content:"服务周到，客服很热情，有问题能及时解决，课程也不错，健康管理师朝阳职业。",
        time:'2017/02/28'
    },
    {
        name:"张**",
        content:"网课很流畅、清晰、实用，报考服务周到，更值得庆幸的是结识了一帮志同道合的朋友。期待认识更多的社会工作者",
        time:'2017/03/15'
    },
    {
        name:"王**",
        content:"学习心理咨询师，从而可以帮助他人，也可以提高我自己的生活质量，成功教育子女，处理好家庭关系，增加就业和创业机会，谢谢阿拉丁教育",
        time:'2017/03/18'
    },
    {
        name:"乔**",
        content:"视频课程很不错，老师讲的调理很清晰，可以利用碎片时间学习，性价比很高。心理咨询师是我的职业了展方向。",
        time:'2017/03/22'
    },{
        name:"王**",
        content:"在这里学习心理咨询的知识与技巧，掌握心理调节的方法，感恩！！！！！！！",
        time:'2017/03/26'
    },{
        name:"张**",
        content:"后期的客服特别周到及时，把握最后一次考试计划，这次心理咨询师考证一次考过。",
        time:'2017/03/29'
    },{
        name:"赵**",
        content:"课程开通的很快，内容齐全，详细，易懂。还很实用，轻松的取得证书，好评，我是一名婚姻家庭咨询师啦。",
        time:'2017/04/01'
    },{
        name:"吕**",
        content:"听了一段时间的课来的，老师讲的都挺好的，讲的也很细，会持续关注的。业务时间不是很多，网课很方便，不清的还可以随时联系客服，服务好，赞",
        time:'2017/04/28'
    },{
        name:"张**",
        content:"根据教材看视频学习了，很方便。没发现有什么问题，客服态度很好的，解答也很详细，就等婚姻家庭咨询师考试了。",
        time:'2017/05/02'
    },{
        name:"张**",
        content:"感谢阿拉丁提供了报名通道，全程贴心服务让我获得国家一级婚姻家庭咨询师证书，让我的我资涨了，哈哈",
        time:'2017/05/05'
    },{
        name:"张**",
        content:"非常好的教材，老师很耐心的讲解和指导，很满意五星好评。对于才证一族来说，上海霁朝是我们的福音，哈哈，感恩！",
        time:'2017/05/11'
    },{
        name:"张**",
        content:"学习起来很方便，老师讲的也很好，跟着老师认真学，顺利通过健康管理师考试。",
        time:'2017/05/16'
    },{
        name:"张**",
        content:"视频高清老师讲解详细，手机都可以看课挺方便的，真心不错哦。6个月时间，拿到婚姻家庭咨询师证书啦",
        time:'2017/05/27'
    },{
        name:"张**",
        content:"三级也是在这里报名的，顺利通过了，课程非常好，服务非常棒，这次二级也幸运通过，以后有好的课程记得通知分享。",
        time:'2017/05/18'
    },{
        name:"张**",
        content:"课程非常好，报考速度快，服务也很耐心，值得信赖哦！感谢提供了实习机会",
        time:'2017/06/24'
    },{
        name:"张**",
        content:"总体而言，书本和网课的质量是不错的，如果能坚持下来，证书很快就下来了，对以后职业选择上又多了一个选择，开心!",
        time:'2017/06/29'
    },{
        name:"张**",
        content:"视频课程很好，老师讲的很透彻，观看也很方便，争取这次过了。",
        time:'2017/07/03'
    },{
        name:"宋**",
        content:"很满意，老师讲的很好，很实用，服务也很好，反馈很快，相信你们，会和同学同事多介绍，大家都多拿证，多给自己一份保障。",
        time:'2017/07/08'
    },{
        name:"张**",
        content:"听了课才来评价的，课程很好，还需要好好看书，客服也很耐心！",
        time:'2017/07/23'
    },{
        name:"张**",
        content:"老师讲解得很好，手机电脑都可以看视频，配合复习真心不错，对我帮助很大，加油！",
        time:'2017/08/25'
    },{
        name:"刘**",
        content:"客服人很好，很耐心的回答了我的问题，视频也还不错，喜欢老师讲课的风格。",
        time:'2017/07/29'
    },{
        name:"张**",
        content:"在这个城市里竞争无处不在， 工作和就业的压力随着年龄的增长而增长…在这个城市里竞争无处不在， 工作和就业的压力随着年龄的增长而增长……抓紧时间考个证，给自己多一份保障",
        time:'2017/08/04'
    }

]
function creatViewsHtml(data){
    var htm='';
    for(var i=data.length-1;i>=0;i--){
        var imgPath='';
        if(utils.isPhone()){
            imgPath='../';
        }
        imgPath+='images/cons/default/'+(i+1)+'.jpg';
        htm+='<div class="item">'+
            '<div class="user-avatar"><img src="'+imgPath+'" alt=""></div>'+
            '<div>'+
            '<h3 class="user-name">'+ data[i].name+'</h3> <span class="eval-time">'+data[i].time+'</span>'+
            '<p class="eval-txt">'+data[i].content+'</p>'+
            '</div>'+
            '</div>';

    }
    $('.appraise-num').text(data.length);
    $('.eval-list').append(htm);
}

creatViewsHtml(views)