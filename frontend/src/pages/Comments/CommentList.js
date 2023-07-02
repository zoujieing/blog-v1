import { memo } from "react"
import CommentItem from "./CommentItem"


const CommentList = (props)=>{
    const {comments,currentUser,deleteComment ,slug} = props

    if(comments.length===0){ 
        return <div>当前没有评论呦!</div>
    }else{
        return (
            <div>
                {
                    comments.map(comment=>{

                        return <CommentItem 
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            deleteComment={deleteComment}
                            slug = {slug}
                        />
                    })
                }
            </div>
        )

    }

}

export default memo(CommentList)