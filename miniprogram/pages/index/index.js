// miniprogram/pages/index/index.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [],
    listData: [],
    current: 'links'
  },

  handleLinks(ev){
    let id = ev.target.dataset.id;

    //因为权限问题无法给别人点赞，所以转用后端写
    /* db.collection('users').doc(id).update({
      data: {
        links: 5
      }
    }).then(res=>{}); */

    // 云函数update写好了，现在写前端
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,// 用户id
        data: '{links: _.inc(1)}'
        /* {// 这样还是无法把方法传递给服务端使用（因为他会在前端先解析，传递给后端已经来来不及了（解析完毕了））
          links: _.inc(1)
        } */
      }
    }).then(res=>{
      let updated = res.result.stats.updated;
      if(updated){
        let cloneListDate = [...this.data.listData]
        for(let i = 0; i < cloneListDate.length; i++){
          if(cloneListDate[i]._id == id){
            cloneListDate[i].links++;
          }
        }
        this.setData({
          listData: cloneListDate
        })
      }
    })
  },

  testMesthod(){
    return 123;
  },

  handleCurrent(ev){
    let current = ev.target.dataset.current;
    if(current == this.data.current){
      return;
    }
    this.setData({
      current
    },()=>{
      this.getListData();
    })
  },

  getListData(){// 获取数据
    db.collection('users').field({
      links: true,// true：要的数据；false：不要的数据（不写就默认false）
      nickName: true,
      userPhoto: true
    }).orderBy(this.data.current, 'desc').get().then(res=>{// 指定查询排序条件：orderBy（参数1：排序的属性；参数2：desc（从高到低） 和 asc（从低到高））
      this.setData({
        listData: res.data
      })
    })
  },

  hanleDetail(ev){// 跳转详情页
    let id = ev.target.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?userId=${id}`
    })
  },

  getBannerList(){// 获取广告列表
    db.collection('banner').get().then(res=>{
      // console.log(res.data)
      this.setData({
        background: res.data 
      })
    })
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
    this.getListData();
    this.getBannerList();
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

  }
})