/**
 *
 * @authors zhanglibing (1053081179@qq.com)
 * @date    2017-9-20 13:48:30
 *
 */
function ConsultInit(){
    var _this=this;
    this.isPhone=utils.isPhone();
    this.pay=new Pay({ProductType:"ZXS"});
    this.id=utils.getRequest().id;
    this.init=function(){
        api.getConsultantInfo({customerId:_this.id},_this.getConsultantInfoSuc)
        _this.event();
        _this.pay.init();
    }
    this.event=function(data){
        $('.add-sub .add').on('click',function(){
            _this.calcPrice("add");
        })
        $('.add-sub .sub').on('click',function(){
            _this.calcPrice("sub");
        })
        //点击立即预约
        $('.submit-appoint').on('click',function(){
            if(!utils.isLogin({isPhone:_this.isPhone})){return false};
            var name=$.trim($('.personal-name').text());
            var hours=$('input[name=hours]').val();
            var ProductName=name+"心理咨询"+hours+"小时"; //产品名称
            var price=Number($('.price').text()/2).toFixed(2); //单价 //按0.5小时算单价
            var orderTotal=Number(price*hours*2).toFixed(2);
            //设置支付参数
            _this.pay.ProductId=_this.id;
            _this.pay.price=price;
            _this.pay.ProductNum=hours*2;    //0.5小时算一个  支付那边支持整数
            _this.pay.ProductName=ProductName;
            _this.pay.orderTotal=orderTotal;
            _this.pay.createPayHtml('paySelect');
        })
    }
    this.calcPrice=function(type){
        var input=$('.input-box input');
        var hour = Number(input.val());
        if(type==="add"){
            hour+=0.5;
        }else{
            hour-=0.5;
            hour=hour<0.5?0.5:hour;
        }

        input.val(hour);
        var price=Number($('.charges-price .price').text());
        var totalNum=price*hour;
        totalNum=totalNum.toFixed(2);
        $('.total-price-num').text(totalNum);
    }
    this.getConsultantInfoSuc=function(data) {
        console.log(data)
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        var data=data.GetConsultantInfo;
        _this.pageInit(data);
    }
    //初始化页面
    this.pageInit=function(data){
        var info=data.ConsultantInfo.ConsultantInfo;
        var price=info.SerivcePrice; // 咨询费用
        var priceTotal=(Number(price)/2).toFixed(2); //显示总价
        $('.address-box .address').text(data.ConsultantInfo.Addresses[0].Address2)
        $('.avatar img').attr('src',data.AvatarUrl)
        $('.goodAt').html(utils.setSkilled(info.Skilled));
        $('.personal-name').text(data.ConsultantInfo.RealName);
        $('.price-box .price').text(price);
        $('.total-price-num').text(priceTotal)
        $('.personal_content').html(utils.textDecode(info.PersonalIntroduction))
        $('.style_content').html(utils.textDecode(info.CareerBackground));
        utils.zooming($('.zooming'));
    }
}

var Consult=new ConsultInit()
Consult.init()


