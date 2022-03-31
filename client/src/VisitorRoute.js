import { Navigate } from "react-router-dom"
import { useAuth } from "./components/ContextProvider/AuthProvider"
import { useSocket } from "./components/ContextProvider/SocketContextProvider";

export const VisitorRoute = ({children})=>{
    const {authenticate} = useAuth();


    if(localStorage.getItem('jwt')){
        const res = authenticate()
        if(res){
            return <Navigate to='/lobby' replace/>
        }
        else{
            return children
        }

    }
    else{
        return children
    }
}