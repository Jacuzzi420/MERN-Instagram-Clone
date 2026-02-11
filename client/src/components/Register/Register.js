import './Register.scss'
import Logo from './logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

export default function Register() {
    const [ login, setLogin ] = useState('')
    const [ fullname, setFullname ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ message, setMessage ] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        try{
            e.preventDefault()
            if(password.length > 5 && fullname && login && login.length <= 20 && login !== 'messages'){
                const { data } = await axios.post('/auth/register', {
                    login: login,
                    fullname: fullname,
                    password: password,
                })
                if(data === 'Success'){
                    setMessage('Account created')
                    setTimeout(() => {
                        navigate('/')
                    }, 500)
                }
            }
        }
        catch(error){
            setMessage('Login already exist')
        }
    }

    return (
        <div className='register'>
            <form className='register-form' onSubmit={handleSubmit}>
                <div className='register-form-logo'>
                    <img src={Logo} alt="Gównostrona"/>
                </div>
                <div className='register-form-inputs'>
                    <input className='register-form-inputs-input' type='text' placeholder='Login' value={login} onChange={e => setLogin(e.target.value)}/>
                    <input className='register-form-inputs-input' type='text' placeholder='Full Name' value={fullname} onChange={e => setFullname(e.target.value)}/>
                    <input className='register-form-inputs-input' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <button className={password.length > 5 && fullname && login && login.length <= 20 && login !== 'messages' ? 'register-form-button active' : 'register-form-button'}> Next </button>
                {message &&
                    <div className='register-form-error'> {message} </div>
                }
            </form>
            <div className='register-login'> Have an account? <Link to='/'> Log in </Link> </div>
            <footer className='register-footer'> © 2023 Gównostrona from Kamil Lewandowski </footer>
        </div>
    )
}
