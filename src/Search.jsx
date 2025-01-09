import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import  InfiniteScroll  from "react-infinite-scroller";
import VideoComponent  from "./VideoComponent.jsx";
import Videos from "./Videos.jsx"
import Spinner from "./Spinner.jsx"
import "./Search.css";
import Navbar from "./Navbar";
import SidebarPopup from "./SidebarPopup.jsx";


const Search = ()=>{
    const location = useLocation()
    const [videos,setVideos] = useState([])
    const [loading,setLoading] = useState(true)
    const [hasMore,setHasMore] = useState(true)
    const page =  useRef(2)

    const searchResults = async(query,sortBy,sortType,fullname)=>{
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/v1/videos/search?page=1&limit=6&query=${query}&sortBy=${sortBy}&sortType=${sortType}&fullName=${fullname}`)
        const output =  response.json()
        output.then((e)=>{
            if(e.data != null){
            setVideos(e.data)
            setHasMore( e.data.length == 6)
            }
            else{
                setHasMore(false)
            }
        })
        setLoading(false)
    }

    const moreSearchResults1 = async(query,sortBy,sortType,fullname)=>{
        
        const response = await fetch(`http://localhost:8000/api/v1/videos/search?page=${page.current}&limit=6&query=${query}&sortBy=${sortBy}&sortType=${sortType}&fullName=${fullname}`)
        const output =  response.json()
        output.then((e)=>{
            if(e.data != null){
            setVideos((prevVideos)=>[...prevVideos,...e.data])
            setHasMore( (e.data.length == (page.current * 6)) )
            }
            else{
                setHasMore(false)
            }
        })
        page.current += 1
    }

    const moreSearchResults =async()=>{
        const searchQueries = location.search.replace("?","").split("&")
        const query = searchQueries[0].replace("query=","").replace("%20"," ")
        const sortBy1 = searchQueries[1].replace("sortBy=","")
        const sortBy = (sortBy1 === "null") ? "" : sortBy1
        const sortType1 = searchQueries[2].replace("sortType=","")
        const sortType = (sortType1 === "ascending") ? parseInt(1) : parseInt(-1)
        const fullname = searchQueries[3].replace("fullname=","").replace("%20"," ")
        moreSearchResults1(query,sortBy,sortType,fullname)
    }

    useEffect(()=>{
        
        const searchQueries = location.search.replace("?","").split("&")
        const query = searchQueries[0].replace("query=","").replace("%20"," ")
        const sortBy1 = searchQueries[1].replace("sortBy=","")
        const sortBy = (sortBy1 === "null") ? "" : sortBy1
        const sortType1 = searchQueries[2].replace("sortType=","")
        const sortType = (sortType1 === "ascending") ? parseInt(1) : parseInt(-1)
        const fullname = searchQueries[3].replace("fullname=","").replace("%20"," ")
        searchResults(query,sortBy,sortType,fullname)
    },[location])

    return(
        <div>
            <Navbar/>
            <SidebarPopup/>
            <h2 style={{paddingLeft:'5vw',marginTop:"10vh"}}>Searched Videos</h2>
            {loading ? (
                <Spinner/>
            ) : 
         (<div className="searchVideoHolder" style={{height:'fit-content'}}>
             { (Array.isArray(videos) && (videos.length > 0)) ?
             ( 
        <InfiniteScroll 
        loadMore = {moreSearchResults}
        hasMore={hasMore}
        loader ={<div>loading...</div>}
        useWindow={true}
        //delay={500}
        //threshold={400} //load more videos when 400 px from the button
        style={{display: 'grid',
            gridTemplateColumns: 'repeat(3,auto)',
            justifyContent: 'center'}}
        >
            {
                videos.map((video,index)=>(
                    (
                        <VideoComponent key={index} video={video}/>
                    )
                ))      
            }
        </InfiniteScroll>
                         ):( <div>No Videos Found</div> )}
                          </div>)
    
        }
        </div>
    );
}

export default Search;