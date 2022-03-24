import { Box, TextField, Button } from "@mui/material"

export const Lobby = () =>{
    return(
        <Box sx={Style.container}>
            <Box sx={Style.formContainer}>
                <TextField sx={Style.formItem} required label="Name"/>
                <TextField sx={Style.formItem} label="RoomID"/>
                <Button sx={Style.formItem} variant="outlined">Create</Button>
                <Button sx={Style.formItem} variant="outlined">Join</Button>
            </Box>
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
    }
}