import * as constant from '../../../constant'
import {deleteData, getData, saveData} from '../../../utils/localstorage'

const initUser = ()=>{
    //从本地获取用户信息
    const currentUser = getData('currentUser')
    if(currentUser){
        return currentUser
    }
    return null
}
const initToken = ()=>{
    const token = getData('token')
    if(token){
        return token
    }
    return null
}

const initState ={
    ...initUser(),
    errors:null,
    currentUser:initUser(),
    token:initToken()
}


const settingReducer = (state=initState,action)=>{
    switch (action.type) {
        case constant.SETTING_UNLOAD:
            return {...initState,currentUser:initUser(),token:initUser().token}
        case constant.SETTING_FIELD:
            const key = action.key  
            const value = action.value
            return {...state,[key]: value} 
        case constant.SETTING_RESULT: // 登录结果 
           const {status,message,data} =  action.result

           if(status===1){
              // 更新后 用户信息和token 同步到本地
              const currentUser = action.result.data
              const token = action.result.data.token
              saveData("currentUser",currentUser)
              saveData("token",token)

              //返回新的state ：最新的用户信息和token 同步到reducer(内存)
              return {...state,currentUser,token} 
           }else{
              return {...state,errors:{message:action.result.message}}
           }
        case constant.USER_LOGOUT:
            //清除：登录状态的标记currentUser
            //内存清除 =>reducer 清除
            state  = {}
            //本地清除 =>localstorage 清除
            deleteData('currentUser')
            deleteData('token')

            return {...state,redirect:'/'}
        default:
            return {  
                ...initUser(),
                errors:null,
                currentUser:initUser(),
                token:initToken()
            }
    }
}

export default settingReducer