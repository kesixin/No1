var Bmob = require("../../utils/bmob.js");
var common = require("../../utils/common.js");
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddr: false,//显示收货地址
    showAddAddr: true,//选择收货地址
    totalMoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //获取用户的信息
    var User = Bmob.Object.extend("_User");
    var query = new Bmob.Query(User);
    var currentUser = Bmob.User.current();
    var objectid = currentUser.id;
    query.get(objectid, {
      success: function (result) {
        var name = result.get("name");
        if (name) {
          that.setData({
            showAddr: true,
            showAddAddr: false,
          })
        }
        var tel = result.get('tel');
        var addrdetail = result.get('addrdetail');
        that.setData({
          name: name,
          tel: tel,
          addrdetail: addrdetail,
        })
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
    wx.getStorage({
      key: 'orderResult',
      success: function (res) {
        var len = res.data.length;
        var total = 0;
        for (var i = 0; i < len; i++) {
          total += res.data[i].number * res.data[i].price;
        }
        that.setData({
          totalMoney: total,
          detail: res.data
        })
      },
    })
  },
  getAddress: function () {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          showAddAddr: false,
          showAddr: true,
          name: res.userName,
          addrdetail: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          tel: res.telNumber
        })
        let User = Bmob.Object.extend("_User");
        let query = new Bmob.Query(User);
        let currentUser = Bmob.User.current();
        let objectid = currentUser.id;
        query.get(objectid, {
          success: (result) => {
            result.set('name', res.userName);
            result.set('tel', res.telNumber);
            result.set('addrdetail', res.provinceName + res.cityName + res.countyName + res.detailInfo);
            result.set('mailcode', res.nationalCode);
            result.save({
              success: (result) => { },
              error: (result, error) => {
                console.log("地址创建失败");
              }
            });
          },
          error: (object, error) => {
            console.log(object);
          }

        })
      }
    })
  },
  placeOrder: function (event) {
    if (this.data.showAddAddr) {
      common.showTip("请填写收货地址", "loding");
      return;
    }

    var orderDetail = this.data.detail;
    var userInfo = { name: this.data.name, tel: this.data.tel, addrdetail: this.data.addrdetail };
    var totalPrice = this.data.totalMoney;
    var remarks = event.detail.value.remark;
    var openId = wx.getStorageSync('openid');

    Bmob.Pay.wechatPay(totalPrice, '小程序商城', '小程序商城订单支付', openId).then(function (resp) {
      //微信支付
      var timeStamp = resp.timestamp,
        nonceStr = resp.noncestr,
        packages = resp.package,
        orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
        sign = resp.sign;
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: packages,
        signType: 'MD5',
        paySign: sign,
        'success': function (res) {
          var User = Bmob.Object.extend("_User");
          var currentUser = Bmob.User.current();
          var objectid = currentUser.id;
          var Order = Bmob.Object.extend("Order");
          var order = new Order();
          var me = new Bmob.User();
          me.id = objectid;
          order.set('remarks', remarks);
          order.set('orderUser', me);
          order.set('totalprice', parseFloat(totalPrice));
          order.set('orderDetail', orderDetail);
          order.set('orderId', orderId);
          order.set('status', 1);
          order.set('userInfo', userInfo);
          order.save(null, {
            success: function (result) {
              wx.redirectTo({
                url: '../order/index'
              })
            },
            error: function (result, error) {

            }
          })
        },
        'fail': function (res) {
          console.log(res)
          var User = Bmob.Object.extend("_User");
          var currentUser = Bmob.User.current();
          var objectid = currentUser.id;
          var Order = Bmob.Object.extend("Order");
          var order = new Order();
          var me = new Bmob.User();
          me.id = objectid;
          order.set("remarks", remarks);
          order.set("orderUser", me);
          order.set("totalprice", parseInt(totalPrice));
          order.set("orderDetail", orderDetail);
          order.set("status", 0);
          order.set("userInfo", userInfo);
          order.set("orderId", orderId);
          order.save(null, {
            success: function (result) {
              console.log(result.id)
            },
            error: function (result, error) {

            }
          });
        }
      })
    },
      function (err) {
        //没有微信支付，保存订单
        var User = Bmob.Object.extend("_User");
        var currentUser = Bmob.User.current();
        var objectid = currentUser.id;
        var Order = Bmob.Object.extend("Order");
        var order = new Order();
        var me = new Bmob.User();
        me.id = objectid;
        order.set("remarks", remarks);
        order.set("orderUser", me);
        order.set("totalprice", parseInt(totalPrice));
        order.set("orderDetail", orderDetail);
        order.set("status", 0);
        order.set("userInfo", userInfo);
        order.set("orderId", "123456789");
        order.save(null, {
          success: function (result) {
            wx.redirectTo({
              url: '../order/index'
            })
          },
          error: function (result, error) {

          }
        });
      }
    )

  }
})