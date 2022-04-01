import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"
import { useAuth } from "./components/ContextProvider/AuthProvider";
import { serverHost } from "./constant";


export const AdminRoute = ({children})=>{

    const {adminAuthenticate} =useAuth();
    const [isAdmin, setIsAdmin] = useState(false)
    const [busy, setBusy] = useState(true)
    
    useEffect(async()=>{

        if(localStorage.getItem('jwt')){
            const res = await adminAuthenticate()
          
            setIsAdmin(res)
            setBusy(false)
        }
        setBusy(false)
    }, [])

    return(
        <>
            {busy ?
                <CircularProgress/>
                :
                isAdmin ?
                    children:
                    <Navigate to='/login' replace/>
            }
        </>

    )


    
}