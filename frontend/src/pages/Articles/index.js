import Item from './Item'
import Pagination from './Pagination'

const Articles = props =>{
    
    const {isShowPage,articles,count,currentPage,onPageClick,} = props

    if(!articles){
        return <div className='article-preview'>加载中...</div>
    }

    if(articles&&articles.length===0){
        return <div className='article-preview'>这里没有文章</div>
    }

    return (
        <div>
            {/* 文章数据 */}
            {
                articles.map((article)=>{
                     return <Item article={article} key={article.slug}/>
                 })
             }
    
             {/* 分页数据 */}
             {
                isShowPage? <Pagination 
                                count ={count}
                                currentPage={currentPage}
                                onPageClick={onPageClick}
                            /> :null
             }
            
        </div>
    )
}

export default Articles