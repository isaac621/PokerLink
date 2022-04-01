import {swap} from '../ultility.js'
import poker from './poker.js'
import {PlayerStatus} from './enumeration.js'

function generatePlayer(id, name, chip = 200, socketID, isHost=false){
    return {
        id: id,
        name: name,
        chips: chip,
        bet: 0,
        status: PlayerStatus.idle,
        pot: 0,
        holeCards: [],
        socketID: socketID,
        isHost: isHost,
        

        setHoleCards: function(holeCards){
            this.holeCards.push([...holeCards])
        },

        setSocketID: function(socketID){
            this.socketID = socketID;
        },

        setHost: function(bool){
            this.isHost = bool
        }
    }
}

function generateGame(id, roomName, maxNumOfPlayers=8, initialChips=200, minimumBet=2){
    return ({
    ID: id,
    name: roomName,
    players: [],
    maxNumOfPlayers: maxNumOfPlayers,

    deck: [],
    communityCards: [],
    pot: [],
    initialChips: 200,
    minimumBet: 2,
    sbPosition: -1,
    bbPosition: 0,
    existingBet: 0,
    minimumRaise: 0,

    stage: -1,
    timeOut:{id: -1, socketID:''},
    
    playerInAction: 0,
    currentPot: 0,
    winner: -1,

    started: false,
    //template players
    start: function(){
        this.started = true;
    },
    addPlayer: function(userID, name, socketID, isHost=false){
        this.players.push(generatePlayer(userID, name, this.initialChips, socketID, isHost))
    },

    removePlayer: function(socketID){
        this.players.splice(this.players.findIndex(player=>player.socketID == socketID),1);
    },

    setWinner: function(index){
        if(index < 0 || index >= this.players.length){
            console.log('Please enter the value within the valid range')
        }
        this.winner = index
    },

    eliminatePlayers: function(){
        //eliminate the players with no chips left
        this.players = this.players.map((player, index)=>{
            if(player.chips == 0){
                player.status = PlayerStatus.out
                
            }
            return player;
        })
    },

    getNextPlayer: function(currentPlayerIndex){
        let nextPlayerIndex= currentPlayerIndex + 1 >= this.players.length ? currentPlayerIndex + 1 - this.players.length : currentPlayerIndex + 1;
        //move the small blind to the next player if the current small blind player is out
        while(this.players[nextPlayerIndex].status == PlayerStatus.out){
            nextPlayerIndex = nextPlayerIndex + 1 >= this.players.length ? nextPlayerIndex + 1 - this.players.length : nextPlayerIndex + 1;
        }

        return nextPlayerIndex;
    },

    getPreviousPlayer: function(currentPlayerIndex){
        let previousPlayerIndex= currentPlayerIndex - 1 < 0 ? currentPlayerIndex - 1 + this.players.length : currentPlayerIndex - 1;
        //move the small blind to the next player if the current small blind player is out
        while(this.players[previousPlayerIndex].status == PlayerStatus.out){
            previousPlayerIndex= previousPlayerIndex - 1 < 0 ? previousPlayerIndex - 1 + this.players.length : previousPlayerIndex - 1;
        }

        return previousPlayerIndex;
    },

    getPlayersNotOut: function(){
        return this.players.filter((player)=>{
            return player.status != PlayerStatus.out
        })
    },

    getNumOfStagesToShowHand: function(){
        return 5 - this.stage
    },

    getStage: function(){
        return this.stage;
    },

    nextStage: function(){


        this.stage++;
        if(this.stage>5){
            this.stage -= 7;
        }

        this.playerInAction = this.sbPosition;
        //reset the status of all player who still in the game
        this.players = this.players.map((player)=>{
            if(player.status != PlayerStatus.fold && player.status != PlayerStatus.allin && player.status != PlayerStatus.out){
                player.status = PlayerStatus.waiting;     
            }
            player.bet = 0;
            return player
        })

        //reset the bet of the game
        this.minimumRaise = 0;
        this.existingBet = 0;

        //reset the pot
        if(this.pot.length == 0){
            this.pot = this.players.reduce((prev, e, i)=> {
                prev.push(0);
                return prev
            } , [])
        }

        switch(this.stage){

            //newHand
            case 0:
                //reset players' state
                this.players = this.players.map((player)=>{
                    if(player.status != PlayerStatus.out){
                        player.status = PlayerStatus.waiting;
                    }
                    player.bet = 0;
                    player.pot = 0;
                    player.holeCards = []
                    return player;
                });

                //reset the pot
                this.pot = [];
                //reset the communityCards
                this.communityCards = []
                this.minimumRaise = 0
                
                this.currentPot = 0;

                this.winner = -1;

                this.deck = poker.shuffle(poker.generateDeck());
                break;

            //preflop
            case 1:
                this.players = this.players.map((player)=>{
                    if(player.status != PlayerStatus.out){
                        player.status = PlayerStatus.waiting;
                    }
                    player.bet = 0;
                    player.pot = 0;
                    player.holeCards = []
                    return player;
                });
                //preflop bet condition
                this.existingBet = this.minimumBet

                if( this.sbPosition != this.bbPosition){
                    this.sbPosition = this.getNextPlayer(this.sbPosition)
                    this.bbPosition = this.getNextPlayer(this.bbPosition)
                }
                else{
                    this.bbPosition = this.getNextPlayer(this.bbPosition)
                }
               

                //small blind operation
                if( this.sbPosition != this.bbPosition){
                    this.players[this.sbPosition].bet = this.minimumBet*0.5;
                    this.players[this.sbPosition].chips -= this.minimumBet*0.5;
                }

                //big blind operation
                this.players[this.bbPosition].bet = this.minimumBet;
                this.players[this.bbPosition].chips -= this.minimumBet;
                
                //get utg position
                const utgPosition = this.getNextPlayer(this.bbPosition)
                this.playerInAction = utgPosition;
    
                this.minimumRaise = this.minimumBet

               

                //deal the hole cards to each player
                const holeCards = poker.preflop(this.deck, this.getPlayersNotOut().length)
                for(let i = 0,  currPlayer = this.sbPosition; i < this.getPlayersNotOut().length; i++){
                    
                    this.players[currPlayer].holeCards.push(...holeCards[i])

                    currPlayer = this.getNextPlayer(currPlayer);
                }

                break;
            //flop
            case 2:

                
                this.communityCards.push(...poker.flop(this.deck));
                break;
            //turn:
            case 3:

                
                this.communityCards.push(...poker.turnOrRiver(this.deck));
                break;
            //river:
            case 4:


                this.communityCards.push(...poker.turnOrRiver(this.deck));
                break;
            //showHand:
            case 5: 

                const hands = this.players.reduce((prev, player, i)=> {
                
                    if(player.status < 3){
                        return [...prev, {
                            playerIndex: i,
                            handValue: poker.generateRank([...player.holeCards, ...this.communityCards])
                        }]
                    }else{
                        return prev
                    }
                },[])

                let firstWinners = true;
                //find the best hand first
                
                while(this.pot.find(e=>e>0)){ 
                    const bestHand = hands.reduce((prev, hand)=>{
                        if(hand.handValue.rank > prev.handValue.rank){
                            return hand
                        }
                        else if(hand.handValue.rank == prev.handValue.rank){
                            for(let i=0; i<5; i++){
                                if(hand.handValue.best5[i].number>prev.handValue.best5[i].number){
                                    return hand
                                }
                                else if(hand.handValue.best5[i].number<prev.handValue.best5[i].number){
                                    break;
                                }
                            }
                            return prev
                        }
                        else{
                            return prev
                        }
                    
                    }, hands[0])

                    const winners = hands.reduce((prev, hand)=>{
                        if(hand.handValue.rank == bestHand.handValue.rank){
                            for(let i=0; i<5; i++){
                                if(hand.handValue.best5[i].number < bestHand.handValue.best5[i].number){
                                    return prev;
                                }
                            }
                        
                            return [...prev, hand]
                        }
                        return prev
                    }, [])

                    let winnerIndexClosestToDealer = winners.reduce((prev,winner,i)=>{
                        const seat = winner.playerIndex < this.sbPosition ? winner.playerIndex + this.players.length : winner.playerIndex;
                        if(seat < prev.seat){
                            return {
                                index: i,
                                seat: seat
                            }
                        }
                        return prev;
                    }, {index: 0, seat: winners[0].playerIndex < this.sbPosition ? winners[0].playerIndex + this.players.length : winners[0].playerIndex})

                    const finalWinners = swap(winners, 0, winnerIndexClosestToDealer.index)

                    

                    this.potReallocation(finalWinners);

                    if(firstWinners){
                        this.winner = finalWinners
                    }
                }


        }

        return this.stage;
    },

    resetStage: function(){
        this.stage = -1;
    },

    noPlayersCall: function(){

       
        const winner = this.players.reduce((prev, player, i)=>{
            if(player.status==PlayerStatus.acted || player.status==PlayerStatus.waiting || player.status == PlayerStatus.allin){
                return [{
                    playerIndex: i,
                }]
            }
            return prev
        }, [])

        
        this.winner = winner
        this.potReallocation(winner)
        
        
        this.resetStage()
    },

    nextPlayer: function(){
        this.playerInAction = this.getNextPlayer(this.playerInAction)
    },

    potCalculation: function(){
        let {currentPot, pot} = potSplitting(this.players, this.currentPot)
        this.currentPot = currentPot;
        this.pot = this.pot.map((e,i)=>{
            return e + pot[i]
        })
    },

    potReallocation: function(winners){
        let totalChips = 0;
        for(let i=this.players[winners[0].playerIndex].pot; i>= 0; i--){
            totalChips += this.pot[i];
            this.pot[i] = 0;
        }
        
        winners.map((winner, i)=>{
            if(i == 0){
                this.players[winner.playerIndex].chips += totalChips % winners.length
            }
            this.players[winner.playerIndex].chips += Math.floor(totalChips / winners.length)
            this.players[winner.playerIndex].status = PlayerStatus.win
        })
    },

    sendRoomInfo: function(){
       
        return JSON.stringify(
            {
                ID: this.ID,
                name: this.name,
                players: this.players
            }
        )
    },

    sendReconnectRoomInfo: function(socketID){
       
        return JSON.stringify(
            {
                ID: this.ID,
                name: this.name,
                players: this.players.map((player)=>{
                    if(player.socketID != socketID){
                        player.holeCards = []
                    }
                    return player
                })
            }
        )
    }
})
}


