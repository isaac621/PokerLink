import { Typography, Box } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { useGameContext } from '../ContextProvider/GameContextProvider';
import PokerCard from './PokerCard';

const CommunityCards = ({communityCards})=>{
    const emptyCards = new Array(5-communityCards.length).fill(0)
    return(
        <>
        {communityCards.map((card, i)=>{
            return(<PokerCard key={i} card={card}/>)
        })}
        {emptyCards.map((card, i)=>{
            return (<PokerCard key={i+10} empty/>)
        })}
        </>
    )
}

export const TableCenter = () =>{
    const {communityCards, pots} = useGameContext()
    
    return(
        <Box sx={Style.container}>
            <Box sx={Style.totalPotContainer}>
                {pots.reduce((prev,pot)=>(prev+pot), 0) > 0 &&
                <Typography  sx={Style.totalPot}>
                    Total Pots: {pots.reduce((prev,pot)=>(prev+pot), 0)}
                </Typography>}
            </Box>
            <Box sx={Style.communityCards}>
                <CommunityCards communityCards={communityCards}/>                
            </Box>
            <Box sx={Style.pots}>
                {
                    pots.map((pot, i)=>{
                        if(pot != 0){
                            return(
                                <Box key={i} sx={Style.potContainer}>
                                    <Typography>
                                        {pot}
                                    </Typography>
                                </Box>
                            )
                        }
                        
                    })
                }

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
    },
    totalPotContainer: {
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent:'center',
        alignItems: 'center',
        mb: 2
    },
    totalPot: {
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        px: 3,
        py: 0.2,
        borderRadius: 20,
        color: yellow[700]
    }
}
