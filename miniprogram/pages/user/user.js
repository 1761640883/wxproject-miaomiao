// miniprogram/pages/user/user.js
const db = wx.cloud.database()//在开始使用数据库 API 进行增删改查操作之前，需要先获取数据库的引用
const app = getApp()// 通过getApp()方法可以获取到app.js的this对象，然后通过app获取app的对象

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: "/images/user/user-unlogin.png",
    nickName: "小喵喵",
    logged: false,
    disabled: true,
    id: ''
  },

  bindGetUserInfo(ev){// 第一次登录
    // console.log(ev.detail.userInfo)
    let userInfo = ev.detail.userInfo;
    if(!this.data.logged && userInfo){
      db.collection('users').add({
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature: '',
          phoneNumber: '',
          weixinNumber: '',
          links: 0,// 点赞数
          time: new Date(),
          isLocation: true,
          friendList: [],
          latitude: this.latitude,
          longitude: this.longitude,
          location: db.Geo.Point(this.longitude, this.latitude)// 创建索引值
        }
      }).then((res)=>{
        // console.log(res)// res只能获取用户的id
        db.collection('users').doc(res._id).get().then(res=>{// doc()获取集合中指定记录的引用。方法接受一个 id 参数，指定需引用的记录的 _id; get():获取该集合的数据
          // console.log(res.data)
          app.userInfo = Object.assign(app.userInfo, res.data);// 修改app对象数据（）
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          })
        })
      });
    }
  },

  getMessage(){// 监听消息的变化
    db.collection('message').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function(snapshot) {// onChange：每次能够监听到数据库的变化
        // console.log(snapshot)
        if(snapshot.docChanges.length){// 判断是否有数据
          let list = snapshot.docChanges[0].doc.list;
          if(list.length){// 判断是否有新增的数据
            wx.showTabBarRedDot({// 消息提示的小红点
              index: 2// tabbar的下标
            })
            app.userMessage = list
          }else{
            wx.hideTabBarRedDot({// 取消小红点
              index: 2,
            })
            app.userMessage = [];
          }
        }
      },
      onError: function(err) {//onError：发生错误时打印信息 
        console.error('the watch closed because of error', err)
    }
    })
  },

  getLocation(){
    wx.getLocation({
      type: 'gcj02',// 工具中定位模拟使用IP定位，可能会有一定误差。且工具目前仅支持 gcj02 坐标。
      success: (res=>{// 回调this指向会改变，但是用箭头函数就不会更改this指向
        // 不需要渲染，直接挂载到this对象下面
        this.latitude = res.latitude// 经度
        this.longitude = res.longitude// 纬度
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
    // 自动登录
    this.getLocation();// 获取地理位置

    wx.cloud.callFunction({
      name: "login",
      data: {}
    }).then(res=>{
      // console.log(res.result.openid);
      db.collection('users').where({// where():查询（这里不能用doc，因为doc只能查找唯一id，也就是微信的用户id不是我们小程序的id）
        _openid: res.result.openid
      }).get().then(res=>{
        // console.log(res.data)
        if(!res.data.length){// 判断有没有该用户
          // 没有-显示注册按钮
          this.setData({
            disabled: false
          })
          return;
        }
        // console.log(app.userInfo)
        app.userInfo = Object.assign(app.userInfo, res.data[0]);
        this.setData({
          userPhoto: app.userInfo.userPhoto,
          nickName: app.userInfo.nickName,
          logged: true,
          id: app.userInfo._id
        },()=>{
          this.getMessage()//自动登录完成，进行数据库监控
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示（每次显示当前页面就会触发）
   */
  onShow: function () {
    this.setData({
      userPhoto: app.userInfo.userPhoto,
      nickName: app.userInfo.nickName,
      id: app.userInfo._id
    })
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