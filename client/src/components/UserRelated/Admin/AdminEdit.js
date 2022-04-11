import { Box, TextField,  Typography, Fab } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate,  } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { AdminSearch } from "./AdminSearch";
import { serverHost } from "../../../constant";
import { Edit } from "../Edit";
import { useAuth } from "../../ContextProvider/AuthProvider";

export const AdminEdit = () =>{

    const auth = useAuth();
    const navigate = useNavigate();

    const [id, setId] = useState();
    const [userName, setUserName] = useState();

    const [users, setUsers] = useState();
    const [open, setOpen] = useState(false);

    const search = async (data)=>{
        const res = await fetch(`${serverHost}/admin/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify(data)
            
        }).then(res=>res.json())
        setUsers(res)
    }
    
    const handleUserNameOnChange = async(e) =>{
        setUserName(e.target.value);
        search({'userName': {$regex: e.target.value, $options: 'i'}})
    }

    useEffect(()=>{
        search({'userName': {$regex: '', $options: 'i'}})
    }, [])


    const handleLogout = ()=>{
        localStorage.removeItem('jwt')
        navigate('/admin/login')
    }

    const handleUserOnClick = (id)=>{
        setId(id)
        setOpen(true)
    }

    return(
        <Box sx={Style.container}>
            
            <Box sx={Style.inputContainer}>
                <Typography variant="h2" display="block" gutterBottom >
                    Admin Edit
                </Typography>
                <Box sx={Style.formContainer}>
                    <TextField sx={Style.formItem}label="Username" onChange={handleUserNameOnChange} />
                </Box>
            </Box>
            <AdminSearch users={users} handleUserOnClick={handleUserOnClick}/>
 
            <Fab color="secondary" aria-label="add" sx={Style.logoutBtn} onClick={handleLogout}>
                    <LogoutIcon />
            </Fab>
            <Edit id={id} open={open} setOpen={setOpen} search={()=>search({'userName': {$regex: userName || '', $options: 'i'}})}/>   
        </Box>
    )
}

const Style = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    inputContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mx: 6
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    formItem: {
        my: 1
    },
    logoutBtn: {
        position: 'absolute',
        right: 40,
        top: 40
    },
}