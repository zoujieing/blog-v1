import { PureComponent } from 'react';
import Errors from '../../components/Errors'
import {Link} from 'react-router-dom'

const errors = null
// const errors = {message:"注册邮箱错误"}

class Regist extends PureComponent {
    state = {
        email: "",
        username: "",
        password: ""
    }


    changeEmail = (e) => {
        this.setState({ email: e.target.value })
    }
    changeUserName = (e) => {
        this.setState({ username: e.target.value })
    }
    changePassword = e => {
        this.setState({ password: e.target.value })
    }

    onSubmit = (ev)=>{
        ev.preventDefault()
        console.log(this.state);
        // 提交数据
    }

    render() {
        return (
            <div className='container page'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3 col-xs-12'>
                        <h1>注册</h1>
                        <p  className='text-xs-center'>
                            <Link to="/login">
                            有账号直接登录？
                            </Link>
                        </p>

                        <Errors errors={errors}/>
                        <form onSubmit={this.onSubmit}>
                            <fieldset className='form-group'>
                                <input
                                    className='form-control form-control-lg'
                                    type="text"
                                    placeholder='用户邮箱'
                                    value={this.state.email}
                                    onChange={this.changeEmail}
                                />
                            </fieldset>
                            <fieldset className='form-group'>
                                <input
                                    className='form-control form-control-lg'
                                    type="text"
                                    placeholder='用户名称'
                                    value={this.state.username}
                                    onChange={this.changeUserName}
                                />
                            </fieldset>
                            <fieldset className='form-group'>
                                <input
                                    className='form-control form-control-lg'
                                    type="password"
                                    placeholder='用户密码'
                                    value={this.state.password}
                                    onChange={this.changePassword}
                                />
                            </fieldset>
                            <button
                                className='btn btn-lg btn-primary pull-xs-right'
                                type='submit'
                            >
                                注册
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Regist