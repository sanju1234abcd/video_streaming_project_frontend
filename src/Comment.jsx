import { useEffect, useState } from "react";
import { FaRegThumbsUp,FaThumbsUp } from "react-icons/fa";
import "./Comment.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Comment = (props)=>{
    const comment = props.comment
    const userLikedComments = props.userLikedComments
    const [commentLikedByUser,setCommentLikedByUser] = useState(false);
    const [likes,setLikes] = useState(0);
    const navigate =  useNavigate();
    const commentLikeHandler = async(comment)=>{
      try{
        const commentLikeResponse = await fetch(`http://localhost:8000/api/v1/likes/toggle/c/${comment.id}`,{
          method:'POST',
          credentials:'include'
        })
        await commentLikeResponse.json().then((e)=>{
          setLikes(commentLikedByUser ? (likes - 1):(likes + 1))
          setCommentLikedByUser(!commentLikedByUser)
        })
      }
      catch(error){
        toast.warning("you are not logged in so you cant like")
      }
    }

    useEffect(()=>{
        setLikes(comment.likes)
        setCommentLikedByUser((Array.isArray(userLikedComments) && (userLikedComments.includes(comment.id))))
    },[])
    return(
        <div>
           <ToastContainer/>
            <div className="comment">
                  <div className="comment-owner-section">
                    <img src={comment.avatar} alt="" title="explore this channel" onClick={(event)=>{event.stopPropagation();navigate(`/channel/${comment.owner}`)}}/>
                    <span style={{fontSize:'2.1vh',color:'rgba(0,0,0,0.75)'}}>{comment.fullname}{comment.creator ? ( <span style={{padding:'0 0.5vw',marginLeft:'0.2vw',borderRadius:'10px',backgroundColor:'rgba(0,0,0,0.4)',fontWeight:'650'}}>creator</span> ):('') }</span>
                  </div>
                  <p style={{paddingLeft:`calc(30px + 0.1vh)`}}>{comment.content}</p>
                  <div style={{height:'fit-content',width:'fit-content',paddingLeft:'2vw',display:'flex',alignItems:'center',gap:'5px'}} >
                  { commentLikedByUser ? 
                  (<FaThumbsUp size={20} color="black" onClick={()=>{commentLikeHandler(comment)}}/>)
                   : 
                  (<FaRegThumbsUp size={20} color="black" onClick={()=>{commentLikeHandler(comment)}}/>)
                  }
                  {likes}
                  </div>
                </div>
        </div>
    );
}

export default Comment;