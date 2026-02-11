import './UserComponent.scss'
import Heart from './heart-icon-white.png'
import Chat from './chat-icon-white.png'
import Cross from './cross-icon.png'
import { useState } from 'react'
import Post from '../Post/Post'

export default function UserComponent({ post }) {
    const [ isBig, setIsBig ] = useState(false)

    function handleClick({target}){
        if(target.className === 'element-big active' || target.className === 'element-big-exit' || target.className === 'element-big-exit-image'){
            setIsBig(false)
        }
    }

    function handleKey(e){
        if(e.key === 'Enter'){
            e.target.click()
        }
    }

    return (
        <div className='element' tabIndex='1' onKeyDown={handleKey} onClickCapture={() => setIsBig(true)}>
            <div className='element-small'>
                <img src={'/getImage/' + post.imageName} alt=''/>
                <div className='element-small-hover'>
                    <img src={Heart} alt='Heart number'/> {post.likes.length}
                    <img src={Chat} alt='Comments number'/> {post.comments.length}
                </div>
            </div>
            <div className={isBig ? 'element-big active' : 'element-big'} onClick={handleClick}>
                <button className='element-big-exit'>
                    <img className='element-big-exit-image' src={Cross} alt='Exit'/>
                </button>
                <Post post={post}/>
            </div>
        </div>
    )
}
