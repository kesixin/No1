//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("","");

App({
  onLaunch: function () {
    //wx.clearStorageSync();
    //调用API从本地缓存中获取数据
    try{
      var value = wx.getStorageSync('openid');
      if(value){

      }else{
        wx.login({
          success:function(res){
            var user = new Bmob.User();//开始注册用户
            user.loginWithWeapp(res.code).then(function(user){
              var openid = user.get("authData").weapp.openid;
              if(user.get("nickName")){
                //第二次访问
                wx.setStorageSync('openid', openid);
              }else{
                //保存用户信息
                wx.getUserInfo({
                  success:function(result){
                    var userInfo= result.userInfo;
                    var nickName = userInfo.nickName;
                    var avatarUrl = userInfo.avatarUrl;

                    var u = Bmob.Object.extend("_User");
                    var query = new Bmob.Query(u);
                    query.get(user.id,{
                      success:function(result){
                        result.set('nickName',nickName);
                        result.set('userPic',avatarUrl);
                        result.set('openid',openid);
                        result.save();
                        wx.setStorageSync('openid', openid);
                      }
                    })
                  }
                })
              }
            })
          }
        })  
      }
    }catch(e){}
  },
  globalData: {
    userInfo: null
  }
})
