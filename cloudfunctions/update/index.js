// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "fan-hello-9gbvixvxbae76915"// 固定云开发环境
})

const db = cloud.database()// 得到数据库
const _ = db.command// 获取运算能力，去进行inc的调用

// 云函数入口函数
exports.main = async (event, context) => {// event：前端传参过来，可以调用的对象
  try {

    if(typeof event.data == 'string'){// 判断是否是字符串，如果只是普通的对象就不执行这里
      event.data = eval('('+event.data+')')// eval：把字符串转为js语句的（把解析的结果重新赋值为js语句）
    }

    if(event.doc){// 因为doc和where冲突了，所以分开写
      return await db.collection(event.collection)
      .doc(event.doc)
      .update({
        data: {
          ...event.data// 通过event运算符，将event.data的内容展开
        }
      })
    }else{
      return await db.collection(event.collection)
      .where({...event.where})
      .update({
        data: {
          ...event.data// 通过event运算符，将event.data的内容展开
        }
      })
    }
  } catch(e) {
    console.error(e)
  }
}