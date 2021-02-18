const router = require('koa-router')()
const config = require('../config.js')// 引入config.js
const request = require('request-promise')// 发起请求（服务端的get和post）
const fs = require('fs')// 操作文件的内置模块

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/uploadBannerImg', async( ctx, next)=>{
  var files = ctx.request.files;
  var file = files.file
  try{
    let options = {
      uri: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`,
      json: true
    }
    let {access_token} = await request(options);// 获取接口调用凭证
    let fileName = `${Date.now()}.jpg`;// 图片名字
    let filePath = `banner/${fileName}`;// 上传路径
    options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,// 使用接口调用凭证
      body: {
        "env": "fan-hello-9gbvixvxbae76915",// 指定云环境id
        "path": filePath// 上传路径
      },
      json: true
    }
    let res = await request(options);// 这里上传成功后，会返回一个新的链接和数据。
    let file_id = res.file_id;// 图片路径

    options = {
      method : 'POST',
      uri : 'https://api.weixin.qq.com/tcb/databaseadd?access_token=' + access_token + '',
      body : {
        "env": 'fan-hello-9gbvixvxbae76915',
        "query" : "db.collection(\"banner\").add({data:{fileId:\""+ file_id +"\"}})"//// 异步传输，防止服务端解析，所以通过字符串直接传给云服务器
      },
      json : true
    }

    await request(options)

    options = {// 我们需要用给的链接发起一个新的请求，把拿到的数据映射到需要映射的地方
      method: 'POST',
      uri: res.url,
      formData: {
        "Signature": res.authorization,// 这些是要映射的东西
        "key": filePath,
        "x-cos-security-token": res.token,
        "x-cos-meta-fileid": res.cos_file_id,
        "file": {
          value: fs.createReadStream(file.path),
          options: {
            filename: fileName,
            contentType: file.type
          }
        }
      }
    }
    await request(options);
    ctx.body = res;
  }catch(err){
    console.log(err.stack)
  }
})


module.exports = router
