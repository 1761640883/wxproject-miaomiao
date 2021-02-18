// miniprogram/pages/detail/detail.js
const db = wx.cloud.database();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detalist: {},
    isFriend: false,
    isHidden: false
  },

  handleAddFriend(){// 发送好友申请
    if(app.userInfo._id){// 判断用户登录
      db.collection('message').where({
        userId: this.data.detalist._id
      }).get().then(res=>{
        if(res.data.length){// 判断她数据库是否有好友要求的列表，没有则添加，有则更新
          // 更新操作
          if(res.data[0].list.includes(app.userInfo._id)){// 判断是否申请过
            wx.showToast({
              title: '已申请过!',
            })
          }else{// 更新是通过userId（好友id）来进行更新，通过id（自动生成）是找到唯一标识。虽然userId（好友id）也是唯一标识，但数据库并不这么认为。所以它会以为你是批量更新，因此我们需要通过云函数来进行更新
            wx.cloud.callFunction({// 通过云函数添加数据
              name: 'update',
              data: {
                collection: 'message',
                where: {
                  userId: this.data.detalist._id
                },
                data: `{list: _.unshift('${app.userInfo._id}')}`//_unshift(): 数组更新操作符，对一个值为数组的字段，往数组头部添加一个或多个值。或字段原为空，则创建该字段并设数组为传入值。
              }
            }).then(res=>{
              wx.showToast({
                title: '申请成功~',
              })
            })
          }
        }else{// 添加
          db.collection('message').add({
            data: {
              userId: this.data.detalist._id,
              list: [app.userInfo._id]
            }
          }).then((res)=>{
            wx.showToast({
              title: '申请成功',
            })
          })
        }
      })
    }else{
      wx.showToast({
        title: '请先登录',// 弹窗内容
        duration: 2000,// 持续时间
        icon: 'none',// 不显示图标
        success: ()=>{
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/user/user',
            })
          }, 2000)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {// options可以得到配置信息
    // console.log(options)// userId: "28ee4e3e602788c404f97e4005e58d4d"
    let  userId = options.userId;
    db.collection('users').doc(userId).get().then(res=>{
      this.setData({
        detalist: res.data
      });
      let friendList = res.data.friendList;
      if(friendList.includes(app.userInfo._id)){// 判断是否为好友
        this.setData({
          isFriend: true
        })
      }else{
        this.setData({
          isFriend: false
        },()=>{
          if(userId == app.userInfo._id){// 判断是否是自己
            this.setData({
              isFriend: true,
              isHidden: true
            })
          }
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