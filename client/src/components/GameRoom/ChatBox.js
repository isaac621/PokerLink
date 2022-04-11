import { Box, Container, Button, TextField, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useEffect, useRef, useState } from 'react';
import { useGameContext } from '../ContextProvider/GameContextProvider';
import { useSocket } from '../ContextProvider/SocketContextProvider';
import { useUser } from '../ContextProvider/UserProvider';


export const ChatBox = () =>{
    const {socket} = useSocket()
    const {userName} = useUser()
    const {roomID} = useGameContext();
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState()
    const chatLogRef = useRef(null);
    const inputRef = useRef(null);

    const handleMessage = (e)=>{
        setMessage(e.target.value)
    }

    const handleSent = ()=>{
        if(message){
            setChat((prev)=>{
                return  [...prev, {sender: 'You', message: message, you: true}]
            })
            chatLogRef.current.scrollIntoView()
            console.log(inputRef)
            inputRef.current.value = ''
            setMessage('')
            socket.emit('message', userName, message, roomID)
        }
        
    }
    const handleChat =(e)=>{
        console.log(socket.id)
        setChat((prev)=>{
            return  [...prev, e]
        })
        console.log(chatLogRef)
        chatLogRef.current.scrollIntoView()

    }

    useEffect(()=>{
        socket.on('chat', handleChat)
    }, [])

    return (
        <Box sx={Style.container}>
            <Box sx={Style.chatLog}>
                {chat.map((e,i)=>{
                    return <Box
                        key={i}
                        sx={e.you ? {...Style.chat, ...Style.chat_y} : (e.isGM ? {...Style.chat, ...Style.chat_GM}: Style.chat)}
                        >
                        [{e.sender}]: {e.message}
                    </Box>
                })}
                <div style ={{...Style.chat, height: 10}} ref={chatLogRef}/>
            </Box>
            <Box sx={Style.chatInputContainer}>
                <TextField sx={Style.chatInput} id="filled-basic" label="Put your chat here" variant="filled" size="small" onChange={handleMessage} inputRef={inputRef}/>
                <Button sx={Style.chatInputBtn} variant="contained" onClick={handleSent}>
                    Send
                </Button>
            </Box>
        </Box>
    )
}

const Style = {
    container: {
        display: 'flex',
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center',
        m: 0,
        p: 1,
    },
    chat:{
        color: 'black',
        fontSize: '1.1rem',
        display: 'flex',
        width: '100%',
        wordBreak: 'break-all'
    },
    chat_y:{
        color: red[900],
    },
    chat_GM:{
        color: green['A700'],
    },
    chatLog: {
        boxSizing: 'border-box',
        backgroundColor: 'lightGrey',
        height: 180,
        width: 350,
        my: 1,
        borderRadius: 5,
        px: 1,
        py: 2,
        overflowY: 'scroll'
    },
    chatInputContainer: {
        height: 50,
        display: 'flex'
    },
    chatInput: {
        height: 20,
        width: 300
    },
    chatInputBtn: {
        height: '100%'
    }
    
}