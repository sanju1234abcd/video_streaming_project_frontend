import "./UserDashboard.css"
import { AiOutlineArrowLeft, AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AiOutlineClose } from "react-icons/ai";

function UserProfileDashboard(){
  const [user,setUser] = useState({
    fullname1:"",avatar:"",email1:""
  })
  const [posts, setPosts] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [subscribed, setSubscribed] = useState(0);
  const [update,setUpdate] =  useState('')
  const [edit,setEdit]  = useState(false)
  const [userId,setUserId] = useState('')
  const [fullName,setFullName] = useState("")
  const [Email,setEmail] = useState("")
  const [errorEmail,setErrorEmail]  = useState('')
  const [oldpassword,setOldPassword] = useState('')
  const [newpassword,setNewPassword] = useState('')
  const [errorold,setErrorold] = useState('')
  const [errornew,setErrornew] = useState('')
  const [passwordChange,setPasswordChange] = useState(false)

  const navigate = useNavigate();

  async function fetchUserdata(){
    const response = await fetch("http://localhost:8000/api/v1/users/current-user",{
        method:'GET',
        credentials:'include'
    })
    const output = response.json();
    output.then(async(e)=>{
        setUserId(e.data.user._id)
        const channelProfileresponse = await fetch(`http://localhost:8000/api/v1/users/c/${e.data.user._id}`)
        const channelProfile =  channelProfileresponse.json()

        const subscriberCount = await fetch(`http://localhost:8000/api/v1/subscribtions/u/${e.data.user._id}`,{
          method:'GET',
          credentials:'include'
        })
        const subscriberCountOutput = subscriberCount.json()
        subscriberCountOutput.then((ee)=>{
          setSubscribers(ee.data.length)
        })

        const subscribedToCount = await fetch(`http://localhost:8000/api/v1/subscribtions/c/${e.data.user._id}`,{
          method:'GET',
          credentials:'include'
        })
        const subscribedToCountOutput = subscribedToCount.json()
        subscribedToCountOutput.then((ee1)=>{
          setSubscribed(ee1.data.length)
        })

        const tweetsresponse = await  fetch(`http://localhost:8000/api/v1/tweets/user/${e.data.user._id}`)
        const tweets = tweetsresponse.json()
        await channelProfile.then((e)=>{
            setUser({fullname1:e.data.fullname,email1:e.data.email,avatar:e.data.avatar})
            setFullName(e.data.fullname)
            setEmail(e.data.email)
        })
        await tweets.then((e)=>{
            setPosts(e.data.length)
        })
    })
  };

  const handleEditProfile = async() => {
    // Edit profile logic
    if(edit ==  false){
    setEdit(!edit)
    }
    else{
    if (Email === '') {
      setErrorEmail('Email is required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(Email)) {
         setErrorEmail('Invalid email address');
    }
    else{
        setEdit(!edit)
        setErrorEmail('');
        (async()=>{
            const response = await fetch("http://localhost:8000/api/v1/users/update",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                  body: JSON.stringify({
                      fullname:fullName,email:Email
                  }),
                credentials:'include'
            })
            const output = response.json()
            output.then(async(e)=>{
                await fetchUserdata()
            })
        })()
    }
    }   
  };

  const handleChangePassword = () => {
    // Change password logic
    if(passwordChange == false){
      setPasswordChange(!passwordChange)
    }
    else{
      setUpdate('')
      if (oldpassword === '') {
        setErrorold('Password is required');
      } else if (oldpassword.length < 8) {
        setErrorold('Password must be at least 8 characters');
      }else if (newpassword === '') {
        setErrornew('Password is required');
      } else if (newpassword.length < 8) {
        setErrornew('Password must be at least 8 characters');
      }
      else{
        setErrorold('');setErrornew('');
        (async()=>{
        const response = await fetch("http://localhost:8000/api/v1/users/change-password",{
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
            body: JSON.stringify({
                oldpassword,newpassword
            }),
          credentials:'include'
      })
      if(response.status == 400){
        setErrorold('old password is not correct')
      }else{
      const output = await response.json()
      setPasswordChange(!passwordChange)
      setOldPassword('');setNewPassword('')
      setUpdate('password updated successfully')
      setTimeout(() => {
        setUpdate('')
      }, 5000);
      }
    })()
      }
    }
  };
  const handlelogout =()=>{
    const ty=0;
    (async()=>{
      const response = await fetch("http://localhost:8000/api/v1/users/logout",{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
      },
      credentials:'include'
      })
    })()
    navigate('/')
  }
  const handleDeleteAccount = () => {
    // Delete account logic
    (async()=>{
      const response =  await fetch("http://localhost:8000/api/v1/users/delete",{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        credentials:'include'
      })
      navigate('/')
    })()
  };

  useEffect(() => {
    
    (async()=>{
         await fetchUserdata();
    })()
  }, []);

  return (
    <div className="dashboard-container">
      <div className="logout_and_back_container">
        <AiOutlineArrowLeft size={24} onClick={()=>{navigate(-1)}} color="white"/>
          <button className="dashboard-button b" onClick={handlelogout}>Logout<AiOutlineLogout size={22} color="#f44336"/></button>
        </div>
          <div className={passwordChange ? 'change_password_cover':"no_change_password_cover"}>
          <div className={passwordChange ? 'change_password':"no_change_password"}>
            <div className="password_close_button"><AiOutlineClose size={24} color="#fff" onClick={()=>{setPasswordChange(!passwordChange)}}/></div>
            <h2>change password:</h2>
            <div className="setPassword">
              <label htmlFor="oldpassword">Old Password:</label>
            <input type="password" value ={oldpassword} onChange={(e)=>{setOldPassword(e.target.value)}}id="oldpassword" />
            {<div className="error">{errorold}</div>}
            <label htmlFor="newpassword">New Password:</label>
            <input type="password" value ={newpassword} onChange={(e)=>{setNewPassword(e.target.value)}} id="newpassword"/>
            {<div className="error">{errornew}</div>}
        <button className="setPassword-button" onClick={handleChangePassword}>Change Password</button>
            </div>
          </div></div>
      <header className="dashboard-header">
        <h1 className="dashboard-title">Your Profile</h1>
        <button className="dashboard-button" onClick={handleEditProfile}>
          {edit ? "Save Profile":"Edit Profile"}
        </button>
      </header>
      <h3 className="update">{update}</h3>
      <section className="dashboard-profile">
       <img src={user.avatar} alt="Profile Picture" />
        <span style={{color:'white',fontSize:'2.6vh',cursor:'pointer'}} onClick={()=>{navigate(`/channel/${userId}`)}}>visit your channel</span>
        {edit? <input value ={fullName} onChange={(e)=>{setFullName(e.target.value)}} /> :  <h2>{user.fullname1}</h2>}
        {edit? <div>
        <input value ={Email} onChange={(e)=>{setEmail(e.target.value)}} />
        {<div className="error">{errorEmail}</div>}
        </div>
        :  <p>{user.email1}</p>}
      </section>
      <section className="dashboard-stats">
        <h3>Account Stats</h3>
        <ul>
          <li>Posts: {posts}</li>
          <li>subscribers: {subscribers}</li>
          <li>channelSubscribedTo: {subscribed}</li>
        </ul>
      </section>
      <section className="dashboard-actions">
        <button className="dashboard-button" onClick={handleChangePassword}>
           Change Password
        </button>
        <button className="dashboard-button" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </section>
    </div>
  );
}

export default UserProfileDashboard;

