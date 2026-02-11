import { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext, AxiosContext } from '../Main/Main'
import { LogoutContext } from '../App/App'
import { v4 as uuid } from 'uuid'
import User from './user-icon.png'
import Plane from './plane-icon.png'
import './Conversation.scss'

export default function Conversation({ socket, receivedMessage }) {
    const [ conversation, setConversation ] = useState('')
    const [ canShow, setCanShow ] = useState(false)
    const [ messages, setMessages ] = useState([])
    const [ message, setMessage ] = useState('')
    const [ user, setUser ] = useState('')
    const setIsLogged = useContext(LogoutContext)
    const userObject = useContext(UserContext)
    const axiosJWT = useContext(AxiosContext)
    const canSend = useRef(true)
    const scroll = useRef()
    const { conversationId } = useParams()
    const navigate = useNavigate()

    async function handleSubmit(e){
        try{
            e.preventDefault()
            if(canSend.current && message){
                canSend.current = false
                socket.current.emit('sendMessage', {
                    senderId: userObject.id,
                    receiverId: conversation.members.find(member => member !== userObject.id),
                    text: message,
                })
                await axiosJWT.post('/chat/addMessage', {
                    conversationId: conversationId,
                    sender: userObject.id,
                    content: message,
                })
                canSend.current = true
                setMessages(prev => [...prev, { _id: uuid(), sender: userObject.id, content: message }])
                setMessage('')
            }
        }
        catch(error){
            canSend.current = true
            if(error.code !== 'ECONNABORTED'){
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
    }

    useEffect(() => {
        async function getConversation(){
            try{
                const { data } = await axiosJWT.get(`/chat/getConversation/${conversationId}`)
                setConversation(data)
            }
            catch(error){
                if(error.request.response !== 'Forbidden'){
                    navigate('/messages')
                    return
                }
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
        getConversation()
    }, [axiosJWT, setIsLogged, navigate, conversationId])

    useEffect(() => {
        async function getUser(){
            try{
                if(userObject && conversation){
                    if(!conversation.members.find(member => member === userObject.id)){
                        navigate('/messages')
                        return
                    }
                    setCanShow(true)
                    const userId = conversation.members.find(member => member !== userObject.id)
                    const { data } = await axiosJWT.get(`/user/getUserById/${userId}`)
                    setUser(data)
                }
            }
            catch(error){
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
        getUser()
    }, [axiosJWT, setIsLogged, navigate, userObject, conversation])

    useEffect(() => {
        async function getMessages(){
            try{
                const { data } = await axiosJWT.get(`/chat/getMessages/${conversationId}`)
                setMessages(data)
            }
            catch(error){
                if(error.request.response !== 'Forbidden'){
                    navigate('/messages')
                    return
                }
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
        getMessages()
    }, [axiosJWT, setIsLogged, navigate, conversationId])

    useEffect(() => {
        if(receivedMessage && conversation && userObject){
            if(receivedMessage.senderId === conversation.members.find(member => member !== userObject.id)){
                setMessages(prev => [...prev, { _id: uuid(), sender: receivedMessage.senderId, content: receivedMessage.text }])
            }
        }
    }, [receivedMessage, conversation, userObject])
    
    useEffect(() => {
        scroll.current.scroll({ top: scroll.current.scrollHeight })
    }, [messages])

    return (
        <div className='conversation'>
            <div className='conversation-header'>
                <img src={user.avatarName ? '/getImage/' + user.avatarName : User} alt=''/>
                <div className='conversation-header-name'> {user.login} </div>
            </div>
            <div className='conversation-content'>
                <div className='conversation-content-messages' ref={scroll}>
                    {canShow && messages.map(text => {
                        if(text.sender === userObject.id){
                            return <MessageMe key={text._id} text={text}/>
                        }
                        else{
                            return <MessagePerson key={text._id} text={text}/>
                        }
                    })}
                </div>
                <div className='conversation-content-input'>
                    <form onSubmit={handleSubmit}>
                        <button> <img src={Plane} alt='Send message'/> </button>
                        <input type='text' placeholder='Send message...' value={message} onChange={(e) => setMessage(e.target.value)}/>
                    </form>
                </div>
            </div>
        </div>
    )
}

function MessageMe({text}){
    return(
        <div className='conversation-content-messages-me'> 
            <div className='conversation-content-messages-me-content'>
                {text.content}
            </div>
        </div>
    )
}

function MessagePerson({text}){
    return(
        <div className='conversation-content-messages-person'> 
            <div className='conversation-content-messages-person-content'>
                {text.content}
            </div>
        </div>   
    )
}


