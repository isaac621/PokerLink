import { Server } from "socket.io";
import poker from "./poker.js";
import { generateGame} from './table.js'
import { generateRoomID, swap } from "./ultility.js";
import {PlayerStatus} from './enumeration.js'

const io = new Server(3000, {
  cors: {
    origin: "*",
  }
})

const games = {};

io.on("connection", socket=>{
  
  console.log(socket.id);
  
  
  socket.on('createRoom', handleCreateRoom);
  socket.on('joinRoom', handleJoinRoom);
  socket.on('leaveRoom', handleLeaveRoom);
  socket.on('option', handleOption);
  socket.on('gameStart', handleGameStart);

  function handleCreateRoom(name){
    let roomID = generateRoomID(6);
    games[roomID] = generateGame(roomID, 5);
    socket.join(roomID);

    games[roomID].addPlayer(name, socket.id, true);

    socket.emit('enterRoom', games[roomID].sendRoomInfo())
  }



  function handleJoinRoom(name, roomID, errAlert){
    if(games.hasOwnProperty(roomID)){
      if(games[roomID].players.length < games[roomID].maxNumOfPlayers){
        socket.join(roomID);
        games[roomID].addPlayer(name, socket.id);
  
        io.to(roomID).emit('enterRoom', games[roomID].sendRoomInfo())
      }
      else{
        errAlert('The room is full')
      }
    }
    else{
      errAlert('Your room ID does not exist')
    }
  }

  function handleLeaveRoom(roomID, info){
    socket.leave(roomID);
    if(games[roomID].players.find(player=>player.socketID == socket.id).host == true && games[roomID].players.length >= 2){

      games[roomID].removePlayer(socket.id);
      games[roomID].players[0].isHost=true;

    }
    else{
      games[roomID].removePlayer(socket.id);

    }

    info('You leave the room successfully')
    console.log(games[roomID].players)
    if(games[roomID].players.length == 0){
      //remove thee room
    }
    io.to(roomID).emit('enterRoom', games[roomID].sendRoomInfo())
  }



  
  function handleOption(roomID, option, amount){
    switch(option){
      case '0':
        games[roomID].players[game.playerInAction].status = PlayerStatus.acted;
        games[roomID].nextPlayer();
        break;
      case '1':
        if(games[roomID].players[games[roomID].playerInAction].chips + games[roomID].players[games[roomID].playerInAction].bet  <= games[roomID].existingBet){
            games[roomID].players[games[roomID].playerInAction].status = PlayerStatus.allin;  
            games[roomID].players[games[roomID].playerInAction].bet += games[roomID].players[games[roomID].playerInAction].chips ;  
            games[roomID].players[games[roomID].playerInAction].chips = 0;
        }
        else{
            games[roomID].players[games[roomID].playerInAction].status = PlayerStatus.acted;
            games[roomID].players[games[roomID].playerInAction].chips -= games[roomID].existingBet -  games[roomID].players[games[roomID].playerInAction].bet;
            games[roomID].players[games[roomID].playerInAction].bet = games[roomID].existingBet;
        }
        games[roomID].nextPlayer();
        break;

      case '2':
        if(amountToRaise - games[roomID].existingBet < games[roomID].minimumRaise && amountToRaise - games[roomID].players[games[roomID].playerInAction].bet <=  games[roomID].players[games[roomID].playerInAction].chips){
          socket.emit('turnOfPlayer', games[roomID].playerInAction)
          break;
        }


        games[roomID].minimumRaise = amount
        //reset the status of all the player who still in the games[roomID]
        games[roomID].players = games[roomID].players.map((player)=>{
            if(player.status != PlayerStatus.fold && player.status != PlayerStatus.allin){
                player.status = PlayerStatus.waiting;
            }
            return player
        })

        if(amount - games[roomID].players[games[roomID].playerInAction].bet ==  games[roomID].players[games[roomID].playerInAction].chips){
            games[roomID].players[games[roomID].playerInAction].status = PlayerStatus.allin;
        }
        else{
            games[roomID].players[games[roomID].playerInAction].status = PlayerStatus.acted;
        }
        games[roomID].existingBet = amount;
        games[roomID].players[games[roomID].playerInAction].chips -= games[roomID].existingBet -  games[roomID].players[games[roomID].playerInAction].bet;
        games[roomID].players[games[roomID].playerInAction].bet = games[roomID].existingBet;

        games[roomID].nextPlayer();
        break;
      case '3':
        games[roomID].players[games[roomID].playerInAction].status = PlayerStatus.fold;
        games[roomID].nextPlayer();
        break;
    }

    //only one player left
    if(this.players.filter((player)=>(player.status==PlayerStatus.acted || player.status==PlayerStatus.waiting)).length == 1 
    && this.players.filter((player)=>(player.status==PlayerStatus.allin).length == 0)){
      games[roomID].resetStage();
      //new hand
    }

    //nextPlayer
    //skip allin and fold player
    while(games[roomID].players[games[roomID].playerInAction].status == PlayerStatus.allin || games[roomID].players[games[roomID].playerInAction].status == PlayerStatus.fold){
      games[roomID].nextPlayer();
    }
 
    //bet end
    if(games[roomID].players[games[roomID].playerInAction].status == PlayerStatus.acted){
      let stage = games[roomID].nextStage();
      if(stage == 5){
        //showhand
      }
      else{
        io.in(roomID).emit('requestOption', games[roomID].playerInAction, playerOptions(roomID))
      }

    }
    else{
      io.in(roomID).emit('requestOption', games[roomID].playerInAction, playerOptions(roomID))
    }

    // if(this.players.filter((player)=>(player.status==PlayerStatus.acted || player.status==PlayerStatus.waiting)).length == 1){
    //   alert(`No need for betting any more!`);
    //   return
    // }
  }

  function handleGameStart(roomID, err){
    if(games[roomID].players.length <2){
      err('Not enough player');
      return
    }
    //newhand
    games[roomID].nextStage() 
    //preflop
    games[roomID].nextStage() 
    io.in(roomID).emit('gameStart')

  

    io.in(roomID).emit('requestOption', games[roomID].players[games[roomID].playerInAction].socketID, playerOptions(roomID))
  }
})

function playerOptions(roomID){

  let nextPlayerOptions;
    if(games[roomID].existingBet == games[roomID].players[games[roomID].playerInAction].bet){
      nextPlayerOptions = 0;
    }
    else{
      nextPlayerOptions = 1;
    }
  return nextPlayerOptions
}
