
import {LIMIT} from '../../constant'
import {memo} from 'react'

const Pagination = props =>{
    const {currentPage,count,onPageClick} = props
    if(count<=LIMIT){
        return null  //不显示分页
    }

    // 需要做分页

    // 封装页码数据
    const pageNum = []
    for (let page = 1; page <= Math.ceil(count/LIMIT); page++) {
        pageNum.push(page)  //[1,2,3]
    }

    //显示页码
    return (
        <nav>
            <ul>
                {
                  pageNum.map(pageNum=>{
                    const isCurentPage = currentPage ===pageNum
                    return (
                        <li key={pageNum} className={isCurentPage?"page-item active": "page-item"}>
                            <button
                              type='button'
                              className="page-link"
                              onClick={
                                ()=>{
                                    console.log(pageNum)
                                    onPageClick(pageNum)
                                }
                              }
                            >
                                {pageNum}
                            </button>
                        </li>
                    )
                  })  
                }
            </ul>
        </nav>
    )



}

export default memo(Pagination)