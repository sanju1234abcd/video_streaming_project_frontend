import './App.css';
import { Routes,Route } from 'react-router-dom';
import Home from "./Home";
import Register from './login_and_register/Register';
import Login from './login_and_register/login';
import UserProfileDashboard from './UserDashboard';
import VideoPlayingPage from './VideoPlayingPage';
import Search from './Search';
import Activity from './Activity';
import ChannelPage from './ChannelPage';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/register' element={<Register/>} ></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/dashboard' element={<UserProfileDashboard/>}></Route>
        <Route path='/videoPlayer/:videoId' element={<VideoPlayingPage/>}></Route>
        <Route path='/search' element={<Search/>}></Route>
        <Route path='/activity' element={<Activity/>}></Route>
        <Route path='/channel/:channelId' element={<ChannelPage/>}></Route>
        
      </Routes>
    </div>
  );
}

export default App;
