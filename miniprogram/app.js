//app.js
App({
  onLaunch: function () {// 项目出发后就会触发onLaunch生命周期
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'fan-hello-9gbvixvxbae76915',// 指定云服务器环境，不写默认第一个
        traceUser: true,// 检测那些用户在进行小程序开发的云调用（在云开发 的运营分析 的用户访问里查看）
      })
    }

    this.globalData = {}
    this.userInfo = {}// 因为用户名所有组件都要使用，所以定义到全局
    this.userMessage = []
  }
})
