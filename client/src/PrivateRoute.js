import { Navigate } from "react-router-dom"
import { useAuth } from "./components/ContextProvider/AuthProvider";
import { useSocket } from "./components/ContextProvider/SocketContextProvider";
import { serverHost } from "./constant";

export const PrivateRoute = ({children})=>{

    const {authenticate} =useAuth();
    const {updateSocketID} = useSocket();

    if(localStorage.getItem('jwt')){
        
        const res = authenticate();

        if(res){
            updateSocketID()
            return children
        }
        else{
            return <Navigate to='/login' replace/>
        }

    }
    else{
        return <Navigate to='/login' replace/>
    }
    
}