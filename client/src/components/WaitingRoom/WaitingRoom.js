import { Box, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography, Button, Fab} from '@mui/material';
import profilePic from '../../assets/img/profilePic.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';

const dummy = [{name: "Isaac"}, {name: "Kit"}, {name: "Jomy"}, {name: "Hinson"}, {name: "John"}, {name: "John"}, {name: "John"}, {name: "John"}]

export const WaitingRoom = () =>{
    return(
        <Box sx={Style.container}>
            <Box sx={Style.roomIdContainer}>
                <Typography variant="h4">
                    Room ID: Jadfa1232131
                </Typography>
            </Box>
            <List sx={Style.listContainer}>
                {dummy.map((player, i, arr)=>{
                    return(
                        <React.Fragment key={i}>

                            <ListItem sx={Style.listItem} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={profilePic} />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={player.name}
                                    secondary={
                                        <>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Ali Connors
                                        </Typography>
                                        {" — I'll be in your neighborhood doing errands this…"}
                                        </>
                                    }
                                    />
                            </ListItem>
                            {i < arr.length-1 && <Divider variant="inset" component="li" />}
                                                    
                        </React.Fragment>
                    )
                })}
                </List>
                <Button sx={Style.startBtn} variant='contained' size="large">
                    Start
                </Button>
                <Fab color="secondary" aria-label="add">
                    <ArrowBackIcon />
                </Fab>
        </Box>
    )
}


const Style = {
    container: {
        backgroundColor: 'grey.400',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: { 
        width: '100%', 
        minheight: 350, 
        maxWidth: 600, 
        bgcolor: 'background.paper',
        overflow: 'scrollY'
    },
    listItem: {
        py: 0
    },
    roomIdContainer: {
        backgroundColor: 'white',
        display: 'flex',
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
    }
}

