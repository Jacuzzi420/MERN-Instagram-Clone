import './Post.scss'
import User from './user-icon.png'
import Heart from './heart-icon.png'
import PressedHeart from './heart-icon-pressed.png'
import { useEffect, useState, useRef, useContext } from 'react'
import Comments from '../Comments/Comments'
import { Link } from 'react-router-dom'
import { LogoutContext } from '../App/App'
import { AxiosContext, UserContext } from '../Main/Main'

export default function Post({ post }) {
    const [ isLiked, setIsLiked ] = useState(false)
    const [ likeNum, setLikeNum ] = useState(0)
    const setIsLogged = useContext(LogoutContext)
    const axiosJWT = useContext(AxiosContext)
    const userObject = useContext(UserContext)
    const loading = useRef(false)

    async function handleLike(e){
        try{
            e.preventDefault()
            if(!loading.current){
                loading.current = true
                await axiosJWT.put(`/post/likePost/${post._id}`, {
                    userId: userObject.id,
                })
                loading.current = false
                isLiked ? setLikeNum(prev => prev-1) : setLikeNum(prev => prev+1)
                setIsLiked((prev) => !prev)
            }
        }
        catch(error){
            loading.current = false
            if(error.code !== 'ECONNABORTED'){
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
    }

    useEffect(() => {
        if(post.likes.some(({ person }) => person._id === userObject.id)){
            setIsLiked(true)
        }
        setLikeNum(post.likes.length)
    }, [post, userObject.id])

    return (
        <div className='post'>
            <div className='post-heading'>
                <Link to={'/' + post.creator.login}> <img src={post.creator.avatarName ? '/getImage/' + post.creator.avatarName : User} alt='User avatar'/> </Link>
                <Link to={'/' + post.creator.login}> <div className='post-heading-username'> {post.creator.login} </div> </Link>
            </div>
            <div className='post-content'>
                <img src={'/getImage/' + post.imageName} alt='Users post'/>
            </div>
            <div className='post-footer'>
                <div className='post-footer-like'>
                    <button className='post-footer-like-button'> <img src={isLiked ? PressedHeart : Heart} alt='Like button' onClick={handleLike}/> </button>
                    <div className='post-footer-like-number'> {likeNum} </div>
                </div>
                <Comments id={post._id} comments={post.comments}/>
            </div>
        </div>
    )
}
