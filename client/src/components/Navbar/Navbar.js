import './Navbar.scss'
import Logo from './logo.png'
import Home from './home-icon.png'
import Search from './search-icon.png'
import Plane from './plane-icon.png'
import User from './user-icon.png'
import Plus from './plus-icon.png'
import Power from './power-icon.png'
import LogoSmall from './logo-small.png'
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import '../Create/Create'
import Create from '../Create/Create'
import { AxiosContext, UserContext } from '../Main/Main'
import { LogoutContext } from '../App/App'
import SearchBar from '../SearchBar/SearchBar'

export default function Navbar({ active, setActive }) {
    const [ createMenu, setCreateMenu ] = useState(false)
    const [ isSearch, setIsSearch ] = useState(false)
    const userObject = useContext(UserContext)
    const setIsLogged = useContext(LogoutContext)
    const axiosJWT = useContext(AxiosContext)

    async function handleLogout(e){
        try{
            e.preventDefault()
            await axiosJWT.delete('/auth/logout', {
                data: {
                    refreshToken: localStorage.getItem('refresh_token')
                },
            })
            localStorage.clear()
            setIsLogged('unlogged')
        }
        catch(error){
            localStorage.clear()
            setIsLogged('unlogged')
        }
    }

    function handleSearch(e){
        e.preventDefault()
        if(window.innerWidth > 760){
            setIsSearch(true)
        }
    }

    return (
        <>
            {createMenu && <Create setActive={setActive} setCreateMenu={setCreateMenu}/>}
            <nav className='navbar'>
                <div className='navbar-logo'> <img className={isSearch ? 'navbar-logo-big search' : 'navbar-logo-big'} src={Logo} alt='website logo'/> <img className={isSearch ? 'navbar-logo-small search' : 'navbar-logo-small'}src={LogoSmall} alt='website logo'/> </div>
                <ul className='navbar-list'>
                    <li className={isSearch ? 'navbar-list-element search' : 'navbar-list-element'}> <Link to='/' className={active.action === 'home' ? 'active' : undefined}> <img src={Home} alt=''/> <div className={isSearch ? 'navbar-list-element-content search' : 'navbar-list-element-content'}> Main page </div> </Link> </li>
                    <li className={isSearch ? 'navbar-list-element search' : 'navbar-list-element'} onClick={handleSearch}> <Link to='#'> <img src={Search} alt=''/> <div className={isSearch ? 'navbar-list-element-content search' : 'navbar-list-element-content'}> Search </div> </Link> </li>
                    <li className={isSearch ? 'navbar-list-element search' : 'navbar-list-element'}> <Link to='/messages' className={active.action === 'message' ? 'active' : undefined}> <img src={Plane} alt=''/> <div className={isSearch ? 'navbar-list-element-content search' : 'navbar-list-element-content'}> Messages </div> </Link> </li>
                    <li className={isSearch ? 'navbar-list-element search' : 'navbar-list-element'} onClick={() => setCreateMenu(prev => !prev)}> <Link to='#' className={active.action === 'create' ? 'active' : undefined}> <img src={Plus} alt=''/> <div className={isSearch ? 'navbar-list-element-content search' : 'navbar-list-element-content'}> Create </div> </Link> </li>
                    <li className={isSearch ? 'navbar-list-element search' : 'navbar-list-element'}> <Link to={userObject.login ? userObject.login : '/'} className={active.action === 'profile' ? 'active' : undefined}> <img className='navbar-list-element-avatar' src={userObject.avatarName ? userObject.avatarName : User} alt=''/> <div className={isSearch ? 'navbar-list-element-content search' : 'navbar-list-element-content'}> Profile </div> </Link> </li>
                    <li className={isSearch ? 'navbar-list-element search' : 'navbar-list-element'} onClick={handleLogout}> <Link to='/'> <img src={Power} alt=''/> <div className={isSearch ? 'navbar-list-element-content search' : 'navbar-list-element-content'}> Log out </div> </Link> </li>
                </ul>
                <div className='navbar-logout' onClick={handleLogout}> <Link to='/' className={isSearch ? 'search' : ''}> <img src={Power} alt=''/> <div className={isSearch ? 'navbar-logout-content search' : 'navbar-logout-content'}> Log out </div> </Link> </div>
            </nav>
            {isSearch && <SearchBar setIsSearch={setIsSearch}/>}
        </>
      )
}
