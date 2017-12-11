
function Init(type){
    var _this=this;
    this.isPhone=type?true:false;
    this.urlData=utils.getRequest();
    this.answerFlag=true;
    this.canVisit=function(){
        if(!userInfo){ //如果未登录去登录页面
            if(_this.isPhone){
              window.location.href='login.html';
              return false;
            }
            loginInit.createLoginHtml('login');
            return false;
        }
        return true;
    }
    this.init=function(){
        api.getTopicsView({TopicId:_this.urlData.Id},_this.getTopicsViewSuc)
        _this.event();
    }
    this.getTopicsViewSuc=function(data){
        console.log(data)
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        _this.initView(data.Topic)
    }
    this.postCreateSuc=function(data){
        console.log(data);
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        utils.msg('回复成功');
        location.reload();
    }
    this.postPostCreateSuc=function (data){
        console.log(data);
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        utils.msg('回复成功');
        location.reload();
    }
    this.initView=function(data){
        var topic=data.topic;
        $('.information-title').text(topic.Subject);
        $('.view_img img').attr('src',data.pictureUrl);
        $('.time').text(topic.CreatedOnUtc);
        $('.through-total').text(topic.Views);
        $('.information-view-box .content').html(utils.textDecode(topic.Details));

        // 讨论区
        var htm='';
        var ForumPosts=data.ForumPosts;
        for(var i=0;i<ForumPosts.length;i++){
            var itemData=ForumPosts[i].ForumPost;
            var rePorts = ForumPosts[i].ForumPostPostHandleModels; //回复的回复
            var rePortsHtml=""
            if(rePorts.length){
                rePortsHtml= _this.rePortsCreate(rePorts);
            }
            var content=utils.textDecode(itemData.Text); //转义内容
            var userType= itemData.Customer.CustomerRoles[0].SystemName=="Registered"?"普通用户":"入驻专家";
            htm+=' <li class="revert_item" dataId="'+itemData.Id+'" dataTopicId="'+itemData.TopicId+'">'+
                '<div class="avatar zooming"><img src="'+ForumPosts[i].AvatarUrl+'" alt=""></div>'+
                '<div class="other_info">'+
                '<div class="info">'+
                '<p class="name">'+itemData.Customer.NickName+'</p>'+
                '<p class="type">'+userType+'</p>'+
                '<p class="time">'+itemData.CreatedOnUtc+'</p>'+
                '</div>'+
                '</div>'+
                '<div class="content">'+content+' </div>'+
                '<div class="clear"><button  class="revert_btn revert_item_btn">回复</button></div>'+rePortsHtml+
                '</li>'
        }
        $('.revert_items').append(htm);
        utils.zooming($('.zooming'))
    }
    this.rePortsCreate=function(data){
        var htm='<ul class="items_items_box">';
        for (var i=0;i<data.length;i++){
            var datalist=data[i].ForumPostPost;
            htm+='<li>'+
                '<div class="avatar zooming"><img src="'+data[i].AvatarUrl+'" alt=""></div>'+
                '<div class="other_info">'+
                '<div class="info">'+
                '<p class="name">'+datalist.Customer.NickName+'</p>'+
                '<p class="type">普通用户</p>'+
                '<p class="time">'+datalist.CreatedOnUtc+'</p>'+
                '</div>'+
                '</div>'+
                '<div class="content">'+
                '<div>'+utils.textDecode(datalist.Text)+'</div>'+
                '</div>'+
                '</li>';
        }
        htm+='</ul>';
        return htm;
    }
    this.event=function(){
        // 回复其他用户
        $('body').on('click','.revert_item .revert_btn',function(){
            var parent=$(this).closest('.revert_item');
            if(parent.find('.revert_answer').length){
                parent.find('.revert_answer').remove();  //取消回复
                return false;
            }
            var htm='<div class="revert_answer">'+
                '<textarea class="edit_box"></textarea>'+
                '<div class="anonymity"><b class="active"></b>匿名回答</div>'+
                '<button class="sub_btn submit_item_answer">提交</button>'+
                '</div>';
            parent.append(htm);
        })
        //  选择是否为匿名
        $('body').on('click','.anonymity b',function(){
            $(this).toggleClass('active');
        })
        //  点击文章回复 页面滚动到我的回答位置
        $('.information-view-box .revert_btn').on('click',function(){
            var top=$('.my_answer').offset().top-200;
            $('body').animate({scrollTop:top},300);
        })
        //  我的回复
        $('.submit_my_answer').on('click',function(){
            if(!_this.answerFlag){return false;}
            _this.answerFlag=false;
            setTimeout(function(){_this.answerFlag=false;},2000)
            if(!_this.canVisit()){return false;}
            var Contenttext=utils.textEncode($('.my_answer .edit_box').val());
            if(!Contenttext){return utils.msg("回复内容不能为空")}
            if(Contenttext.length<5){return utils.msg("回复内容最少五个字")}
            var option={
                Contenttext:Contenttext,
                TopicId:_this.urlData.Id,
                customerId:userInfo.customerId
            }
            api.postCreate(option,_this.postCreateSuc)

        })
        //回复其他的回复
        $('.revert_items').on('click','.submit_item_answer',function(){
            if(!_this.answerFlag){return false;}
            _this.answerFlag=false;
            setTimeout(function(){_this.answerFlag=true},2000);
            if(!_this.canVisit()){return false;}
            var Contenttext=utils.textEncode($(this).closest('.revert_answer').find('.edit_box').val());
            var PostId=$(this).closest('.revert_item').attr('dataid');
            if(!Contenttext){return utils.msg("回复内容不能为空")}
            var option={
                Contenttext:Contenttext,
                TopicId:_this.urlData.Id,
                PostId:PostId,
                CustomerId:userInfo.customerId
            }
            api.postPostCreate(option,_this.postPostCreateSuc);
        })
    }

}