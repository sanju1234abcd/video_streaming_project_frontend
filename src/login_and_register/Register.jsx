import React, { useState } from 'react';
import "./Register.css";
import {useNavigate} from "react-router-dom"

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullname,setFullname] = useState('');
  const [avatar,setAvatar] = useState(null);
  const [coverImage,setCoverImage] =  useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successmeassage,setSuccessmessage] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const error = {};
    setSuccessmessage('')
    if (fullname === '') {
        error.fullname = 'Fullname is required';
      }

    if (username === '') {
      error.username = 'Username is required';
    }

    if (email === '') {
      error.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      error.email = 'Invalid email address';
    }

    if (password === '') {
      error.password = 'Password is required';
    } else if (password.length < 8) {
      error.password = 'Password must be at least 8 characters';
    }

    if (confirmPassword === '') {
      error.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      error.confirmPassword = 'Passwords do not match';
    }

    if(!avatar){
        error.avatar = "Avatar is required"
    }else if(!avatar.type.match('image.')){
        error.avatar = "Only images are allowed for avatar"
    }

    if( coverImage && (!coverImage.type.match('image.'))){
        error.coverImage = "Only images are allowed for Cover Image"
    }

    if (Object.keys(error).length > 0) {
      setErrors(error);
    } else {
      try{
      const formData = new FormData();
      formData.append("fullname",fullname)
      formData.append("username",username)
      formData.append("email",email)
      formData.append("password",password)
      formData.append("avatar",avatar)
      formData.append("coverImage",coverImage)

        const response = await fetch('http://localhost:8000/api/v1/users/register',{
            method:'POST',
            body:formData
        })
        const output = await response.json()
        if(output.statusCode == 200){
          setSuccessmessage(`${output.message}`)
          navigate('/')
        }
      }
        catch(err){
          console.log("error while registering user: ",err)
        }

          }
  };

  return (
    <div className="register">
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>

      <div className="form-group">
          <label>Fullname:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Enter fullname"
          />
          {errors.fullname && <div className="error">{errors.fullname}</div>}
        </div>

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>

        <div className="form-group">
          <label style={{color:'black'}}>Avatar:</label>
          <input
            type="file" accept='image/'
            onChange={ (e)=>{setAvatar(e.target.files[0])}}
          />
          {errors.avatar && <div className="error">{errors.avatar}</div>}
        </div>

        <div className="form-group">
          <label style={{color:'black'}}>Cover Image:</label>
          <input
            type="file" accept='image/'
            onChange={ (e)=>{setCoverImage(e.target.files[0])}}
          />
          {errors.coverImage && <div className="error">{errors.coverImage}</div>}
        </div>

        <button type="submit">Register</button>
      </form>
      <h3>{successmeassage}</h3>
    </div></div>
  );
}

export default Register;