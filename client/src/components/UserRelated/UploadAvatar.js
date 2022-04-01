import { Box, Card, Button, Typography, Alert, IconButton, Collapse,  Modal, TextField, CircularProgress, Checkbox} from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate,  } from "react-router-dom";
import { serverHost } from "../../constant";
import CloseIcon from '@mui/icons-material/Close';
import Resizer from 'react-image-file-resizer'
import { useUser } from "../ContextProvider/UserProvider";


export const UploadAvatar = ({open, setOpen, id}) =>{
    const [busy, setBusy] = useState(false)
    const [file, setFile] = useState();
    const [user, setUser] = useState({})
    const [message, setMessage] = useState();
    const [severity, setSeverity] = useState();
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [avatar, setAvatar] = useState();
    const {updateUser} = useUser();

    const handleModalClose = ()=>{
        setOpen(false)
    }
    const resizeFile = (file) =>{
        return new Promise((resolve)=>{
            Resizer.imageFileResizer(
                file,
                100,
                100,
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
        const avatar = await fetch(`${serverHost}/users/avatar`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
        }).then(res=>res.blob()).then(res=>URL.createObjectURL(res))
        setAvatar(avatar)

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
   
    const handleUpload = async()=>{
        console.log('sent')
        setLoading(true);
        const formData = new FormData();
        console.log(user)
        if(file){
            formData.append('avatar',file)
        }

       
        const res = await fetch(`${serverHost}/upload/avatar`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: formData
        }).then(updateUser())
        
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
                Upload Avatar
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
                   
                    <label htmlFor="avatar">
                            <input accept="image/*" style={{display: 'none'}} onChange={handleFileUpload} id="avatar"  type="file" />
                            <Button sx={Style.formItem} variant="contained" component="span">
                                New avatar
                            </Button>
                            <Typography variant="body">
                                {file && file.name}
                            </Typography>
                    </label>
                    
                       
                    <Collapse in={!loading && file}>
                        <Button sx={Style.formItem} variant="outlined" onClick={handleUpload} >Update</Button>
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
        width: 300
    },
    avatar: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        borderRadius: 30,
        
    },
    inputsContainer:{
        display: 'flex',
        alignItems: 'center'
    },
}