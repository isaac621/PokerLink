import { Box, Container, Button, Slider, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StatusBar } from './StatusBar';
import { TableCenter } from './TableCenter';
import { ChatBox } from './ChatBox';
import { GameInfo } from './GameInfo';
import { gameRoomBg } from '../../assets/img/background';
import { useSocket } from '../ContextProvider/SocketContextProvider';
import { useGameContext } from '../ContextProvider/GameContextProvider';
import { OptionBtns } from './OptionBtns';
import { useEffect, useState } from 'react';
import { PlayerStatus } from '../../assets/utils/enumeration';
import { useNavigate } from "react-router-dom";

import { EndingScreen } from './EndingScreen';
import { useUser } from '../ContextProvider/UserProvider';
import { serverHost } from '../../constant';


export const GameRoom = () =>{
    const {socket} = useSocket();
    const {
        roomID,
        setCommunityCards,
        players, setPlayers,
        setMinimumRaise,
        playerInAction, setPlayerInAction,
        setExistingBet,
        setPots,
        dealerPos, setDealerPos,
        sb, setSb,
        setOptions,
        resetGameContext,
        playersAvatar, setPlayersAvatar, setEnd
    } = useGameContext();
    const navigate = useNavigate();

    const [gameEnd, setGameEnd] =useState(false);
    const [winner, setWinner] = useState('');
    

    useEffect(async()=>{
        socket.on('updateDealer', (dealerPos)=>setDealerPos(dealerPos))
        socket.on('updatePlayerHoleCards', handleUpdatePlayerHoleCards);
        socket.on('updatePlayersInfo', handleUpdatePlayersInfo)
        socket.on('updateCommunityCards', handleUpdateCommunityCards)
        socket.on('requestOption', handleRequestOption)
        socket.on('optionReceived', handleOptionReceived)
        socket.on('updatePot', handleUpdatePot)
        socket.on('updateSb', (sb)=>setSb(sb))
        socket.on('gameEnd', handleGameEnd)
        const avatars = [];

        players.map(async(player)=>{
            const avatar = await fetch(`${serverHost}/users/avatar/${player.id}`, {
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
            }).then(res=>res.blob()).then(res=>URL.createObjectURL(res)).catch(err=>console.log(err))
            avatars.push(avatar)
        })
        console.log(avatars, 111)
        setPlayersAvatar(avatars)
    }, [])

    function handleGameEnd(name){
        setWinner(name);
        setEnd(true);
        setGameEnd(true);
    }

    function handleUpdatePlayerHoleCards(updateData){
        updateData = JSON.parse(updateData)
        setPlayers((prev)=>{
            return prev.map((player, index)=>{

                if(index == updateData.playerIndex){
                    return{
                        ...player, holeCards: updateData.holeCards
                    }
                }
                else{
                    return player
                }
        })})
    }

    function handleUpdatePlayersInfo(newPlayersData){
        newPlayersData = JSON.parse(newPlayersData)
        setPlayers((prev)=>{
            return prev.map((player, index)=>{
                return{
                    ...player, ...newPlayersData[index]
                }
        })})
    }

    function handleUpdateCommunityCards(communityCards){
        communityCards = JSON.parse(communityCards);
        setCommunityCards(communityCards)
    }

    function handleUpdatePot(pot){
        setPots(pot);
    }


    const client = players.find((player)=>player.socketID == socket.id)

    function handleRequestOption(socketID, playerOptions, minimumRaise, playerInAction, existingBet){
        setMinimumRaise(minimumRaise);
        setPlayerInAction(playerInAction);
        setExistingBet(existingBet);
        if(socketID == socket.id){
            setOptions(playerOptions);
        }
    }

    function handleOptionReceived(){
        setOptions({
            check: false,
            raise: false,
            fold: false,
            call: false
        })
    }

    function handleOnClickLeave(){
        resetGameContext();
        socket.emit('leaveGame', roomID, ()=>{
            navigate('/lobby', {replace: true})});
        
    }


    return(
            <div style={Style.container}>
                {
                    !gameEnd &&
                <Box>
                    <Box sx={Style.table}>

                    </Box>
                </Box>
                }
                {
                    gameEnd?
                    <EndingScreen winner={winner}/>:

                    <Container sx={Style.mainTable}>

                    {players.map((player, index)=>{
                        return(
                            <Box key={index} sx={{gridArea: `p${index}`,...Style.statusBarContainer}}>
                                <StatusBar player={player} pos={index} dealer={dealerPos == index} inAction={playerInAction==index} img={playersAvatar && playersAvatar[index]}/>
                            </Box>
                        )
                    })}
                        <TableCenter/>
                </Container>

                }
                
                
                
                <Box sx={Style.buttonsContainer}>
                    <OptionBtns client={client}/>
                </Box>
                <Box sx={Style.chatBoxContainer}>
                    <ChatBox/>
                </Box>
                <Box sx={Style.gameInfoContainer}>
                    <GameInfo/>
                </Box>
                {
                    (gameEnd ||client.status == PlayerStatus.out )&&
                <Fab color="secondary" aria-label="add" sx={Style.backBtn} onClick={handleOnClickLeave}>
                    <ArrowBackIcon />
                </Fab>
                }
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
        //backgroundImage: `url(${gameRoomBg})`,
        backgroundSize: 'cover',
        
        zIndex: 0
    },
    mainTable: {
        position: 'relative',
        width: '100%',
        marginBottom: '20px',
        zIndex: 2,
        height: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 150)',
        gridTemplateRows: 'repeat(3, 80px)',
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
        alignItems: 'center',
        transform: 'translateY(-35px)'
    },

    buttonsContainer: {
        position: 'absolute',
        bottom: 40,
        right: 0,
        width: 'auto',
        zIndex: 100
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
    },

    backBtn: {
        position: 'absolute',
        right: 40,
        top: 40
    }
    

}