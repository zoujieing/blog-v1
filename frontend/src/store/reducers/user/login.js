import * as constant from '../../../constant'
import {getData, saveData,deleteData} from '../../../utils/localstorage'

const initUser = ()=>{
    //从本地获取用户信息
    const currentUser = getData('currentUser')
    if(currentUser){
        return currentUser
    }
    return null
}

const initState ={
    email:'',
    username:'',
    password:'',
    errors:null,
    currentUser:initUser(),
    token:null
}

//login - action(function) - thunk - action(object) - store - reducer(user) - state(new)-login

const userReducer = (state=initState,action)=>{
    switch (action.type) {
        case constant.USER_LOGIN_UNLOAD:
            return {...initState,currentUser:initUser()}
        case constant.USER_LOGIN_FIELD:
            const key = action.key  
            const value = action.value
            return {...state,[key]: value} 
        case constant.USER_LOGIN_RESULT: // 登录结果 
           const {status,message,data} =  action.result
           if(status===1){
              let  currentUser = null
              let  token = null
              currentUser = data
              token = data.token
              //用户信息存储 : 登录状态  持久化
              saveData("currentUser",currentUser)
              saveData("token",token)

              //token存储 ： 接口验证
              //返回新的state
              return {...state,...currentUser,currentUser,token,redirect:'/'} 
           }else{
              return {...state,errors:{message:action.result.message}}
           }
        case constant.USER_LOGOUT:
            state.currentUser  = null
            return {...state}
        default:
            return state
    }
}

export default userReducer