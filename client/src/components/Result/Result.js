import User from './user-icon.png'
import { Link } from 'react-router-dom'
import './Result.scss'

export default function Result({user}) {
    return (
        <Link to={user.login ? user.login : '/'} className='result'>
            <img src={user.avatarName ? '/getImage/' + user.avatarName : User} alt=''/>
            <div className='result-info'>
                <div className='result-info-username'>
                    {user.login}
                </div>
                <div className='result-info-fullname'>
                    {user.fullname}
                </div>
            </div>
        </Link>
    )
}
