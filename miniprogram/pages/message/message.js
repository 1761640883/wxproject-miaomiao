// miniprogram/pages/message/message.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMessage: [],
    logged: false
  },

  onMyEvent(ev){// 用于子父通讯
    this.setData({// 遇到了一个问题，数据更新后这里并不会再次触发。导致数据更新显示错误，删掉了最后一个。解决办法，先把数据设置为空，再复制，这样就会触发数据更新
      userMessage: []
    }, ()=>{
      this.setData({
          userMessage: ev.detail
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!app.userInfo._id){
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: 'none',
        success: ()=>{
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/user/user',
            })
          }, 2000)
        }
      })
    }else{
      this.setData({
        logged: true,
        userMessage: app.userMessage
      })
    }
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