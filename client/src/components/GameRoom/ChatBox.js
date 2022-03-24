import { Box, Container, Button, TextField } from '@mui/material';


export const ChatBox = () =>{
    return (
        <Box sx={Style.container}>
            <Box sx={Style.chatLog}>

            </Box>
            <Box sx={Style.chatInputContainer}>
                <TextField sx={Style.chatInput} id="filled-basic" label="Filled" variant="filled" size="small"/>
                <Button sx={Style.chatInputBtn} variant="contained">
                    Send
                </Button>
            </Box>
        </Box>
    )
}

const Style = {
    container: {
        display: 'flex',
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        width: 400,
        m: 0,
        p: 0,
    },
    chatLog: {
        backgroundColor: 'lightGrey',
        height: 200,
        width: 370,
        my: 1,
        borderRadius: 5,
    },
    chatInputContainer: {
        height: 50,
        display: 'flex'
    },
    chatInput: {
        height: 20,
        width: 300
    },
    chatInputBtn: {
        height: '100%'
    }
    
}