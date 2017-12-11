$(function(){
    $('.documents-list .item').on('click','.pic,.buy',function(){
        var id=$(this).closest('.item').attr('dataid');
        window.location.href="testReg_view.html?Id="+id;
    })

    //获取所有有效产品
    api.getAllValidProducts({},getAllValidProductsSuc);
    function getAllValidProductsSuc(data){
        console.log(data)
        if(!data.Success){
            if(data.Code!=="201"){
            }
            return utils.msg("请求出错");
        }
        // utils.msg('请求成功');
        var data=data.GetAllValidProducts
        for(var i=0;i<data.length;i++){
            var target = $('.documents-list .item').eq(i);
            target.attr('dataid',data[i].Id)
            target.find('.document-title').text(data[i].Name)
        }
    }

})