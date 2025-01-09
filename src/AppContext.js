import { createContext, useState } from "react";

export const AppContext = createContext();

function AppContextProvider({children}){
    const [userData,setUserData] = useState(false)
    const [sameUser,setSameUser] = useState(false)
    const [isminimized,setIsminimized] = useState(true);
    const [totalVideos,setTotalVideos] = useState(0)
    const toggleminimized=()=>{
        setIsminimized(!isminimized)
    }

    const fetchData = async()=>{
        const baseUrl = ''
    }


    
const value={isminimized,setIsminimized,toggleminimized,userData,setUserData,totalVideos,setTotalVideos,sameUser,setSameUser};

return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider;