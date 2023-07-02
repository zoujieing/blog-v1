import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";

import login from '../reducers/user/login'
import regist from '../reducers/user/regist'
import setting from '../reducers/user/setting'
import profile from '../reducers/profile'
import articlesReducer from '../reducers/articles'
import article from '../reducers/article'
import comment from '../reducers/comment'
import home from '../reducers/home'

//reducer 模块化
const createRootReducer = (history)=>combineReducers({
    user:combineReducers({
        login,
        regist,
        setting
    }),
    profile,
    articlesReducer,
    article,
    comment,
    home,
    router:connectRouter(history)
})

export default createRootReducer