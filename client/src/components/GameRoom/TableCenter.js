import { Typography, Box } from '@mui/material';
import PokerCard from './PokerCard';

export const TableCenter = ({communityCards}) =>{
    return(
        <Box sx={Style.container}>
            <Box sx={Style.communityCards}>
                {communityCards && communityCards.map((card, i)=>{
                    return(
                        <PokerCard key={i} cardIndex={card.cardIndex}/>
                    )
                })}
                
            </Box>
            <Box sx={Style.pots}>
                <Box sx={Style.potContainer}>
                    <Typography>
                        500
                    </Typography>
                </Box>
                <Box sx={Style.potContainer}>
                    <Typography>
                        500
                    </Typography>
                </Box>
                <Box sx={Style.potContainer}>
                    <Typography>
                        500
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

const Style = {
    container: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        width: '450px',
    },
    communityCards: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    pots: {
        width: '100%',
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    potContainer: {
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'black',
        width: 60,
        borderRadius: 20,
        mx: 1
    }
}
