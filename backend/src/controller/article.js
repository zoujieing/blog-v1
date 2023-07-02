const sequelize = require("../db/sequelize")
const HttpException = require("../exception/http.exception")
const Article = require("../model/article")
const Tag = require("../model/tag")
const User = require("../model/user")
const getSlug  =  require('../utils/slug')


const handleArticle  = (article,author,favoriteCount,favorited)=>{

    // 处理标签
    const tags = []
    for (const tag of article.dataValues.tags) {
        tags.push(tag.name)
    }
    article.dataValues.tags = tags

    //处理作者
    delete author.dataValues.password
    article.dataValues.author = author
    delete article.dataValues.userEmail


    //处理喜欢信息
    article.dataValues.favoriteCount = favoriteCount || 0
    article.dataValues.favorited = favorited || false


    return article.dataValues

}

const handleArticle2  = (article,favoriteCount,favorited)=>{

    // 处理标签
    const tags = []
    for (const tag of article.dataValues.tags) {
        tags.push(tag.name)
    }
    article.dataValues.tags = tags

    //处理作者
    let author = article.dataValues.user
    delete author.dataValues.password //删除作者信息密码
    delete article.dataValues.userEmail //删除文章userEmail
    delete article.dataValues.user //删除文章user
    article.dataValues.author = author


    //处理喜欢信息
    article.dataValues.favoriteCount = favoriteCount || 0
    article.dataValues.favorited = favorited || false


    return article.dataValues
}

const getFavorite = async (article,currentUer)=>{
    //数量：喜欢文章的人的数量
   const favoriteCount = await article.countUsers() 
   console.log('favoriteCount',favoriteCount);

   //是否喜欢：当前登录用户是否喜欢
   const favoriteUser  =await article.getUsers() // 喜欢文章的人
//    console.log('favoriteUser',favoriteUser);

   let allFavoriteEmails = []
   for (const user of favoriteUser) {
    allFavoriteEmails.push(user.email)
   }

   let favoried = false
   if(currentUer){
      let loginEmail = currentUer.email
      favoried = allFavoriteEmails.includes(loginEmail)
   }


   return {favoriteCount,favoried}

}



const createArticle  =async (req,res,next)=>{
    try {
        
        // 01 获取数据
        const {title,description,body,tags} = req.body.article
        // 02 TODO=>验证数据
        if(!title){
            throw new HttpException(401,'文章标题不存在','title not found')
        }

        // 03 获取作者email : 当前登录用户 创建文章=>登录用户就是作者
        const {email} = req.user
        // 04 验证作者信息
        const author = await User.findByPk(email)
        if(!author){
            throw new HttpException(401,'作者账号不存在','auhtor not found')
        }
        // 05 生成别名slug
        const slug =  getSlug()

        // console.log(slug);
        // console.log(author);
        // console.log(title,description,body);

        // 06 创建文章
       let article =  await Article.create({
            slug,
            title,
            description,
            body, // markdown  # title 
            userEmail : email
        })
        // console.log(article);
        // console.log(article.__proto__)

        // 07 标签存储 : ['html','css'] 存储标签 和 文章标签关系
        if(tags.length>0){
            for (const t of tags) {
                let exitTag = await Tag.findByPk(t)
                
                if(!exitTag){ //标签不存在
                    //存储标签
                    let newTag = await Tag.create({name:t})
                    
                    //存储文章和标签关系
                    await article.addTag(newTag)

                }else{ // 标签存在
                    //存储文章和标签关系
                    await article.addTag(exitTag)
                }
                
            }
        }

        // 08 获取文章 ： 文章信息 + 作者信息 + 标签信息
        article =  await Article.findByPk(slug,{include:Tag})
        console.log(article)
        
        // 09 响应数据处理 ： 格式处理
        // userEmail: 'lisi@qq.com',
        // tags: [ [tag], [tag] ]

        article = handleArticle(article,author)

        // 10 响应数据
        res
        .status(200)
        .json({
            status:1, 
            message:'创建文章成功',
            data:article
        })

    } catch (error) {
        next(error)
    }
}



//获取单个文章
const getArticle = async (req,res,next)=>{
    console.log('---------------getArticle---------');
    try {

        const slug  =req.params.slug
        // 文章 + 标签
        let article  = await Article.findByPk(slug,{include:Tag})
        // console.log(article);

        
        // 获取作者
        // 方式1
        // let userEmail  = article.userEmail
        // let author   = await Author.findByPk(userEmail)

        //方式2
        let author  = await article.getUser()
        // console.log(author);

        //获取喜欢信息
        const {favoriteCount,favoried} = await getFavorite(article,req.user)
        // console.log(favoriteCount,favoried);


        // 文章响应数据处理
        article = handleArticle(article,author,favoriteCount,favoried)

        res
        .status(200)
        .json({
            status:1, 
            message:'获取文章成功',
            data:article
        })

    } catch (error) {
        next()
    }
}

