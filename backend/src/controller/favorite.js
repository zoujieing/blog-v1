
const HttpException = require("../exception/http.exception")
const Article = require("../model/article")
const User =  require('../model/user')
const Tag =  require('../model/tag')
const { getFavorite,handleArticle}  = require('./article')

 
// 控制器 ： 添加喜欢
const addFavorite = async (req,res,next)=>{
    try {

        // 获取文章slug
        const {slug}  = req.params

        //获取文章 ： 包含标签
        let article = await Article.findByPk(slug,{include:Tag})

        // 喜欢文章的用户 ： 登录用户
        const userEmail = req.user.email
        const user = await User.findByPk(userEmail)

        //文章添加喜欢的用户 : 四种方式
        // await article.addUsers(userEmail)
        // await article.addUsers(user)
        // await article.addUser(userEmail)
        await article.addUser(user)

        //获取作者信息
        const author = await article.getUser() // 文章作者

        //获取喜欢信息
        const {favoriteCount,favoried} = await getFavorite(article,req.user)

        //响应数据处理
        article = handleArticle(article,author,favoriteCount,favoried)

        //响应数据
        res
        .status(200)
        .json({
            status:1, 
            message:'添加喜欢成功',
            data:article
        })
    } catch (error) {
        next(error)
    }
}

// 控制器 ： 取消喜欢
const removeFavorite = async (req,res,next)=>{
    try {
       
        // 获取文章slug
        const {slug}  = req.params

        //获取文章 ： 包含标签
        let article = await Article.findByPk(slug,{include:Tag})

        // 喜欢文章的用户 ： 登录用户
        const userEmail = req.user.email
        const user = await User.findByPk(userEmail)

         // 文章取消喜欢
        // await article.removeUser(user)
        await article.removeUsers(user)
       

        //获取作者信息
        const author = await article.getUser() // 文章作者

        //获取喜欢信息
        const {favoriteCount,favoried} = await getFavorite(article,req.user)

        //响应数据处理
        article = handleArticle(article,author,favoriteCount,favoried)


        res
        .status(200)
        .json({
            status:1, 
            message:'取消喜欢成功',
            data:article
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    addFavorite,
    removeFavorite
}