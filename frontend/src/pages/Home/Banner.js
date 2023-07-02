import { memo } from "react"


const Banner =  (props)=>{
    return (
        <div className="banner">
            <div className="container">
                <h1>blog - v1</h1>
                <p>
                    js - react - node - mysql 全栈开发
                </p>
            </div>
        </div>
    )
}

export default memo(Banner)