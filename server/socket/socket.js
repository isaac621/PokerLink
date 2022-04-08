import { generateGame} from '../gameLogic/table.js'
import { generateRoomID, swap, sleep } from "../ultility.js";
import {PlayerStatus} from '../gameLogic/enumeration.js'
import { User } from '../mongoDB/model.js';

export default function socketInit(io, games){
    io.on("connection", socket=>{
        
        console.log(socket.id);
        
        socket.on('leaveGame', handleLeaveGame)
        socket.on('createRoom', handleCreateRoom);
        socket.on('joinRoom', handleJoinRoom);
        socket.on('leaveRoom', handleLeaveRoom);
        socket.on('option', handleOption);
        socket.on('gameStart', handleGameStart);
        socket.on('disconnect', handleDisconnect);
        socket.on('message', handleMessage)

        function handleMessage(name, text, room){
          console.log('received')
          socket.to(room).emit("chat", {sender: name, message: text})
        }

        function handleDisconnect(){
            console.log('disconnected')
        }
      
        async function handleCreateRoom(name, roomName){
          let roomID = generateRoomID(6);
          games[roomID] = generateGame(roomID, roomName, 8);
          socket.join(roomID);
          const user = await User.findOne({socketID: socket.id})
          const userId = user._id;
          user.roomID = roomID;
          user.isGaming = true;
          await user.save()
          games[roomID].addPlayer(userId, name, socket.id, true);
          console.log('room ' + roomID + ' created')
          socket.emit('enterRoom', games[roomID].sendRoomInfo())
        }
      
      
      
        async function handleJoinRoom(name, roomID){
          if(games.hasOwnProperty(roomID)){
            if(games[roomID].players.length < games[roomID].maxNumOfPlayers){
              socket.join(roomID);
              const user = await User.findOne({socketID: socket.id})
              
              const userId = user._id;
              user.roomID = roomID;
              user.isGaming = true;
              await user.save()
              games[roomID].addPlayer(userId, name, socket.id);
        
              io.to(roomID).emit('enterRoom', games[roomID].sendRoomInfo())
            }
            else{
              socket.emit('rejectJoinRoom', 'roomIsFull');
              console.log('roomIsFull')
            }
          }
          else{
            socket.emit('rejectJoinRoom', 'invalidRoomID');
          }
        }
      
        async function handleLeaveRoom(roomID, info){
          socket.leave(roomID);
          if(games[roomID].players.find(player=>player.socketID == socket.id).isHost == true && games[roomID].players.length >= 2){
      
            games[roomID].removePlayer(socket.id);
            games[roomID].players[0].isHost=true;
      
          }
          else{
            games[roomID].removePlayer(socket.id);
      
          }
          const user = await User.findOne({socketID: socket.id})
          user.isGaming =false;
          user.roomID = null;
          await user.save()
          info('You leave the room successfully')
      
          if(games[roomID].players.length == 0){
            //remove the room
          }
          io.to(roomID).emit('enterRoom', games[roomID].sendRoomInfo())
        }

        async function handleLeaveGame(roomID, cb){
          socket.leave(roomID);
          const user = await User.findOne({roomID: roomID})
          if(user){
            user.isGaming =false;
            user.roomID = null;
            await user.save()
          }
          cb()
        }
      
      
        function handleTimeOutOption(roomID, socketID){
          console.log(socketID)
          games[roomID].timeOut.socketID = socketID;
          console.log(new Date)
          handleOption(roomID, 'fold', 0, true);
        }
        
        async function handleOption(roomID, option, amount, timeOut = false){
          if(!timeOut){
            clearTimeout(games[roomID].timeOut.id);
            console.log('clearTimeout')
            games[roomID].timeOut.id = -1;
            games[roomID].timeOut.socketID =''
            socket.emit('optionReceived');
          }
          else{
            io.to(games[roomID].timeOut.socketID).emit('optionReceived');
            games[roomID].timeOut.id = -1;
            games[roomID].timeOut.socketID =''
            
          }
      
          
          switch(option){
            case 'check':
              games[roomID].players[games[roomID].playerInAction].status = PlayerStatus.acted;
              
              break;
            case 'call':
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
      
              break;
      
            case 'raise':
      
              games[roomID].minimumRaise = amount
              //reset the status of all the player who still in the games[roomID]
              games[roomID].players = games[roomID].players.map((player)=>{
                  if(player.status != PlayerStatus.fold && player.status != PlayerStatus.allin && player.status != PlayerStatus.out){
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
      
      
              break;
            case 'fold':
              games[roomID].players[games[roomID].playerInAction].status = PlayerStatus.fold;
      
      
      
              
              break;
          }
      
          games[roomID].nextPlayer();
            
          io.in(roomID).emit('updatePlayersInfo',  JSON.stringify(games[roomID].players.map((player)=>{
            return {
              bet: player.bet,
              chips: player.chips,
              status: player.status
            }
          })))
      
        
      
          //No need for betting
          if(games[roomID].players.filter((player)=>{
            return (player.status==PlayerStatus.acted || 
            player.status==PlayerStatus.waiting || 
            player.status==PlayerStatus.allin)}).length == 1 ){
            games[roomID].potCalculation();
            games[roomID].noPlayersCall();
            
            io.in(roomID).emit('updatePlayersInfo',  JSON.stringify(games[roomID].players.map((player)=>{
              return {
                bet: player.bet,
                chips: player.chips,
                status: player.status
              }
            })))
            io.in(roomID).emit('updateWinner', JSON.stringify(games[roomID].winner));
      
            
            newHand(roomID)
      
            return;
          }
      
          const numOfPlayersActed = games[roomID].players.filter((player)=>{return player.status==PlayerStatus.acted}).length
          const numOfPlayersWaiting = games[roomID].players.filter((player)=>{return player.status==PlayerStatus.waiting}).length
          const numOfPlayersAllin = games[roomID].players.filter((player)=>{ return player.status==PlayerStatus.allin}).length
          
          //Direct to Show Hand
          if(numOfPlayersWaiting == 0 && numOfPlayersActed < 2 && numOfPlayersAllin + numOfPlayersActed >= 2){
            const numOfStagesToShowHand = games[roomID].getNumOfStagesToShowHand()
            for(let i=0; i< numOfStagesToShowHand; i++){
                
      
                await sleep(500)
                games[roomID].potCalculation();
                games[roomID].nextStage();
          
                io.in(roomID).emit('updatePot', games[roomID].pot)
                io.in(roomID).emit('updatePlayersInfo',  JSON.stringify(games[roomID].players.map((player)=>{
                  return {
                    bet: player.bet,
                    chips: player.chips,
                    status: player.status
                  }
                })))
          
                io.in(roomID).emit('updateCommunityCards', JSON.stringify(games[roomID].communityCards));
          
                if(games[roomID].getStage() == 5){
                  io.in(roomID).emit('updateWinner', JSON.stringify(games[roomID].winner));
                  games[roomID].players.map((player, index)=>{
                    if(player.status != PlayerStatus.fold && player.status != PlayerStatus.out)
                    io.in(roomID).emit('updatePlayerHoleCards', 
                    JSON.stringify({
                      playerIndex: index,
                      holeCards: player.holeCards
                    }))
                  })
                  newHand(roomID)
                }
      
             
            }
      
            return;
          }
      
          //nextPlayer
          //skip allin and fold player
          while(games[roomID].players[games[roomID].playerInAction].status == PlayerStatus.allin || games[roomID].players[games[roomID].playerInAction].status == PlayerStatus.fold || games[roomID].players[games[roomID].playerInAction].status == PlayerStatus.out){
            console.log('stuck')
            games[roomID].nextPlayer();
            
          }
      
          //bet end
          if(games[roomID].players[games[roomID].playerInAction].status == PlayerStatus.acted){
            games[roomID].potCalculation();
      
            await sleep(500)
            games[roomID].nextStage();
      
            io.in(roomID).emit('updatePot', games[roomID].pot)
            io.in(roomID).emit('updatePlayersInfo',  JSON.stringify(games[roomID].players.map((player)=>{
              return {
                bet: player.bet,
                chips: player.chips,
                status: player.status
              }
            })))
      
            io.in(roomID).emit('updateCommunityCards', JSON.stringify(games[roomID].communityCards));
      
            if(games[roomID].getStage() == 5){
              io.in(roomID).emit('updateWinner', JSON.stringify(games[roomID].winner));
              games[roomID].players.map((player, index)=>{
                if(player.status != PlayerStatus.fold && player.status != PlayerStatus.out)
                io.in(roomID).emit('updatePlayerHoleCards', 
                JSON.stringify({
                  playerIndex: index,
                  holeCards: player.holeCards
                }))
                
              })
              newHand(roomID)
              return;
            }
            else{
              await sleep(500)
              io.in(roomID).emit('requestOption', games[roomID].players[games[roomID].playerInAction].socketID, playerOptions(roomID), games[roomID].minimumRaise, games[roomID].playerInAction, games[roomID].existingBet)
              games[roomID].timeOut.id = setTimeout(()=>handleTimeOutOption(roomID, games[roomID].players[games[roomID].playerInAction].socketID), 20000)
            }
      
          }
          else{
            io.in(roomID).emit('updatePlayersInfo',  JSON.stringify(games[roomID].players.map((player)=>{
              return {
                bet: player.bet,
                chips: player.chips,
                status: player.status
              }
            })))
            
            io.in(roomID).emit('requestOption', games[roomID].players[games[roomID].playerInAction].socketID, playerOptions(roomID), games[roomID].minimumRaise, games[roomID].playerInAction,  games[roomID].existingBet)
            games[roomID].timeOut.id = setTimeout(()=>handleTimeOutOption(roomID, games[roomID].players[games[roomID].playerInAction].socketID), 20000)
          }
      
      
        }
        function playerOptions(roomID){
      
          let nextPlayerOptions;
            if(games[roomID].existingBet == games[roomID].players[games[roomID].playerInAction].bet){
              nextPlayerOptions = {check: true, raise: true, fold: true, call: false};
            }
            else{
              nextPlayerOptions = {check: false, raise: true, fold: true, call: true};
            }
          return nextPlayerOptions
        }
        function handleGameStart(roomID, err){
          
          if(games[roomID].players.length <2){
            //not enoughPlayer
            return
          }
          //newhand
          (async()=>{
            await User.updateMany({roomID: roomID}, {isGaming: true})
          })()
          io.in(roomID).emit('gameStart', games[roomID].players)
          games[roomID].start()
          newHand(roomID)
          
        }
      
        async function newHand(roomID){
          console.log('New')
          clearTimeout(games[roomID].timeOut.id);
          games[roomID].timeOut.id = -1;
          games[roomID].timeOut.socketID =''
          console.log('ClearTimeOut')
          await sleep(3000)
          games[roomID].resetStage();
          games[roomID].eliminatePlayers()
      
          games[roomID].nextStage();
          io.in(roomID).emit('updatePot', games[roomID].pot)
          io.in(roomID).emit('updateCommunityCards', JSON.stringify(games[roomID].communityCards));
          games[roomID].players.map((player, index)=>{    
            io.in(roomID).emit('updatePlayerHoleCards', 
            JSON.stringify({
              playerIndex: index,
              holeCards: player.holeCards
            }))
          })
      
         
      
          //elinminate player before a hand start
          
      
          const playersSurvived = games[roomID].players.filter(player=>{
            return player.status != PlayerStatus.out;
          })
      
          if(playersSurvived.length == 1){
            //games end 
            io.in(roomID).emit('gameEnd', playersSurvived[0].name)
            
            const update = async()=>{
              const user = await User.updateMany({roomID: roomID},
                {
                roomID : null,
                isGaming : false})

              }
            update()
            io.in(roomID).socketsLeave(roomID)

            return;
          }
      
      
          //preflop
      
          games[roomID].nextStage() 
      
          games[roomID].players.map((player, index)=>{
        
            io.to(player.socketID).emit('updatePlayerHoleCards', 
            JSON.stringify({
              playerIndex: index,
              holeCards: player.holeCards
            }))
          })
       
          if(games[roomID].getPlayersNotOut().length > 2){
            io.in(roomID).emit('updateDealer', games[roomID].getPreviousPlayer(games[roomID].sbPosition));
          }else{
            io.in(roomID).emit('updateDealer', -1);
          }
      
          io.in(roomID).emit('updatePlayersInfo',  JSON.stringify(games[roomID].players.map((player)=>{
            return {
              bet: player.bet,
              chips: player.chips,
              status: player.status
            }
          })))
      
          io.in(roomID).emit('updateSb', games[roomID].minimumBet/2);
      
          io.in(roomID).emit('requestOption', games[roomID].players[games[roomID].playerInAction].socketID, playerOptions(roomID), games[roomID].minimumRaise, games[roomID].playerInAction,  games[roomID].existingBet)
          games[roomID].timeOut.id = setTimeout(()=>handleTimeOutOption(roomID, games[roomID].players[games[roomID].playerInAction].socketID), 20000)
        }
      })
      
}