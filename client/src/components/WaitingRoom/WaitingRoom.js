import { Box, List, ListItem, Divider, ListItemText, ListItemAvatar, ListItemIcon,Avatar, Typography, Button, Fab, CircularProgress, Collapse, Alert, IconButton} from '@mui/material';
import profilePic from '../../assets/img/profilePic.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGameContext } from "../ContextProvider/GameContextProvider";
import { useSocket } from "../ContextProvider/SocketContextProvider";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import StarRateIcon from '@mui/icons-material/StarRate';
import CloseIcon from '@mui/icons-material/Close';


export const WaitingRoom = () =>{
    const navigate = useNavigate();
    const {socket} = useSocket();
    const {players, roomID, setRoomID, roomName} = useGameContext();
    
    const [busy, setBusy] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false)
    const [message, setMessage] = useState('')
  
    useEffect(()=>{
        socket.on('rejectStartGame', (message)=>{
            setAlertOpen(true)
            setMessage(message)
        })
    })

    function handleOnClickStart(){
        socket.emit("gameStart", roomID)
    }

    function handleLeave(){
        socket.emit('leaveRoom', roomID, ()=>{
            setRoomID('');
            navigate('/lobby', {replace: true})
        });
    }
    
    return(
        <Box sx={Style.container}>
            {busy ? <CircularProgress/>:
                <>
                <Box sx={Style.roomIdContainer}>
                        <Typography variant="h4">
                            Room ID: {roomID}
                        </Typography>
                        <Typography variant="h6">
                            Room Name: {roomName}
                        </Typography>
                    </Box>
                    <List sx={Style.listContainer}>
                        {players.map((player, i, arr)=>{
                            return(
                                <React.Fragment key={i}>

                                    <ListItem 
                                        sx={{...Style.listItem, 
                                            bgcolor: player.socketID == socket.id ? 'primary.light' : ''}} 
                                        alignItems="flex-start"
                                    >
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src={profilePic} />
                                            </ListItemAvatar>
                                            <ListItemText
                                            primary={<Typography
                                              
                                                variant="h6"
                                                color="secondary.dark"
                                            >
                            
                                                {player.name}
                                            </Typography>}
                                            secondary={
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="caption"
                                                    color="text.primary"
                                                >
                                
                                                    {player.id}
                                                </Typography>
                                            }
                                            />
                                            {player.isHost &&
                                                <ListItemIcon sx={Style.listIcon}>
                                                    <StarRateIcon sx={Style.starIcon}/>
                                                </ListItemIcon>
                                            }
                                    </ListItem>
                                    {i < arr.length-1 && <Divider variant="inset" component="li" />}
                                                            
                                </React.Fragment>
                            )
                        })}
                        </List>
                        <Fab color="secondary" aria-label="add" sx={Style.backBtn} onClick={handleLeave}>
                            <ArrowBackIcon />
                        </Fab>

                        {
                        players.find(e=>e.isHost==true).socketID == socket.id &&
                        <>
                                <Collapse in={alertOpen}>
                                <Alert
                                        severity='warning'
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
                                        sx={{ mt: 1 }}
                                    >
                                        {message}
                                    </Alert>
                                </Collapse>
                            <Button sx={Style.startBtn} variant='contained' size="large" onClick={handleOnClickStart}>
                                Start
                            </Button>
                        </>

                        }
                </>
            }
               
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
        alignItems: 'center'
    },
    listContainer: { 
        width: '100%', 
        minHeight: 350, 
        maxWidth: 600, 
        backgroundColor: 'grey.200',
        p: 0,
        
    },
    listItem: {
        py: 0,
        height: 60
    },
    roomIdContainer: {
        color: 'black',
        backgroundColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        my: 2,
        minWidth: 300,
        py: 2,
        px: 5,
        borderRadius: 60
    },
    startBtn: {
        my: 2
    },
    backBtn: {
        position: 'absolute',
        right: 40,
        top: 40
    },
    listIcon: {
        height: '100%',
        m: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    starIcon: {
        transform: 'scale(1.3)',
        fill: 'yellow'
    }
}

