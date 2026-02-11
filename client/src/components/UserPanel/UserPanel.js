import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import User from './user-icon.png'
import './UserPanel.scss'
import UserComponent from '../UserComponent/UserComponent'
import Edit from '../Edit/Edit'
import { LogoutContext } from '../App/App'
import { AxiosContext, UserContext } from '../Main/Main'

export default function UserPanel({ setActive }) {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isEdit, setIsEdit ] = useState(false)
    const [ person, setPerson ] = useState('')
    const [ posts, setPosts ] = useState([])
    const [ likes, setLikes ] = useState(0)
    const setIsLogged = useContext(LogoutContext)
    const axiosJWT = useContext(AxiosContext)
    const userObject = useContext(UserContext)
    const { username } = useParams()

    useEffect(() => {
        async function getPosts(){
            try{
                const { data } = await axiosJWT.get(`/user/getUser/${username}`)
                if(data){
                    setPerson(data)
                    const postsData = await axiosJWT.get(`/post/getUserPosts/${data._id}`)
                    setPosts(postsData.data)
                }
                else{
                    setIsLoading(false)
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
    }, [axiosJWT, setIsLogged, username])

    useEffect(() => {
        let likeNum = 0
        posts.forEach(post => likeNum += post.likes.length)
        setLikes(likeNum)
    }, [posts])

    useEffect(() => {
        username === userObject.login ? setActive({ page: 'profile', action: 'profile' }) : setActive({ page: '', action: '' })
    }, [setActive, userObject.login, username])

    return (
        <div className='sub-wrapper-user'>
            {person ? <>
                <div className='user-wrapper'>
                    <img src={person.avatarName ? '/getImage/' + person.avatarName : User} alt=''/>
                    <div className='user-wrapper-info'>
                        <div className='user-wrapper-info-user'>
                            <div className='user-wrapper-info-user-username'> {person.login} </div>
                            {username === userObject.login && <div className='edit'> <button className='edit-button' onClick={() => setIsEdit(true)}> Edit profile </button> {isEdit && <Edit setIsEdit={setIsEdit}/>} </div>}
                        </div>
                        <div className='user-wrapper-info-data'>
                            <div className='user-wrapper-info-data-posts'>
                                Posts: <span> {posts.length} </span>
                            </div>
                            <div className='user-wrapper-info-data-likes'>
                                Likes: <span> {likes} </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='posts-wrapper'>
                    {posts.map(post => <UserComponent key={post._id} post={post}/>)}
                </div>
                <div className='space'> </div>
            </> : isLoading ? <div className='loading'> Loading... </div> : <div className='error'> User not found </div>}
        </div>
    )
}
