import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Videos from './Videos'
import "./ChannelPage.css"
import { AppContext } from "./AppContext";
import { ToastContainer ,toast } from "react-toastify";
import Posts from "./Posts";
const ChannelPage = ()=>{
    const searchParams = useParams();
    const {totalVideos,setSameUser,sameUser} = useContext(AppContext)
    const [avatar,setAvatar] = useState('');
    const [coverImage,setCoverImage] = useState('');
    const [fullName,setFullname] = useState('');
    const [userName,setUserName] = useState('')
    const [subscribers,setSubscribers] = useState(0);
    const [subscription,setSubscription] = useState(false)
    const [vpselector,setVpselector] =  useState('v')
    const [user,setUser] = useState(true);
    const channelId = searchParams.channelId 

    const handlesubscription=async()=>{
        const response = await fetch(`http://localhost:8000/api/v1/subscribtions/c/${channelId}`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
        },
        credentials:'include'
        })
        if(subscription == true){
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
        setSubscription(!subscription)
    }

    useEffect(()=>{
        (async()=>{
            const response = await fetch(`http://localhost:8000/api/v1/users/c/${channelId}`)
            response.json().then(async(e)=>{
                setAvatar(e.data.avatar)
                setFullname(e.data.fullname)
                setCoverImage(e.data.coverImage)
                setUserName(e.data.username)
                const subscriberCountResponse = await fetch(`http://localhost:8000/api/v1/subscribtions/u/${e.data._id}`)
                const subscriberCountOutput = subscriberCountResponse.json()
                await subscriberCountOutput.then((e)=>{
                    setSubscribers(e.data.length)
                })
                
                try{
                    const sameUserResponse = await fetch("http://localhost:8000/api/v1/users/current-user",{
                        method:'GET',
                        credentials:'include'
                    })
                    sameUserResponse.json().then((e)=>{
                        if( channelId == e.data.user._id){
                            setSameUser(true)
                        }
                    })
                }
                catch(error){
                    setSameUser(false)
                }

                try{
                    const response1 = await fetch(`http://localhost:8000/api/v1/subscribtions/s/${e.data._id}`,{
                    method:'GET',
                    credentials:'include'
                  })
                  const subscribtionoutput = await response1.json()
                  if(subscribtionoutput.data == 'subscribed'){
                    setSubscription(true)
                  }
                }
                catch(error){
                    setUser(false)
                }
            })
        })()
    },[])
    return(
        <div>
            <ToastContainer/>
            <div style={{display:'flex',flexShrink:'0',flexDirection:'column'}}>

            <div className="channel-section">
            <img src={coverImage} style={{height:'70%',width:'100%',objectFit:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}/>
            <img id="channel-section-avatar" src={avatar} alt="" />
            <h2>{fullName}</h2>
            <span id="channel-section-details-span">
                <span style={{marginTop:'1vh'}}>@{userName} &bull;
                <span style={{opacity:'0.65'}}>&nbsp;{subscribers} subscribers &bull; {totalVideos} videos</span>
                </span>
                {user && <button className='subscribtion1' onClick={handlesubscription} >{subscription ? 'unsubscribe':'subscribe'}</button> }
            </span>
            </div>
            
            <div style={{height:'8vh',display:'flex',alignItems:'flex-end',gap:'20px',paddingLeft:'15vw',borderBottom:'1px solid rgba(0,0,0,0.25)'}}>
                <button className={`vpselector ${(vpselector == 'v') ? 'bottomBorder' : ''}`} onClick={()=>{setVpselector('v')}}>Videos</button>
                <button className={`vpselector ${(vpselector == 'p') ? 'bottomBorder' : ''}`} onClick={()=>{setVpselector('p')}}>Posts</button>
            </div>
            
            { (vpselector == 'v') ?
             (<Videos route={`${channelId}`} sameUser={sameUser}/>):( <Posts route={`${channelId}`} sameUser={sameUser} /> )
            }
            
        </div>
        </div>
        
    )
}

export default ChannelPage;
