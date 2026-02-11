import User from './user-icon.png'
import { AxiosContext, UserContext } from '../Main/Main'
import { LogoutContext } from '../App/App'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Add.scss'

export default function Add({user, canAdd}) {
    const setIsLogged = useContext(LogoutContext)
    const userObject = useContext(UserContext)
    const axiosJWT = useContext(AxiosContext)
    const navigate = useNavigate()

    async function handleClick(){
        try{
            if(canAdd.current){
                canAdd.current = false
                const { data } = await axiosJWT.post('/chat/addConversation', {
                    fromId: userObject.id,
                    toId: user._id,
                })
                navigate(`/messages/${data}`)
                canAdd.current = true
                window.location.reload()
            }
        }
        catch(error){
            canAdd.current = true
            localStorage.clear()
            setIsLogged('unlogged')
        }
    }

    return userObject.login !== user.login && (
        <button to={user.login ? user.login : '/'} className='add' onClick={handleClick}>
            <img src={user.avatarName ? '/getImage/' + user.avatarName : User} alt=''/>
            <div className='add-info'>
                <div className='add-info-username'>
                    {user.login} 
                </div>
                <div className='add-info-fullname'>
                    {user.fullname}
                </div>
            </div>
        </button>
    )
}
