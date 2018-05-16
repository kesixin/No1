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
    if(options.id){n
      that.setData({
        currentTab:options.id
      })
    }
  },
  onShow:function(){
    var currentUser = Bmob.User.current();
    var Order = Bmob.Object.extend("Order");
    var query = new Bmob.Query(Order);
    query.equalTo("orderUser",currentUser.id);
    query.descending("createdAt");
    query.find({
      success:function(result){

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
  }
})