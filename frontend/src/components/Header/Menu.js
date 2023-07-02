
import {memo} from 'react';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'

const Menu = memo((props)=>{
    const {currentUser} = props

    // console.log('currentUser--menu',currentUser);
    
    if(currentUser){ //登录
        return (
          console.log(currentUser.avatar),
            <ul  className="nav navbar-nav pull-xs-right">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                     主页
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/article/new" className="nav-link">
                    写作
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/setting" className="nav-link">
                     设置
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={`/profile/${currentUser.username}`}  className="nav-link">
                        <img src={currentUser.avatar || "https://yudafeng.github.io/static/default.png"} className="user-pic"  alt=""/>
                    </Link>
                </li>
            </ul>
        )
    }else{ // 未登录
        return (
            <ul  className="nav navbar-nav pull-xs-right">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                     主页
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                     登录
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/regist" className="nav-link">
                     注册
                    </Link>
                </li>
            </ul>
        )
    }

})

const mapState = state=>({
    currentUser:state.user.login.currentUser
})


export default connect(mapState,null)(Menu)