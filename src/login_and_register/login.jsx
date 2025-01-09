import React, { useContext, useEffect, useState } from 'react';
import './login.css';
import { AppContext } from '../AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [username,setUsername] = useState('')
  const navigate = useNavigate();
  const location = useLocation()
  const handleSubmit = async(e) => {
    e.preventDefault();
    const error = {};
    if (username === '') {
        error.username = 'username is required';
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

    if (Object.keys(error).length > 0) {
      setErrors(error);
    } else {
      // API call to authenticate user
      const response = await fetch("http://localhost:8000/api/v1/users/login",{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
      },
        body: JSON.stringify({
            username,password,email
        })
        })
      const output = await response.json()
      const expirationTime = new Date(Date.now() + 1*24*60*60*1000);
      const expirationString = expirationTime.toUTCString()
      document.cookie = `accessToken=${output.data.accessToken};expires=${expirationString};path=/;sameSite=Lax;Secure`;
      document.cookie = `avatar=${output.data.user.avatar};expires=${expirationString};path=/;sameSite=Lax;Secure`;
      navigate('/')
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>


      <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            placeholder='enter username'
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder='enter email'
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder='enter password'
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;