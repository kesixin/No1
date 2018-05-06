// pages/type/index.js
var that;
var Bmob=require("../../utils/bmob.js");
var optionId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    currentType:0,
    menu:[],
  },

  bindChange:function(e){
    that = this;
    that.setData({ currentTab: e.detail.current });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    optionId = options.currentTab;
    that = this;
    that.setData({
      currentTab: optionId
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    var Good_type=Bmob.Object.extend("good_type");
    var query=new Bmob.Query(Good_type);
    query.find({
      success:(result)=>{
        var typeArray=new Array();
        for (var i = 0; i < result.length;i++){
          var object=result[i];
          var t = { id: i, type_id: object.id, type_name: object.get('type_name')};
          typeArray.push(t);
        }
        this.setData({
          menu:typeArray
        });
      },
      error:(error)=>{
        console.log("商品分类查询失败");
      }
    });

    var Menu = Bmob.Object.extend("good");
    var goodQuery=new Bmob.Query(Menu);
    goodQuery.include("type");
    goodQuery.find({
      success:(result)=>{
        var menuType = that.data.menu;
        var menuArray = new Array();
        var Data = new Array();

        for(var i=0;i<result.length;i++){
          var a = { id: result[i].id, type_name: result[i].get("type").type_name, menu_type: result[i].get("type").objectId, price: result[i].get("price"), sale: result[i].get("sale_number"), menu_name: result[i].get("menu_name"), createdAt: result[i].createdAt, menu_logo: result[i].get("menu_logo"), sale_number: result[i].get("sale_number"), num: 0 }
          menuArray.push(a);
        }
        for(var l in menuType){
          var data=new Array();
          var menuData = { foodType: menuType[l].type_name, id: menuType[l].id, data: data}
          for(var k in menuArray){
            if(menuType[l].type_id == menuArray[k].menu_type){
              data.push(menuArray[k]);
            }
          }
          Data.push(menuData);
        }
        this.setData({
          menu:Data
        })
      },
      error:(response)=>{
        console.log("商品查询失败");
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
    var title="商品分类";
    var path="pages/type/index";
    return{
      title:title,
      path:path
    }
  },

  chooseType:function(event){
    var foodType=event.target.dataset.foodtype;
    that.setData({
      currentType:foodType
    })
  }
})