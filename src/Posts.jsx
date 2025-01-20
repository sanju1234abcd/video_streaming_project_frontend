import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useLocation } from "react-router-dom";
import "./Posts.css";
import { ToastContainer , toast } from "react-toastify";
const Posts = (props)=>{
    const route = props.route;
    const sameUser = props.sameUser ? props.sameUser : false;
    const [posts,setPosts] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [fullName,setFullName] = useState('')
    const [avatar,setAvatar]  =  useState('')
    const [subscription,setSubscription] = useState(false)
    const page = useRef(2);
    const location= useLocation()

    const morePostLoading = async()=>{
        console.log('////')
        const postResponse = await fetch(`http://localhost:8000/api/v1/tweets/user/${route}?page=${page.current}&limit=5`)
        postResponse.json().then((e)=>{
            setPosts((prevPosts)=>[...prevPosts,...e.data])
            setHasMore(e.data.length == (page.current*5))
            page.current++;
        })
    }
    useEffect(()=>{
        (async()=>{
            const channelProfileresponse = await fetch(`http://localhost:8000/api/v1/users/c/${route}`)
             const channelProfile =  channelProfileresponse.json()
             await channelProfile.then((e1)=>{
             setFullName(e1.data.fullname)
             setAvatar(e1.data.avatar)
          })
            const postResponse =await fetch(`http://localhost:8000/api/v1/tweets/user/${route}?page=1&limit=5`)
            await postResponse.json().then((e)=>{
            setPosts(e.data)
            setHasMore(e.data.length == 5)})
        })()
    },[])
    return(
        <div className="posts"><ToastContainer/>
            <InfiniteScroll
            loadMore = {morePostLoading}
            hasMore={hasMore}
            loader ={<div>loading...</div>}
            useWindow={true}
            delay={500}
            >
                {posts.map((post,index)=>(
                    <div className="post" key={index}>
                        <div className="post-owner-section">
                            <img src={avatar} alt="" style={{height:"9vh",width:"9vh",borderRadius:'50%',backgroundPosition:'center',objectFit:'cover'}} />
                            <div className="postOwner-and-created-time-section">
                                <h3 style={{margin:"0px"}}>{fullName}</h3><span>{fullName}</span>
                            </div>
                        </div>
                        <p style={{paddingLeft:'calc( 9vh + 2vw )',marginTop:'0px'}}>{post.content}</p>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
}
export default Posts;