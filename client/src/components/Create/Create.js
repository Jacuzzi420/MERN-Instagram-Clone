import './Create.scss'
import { useEffect, useRef, useState, useContext } from 'react'
import Photo from './photo-icon.png'
import Arrow from './arrow-icon.png'
import Cross from './cross-icon.png'
import { AxiosContext, UserContext } from '../Main/Main'
import { LogoutContext } from '../App/App'

export default function Create({ setActive, setCreateMenu }) {
    const [ file, setFile ] = useState('')
    const [ isDragged, setIsDragged ] = useState(false)
    const axiosJWT = useContext(AxiosContext)
    const setIsLogged = useContext(LogoutContext)
    const userObject = useContext(UserContext)
    const uploading = useRef(false)
    const fileInput = useRef(0)
    const reader = new FileReader()

    function fileHandler(){
        reader.readAsDataURL(fileInput.current.files[0])
        reader.onload = () => {
            setFile(reader.result)
        }
    }

    function handleBack(){
        const dataTransfer = new DataTransfer()
        fileInput.current.files = dataTransfer.files
        setFile('')
    }

    async function handleShare(e){
        try{
            e.preventDefault()
            if(!uploading.current){
                uploading.current = true
                const formData = new FormData()
                formData.append('image', fileInput.current.files[0])
                formData.append('creator', userObject.id)
                await axiosJWT.post('/post/createPost', formData)
                window.location.reload()
            }
        }
        catch(error){
            localStorage.clear()
            setIsLogged('unlogged')
        }
    }

    function handleDragOver(e){
        e.preventDefault()
        setIsDragged(true)
    }

    function handleDragLeave(e){
        e.preventDefault()
        setIsDragged(false)
    }

    function handleDrop(e){
        e.preventDefault()
        if(e.dataTransfer.files.length){
            fileInput.current.files = e.dataTransfer.files
            reader.readAsDataURL(e.dataTransfer.files[0])
            reader.onload = () => {
                setFile(reader.result)
            }
        }
    }
    
    function handleClick({target}){
        if(target.className === 'create' || target.className === 'create-exit' || target.className === 'create-exit-image'){
            setCreateMenu(false)
            setActive(prev => {
                return { page: prev.page, action: prev.page }
            })
        }
    }

    useEffect(() => {
        setActive(prev => {
            return { page: prev.page, action: 'create' }
        })
    }, [setActive])

    return (
        <div className='create' onClick={handleClick}>
            <button className='create-exit'>
                <img className='create-exit-image' src={Cross} alt='Exit'/>
            </button>
            <div className='create-window'>
                <div className='create-window-heading'> { file ? (<> 
                    <button className='create-window-heading-back' onClick={handleBack}> <img src={Arrow} alt='back'/> </button>
                    <button className='create-window-heading-share' onClick={handleShare}> Share </button>
                </>) : 'Create new post' } </div>
                <div className={isDragged ? 'create-window-main active' : 'create-window-main'} style={file ? {backgroundImage: `url(${file})`} : {} } {...(!file && {onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop:handleDrop})}>
                { !file && (
                    <div className='create-window-main-box'>
                        <img src={Photo} alt=''/>
                        <h2> Grab photo here </h2>
                        <button onClick={() => fileInput.current.click()}> Choose from computer </button>
                    </div>
                )}
                </div>
            </div>
            <form className='create-input'>
                <input onChange={fileHandler} type='file' accept='image/jpeg, image/png' ref={fileInput}/>
            </form>
        </div>
    )
}
