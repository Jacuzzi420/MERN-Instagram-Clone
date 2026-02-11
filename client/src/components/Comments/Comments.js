import { useEffect, useState, useRef, useContext } from 'react'
import ArrowBot from './bottom-arrow-icon.png'
import ArrowTop from './top-arrow-icon.png'
import './Comments.scss'
import { v4 as uuid } from 'uuid'
import { Link } from 'react-router-dom'
import { LogoutContext } from '../App/App'
import { AxiosContext, UserContext } from '../Main/Main'

export default function Comments({ id, comments }) {
    const [ commentsList, setCommentsList ] = useState([])
    const [ comment, setComment ] = useState('')
    const [ isOpen, setIsOpen ] = useState(false)
    const setIsLogged = useContext(LogoutContext)
    const axiosJWT = useContext(AxiosContext)
    const userObject = useContext(UserContext)
    const loading = useRef(false)

    async function handleComment(e){
        try{
            e.preventDefault()
            if(!loading.current && comment.length > 0){
                loading.current = true
                await axiosJWT.post(`/post/commentPost/${id}`, {
                    username: userObject.id,
                    content: comment,
                })
                loading.current = false
                setCommentsList(prev => [...prev, { _id: uuid(), creator: { login: userObject.login}, content: comment }])
                setComment('')
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
        setCommentsList(comments)
    }, [comments])

    return (
        <>
            <button className='show' onClick={() => setIsOpen(prev => !prev)}> <img src={isOpen ? ArrowTop : ArrowBot} alt='Show comments'/> </button>
            <div className={isOpen ? 'comments active' : 'comments'}>
                {commentsList.length ? commentsList.map(content => <div key={content._id} className='comments-comment'> <Link to={'/' + content.creator.login}> <div className='comments-comment-username'> {content.creator.login} </div> </Link> <div className='comments-comment-content'> {content.content} </div> </div>) : <div className='comments-empty'> No comments yet </div>}
            </div>
            <div className='comment'>
                <form onSubmit={handleComment}>
                    <input type='text' placeholder='Comment...' value={comment} onChange={e => setComment(e.target.value)}/>
                    <button className={comment.length > 0 ? 'active' : ''}> Send </button>
                </form>
            </div>
        </>
    )
}
