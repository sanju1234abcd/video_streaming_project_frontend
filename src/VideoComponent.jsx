import { useContext, useState,useRef, useEffect,React } from "react";
import "./VideoComponent.css";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdMoreVert, MdOutlineWatchLater , MdPlaylistAdd, MdUpdate } from "react-icons/md";

const VideoComponent = (props)=>{
    const {_id,title,description,views,thumbnail,owner,videoFile,duration,createdAt} = props.video
    const sameUser = props.sameUser
    const [Fullname,setFullname] = useState('')
    const [timelapse,setTimelapse] = useState('')
    const [videoDuration,setVideoDuration] = useState('')
    const [advanced,setadvanced] = useState(false)
    const [Avatar ,setAvatar] = useState('')
    const navigate = useNavigate()

    const deleteVideo = async(event)=>{
        event.stopPropagation();
        console.log('clicked')
        const deleteResponse = await fetch(`http://localhost:8000/api/v1/videos/${_id}`,{
            method:'DELETE',
            credentials:'include'
        })
        deleteResponse.json().then((e)=>{
            console.log(e)
        })
    }
    useEffect(()=>{

        (async()=>{
        const channelProfileresponse = await fetch(`http://localhost:8000/api/v1/users/c/${owner}`)
        const channelProfile =  channelProfileresponse.json()
        await channelProfile.then((e)=>{
        const specificTime = new Date(createdAt.replace('Z',''))
        const currentTime = new Date(Date.now())
        const timediff = currentTime.getTime() - specificTime.getTime()
        const days = Math.floor(timediff/(1000*60*60*24))
        const hours = Math.floor(timediff/3600000);
        const minutes = Math.floor((timediff%3600000)/60000);
        const seconds = Math.floor((timediff%60000)/1000);
        
        const months = Math.floor(days/30)
        const years = Math.floor(months/12)
        const daysString = (days>0)? `${days} days`:''
        const hoursString = (hours>0)? `${hours} hours`:''
        const minutesString = (minutes>0)? `${minutes} minutes`:''
        const secondsString = (seconds>0)? `${seconds} seconds`:''
        if(years >0){
            setTimelapse(`${years} years`)
        }
        else{
            if(months>0){
                setTimelapse(`${months} months`)
            }
            else{
        if(daysString.trim()!==''){
            setTimelapse(daysString)
        }
        else{
            if(hoursString.trim() !== ''){
                setTimelapse(minutesString)
            }
            else{
                if(minutesString.trim()!== ''){
                    setTimelapse(minutesString)
                }
                else{
                    setTimelapse(secondsString)
                }
            }
        }}}

        const tseconds = Math.floor(duration)
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
        setAvatar(e.data.avatar)
        setFullname(e.data.fullname)
        })
            
        })()
        
    },[])  
    
    return( 
        <div className="video" onClick={()=>{navigate(`/videoPlayer/${_id}`)}}>
            <div className="image-section">
                <img src={thumbnail} alt="" />
                <span>{videoDuration}</span>
            </div>
            <div className="details-section">
                
                <img src={Avatar} title="explore this channel" onClick={(event)=>{event.stopPropagation();navigate(`/channel/${owner}`)}} style={{height:'30px',width:'30px',borderRadius:'50%',objectFit:'cover',backgroundPosition:'center',cursor:'pointer'}}/>
                
                <h3>{(title.length > 30) ? (title.substr(0,30) + '...') : title}</h3>
            </div>
            <div className="views-section">
                <h4>{(Fullname.length > 30) ? (Fullname.substr(0,30) + '..') : Fullname}</h4>
                <span>{views} views &bull; {timelapse} ago</span>
            </div>
            <div className={`advanced-option1 ${advanced ? '':'nan1'}`}>
                <ul style={{height:"100%",width:'100%',paddingLeft:'2%',borderRadius:'10px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                    <li style={{height:`${sameUser ? '20%' : '40%'}`,width:'98%',listStyle:'none',display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><MdOutlineWatchLater size={18} color="black" />add to watch later</li>
                    <li style={{height:`${sameUser ? '20%' : '40%'}`,width:'98%',listStyle:'none',display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><MdPlaylistAdd size={18} color="black"/>add to playlist</li>
                    {sameUser && <li style={{height:`${sameUser ? '20%' : '40%'}`,width:'98%',listStyle:'none',display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}} onClick={deleteVideo}><MdDelete size={18} color="black"/> delete this video</li>}
                    {sameUser && <li style={{height:`${sameUser ? '20%' : '40%'}`,width:'98%',listStyle:'none',display:'flex',alignItems:'center',gap:'5px',cursor:'pointer'}}><MdUpdate size={18} color="black"/> update this video </li>}
                </ul>
            </div>
            <MdMoreVert size={20} color="black" style={{position:'absolute',bottom:'0px',right:'5px'}} onClick={(event)=>{event.stopPropagation();setadvanced(!advanced)}}/>
        </div>
    );

    };

export default VideoComponent;