var common = require("../../utils/common.js");

Page({
  data: {
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      allSelect: true,
      noSelect: false,
      list: []
    },
    delBtnWidth:120, //删除按钮宽度单位（rpx）
  },
  onLoad:function(){
    this.initEleWidth();
    this.onShow();
  },
  onShow: function () {
    //获取购物车数据
    var shopCarInfoMem = wx.getStorageSync('cartResult');

    this.data.goodsList.list = shopCarInfoMem;
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), shopCarInfoMem);
    console.log(shopCarInfoMem);
  },
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth:delBtnWidth
    });
  },
  //获取元素自适应后的实际宽度
  getEleWidth:function(w){
    var real = 0;
    try{
      var res = wx.getSystemInfoSync().windowWidth;
      console.log(res);
      var scale = (750/2)/(w/2); //以宽度750px设计稿做宽度的自适应
      real = Math.floor(res/scale);
      return real;
    }catch(e){
      return false;
    }
  },
  toIndexPage:function(){
    wx.navigateTo({
      url: '../shop/index',
    });
  },
  setGoodsList: function (saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });

    wx.setStorage({
      key: 'cartResult',
      data: list,
    })
  },
  getSaveHide: function () {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  totalPrice: function () {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.price) * curItem.number;
      }
    }
    return total;
  },
  allSelect: function () {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++
      }
      if (noSelect == list.length) {
        return true;
      } else {
        return false;
      }
    }
  },
  selectTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index !== "" && index !=null){
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(),list);
    }
  },
  //获取水平坐标
  touchS:function(e){
    if(e.touches.length == 1){
      this.setData({
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
    var index = e.currentTarget.dataset.index;
    if(e.touches.length == 1){
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if(disX == 0 || disX <0){ //如果移动距离小于等于0，container位置不变
        left="margin-left:0px";
      }else if(disX>0){
        left = "margin-left:-"+disX+"px";
        if(disX>=delBtnWidth){
          left = "left:-"+delBtnWidth+"px";
        }
      }
      var list = this.data.goodsList.list;
      if(index != "" && index !=null){
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(),list);
      }
    }
  },
  touchE:function(e){
    var index = e.currentTarget.dataset.index;
    if(e.changedTouches.length==1){
      var endX= e.changedTouches[0].clientX;
      var disX= this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth/2 ? "margin-left:-"+delBtnWidth+"px":"margin-left:0px";
      var list = this.data.goodsList.list;
      if(index!==""&&index!=null){
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
  },
  delItem:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list.splice(index,1);
    this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
  },
  jiaBtnTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!=="" && index != null){
      if(list[parseInt(index)].number<10){
        list[parseInt(index)].number++;
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
  },
  jianBtnTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!==""&&index!=null){
      if(list[parseInt(index)].number>1){
        list[parseInt(index)].number--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  editTap:function(){
    var list= this.data.goodsList.list;
    for(var i=0;i<list.length;i++){
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  saveTap:function(){
    var list=this.data.goodsList.list;
    for(var i=0;i<list.length;i++){
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  bindAllSelect:function(){
    var currentAllSelect = this.data.goodsList.allSelect;
    var list=this.data.goodsList.list;
    if(currentAllSelect){
        for(var i=0;i<list.length;i++){
          var curItem = list[i];
          curItem.active = false;
        }
    }else{
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  deleteSelected:function(){
    var list = this.data.goodsList.list;
    for(var i=0;i<list.length;i++){
      var curItem = list[i];
      if(curItem.active){
        list.splice(i--,1);
      }
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  toPayOrder:function(){
    var that = this;
    if(this.data.goodsList.noSelect){
      common.showTip("请选择至少一件商品", "loading");
      return false;
    }
    wx.showLoading();

    //计算价格，判断库存
    var shopList =[];
    var shopCarInfoMem=wx.getStorageSync('cartResult');
    shopList=shopCarInfoMem;
    if(shopList.length == 0){
      common.showTip("请选择至少一件商品", "loading");
      return;
    }
    var orderResult = new Array();
    for(var i=0;i<shopList.length;i++){
      if(shopList[i].active){
        //判断库存
        if(shopList[i].good_number<shopList[i].number){
          common.showTip(shopList[i].name+"商品库存不足", "loading");
          return;
        }else{
          orderResult.push(shopList[i]);
        }
      }
    }
    wx.setStorage({
      key: 'orderResult',
      data: orderResult,
    })
    that.navigateToPayOrder();
  },
  navigateToPayOrder:function(){
    wx.removeStorageSync('cartResult');
    wx.hideLoading();
    wx.navigateTo({
      url: '../payorder/index',
    })
  }
})