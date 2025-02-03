import React, { useContext, useEffect, useRef, useState } from "react";
import Comment from "./Comment";
import "./IntoComment.css"
import InfiniteScroll from "react-infinite-scroller";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AppContext } from "./AppContext";
const IntoComment = (props)=>{
    const {setIntoComment} = useContext(AppContext)
    const ownerId = props.videoOwner
    const comment =  props.comment
    const userLikedComments = props.userLikedComments
    const [hasMore,setHasMore] = useState(true)
    const [commentComments,setCommentComments] = useState([])
    const page = useRef(2)

    const getScrollParent = ()=>{return document.querySelector('.intoComment')}

    const commentFetcher = async()=>{
        const branchcommentsResponse = await fetch(`http://localhost:8000/api/v1/comments/comment/${comment.id}?page=1&limit=10`)
        await branchcommentsResponse.json().then(async(e)=>{
            const comments = []

            for (let i = 0; i < e.data.comments.length; i++) {
                const commmentLikeResponse = await fetch(`http://localhost:8000/api/v1/likes/c/${e.data.comments[i]._id}`)
                await commmentLikeResponse.json().then((e11)=>{
                  const commentData = {
                    id : e.data.comments[i]._id,
                    content : e.data.comments[i].content,
                    fullname : e.data.commentOwners[i]._id[0].fullname,
                    avatar : e.data.commentOwners[i]._id[0].avatar,
                    owner: e.data.comments[i].owner,
                    creator : (e.data.comments[i].owner == ownerId),
                    likes : e11.data
                  }
                comments.push(commentData)
              })
                
            }
            setCommentComments(comments)
            setHasMore(e.data.comments.length == 10)
        })
    }

    const moreCommentFetcher = async()=>{
        const moreBranchcommentsResponse = await fetch(`http://localhost:8000/api/v1/comments/comment/${comment.id}?page=${page.current}&limit=10`)
        await moreBranchcommentsResponse.json().then(async(e)=>{
            const comments = []

            for (let i = 0; i < e.data.comments.length; i++) {
                const commmentLikeResponse = await fetch(`http://localhost:8000/api/v1/likes/c/${e.data.comments[i]._id}`)
                await commmentLikeResponse.json().then((e11)=>{
                  const commentData = {
                    id : e.data.comments[i]._id,
                    content : e.data.comments[i].content,
                    fullname : e.data.commentOwners[i]._id[0].fullname,
                    avatar : e.data.commentOwners[i]._id[0].avatar,
                    owner: e.data.comments[i].owner,
                    creator : (e.data.comments[i].owner == ownerId),
                    likes : e11.data
                  }
                comments.push(commentData)
              })
                
            }
            setCommentComments((prevCommentCommments)=>[...prevCommentCommments,...comments])
            setHasMore(e.data.comments.length == 10)
        })
    }
    useEffect(()=>{
        (async()=>{
            await commentFetcher();
        })()
    },[])
    return(
        <div className="intoComment">
            <AiOutlineArrowLeft size={20} color="black" style={{position:'sticky',zIndex:99,top:'10px',left:'0.5vw'}} onClick={(event)=>{event.stopPropagation();setIntoComment({})}}/>
            <div className="main-comment">
            <Comment comment={comment} userLikedComments={userLikedComments}/>
            </div>
                {(Array.isArray(commentComments) && (commentComments.length > 0)) ?(
                    <InfiniteScroll
                     hasMore={hasMore}
                     loadMore={moreCommentFetcher}
                     getScrollParent={getScrollParent}
                     loader={<div>loading</div>}
                     useWindow={false}
                     threshold={30}
                    >
                        {commentComments.map((comment,index)=>(
                            <Comment comment= {comment} userLikedComments = {userLikedComments} key={index}/>
                        ))}
                    </InfiniteScroll>
                ):( <div> write a comment to reply to  this comment</div> )}
        </div>
    );
}

export default IntoComment;