import { useEffect, useRef, useState } from "react";
import "./Activity.css";
import WatchlaterVideoComponent from "./WatchLaterVideoComponent";
import  InfiniteScroll  from "react-infinite-scroller";
const Activity = ()=>{
    const [videos,setVideos] = useState([])
    const [profile,setProfile] = useState('')
    const [username,setUsername]  = useState('')
    const [hasMore,setHasMore] = useState(true)
    const page = useRef(2);

    const watchHistory = async()=>{
        const response1 = await fetch("http://localhost:8000/api/v1/users/watch-history",{
            method:'GET',
            credentials:'include'
        })
         await response1.json().then(async(e)=>{  
            if(e.data && (e.data.watchedVideos.length > 0)){
                setHasMore(e.data.watchedVideos.length == 5)
                setVideos(e.data.watchedVideos.reverse())
            }
        })
    }
    useEffect(()=>{
        (async()=>{
            const response = await fetch("http://localhost:8000/api/v1/users/current-user",{
                method:'GET',
                credentials:'include'
            })
            await response.json().then((e)=>{
                setUsername(e.data.user.fullname)
                setProfile(e.data.user.avatar)
            })
            
        })()
        watchHistory();
    },[])
    return(
        <div className="activity">
            <div className="profile" style={{height:'20vh',width:'100%',display:'flex',alignItems:'center'}}>
                <img src={profile} style={{height:'18vh',width:'18vh',borderRadius:'50%',marginLeft:'2vw'}} alt="" />
                <h3 style={{margin:'none',fontWeight:'500',marginLeft:'2.5vw'}}>{username}</h3>
            </div>
            <div className="watch-history">
                <button className={`view-all ${(Array.isArray(videos) && (videos.length == 0)) ? 'nan':''}` }>view all</button>
                <h3 style={{marginBottom:'none',paddingLeft:'5vh',height:'4vh'}}>Watched Videos</h3>
                <div className="watch-history-video-container" style={{height:`${(Array.isArray(videos) && (videos.length == 0)) ? 'fit-content':'47vh'}`}}>
                    {(Array.isArray(videos) && (videos.length > 0)) ? (
                        videos.map((video,index)=>(
                            <WatchlaterVideoComponent videoId = {video} key={index}/>
                        )  )
                    ):( <h2>No Videos watched by you</h2> )}
                    

                </div>
            </div>
        </div>
    );
}

export default Activity;