function potSplitting(players, currentPot = 0){

    // initialize the pot
    let pot = players.reduce((prev, e, i)=> {
        prev.push(0);
        return prev
    } , [])

    
    //sort the players accroding their size of bet in this round
    let playersInBet = players.reduce((prev1, e1, i1)=>{
        
        let target = prev1.reduce((prev2, e2, i2)=>{
            if(i2 < i1) return prev2;
            if(e2.bet < prev2.player.bet){
                return {
                    index: i2,
                    player: e2
                }
            }
            else{
                return prev2;
            }
        }, {index: i1, player: prev1[i1]}).index;

        return swap(prev1, i1, target);
    }, [...players])

    

    //main operation
    for(let i = 0; i < playersInBet.length;i++){
        //skip those player with 0 bet already
        if(playersInBet[i].bet == 0){
            continue;
        }
        let currentBet = playersInBet[i].bet;
        //update the player in bet
        const newPlayersInBet = playersInBet.map((player)=>{

            
            
            if(player.bet >= currentBet){
                //player who fold his hand could not win the pot
                if(player.status == PlayerStatus.fold){
                    player.pot = -1;
                }
                else{
                    player.pot = currentPot;
                }

                player.bet -= currentBet;
                pot[currentPot] += currentBet;
                return player
            }
            else{
                return player
            }
        })
        
        if(playersInBet[i].status == PlayerStatus.allin){
            // split the pot
            currentPot ++
        }

        playersInBet = newPlayersInBet
        
    }
    
    return {currentPot, pot}
    
}

export {generateGame}