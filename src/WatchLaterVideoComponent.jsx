import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdMoreVert, MdOutlineWatchLater, MdPlaylistAdd } from "react-icons/md";
import "./WatchLaterVideoComponent.css"

const WatchlaterVideoComponent = (props)=>{
    const [advanced,setadvanced] = useState(false)
    const [videoDuration,setVideoDuration] = useState('');
    const [fullName,setFullName] = useState('')
    const [avatar,setAvatar] = useState('')
    const [video,setVideo] = useState(null)
    const navigate = useNavigate();
    const videoId =  props.videoId
    
    
    useEffect(()=>{
        (async()=>{
            const response = await fetch(`http://localhost:8000/api/v1/videos/${videoId}`)
            response.json().then(async(e)=>{
                const response1 = await fetch(`http://localhost:8000/api/v1/users/c/${e.data.owner}`)
                    response1.json().then((e1)=>{
                        setFullName(e1.data.fullname)
                        setAvatar(e1.data.avatar)
                    })
                
        const tseconds = Math.floor(e.data.duration)    
        const tminutes = Math.floor(tseconds/60)
        const thours = Math.floor(tminutes/60)
        if(thours > 0){
            setVideoDuration(`${thours}:${tminutes-(thours*60)}:${tseconds-(tminutes*60)}`)
        }
        else if(thours == 0 ){
            if(tminutes > 0){
            setVideoDuration(`${tminutes}:${tseconds-(tminutes*60)}`)
            }
            else if(tminutes == 0){
                setVideoDuration(`0:${tseconds}`)
            }
        }
                setVideo(e.data)
            })
        })()
        
    },[])
    return(
        <div>
            {video && (
                <div className="videoComponent" onClick={()=>{navigate(`/videoPlayer/${video._id}`)}}>
                <div className={`advanced-option ${advanced ? '':'nan'}`}>
                    <ul style={{height:"100%",width:'100%',borderRadius:'10px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <li style={{height:'40%',width:'98%',listStyle:'none',display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><MdOutlineWatchLater size={18} color="black" />add to watch later</li>
                        <li style={{height:'40%',width:'98%',listStyle:'none',display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><MdPlaylistAdd size={18} color="black"/>add to playlist</li>
                    </ul>
                </div>
                <div style={{height:'3vh',width:'fit-content',padding:'0 1vh',position:'absolute',top:'30.5vh',right:'2%',backgroundColor:'rgba(0,0,0,0.5)',borderRadius:'5%',color:'white',display:'flex',alignItems:'center',justifyContent:'center'}}> <span style={{fontSize:'2.5vh',display:'flex',alignItems:'center',justifyContent:'center'}}>{videoDuration}</span></div>
                <MdMoreVert size={20} style={{position:'absolute',bottom:'5%',right:'2%',cursor:'pointer'}} onClick={(event)=>{event.stopPropagation();setadvanced(!advanced)}}/>
                <img src={video.thumbnail} style={{height:'34.5vh',maxWidth:'100%',borderRadius:'10px',objectFit:'cover',backgroundPosition:'center'}}/>
                <b><p style={{display:'inline',padding:'5px',fontSize:'2.5vh'}}>{(video.title.length > 12) ? (video.title.substr(0,12) + '..') : video.title}</p></b>
                <div className="owner-section">
                    <img src={avatar} alt="" style={{height:'5vh',width:'5vh',borderRadius:'50%',objectFit:'cover',backgroundPosition:'center'}}/>
                    <span style={{fontSize:'2.1vh',opacity:'0.7'}}>{(fullName?.length > 20) ? (fullName?.substr(0,20) + '..') : fullName}</span>
                </div>
                </div>
            )}
        </div>
        
    );
}

export default WatchlaterVideoComponent