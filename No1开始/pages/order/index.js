var that;
var Bmob = require("../../utils/bmob.js");
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    winHeight:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    if(options.id){
      that.setData({
        currentTab:options.id
      })
    }

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth:res.windowWidth,
          winHeight:res.windowHeight
        })
      },
    })
  },
  onShow:function(){
    var currentUser = Bmob.User.current();
    var Order = Bmob.Object.extend("Order");
    var query = new Bmob.Query(Order);
    query.equalTo("orderUser",currentUser.id);
    query.descending("createdAt");
    query.find({
      success:function(result){
        var allOrder = [],//全部
        noPayment = [], //待付款
        shipments = [], //待发货
        Receiving = [], //待收货
        finish = []; //已完成

        for(var i=0;i<result.length;i++){
          var object = result[i];
          var status = "";
          var resData = {totalprice:object.get("totalprice"),remarks:object.get('remarks'),orderId:object.get('orderId'),status:status,orderDetail:object.get('orderDetail'),createdAt:object.createdAt};
          console.log(resData);
          switch(object.get('status')){
            case 0:
              resData.status="待付款";
              noPayment.push(resData);
              break;
            case 1:
              resData.status="待发货";
              shipments.push(resData);;
              break;
            case 2:
              resData.status="待收货";
              Receiving.push(resData);
              break;
            case 3:
              resData.status="已完成";
              finish.push(resData);
              break;
            default:
          }
          allOrder.push(resData);
        }
        that.setData({
          allOrder:allOrder,
          noPayment:noPayment,
          shipments:shipments,
          Receiving:Receiving,
          finish:finish
        })
      },
      error:function(error){
        
      }
    })
  },
  swichNav:function(e){
    if (this.data.currentTab === e.target.dataset.current){
      return false;
    }else{
      that.setData({
        currentTab:e.target.dataset.current
      })
    }
  },
  bindChange:function(e){
    that.setData({
      currentTab:e.detail.current
    })
  },
  cancelOrder:function(e){
    var orderid = e.target.dataset.id;
    common.showModal('你确定取消订单吗？','提示',true,function(e){
      if(e.confirm){
        //取消订单
        var Order = Bmob.Object.extend("Order");
        var query= new Bmob.Query(Order);
        query.equalTo("orderId",orderid);
        query.find().then(function(result){
          return Bmob.Object.destroyAll(result);
        }).then(function (result){
          //删除成功
          common.showTip('取消订单成功');
          setTimeout(function () {
            that.onShow()
          }, 3000);
        },
        function(error){
          //删除失败
        })
      }
    });
  },
  overOrder:function(e){
    var orderid = e.target.dataset.id;
    common.showModal("你确定收货了吗？","提示",true,function(e){
      if(e.confirm){
        var Order = Bmob.Object.extend("Order");
        var query = new Bmob.Query(Order);
        query.equalTo("orderId",orderid);
        query.find().then(function(result){
          for(let obj of result){
            obj.set('status',3);
            for(let item of obj.get('orderDetail')){
              var good = Bmob.Object.extend("good");
              var qgood = new Bmob.Query(good);
              qgood.get(item.id,{
                success:function(result){
                  result.set("sale_number",parseInt(item.number)+parseInt(result.get("sale_number")));
                  result.save()
                },error:function(){}
              })
            }
            obj.save(null, {
              success: function (result) {
                common.showTip("收货成功");
                setTimeout(function(){
                  that.onShow();
                },1000)
              }
            })
          }
        },function(error){

        })
      }
    })
  },
  deleteOrder:function(e){
    var orderid = e.target.dataset.id;
    common.showModal("你确定删除订单吗？","提示",true,function(e){
      if(e.confirm){
        //删除订单
        var Order = Bmob.Object.extend("Order");
        var query = new Bmob.Query(Order);
        query.equalTo("orderId",orderid);
        query.find().then(function(result){
          return Bmob.Object.destroyAll(result);
        }).then(function(result){
          common.showTip("删除订单成功");
          setTimeout(function(){
            that.onShow();
          },1000)
        },function(error){

        })
      }
    })
  },
  payOrder:function(){
    common.showTip("暂不支持付款","loading");
  }
})