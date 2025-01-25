import { useEffect, useState, useRef, useCallback, useContext } from "react";
import "./Videos.css"
import VideoComponent from "./VideoComponent";
import InfiniteScroll from "react-infinite-scroller";
import { AppContext } from "./AppContext";
import { useLocation } from "react-router-dom";

function Videos(props){
    const route = props.route
    const sameUser = props.sameUser ? props.sameUser : false
    const {totalVideos,setTotalVideos} = useContext(AppContext)
    const [videos,setVideos] = useState([])
    const [hasMore,setHasMore] = useState(true)
    const page = useRef(2)

    async function videoLoading (){
        const response = await fetch(`${ (route.trim() == '') ? 'http://localhost:8000/api/v1/videos/random' : `http://localhost:8000/api/v1/videos/search?page=1&limit=6&channelId=${route}`}`)
        const output = response.json()
        output.then((e)=>{
            if(e.data == null){
                setHasMore(false)
            }
            else{
            setHasMore((route.trim() == '') ? true : (e.data.length == 6))
            setVideos((prevVideos)=>[...prevVideos,...e.data])
            setTotalVideos(`${(route.trim() == '') ? 0 : e.message}`)
            }
        })
    }

     const morevideoLoading = async()=>{
        const response = await fetch(`${ (route.trim() == '') ? 'http://localhost:8000/api/v1/videos/random' : `http://localhost:8000/api/v1/videos/search?page=${page.current}&limit=6&channelId=${route}`}`)
        const output = response.json()
        output.then((e)=>{
            
            setHasMore((route.trim() == '') ? true : (e.data.length == (page.current * 6)))
            setVideos((prevVideos)=>[...prevVideos,...e.data])
            
        })
        page.current += 1
    }

    useEffect(()=>{  
        (async()=>{
           await videoLoading();
        })()

    },[])

    return(
        <div>
            {(Array.isArray(videos) && (videos.length > 0)) ?
             (
            <InfiniteScroll
            loadMore = {morevideoLoading}
            hasMore={hasMore}
            loader ={<div>loading...</div>}
            useWindow={true}
            delay={500}
            className="infinite_scroll_videos"
            //threshold={400} //load more videos when 400 px from the button
            >
                {
                    videos.map((video,index)=>(
                        (   
                            <VideoComponent key={index} video={video} sameUser = {sameUser} />                              
                        )
                    ))      
                }
            </InfiniteScroll>
            ):( <div></div> )}
            
        </div>
        
    );
}

export default Videos;
