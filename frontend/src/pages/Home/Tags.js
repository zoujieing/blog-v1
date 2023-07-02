import {memo} from 'react'
import {connect} from 'react-redux'
import {syncTab,syncTag,syncPage,getTabArticles} from '../../actions/home'

const Tags =memo((props)=>{
    const {tags} = props

    if(tags){
        return (
            <div className='tag-list'>
                {
                    tags.map(tag=>{
                        return (
                            <button 
                            type="button"
                            className='tag-default tag-pill'
                            key={tag}
                            onClick={()=>{
                                props.syncTag(tag)
                                props.syncPage(1)
                                props.syncTab(null)
                                props.onTabClick()
                            }}
                            >
                                {tag}
                            </button>
                        )
                    })
                }

            </div>
        )
    }else{
        return <div>加载标签...</div>
    }
})


const mapDispatch = dispatch => ({
    syncTab:(tab)=>dispatch(syncTab(tab)),
    syncTag: (tag) => dispatch(syncTag(tag)), //同步tag
    syncPage: (page) => dispatch(syncPage(page)), //同步page
    onTabClick: () => dispatch(getTabArticles())  // 获取tab文章列表
})




export default connect(null,mapDispatch)(Tags)