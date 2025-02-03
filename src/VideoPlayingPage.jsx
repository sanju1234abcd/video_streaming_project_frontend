import { useSearchParams,useParams, useLocation, useNavigate } from "react-router-dom";
import "./VideoPlayingPage.css";
import { useEffect, useState,useRef,useContext } from "react";
import VideoPlayer from "./VideoPlayer.jsx";
import Navbar from "./Navbar"
import Videos from "./Videos";
import InfiniteScroll from "react-infinite-scroller";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegThumbsUp,FaThumbsUp } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import SidebarPopup from "./SidebarPopup.jsx";
import Comment from "./Comment.jsx"
import { AppContext } from "./AppContext.js";
import IntoComment from "./IntoComment.jsx";

const VideoPlayingPage=()=>{
    const searchParams = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const {intoComment,setIntoComment} = useContext(AppContext)
    const [url,setUrl] = useState('')
    const [title,setTitle] = useState('')
    const [fullname,setFullname] = useState('')
    const [ownerId,setOwnerId] = useState('')
    const [views,setViews] = useState(0)
    const [likes,setLikes] = useState(0)
    const [liked,setLiked] = useState(false)
    const [timelapse,setTimelapse] = useState('')
    const [User,setuser] = useState(true)
    const [subscribtion,setSubscribtion] = useState(null)
    const [comments,setComments] = useState([])
    const [comment,setComment] = useState('')
    const [totalComments,setTotalComments] = useState([])
    const [hasMore,setHasMore] = useState(true)
    const [videoPlayerReload,setVideoPlayerReload] = useState(false)
    const [userLikedComments,setUserLikedComments] = useState([])
    const AvaTar = useRef(null)
    const page = useRef(2)
    const subscribtionCount =useRef(0)

    const getScrollParent = ()=>{return document.querySelector('.comment-section')}

    const UserLikedComments = async()=>{
      try{
      const response = await fetch('http://localhost:8000/api/v1/likes/likedComments',{
        method:'GET',
        credentials:'include'
      })
      response.json().then((e)=>{
        
        setUserLikedComments(e.data[0].comment)
      })
    }catch(error){
      console.log('liked user comments error : ',error)
    }
    }

    async function fetchVideoUrl(){
        setIntoComment({})
        const response = await fetch(`http://localhost:8000/api/v1/videos/${searchParams.videoId}`)
        const output =  response.json()
        output.then(async(e)=>{
            setUrl(e.data.videoFile)
            setTitle(e.data.title)
            setOwnerId(e.data.owner)
            setViews(e.data.views)
            setLikes(e.data.likes)

        const specificTime = new Date(e.data.createdAt.replace('Z',''))
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

          const channelProfileresponse = await fetch(`http://localhost:8000/api/v1/users/c/${e.data.owner}`)
          const channelProfile =  channelProfileresponse.json()
          await channelProfile.then((e)=>{
            setFullname(e.data.fullname)
            AvaTar.current.style.background = `url(${e.data.avatar})`
          })

          const subscriberCountResponse = await fetch(`http://localhost:8000/api/v1/subscribtions/u/${e.data.owner}`)
          const subscriberCountOutput = subscriberCountResponse.json()
          await subscriberCountOutput.then((e)=>{
            subscribtionCount.current = e.data.length
          })

          try{
          const response1 = await fetch(`http://localhost:8000/api/v1/subscribtions/s/${e.data.owner}`,{
            method:'GET',
            credentials:'include'
          })
          const subscribtionoutput = await response1.json()
          
          if(subscribtionoutput.data == 'subscribed'){
            setSubscribtion(true)
          }
          
          const likeresponse = await fetch(`http://localhost:8000/api/v1/likes/likedVideos`,{
            method:'GET',
            credentials:'include'
          })
          const likeoutput = await likeresponse.json()
          if(likeoutput.data && likeoutput.data.includes(searchParams.videoId)){
            setLiked(true)
          } }
          catch(error){
              setuser(false)
          }

          try{
          const commentResponse = await fetch(`http://localhost:8000/api/v1/comments/${searchParams.videoId}?page=1&limit=10`)
          const commentOutput = await commentResponse.json()
          setTotalComments(commentOutput.message)
          
          const commentset = []
          setHasMore(commentOutput.data[0].length == 10);
          
            for (let i = 0; i < commentOutput.data[0].length; i++) {
           
                const commmentLikeResponse = await fetch(`http://localhost:8000/api/v1/likes/c/${commentOutput.data[1][i]._id}`)
                await commmentLikeResponse.json().then((e11)=>{
                  const commentData = {
                    id : commentOutput.data[1][i]._id,
                    content : commentOutput.data[1][i].content,
                    fullname : commentOutput.data[0][i].fullname,
                    avatar : commentOutput.data[0][i].avatar,
                    owner: commentOutput.data[1][i].owner,
                    creator : (commentOutput.data[1][i].owner == e.data.owner),
                    likes : e11.data,
                    numberOfComments : commentOutput.data[2][i]
                  }
                commentset.push(commentData)
              })
                
            }
          setComments(commentset)
          }catch(err){
            console.log("comment error: ",err)
          }
        })
    }

    const handlesubscription=async()=>{
      
      const response = await fetch(`http://localhost:8000/api/v1/subscribtions/c/${ownerId}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
      },
      credentials:'include'
      })
      if(subscribtion == true){
        toast.info('channel unsubscribed(if your the owner of this channel then this will not count)',{
          position:'top-center',
          pauseOnHover:true
        })
      }else{
        toast.info('channel subscribed(if your the owner of this channel then this will not count)',{
          position:'top-center',
          pauseOnHover:true
        })
      }
      setSubscribtion(!subscribtion)
    }
    
    const likehandlar=async()=>{
      
      const response = await fetch(`http://localhost:8000/api/v1/likes/toggle/v/${searchParams.videoId}`,{
        method:'POST',
        credentials:'include'
      })
      setLiked(!liked)
      if(liked){
        setLikes(likes-1)
      }
      else{
        setLikes(likes+1)
      }
      
    }

    const loadMoreComments = async()=>{
      const response = await fetch(`http://localhost:8000/api/v1/comments/${searchParams.videoId}?page=${page.current}&limit=10`)
      const commentOutput = await response.json()
      const commentset = [];
        for (let i = 0; i < commentOutput.data[0].length; i++) {
          
            const commmentLikeResponse = await fetch(`http://localhost:8000/api/v1/likes/c/${commentOutput.data[1][i]._id}`)
            await commmentLikeResponse.json().then((e11)=>{
              const commentData = {
                id :commentOutput.data[1][i]._id,
                content : commentOutput.data[1][i].content,
                fullname : commentOutput.data[0][i].fullname,
                avatar : commentOutput.data[0][i].avatar,
                creator : (commentOutput.data[1][i].owner == ownerId),
                owner: commentOutput.data[1][i].owner,
                likes : e11.data,
                countOfComments : commentOutput.data[2][i]
              }
              commentset.push(commentData)
          })
            
        }
          setComments((prevComments)=>[...prevComments,...commentset])
          page.current +=1
          setHasMore(commentOutput.data[0].length === 10)
    }

    const addCommentHandler = async()=>{
    if(comment === ''){
      toast.error('there is no content in the comment',{
        pauseOnHover:true,
      })
    }
    else if(intoComment.id){
      await fetch(`http://localhost:8000/api/v1/comments/comment/${intoComment.id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ content: comment }),
        credentials:'include'
      })
      console.log(intoComment.id)
      setComment('')
    }
    else{
    await fetch(`http://localhost:8000/api/v1/comments/${searchParams.videoId}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
          content:comment
      }),
      credentials: 'include'
      })
      setComment('')
    }
    }

    useEffect(()=>{
      (async()=>{
        await UserLikedComments();
        await fetchVideoUrl();
        window.scrollTo(0,0);
        setVideoPlayerReload(true)
      })()
    },[location.pathname])
    

    return(
        <div>
          <ToastContainer/>
          <SidebarPopup/>
          <Navbar/>
          <div className="playing-video-section">

          <div className="video-section">
          {videoPlayerReload && (<VideoPlayer url={url} videoId = {searchParams.videoId}/> ) }
          <h4 style={{paddingLeft:'6vw',margin:"0px 0px",marginTop:'2vh',fontSize:'18px'}}>{title}</h4>
          <div className="views_and_created_section">{views} views &bull; {timelapse} ago</div>
          <div className="channel-section1">
            <div className="avatar_name" style={{height:"100%",width:'fit-content',display:'flex',alignItems:"center",gap:'10px'}}>
                <div className="avatar" title="explore this channel" ref={AvaTar} onClick={()=>{navigate(`/channel/${ownerId}`)}}></div>
                <h4 style={{fontSize:'16px'}}>{fullname}</h4>
                <span style={{fontSize:'2vh',color:'rgba(0,0,0,0.8)',textAlign:'center'}}>{subscribtionCount.current} subscribers</span>
            </div>
            { User ? 
              (<button className="subButton" onClick={handlesubscription} >{subscribtion ? "Unsubscribe":"Subscribe"}</button>)
              :
              ('')
            }
          </div>
            <div className={` ${ User ? "accessory_section":"nan"}`}>
              <div style={{backgroundColor:'rgba(0,0,0,0.2)',borderRadius:'13px',height:"25px",width:'60px',display:'flex',alignItems:'center',justifyContent:'center',gap:'5px'}}>
                {liked ? 
                (<FaThumbsUp size={19} color="black" style={{fontWeight:'100'}} onClick={likehandlar}/>)
                :
                (<FaRegThumbsUp size={19} color="black" style={{fontWeight:'100'}} onClick={likehandlar}/>)
                }
                {likes} 
              </div>
            </div>
          </div>

          
          <div className="comment-section" style={{zIndex:7}}>

            <div className="comment-writing-section">
              <h4 style={{display:'flex'}}>Comments ({totalComments})</h4>
              <input type="text" className={User? "":"nan"} placeholder={intoComment.id ? "reply to this comment":"write a comment"} value={comment} id="comment-input" onChange={(e)=>setComment(e.target.value)}/>
              <AiOutlineSend size={20} className={User? "":"nan"} color="black" id="commentSend" onClick={addCommentHandler}/>
            </div>
            {(!intoComment.id ) ? 
              ((Array.isArray(comments) && (comments.length > 0)) ? (

                <InfiniteScroll
                loadMore = {loadMoreComments}
                hasMore = {hasMore}
                loader ={<div>loading</div>}
                getScrollParent={getScrollParent}
                useWindow={false}
                threshold={50}
                >
                {
                comments.map((comment,index)=>(
                  <Comment comment={comment} userLikedComments={userLikedComments} key={index}/>
                ))
                }
                </InfiniteScroll>
              ) : ( <h3>There is no comments in this Video. Write a comment to start a conversation</h3> )
              ) :( 
              <div style={{height:'calc(22vh + 480px)',position:'relative',width:'95%'}}> 
              <IntoComment comment ={intoComment} userLikedComments = {userLikedComments} videoOwner={ownerId}/>
              </div> )
            }
            
          </div>
          
          </div>
          <h3 style={{paddingLeft:'6vw'}}>More Videos</h3>
          <Videos route=''/>
        </div>
    );
}

export default VideoPlayingPage;

