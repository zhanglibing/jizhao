$(function(){


     $('.banner .content').on('click',function(){
         window.location.href='consultation.html';
     })


    //视屏播放

        var myVideo=document.getElementById("video");
        $(myVideo).on('click',function(){
            $('.max_sound').removeClass('active')
            $('.video-area').toggleClass('active');
            if($('.video-area').hasClass('active')){
                myVideo.pause();
            }
        })
        $('.play_btn').on('click',function(){
            $('.max_sound').removeClass('active')
            if (myVideo.paused){
                myVideo.play();
                $('.video-area').removeClass('active');
            }
            else
                myVideo.pause();
        })

        //转化时间为分秒函数
        function format(oldTime){
            var m=parseInt(oldTime/60);
            var s=parseInt(oldTime%60);
            m=(m<10)?('0'+m):m;
            s=(s < 10)?( '0' + s):s;
            return m + ":" + s;
        }


        // 音量图标点击静音与恢复原来音量
        $('.sound .img_box').on('click',function(){
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
        $(myVideo).on('volumechange',function(){
            var h=$('.max_sound').height();
            if(myVideo.volume===0){
                $(".sound .img_box").addClass('mute')
            }else{
                $(".sound .img_box").removeClass('mute')
            }
            $('.sound_length').css({height:myVideo.volume*h});
            // $('sound_length').css({height:audio.volume*w-$('.volome-op').width()/2})
        })


        var max_sound=$('.max_sound');
        // $(document).on('mousedown',false);
        //点击设置音量
        max_sound.on('click',function(e){
            console.log(e.offsetY<=0)
            if(e.offsetY<=0){
                e.offsetY=0;
            }
            myVideo.volume=1-(e.offsetY/max_sound.height()) ;
        })
        //音量拖动设置
        $('.sound_length b').on('click',function(e){
            e.stopPropagation();
        })
        $('.sound_length b').on('mousedown',function(e){
            // max_sound.addClass('moving')
            max_sound.on('mousemove',function(e){
                var v=(e.pageY-max_sound.offset().top)/max_sound.height();
                v=1-v; //取反
                v=(v>1)?1:v;
                v=(v<0)?0:v;
                myVideo.volume=v;

            })
            $(document).on('mouseup',function(){
                // max_sound.removeClass('moving')
                max_sound.off('mousemove')
            })
        })

        var bgbar=$('.total_length');
        var playW=bgbar.width();
        bgbar.on('click',function(e){
            myVideo.currentTime=(e.pageX-$(this).offset().left)/playW*myVideo.duration;
            console.log((e.pageX-$(this).offset().left)/playW*myVideo.duration)
            console.log(myVideo.currentTime)
        })
        //播放进度拖动播放进度
        bgbar.on('mousedown',function(e){
            e.preventDefault();
            bgbar.on('mousemove',function(e){
                var w=(e.pageX-bgbar.offset().left)/playW*myVideo.duration;
                w=w>=myVideo.duration?myVideo.duration:w;
                w=w<=0?0:w;
                myVideo.currentTime=w;
            });
            $(document).on('mouseup',function(){
                bgbar.off('mousemove');
                $(document).off('mouseup')
            })
        })

        //播放进度发生变化执行事件
        myVideo.ontimeupdate=function(){
            $('.current_time').text(format(myVideo.currentTime));
            var w=100*(myVideo.currentTime/myVideo.duration)+'%';
            $('.play_length').css({width:w})
        }

        //播放完成后执行的事件
        $(myVideo).on('ended',function(){
            // alert('播放完毕')
        })

        //点击全屏
        $('.fullScreen').on('click',function(){
            launchFullScreen(myVideo); // the whole page
        })

        //全屏播放
        function launchFullScreen(element) {
            if(element.requestFullScreen) {
                element.requestFullScreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        }









    //---------------共享文章渲染-------------------
    api.getBlogList({Page: 1, PageSize: 5}, getBlogListSuccess);
    function getBlogListSuccess(data,option) {
        console.log(data);
        if (!data.Success) {
            if (data.Code == "201") {
                return false
            }
            return utils.msg("请求出错");
        }
        var data = data.GetAllBlogList;
        createBlogHtml(data);

    }
    function createBlogHtml(Data){
        var imgObj=Data.PictureUrl;
        var data=Data.blogPosts;
        var htm='';
        for(var i=0;i<data.length;i++){
            var imgPath=imgObj[data[i].Id]
            imgPath=imgPath?imgPath:"images/index/pic1.png";
            htm+='<li class="article-item" dataid="'+[data[i].Id]+'">'+
                '<strong>'+
                '<small></small>'+
                '</strong>'+
                '<a href="javascript:;" class="con-box">'+
                '<div class="pic"><img src="'+imgPath+'" alt=""></div>'+
                '<div class="pic_h" style="background:rgba(0,0,0,.5) url('+imgPath+') 50% 50% no-repeat; background-size:cover;"><div class="mask"></div></div>'+
                '<div class="title">'+data[i].Title+'</div>'+
                '<div class="time">'+data[i].CreatedOnUtc+'</div>'+
                '<div class="con">'+data[i].BodyOverview+'</div>'+
                '<div class="more">more-</div>'+
                '</a>'+
                '</li>';
        }

        $('.article-list').empty().append(htm);
    }
    $('.article-list').on('click','.article-item',function(){
        var id=$(this).attr('dataid');
        window.location.href='information_view.html?Id='+id;
    })


    //--------------咨询行业专区----------------
    function initZhuanjia(data){
        var htm='';
        for(var i=0; i<data.length;i++){
            var clas=i?"":"active";
            htm+='<li class="list-item  '+clas+'" >'+
                '<div class="info-title">'+
                '<b class="name">'+data[i].name+'</b>'+
                '<p class="address-box"><img src="images/index/info-address.png" alt="">'+
                '<span class="address">'+data[i].address+'</span>'+
                '</p>'+
                '<p class="workTime-box">'+
                '<img src="images/index/work-time.png" alt="">'+
                '<span>从业年限：'+data[i].workYear +'年</span>'+
                '</p>'+
                '</div>'+
                '<div class="goodAt clear">'+utils.setSkilled(data[i].goodList)+'</div>'+
                '<div class="line"></div>'+
                '<div class="experience">'+
                '<p class="goods_say">'+data[i].goodDeail+'</p>'+
               '<div class="certificate"> '+data[i].produce+'</div>'+
               '<div class="motto"> '+data[i].motto+'</div>'+
              '</div>'+
              '</li>';
        }
        $('.main-box .info-list').append(htm)
    }
    initZhuanjia(indexData)
    var maxH=$('.info-link').height();
    var hh=maxH/7;
    var top=0;
    $('.info-link_box>span').on('click',function(){
        var index=$('.info-link li.active').index();
        if($(this).hasClass('pre')){
            top+=hh;
            if(top>=0){
                top=0;
            }
            var num=Math.round(Math.abs(top)/hh);
            console.log(num+":"+index)
            if(num==index-3){
                _addClass(index-1)
            }
        }else{
            if(Math.abs(top)>=4*hh){
                return false;
            }
            top-=hh;
            var num=Math.abs(top)/hh;
            if(num==index+1){
                _addClass(index+1)
            }
            console.log(num+":"+index)
        }
        $('.info-link').animate({marginTop:top},300)
    })
    //资深咨询师专区
    $('.info-link .link-item').bind({
        mouseover:function(){
            var index=$(this).index();
            _addClass(index)
        },
        mouseout:function(){
            // $(this).removeClass('active');
        }
    })
    function _addClass(index){
        var link=$('.info-link .link-item')
        link.eq(index).addClass('active').siblings().removeClass('active');
        link.eq(index).animate({right:50,padding:0},200);
        link.eq(index).siblings().animate({right:0,padding:8},200);
        $('.info-list .list-item').eq(index).addClass('active').siblings().removeClass('active');
    }


})