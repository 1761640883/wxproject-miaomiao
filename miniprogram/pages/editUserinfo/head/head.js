// miniprogram/pages/editUserinfo/head/head.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: ''
  },

  handleUploadImage(){// 访问本地图片
    wx.chooseImage({// 微信小程序提供的api，用来访问本地的相册
      count: 1,// 可选图片数量
      sizeType: ['compressed'],// 所选的图片的尺寸
      sourceType: ['album', 'camera'],// 相册还是拍照
      success: (res)=>{// 获取图片
        // console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        this.setData({
          userPhoto: tempFilePaths
        })
      }
    })
  },

  handleBtn(){// 上传图片到存储
    wx.showLoading({
      title: '上传中',
    })
    // 不提前在存储中创建userPhoto文件，这里上传后也会自动生成
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + '.jpg';// userPhoto/后面的类容会称为图片名称
    wx.cloud.uploadFile({// uploadFile：将本地资源上传到云储存空间
      // cloudPath:  cloudPath,// 下面是简写
      cloudPath,// 上传路径
      filePath: this.data.userPhoto, // 文件路径（临时的）
      // 这个支持then写法
      /* success: res => {
        // get resource ID
        console.log(res.fileID)// fileID：小程序根据他来更新存储的
      },
      fail: err => {
        // handle error
      } */
    }).then(res=>{
      console.log(res);
      let fileID = res.fileID;// 返回值res.fileID是图片的路径
      if(fileID){
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userPhoto: fileID
          }
        }).then(res=>{
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
          });
          app.userInfo.userPhoto = fileID
        });
      }
    });
  },

  bindGetUserInfo(ev){
    // console.log(ev)
    let userInfo = ev.detail.userInfo;
    if(userInfo){
      this.setData({
        userPhoto: userInfo.avatarUrl
      },()=>{
        this.upDateUserPhoto();
      });
    }
  },

  upDateUserPhoto(){
    wx.showLoading({
      title: '更新中',
    });
    db.collection('users').doc(app.userInfo._id).update({
      data: {
        userPhoto: this.data.userPhoto
      }
    }).then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '更新成功',
      })
      app.userInfo.userPhoto = this.data.userPhoto
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
      userPhoto: app.userInfo.userPhoto
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