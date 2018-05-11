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
  }

})