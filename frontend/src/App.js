

import {lazy,Suspense,memo} from 'react';
import {Switch,Route} from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Auth from './Auth'
import {connect} from 'react-redux'

//  import Login from './pages/Login'
//  import Regist from './pages/Regist'

const Login = lazy(()=>import('./pages/Login'))
const Regist = lazy(()=>import('./pages/Regist'))
const ArticleNew = lazy(()=>import('./pages/ArticleNew'))
const ArticleEdit = lazy(()=>import('./pages/ArticleEdit'))
const Article = lazy(()=>import('./pages/Article'))
const Setting= lazy(()=>import('./pages/Setting'))
const Profile= lazy(()=>import('./pages/Profile'))


//jsx -  webpack - buddle.js 
// 代码包分割= 多个包 并行 动态加载=> react 懒加载
// 页面无关的组件 =>拆分成新的buddle=>当无关组件需要被渲染时候 才会动态加载=> 动态渲染
// 性能优化 
//1） React.lazy + import =>动态加载
//2)  purecomponent / memo 


const  App = memo((props)=>{
  return (
    <div >
      {/* 应用头部：公共组件 */}
      <Header />

      {/* 主体页面 */}
      <Suspense fallback={<p>loding...</p>} >
        <Switch >
          {/* 公开路由 */}
          <Route path='/' component={Home} exact/>
          <Route path='/login' component={Login} />
          <Route path='/regist' component={Regist} />

          {/* 守护路由 */}
          <Auth currentUser={props.currentUser}>
            <Switch>
              <Route path='/article/new' component={ArticleNew} />
              <Route path='/article/edit/:slug' component={ArticleEdit} />
              <Route path='/article/:slug' component={Article} />
              <Route path='/setting' component={Setting} />
              <Route path='/profile/:username' component={Profile} />
            </Switch>
          </Auth>
        </Switch>
      </Suspense>
    </div>
  );
})

const mapState = state =>({
  currentUser:state.user.login.currentUser
})

export default connect(mapState,null)(App);
