import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './components/ContextProvider/AuthProvider';
import GameContextProvider from './components/ContextProvider/GameContextProvider';
import SocketContextProvider from './components/ContextProvider/SocketContextProvider';
import UserProvider from './components/ContextProvider/UserProvider';


ReactDOM.render(
  <React.StrictMode>
    <SocketContextProvider>
      <AuthProvider>
        <UserProvider>
          <GameContextProvider>
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </GameContextProvider>
        </UserProvider>
      </AuthProvider>
    </SocketContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
