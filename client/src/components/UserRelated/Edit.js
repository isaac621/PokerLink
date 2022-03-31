import { Box, TextField, Button, Typography, Alert, IconButton, Collapse,  } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate,  } from "react-router-dom";
import { serverHost } from "../../constant";
import CloseIcon from '@mui/icons-material/Close';
import Resizer from 'react-image-file-resizer'


export const Edit = () =>{

    const [file, setFile] = useState();
    const [username, setUsername] = useState();
    const [avatar, setAvatar] = useState()
    const navigate = useNavigate()

    const [message, setMessage] = useState();
    const [severity, setSeverity] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const resizeFile = (file) =>{
        return new Promise((resolve)=>{
            Resizer.imageFileResizer(
                file,
                300,
                300,
                "png",
                100,
                0,
                (uri)=>{
                    resolve(uri);
                },
                "file"
            )
        })
    }
   

    const handleUpload = async()=>{
        console.log('sent')
        setLoading(true);
        const formData = new FormData();
        
        formData.append('avatar',file)
        const res = await fetch(`${serverHost}/upload/avatar`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: formData
        })
        
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

    const handleFileUpload = async (e)=>{
        const image = await resizeFile(e.target.files[0])
        console.log(image)
        setFile(image)
    }

    useEffect(async()=>{
        const res = await fetch(`${serverHost}/users/avatar`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
        }).then(res=>res.blob()).then(res=>URL.createObjectURL(res))
        setAvatar(res)

    })

    return(
        <Box sx={Style.container}>
            <Typography variant="h2" display="block" gutterBottom >
                Edit
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
                <img src={avatar} alt="avatar"/>
                <Box sx={Style.formContainer}>
                    <label htmlFor="avatar">
                            <input accept="image/*" style={{display: 'none'}} onChange={handleFileUpload} id="avatar"  type="file" />
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                            <Typography variant="body">
                                {file && file.name}
                            </Typography>
                    </label>
                    <Button sx={Style.formItem} variant="outlined" onClick={handleUpload}>Done</Button>
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