// 更新文章
const updateArticle = async (req,res,next)=>{
    try {
        // 获取更新文章slug 
        const slug  = req.params.slug

        // 获取更新文章数据
        const data =  req.body.article
        const title  = data.title
        const description  = data.description
        const body  = data.body
        const tags  = data.tags

        //获取更新文章 ：验证被更新文章是否存在
        let article = await Article.findByPk(slug)
        if(!article){
            throw new HttpException(401,'更新文章不存在','update article  not found')
        }

        //更新业务逻辑验证：登录用户只能更新自己的文章=>登录email===文章作者的email
        let authorEmail = article.userEmail
        let loginEmail = req.user.email
        if(authorEmail!==loginEmail){
            throw new HttpException(403,'只有作者账号才能有更新权限','only author have permission to update article')
        }
        //更新文章
        const updateArticle = await article.update({title,description,body})
        // console.log(updateArticle);

        //更新标签
        //1)删除文章和标签的关系
        // console.log(article.__proto__);
        const oldTags = []
        const getTags  =await article.getTags()
        // console.log(getTags);
        for (const t of getTags) {
            oldTags.push(t.name)
        }
        // console.log(oldTags);
        await article.removeTags(oldTags)

        // 2) 创建标签和 文章与标签关系
        if(tags.length>0){
            for (const t of tags) {
                let exitTag = await Tag.findByPk(t)
                
                if(!exitTag){ //标签不存在
                    //存储标签
                    let newTag = await Tag.create({name:t})
                    
                    //存储文章和标签关系
                    await article.addTag(newTag)

                }else{ // 标签存在
                    //存储文章和标签关系
                    await article.addTag(exitTag)
                }
                
            }
        }

        //获取最新文章：更新后的文章 包含 Tag
        article =  await Article.findByPk(slug,{include:Tag})
       
        //获取作者信息
        // let author = await User.findByPk(loginEmail)
        let author  = await article.getUser()

        //获取喜欢信息
        const {favoriteCount,favoried} = await getFavorite(article,req.user)

        //响应数据处理
        article = handleArticle(article,author,favoriteCount,favoried)

        //响应数据
        res
        .status(200)
        .json({
            status:1,
            message:"更新文章成功",
            data:article
        })
        
    } catch (error) {
        next(error)
    }
}

//删除文章
const deleteArticle = async (req,res,next)=>{
    try {
        // 获取更新文章slug 
        const slug  = req.params.slug


        //获取更新文章 ：验证被更新文章是否存在
        let article = await Article.findByPk(slug)
        if(!article){
            throw new HttpException(401,'删除文章不存在','delete article  not found')
        }

        //更新业务逻辑验证：登录用户只能更新自己的文章=>登录email===文章作者的email
        let authorEmail = article.userEmail
        let loginEmail = req.user.email
        if(authorEmail!==loginEmail){
            throw new HttpException(403,'只有作者账号才能有更新权限','only author have permission to update article')
        }

        //删除文章
        // 适合批量删除
        // const deleteArticle = await Article.destroy({
        //     where:{slug}
        // })

        // 适合删除单个 ： 自己
        const deleteArticle = await article.destroy()

        console.log(deleteArticle);

        //响应数据
        res
        .status(200)
        .json({
            status:1,
            message:"删除文章成功",
            data:deleteArticle
        })
        
    } catch (error) {
        next(error)
    }
}


// 获取文章： 关注作者的文章
const getFollowArticles = async (req,res,next)=>{
    try {
        // 粉丝（登录用户）邮箱
        const  fansEmail = req.user.email
        const fansUser   = await User.findByPk(fansEmail)
        
        // 获取当前粉丝关注的所有的作者
        const query  = `SELECT userEmail FROM followers WHERE followerEmail = "${fansEmail}" `
        const  authors= await sequelize.query(query)
        // console.log(authors[0]); // [[{},{}],[]]
        
        // 没有关注的作者
        if(authors[0].length===0){
            res
            .status(200)
            .json({
                status:1,
                message:"获取关注作者的文章成功",
                data:[]
            })
        }

        //所有关注者的email
        let authorEmails = []
        for (const item of authors[0]) {
            authorEmails.push(item.userEmail)
        }
        // console.log(authorEmails); // ['email1','email2']


        // 批量查询 ：所有关注的作者的文章 
        // count : 文章总数=>分页
        // rows  ： 文章数据数据
        const {count,rows} = await Article.findAndCountAll({
            distinct:true, //去重
            where:{
                userEmail:authorEmails // 可以等于一个数组['email']
            },
            include:[Tag,User]
        })

        // console.log(count,rows);

        // 处理响应数据
        const articles  = []
        for (const article of rows) {
            // console.log(article);
            // console.log(article.tags);
            // console.log(article.user);
           
            // 处理每一篇文章喜欢信息
            const {favoriteCount,favoried} = await getFavorite(article,req.user)
            
            // 处理每一篇文章：标签 作者 喜欢 重新组装
            let handleArticle  = handleArticle2(article,favoriteCount,favoried)

            articles.push(handleArticle)
        }

        // console.log(articles);

      //响应数据
        res
        .status(200)
        .json({
            status:1,
            message:"获取关注作者的文章成功",
            data:{count,articles}
        })
    } catch (error) {
        next(error)
    }
}

