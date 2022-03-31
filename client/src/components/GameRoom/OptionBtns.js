import { Box, Slider, Button } from "@mui/material"
import { useState } from "react"
import { useGameContext } from "../ContextProvider/GameContextProvider"
import { useSocket } from "../ContextProvider/SocketContextProvider"

export const OptionBtns = ({client})=>{
    const {roomID, options, minimumRaise, existingBet} = useGameContext();
    const [amountToRaiseTo, setAmountToRaiseTo] = useState(0);
    const {socket} = useSocket();



    function handleCheck(){
        socket.emit("option", roomID, 'check', 0)
        setAmountToRaiseTo(1)
    }
    
    function handleCall(){
        socket.emit("option", roomID, 'call', 0)
        setAmountToRaiseTo(1)
    }

    function handleRaise(){
        socket.emit("option", roomID, 'raise', parseInt(amountToRaiseTo))
        setAmountToRaiseTo(1)
    }

    function handleFold(){
        socket.emit("option", roomID, 'fold', 0)
    }

    function handleRaiseChange(e){
        setAmountToRaiseTo(e.target.value)
    }


    return(
        <>
        
            <Box sx={Style.raiseSliderContainer}>
                {
                    options.raise&&
                    <Slider sx={Style.raiseSlider} defaultValue={0} aria-label="Default"  valueLabelDisplay="on"
                    min={existingBet+minimumRaise} max={client.bet+client.chips}
                    onChange={handleRaiseChange}/>
                }
                
            </Box>
            <Box>
                {
                    options.call&&    
                    <Button variant="contained" color="secondary" sx={Style.button} size="large" onClick={handleCall}>Call</Button>
                
                }
                {
                    options.check&&
                    <Button variant="contained" color="secondary" sx={Style.button} size="large" onClick={handleCheck}>Check</Button>    
                }
                {
                    options.raise&&
                    <Button variant="contained" color="secondary" sx={Style.button} size="large" onClick={handleRaise}>Raise To</Button>
                      
                }
                {
                    options.fold&&  
                    <Button variant="contained" color="secondary" sx={Style.button} size="large" onClick={handleFold}>Fold</Button>    
                }
                
                

            </Box>
        </>
    )
}

const Style = {
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
}