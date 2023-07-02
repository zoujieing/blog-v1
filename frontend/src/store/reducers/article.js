import * as constant from '../../constant'



const initState = {
   title: "",
   description: "",
   body: "",
   tags: [],// []=>['ss']
   tag: "",
   errors: null
}



const articleReducer = (state = initState, action) => {
   switch (action.type) {
      case constant.ARTICLE_UNLOAD:
         return { ...initState}
      case constant.ARTICLE_CREATE_FIELD:
         const key = action.key
         const value = action.value
         //   console.log('reducer--',key,value);
         return { ...state, [key]: value }
      case constant.ARTICLE_ADD_TAG:
         const tags = state.tags.concat([state.tag]) //和新的标签组合成新的数组
         return { ...state, tags, tag: '' }
      case constant.ARTICLE_REMOVE_TAG:
         const removeTag = action.tag
         const filterTags = state.tags.filter(tag => {  //过滤到删除标签 返回新的数组
            return tag !== removeTag
         })
         return { ...state, tags: filterTags }
      case constant.ARTICLE_CREATE_RESULT:
         return { ...state, errors:{message:action.result.message}} //处理创建文章错误
      case constant.ARTICLE_UPDATE_RESULT:
         return { ...state, errors:{message:action.result.message}} //处理更新章错误
      case constant.ARTICLE_DELETE_RESULT:
         return { ...state, errors:{message:action.result.message}} //处理删除章错误
      case constant.ARTICLE_GET_RESULT:
         if(action.result.status===1){
            return {...state,...action.result.data} 
         }else{
            return {...state,errors:{message:action.result.message}}
         }
      case constant.ARTICLE_FAVORITE_RESULT: // 喜欢和取消喜欢文章 结果
         if(action.result.status===1){
            return {...state,...action.result.data} 
         }else{
            return {...state,errors:{message:action.result.message}}
         }
      default:
         return state
   }
}

export default articleReducer