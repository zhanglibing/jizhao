$(function(){
    var pageSize=5;
    var pageIndex=1;
    var isPhone=utils.isPhone();

    // 获取省市区
    var getAddrss=new GetProvince();
    getAddrss.init({});

    //获取擅长领域
    var getGood=new GetGoodFields('select');
    getGood.init();

    //点击查看专家详情
   $('.Experts-list').on('click','li .avatar,.info',function(){
        var id=$(this).closest('li').attr('dataid');
        window.location.href="consultation_view.html?id="+id;
   })


  if (!isPhone){
      //点击回车搜索
      document.onkeydown = function (e) {
          var ev = document.all ? window.event : e;
          if (ev.keyCode == 13) {
              $('.search_submit').click();//处理事件
          }
      }
      //启动分页插件
      function pagination(currentPage,total) {
          var totalPage = Math.ceil(total / pageSize);
          //分页函数
          $("#pagination").pagination({
              currentPage: currentPage,
              totalPage: totalPage,
              prevPageText: "《",// 上一页文本
              nextPageText: "》",// 下一页文本
              callback: function (current) { //返回当前页面
                  pageIndex=current
                  $('.search_submit').trigger('click');
              }
          });
      }
  }else{

      $('.page span').on('click',function(){
          var total=$('.total-number').text();
          var totalPage = Math.ceil(total / pageSize);
          if ($(this).hasClass('pre')){
              pageIndex--;
              if (pageIndex<1){
                  pageIndex=1;
                  return utils.msg('已经是第一页')
              }
          }else{
              pageIndex++;
              if (pageIndex>totalPage){
                  pageIndex=1;
                  return utils.msg('已经是最后一页')
              }
          }
          $('.search_submit').trigger('click');
      })
  }



    //点击搜索
   $('.search_submit').on('click',function(){
        var RealName=$('.search_content').val();  //搜索内容
        var GoodFieldid=$('.good-list option:selected').val(); //擅长领域
        var Price=$('.price option:selected').val();
        var ProvinceId=$('.province option:selected').val();
        var priceArr=Price.split("-");
        var option={
            RealName:RealName?RealName:"",
            GoodFieldid:GoodFieldid?GoodFieldid:"",
            startPrice:priceArr[0]?priceArr[0]:0,
            endPrice:priceArr[1]?priceArr[1]:0,
            ProvinceId:ProvinceId?ProvinceId:0,
            pageIndex:pageIndex,
            pageSize:pageSize
        }
        api.search(option,searchSuccess)
    })

   //搜索框值改变发送请求
   $('select').on('change',function(){
     $('.search_submit').trigger('click');
   })
   $('.province,.search_content,.good-list,.price').on('change',function(){
        pageIndex=1;
    })

   $('.search_submit').trigger('click'); //请求所有 (请求内容为空时为全部)
   function searchSuccess(data){
       console.log(data);
       if (!data.Success) {
           if (data.Code == "201") {
               return false
           }
           return utils.msg("请求出错");
       }
      var data=data.SearchCustomers;
      var AvatarsObj=data.AvatarUrls; //所有头像对象集合
      var listArr=data.customers;    //所有列表数组
      $('.total-number').text(data.Total);
      if(listArr.length<=0){
          $('.Experts-list').empty();
          return utils.msg("该区域暂无专家入驻");
      }
      createListHtml(listArr,AvatarsObj);
       if (!isPhone){
           pagination(pageIndex,data.Total); //启动分页插件 (总文章条数)
       }

      $('.backTop').trigger('click')
   }

   function createListHtml(data,Avatars){
      var htm='';
      for(var i=0;i<data.length;i++){
          var info=data[i].ConsultantInfo;
          var avatarPath=Avatars[data[i].Id];
          htm+='<li class="clear" dataid="'+data[i].Id+'">'+
              '<div class="avatar zooming"><img src="'+ avatarPath +'" alt=""></div>'+
              '<div class="info">'+
              '<h2 class="name">'+data[i].RealName+'</h2>'+
              '<div class="introduce">'+ utils.textDecode(info.PersonalIntroduction)+' </div>'+
              '<div class="good-box">'+ utils.setSkilled(info.Skilled)+'</div>'+
              '</div>'+
              '<div class="contac-box">'+
              '<div class="price"><i class="price-number">'+info.SerivcePrice+'</i><span>&nbsp;元</span></div>'+
              '<div class="contactHer"><img src="images/cons/contactHer.png" alt=""></div>'+
              '</div>'+
              '</li>';
      }
      $('.Experts-list').empty().append(htm);
       utils.zooming($('.zooming'));
   }

})