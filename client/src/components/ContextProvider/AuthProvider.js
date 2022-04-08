import { createContext, useContext, useEffect, useState } from "react"
import { serverHost } from "../../constant";


const AuthContext = createContext();

const AuthProvider = ({children})=>{



    const [user, setUser] = useState()

    const authenticate = async()=>{
        const res = await fetch(`${serverHost}/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            
        }).then(res=>res.ok)
        
        return res
    }

    const adminAuthenticate = async()=>{
        const res = await fetch(`${serverHost}/admin/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            
        }).then(res=>res.ok)
        
        return res
    }

    const login = async (data)=>{
        const response = await fetch(`${serverHost}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err=>console.log(err))
        return response
    }

    const adminLogin = async (data)=>{
        const response = await fetch(`${serverHost}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err=>console.log(err))
        return response
    }

    const signUp = async (data)=>{
        return  await fetch(`${serverHost}/signUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err=>console.log(err))
        
    }

    const value ={
        login, signUp, authenticate, adminLogin, adminAuthenticate
    }
    

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export function useAuth(){
    return useContext(AuthContext)
}