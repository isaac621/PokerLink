import { Typography, Box, CircularProgress } from '@mui/material';
import PokerCard from './PokerCard';
import { PlayerStatus } from '../../assets/utils/enumeration';
import { amber, red } from '@mui/material/colors';
import dealerBtn from '../../assets/img/dealerBtn.png'
import { useSpring, animated } from 'react-spring'
import { useSocket } from '../ContextProvider/SocketContextProvider';

const ProfilePic = ({inAction, img})=>{
    const blinkBorder = useSpring({
        from: {
            border: '5px solid rgba(114, 255, 230, 0)'
        },
        to:{
            border: '5px solid rgba(114, 255, 230, 1)'
        },
        loop: {reverse: true},
    })
    return(
        <animated.div
        style={inAction ? {
            ...blinkBorder,
            ...Style.profileImgContainer
        } : Style.profileImgContainer}
        >   
        {
            !img ? <CircularProgress color="secondary"/>:
            <img 
            style={Style.profileImg} 
            src= {img}
            alt='profilePic'
    />
        }
           
        </animated.div>
    )
}

export const StatusBar = ({player, pos, dealer, inAction, img}) =>{
    
    const {socket} = useSocket();
    function determineBetDisplayPos(pos){
        switch(pos){
            case 0:
            case 1:
            case 2:
                return{
                    transform: 'translateX(-50%) translateY(150%)',
                    left: '50%',
                    bottom: 0,
                }
            case 3:
                return{
                    transform: 'translateX(110%) translateY(-20%)',
                    bottom: 0,
                    right: 0,
                }
            case 4:
                return{
                    transform: 'translateX(-110%) translateY(-20%)',
                    bottom: 0,
                    left: 0,
                }
            case 5:
            case 6:
            case 7:
                return{
                    transform: 'translateX(-50%) translateY(-300%)',
                    left: '50%',
                    top: 0,
                }
        }
        // 
        
         
        
    }
    return(
        <Box sx={{...Style.container, opacity: player.status == PlayerStatus.out && '40%'}}>
            <Box sx={{...Style.pillContainer, bgcolor: player.status == PlayerStatus.allin ? red[900]: 'primary.dark',}}>
                <ProfilePic inAction={inAction} img={img}/>
                <Box sx={Style.InfosContainer}>
                    <Box sx={{...Style.fontContainer, ...Style.nameContainer}}>
                        <Typography sx={player.socketID == socket.id ? {color: 'secondary.main', fontWeight: 900} : {}}>
                            {player.name}
                        </Typography>
                    </Box>
                    <Box sx={Style.fontContainer}>
                        <Typography>
                            {player.status == PlayerStatus.allin ? 'All in' : player.chips}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{...Style.posContainer, ...determineBetDisplayPos(pos)}}>
                    <Box sx={Style.dealerBtnContainer}>
                    {
                        dealer &&
                    <img src={dealerBtn} alt="dealerBtn" style={Style.dealerBtn}/>
                    }
                    </Box>
                    {(player.bet > 0) &&
                        <Box sx={{...Style.betDisplayContainer}}>
                            <Typography>
                                {player.bet}
                            </Typography>
                        </Box>                    
                    }
                </Box>


            </Box>
            {!(player.status == PlayerStatus.fold || player.status == PlayerStatus.idle || player.status == PlayerStatus.out) &&
            <Box sx={Style.holeCardsContainer}>
                <PokerCard card={player.holeCards[0]}/>
                <PokerCard card={player.holeCards[1]}/>
            </Box>
            }
            {
                player.status == PlayerStatus.win &&
            <Box sx={Style.winnerContainer}>
                <Typography variant='h2'>
                    WIN
                </Typography>
            </Box>
            }

        </Box>
    )
}

const StyleConstant = {
    statusBar:{
        radius: 25,
        height: 50,
        width: 150
    }

}

const Style = {
    container:{
        display: 'flex',
        alignItems: 'flex-end',
        width: StyleConstant.statusBar.width,
        height: 120,
        position: 'relative'
    },
    pillContainer: {
        width: StyleConstant.statusBar.width,
        height: StyleConstant.statusBar.height,
        
        borderTopRightRadius: StyleConstant.statusBar.radius,
        borderBottomRightRadius: StyleConstant.statusBar.radius,
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        color: amber[300],
        zIndex: 3,
        transform: 'translateX(12.5px)'

    },
    InfosContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderTopRightRadius: StyleConstant.statusBar.radius,
        borderBottomRightRadius: StyleConstant.statusBar.radius,
        overflow: 'hidden',
        zIndex: 3
    },
    fontContainer: {
        width: '100%',
        height: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3
    },
    nameContainer: {
        backgroundColor: 'primary.main',
        color: 'white',
        zIndex: 3
    },
    profileImgContainer: {
        position: 'absolute',
        height: StyleConstant.statusBar.height + 10,
        width: StyleConstant.statusBar.height + 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        left: 0,
        transform: 'translateX(-50%)',
        zIndex: 4,
        top: -5,
        boxSizing: 'border-box'
    },
    profileImg:{
        height: StyleConstant.statusBar.height,
        width: StyleConstant.statusBar.height,
        borderRadius: StyleConstant.statusBar.radius,
    },
    betDisplayContainer: {
        bgcolor: 'grey.800',
        width: 60,
        textAlign: 'center',
        borderRadius: 20,
        zIndex: 3,
        height: 'auto'
    },
    holeCardsContainer: {
        display: 'flex',
        width: StyleConstant.statusBar.width,
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 20,
        left: 0,
        zIndex: 2
    },
    posContainer:{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        width: 120,
        //backgroundColor: 'red'
    },
    dealerBtn: {
        height: 30,
    },
    dealerBtnContainer: {
        height: 30,
        width: 30,
        margin: '4px',
    },
    winnerContainer: {
        position: 'absolute',
        background: 'linear-gradient(90deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0.5049370089832808) 85%, rgba(0,212,255,0) 100%)',
        width: '100%',
        height: '60%',
        top: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'rgba(237, 255, 0, 0.8)',
        zIndex: 5
    }
}