import {swap} from './ultility.js'
import { cardsCompare, generateRank } from './generateRank.js'

const suits = {
    spade: 0,
    heart: 1,
    club: 2,
    diamond: 3
}


function cardsShow(cards){

    console.log( cards.reduce((prev,e,i)=>{
        return [...prev, Object.keys(suits).find(key=>(cards[i].suit == suits[key])) + cards[i].number.toString()]
    },[]).join(" "))
}


function generateCard(suit, number)
{
    if(suit < 0 || suit > 3){
        console.error("please enter the valid suit in generateCard()")
        return;
    }
    
    if(number < 2 || number > 14){
        console.error("please enter the valid number in generateCard()")
        return;
    }

    return {
        suit: suit,
        number: number
    };
}

function generateDeck(){
    const deck = [];

    for(let suit=0; suit<=3; suit++){
        for(let number=2; number<=14; number++){
            deck.push(generateCard(suit, number));
        }
    }

    return deck;
}

function shuffle(deck){

    let randomIndex;
    let newDeck = deck;

    //using fish-yates shuffle
    for(let i = deck.length - 1; i>=0; i--){
        randomIndex = Math.floor(Math.random()*i);
        newDeck = swap(newDeck, i, randomIndex);
    }

    return newDeck;
}

function preflop(deck, NumOfPlayer){

    let holeCards = [];

    for(let i=0; i<2; i++){
        for(let j=0; j<NumOfPlayer; j++){
            if(i==0){
                holeCards.push([]);
            }
            holeCards[j].push(deck.shift());
        }
    }

    return holeCards;
}

function flop(deck){
    deck.shift();
    return deck.splice(0, 3);
}

function turnOrRiver(deck){
    deck.shift();
    return deck.splice(0, 1);
}



export default {generateDeck, shuffle, preflop, flop, turnOrRiver, cardsShow, cardsCompare, generateRank}
