// miniprogram/pages/near/near.js
const db = wx.cloud.database();
const app = getApp();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: []// 好友位置
  },

  getLocation(){// 获取当前位置
    wx.getLocation({
      type: 'gcj02',// 工具中定位模拟使用IP定位，可能会有一定误差。且工具目前仅支持 gcj02 坐标。
      success: (res=>{// 回调this指向会改变，但是用箭头函数就不会更改this指向
        const latitude = res.latitude// 经度
        const longitude = res.longitude// 纬度
        this.setData({
          latitude,
          longitude
        });
        this.getNearUsers();
      })
    })
  },

  getNearUsers(){// 获取其他用户位置
    db.collection('users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 10000,
      }),
      isLocation: true// 用户是否开启位置共享
    }).field({
      longitude: true,
      latitude: true,
      userPhoto: true
    }).get().then(res=>{
      // console.log(res)
      let data = res.data;
      let result = [];
      if(data.length){
        for(let i = 0; i < data.length; i++){
          //以前的地图组件无法识别本地上传的图片路径。我们就可以把它转化为临时的网络图片（现在map组件可以识别本地路径）
          if(data[i].userPhoto.includes('cloud://')){// 判断是否是本地路径（cloud://就是本地图片的路径格式）
            wx.cloud.getTempFileURL({// 是本地路径，通过wx.cloud.getTempFileURL转为临时路径
              fileList: [data[i].userPhoto],// 图片路径
              success: res => {
                result.push({
                  iconPath: res.fileList[0].tempFileURL,// 头像
                  id: data[i]._id,
                  latitude: data[i].latitude,
                  longitude: data[i].longitude,
                  width: 30,// 图片大小
                  height: 30// 图片大小
                });
                this.setData({// wx.cloud.getTempFileURL是异步执行，这里不写，会导致数据未更新上
                  markers: result
                });
              }
            })
          }else{
            //不是本地路径，不需要转化
            result.push({
              iconPath: data[i].userPhoto,// 头像
              id: data[i]._id,
              latitude: data[i].latitude,
              longitude: data[i].longitude,
              width: 30,// 图片大小
              height: 30// 图片大小
            });
          }
        }
        this.setData({
          markers: result
        });
      }
    })
  },

  markertap(ev){// 点击标记点触发事件（这里点击地图上的头像跳转详情页）
    wx.navigateTo({// 这里出现问题，无法获取用户信息，用户id也是错的。因为markerId只识别number而用户id是字符串（真机上可以获取到数据）
      url: '/pages/detail/detail?userId=' + ev.detail.markerId,
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
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation();
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