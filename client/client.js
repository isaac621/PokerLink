

const socket = io('http://localhost:3000');

const suits = {
    spade: 0,
    heart: 1,
    club: 2,
    diamond: 3
}

const PlayerStatus = {
    waiting: 0,
    acted: 1,
    allin: 2,
    fold: 3,
    win: 4,
    out: 5,
   
}

const client = {
    roomID: '',
    players: [],
    gameRoom: {
        communityCards: [],
        players: [],
        minimumRaise: 0,
        playerInAction: -1,
        existingBet: 0,
        pot: [],
        dealer: -1,

        setID: function(id){
            this.id = id;
        },

        setCommunityCards: function(communityCards){
            this.communityCards = communityCards;
        },

        setPlayers: function(players){
            this.players = players
        },

        setMinimumRaise: function(minimumRaise){
            this.minimumRaise = minimumRaise
        },

        setPlayerInAction: function(playerIndex){
            this.playerInAction = playerIndex
        },

        setExistingBet: function(bet){
            this.existingBet = bet
        },

        setPot: function(pot){
            this.pot = pot
        },

        setDealer: function(dealer){
            this.dealer = dealer
        },

        getPlayerInAction: function(){
            return this.players[this.playerInAction]
        },

        updatePlayers: function(newData){
            this.players = this.players.map((player, index)=>{
                return{
                    ...player, ...newData[index]
                }
            })
        },

        setHoleCards: function(playerIndex, holeCards){
            if(playerIndex >= this.players.length){
                console.log('invalid playerIndex')
                return
            }
            this.players[playerIndex].holeCards = holeCards;
        },

        showHoleCards: function(playerIndex){
            return this.players[playerIndex].holeCards.reduce((prev,card,i)=>{
                return [...prev, Object.keys(suits).find(key=>(card.suit == suits[key])) + card.number.toString()]
            },[]).join(" ")
        },

        showPlayerStatus: function(playerIndex){
            return Object.keys(PlayerStatus).find(key=>(this.players[playerIndex].status == PlayerStatus[key]))
        },

        showCommunityCards: function(){
            return this.communityCards.reduce((prev,card,i)=>{
                return [...prev, Object.keys(suits).find(key=>(card.suit == suits[key])) + card.number.toString()]
            },[]).join(" ")
        },

        showPot: function(){
            return this.pot.join(" ")
        },

        resetGameRoom: function(){
            this.communityCards = []
            this.players = []
            this.minimumRaise = 0
            this.playerInAction = -1
            this.existingBet = 0
            this.pot = []
        }
    },



    
}
const Lobby = document.getElementById('lobby');
const WaitRoom = document.getElementById('waitRoom');
const GameRoom = document.getElementById('gameRoom');
const EndingScreen = document.getElementById('endingScreen');

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

const CommunityCards = document.getElementById('communityCards')
const MinimumRaise = document.getElementById('minimumRaise')
const Winner = document.getElementById('winner')
const Players = document.getElementById('players')
const Pot = document.getElementById('pot')

const Check = document.getElementById('check')
const Call = document.getElementById('call')
const Raise = document.getElementById('raise')
const Fold = document.getElementById('fold')
const CheckBtn = document.getElementById('checkBtn')
const CallBtn = document.getElementById('callBtn')
const RaiseBtn = document.getElementById('raiseBtn')
const AmountToRaise = document.getElementById('amountToRaise')
const FoldBtn = document.getElementById('foldBtn')

//LeaderBoard
const Champion = document.getElementById('champion')
const BackToLobbyBtn = document.getElementById('backToLobbyBtn')

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
    
    socket.emit('leaveRoom', client.gameRoom.id, (info)=>{
        Lobby.classList.toggle('d-none');
        WaitRoom.classList.toggle('d-none');
        alert(info);
        client.gameRoom.setID('')
    });
})

StartBtn.addEventListener('click', ()=>{
    socket.emit("gameStart", client.gameRoom.id, (err)=>{alert(err)})
})

CheckBtn.addEventListener('click', ()=>{
    socket.emit("option", client.gameRoom.id, 'check', 0)
})

CallBtn.addEventListener('click', ()=>{
    socket.emit("option", client.gameRoom.id, 'call', 0)
})

RaiseBtn.addEventListener('click', ()=>{

    if(!!!AmountToRaise.value){
        alert('please raise to a suitable amount of chips');
        return;
    }

    let playerInAction = client.gameRoom.getPlayerInAction();
    //reject the raise action when the amount to raise is less than the minimum raise and not a all in action
    if((AmountToRaise.value - client.gameRoom.existingBet < client.gameRoom.minimumRaise && AmountToRaise.value - playerInAction.bet < playerInAction.chips) || AmountToRaise.value - playerInAction.bet > playerInAction.chips){
        alert('please raise to a suitable amount of chips');
        AmountToRaise.value = ''
        return;
    }
    socket.emit("option", client.gameRoom.id, 'raise', parseInt(AmountToRaise.value))
    AmountToRaise.value = ''

})

