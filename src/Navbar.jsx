import { useState, useContext, useEffect, useRef } from "react";
import "./Navbar.css";
import { AppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import {AiOutlineMenu,AiOutlineFilter,AiOutlineClose} from "react-icons/ai"
import {MdSearch} from "react-icons/md"
import { toast } from "react-toastify";

function Navbar(){
    
    const {toggleminimized,setUserData} = useContext(AppContext);
    const searchQuery = useRef(null)
    const userdata = useRef(null)
    const [filterclose,setFilterclose] =  useState(true)
    const [sortBy,setSortBy] = useState('none');
    const [sortType,setSortType] = useState(null);
    const [channelName,setChannelName] = useState('')
    
    const navigate = useNavigate();

    const handleFilter = ()=>{
        const sortby  = document.getElementById('sortBy').options[document.getElementById('sortBy').selectedIndex].value
        const sorttype =  document.getElementById('sortType').options[document.getElementById('sortType').selectedIndex].value
        setSortBy(sortby)
        setSortType(sorttype)
        setFilterclose(true)
    }

    const searching = async()=>{
        if(searchQuery.current.value === ""){
            toast.warning("no query for search")
        }else{
            navigate(`/search/?query=${searchQuery.current.value}&sortBy=${sortBy}&sortType=${sortType}&fullname=${channelName}`)
        }
    }   
    
    useEffect(()=>{
        
        const cookies = document.cookie.split("; ")
        const cookieObject = {}
        cookies.forEach((cookie)=>{
            const [name,value] = cookie.split("=");
            cookieObject[name] = value
        })
        if(cookieObject.avatar){
            userdata.current.style.background = `url(${cookieObject.avatar})`
            setUserData(true)
        }
        else{
            userdata.current.style.display= "none"
            setUserData(false)
        }
        
    },[])
    
    return(
        <div className="navbar">
            <div className= {filterclose ? 'nan1':''}  style={{zIndex:'99',height:'100vh',width:'100vw',backgroundColor:'rgba(0,0,0,0.3)',position:'fixed',top:'0px',left:'0px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div className="filter-options">
                    <div className="filter-close" style={{position:'absolute',right:'4%',top:"5%"}}><AiOutlineClose size={20} color="black" onClick={()=>{setFilterclose(true);setChannelName('');setSortBy(null);setSortType(null)}}/></div>
                    <div style={{height:'20%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'10%'}}>
                        <h4>Sort By:</h4> 
                        <select name="sortBy" id="sortBy">
                            <option value="none">none</option>
                            <option value="views">views</option>
                            <option value="likes">likes</option>
                        </select>
                    </div>
                    <div style={{height:'20%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'10%'}}>
                        <h4>Sort Type:</h4> 
                        <select name="sortType" id="sortType">
                            <option value="none">none</option>
                            <option value="ascending">ascending</option>
                            <option value="descending">descending</option>
                        </select>
                    </div>
                    <div style={{height:'20%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'10%'}}>
                        <h4 title="if you dont know the exact name type somethinng similar to the channel name">Channel Name:</h4>
                        <input type="text" value={channelName} onChange={(e)=>setChannelName(e.target.value)} id="channelName" style={{height:'20%',width:'50%',margin:'auto 0'}}/>
                    </div>
                    <button className="apply-filter-button" onClick={handleFilter}>Apply Filter</button>
                </div>
            </div>
            <AiOutlineMenu size={24} color="#000" className="sidebar_logo" onClick={toggleminimized}/>
            <div style={{height:'80%',width:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="search">
                <input ref={searchQuery} placeholder="search here" type="text" name="search" id="search"/>
                <button onClick={searching}><MdSearch size={24} color="#000"/></button>
            </div>
            <AiOutlineFilter title="filter" style={{height:'5vh',width:'3vw',color:'black'}} onClick={()=> setFilterclose(false)} />
            </div>
            <div className="user_details" title="Your Activity" ref={userdata} onClick={()=>{navigate('/activity')}}></div>
        </div>
    );
}

export default Navbar;