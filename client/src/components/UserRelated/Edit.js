import { Box, Card, Button, Typography, Alert, IconButton, Collapse,  Modal, TextField, CircularProgress, Checkbox} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { serverHost } from "../../constant";
import CloseIcon from '@mui/icons-material/Close';
import Resizer from 'react-image-file-resizer'
import { grey } from "@mui/material/colors";



export const Edit = ({open, setOpen, id, search}) =>{
    const newPasswordInput = useRef();
    const [busy, setBusy] = useState(false)
    const [file, setFile] = useState();
    const [user, setUser] = useState({})
    const [message, setMessage] = useState();
    const [severity, setSeverity] = useState();
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [avatar, setAvatar] = useState();

    const [newPassword, setNewPassword] = useState();
    const handleModalClose = ()=>{
        setOpen(false)
    }
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
    const update = async()=>{
        setBusy(true)
        const res = await fetch(`${serverHost}/admin/getUser/${id}`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
        }).then(res=>res.json())
        const avatar = await fetch(`${serverHost}/admin/getUser/avatar/${id}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
        }).then(res=>res.blob()).then(res=>URL.createObjectURL(res))
        setAvatar(avatar)

        setUser(res)
        setBusy(false)
    }

    useEffect(async()=>{
        setFile()
        setSeverity()
        setMessage()
        setAlertOpen()
        if(id){
            update()
        }
        
    }, [open])
   
    const handleResetPassword = async ()=>{

        const res = await fetch(`${serverHost}/admin/resetPassword/${id}`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                password: newPassword
            })
        })
        
        if(res.ok){
            setSeverity('success')
        }
        else{
            setSeverity('warning')
        }
        const resMessage = await res.json().then(res=>res.message)
        newPasswordInput.current.value = ""
        setMessage(resMessage)
        setAlertOpen(true);
        setLoading(false);
    }
    const handleUpload = async()=>{
        console.log('sent')
        setLoading(true);
        const formData = new FormData();
        console.log(user)
        if(file){
            formData.append('avatar',file)
        }
        formData.append('userName', user.userName)
        formData.append('isVerified', user.isVerified)
        formData.append('_id', user._id)
       
        const res = await fetch(`${serverHost}/admin/update/user`, {
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
        setAlertOpen(true);
        setLoading(false);
        setFile()
        search()
        update()
    }

    const handleFileUpload = async (e)=>{
        const image = await resizeFile(e.target.files[0])
        console.log(image)
        setFile(image)
    }



    return(
        <Modal
        open={open}
        onClose={handleModalClose}
        sx={Style.modal}
        >

        <Card variant="outlined" sx={Style.container}>
            {busy ? <CircularProgress/>:
            <>
            <Typography variant="h4" display="block" gutterBottom >
                User Profile
            </Typography>
            
            <Collapse in={alertOpen}>
            <Alert
                    severity={severity}
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setAlertOpen(false);
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
                    
                    <img src={avatar} style= {Style.avatar} alt='avatar'/>
                    <TextField 
                        disabled
                        label="ID"
                        defaultValue={user._id} 
                        sx={Style.textField}
                       />
                    <Box sx={{bgcolor: grey[800], py: 1, px:1, borderRaidus: 1}}>       
                        <TextField 
                            label="Username"
                            defaultValue={user.userName} 
                            sx={Style.textField}
                            onChange={(e)=>{
                                setUser(prev=>{
                                    return {...prev, userName:e.target.value}})}}/>
                    </Box>
                    <TextField 
                        label="Email"
                        disabled
                        defaultValue={user.email} 
                        sx={Style.textField}
                        onChange={(e)=>{
                            setUser(prev=>{
                                return {...prev, email:e.target.value}})}}/>
                    <Box sx={Style.inputsContainer}>
                                <Typography>
                                    IsVerified:
                                </Typography>
                    <Checkbox
                        checked={user.isVerified}
                        onChange={(e)=>{
                            
                            setUser(prev=>{
                                return {...prev, isVerified:e.target.checked}})}}/>
                    </Box>
                   
                    <label htmlFor="avatar">
                            <input accept="image/*" style={{display: 'none'}} onChange={handleFileUpload} id="avatar"  type="file" />
                            <Button sx={Style.formItem} variant="contained" component="span">
                                New avatar
                            </Button>
                            <Typography variant="body">
                                {file && file.name}
                            </Typography>
                    </label>
                    
                       
                    <Collapse in={!loading}>
                        <Button sx={Style.formItem} variant="outlined" onClick={handleUpload} color='secondary'>Update</Button>
                    </Collapse>
                </Box>
            
                <Box sx={{...Style.inputsContainer, bgcolor: grey[800]}}>
                        <TextField 
                        label="New Password"
                        inputRef={newPasswordInput}
                        sx={Style.textField}
                        onChange={(e)=>{
                            setNewPassword(e.target.value)}}/>
                            <Collapse in={!loading}>
                        <Button sx={Style.formItem} disabled={!newPassword} color='secondary' variant="outlined" onClick={handleResetPassword} >Reset Password</Button>
                    </Collapse>
                </Box>
                
 
            </>
        }
        </Card>
        </Modal>
    )
}

const Style = {
    container: {

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 5,
        py: 5
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    formItem: {
        my: 1,
        mx: 1,
        autocomplete:"nope",
        maxWidth: 200
    },
    modal:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer:{
        width: 500,
        height: 300
    },
    textField:{
        my: 1,
        width: 300,
        color: 'black'
    },
    avatar: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        borderRadius: 30,
        
    },
    inputsContainer:{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        borderRadius: 1,
    },
}