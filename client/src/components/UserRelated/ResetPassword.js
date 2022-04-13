import { Box, TextField, Button, Typography, Alert, IconButton, Collapse,  } from "@mui/material"
import { useState } from "react"
import { useNavigate,  } from "react-router-dom";
import { serverHost } from "../../constant";
import CloseIcon from '@mui/icons-material/Close';



export const ResetPassword = () =>{

    const [forgotCode, setForgotCode] = useState();
    const [newPassword, setNewPassword] = useState();
    const navigate = useNavigate()

    const [message, setMessage] = useState();
    const [severity, setSeverity] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleReset = async()=>{
        setLoading(true);
        const res = await fetch(`${serverHost}/auth/reset`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                password: newPassword,
                forgotCode: forgotCode
            })
            

        })
        
        if(res.ok){
            setSeverity('success')
            setTimeout(()=>navigate('/login'), 3000)
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
                Reset Password
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
            <Collapse in={severity != 'success'}>
                <Box sx={Style.formContainer}>
                    <TextField sx={Style.formItem} required label="ForgotCode" onChange={(e)=>{setForgotCode(e.target.value)}} />
                    <TextField sx={Style.formItem} required label="New Password" onChange={(e)=>{setNewPassword(e.target.value)}} />
                    <Button sx={Style.formItem} variant="outlined" onClick={handleReset} disabled={loading || !forgotCode || !newPassword} color='secondary'>Reset</Button>
                </Box>
                
            </Collapse>
            <Collapse in={severity == 'success'}>
                <Typography variant="h6">
                    You are directing to the login page....
                </Typography>
            </Collapse>            
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