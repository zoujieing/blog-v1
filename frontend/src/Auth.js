import {Redirect} from 'react-router-dom'

const Auth  = props=>{
    const {currentUser,children} = props  //children : 当前组件的子组件

    if(currentUser){ //已登录=>已授权=>访问子组件
        return children  //显示子组件
    }

    return <Redirect to="/login" />
}

export default Auth