
    utils.AccessPermissions(1);  //设置访问权限
    function InitOrderLIst(option){
        var _this=this;
        this.isPhone=utils.isPhone();
        this.stateObj={10:"未付款", 11:"已付款", 12:"付款失败", 13:"取消付款",14:"已完成", 15:"已取消"} //状态对应
        this.init=function(){ //多次执行时事件可能多次绑定

            //获取订单列表
            api.getExpertOrderList({customerId:userInfo.customerId},_this.getOrderListSuc)
            _this.event();
        }
        this.event=function(){
            $('body').on('click','.list_btn',function(){
                var id=$(this).closest('.item').attr('dataid');
                $('.order_finish').show();
                $('.submit_finish').attr('dataid',id);
            })
            //确认完成咨询
            $('.submit_finish').on('click',function(){
                var id=$(this).attr('dataid');
                api.setComplete({orderId:id},_this.setCompleteSuc);
                $('.order_finish').hide();
            })
            $('.order_finish .close_btn,.mask,.cancel').on('click', function () {
                $('.order_finish').hide();
            })
        }
        this.getOrderListSuc=function(data) {
            console.log(data);
            if (!data.Success) {
                if (data.Code == "201") {
                    return false
                }
                return utils.msg("请求出错");
            }
            var data=data.GetConsultantOrderList;
            _this.createHtml(data);
        }
        this.createHtml=function(data) {
            var htm = '';
            for(var i=0;i<data.length;i++){
                var state=Number(data[i].OrderStatus); //当前状态
                var dis=state>=14||state==10||state==12?disabled="disabled":"";
                if(!_this.isPhone){
                    htm += '<li class="item" dataid="'+data[i].Id+'">'+
                        '<ul class="clear">'+
                        '<li class="code">'+data[i].CustomOrderNumber+'</li>'+
                        '<li class="name">'+data[i].Customer.RealName+'</li>'+
                        '<li class="price">'+data[i].OrderTotal+'</li>'+
                        '<li class="time-box"><p>'+data[i].CreatedOnUtc+'</span></p></li>'+
                        '<li class="state">'+_this.stateObj[state]+'</li>'+
                        '<li class="btnClass"><button class="btn list_btn" '+dis+'>完成咨询</button></li>'+
                        '</ul>'+
                        '</li>'
                }else{
                    htm+='<li class="item" dataid="'+data[i].Id+'">'+
                        '<p class="code">'+data[i].CustomOrderNumber+'</p>'+
                        '<div class="box">'+
                        '<div><span class="name">'+data[i].CustomOrderNumber+'</span><span class="price">￥'+data[i].OrderTotal+'</span></div>'+
                        '<div><span class="state">'+_this.stateObj[state]+'</span><span class="time-box">'+data[i].CreatedOnUtc+'</span></div>'+
                        '</div>'+
                        '<button class="btn list_btn" '+dis+'>完成咨询</button>'+
                        '</li>'
                }

            }
            $('.list-items').empty().append(htm);
        }
        this.setCompleteSuc=function(data){
            if (!data.Success) {
                if (data.Code == "201") {
                    return false
                }
                return utils.msg("请求出错");
            }
        }
    }

    var init=new InitOrderLIst();
    init.init();