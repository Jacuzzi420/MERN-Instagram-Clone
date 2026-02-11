import User from './user-icon.png'
import { Link } from 'react-router-dom'
import './ConversationLink.scss'

export default function ConversationLink({user}) {
    return (
        <Link to={user.convId ? user.convId : '/'} className='conv-link'>
            <img src={user.avatarName ? '/getImage/' + user.avatarName : User} alt=''/>
            <div className='conv-link-info'>
                <div className='conv-link-info-username'>
                    {user.login}
                </div>
                <div className='conv-link-info-fullname'>
                    {user.fullname}
                </div>
            </div>
        </Link>
    )
}
