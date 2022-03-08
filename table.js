
///utility
function swap(arr, index1, index2){
    return arr.map((e,i)=>{
        if(i === index1) return arr[index2];
        if(i === index2) return arr[index1];
        return e
    })
}
////

const PlayerStatus = {
    waiting: 0,
    acted: 1,
    fold: 2,
    allin: 3
}

function generatePlayer(name, chip = 200){
    return {
        name: name,
        chips: chip,
        bet: 0,
        status: PlayerStatus.waiting,
        pool: 0,


    }
}

const table = {
    pot: [],
    existingBet: 0,
    playerInAction: 0,
    //template players
    players: [generatePlayer("a", 80), generatePlayer("b", 40), generatePlayer("c", 60), generatePlayer("d", 20), generatePlayer("e", 10)],
    minimumBet: 2,
    minimumRaise: 0,
    sbPosition: 0,
    currentPot: 0,
    winner: -1,

    setWinner: function(index){
        if(index < 0 || index >= this.players.length){
            console.log('Please enter the value within the valid range')
        }
        this.winner = index
    },
    
    newHand: function(){
        //reset players' state
        this.players = this.players.map((player)=>{
            player.status = PlayerStatus.waiting;
            player.bet = 0;
            player.pool = 0;
            return player;
        });

        //reset the pot
        this.pot = [];

        //move the sbPosition to the next person
        this.sbPosition = this.sbPosition + 1 >= this.players.length ? this.sbPosition + 1 - this.players.length : this.sbPosition + 1;

        this.currentPot = 0;

        this.winner = -1;
        
    },

    nextPlayer: function(number=1){
        this.playerInAction+=number;
        if(this.playerInAction >= this.players.length){
            this.playerInAction -= this.players.length
        }
    },

    bet: function(isPreFlop=false){
        let exit = false
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
            

        if(this.players.filter((player)=>(player.status==PlayerStatus.acted || player.status==PlayerStatus.waiting)).length == 1){
            alert(`No need for betting any more!`);
            return
        }

        if(this.pot.length == 0){
            this.pot = this.players.reduce((prev, e, i)=> {
                prev.push(0);
                return prev
            } , [])
        }
        if(isPreFlop){
            this.existingBet = this.minimumBet
            this.players[this.sbPosition].bet = this.minimumBet*0.5;
            this.players[this.sbPosition].chips -= this.minimumBet*0.5;

            const bbPosition = this.sbPosition + 1 >= this.players.length ? this.sbPosition + 1 - this.players.length :  this.sbPosition + 1;
            this.players[bbPosition].bet = this.minimumBet;
            this.players[bbPosition].chips -= this.minimumBet;
            
            const utgPosition = bbPosition + 1 >= this.players.length ? bbPosition + 1 - this.players.length :  bbPosition + 1;
            this.playerInAction = utgPosition;

            this.minimumRaise = this.minimumBet

        }
        while(this.players[this.playerInAction].status != PlayerStatus.acted && !exit){
            if(this.players[this.playerInAction].status == PlayerStatus.allin || this.players[this.playerInAction].status == PlayerStatus.fold){
                this.nextPlayer();
                continue;
            }
            let playerAction = prompt(`${this.players[this.playerInAction].name} Option \n
            *Your chips: ${this.players[this.playerInAction].chips} \n
            *existingBet: ${this.existingBet}\n
            *name: ${this.players[0].name} ${this.players[1].name} ${this.players[2].name} ${this.players[3].name} ${this.players[4].name}\n
            *status:: waiting: 0, acted: 1, fold: 2, allin: 3
            *status: ${this.players[0].status} ${this.players[1].status} ${this.players[2].status} ${this.players[3].status} ${this.players[4].status}\n
            *bet: ${this.players[0].bet} ${this.players[1].bet} ${this.players[2].bet} ${this.players[3].bet} ${this.players[4].bet}\n
            *options:: ${this.existingBet==this.players[this.playerInAction].bet ? '0: check, 2: raise, 3: fold, 4: exit' : 
                '1: call, 2: raise, 3: fold, 4: exit'}`);
            /*
            0: check
            1: call
            2: raise
            3: fold
            4: exit
            */
            switch(playerAction){
                case '0':
                    this.players[this.playerInAction].status = PlayerStatus.acted;
                    this.nextPlayer();
                    break;
                case '1':
                    if(this.players[this.playerInAction].chips + this.players[this.playerInAction].bet  <= this.existingBet){
                        this.players[this.playerInAction].status = PlayerStatus.allin;  
                        this.players[this.playerInAction].bet += this.players[this.playerInAction].chips ;  
                        this.players[this.playerInAction].chips = 0;
                    }
                    else{
                        this.players[this.playerInAction].status = PlayerStatus.acted;
                        this.players[this.playerInAction].chips -= this.existingBet -  this.players[this.playerInAction].bet;
                        this.players[this.playerInAction].bet = this.existingBet;
                    }
                    this.nextPlayer();
                    break;

                case '2':
                    let amountToRaise = 0;
                    //repeat until the amount of raising is larger than or equal to the minimum raise
                    do{
                        amountToRaise = parseInt(prompt(`please enter the amount you want to raise to\n 
                        existingBet: ${this.existingBet}\n
                        minimumRaise: ${this.minimumRaise}`));
                        if(amountToRaise == -1){
                            break;
                        }
                    }while(amountToRaise - this.existingBet < this.minimumRaise && amountToRaise - this.players[this.playerInAction].bet <=  this.players[this.playerInAction].chips)

                    if(amountToRaise == -1){
                        break;
                    }

                    this.minimumRaise = amountToRaise
                    //reset the status of all the player who still in the game
                    this.players = this.players.map((player)=>{
                        if(player.status != PlayerStatus.fold && player.status != PlayerStatus.allin){
                            player.status = PlayerStatus.waiting;
                        }
                        return player
                    })

                    if(amountToRaise - this.players[this.playerInAction].bet ==  this.players[this.playerInAction].chips){
                        this.players[this.playerInAction].status = PlayerStatus.allin;
                    }
                    else{
                        this.players[this.playerInAction].status = PlayerStatus.acted;
                    }
                    this.existingBet = amountToRaise;
                    this.players[this.playerInAction].chips -= this.existingBet -  this.players[this.playerInAction].bet;
                    this.players[this.playerInAction].bet = this.existingBet;

                    this.nextPlayer();
                    break;
                case '3':
                    this.players[this.playerInAction].status = PlayerStatus.fold;
                    this.nextPlayer();
                    break;
                case '4':
                    exit = true;
                    break;

           }
            if(this.players.filter((player)=>(player.status==PlayerStatus.acted || player.status==PlayerStatus.waiting)).length == 1 
            && this.players.filter((player)=>(player.status==PlayerStatus.allin).length == 0)){
                alert(`No need for betting any more!`)
                break;
            }
        }
        let {currentPot, pot} = potSplitting(this.players, this.currentPot)

            this.currentPot = currentPot;
            this.pot = this.pot.map((e,i)=>{
                return e + pot[i]
            })

            //Show the pot
            console.log(this.pot);
    },

    potReallocation: function(winner){
        for(let i=this.players[winner].pool; i>= 0; i--){
            this.players[winner].chips += this.pot[i];
            this.pot[i] = 0;
        }
        this.players[winner].status = PlayerStatus.fold
    }
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

