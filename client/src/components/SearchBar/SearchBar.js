import { useEffect, useCallback, useState, useContext, useRef } from 'react'
import { AxiosContext } from '../Main/Main'
import { LogoutContext } from '../App/App'
import Result from '../Result/Result'
import './SearchBar.scss'

export default function SearchBar({setIsSearch}) {
    const [ search, setSearch ] = useState('')
    const [ usersSearched, setUsersSearched ] = useState([])
    const [ isClosing, setIsClosing ] = useState(false)
    const setIsLogged = useContext(LogoutContext)
    const axiosJWT = useContext(AxiosContext)
    const users = useRef([])

    function handleChange(e){
        e.preventDefault()
        setSearch(e.target.value)
        if(e.target.value){
            const searchedUsers = users.current.filter(({login}) => login.includes(e.target.value))
            setUsersSearched(searchedUsers)
        }
        else{
            setUsersSearched(users.current)
        }
    }

    const handleClick = useCallback(({target}) => {
        if(!target.closest('.search-bar')){
            setIsClosing(true)
            setTimeout(() => {
                setIsSearch(false)
            }, 300)
        }
    }, [setIsSearch])

    const handleResize = useCallback(() => {
        if(window.innerWidth <= 760){
            setIsSearch(false)
        }
    }, [setIsSearch])

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        setTimeout(() => {
            window.addEventListener('click', handleClick)
        }, 500)
        return () => {
            window.removeEventListener('click', handleClick)
            window.removeEventListener('resize', handleResize)
        }
    }, [handleClick, handleResize])

    useEffect(() => {
        async function getUsers(){
            try{
                const { data } = await axiosJWT.get('/user/getUsers')
                users.current = data
                setUsersSearched(data)
            }
            catch(error){
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
        getUsers()
    }, [axiosJWT, setIsLogged])

    return (
        <div className={isClosing ? 'search-bar close' : 'search-bar'}>
            <div className='search-bar-search'>
                <h2> Search </h2>
                <input type='text' placeholder='Search' value={search} onChange={handleChange}/>
            </div>
            <div className='search-bar-results'>
                {usersSearched.map(user => <Result key={user._id} user={user}/>)}
            </div>
        </div>
    )
}
