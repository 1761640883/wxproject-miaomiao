// miniprogram/pages/friendList/friendList.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList: []
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
    // 好友列表查询数据库需要查询两遍，1.用户的好友列表；2.用户好友的信息。这里我们可以进行优化，只查询一遍
    db.collection('users').where({// 因为好友是相互的，所以我们直接查找好友列表里含有我的用户信息
      friendList: app.userInfo._id
    }).field({
      userPhoto: true,
      nickName: true
    }).get().then(res=>{
      // console.log(res.data)
      this.setData({
        friendList: res.data
      })
    })
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