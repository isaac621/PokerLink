import { createContext, useContext, useState } from "react";

const GameContext = createContext();

const GameContextProvider = ({children}) =>{

    const [roomID, setRoomID] = useState('');
    const [roomName, setRoomName] = useState('');

    const [communityCards, setCommunityCards] = useState([]);
    const [players, setPlayers] = useState([]);
    const [minimumRaise, setMinimumRaise] = useState(0);
    const [playerInAction, setPlayerInAction] = useState(-1);
    const [existingBet, setExistingBet] = useState(0);
    const [pots, setPots] = useState([]);
    const [dealerPos, setDealerPos] = useState(-1);
    const [sb, setSb] = useState(1);
    const [end, setEnd] = useState(false);

    const [playersAvatar, setPlayersAvatar] = useState()

    const [options, setOptions] = useState({check: false, raise: false, call: false, fold:false})

    function resetGameContext(){
        setRoomID('');
        setCommunityCards([]);
        setPlayers([]);
        setMinimumRaise(0);
        setPlayerInAction(0);
        setExistingBet(0);
        setPots([]);
        setDealerPos(-1);
        setOptions({check: false, raise: false, call: false, fold:false});
        setEnd(false)
    }

    const value = {
        roomID, setRoomID,
        roomName, setRoomName,
        communityCards, setCommunityCards,
        players, setPlayers,
        minimumRaise, setMinimumRaise,
        playerInAction, setPlayerInAction,
        existingBet, setExistingBet,
        pots, setPots,
        dealerPos, setDealerPos,
        sb, setSb,
        options, setOptions,
        resetGameContext,
        playersAvatar, setPlayersAvatar, end, setEnd
    }

    return(
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    )
}

export default GameContextProvider;

export function useGameContext(){
    return useContext(GameContext)
}