import * as constant from '../../constant'
import {getData, saveData,deleteData} from '../../utils/localstorage'


const initState ={
    username:"",
    bio:"",
    avatar:"",
    following:false,
    followers:[],
    errors:null
}



const profileReducer = (state=initState,action)=>{
    switch (action.type) {
        case constant.PROFILE_GET_RESULT: 
           const {status,message,data} =  action.result
           if(status===1){
            //    let profile   = data
              return {...state,...data} 
           }else{
              return {...state,errors:{message:action.result.message}}
           }
        case constant.PROFILE_FOLLOW_RESULT: 
           if(action.result.status===1){
              return {...state,...action.result.data} 
           }else{
              return {...state,errors:{message:action.result.message}}
           }
        default:
            return state
    }
}

export default profileReducer