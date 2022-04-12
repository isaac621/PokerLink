import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"
import { useAuth } from "./components/ContextProvider/AuthProvider"


export const VisitorRoute = ({children})=>{
    const {authenticate, adminAuthenticate} = useAuth();
    const [busy, setBusy] =useState(true)
    const [isUser, setIsUser] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(()=>{
        (async ()=>{
        if(localStorage.getItem('jwt')){
            const authResult = await authenticate()
            const adminAuthResult = await adminAuthenticate()
            setIsUser(authResult)
            setIsAdmin(adminAuthResult)
            setBusy(false)
        }
        else{
            setBusy(false)
        }
    })()
}, [])
    

    return(
        <>
            {
                busy ? <CircularProgress/>
                :
                isUser ? <Navigate to='/lobby' replace/>
                    :
                    isAdmin ? <Navigate to='/admin/edit' replace/>
                        :
                        children

            }
        </>
    )
}