
const HttpException = require("../exception/http.exception")
const User =  require('../model/user')


// 控制器 ： 添加关注 ： A（登录用户：关注者）关注 B（被关注者） 
const follow = async (req,res,next)=>{
    try {
        //00 验证登录 =>authMiddleware

        //01 获取被关注者 
        //获取username
        const beFollowUsername =  req.params.username
        //获取用户
        const beFollower = await User.findOne({
            where:{
                username:beFollowUsername
            }
        })
        if(!beFollower){
            throw  new HttpException(401,'被关注的用户不存在','user with this username not found')
        }

        // console.log(beFollower)

        //02 获取关注者
        // 获取登录用户email
        const folllowerEmail = req.user.email
        // 获取登录用户
        const follower  =await User.findByPk(folllowerEmail)
        if(!follower){
            throw new HttpException(401,'登录用户不存在','user  not found')
        }

        // console.log(follower)

        //03 关注的规则判断：自己不能关注自己
        if(beFollower.email===folllowerEmail){
            throw new HttpException(401,'用户不能关注自己','user  can not follow yourself')
        }

        //04 添加关注 ： 被关注者(B) 添加 关注者（A） => A（登录用户：关注者）关注 B（被关注者）
        // console.log(beFollower)
        // console.log(beFollower.__proto__)
        const result = await beFollower.addFollower(follower)
        console.log(result)

        //05 响应数据
        delete beFollower.dataValues.password
        beFollower.dataValues.following  =true
        // console.log(beFollower.dataValues)

        res
        .status(200)
        .json({
            status:1, 
            message:'关注成功',
            data:beFollower
        })
    } catch (error) {
        next(error)
    }
}

// 控制器 ： 取消关注
const unfollow = async (req,res,next)=>{
    try {
        //00 验证登录 =>authMiddleware

        //01 获取被关注者 
        //获取username
        const beFollowUsername =  req.params.username
        //获取用户
        const beFollower = await User.findOne({
            where:{
                username:beFollowUsername
            }
        })

        if(!beFollower){
            throw  new HttpException(401,'被关注的用户不存在','user with this username not found')
        }

        // console.log(beFollower)

        //02 获取关注者
        // 获取登录用户email
        const folllowerEmail = req.user.email
        // 获取登录用户
        const follower  =await User.findByPk(folllowerEmail)
        if(!follower){
            throw new HttpException(401,'登录用户不存在','user  not found')
        }

        // console.log(follower)

        //04 取消关注 ： 被关注者(B) 添加 关注者（A） => A（登录用户：关注者）关注 B（被关注者）
        // console.log(beFollower)
        console.log(beFollower.__proto__)
        const result = await beFollower.removeFollower(follower)
        // console.log(result)

        //05 响应数据
        delete beFollower.dataValues.password
        beFollower.dataValues.following  =false
        console.log(beFollower.dataValues)

        res
        .status(200)
        .json({
            status:1, 
            message:'取消关注成功',
            data:beFollower
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    follow,
    unfollow
}