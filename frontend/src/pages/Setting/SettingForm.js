import {PureComponent} from 'react';
import * as action from '../../actions/setting'
import {connect} from 'react-redux'


class SettingForm extends PureComponent{

    
    changeUserName = (e) => {
        this.props.onUsernameChange('username', e.target.value )
    }
    changePassword = e => {
        this.props.onPasswordChange('password', e.target.value )
    }
    changeAvatar = e => {
        this.props.onPasswordChange('avatar', e.target.value )
    }
    changeBio = e => {
        this.props.onPasswordChange('bio', e.target.value )
    }

    onSubmit = (ev)=>{
        ev.preventDefault()
        const {username,password,avatar,bio} = this.props
        // 提交数据
        this.props.onSubmitUser({username,password,avatar,bio})
    }

    render() {
        const {email,username,password,avatar,bio} = this.props
        return (
                <form onSubmit={this.onSubmit}>
                    <fieldset className='form-group'>
                        <input
                            className='form-control form-control-lg'
                            type="text"
                            placeholder='用户名称'
                            value={username||""}
                            onChange={this.changeUserName}
                        />
                    </fieldset>
                   
                    <fieldset className='form-group'>
                        <input
                            className='form-control form-control-lg'
                            type="text"
                            placeholder='用户头像'
                            value={avatar||""}
                            onChange={this.changeAvatar}
                        />
                    </fieldset>
                    <fieldset className='form-group'>
                        <textarea
                            className='form-control form-control-lg'
                            rows='8'
                            placeholder='用户简介'
                            value={bio||""}
                            onChange={this.changeBio}
                        />
                    </fieldset>
                    <fieldset className='form-group'>
                        <input
                            className='form-control form-control-lg'
                            type="password"
                            placeholder='用户密码'
                            value={password||""}
                            onChange={this.changePassword}
                        />
                    </fieldset>
                    <button
                        className='btn btn-lg btn-primary pull-xs-right'
                        type='submit'
                    >
                        更新
                    </button>
                </form>
             
        )
    }

}

const mapState = state=>{
    console.log('mapState',state.user.setting);
    return {
        ...state.user.setting
    }
}


const mapDispatch = dispatch =>({ 
    onUsernameChange:(key,value)=>{
        const actionResult =  action.settingFiledUpdate(key,value) //action 生产函数=>{type:constant.SETTING_FIELD,key,value} 
        return dispatch(actionResult) // dispatch - action -thunk -  store - reducer - state(new) - mapState -render
    },
    onAvatarChange:(key,value)=>dispatch(action.settingFiledUpdate(key,value)),
    onBioChange:(key,value)=>dispatch(action.settingFiledUpdate(key,value)),
    onPasswordChange:(key,value)=>dispatch(action.settingFiledUpdate(key,value)),

    onSubmitUser:(user)=>dispatch(action.settingSubmit(user)),
    onUnload:()=>dispatch(action.settingUnload())  
})

export default connect(mapState,mapDispatch)(SettingForm)  

