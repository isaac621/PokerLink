import { GameRoom } from './components/GameRoom/GameRoom';
import { WaitingRoom } from './components/WaitingRoom/WaitingRoom';
import { Lobby } from './components/Lobby/Lobby';
import SocketContextProvider, { useSocket } from './components/ContextProvider/SocketContextProvider';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import GameContextProvider from './components/ContextProvider/GameContextProvider';
import { useEffect, useState } from 'react';
import { StatusBar } from './components/GameRoom/StatusBar';
import { Login, SignUp, Verify, ForgotPassword, ResetPassword, Edit } from './components/UserRelated/';
import AuthProvider, { useAuth } from './components/ContextProvider/AuthProvider';
import { PrivateRoute } from './PrivateRoute';
import { VisitorRoute } from './VisitorRoute';
import UserProvider, { useUser } from './components/ContextProvider/UserProvider';
import { CircularProgress } from '@mui/material';




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


  let player;
  useEffect(()=>{

  })

  if(socket){
    player = {
      name: 'nde',
      chips: 300,
      bet: 30,
      status: PlayerStatus.allin,
      pot: 0,
      holeCards: [{suit:0, number:14}, {suit:2, number:13}],
      socketID: socket.id,
      isHost: true}
  }

  const {avatar} = useUser();
  console.log(avatar, socket)
  return (
    <GameContextProvider>
   
          <BrowserRouter>
              {(socket) ?

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
              </Routes> 
              :
              <CircularProgress />
              }
              
          </BrowserRouter>

      {/* <div style={{margin: 100, backgroundColor: 'grey', height: 500, width: 500, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {socket && player?<StatusBar player={player} pos={5} />:'not ready'}
      </div> */}
    </GameContextProvider>

  );
}

export default App;
