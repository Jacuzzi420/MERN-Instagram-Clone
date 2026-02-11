import './App.scss'
import Login from '../Login/Login'
import Register from '../Register/Register'
import NotFound from '../NotFound/NotFound'
import Loading from '../Loading/Loading'
import Main from '../Main/Main'
import { Route, Routes } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

export const LogoutContext = React.createContext()

export default function App(){
  const [ isLogged, setIsLogged ] = useState('unset')
  const [ isloading, setIsLoading ] = useState(true)

  useEffect(() => {
    async function refreshCurrentToken(){
      try{
        const refreshToken = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/auth/refresh', {
          refreshToken: refreshToken, 
        })
        localStorage.setItem('access_token', data.accessToken)
        setIsLogged('logged')
      }
      catch(error){
        throw new Error(error)
      }
    }
    async function validateToken(){
      try{
        if(!localStorage.getItem('access_token')){
          setIsLogged('unlogged')
          return
        }
        const token = localStorage.getItem('access_token')
        const currentDate = new Date()
        const decodedToken = jwtDecode(token)
        if(decodedToken.exp * 1000 > currentDate.getTime()){
          await axios.get('/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setIsLogged('logged')
          return
        }
        refreshCurrentToken()
      }
      catch(error){
        if(error.code === 'ECONNABORTED'){
          validateToken()
        }
        else{
          localStorage.clear()
          setIsLogged('unlogged')
        }
      }
    }
    validateToken()
  }, [])

  useEffect(() => {
    if(isLogged !== 'unset'){
      setIsLoading(false)
    }
  }, [isLogged])

  return(
    <LogoutContext.Provider value={setIsLogged}>
      <Routes>
        <Route path={isLogged === 'logged' ? '/*' : '/'} element={isloading ? <Loading/> : (isLogged === 'logged' ? <Main/> : <Login/>)}/>
        <Route path='/register' element={isloading ? <Loading/> : (isLogged === 'logged' ? <NotFound/> : <Register/>)}/>
        {isLogged === 'unlogged' && <Route path='*' element={<NotFound/>}/>}
      </Routes>
    </LogoutContext.Provider>
  )
}