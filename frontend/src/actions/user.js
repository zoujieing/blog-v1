
import * as constant from '../constant'
import request from '../request'
import {push} from 'connected-react-router'

export const unload = ()=>{
    return {type:constant.USER_UNLOAD}    
}

//注册：清除
export const registUnload = ()=>{
    return {type:constant.USER_REGIST_UNLOAD}    
}
// 注册 ： 同步
export const registFiledUpdate = (key,value)=>{
    return {type:constant.USER_REGIST_FIELD,key,value}  
}
// 注册 ： 提交 
export const registSubmit = (user)=>{
    // const {email,username,password} = user
    // console.log('action---',email,username,password);
    // thunk ： 核心能就是能在action 执行异步函数
    //处理异常操作：网络请求-注册接口  借助thunk
    return  async (dispatch,getState)=>{
        console.log('thunk--执行异步任务--网络请求');
        try {
           const result =  await request.user.regist(user)
           console.log('result',result);
           if(result.status===1){
                dispatch(push('/login'))
           }else{
                dispatch({type:constant.USER_REGIST_RESULT,result})
           }
        } catch (error) {
            console.log('error',error);
            dispatch({type:constant.USER_REGIST_RESULT,result:{status:0,message:error.message,errors:error.errors}})

        }
    }
}

//登录：清除
export const loginUnload = ()=>{
    return {type:constant.USER_LOGIN_UNLOAD}    
}
// 登录 ： 同步
export const loginFiledUpdate = (key,value)=>{
    return {type:constant.USER_LOGIN_FIELD,key,value}  
}
// 登录 ： 提交
export const loginSubmit = (email,password)=>{
    return  async (dispatch,getState)=>{
        console.log('thunk--login--执行异步任务--网络请求');
        try {
           const result =  await request.user.login(email,password)
           console.log('result',result);
           dispatch({type:constant.USER_LOGIN_RESULT,result})
        } catch (error) {
            console.log('error',error);
            dispatch({type:constant.USER_REGIST_RESULT,result:{status:0,message:error.message,errors:error.errors}})

        }
    }
}