import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./components/ContextProvider/AuthProvider";
import { useGameContext } from "./components/ContextProvider/GameContextProvider";
import { useSocket } from "./components/ContextProvider/SocketContextProvider";
import { useUser } from "./components/ContextProvider/UserProvider";
import { serverHost } from "./constant";

export const PrivateRoute = ({children})=>{

    const {authenticate} =useAuth();
    const {updateSocketID} = useSocket();
    const {avatar, updateUser} = useUser();
    const [busy, setBusy] = useState(true);
    const [isUser, setIsUser] = useState(false);
    const [path, setPath] = useState();
    const {pathname} = useLocation()
    const {end} = useGameContext()

    useEffect(async ()=>{
       
       
        if(localStorage.getItem('jwt')){
            const authResult = await authenticate()
            const path = await fetch(`${serverHost}/game/gameState`,{
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },

            }).then(res=>res.json()).then(res=>res.path).catch(err=>false)
            setIsUser(authResult)
            if(!avatar){
                updateUser()
            }
            if(path){
               setPath(path)

            }
            setBusy(false)
        }
        else{
            setBusy(false)
        }
       
        
    })



    return(
        <>
            {(busy)?<CircularProgress/>
                :
                isUser ? (()=>{
                    updateSocketID()
                    
                    return path == pathname || end ? children : <Navigate to={path} replace/>})()
                    : <Navigate to='/login' replace/>}
        </>
    )

}