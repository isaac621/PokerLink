import { GameRoom } from './components/GameRoom/GameRoom';
import { WaitingRoom } from './components/WaitingRoom/WaitingRoom';
import { Lobby } from './components/Lobby/Lobby';
import SocketContextProvider, { useSocket } from './components/ContextProvider/SocketContextProvider';
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import GameContextProvider, { useGameContext } from './components/ContextProvider/GameContextProvider';
import { useEffect, useState } from 'react';
import { StatusBar } from './components/GameRoom/StatusBar';
import { Login, SignUp, Verify, ForgotPassword, ResetPassword, Edit, AdminLogin, AdminEdit} from './components/UserRelated/';
import { PrivateRoute } from './PrivateRoute';
import { VisitorRoute } from './VisitorRoute';
import { CircularProgress, TextField } from '@mui/material';
import { AdminRoute } from './AdminRoute';
import { serverHost } from './constant';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { loginBg } from './assets/img/background';
import { blue } from '@mui/material/colors';

import '../src/assets/index.css'
import { height } from '@mui/system';


const PlayerStatus = {
  waiting: 0,
  acted: 1,
  allin: 2,
  fold: 3,
  win: 4,
  out: 5,
 
}



const theme = createTheme({
  palette: {
    primary: {
      main: '#78909c',
      light: '#b0bec5',
      dark: '#546e7a'
    },
    secondary: {
      main: '#26c6da',
      light: '#80deea',
      dark: '#00838f'
    }
  },
  components: {
    MuiInputBase: {
        styleOverrides: {
            input: {
                color: 'white',
                
            },
              
        },
        
    },
    MuiInputLabel: {
      styleOverrides: {
          root: {
              color: 'rgba(255, 255, 255, 0.5)',
          }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },

      },
      
    },
    MuiFormLabel:{
      styleOverrides:{
        filled:{
          
        }
      }
    }


}
})


function App() {
  const {socket, setSocket} = useSocket();
  const {setRoomID, setPlayers, setRoomName, setMinimumRaise, setPlayerInAction, setExistingBet, setOptions} = useGameContext();
  const [busy, setBusy] = useState(true)
  const navigate = useNavigate()

  const handleEnterRoom = async (roomJSON)=>{
    const room = JSON.parse(roomJSON);
    setRoomID(room.ID);
    setPlayers(room.players);
    setRoomName(room.name)
    navigate('/waitingRoom');
  }

  function handleGameStart(players){
      setPlayers(players);
      navigate('/gameRoom')
  }

  useEffect(async()=>{
    if(socket){
      socket.on('enterRoom', handleEnterRoom);
      socket.on('gameStart', handleGameStart);
      const res = await fetch(`${serverHost}/game/gameInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
            socketID: socket.id
        })
      }).then(res=>res.json()).catch(err=>false)
      if(res){
        const data = JSON.parse(res)
        console.log(data.players)
        setRoomID(data.ID);
        setPlayers(data.players);
        setRoomName(data.name)

        setMinimumRaise(data.minimumRaise);
        setPlayerInAction(data.playerInAction);
        setExistingBet(data.existingBet);
        if(data.playerOptions){
            setOptions(data.playerOptions);
        }
        console.log(res)
      }
      
      setBusy(false)
      }
  }, [])


  
  
  return (

    <>
      <ThemeProvider theme={theme}>
      <div style={Style.container}>
        {!busy ?
        
          <Routes>
            <Route exact path='/gameRoom' element={<PrivateRoute><GameRoom/></PrivateRoute>}/>
            <Route exact path='/waitingRoom' element={<PrivateRoute><WaitingRoom/></PrivateRoute>}/>
            <Route exact path='/lobby' element={<PrivateRoute><Lobby/></PrivateRoute>}/>
            <Route exact path='/' element={ <VisitorRoute><Login/></VisitorRoute>}/>
            <Route exact path='/login' element={<VisitorRoute><Login/></VisitorRoute>}/>
            <Route exact path='/signUp' element={<VisitorRoute><SignUp/></VisitorRoute>}/>
            <Route exact path='/verify' element={<Verify/>}/>
            <Route exact path='/forgot' element={<VisitorRoute><ForgotPassword/></VisitorRoute>}/>
            <Route exact path='/reset' element={<ResetPassword/>}/>
            <Route exact path='/edit' element={<Edit/>}/>
            
            <Route exact path='/admin/login' element = {<VisitorRoute><AdminLogin/></VisitorRoute>}/>
            <Route exact path='/admin/edit' element={<AdminRoute><AdminEdit/></AdminRoute>}/>

            <Route path='*' element={<Navigate to='/' replace={true}/>}/>
          </Routes> 
       
        :
        <CircularProgress />
        }
         </div>
      </ThemeProvider>
              
 
  
    </>
  );
}

export default App;

const Style = {
  container: {
    backgroundImage: `url(${loginBg})`,
    backgroundSize: 'cover',
    color: 'white',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}