
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddr:false,//显示收货地址
    showAddAddr:true,//选择收货地址
    totalMoney:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    wx.getStorage({
      key: 'orderResult',
      success: function(res) {
        var len = res.data.length;
        var total = 0;
        for(var i=0;i<len;i++){
          total += res.data[i].number*res.data[i].price;
        }
        that.setData({
          totalMoney:total,
          detail:res.data
        })
      },
    })
  },
})