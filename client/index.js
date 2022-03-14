

const socket = io('http://localhost:3000');

const client = {
    roomID: '',

    setRoomID: function(id){
        this.roomID = id;
    }
}
const Lobby = document.getElementById('lobby');
const WaitRoom = document.getElementById('waitRoom');
const GameRoom = document.getElementById('gameRoom');

//Lobby
const PlayerName = document.getElementById('playerName');
const CreateRoomBtn = document.getElementById('createRoom');
const RoomID = document.getElementById('roomID');
const JoinRoomBtn = document.getElementById('joinRoom');

//WaitRoom
const GameID = document.getElementById('gameID');
const WaitingPlayers = document.getElementById('waitingPlayers');
const StartBtn = document.getElementById('startGame');
const LeaveBtn = document.getElementById('leave');

//GameRoom
const Display = document.getElementById('display')
const Check = document.getElementById('check')
const Call = document.getElementById('call')
const Raise = document.getElementById('raise')
const Fold = document.getElementById('fold')

CreateRoomBtn.addEventListener('click', ()=>{
    if(PlayerName.value){
        socket.emit('createRoom', PlayerName.value)
        Lobby.classList.toggle('d-none');
        WaitRoom.classList.toggle('d-none');
    }
    else{
        alert('please enter your name');
    }
})

JoinRoomBtn.addEventListener('click', ()=>{
    if(PlayerName.value && RoomID.value){
        socket.emit('joinRoom', PlayerName.value, RoomID.value, (error)=>{
            Lobby.classList.toggle('d-none');
            WaitRoom.classList.toggle('d-none');
            alert(error);
        });
        Lobby.classList.toggle('d-none');
        WaitRoom.classList.toggle('d-none');
    }
    else{
        alert('please enter your name and roomID');
    }
})

LeaveBtn.addEventListener('click', ()=>{
    
    socket.emit('leaveRoom', client.roomID, (info)=>{
        Lobby.classList.toggle('d-none');
        WaitRoom.classList.toggle('d-none');
        alert(info);
        client.setRoomID('')
    });
})

StartBtn.addEventListener('click', ()=>{
    socket.emit("gameStart", client.roomID, (err)=>{alert(err)})
})

socket.on('enterRoom', handleEnterRoom);

function handleEnterRoom(roomJSON){
    let room = JSON.parse(roomJSON);
    client.setRoomID(room.ID)
    GameID.innerHTML = room.ID;
    WaitingPlayers.innerHTML = room.players.map(player=>{
        return `<li>${player.socketID==socket.id?'*YOU* ': ''}${player.isHost?'host: ': ''}${player.name}</li>`
    }).join(' ')

    if(room.players.find(e=>e.isHost==true).socketID == socket.id){
        StartBtn.classList.remove('d-none');
    }
    else{
        StartBtn.classList.add('d-none');
    }
}




socket.on('gameStart', handleGameStart)
// socket.on('preFlop')

socket.on('requestOption', handleRequestOption)

function handleGameStart(){
    GameRoom.classList.toggle('d-none');
    WaitRoom.classList.toggle('d-none');
}

function handleRequestOption(socketID, playerOptions){
    if(socketID == socket.id){
        switch(playerOptions){
            case 0:
                Check.classList.remove('d-none');
                Raise.classList.remove('d-none');
                Fold.classList.remove('d-none');
                break
            case 1:
                Call.classList.remove('d-none');
                Raise.classList.remove('d-none');
                Fold.classList.remove('d-none');
                break
        }

    }
}
// socket.on('turnOfOpponent')

