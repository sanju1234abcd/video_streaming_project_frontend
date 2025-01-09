import { useEffect, useState } from "react";
import { FaRegThumbsUp,FaThumbsUp } from "react-icons/fa";
import "./Comment.css";
import { useNavigate } from "react-router-dom";

const Comment = (props)=>{
    const comment = props.comment
    const userLikedComments = props.userLikedComments
    const [commentLikedByUser,setCommentLikedByUser] = useState(false);
    const [likes,setLikes] = useState(0);
    const navigate =  useNavigate();
    const commentLikeHandler = async(comment)=>{
        await fetch(`http://localhost:8000/api/v1/likes/toggle/c/${comment.id}`,{
          method:'POST',
          credentials:'include'
        })
        setLikes(commentLikedByUser ? (likes - 1):(likes + 1))
        setCommentLikedByUser(!commentLikedByUser)
    }

    useEffect(()=>{
        setLikes(comment.likes)
        setCommentLikedByUser((Array.isArray(userLikedComments) && (userLikedComments.includes(comment.id))))
    },[])
    return(
        <div>
            <div className="comment">
                  <div className="comment-owner-section">
                    <img src={comment.avatar} alt="" title="explore this channel" onClick={(event)=>{event.stopPropagation();navigate(`/channel/${comment.id}`)}}/>
                    <span style={{fontSize:'2.1vh',color:'rgba(0,0,0,0.75)'}}>{comment.fullname}</span>
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