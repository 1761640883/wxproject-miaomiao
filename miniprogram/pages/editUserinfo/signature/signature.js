// miniprogram/pages/editUserinfo/signature/signature.js
const app = getApp();
const db = wx.cloud.database();// 获取数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signature: ''
  },

  handleText(ev){
    let value = ev.detail.value
    this.setData({
      signature: value
    })
  },

  handleBtn(){
    this.upDateSignature()
  },

  upDateSignature(){
    wx.showLoading({// 加载中。弹窗
      title: '更新中',// 弹窗文字
    })
    db.collection('users').doc(app.userInfo._id).update({// update：修改
      data: {
        signature: this.data.signature
      }
    }).then(res=>{
      wx.hideLoading();// 结束加载弹窗
      wx.showToast({// 提示弹窗（无确认或取消等按键）
        title: '更新成功',// 弹窗标题
      })
      app.userInfo.signature = this.data.signature
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
    this.setData({
      signature: app.userInfo.signature
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