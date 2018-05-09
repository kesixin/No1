var that;
var Zan = require('../../dist/index');
var Bmob=require("../../utils/bmob.js");
const WxParse=require("../../utils/wxParse/wxParse.js");
Page(Object.assign({},Zan.Quantity,{

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    autoplay:true,
    interval:4000,
    duration:1000,
    hiddenModal: true,
    quantity1:{
      quantity:1,
      min:1,
      max:20
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      good_id:options.id
    })

    //查询商品详情
    var menu_cover = null;
    var good_id=this.data.good_id;
    var Good =Bmob.Object.extend("good");
    var query=new Bmob.Query(Good);
    
    query.equalTo("is_delete",0);
    query.get(good_id,{
      success:function(result){
        var str=result.get("good_desc");
        if(str){
          var reg = new RegExp("&quot;","g");
          var detail = str.replace(reg,"");
          WxParse.wxParse('content','html',detail,that);
        }
        menu_cover=result.get("menu_logo");
        var arr = { id:good_id,price:result.get("price"),menu_name:result.get("menu_name"),sale_number:result.get("sale_number"),menu_logo:result.get("menu_logo"),num:0,good_number:result.get("good_number")};
        that.setData({
            good_info:arr,
            quantity1:{
              quantity:1,
              min:1,
              max:result.get("good_number")
            }
          })
        
      },
      error:(response)=>{
        console.log("商品详情查询失败");
      }
    });

    //查询商品图片
    var Good_Pic = Bmob.Object.extend("good_pic");
    var query = new Bmob.Query(Good_Pic);
    query.equalTo("good_id",good_id);
    query.find({
      success:function(result){
        var pic_attr=new Array();
        for(var i=0;i<result.length;i++){
          var object=result[i];
          var t=object.get("good_pic");
          pic_attr.push(t);
        }
        pic_attr.unshift(menu_cover);
        that.setData({
          imgUrls:pic_attr
        })
      },
      error:(response)=>{
        console.log("商品图片查询失败");
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  //返回首页
  index:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  //返回购物车
  cart:function(){
    wx.switchTab({
      url: '../cart/index',
    })
  },
  placeOrder:function(event){
    var name=event.target.dataset.name;
    if(name=='order'){
      this.setData({
        actionType:'payOrder'
      })
    }else if(name=='cart'){
      this.setData({
        actionType:'addCart'
      })
    }

    if(this.data.showModalStatus){
      this.hideModal();
    }else{
      this.showModal();
    }
  },
  showModal:function(){
    var animation=wx.createAnimation({
      duration: 200,//动画持续时间
      timingFunction: "linear",//定义动画的效果
      delay: 0 //动画延迟时间
    })
    this.animation=animation;
    animation.translateY(300).step();
    this.setData({
      animationData:animation.export(),
      showModalStatus:true
    })
    setTimeout(function(){
      animation.translateY(0).step()
      this.setData({
        animationData:animation.export()
      })
    }.bind(this),200)
  },
  hideModal:function(){
    var animation=wx.createAnimation({
      duration: 200,//动画持续时间
      timingFunction: "linear",//定义动画的效果
      delay: 0//动画延迟时间
    })
    this.animation=animation
    animation.translateY(300).step()
    this.setData({
      animationData:animation.export()
    })
    setTimeout(function(){
      animation.translateY(0).step();
      this.setData({
        animationData:animation.export(),
        showModalStatus:false
      })
    }.bind(this),200)
  },
  click_cancel:function(){
    this.hideModal();
  },
  handleZanQuantityChange(e){
    var componentId=e.componentId;
    var quantity = e.quantity;

    this.setData({
      [`${componentId}.quantity`]:quantity
    });

  }
}))