import { useEffect, useContext, useState, useRef } from 'react'
import { AxiosContext, UserContext } from '../Main/Main'
import { LogoutContext } from '../App/App'
import { io } from 'socket.io-client'
import Writing from './writing-icon.png'
import './Messages.scss'
import AddConversation from '../AddConversation/AddConversation'
import { Route, Routes } from 'react-router-dom'
import ConversationLink from '../ConversationLink/ConversationLink'
import Plane from './plane-icon.png'
import Conversation from '../Conversation/Conversation'

export default function Messages({ setActive }) {
    const [ addConversation, setAddCoversation ] = useState(false)
    const [ userConversations, setUserConversations ] = useState([])
    const [ receivedMessage, setReceivedMessage ] = useState('')
    const [ conversations, setConversations ] = useState([])
    const [ users, setUsers ] = useState([])
    const setIsLogged = useContext(LogoutContext)
    const userObject = useContext(UserContext)
    const axiosJWT = useContext(AxiosContext)
    const canLoad = useRef(true)
    const socket = useRef()

    useEffect(() => {
        setActive({ page: 'message', action: 'message'})
    }, [setActive])

    useEffect(() => {
        async function getConversations(){
            try{
                if(userObject){
                    const { data } = await axiosJWT.get(`/chat/getUserConversations/${userObject.id}`)
                    setConversations(data)
                }
            }
            catch(error){
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
        getConversations()
    }, [axiosJWT, setIsLogged, userObject])

    useEffect(() => {
        async function getUsers(){
            try{
                const { data } = await axiosJWT.get('/user/getUsers')
                setUsers(data)
            }
            catch(error){
                localStorage.clear()
                setIsLogged('unlogged')
            }
        }
        getUsers()
    }, [axiosJWT, setIsLogged])

    useEffect(() => {
        if(users.length && conversations.length){
            let populated = []
            conversations.forEach(conv => {
                const userId = conv.members.find(id => id !== userObject.id)
                const user = users.find(({_id}) => _id === userId)
                user['convId'] = conv._id
                populated.push(user)
            })
            setUserConversations(populated)
        }
    }, [conversations, users, userObject])
    
    useEffect(() => {
        if(userObject && canLoad.current){
            canLoad.current = false
            socket.current = io('http://127.0.0.1:8000')
            socket.current.emit('addUser', userObject.id)
            socket.current.on('getMessage', ({ senderId, text }) => {
                setReceivedMessage({ senderId: senderId, text: text })
            })
        }
    }, [userObject])

    return (
        <div className='sub-wrapper-chat'>
            {addConversation && <AddConversation setAddCoversation={setAddCoversation} users={users}/>}
            <div className='chat-main'>
                <div className='chat-main-panel'>
                    <div className='chat-main-panel-add'>
                        {userObject.login}
                        <div className='chat-main-panel-add-conversation' onClick={() => setAddCoversation(true)}> <img src={Writing} alt='New conversation'/> </div>
                    </div>
                    <div className='chat-main-panel-conversations'>
                        {userConversations.map(conv => <ConversationLink key={conv._id} user={conv}/>)}
                    </div>
                </div>
                <div className='chat-main-messages'>
                    <Routes>
                        <Route path='/' element={<DefaultChat/>}/>
                        <Route path=':conversationId' element={<Conversation socket={socket} receivedMessage={receivedMessage}/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    )
}

function DefaultChat(){
    return (
        <div className='chat-main-messages-default'>
            <img src={Plane} alt=''/>
            <h2> Your messages </h2>
        </div>
    )
}
