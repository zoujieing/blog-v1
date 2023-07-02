
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as action from '../../actions/article'

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const Item = (props) => {
  const { article} = props
  return (
    <div className="article-preview" key={article.slug}>
      {/* 基础信息 ：文章作者相关*/}
      <div className='article-meta'>
        <Link to={`/profile/${article.author.username}`}>
          <img src={article.author.avatar || "http://localhost:8000/default.png"} alt={article.author.username} />
        </Link>
        <div>
          <Link to={`/profile/${article.author.username}`}>
            {article.author.username}
          </Link>
          {"  "}
          <span>
            {new Date(article.createAt).toLocaleDateString()}
          </span>
        </div>
        <div className="pull-xs-right">
          <button
            className={article.favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS}
            onClick={() => {
              if (article.favorited) {
                props.unfavoriteArticle(article.slug)
              } else {
                props.favoriteArticle(article.slug)
              }
            }}
          >
            <i className="fa fa-heart-o"></i>{article.favoriteCount}
          </button>
        </div>
      </div>
      {/* 文章信息 */}
      <Link to={`/article/${article.slug}`} className="preview-link">
        <h5>{article.title}</h5>
        <p>{article.description}</p>
        <span>阅读更多...</span>
        <ul>
          {
            article.tags.map(tag => {
              return <li className="tag-default tag-pill tag-outline" key={tag}>{tag}</li>
            })
          }
        </ul>
      </Link>
    </div>
  )
}
const mapDispatch = dispatch => ({
  favoriteArticle: (slug) => dispatch(action.favoriteArticle(slug)),
  unfavoriteArticle: (slug) => dispatch(action.unfavoriteArticle(slug)),
})
export default connect(null, mapDispatch)(Item) 