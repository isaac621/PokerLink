import { Box, Typography } from "@mui/material";

export const EndingScreen = ({winner}) =>{
    return(
        <Box sx={Style.container}>
            <Typography variant='h1'>
                {winner} wins the game!
            </Typography>
        </Box>
    )
}

const Style = {
    container: {
        height: '100vh',
        width: '100vw',
        color: 'black',
        bgcolor: 'white',
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    }
}