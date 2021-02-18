// components/search/search.js
const app = getApp();
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus(){// 获取光标
      wx.getStorage({// 获取历史记录
        key:"searchHistory",
        success: (res)=>{
          console.log(res)
          this.setData({
            historyList: res.data
          })
        }
      })
      this.setData({
        isFocus: true
      })
    },
    handleCancel(){// 取消按钮
      this.setData({
        isFocus: false
      })
    },
    handleConfirm(ev){//点击完成按钮时触发
      // console.log(ev.detail.value);
      let value = ev.detail.value// 拿到搜索关键词
      let cloneHistoryList = [...this.data.historyList]// 将搜索框的内容缓存
      cloneHistoryList.unshift(value)// 将新的搜索名插在数组前面
      wx.setStorage({// 缓存历史记录
        key:"searchHistory",
        data: [...new Set(cloneHistoryList)]// 通过set集合去掉数组的重复数据，然后通过展开符展开在数组内部
      })

      this.changeSearchList(value);// 搜索
    },
    handleDelete(){// 删除历史记录
      wx.removeStorage({
        key: 'searchHistory',
        success: (res)=>{
          this.setData({
            historyList: []
          })
        }
      })
    },
    changeSearchList(value){// 搜索
      db.collection('users').where({
        nickName: db.RegExp({// RegExp: 类似于js的正则表达式（这里也可以叫做模糊查询）
          regexp: value,
          options: 'i',// 无视大小写
        })
      }).field({
        userPhoto: true,
        nickName: true
      }).get().then(res=>{
        // console.log(res)
        this.setData({
          searchList: res.data
        })
      })
    },
    handleHistoryItemDel(ev){
      let value = ev.target.dataset.text;
      this.changeSearchList(value)
    }
  }
})
