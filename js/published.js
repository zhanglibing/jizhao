$(function(){
    utils.AccessPermissions();  //设置访问权限
    var isArticle=false;
    var urlData=utils.getRequest();
    if(urlData.name=="member"){
        var htm=' <a href="member_center.html">会员中心</a><span>》发表话题</span>';
        $('.nav-box .title').text("会员中心")
        $('.nav-title').empty().append(htm);
    }
    if(urlData.type=="article"){
        isArticle=true;
        var htm=' <a href="expert_center.html">专家中心</a><span>》发表文章</span>'
        $('.nav-title').empty().append(htm);
    }

    //点击发布
    var clickFlag=true;
    $('.published-submit').on('click',function(){
        if(!clickFlag){return false}
        clickFlag=false;
        setTimeout(function(){clickFlag=true;},2000)
        var BlogTitle=$('input[name=title]').val();
        var imageStream=$('.uploadPreview img').attr('src');
        var BlogContent=utils.textEncode($('.edit_box').val());
        if(!checkOption(BlogTitle,imageStream,BlogContent)){return false;}
        if(isArticle){
            var option={
                BlogTitle:BlogTitle,
                imageStream:imageStream,
                BlogContent:BlogContent,
                BlogContentOverview:BlogContent,
                customerId:userInfo.customerId
            }
            api.CreateBlogPost(option,CreateBlogPostSuc)  //发表文章
            return false;
        }
        var option={
            Subject:BlogTitle,
            imageStream:imageStream,
            Details:BlogContent,
            customerId:userInfo.customerId
        }
        api.CreateTopic(option,CreateBlogPostSuc)  //发表话题

    })

    function CreateBlogPostSuc(data){
        console.log(data);
        if(!data.Success){
            if(data.Code=="201"){
                return false;
            }
            return utils.msg("请求出错");
        }
        utils.msg("发表成功");
        setTimeout(function(){
            window.location.href=urlData.name+"_center.html"
        },1000)
    }

    function checkOption(a,b,c){
       if(!a){return utils.msg("标题不能为空")}
       if(!b){return utils.msg("请上传图片")}
       if(!c){return utils.msg("内容不能为空")}
       return true;
    }
})

//启动图片上传
var uploadOptions = {
    uploadBtn: 'publish-btn',
    fileInput: 'publish'
}
utils.addAvatar(uploadOptions)