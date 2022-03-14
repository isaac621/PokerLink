import {swap} from './ultility.js'
import poker from './poker.js'
import {PlayerStatus} from './enumeration.js'

function generatePlayer(name, chip = 200, socketID, isHost=false){
    return {
        name: name,
        chips: chip,
        bet: 0,
        status: PlayerStatus.waiting,
        pool: 0,
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

function generateGame(id, maxNumOfPlayers=4, initialChips=200, minimumBet=2){
    return ({
    ID: id,
    players: [],
    maxNumOfPlayers: maxNumOfPlayers,

    deck: [],
    communityCards: [],
    pot: [],
    initialChips: 200,
    minimumBet: 2,
    sbPosition: -1,
    existingBet: 0,
    minimumRaise: 0,

    stage: -1,
    
    playerInAction: 0,
    currentPot: 0,
    winner: -1,
    //template players

    addPlayer: function(name, socketID, isHost=false){
        this.players.push(generatePlayer(name, this.initialChips, socketID, isHost))
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

    nextStage: function(){
        this.stage++;
        if(this.stage>4){
            this.stage -= 6;
        }

        this.playerInAction = this.sbPosition;
        //reset the status of all player who still in the game
        this.players = this.players.map((player)=>{
            if(player.status != PlayerStatus.fold && player.status != PlayerStatus.allin){
                player.status = PlayerStatus.waiting;
                player.bet = 0;
            }
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
                    player.status = PlayerStatus.waiting;
                    player.bet = 0;
                    player.pool = 0;
                    player.holeCards = []
                    return player;
                });

                //reset the pot
                this.pot = [];

                //move the sbPosition to the next person
                this.sbPosition = this.sbPosition + 1 >= this.players.length ? this.sbPosition + 1 - this.players.length : this.sbPosition + 1;
                
                this.currentPot = 0;

                this.winner = -1;

                this.deck = poker.shuffle(poker.generateDeck());
                break;

            //preflop
            case 1:
                //deal the hole cards to each player
                const holeCards = poker.preflop(this.deck, this.players.length)
                for(let i = 0,  currPlayer; i < this.players.length; i++){
                    currPlayer = i + this.sbPosition >= this.players.length ? i + this.sbPosition - this.players.length : i + this.sbPosition;
                    console.log(holeCards)
                    this.players[currPlayer].holeCards.push(...holeCards[i])
                }

                //preflop bet condition
                this.existingBet = this.minimumBet
                this.players[this.sbPosition].bet = this.minimumBet*0.5;
                this.players[this.sbPosition].chips -= this.minimumBet*0.5;
    
                const bbPosition = this.sbPosition + 1 >= this.players.length ? this.sbPosition + 1 - this.players.length :  this.sbPosition + 1;
                this.players[bbPosition].bet = this.minimumBet;
                this.players[bbPosition].chips -= this.minimumBet;
                
                const utgPosition = bbPosition + 1 >= this.players.length ? bbPosition + 1 - this.players.length :  bbPosition + 1;
                this.playerInAction = utgPosition;
    
                this.minimumRaise = this.minimumBet

                break;
            //flop
            case 2:
                this.communityCards.push(poker.flop(this.deck));
                break;
            //turn:
            case 3:
                this.communityCards.push(poker.turnOrRiver(this.deck));
                break;
            //river:
            case 4:
                this.communityCards.push(poker.turnOrRiver(this.deck));
                break;
            //showHand:
            case 5: 
                const hands = this.players.reduce((prev, player, i)=> {
                    if(player.status < 3){
                        return{
                            playerIndex: i,
                            handValue: poker.generateRank([...player.holeCards, ...this.communityCards])
                        }
                    }else{
                        return prev
                    }
                },[])

                let firstWinners = true;
                //find the best hand first
                while(this.pot.find(e=>e>0)){ 
                    const bestHand = hands.reduce((prev, hand)=>{
                        if(hand.rank > prev.rank){
                            return hand
                        }
                        else if(hand.rank == prev.rank){
                            for(let i=0; i<5; i++){
                                if(hand.best5[i].number>prev.best5[i].number){
                                    return hand
                                }
                                else if(hand.best5[i].number<prev.best5[i].number){
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
                        if(hand.rank == bestHand.rank){
                            for(let i=0; i<5; i++){
                                if(hand.best5[i].number<prev.best5[i].number){
                                    return prev;
                                }
                            }

                            return [...prev, hand]
                        }
                    }, [])

                    winners = swap(winners, 0, 
                        winners.reduce((prev,winner,i)=>{
                        const seat = winner.playerIndex < this.sbPosition ? winner.playerIndex + this.players.length : winner.playerIndex;
                        if(seat < prev.seat){
                            return {
                                index: i,
                                seat: seat
                            }
                        }
                    }, {index: 0, seat: winners[0].playerIndex < this.sbPosition ? winners[0].playerIndex + this.players.length : winners[0].   playerIndex}).index)

                    this.potReallocation(winners);

                    if(firstWinners){
                        this.winner = winners
                    }
                }


        }

        return this.stage;
    },

    resetStage: function(){
        this.stage = -1;
    },

    nextPlayer: function(number=1){
        this.playerInAction+=number;
        if(this.playerInAction >= this.players.length){
            this.playerInAction -= this.players.length
        }
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
        for(let i=this.players[winners[0].playerIndex].pool; i>= 0; i--){
            totalChips += this.pot[i];
            this.pot[i] = 0;
        }

        winners.map((winner, i)=>{
            if(i == 0){
                this.players[winner.playerIndex].chips += totalChips % winners.length
            }
            this.players[winner.playerIndex].chips += Math.floor(totalChips / winners.length)
            this.players[winner.playerIndex].status = PlayerStatus.fold
        })
        
    },

    sendRoomInfo: function(){
        return JSON.stringify(
            {
                ID: this.ID,
                players: this.players
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
        //find the index of card to be swapped
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

    console.log(JSON.parse(JSON.stringify(playersInBet)))
    
    

    //main operation
    for(let i = 0; i < playersInBet.length;i++){
        //skip those player with 0 bet already
        if(playersInBet[i].bet == 0){
            continue;
        }
        let currentBet = playersInBet[i].bet;
        //update the player in bet
        newPlayersInBet = playersInBet.map((player)=>{

            
            
            if(player.bet >= currentBet){
                //player who fold his hand could not win the pot
                if(player.status == PlayerStatus.fold){
                    player.pool = -1;
                }
                else{
                    player.pool = currentPot;
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
            // split the pool
            currentPot ++
        }

        playersInBet = newPlayersInBet
        
    }
    
    return {currentPot, pot}
    
}

export {generateGame}