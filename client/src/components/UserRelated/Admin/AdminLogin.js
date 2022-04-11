import { Box, TextField, Button, Typography, Collapse, Alert, IconButton } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate,  } from "react-router-dom";

import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from "../../ContextProvider/AuthProvider";
import { useUser } from "../../ContextProvider/UserProvider";


export const AdminLogin = () =>{
    const {adminLogin} = useAuth();
    const navigate = useNavigate();

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    const [userNameIsEmpty, setUserNameIsEmpty] = useState(false);
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false); 

    const [error, setError] = useState();

    const {updateUser} = useUser();
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState();
    const [severity, setSeverity] = useState();
    const [loading, setLoading] = useState(false);

    const handleLogin = async() =>{
        setLoading(true);
        const res = await adminLogin({userName, password})

        if(res.ok){
            setSeverity('success')
        }
        else{
            setSeverity('warning')
        }

        const res_json = await res.json();
        const resMessage = res_json.message
        if(res_json.accessToken){
            localStorage.setItem('jwt', res_json.accessToken)
            navigate('/admin/edit', {replace: true})
            return
        }
        setMessage(resMessage)
        setOpen(true);
        setLoading(false);

        
    
        //updateUser().then( navigate('/lobby', {replace: true}))
       
        
    }
    

    return(
        <Box sx={Style.container}>
            <Typography variant="h2" display="block" gutterBottom >
                Admin Login
            </Typography>
            <Collapse in={open}>
            <Alert
                    severity={severity}
                    action={
                        severity != 'success'&&
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {message}
                </Alert>
            </Collapse>
            <Box sx={Style.formContainer}>
                <TextField sx={Style.formItem} error={userNameIsEmpty} required label="Username" onChange={(e)=>{setUserName(e.target.value)}}/>
                <TextField sx={Style.formItem} error={passwordIsEmpty} label="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                <Button sx={Style.formItem} variant="outlined" onClick={handleLogin} disabled={loading || !userName || !password} color='secondary'>Login</Button>
            </Box>
            <Link to='/login' style={Style.link}>
                    <Button variant="contained" >
                        Normal User
                    </Button>
            </Link>
        </Box>
    )
}

const Style = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    formItem: {
        my: 1
    },
    link:{
        color: 'white',
        textDecoration: 'none'
    }
}