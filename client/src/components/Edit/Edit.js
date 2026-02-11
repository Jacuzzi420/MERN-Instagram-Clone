import './Edit.scss'
import { useState, useRef, useContext } from 'react'
import Cross from './cross-icon.png'
import User from './user-icon.png'
import { LogoutContext } from '../App/App'
import { AxiosContext, UserContext } from '../Main/Main'

export default function Edit({ setIsEdit }) {
    const [ message, setMessage ] = useState('')
    const [ image, setImage ] = useState('')
    const [ login, setLogin ] = useState('')
    const [ fullname, setFullname ] = useState('')
    const [ password, setPassword ] = useState('')
    const setIsLogged = useContext(LogoutContext)
    const axiosJWT = useContext(AxiosContext)
    const userObject = useContext(UserContext)
    const uploading = useRef(false)
    const fileInput = useRef(0)
    const reader = new FileReader()

    function handleClick({target}){
        if(target.className === 'edit-panel' || target.className === 'edit-panel-exit' || target.className === 'edit-panel-exit-image'){
            setIsEdit(false)
        }
    }

    function handleAvatar(e){
        e.preventDefault()
        fileInput.current.click()
    }

    function handleChange(e){
        e.preventDefault()
        reader.readAsDataURL(fileInput.current.files[0])
        reader.onload = () => {
            setImage(reader.result)
        }
    }

    async function handleSubmit(e){
        try{
            e.preventDefault()
            if(!uploading.current && (image || fullname || login || password) && login.length <= 20 && (password.length === 0 || password.length > 5)){
                uploading.current = true
                const formData = new FormData()
                formData.append('avatar', fileInput.current.files[0])
                formData.append('username', login)
                formData.append('fullname', fullname)
                formData.append('password', password)
                await axiosJWT.put('/user/changeUser', formData)
                setMessage('Success')
                setTimeout(() => {
                    localStorage.clear()
                    setIsLogged('unlogged')
                }, 500)
            }
        }
        catch(error){
            if(error.request.response !== 'Forbidden'){
                uploading.current = false
                setMessage(error.request.response)
                return
            }
            localStorage.clear()
            setIsLogged('unlogged')
        }
    }

    return (
        <div className='edit-panel' onClick={handleClick}>
            <button className='edit-panel-exit'>
                <img className='edit-panel-exit-image' src={Cross} alt='Exit'/>
            </button>
            <div className='edit-panel-window'>
                <div className='edit-panel-window-heading'>
                    Edit your account
                </div>
                <div className='edit-panel-window-main'>
                    <form className='edit-panel-window-main-form' onSubmit={handleSubmit}>
                        <div className='edit-panel-window-main-form-image'>
                            <img src={image ? image : userObject.avatarName ? userObject.avatarName : User} alt=''/>
                            <button onClick={handleAvatar}> Change Avatar </button>
                            <input className='edit-panel-window-main-form-image-input' type='file' accept='image/jpeg, image/png' ref={fileInput} onChange={handleChange}/>
                        </div>
                        <input type='text' placeholder={userObject.login} value={login} onChange={(e) => setLogin(e.target.value)}/>
                        <input type='text' placeholder={userObject.fullname} value={fullname} onChange={(e) => setFullname(e.target.value)}/>
                        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <button className={(image || fullname || login || password) && login.length <= 20 && (password.length === 0 || password.length > 5) ? 'edit-panel-window-main-form-button active' : 'edit-panel-window-main-form-button'}> Edit </button>
                        {message && <div className='edit-panel-window-main-form-message'> {message} </div>}
                    </form>
                </div>
            </div>
        </div>
    )
}