// 全局文章： 条件 author(自己的文章)/ favorite(用户喜欢的文章) / tag / limit / offset ..

const getArticles = async (req,res,next)=>{
    try {

        //(可选) ： 获取登录用户email  加授权中间件 才能使用

        //获取参数：query =>author favorite tag  limit offset
        const {author,tag,favorite,limit=10,offset=0} = req.query
        console.log(limit,offset);

        let result ;

        //分场景查询
        //标签过滤文章 :tag
        if(tag&&!author&&!favorite){
            console.log('tag 过滤----',tag);
            result =  await Article.findAndCountAll({ //批量查询
                distinct:true,
                include:[
                    {model:Tag,attributes:['name'],where:{name:tag}},
                    {model:User,attributes:['email','username','avatar','bio']}
                ],
                limit:parseInt(limit),
                offset:parseInt(offset),
            })
        }
        //作者自己的文章 : author
        if(!tag&&author&&!favorite){
            result =  await Article.findAndCountAll({ //批量查询
                distinct:true,
                include:[
                    {model:Tag,attributes:['name']},
                    {model:User,attributes:['email','username','avatar','bio'],where:{username:author}}
                ],
                limit:parseInt(limit),
                offset:parseInt(offset),
            })
        }

        //作者文章和标签过滤 ： tag &&author
        if(tag&&author&&!favorite){
            
            result =  await Article.findAndCountAll({ //批量查询
                distinct:true,
                include:[
                    {model:Tag,attributes:['name'],where:{name:tag}},
                    {model:User,attributes:['email','username','avatar','bio'],where:{username:author}}
                ],
                limit:parseInt(limit),
                offset:parseInt(offset),
            })
        }

        //作者喜欢的文章 ： favorite = 作者名
        if(!tag&&!author&&favorite){
           const authorName = favorite
           const author = await User.findOne({
              where:{username:authorName}
           })

           const authorEmail = author.email

           const query = `select articleSlug from favorites where userEmail = "${authorEmail}"`
           const queryResult  =  await sequelize.query(query)
        //    console.log(queryResult);
           if(queryResult[0].length ===0){
                return res
                        .status(200)
                        .json({
                            status:1,
                            message:"没有喜欢的文章",
                            data:{count:0,articles:[]}
                        })
           }

           let articleSlugs  =[] 
           //[{articleSlug:xx1}{articleSlug:xx2}]
           for (const item of queryResult[0]) { 
              articleSlugs.push(item.articleSlug)
           }

        //    console.log(articleSlugs); //['dsdfdsf','sssfddf']

         result =  await Article.findAndCountAll({
            distinct:true,
            where:{
                slug:articleSlugs
            },
            include:[Tag,User]
          })

        }

        // 其他情况 ：全局查询 没有具体条件 只做分页
        if(!tag&&!author&&!favorite){
            result =  await Article.findAndCountAll({ //批量查询
                distinct:true,
                include:[
                    {model:Tag,attributes:['name']},
                    {model:User,attributes:['email','username','avatar','bio']}
                ],
                limit:parseInt(limit),
                offset:parseInt(offset),
            })
        }
        // console.log(result);
        const {count,rows} = result

        // 登录传token 不登录 不传token
        // const authHeader = req.headers.authorization
        // const authHeaderArray = authHeader.split(' ')
        // const token = authHeaderArray[1] //如果没有 ： undefined  没登陆
        // let userinfo  = null
        // if(token){
        //     userinfo = await decode(token)
        // }



        // console.log(count,rows);

        const articles = []
        // 响应数据处理 ：for 循环 =>处理每一篇文章
        for (const article of rows) {

             // 处理每一篇文章喜欢信息
             const {favoriteCount,favoried} = await getFavorite(article,req.user)
            
             // 处理每一篇文章：标签 作者 喜欢 重新组装
             let handleArticle  = handleArticle2(article,favoriteCount,favoried)
 
             articles.push(handleArticle)
            
        }

        // 响应数据
        res
        .status(200)
        .json({
            status:1,
            message:"获取全局文章成功",
            data:{count,articles}
        })
    } catch (error) {
        next(error)
    }
}





module.exports = {
    getFavorite,
    handleArticle,
    handleArticle2,
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    getFollowArticles,
    getArticles
}