FoldBtn.addEventListener('click', ()=>{
    socket.emit("option", client.gameRoom.id, 'fold', 0)
})

BackToLobbyBtn.addEventListener('click', ()=>{
    EndingScreen.classList.add('d-none')
    Lobby.classList.remove('d-none');
    GameRoom.classList.add('d-none');
    WaitRoom.classList.add('d-none');
})

socket.on('enterRoom', handleEnterRoom);
socket.on('gameStart', handleGameStart)
socket.on('requestOption', handleRequestOption)
socket.on('optionReceived', handleOptionReceived)
socket.on('updatePlayerHoleCards', handleupdatePlayerHoleCards)
socket.on('updatePlayersInfo', handleUpdatePlayersInfo)
socket.on('updateCommunityCards', handleUpdateCommunityCards)
socket.on('updateWinner', handleUpdateWinner)
socket.on('updatePot', handleUpdatePot)
socket.on('updateDealer', handleUpdateDealer)

socket.on('gameEnd', handleGameEnd)

function handleEnterRoom(roomJSON){
    let room = JSON.parse(roomJSON);
    client.gameRoom.setID(room.ID)
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


function handleGameStart(players){
    GameRoom.classList.toggle('d-none');
    WaitRoom.classList.toggle('d-none');

    client.gameRoom.setPlayers(players);

    updatePlayersInfoDisplay()
    
}

function updatePlayersInfoDisplay(){
    Players.innerHTML = client.gameRoom.players.map((player, index)=>{

        return `
        <div id="player-${index}" class="player bg-light d-flex flex-column mx-4 ${index == client.gameRoom.dealer ? 'text-danger' : ''}">
            <H4>${player.name}</H4>
            <ul>
                <li>bet: ${player.bet}</li>
                <li>chips: ${player.chips}</li>
                <li>card: ${player.holeCards.length != 0 ? client.gameRoom.showHoleCards(index) :'x x'}</li>
                <li>status: ${client.gameRoom.showPlayerStatus(index)}</li>
            </ul>
        </div>
        `
    }).join(' ');
}

function handleRequestOption(socketID, playerOptions, minimumRaise, playerInAction, existingBet){

 
    client.gameRoom.setMinimumRaise(minimumRaise);
    client.gameRoom.setPlayerInAction(playerInAction);
    client.gameRoom.setExistingBet(existingBet);

    MinimumRaise.innerHTML = client.gameRoom.minimumRaise
    document.querySelectorAll('.class').forEach((e)=>{
        e.classList.remove('border', 'border-primary')
    })
    document.getElementById(`player-${playerInAction}`).classList.add('border', 'border-primary')


    if(socketID == socket.id){
        switch(playerOptions){
            case 0:
                Check.classList.remove('d-none');
                Raise.classList.remove('d-none');
                Fold.classList.remove('d-none');
                Call.classList.add('d-none');
                break
            case 1:
                Call.classList.remove('d-none');
                Raise.classList.remove('d-none');
                Fold.classList.remove('d-none');
                Check.classList.add('d-none')
                break
        }

    }
}

function handleUpdateCommunityCards(communityCards){
    communityCards = JSON.parse(communityCards)
    client.gameRoom.setCommunityCards(communityCards);

    CommunityCards.innerHTML = client.gameRoom.showCommunityCards()

    //update the community cards
}


function handleUpdatePlayersInfo(newPlayersData){
    newPlayersData = JSON.parse(newPlayersData)
    client.gameRoom.updatePlayers(newPlayersData)
    updatePlayersInfoDisplay()
}

function handleupdatePlayerHoleCards(updateData){
    updateData = JSON.parse(updateData)
    client.gameRoom.setHoleCards(updateData.playerIndex, updateData.holeCards)
    updatePlayersInfoDisplay()
}

function handleOptionReceived(){
    Call.classList.add('d-none');
    Raise.classList.add('d-none');
    Fold.classList.add('d-none');
    Check.classList.add('d-none')
}

function handleUpdateWinner(winners){
    winners = JSON.parse(winners)
    Winner.innerHTML = winners.map((winner)=>{
        return client.gameRoom.players[winner.playerIndex].name
    }).join(' ')
}

function handleUpdatePot(pot){
    client.gameRoom.setPot(pot)
    Pot.innerHTML = client.gameRoom.showPot()
}

function handleGameEnd(championName){
    EndingScreen.classList.remove('d-none')
    Lobby.classList.add('d-none');
    GameRoom.classList.add('d-none');
    WaitRoom.classList.add('d-none');
    Champion.innerHTML = championName

    client.gameRoom.resetGameRoom();

}

function handleUpdateDealer(dealerPosition){
    client.gameRoom.setDealer(dealerPosition);
    document.querySelectorAll('.class').forEach((e)=>{
        e.classList.remove('text-danger')
    })
    console.log(client.gameRoom.dealer, dealerPosition)

}

