$(function () {
    var PageSize =5; //默认一页显示5条文章信息

    //共享文章
    $('.sharing_article').on('click','.item', function () {
        var id=$(this).attr('dataId');
        window.location.href = 'information_view.html?type=grow&Id='+id;
    })


    //---------------------------------------共享文章----------------------------------------
    //启动分页插件
    function pagination(currentPage,total) {
        var totalPage = Math.ceil(total / PageSize);
        //分页函数
        $("#pagination1").pagination({
            currentPage: currentPage,
            totalPage: totalPage,
            // isShow: true,// 是否显示首尾页
            // count: 7,// 显示个数
            // homePageText: "首页",// 首页文本
            // endPageText: "尾页",// 尾页文本
            prevPageText: "《",// 上一页文本
            nextPageText: "》",// 下一页文本
            callback: function (current) { //返回当前页面
                goPageIndex(current)
            }
        });
    }

    //获取指定页文章列表
    function goPageIndex(index) {
        api.getBlogList({Page: index, PageSize: PageSize}, getBlogListSuccess)
    }
    goPageIndex(1)
    function getBlogListSuccess(data,option) {
        console.log(data);
        if (!data.Success) {
            if (data.Code == "201") {
                return false
            }
            return utils.msg("请求出错");
        }
        var data = data.GetAllBlogList;
        createHtml(data);
        console.log(data.Total)
        pagination(option.params.Page,data.Total); //启动分页插件 (总文章条数)

    }

    function createHtml(data){
        var htm='';
        var imgObj=data.PictureUrl;
        var lists=data.blogPosts;
        for(var i=0;i<lists.length;i++){
            var imgPath=imgObj[lists[i].Id];
            imgPath=imgPath?imgPath:"images/grow/article1.jpg";//如果未找到图片则默认图片
            htm+='<li class="item" dataId="'+ lists[i].Id+'">'+
                '<div class="img_box zooming"><img src="'+imgPath+'" alt=""></div>'+
                '<div class="item_content">'+
                '<h1 class="article_title">'+lists[i].Title+'</h1>'+
                '<div class="time_view">'+
                '<div class="time_box"><img src="images/grow/time.png" alt="">'+lists[i].CreatedOnUtc.slice(0,10)+'</div>'+
                '<div class="view_box"><img src="images/grow/views.png" alt="">'+lists[i].Views+'</div>'+
                '</div>'+
                '<div class="content">'+utils.textDecode(lists[i].Body)+'</div>'+
                '</div>'+
                '</li>';
        }
        $('.article_items').empty().append(htm);
        utils.zooming($('.zooming'));
    }

    //-----------------------------------------------视屏播放-------------------------
    // function VideoPlay(){
    //视屏播放
    var myVideo = document.getElementById("video");
    $(myVideo).on('click', function () {
        $('.max_sound').removeClass('active')
        $('.video-area').toggleClass('active');
        if ($('.video-area').hasClass('active')) {
            myVideo.pause();
        }
    })
    $('.play_btn').on('click', function () {
        $('.max_sound').removeClass('active')
        if (myVideo.paused) {
            myVideo.play();
            $('.video-area').removeClass('active');
        }
        else
            myVideo.pause();
    })


    //转化时间为分秒函数
    function format(oldTime) {
        var m = parseInt(oldTime / 60);
        var s = parseInt(oldTime % 60);
        m = (m < 10) ? ('0' + m) : m;
        s = (s < 10) ? ( '0' + s) : s;
        return m + ":" + s;
    }

    // 音量图标点击静音与恢复原来音量
    $('.sound .img_box').on('click', function () {
        $('.max_sound').toggleClass('active')
        // $(this).toggleClass("mute");
        // if(!$(this).attr('ov')){
        //     //添加自定义属性保存之前音量大小
        //     $(this).attr('ov',myVideo.volume);
        //     myVideo.volume=0;  //静音
        // }else{
        //     myVideo.volume=$(this).attr('ov'); //恢复原来音量
        //     $(this).removeAttr('ov');
        // }
    })

    //音量改变过程中执行的事件
    $(myVideo).on('volumechange', function () {
        var h = $('.max_sound').height();
        if (myVideo.volume === 0) {
            $(".sound .img_box").addClass('mute')
        } else {
            $(".sound .img_box").removeClass('mute')
        }
        $('.sound_length').css({height: myVideo.volume * h});
        // $('sound_length').css({height:audio.volume*w-$('.volome-op').width()/2})
    })


    var max_sound = $('.max_sound');
    // $(document).on('mousedown', false);
    //点击设置音量
    max_sound.on('click', function (e) {
        console.log(e.offsetY <= 0)
        if (e.offsetY <= 0) {
            e.offsetY = 0;
        }
        myVideo.volume = 1 - (e.offsetY / max_sound.height());
    })
    //音量拖动设置
    $('.sound_length b').on('click', function (e) {
        e.stopPropagation();
    })
    $('.sound_length b').on('mousedown', function (e) {
        // max_sound.addClass('moving')
        max_sound.on('mousemove', function (e) {
            var v = (e.pageY - max_sound.offset().top) / max_sound.height();
            v = 1 - v; //取反
            v = (v > 1) ? 1 : v;
            v = (v < 0) ? 0 : v;
            myVideo.volume = v;

        })
        $(document).on('mouseup', function () {
            // max_sound.removeClass('moving')
            max_sound.off('mousemove')
        })
    })

    var bgbar = $('.total_length');
    var playW = bgbar.width();
    bgbar.on('click', function (e) {
        if ($('.prompting').hasClass('active')) {
            return false;
        }
        myVideo.currentTime = (e.pageX - $(this).offset().left) / playW * myVideo.duration;
    })
    //播放进度拖动播放进度
    bgbar.on('mousedown', function (e) {
        if ($('.prompting').hasClass('active')) {
            return false;
        }
        e.preventDefault();
        bgbar.on('mousemove', function (e) {
            var w = (e.pageX - bgbar.offset().left) / playW * myVideo.duration;
            w = w >= myVideo.duration ? myVideo.duration : w;
            w = w <= 0 ? 0 : w;
            myVideo.currentTime = w;
        });
        $(document).on('mouseup', function () {
            bgbar.off('mousemove');
            $(document).off('mouseup')
        })
    })

    //播放进度发生变化执行事件
    myVideo.ontimeupdate = function () {
        if (myVideo.currentTime >= 15) {
            $('.prompting').addClass('active');
            myVideo.pause();
            return false;
        }
        $('.totle_time').text(format(myVideo.duration));
        $('.current_time').text(format(myVideo.currentTime));
        var w = 100 * (myVideo.currentTime / myVideo.duration) + '%';
        $('.play_length').css({width: w})
    }
    //播放完成后执行的事件
    $(myVideo).on('ended', function () {
        // alert('播放完毕')
    })

    //点击全屏
    $('.fullScreen').on('click', function () {
        launchFullScreen(myVideo); // the whole page
    })

    //全屏播放
    function launchFullScreen(element) {
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }

    var videoSrc=[
        {title:"阿拉丁教育",name:"阿拉丁教育",path:"0.mp4","imgPath":"../video/grow1.png","price":1980},
        {title:"健康管理师（试听）",name:"健康管理师",path:"1.mp4","imgPath":"../video/grow2.png","price":1980},
        {title:"婚姻家庭咨询师（试听）",name:"婚姻家庭咨询师",path:"2.mp4","imgPath":"../video/grow3.png","price":1980},
        {title:"人力资源管理师（试听）",name:"人力资源管理师",path:"3.mp4","imgPath":"../video/grow4.png","price":1980},
        {title:"社会工作师（试听）",name:"社会工作师",path:"4.mp4","imgPath":"../video/grow5.png","price":1980},
        {title:"心理咨询（试听）",name:"心理咨询",path:"5.mp4","imgPath":"../video/grow6.png","price":1980}];
    //视频播放列表
    $('.view_list .item').on('click', function () {
        var index=$(this).index();
        var path = $(this).attr('dataUrl');
        var imgPath=$(this).find('img').attr('src');
        $('#video').attr({'src':path,"poster":imgPath});
        $('.OpenMember').attr({"price":videoSrc[index].price,"productName":videoSrc[index].name});
        $(this).addClass('active').siblings().removeClass('active');
        $('.prompting,.video-area').removeClass('active');
        $('.video_viewing h1').text($(this).find('.item_title').text());
        myVideo.play();
    })

    var _pay=new Pay({ProductType:"V"});
    _pay.init();
    //开通会员
    $('.OpenMember').on('click',function(){
        if(!utils.isLogin({"isPhone":false})){return false}
        var price=Number($(this).attr('price')).toFixed(2);
        var name=($(this).attr('productName'))
        _pay.ProductId ="2";  //暂未定
        _pay.ProductNum=1;   //数量暂时只有1
        _pay.ProductName=name;
        _pay.price=price;
        _pay.orderTotal=price;
        _pay.createPayHtml('paySelect');
    })

    //----------公益解答---------------

    var _topicsInit=new TopicsInit();
    _topicsInit.init();

});

