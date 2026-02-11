import './Content.scss'
import Post from '../Post/Post'
import { useEffect, useState, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import User from './user-icon.png'
import { AxiosContext, UserContext } from '../Main/Main'
import { LogoutContext } from '../App/App'

export default function Content({ setActive }) {
    const [ isMore, setIsMore ] = useState(true)
    const [ posts, setPosts ] = useState([])
    const setIsLogged = useContext(LogoutContext)
    const axiosJWT = useContext(AxiosContext)
    const userObject = useContext(UserContext)
    const canBeUsed = useRef(false)
    const spaceBlock = useRef('')
    const next = useRef('')

    function handleScroll(){
        if(spaceBlock.current.getBoundingClientRect().top < 1500 && canBeUsed.current){
          canBeUsed.current = false
          getData()
        }
    }
    
    async function getData(){
        try{
            const { data } = await axiosJWT.get(`/post/getPosts?page=${next.current}`)
            setPosts(prev => [...prev, ...data.docs])
            if(data.hasNextPage){
                canBeUsed.current = true
                next.current = data.nextPage
            }
            else{
                setIsMore(false)
            }
            }
            catch(error){
                if(error.code === 'ECONNABORTED'){
                    getData()
                }
                else{
                    localStorage.clear()
                    setIsLogged('unlogged')
                }
        }
    }

    useEffect(() => {
        async function getPosts(){
            try{
                const { data } = await axiosJWT.get('/post/getPosts')
                setPosts(data.docs)
                if(data.hasNextPage){
                    canBeUsed.current = true
                    next.current = data.nextPage
                }
                else{
                    setIsMore(false)
                }
            }
            catch(error){
                if(error.code === 'ECONNABORTED'){
                    getPosts()
                }
                else{
                    localStorage.clear()
                    setIsLogged('unlogged')
                }
            }
        }
        getPosts()
    }, [axiosJWT, setIsLogged, next])

    useEffect(() => {
        setActive({ page: 'home', action: 'home'})
    }, [setActive])

    return (
        <div className='sub-wrapper' onScroll={handleScroll}>
            <main className='content'>
                {posts ? posts.map(post => <Post key={post._id} post={post}/>) : ''}
                <div className='content-space' ref={spaceBlock}> {!isMore && 'No more posts'} </div>
            </main>
            <div className='user'>
                <div className='user-info'>
                    <Link to={userObject.login ? userObject.login : '/'}> <img src={userObject.avatarName ? userObject.avatarName : User} alt='User avatar'/> </Link>
                    <Link to={userObject.login ? userObject.login : '/'}> <div className='user-info-name'> {userObject.login} </div> </Link>
                </div>
                <div className='user-credits'> © 2023 Gównostrona from Kamil Lewandowski </div>
            </div>
        </div>
    )
}