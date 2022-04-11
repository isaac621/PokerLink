import { Box, TextField, Button, Typography, Alert, IconButton, Collapse,  } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate,  } from "react-router-dom";
import { serverHost } from "../../constant";
import CloseIcon from '@mui/icons-material/Close';



export const ForgotPassword = () =>{

    const [userName, setUserName] = useState();
    const navigate = useNavigate()

    const [message, setMessage] = useState();
    const [severity, setSeverity] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleReset = async()=>{
        setLoading(true);
        const res = await fetch(`${serverHost}/auth/forgot/${userName}`)
        
        if(res.ok){
            setSeverity('success')
        }
        else{
            setSeverity('warning')
        }
        const resMessage = await res.json().then(res=>res.message)
        setMessage(resMessage)
        setOpen(true);
        setLoading(false);
    }
    

    return(
        <Box sx={Style.container}>
            <Typography variant="h2" display="block" gutterBottom >
                Forgot Password
            </Typography>
            <Collapse in={severity != 'success'}>
                <Typography variant="body" display="block" gutterBottom >
                    Please enter your username for resetting password
                </Typography>
            </Collapse>
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
            <Collapse in={severity != 'success'}>
                <Box sx={Style.formContainer}>
                    <TextField sx={Style.formItem} required label="Username" onChange={(e)=>{setUserName(e.target.value)}} type="password"/>
                    <Button sx={Style.formItem} variant="outlined" onClick={handleReset} disabled={loading || !userName} color='secondary'>Reset</Button>
                </Box>
                
            </Collapse>
            <Collapse in={severity == 'success'}>
                <Typography variant="h6">
                    Please check your mail box for resetting password
                </Typography>
            </Collapse>
            <Typography variant="caption" display="block" >
                     <Link to='/login'> Back to Login</Link>
                </Typography>
            
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
        my: 1,
        autocomplete:"nope"
    }
}