import './Login.scss'
import Logo from './logo.png'
import { Link } from 'react-router-dom'
import { useState, useContext } from 'react'
import axios from 'axios'
import { LogoutContext } from '../App/App'

export default function Login() {
    const [ login, setLogin ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ message, setMessage ] = useState('')
    const setIsLogged = useContext(LogoutContext)

    async function handleSubmit(e){
        try{
            e.preventDefault()
            if(password.length > 5 && login && login.length <= 20){
                const { data } = await axios.post('/auth/login', {
                    login: login,
                    password: password,
                })
                localStorage.setItem('access_token', data.accessToken)
                localStorage.setItem('refresh_token', data.refreshToken)
                setMessage('Logged In')
                setTimeout(() => {
                    setIsLogged('logged')
                }, 500)
            }
        }
        catch(error){
            setMessage('Wrong login or password')
        }
    }

    return (
        <div className='login'>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='login-form-logo'>
                    <img src={Logo} alt="Gównostrona"/>
                </div>
                <div className='login-form-inputs'>
                    <input className='login-form-inputs-input' type='text' placeholder='Login' value={login} onChange={e => setLogin(e.target.value)}/>
                    <input className='login-form-inputs-input' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <button className={password.length > 5 && login && login.length <= 20 ? 'login-form-button active' : 'login-form-button'}> Log in </button>
                {message &&
                    <div className='login-form-error'> {message} </div>
                }
            </form>
            <div className='login-register'> Don't have an account? <Link to='/register'> Register </Link> </div>
            <footer className='login-footer'> © 2023 Gównostrona from Kamil Lewandowski </footer>
        </div>
    )
}
