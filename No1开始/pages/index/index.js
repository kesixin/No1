var Bmob=require("../../utils/bmob.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    autoplay:true,
    interval:5000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    //加载轮播图
    var adv = Bmob.Object.extend("adv");
    var advQuery = new Bmob.Query(adv);
    advQuery.equalTo("is_show",1);
    advQuery.find({
      success:function(results){
        console.log(results);
      },
      error:function(error){

      }
    });
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
    
  }
})