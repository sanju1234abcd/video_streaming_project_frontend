import "./Home.css";
import Navbar from "./Navbar";
import Videos from "./Videos";
import SidebarPopup from "./SidebarPopup"
import { useState,useContext } from "react";
import { AppContext } from "./AppContext";

function Home(){
    
    return(
        <div className="home" >
            <SidebarPopup/>
            <Navbar/>
            <div style={{height:'10vh'}}></div>
            <Videos route=''/>
        </div>
    );
}

export default Home;