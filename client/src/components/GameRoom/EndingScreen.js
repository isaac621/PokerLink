import { Box, Typography } from "@mui/material";
import { gameRoomBg } from "../../assets/img/background";


export const EndingScreen = ({winner}) =>{
    return(
        <Box sx={Style.container}>
            <Box sx={Style.bg}>

            </Box>
            <Typography variant='h1' sx={Style.typo}>
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
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    bg:{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${gameRoomBg})`,
        backgroundSize: 1000,
        filter: 'blur(5px)'
    },
    typo:{
        color: 'white',
        zIndex: 30,
        fontWeight: 900
        
    }
}