import { CircularProgress } from "@mui/material";
import { useContext, createContext, useState, useEffect} from "react";
import io from 'socket.io-client';
import { serverHost } from "../../constant";

const SocketContext = createContext()

const SocketContextProvider = ({children}) =>{
    const [socket, setSocket] = useState();


    async function updateSocketID(){
        if(socket){
            await new Promise((res,rej)=>{
                setTimeout(()=>res(), 200)
            })

            await fetch(`${serverHost}/update/socketID`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body:JSON.stringify({
                    socketID: socket.id
                })
                
            })

            
        
        }
    }
    useEffect(()=>{
        const socket = io('http://localhost:3001')
        socket.on("connect", ()=>setSocket(socket))
    }, [])

    useEffect(updateSocketID,[socket])

    

    const value = {socket, updateSocketID}

    return(
        <SocketContext.Provider value={value}>
            {socket  ? children : <CircularProgress/>}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider

export function useSocket(){
    return useContext(SocketContext)
}