import { Box, TextField, Button, Fab, Typography}  from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSocket } from "../ContextProvider/SocketContextProvider";
import LogoutIcon from '@mui/icons-material/Logout';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useUser } from "../ContextProvider/UserProvider";
import { UploadAvatar } from "../UserRelated";


export const Lobby = () =>{
    const navigate = useNavigate();
    const {socket} = useSocket();

  
    const [roomIDInput, setRoomIDInput] = useState('');
    const [roomNameInput, setRoomNameInput] = useState('');

    const [userNameIsEmpty, setUserNameIsEmpty] = useState(false);
    const [roomIDInputIsEmpty, setRoomIDInputIsEmpty] = useState(false);
    const [roomNameInputIsEmpty, setRoomNameInputIsEmpty] = useState(false);

   

    const {avatar, id, userName} = useUser();

    const [open, setOpen] = useState(false);
  
 

    const handleLogout = ()=>{
        localStorage.removeItem('jwt')
        navigate('/login')
    }
    
    
    const handleCreateRoom = () =>{
        setUserNameIsEmpty(userName ? false : true)
        setRoomNameInputIsEmpty(roomNameInput ? false : true)
        if(userName && roomNameInput){
            console.log(1)
            socket.emit('createRoom', userName, roomNameInput);
 
            socket.on('roomIsFull', handleError);
        }

    }

    const handleError=()=>{

    }

    const handleJoinRoom = () =>{
        setUserNameIsEmpty(userName ? false : true)
        setRoomIDInputIsEmpty(roomIDInput ? false : true)
        if(userName && roomIDInput){
            socket.emit('joinRoom', userName, roomIDInput);
  
        }
    }

    const handlePhoto = () =>{
        setOpen(true)
    }

   


    return(
        <Box sx={Style.container}>
            <Box sx={Style.infoContainer}>
                <Box sx={Style.infoContentContainer}>
                    <img src={avatar} style={Style.avatar} alt="avatar"/>
                    <Box sx={Style.info}>

                        <Typography variant='h6'>
                            {userName}
                        </Typography>
                        <Typography variant='body'>
                            {id}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={Style.formContainer}>
                <TextField sx={Style.formItem} error={roomNameInputIsEmpty} label="RoomName" onChange={(e)=>{setRoomNameInput(e.target.value)}}/>
                <TextField sx={Style.formItem} error={roomIDInputIsEmpty} label="RoomID" onChange={(e)=>{setRoomIDInput(e.target.value)}}/>
                <Button sx={Style.formItem} color='secondary' variant="outlined" onClick={handleCreateRoom}>Create</Button>
                <Button sx={Style.formItem} color='secondary' variant="outlined" onClick={handleJoinRoom}>Join</Button>
            </Box>
            <Fab color="secondary" aria-label="add" sx={Style.logoutBtn} onClick={handleLogout}>
                    <LogoutIcon />
            </Fab>
            <Fab color="primary" aria-label="add" sx={Style.photoBtn} onClick={handlePhoto}>
                    <AddPhotoAlternateIcon />
            </Fab>
            <UploadAvatar open={open} id={id} setOpen={setOpen}/>        
        </Box>
    )
}

const Style = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
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
    logoutBtn: {
        position: 'absolute',
        right: 40,
        top: 40
    },
    photoBtn: {
        position: 'absolute',
        right: 120,
        top: 40
    },
    infoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        
        minWidth: 200,
        px: 5,
        py: 2,
        
    },
    infoContentContainer:{
        minWidth: 200,
        display: 'flex',
        justifyContent: 'flex-start',
        border: '2px solid',
        borderRadius: 30,
        borderColor: 'primary.dark',
        background: 'linear-gradient(90deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.5189426112241772) 12%, rgba(0,0,0,0.9643207624846813) 30%, rgba(0,212,255,1) 100%)'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 100,
        objectFit: 'cover',
    },
    info: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
        pl: 3,
        pr: 6

    },

}