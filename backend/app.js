//配置项目环境配置
require('dotenv').config('.env')

//三方中间件
const cors  = require('cors')
const morgan  = require('morgan')
//自定义 中间件
const noMatchMiddleware = require('./src/middleware/404.middleware')
const errorMiddleware  =require('./src/middleware/error.middleware')



const express = require('express')
const initDB = require('./src/init/initDB')
const initServer = require('./src/init/initServer')
const initRoute  =require('./src/init/initRoute')

const app = express()

// 应用中间件
//跨域
app.use(cors())

//数据解析
app.use(express.json())

//http 请求日志
app.use(morgan('tiny')) // morgan(':method :url :status :res[content-length] - :response-time ms')

//初始化路由
initRoute(app)

//静态服务
app.use(express.static('public'))

// 使用404
app.use(noMatchMiddleware)

// 错误处理
app.use(errorMiddleware)
 

const main = async ()=>{
    await initDB()
    await initServer(app)
}


main()


// postman - api - backend

