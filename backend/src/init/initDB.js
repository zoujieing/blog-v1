
const dbConnection = require('../db/connection')
const sequelize = require('../db/sequelize')

const User = require('../model/user')
const Article = require('../model/article')
const Comment = require('../model/comment')
const Tag = require('../model/tag')

//模型关系
// A.hasOne(B) // A 有一个B
// A.belongTo(B) // A 属于B
// A.hasMany(B) // A 有多个B
// A.belongToMany(B,中间表) // A 属于多个B


const initRelation =  ()=>{
    // 用户（作者）和文章
    //分析 ： 一对多
    User.hasMany(Article,{
        onDelete:"CASCADE" // 关联文章 也删除
    })
    Article.belongsTo(User) // userEmail 用户的主键 ；作者

    //用户（评论人） 和 评论
    //分析： 一对多
    User.hasMany(Comment,{
        onDelete:"CASCADE" // 关联评论 也删除
    })
    Comment.belongsTo(User)

    //用户（喜欢）和 文章
    //分析 ： 一个用户喜欢多篇文章，一篇文章可以被多个用户喜欢 ；多对多
    User.belongsToMany(Article,{
       through:'favorites',
       uniqueKey:false,
       timestamps:false
    })
    Article.belongsToMany(User,{
       through:'favorites',
       uniqueKey:false,
       timestamps:false
    })

    //用户（粉丝）和 用户（作者）
    //分析 ： 用户（粉丝） 可以关注多个用户（作者），用户（作者）也可关注多个用户（粉丝）
    User.belongsToMany(User,{
        through:'Followers', //自动创建
        as : "followers", // 别名
        timestamps:false
     })


     // 文章 和 标签
     // 分析： 一个文章可以有多个标签，一个标签可以被多个文章持有
     Article.belongsToMany(Tag,{
        through:'TagList',
        uniqueKey:false,
        timestamps:false
     })
     Tag.belongsToMany(Article,{
        through:'TagList',
        uniqueKey:false,
        timestamps:false
     })

     // 文章和评论
     //分析： 一个文章有多个评论，一个评论只能属于某一个文章
     Article.hasMany(Comment,{
        onDelete:"CASCADE" 
     })
     Comment.belongsTo(Article)

}

const initDB = ()=>{
    return new Promise(async (resolve,reject)=>{
        try {
            
            // 数据库连接
            await dbConnection()


            // 初始化模型  :  模型关系
            initRelation()


            // 同步数据库 : 同步模型（建表 / 表关系）
            // await sequelize.sync()
            // await sequelize.sync({force:true}) //删除 然后重新初始化
            await sequelize.sync({alter:true}) 

            resolve()
            
        } catch (error) {
            console.log(`mysql connect fail on ${process.env.DB_PORT}`,error)
        }
    })
}

module.exports = initDB