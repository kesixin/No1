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
    var that = this;
    var value = wx.getStorageSync('openid')
    if (value == null || value == '') {
      that.setData({
        showView: true,
      })
    } else {
      that.setData({
        showView: false,
      })
    }
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
    const adv = Bmob.Object.extend("adv");
    const advQuery = new Bmob.Query(adv);
    advQuery.equalTo("is_show",1);
    advQuery.find({
      success:(results)=>{
        const data = [];
        for (let object of results) {
          data.push({
            id: object.get('good_id'),
            url: object.get('adv')
          })
        }
        this.setData({
          banner: data
        })
      },
      error:(error)=>{
        console.log("查询失败");
      }
    });

    //查询推荐的商品
    var Good=Bmob.Object.extend("good");
    var query=new Bmob.Query(Good);
    query.equalTo("is_delete",0);
    query.equalTo("is_rec",1);
    query.find({
      success:(result)=>{
        var goodsArray=new Array();
        for(var i=0;i<result.length;i++){
          var object=result[i];
          var class_value='';
          if(i ==0 || i%2==0){
            class_value='left-box';
          }else{
            class_value='right-box';
          }
          var t = { menu_logo: object.get('menu_logo'), menu_name: object.get('menu_name'), id: object.id, price: object.get('price'), class_value: class_value}
          goodsArray.push(t);
        }
        this.setData({
          goods:goodsArray
        })
      },
      error:(error)=>{
        console.log("商品查询失败");
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
    
  },
  change: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  more:function(){
    wx.navigateTo({
      url: '../shop/index',
    })
  }
})