// pages/center/index.js
var Bmob = require("../../utils/bmob.js");

Page({
  data:{},
  onLoad:function(options){
    var that = this;
    var openid = wx.getStorageSync('openid');
    if(openid){
      var u = Bmob.Object.extend("_User");
      var query = new Bmob.Query(u);
      query.equalTo('openid',openid);
      query.find({
        success:function(results){
          that.setData({
            userInfo:results[0]
          });
        },
        error:function(error){

        }
      })
    }
  },
  cart:function(){
    //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
    wx.switchTab({
      url: '../cart/index',
    })
  },
  feedback:function(){
    wx.navigateTo({
      //保留当前页面，跳转到应用内的某个页面
      url: './feedback/feedback',
    })
  }

})