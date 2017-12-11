$(function(){
    var urlData=utils.getRequest();
    var nav=$('.nav_list li');
    if(!urlData.index){
        urlData.index=0;
    }
    $('.nav_content>li').eq(urlData.index).addClass('active').siblings().removeClass('active');
    nav.eq(urlData.index).addClass('active').siblings().removeClass('active');

    nav.on('click',function(){
        var index=$(this).index();
        window.location.href='about.html?index='+index;
    })


    //在新闻页时发送请求
    if(urlData.index==2){
        $('.dynamics').on('click','.new li',function(){
            var id=$(this).attr('dataid');
            var index= $('.nav_list li.active').index();
            window.location.href='about.html?id='+id+'&index='+index;
        })
        if(urlData.id){
            $('.nav_list li').eq(2).addClass('active').siblings().removeClass('active');
            $('.nav_content>li').eq(6).addClass('active').siblings().removeClass('active');
            //获取新闻详情
            api.getNews({NewsId:urlData.id},getNewsSuc);
            function getNewsSuc(data){
                console.log(data);
                if(!data.Success){
                    if(data.Code!=="201"){
                    }
                    return utils.msg("请求出错");
                }
                var data=data.GetAllNews;
                $('.news_view .new_title').text(data.Title);
                $('.news_view .time').text(data.CreatedOnUtc.slice(0,10));

                var news_content=$('.news_view .news_content');
                news_content.html(data.Full);
                //图片转化连接
                utils.imgReset(news_content);
            }
        }else{
            //请求最新新闻
            api.getNewNews({},getNewNewsSuc);
            function getNewNewsSuc(data){
                console.log(data);
                if(!data.Success){
                    if(data.Code!=="201"){
                    }
                    return utils.msg("请求出错");
                }
                creatHtml(data.GetAllNews);
            }
            function creatHtml(data){
                var htm='';
                for (var i=0;i<data.length;i++){
                    htm+='<li dataid="'+data[i].Id+'">'+ data[i].Title+' <span class="time">'+ data[i].CreatedOnUtc.slice(0,10)+'</span></li>'
                }
                $('.dynamics .new').empty().append(htm);
            }
        }
    }
    //招贤纳士
    if(urlData.index==5){
        //获取招贤纳士
        api.getAllNews({Page:1, PageSize:5,flag:2},getAllNewsSuc);
        function getAllNewsSuc(data){
            console.log(data);
            if(!data.Success){
                if(data.Code!=="201"){
                }
                return utils.msg("请求出错");
            }
            var data=data.GetAllNews;
            var htm='';
            for(var i=0;i<data.length;i++){
                htm+='<div>'+
                    '<h3 class="title">'+data[i].Title+'</h3>' + data[i].Full+'</div>';
            }
            $('.recruiting').append(htm)
        }
    }
})
