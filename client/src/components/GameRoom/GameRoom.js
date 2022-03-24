import { Box, Container, Button, Slider } from '@mui/material';
import { StatusBar } from './StatusBar';
import { TableCenter } from './TableCenter';
import { ChatBox } from './ChatBox';
import { GameInfo } from './GameInfo';
import { gameRoomBg } from '../../assets/img/background';

const players = [0, 1, 2, 3, 4, 5, 6, 7];
const cards = [{cardIndex: 'S14'}, {cardIndex: 'H14'}, {cardIndex: 'D10'}, {cardIndex: 'S12'}, {cardIndex: 'C10'}]

export const GameRoom = () =>{
    return(
            <div style={Style.container}>
                <Box>
                    <Box sx={Style.table}>

                    </Box>
                </Box>
                <Container sx={Style.mainTable}>

                    {players.map((player, index)=>{
                        return(
                            <Box key={index} sx={{gridArea: `p${index}`,...Style.statusBarContainer}}>
                                <StatusBar/>
                            </Box>
                        )
                    })}
                        <TableCenter communityCards={cards}/>
                </Container>
                <Box sx={Style.buttonsContainer}>
                    <Box sx={Style.raiseSliderContainer}>
                        <Slider sx={Style.raiseSlider} defaultValue={0} aria-label="Default"  valueLabelDisplay="on"/>
                    </Box>
                    <Box>
                        <Button variant="contained" color="secondary" sx={Style.button} size="large">Fold</Button>
                        <Button variant="contained" color="secondary" sx={Style.button} size="large">Check</Button>
                        <Button variant="contained" color="secondary" sx={Style.button} size="large">Raise</Button>
                        <Button variant="contained" color="secondary" sx={Style.button} size="large">Call</Button>
                    </Box>
                    
                </Box>
                <Box sx={Style.chatBoxContainer}>
                    <ChatBox/>
                </Box>
                <Box sx={Style.gameInfoContainer}>
                    <GameInfo gameID="365437J" gameName="ABC Poker" sb={5}/>
                </Box>
            </div>
        
    )
}

const Style = {
    table: {
        position: 'absolute',
        borderRadius: 1000,
        borderColor: 'grey.500',
        border: '20px solid',
        width: 980,
        height: 450,
        backgroundColor: 'green',
        left: '50%',
        top: '50%,',
        transform: 'translateX(-50%) translateY(-52%)',
        zIndex: 1
    },
    container: {
        p: 0,
        m: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${gameRoomBg})`,
        backgroundSize: 'cover',
        
        zIndex: 0
    },
    mainTable: {
        position: 'relative',
        width: '100%',
        mb: 5,
        zIndex: 2,
        height: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 150)',
        gridTemplateRows: 'repeat(3, 50px)',
        columnGap: 5,
        rowGap: 20,
        gridTemplateAreas: 
        `
            ". p0 p1 p2 ."
            "p3 center center center p4"
            ". p5 p6 p7  ."
        `,
    },

    statusBarContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonsContainer: {
        position: 'absolute',
        bottom: 40,
        right: 0,
        width: 'auto',
        zIndex: 100
    },

    button: {
        mx: 1,
    },
    
    raiseSliderContainer: {
        height: 50,
        my: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },

    raiseSlider: {
        width: '80%',
        
    },

    chatBoxContainer: {
        position: 'absolute',
        left: 0,
        bottom: 20,
        zIndex: 99,
        m: 0
    },

    gameInfoContainer:{
        position: 'absolute',
        left: 30,
        top: 20,
        m: 0,
        zIndex: 100,
    }
    

}