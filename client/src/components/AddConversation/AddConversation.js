import { useState, useEffect, useRef } from 'react'
import './AddConversation.scss'
import Cross from './cross-icon.png'
import Add from '../Add/Add'

export default function AddConversation({setAddCoversation, users}) {
    const [ search, setSearch ] = useState('')
    const [ usersSearched, setUsersSearched ] = useState([])
    const canAdd = useRef(true)

    function handleClick({target}){
        if(target.className === 'add-modal'){
            setAddCoversation(false)
        }
    }

    function handleChange(e){
        e.preventDefault()
        setSearch(e.target.value)
        if(e.target.value){
            const searchedUsers = users.filter(({login}) => login.includes(e.target.value))
            setUsersSearched(searchedUsers)
        }
        else{
            setUsersSearched(users)
        }
    }

    useEffect(() => {
        setUsersSearched(users)
    }, [users])

    return (
        <div className='add-modal' onClick={handleClick}>
            <div className='add-modal-content'>
                <div className='add-modal-content-header'>
                    Add conversation
                    <button className='add-modal-content-header-exit' onClick={() => setAddCoversation(false)}>
                        <img src={Cross} alt='exit'/>
                    </button>
                </div>
                <div className='add-modal-content-input'>
                    To: <input type='text' placeholder='Search...' value={search} onChange={handleChange}/>
                </div>
                <div className='add-modal-content-users'>
                    {usersSearched.map(user => <Add key={user._id} user={user} canAdd={canAdd}/>)}
                </div>
            </div>
        </div>
    )
}
