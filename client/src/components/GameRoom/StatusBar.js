import { Typography, Box } from '@mui/material';
import profilePic from '../../assets/img/profilePic.png'
import PokerCard from './PokerCard';

export const StatusBar = () =>{
    return(
            <Box sx={Style.container}>
                <img 
                        style={Style.profileImg} 
                        src= {profilePic}
                        alt='profilePic'
                />
                <Box sx={Style.InfosContainer}>
                    <Box sx={{...Style.fontContainer, ...Style.nameContainer}}>
                        <Typography>
                            Tom Dawn
                        </Typography>
                    </Box>
                    <Box sx={Style.fontContainer}>
                        <Typography>
                            200000
                        </Typography>
                    </Box>
                </Box>
                <Box sx={Style.statusContainer}>
                    <Typography>
                        200
                    </Typography>
                </Box>
                <Box sx={Style.holeCardsContainer}>
                    <PokerCard cardIndex='d7'/>
                    <PokerCard cardIndex='s2'/>
                </Box>
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
    container: {
        width: StyleConstant.statusBar.width,
        height: StyleConstant.statusBar.height,
        backgroundColor: 'primary.dark',
        borderTopRightRadius: StyleConstant.statusBar.radius,
        borderBottomRightRadius: StyleConstant.statusBar.radius,
        display: 'flex',
        flexDirection: 'row',
        color: 'white',
        position: 'relative',

    },
    InfosContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderTopRightRadius: StyleConstant.statusBar.radius,
        borderBottomRightRadius: StyleConstant.statusBar.radius,
        overflow: 'hidden'
        
    },
    fontContainer: {
        width: '100%',
        height: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        backgroundColor: 'primary.main' 
    },
    profileImg: {
        position: 'absolute',
        height: StyleConstant.statusBar.height,
        width: StyleConstant.statusBar.height,
        borderRadius: StyleConstant.statusBar.radius,
        left: 0,
        transform: 'translateX(-50%)'
    },
    statusContainer: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%) translateY(150%)',
        backgroundColor: 'black',
        width: 60,
        textAlign: 'center',
        borderRadius: 20,
    },
    holeCardsContainer: {
        position: 'absolute',
        display: 'flex',
        width: '90%',
        justifyContent: 'space-around',
        bottom: 20,
        zIndex: -1
    }
}