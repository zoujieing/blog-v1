import * as constant from '../constant'
import request from '../request'
import {push} from 'connected-react-router'

//设置：清除
export const settingUnload = ()=>{
    return {type:constant.SETTING_UNLOAD}    
}

// 设置 ： 同步
export const settingFiledUpdate = (key,value)=>{
    return {type:constant.SETTING_FIELD,key,value}  
}

// 设置 ： 提交 
export const settingSubmit = (user)=>{
    return  async (dispatch,getState)=>{
        try {
           const result =  await request.user.update(user)
           console.log('result',result);
           dispatch({type:constant.SETTING_RESULT,result})
        } catch (error) {
            console.log('error',error);
            dispatch({type:constant.SETTING_RESULT,result:{status:0,message:error.message,errors:error.errors}})

        }
    }
}

// 设置 ：退出
export const settingLogout = ()=>{
    return {type:constant.USER_LOGOUT}
}

