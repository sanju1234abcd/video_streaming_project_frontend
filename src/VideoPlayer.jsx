import React, { useRef, useEffect, useState,useContext } from "react";
import {createRoot} from "react-dom/client";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import './VideoPlayer.css'
import { AiFillAlipaySquare } from "react-icons/ai";
import { MdSettings } from "react-icons/md";
import "./VideoPlayer.css";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import { useLocation } from "react-router-dom";


export const VideoPlayer = (props) => {
  const ffmpeg = new FFmpeg({
    corePath:'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
  })
  //{corePath:'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'}
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { url,videoId } = props;
  const videoUrl = useRef(null);
  const duration = useRef(0)
  var previousTime = 0;
  const playerInstance= useRef(null)
  const [quality,setQuality]  = useState('720p')
  const hasCountedView = useRef(false)
  const [watchTime,setwatchTime] = useState(0)
  videoUrl.current = url
  const location = useLocation();
  useEffect(() =>{
    
    var options = {
      controls:true,
      autoplay:true,
      playbackRates : [0.5,1,1.5,2],
      sources:{
        src:url,
        type:'video/mp4'
      }
      
    }
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      //hasCountedView.current = false
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");
      
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement,options));
      
      player.el().style.height='480px'
      player.el().style.width='100%';
      player.el().style.borderRadius = '5px'
      player.el().style.overflow='hidden'
      
      // Create a new custom button component for quality menu
const qualityMenuButton = document.createElement('button');

qualityMenuButton.className = 'vjs-quality-button'

//const qualityIcon = React.createElement(MdSettings,{size:18})
const QualityIcon = ()=>{
  return <MdSettings size={18}/>
}

createRoot(qualityMenuButton).render(<QualityIcon/>)

// Add the quality menu button to the control bar
player.controlBar.el().appendChild(qualityMenuButton);

// Create a new div element to hold the quality menu
const qualityMenuDiv = document.createElement('div');
qualityMenuDiv.className = 'vjs-quality-menu vjs-hidden';
qualityMenuDiv.innerHTML = `
  <ul>
    <li data-quality="720p">720p</li>
    <li data-quality="480p">480p</li>
    <li data-quality="360p">360p</li>
    <li data-quality="144p">144p</li>
  </ul>
`;

// Add the quality menu div to the control bar
player.controlBar.el().appendChild(qualityMenuDiv);
player.controlBar.el().style.backgroundColor='transparent'
qualityMenuButton.addEventListener('click',()=>{
  // Toggle quality menu visibility
  qualityMenuDiv.classList.toggle('vjs-hidden')
})

// Add event listeners to quality menu items
document.querySelectorAll('.vjs-quality-menu li').forEach((item) => {
  item.addEventListener('click', () => {
    // Get the selected quality
    const selectedQuality = item.getAttribute('data-quality');

    setQuality(selectedQuality)

    // Hide the quality menu
    qualityMenuDiv.classList.add('vjs-hidden');
  });
});

/*
    if(quality == '720p'){
    player.src({
      src: url,
      type:"video/mp4"
    })
  }else{
    (async()=>{
    await ffmpeg.load()
      const transcodedVideo = await ffmpeg.exec(
        '-i',
        url,
        '-c:v',
        'libx264',
        '-crf',
        '24',
        '-vf',
        `scale=${Number(quality.replace("p",""))*1.778}:${Number(quality.replace("p",""))}`,
        '-b:v',
        '500k',
        '-f',
        'mp4',
        'pipe:'
      );
    
      const blobData = ffmpeg.readFile(transcodedVideo)
      const transcodedVideoBlob = new Blob([blobData], { type: 'video/mp4' });
      const transcodedVideoUrl = URL.createObjectURL(transcodedVideoBlob);
    
      player.src({
        src: transcodedVideoUrl,
        type:'video/mp4'
      })
      console.log(transcodedVideoUrl);
    })()
  }
*/ 
    // increment view if the video is played
    player.on("play",()=>{
      if(hasCountedView.current === false){
        hasCountedView.current =  true;
        (async()=>{
          await fetch(`http://localhost:8000/api/v1/videos/views/${videoId}`,{
            method:'POST',
            credentials:'include'
          })
          const response = await fetch(`http://localhost:8000/api/v1/videos/addToWatchHistory/${videoId}`,{
            method:'POST',
            credentials:'include'
          })
        })()
      }
    })
    
  
      //to handle the infamous code 4 error in video.js
      player.on('error',function(){
        const errorDisplay = player.getChild('ErrorDisplay')
        errorDisplay.el().innerHTML = "the network is poor"
        errorDisplay.el().style.height="100%"
        errorDisplay.el().style.width="100%"
        errorDisplay.el().style.display="flex"
        errorDisplay.el().style.justifyContent="center"
        errorDisplay.el().style.alignItems="center"
        errorDisplay.el().style.fontSize="19px"
        
      })

      // You could update an existing player in the `else` block here
      // on prop change, for example:
      return () => {
        if (player && !player.isDisposed()) {
          player.dispose();
          playerRef.current = null;
          hasCountedView.current = false
        }
      };
    } 
  
  }, [url,location.pathname]);

  /*
  useEffect(()=>{
    playerInstance.current.on('loadedmetadata',()=>{
      duration.current = playerInstance.current.duration()
    })
    playerInstance.current.on('timeupdate',async()=>{
      const currentTime = playerInstance.current.currentTime()
    
      const twentyPercentMark = duration.current * 0.2
      console.log(currentTime,previousTime)
      if(currentTime > previousTime){
        setwatchTime(watchTime +(currentTime - previousTime))
      }
      console.log(watchTime)

      previousTime=currentTime;
      

      if(duration.current > 0 && watchTime >= twentyPercentMark && !hasCountedView){
        hasCountedView=true;
        (async()=>{
          const response =await fetch(`http://localhost:8000/api/v1/videos/views/${videoId}`,{
            method:'POST',
            credentials:'include'
          })
        })()
        console.log("view Counted")
      }})
  },[watchTime,hasCountedView])
  */

  return (
    <div style={{height:'fit-content',maxWidth:"100%",paddingLeft:'6vw',marginTop:'5vh'}}>
    <div
      data-vjs-player
    >
      <div ref={videoRef} />
      </div>
      </div>
  );
};

export default VideoPlayer;