import { Box, TextField, Button, Typography, Collapse, Alert, IconButton } from "@mui/material"
import { blue } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate,  } from "react-router-dom";
import { useAuth } from "../ContextProvider/AuthProvider";
import { useUser } from "../ContextProvider/UserProvider";
import CloseIcon from '@mui/icons-material/Close';

export const Login = () =>{

    const auth = useAuth();
    const navigate = useNavigate();

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    const [userNameIsEmpty, setUserNameIsEmpty] = useState(false);
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false); 
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState()
    const [message, setMessage] = useState();
    const [busy, setBusy] = useState();
    const {updateUser} = useUser();

    const handleLogin = async() =>{
        setBusy(true)
        const res = await auth.login({userName, password})
        
    
        const {message, accessToken} = await res.json()
    
        if(res.ok){
            setSeverity('success')
        }
        else{
            setSeverity('warning')
        }

        setMessage(message)
        setOpen(true);
        if(accessToken){
            localStorage.setItem('jwt', accessToken)
            updateUser().then( navigate('/lobby', {replace: true}))
        }
        setBusy(false)
        
    }
    

    return(
        <Box sx={Style.container}>
            <Typography variant="h2" display="block" gutterBottom >
                Login
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

                <Button sx={Style.formItem} disabled={busy} variant="outlined" onClick={handleLogin} >Login</Button>
            </Box>
            <Typography sx={Style.caption} variant="caption" display="block" >
                Not registered? <Link to='/signUp'>Create an account</Link> | <Link to='/forgot'>Forgot Password</Link>
            </Typography>
                <Link to='/admin/login' style={Style.link}>
                    <Button variant="contained" >
                        Admin User
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
        width: 250
    },
    formItem: {
        my: 1
    },
    link:{
        color: 'white',
        textDecoration: 'none'
    },
    caption:{
        my: 1
    }
}