import { PureComponent } from "react";
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import * as action from '../../actions/comment'
import CommentList from "./CommentList";

//Article -slug,curentUser - Comments - initComments - action(function) - thunk - action(object) - reducer(comment) - state(new) -mapState- Comments

class Comments extends PureComponent{

    handleChange = (e)=>{
        this.props.commentFieldUpdate('body',e.target.value)
    }
    deleteComment = (slug,id)=>{
        this.props.deleteComment(slug,id)
    }

    createComment = (e)=>{
        e.preventDefault()
        const slug = this.props.slug
        const body = this.props.body

        this.props.createComment(slug,body)

    }

    render(){

        const { slug,comments,currentUser,body} = this.props

        if(!currentUser){ //未登录
            return (
                <div className="col-xs-12 col-md-8 offset-md-2">
                    {/* 登录注册 */}
                    <p>
                        <Link to="/login">登录</Link>
                        &nbsp; or &nbsp;
                        <Link to="/regist">注册</Link>
                    </p>
                    {/* 评论列表 */}
                    <CommentList 
                     comments={comments}
                     currentUser = {currentUser}
                     deleteComment={this.deleteComment}
                     slug={slug}
                    />
                 </div>
            )
        }else{
            return (
                <div className="col-xs-12 col-md-8 offset-md-2">
                    {/* 登录注册 */}
                     <form className="card comment-form" onSubmit={this.createComment}>
                        <div  className="card-block">
                            <textarea 
                               className="form-control"
                               placeholder="添加评论..."
                               rows={3}
                               onChange={this.handleChange}
                               value={body}
                            />
                        </div>
                        <div className="card-footer">
                            <img 
                              className="comment-author-img"
                              src={currentUser&&currentUser.avatar||"http://localhost:8000/default.png"}
                            />
                            <button
                            className="btn btn-sm btn-primary"
                            type="submit"
                            >
                                提交
                            </button>
                        </div>
                     </form>
                      {/* 评论列表 */}
                      <CommentList 
                        comments={comments}
                        currentUser = {currentUser}
                        deleteComment={this.deleteComment}
                        slug={slug}
                        />
                </div>
            )
        }

    }

    componentDidMount(){
        console.log('componentDidMount');
        // 获取文章slug
        const {slug} = this.props

        // 获取评论的初始化数据
        this.props.initComments(slug)

    }
}

const mapState = state=>({
    ...state.comment
})

const mapDispatch =  dispatch => ({
    initComments:(slug)=>dispatch(action.initComments(slug)),
    commentFieldUpdate:(key,value)=>dispatch(action.commentFieldUpdate(key,value)),
    createComment:(slug,body)=>dispatch(action.createComment(slug,body)),
    deleteComment:(slug,id)=>dispatch(action.deleteComment(slug,id)),
})

export default connect(mapState,mapDispatch)(Comments)