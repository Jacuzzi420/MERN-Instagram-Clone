import './Main.scss'
import Navbar from '../Navbar/Navbar'
import Content from '../Content/Content'
import Messages from '../Messages/Messages'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import UserPanel from '../UserPanel/UserPanel'
import React, { useEffect, useState, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LogoutContext } from '../App/App'

export const AxiosContext = React.createContext()
export const UserContext = React.createContext()

export default function Main() {
  const [ userObject, setUserObject ] = useState('')
  const [ active, setActive ] = useState({ page: '', action: ''})
  const setIsLogged = useContext(LogoutContext)
  const axiosJWT = axios.create()

  async function refreshCurrentToken(){
    try{
      const refreshToken = localStorage.getItem('refresh_token')
      const { data } = await axios.post('/auth/refresh', {
        refreshToken: refreshToken, 
      })
      localStorage.setItem('access_token', data.accessToken)
    }
    catch(error){
      throw new Error(error)
    }
  }

  axiosJWT.interceptors.request.use(async (config) => {
    try{
      let token = localStorage.getItem('access_token')
      const currentDate = new Date()
      const decodedToken = jwtDecode(token)
      if(decodedToken.exp * 1000 < currentDate.getTime()){
        await refreshCurrentToken()
        token = localStorage.getItem('access_token')
      }
      config.headers['Authorization'] = `Bearer ${token}`
      return config
    }
    catch(error){
      localStorage.clear()
      setIsLogged('unlogged')
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const { id, login, avatarName, fullname } = jwtDecode(token)
    setUserObject({ id: id, login: login, avatarName: avatarName ? '/getImage/' + avatarName : false, fullname: fullname})
  }, [])

  return (
    <AxiosContext.Provider value={axiosJWT}>
      <UserContext.Provider value={userObject}>
        <div className='main-wrapper'>
          <Navbar active={active} setActive={setActive}/>
          <Routes>
            <Route path='' element={<Content setActive={setActive}/>}/>
            <Route path='messages/*' element={<Messages setActive={setActive}/>}/>
            <Route path=':username' element={<UserPanel setActive={setActive}/>}/>
          </Routes>
        </div>
      </UserContext.Provider>
    </AxiosContext.Provider>
  )
}