var views=[
    {
        name:"朱小强",
        content:"牛老师很好，聊完感觉思路清晰了，我也知道一点以后要怎么处理",
        time:'2017/02/23'
    },
    {
        name:"李**",
        content:"老师非常耐心听我讲述跟我解答，让我低落的情绪好了许多，也从新清晰的认识到自己以后该怎么样做，我一定会努力的，老师谢谢张老师很耐心，很专业。希望我能在她的帮助下越来越好。",
        time:'2017/02/25'
    },
    {
        name:"张**",
        content:"周老师，授人以渔，教我很多知识，帮我学会解决问题的办法。谢谢，继续学习中，加油！",
        time:'2017/02/28'
    },
    {
        name:"张**",
        content:"许老师尽其所能地指导我，她温和安然的心境让我重新拾回面对厄境的希望，勇气，合十，感恩，也祝愿老师生活美满，记得准时吃饭哈",
        time:'2017/03/15'
    },
    {
        name:"王**",
        content:"杨老师很及时，有耐心，给我指点了很多迷津.",
        time:'2017/03/18'
    },
    {
        name:"乔**",
        content:"用心的在倾听，能及时找出困惑根源。",
        time:'2017/03/22'
    },{
        name:"王**",
        content:"自己心里多年的压抑，经过杜老师的一番分析和耐心开导，现在感觉好多了，谢谢您，杜老师。之前我一直活在旁人的眼里，接下来想为自己好好的活一回，不为人生留遗憾，我一定要坚持，再次感谢！",
        time:'2017/03/26'
    },{
        name:"张**",
        content:"谢谢杨老师，咨询完了以后感觉好了很多",
        time:'2017/03/29'
    },{
        name:"赵**",
        content:"每次难过我都找老师，杜老师每次分析得都很到位，而且每次谈过以后都有效果，我都差点分手了，是老师帮我挽回了我的爱情，真的谢谢",
        time:'2017/04/01'
    },{
        name:"吕**",
        content:"一直流和杜老师联系，让老师给我分析问题，这么久了，我和杜老师已经成了朋友，和他聊天没有隔阂。",
        time:'2017/04/28'
    },{
        name:"张**",
        content:"谢谢杜老师，让我更加认清我自己的路，自己的问题，能让我更好的出发",
        time:'2017/05/02'
    },{
        name:"张**",
        content:"这个职业可以帮助很多人 真的是大爱无私 非常感谢 很有耐心 交流过后心里舒服多了 得到了很好的帮助 谢谢 感恩",
        time:'2017/05/05'
    },{
        name:"张**",
        content:"咨询过几次老师了，每次我都是烦恼多多的来找他，开开心心的结束，他每次都是很耐心又细心的开导我，让我的性格跟脾气改变了不少，谢谢老师！五星好评！",
        time:'2017/05/11'
    },{
        name:"张**",
        content:"每次不开心，遇到事就会找他聊，聊完心里就好多了，老师待人亲切，现在我们都是老朋友了",
        time:'2017/05/16'
    },{
        name:"张**",
        content:"谢谢杜老师一直以来的帮助~东北人就是直接一针见血，浪客剑心！我朋友非常喜欢杜老师！",
        time:'2017/05/27'
    },{
        name:"张**",
        content:"非常好的邢老师，陪我走过人生中的坎坎坷坷，风风雨雨，让我明白个中到礼物，抚慰心灵",
        time:'2017/05/18'
    },{
        name:"张**",
        content:"很耐心的一位老师，这次的沟通让我意识到了自己所存在的问题，老师的分析很精辟，也给了我相应的解决方案，会慢慢去尝试的，谢谢老师！",
        time:'2017/06/24'
    },{
        name:"张**",
        content:"谢谢左老师这么晚了还陪伴我给我分析聊天，说的很透彻我会慢慢来不断调整好自己状态",
        time:'2017/06/29'
    },{
        name:"张**",
        content:"很感谢老师给我指点，让我对我们这份感情又有了信心，以前真的不知道为什么谈恋爱那么累，和老师说了以后心情好多了，也知道了解决问题的方法，希望我们越来越来好，谢谢老师",
        time:'2017/07/03'
    },{
        name:"宋**",
        content:"康老师好耐心，解开了我心中的烦恼，多谢你的聆听，你教我的我会去实行，谢谢你",
        time:'2017/07/08'
    },{
        name:"张**",
        content:"很棒，点出了我的问题所在，其实有时候我也能想到这些，但是做到好难",
        time:'2017/07/23'
    },{
        name:"张**",
        content:"希望大家可以认真的听老师的话，这是两个人共同努力的结果，既然来咨询，尽量的敞开心扉，把问题跟老师说清楚，他会帮助你，走出不好的现实",
        time:'2017/08/25'
    },{
        name:"刘**",
        content:"很专业，态度很好，响应迅速，有耐心，风趣幽默，认真倾听，分析问题时条分缕析，非常有效果，非常负责任的一位老师",
        time:'2017/07/29'
    },{
        name:"张**",
        content:"这次咨询对我帮助很大，也帮我解决了我纠结4年的情感问题。真的太感谢杜老师了。杜老师真的非常专业的一位心理咨询老师。再次感谢杜老师用心的帮助解决我的问题",
        time:'2017/08/04'
    },{
        name:"杨**",
        content:"谢谢老师的耐心陪伴，让我的心情得到了很好的缓解",
        time:'2017/08/14'
    },{
        name:"张**",
        content:"很专业的一位老师，响应迅速，态度非常好，用心，耐心，认真倾听我的疑惑，并给出了良好的解答方案，让我明白了什么值得什么不值得，不能总一心扑在回忆中，必须从过去走出来，才能展现出一个最好的自己。必须要学会释怀，忘记该忘记的，向前看。",
        time:'2017/08/20'
    },{
        name:"张**",
        content:"老师真的很好，超级用心，还多送了差不多半个小时，直到问题全部解决，大家真的可以多来和老师沟通聊聊！态度很认真，说得都在点上！",
        time:'2017/09/14'
    },{
        name:"孙**",
        content:"总是哭着开头，笑着结束。谢谢晓明老师。现在心情释然很多，也重新获得十足动力，我相信我能改变命运，我会的，谢谢老师，感谢您。",
        time:'2017/09/19'
    },{
        name:"朱**",
        content:"总是哭着开头，笑着结束。谢谢晓明老师。现在心情释然很多，也重新获得十足动力，我相信我能改变命运，我会的，谢谢老师，感谢您。",
        time:'2017/09/28'
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
    $('.eval-list').append(htm);
}

creatViewsHtml(views)