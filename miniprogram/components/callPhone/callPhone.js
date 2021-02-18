// components/callPhone/callPhone.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {// 接收外部的自定义属性传过来的值
    phoneNumber: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCallPhone(){
      wx.makePhoneCall({
        phoneNumber: this.data.phoneNumber//仅为示例，并非真实的电话号码
      })
    }
  }
})
