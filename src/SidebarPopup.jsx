import { AppContext } from "./AppContext";
import "./SidebarPopup.css";
import { useContext, useEffect, useState } from "react";
import {AiOutlineMenu,AiFillHome,AiOutlineDashboard} from "react-icons/ai";
import { MdHowToReg , MdLogin ,MdDashboard} from "react-icons/md";
import {NavLink} from "react-router-dom"

function SidebarPopup() {

    const {isminimized,toggleminimized,userData} = useContext(AppContext);
    
    return( 
        <div className={`sidebar ${isminimized ? 'minimized':''}`} >
            <div><AiOutlineMenu size={24} color="#000" onClick={toggleminimized} className={`toggle ${isminimized? 'nan':''}`}/></div>
            <ul className={`ul1 ${isminimized ? 'nan':''}`}>

                <li ><NavLink to={"/"} id="home" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'3%',color:'inherit',width:'96%',paddingLeft:'4%'}}><AiFillHome size={20} color="inherit"/> Home</NavLink></li>
                <li ><NavLink to={"/register"} id="register" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'3%',color:'inherit',width:'96%',paddingLeft:'4%'}} ><MdHowToReg size={20} color="inherit"/> register</NavLink></li>
                <li><NavLink to={"/login"} id="login" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'3%',color:'inherit',width:'96%',paddingLeft:'4%'}}><MdLogin size={20} color="inherit"/> login</NavLink></li>
                {userData && <li><NavLink to={"/dashboard"} id="login" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'3%',color:'inherit',width:'96%',paddingLeft:'4%'}}><MdDashboard size={20} color="inherit"/> Dashboard</NavLink></li>}            
            </ul>
        </div>
    );
}

export default SidebarPopup;