import { createContext, useContext, useEffect, useState } from "react"
import { serverHost } from "../../constant";

const UserContext = createContext()

const UserProvider = ({children})=>{

    const [avatar, setAvatar] = useState();
    const [id, setId] = useState('');
    const [userName, setUserName] = useState('');
    

    const updateUser = async()=>{
        const user = await fetch(`${serverHost}/users/info`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
        }).then(res=>res.json())
        setUserName(user.userName)
        setId(user._id)
        const avatar = await fetch(`${serverHost}/users/avatar`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
        }).then(res=>res.blob()).then(res=>URL.createObjectURL(res))
        setAvatar(avatar)
    }

    
    const value = {avatar, userName, id, updateUser, }

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider

export function useUser(){
    return useContext(UserContext)
}