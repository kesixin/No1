var Bmob = require("../../utils/bmob.js");
var Good = Bmob.Object.extend("good");
var query = new Bmob.Query(Good);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],//页面数据
    pagination:0,//页码
    pageSize:5,//每页数据
    nodata:true,//无数据
    searchVal:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(){
    this.getData();
  },
  getData:function(){
    query.equalTo("menu_name", { "$regex": `${this.data.searchVal}.*` });//模糊查询
    query.limit(this.data.pageSize);//返回n条数据
    query.skip(this.data.pageSize * this.data.pagination);//分页查询
    query.descending('weight'); //按权重排序 降序
    query.find({
      success:(results)=>{
        let data = [];
        for(let object of results){
          data.push({
            id:object.id,
            title:object.get("menu_name"),
            image:object.get("menu_logo"),
            price:object.get("price"),
            oldPrice:(object.get("price")*1.6).toFixed()
          })
        }
        //判读是否有数据返回
        if(data.length){
          let goods = this.data.goods;
          let pagination = this.data.pagination;//获取当前分页
          goods.push.apply(goods,data);//将页面上面的数据和最新获取到的数组进行合并
          pagination = pagination ? pagination+1:1;

          this.setData({
            goods:goods,
            pagination:pagination
          })
        }else{
          this.setData({
            nodata:false
          })
        }
      }
    });
  },
  router:function(e){
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/good/index?id=${id}`
    })
  },
  clear:function(){
    this.setData({
      goods:[],
      pagination:0,
      pageSize:8,
      nodata:true,
      searchVal:""
    })
    this.getData();
  },
  input:function(e){
    this.setData({
      searchVal:e.detail.value
    })
  },
  search:function(){
    
    if (this.data.searchVal!==""){
      this.setData({
        goods: [],
        pagination: 0,
        pageSize: 8,
        nodata: true,
      })
      query.equalTo("menu_name", { "$regex": `${this.data.searchVal}` });
      query.limit(this.data.pageSize);
      query.skip(this.data.size * this.data.pagination);
      query.descending('createdAt');
      query.find({
        success: (results) => {
          let data = [];
          for (let object of results) {
            data.push({
              id: object.id,
              title: object.get("menu_name"),
              image: object.get("menu_logo"),
              price: object.get("price"),
              oldPrice: (object.get("price") * 1.6).toFixed(),
            })
          }
          this.setData({
            goods: data
          })
        }
      })
    }  
  }
})