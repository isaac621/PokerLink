import { GameRoom } from './components/GameRoom/GameRoom';
import { WaitingRoom } from './components/WaitingRoom/WaitingRoom';
import { Lobby } from './components/Lobby/Lobby';
import SocketContextProvider, { useSocket } from './components/ContextProvider/SocketContextProvider';
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import GameContextProvider, { useGameContext } from './components/ContextProvider/GameContextProvider';
import { useEffect, useState } from 'react';
import { StatusBar } from './components/GameRoom/StatusBar';
import { Login, SignUp, Verify, ForgotPassword, ResetPassword, Edit, AdminLogin, AdminEdit} from './components/UserRelated/';
import AuthProvider, { useAuth } from './components/ContextProvider/AuthProvider';
import { PrivateRoute } from './PrivateRoute';
import { VisitorRoute } from './VisitorRoute';
import UserProvider, { useUser } from './components/ContextProvider/UserProvider';
import { CircularProgress } from '@mui/material';
import { AdminRoute } from './AdminRoute';
import { serverHost } from './constant';




const PlayerStatus = {
  waiting: 0,
  acted: 1,
  allin: 2,
  fold: 3,
  win: 4,
  out: 5,
 
}


function App() {
  const {socket, setSocket} = useSocket();
  const {setRoomID, setPlayers, setRoomName} = useGameContext();
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
      
      }
      
      setBusy(false)
      }
  }, [])



  
  return (

    <>
      {!busy ?

      <Routes>
        <Route exact path='/gameRoom' element={<PrivateRoute><GameRoom/></PrivateRoute>}/>
        <Route exact path='/waitingRoom' element={<PrivateRoute><WaitingRoom/></PrivateRoute>}/>
        <Route exact path='/lobby' element={<PrivateRoute><Lobby/></PrivateRoute>}/>
        <Route exact path='/' element={ <VisitorRoute><Login/></VisitorRoute>}/>
        <Route exact path='/login' element={<VisitorRoute><Login/></VisitorRoute>}/>
        <Route exact path='/signUp' element={<VisitorRoute><SignUp/></VisitorRoute>}/>
        <Route exact path='/verify' element={<Verify/>}/>
        <Route exact path='/forgot' element={<ForgotPassword/>}/>
        <Route exact path='/reset' element={<ResetPassword/>}/>
        <Route exact path='/edit' element={<Edit/>}/>
        
        <Route exact path='/admin/login' element = {<VisitorRoute><AdminLogin/></VisitorRoute>}/>
        <Route exact path='/admin/edit' element={<AdminRoute><AdminEdit/></AdminRoute>}/>
      </Routes> 
      :
      <CircularProgress />
      }
              
 
  
    </>
  );
}

export default App;
