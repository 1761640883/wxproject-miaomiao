// components/removeList/removeList.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;// 获得运算的能力

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelMessage(){// 删除
      wx.showModal({// 带有确认和取消的提示框c
        text: '提示',// 标题
        content: '删除信息',// 文本
        confirmText: '删除',// 确认按钮的文字
        success: (res)=>{// 按下按钮后的回调
          if (res.confirm) {// 用户点击确定
            this.removeMessage()
          } else if (res.cancel) {// 用户点击取消
            console.log('用户点击取消')
          }
        }
      })
    },
    
    handleAddFriend(){// 添加好友
      wx.showModal({// 带有确认和取消的提示框
        text: '提示',// 标题
        content: '申请好友',// 文本
        confirmText: '同意',// 确认按钮的文字
        success: (res)=>{// 按下按钮后的回调
          if (res.confirm) {// 用户点击确定
            db.collection('users').doc(app.userInfo._id).update({// 给自己的好友列表添加好友
              data: {
                friendList: _.unshift(this.data.messageId)
              }
            }).then(res=>{})
            // 因为微信小程序有权限的问题，无法操作其他用户的信息。所以给别的账号添加好友只能通过云函数添加
            wx.cloud.callFunction({// 给好友的好友列表添加自己
              name: 'update',
              data: {
                collection: 'users',
                doc: this.data.messageId,
                data: `{friendList: _.unshift('${app.userInfo._id}')}`
              }
            }).then(res=>{})
            this.removeMessage()
          } else if (res.cancel) {// 用户点击取消
            console.log('用户点击取消')
          }
        }
      })
    },

    removeMessage(){// 更新好友申请列表
      db.collection('message').where({
        userId: app.userInfo._id
      }).get().then(res=>{
        // console.log(res)
        let list = res.data[0].list;
        list = list.filter((val, i)=>{// 过滤：输出不等于目标id的数据
          return val != this.data.messageId
        });
        // console.log(list)
        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'message',
            where: {
              userId: app.userInfo._id
            },
            data: {
              list
            }
          }
        }).then(res=>{
          this.triggerEvent('myevent', list)
        })
      })
    }
  },

  

  lifetimes: {// 遇到了一个问题，数据更新后这里并不会再次触发。导致数据更新显示错误，删掉了最后一个。但数据库的数据删的是对的
    attached: function() {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId).field({// _id是默认传过来的
        userPhoto: true,
        nickName: true
      }).get().then(res=>{
        // console.log(res.data)
        this.setData({
          userMessage: res.data
        })
      });
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
