import {swap} from './ultility.js'
import { Suits } from './enumeration.js';


/***********
number:
    A: 14
    K: 13
    Q: 12
    J: 11
    T: 10
    9: 9
    8: 8
    7: 7
    6: 6
    5: 5
    4: 4
    3: 3
    2: 2
**************/





const cardsSort = (cards) =>
{

    //sorting the cards from their number
    const cards_inNumber = cards.reduce((prev1, e1, i1)=>{
        //find the index of card to be swapped
        
        let target = prev1.reduce((prev2, e2, i2)=>{
            if(i2 < i1) return prev2;
            if(e2.number > prev2.card.number){
                return {
                    index: i2,
                    card: e2
                }
            }
            else{
                return prev2;
            }
        }, {index: i1, card: prev1[i1]}).index;

        return swap(prev1, i1, target);
    }, cards)
    
    //sorting the cards from their suits
    const cards_inSuit = cards_inNumber.reduce((prev1, e1, i1)=>{
        //find the index of card to be swapped
        let target = prev1.reduce((prev2, e2, i2)=>{
            if(i2 < i1) return prev2;
            if(e2.suit < prev2.card.suit && e2.number == prev2.card.number){
                return {
                    index: i2,
                    card: e2
                }
            }
            else{
                return prev2;
            }
        }, {index: i1, card: prev1[i1]}).index

        return swap(prev1, i1, target);
    }, cards_inNumber)
    
        
    
    
    cardsShow(cards_inSuit);
    return cards_inSuit;
}

const HandValueUtilities = {
    numberOfAKind: function(cards){
        return cards.reduce((prev, cardBeChecked, index)=>{
            let {arr, checkedNumber} = prev;

            if(checkedNumber.find((e)=> e == cardBeChecked.number)){
                arr.push(0);
                return {arr, checkedNumber}
            }
            else{

                checkedNumber.push(cardBeChecked.number);

                //caculate the number of cards in the 7 cards which have the same number of the card is checking
                arr.push(cards.filter((card, index)=>{
                    return cardBeChecked.number == card.number
                }).length);

                return {arr, checkedNumber};
            }
        }, {arr: [], checkedNumber: []}).arr;
    },
    numberOfASuit: function(cards){


        const countsOfSuits = cards.reduce((prev, {suit}, cardIndex)=>{
            prev[suit]++
            return prev
        }, [0, 0, 0, 0])

        return countsOfSuits
    }
}

/************************
 *  High
 ******************************/
function high(cards){
    return cards.slice(0, 5);
}

/************************
 *  Pair
 ******************************/
function pair(cards){
    const numberOfAKind = HandValueUtilities.numberOfAKind(cards);
    const indexOfTwo = numberOfAKind.findIndex(counts => counts == 2);

    if(indexOfTwo == -1){
        return [];
    }
    else if(indexOfTwo == 0){
        return cards.slice(0, 5);
    }
    else if(indexOfTwo == 1){
        return [...cards.slice(indexOfTwo, indexOfTwo+2), cards[0], cards[3], cards[4]];
    }
    else if(indexOfTwo == 2){
        return [...cards.slice(indexOfTwo, indexOfTwo+2), cards[0], cards[1], cards[4]];
    }
    else{
        return [...cards.slice(indexOfTwo, indexOfTwo+2), cards[0], cards[1], cards[2]];
    }


}
/************************
 *  Two Pair
 ******************************/
 function twoPair(cards){
    const numberOfAKind = HandValueUtilities.numberOfAKind(cards);
    const indexOfTwos = numberOfAKind.reduce((prev, counts, index)=> {
        if(counts == 2){
            return [...prev, index];
        }
        return prev;
        
    }, []);

    if(indexOfTwos.length < 2){
        return [];
    }
    else if(indexOfTwos[0] == 0 && indexOfTwos[1] == 2){
        return cards.slice(0, 5);
    }
    else if(indexOfTwos[0] == 0 && indexOfTwos[1] != 2){
        return [...cards.slice(indexOfTwos[0], indexOfTwos[0]+2), ...cards.slice(indexOfTwos[1], indexOfTwos[1]+2), cards[2]];
    }
    else{
        return [...cards.slice(indexOfTwos[0], indexOfTwos[0]+2), ...cards.slice(indexOfTwos[1], indexOfTwos[1]+2), cards[0]];
    }
}

/************************
 *  Three of A Kind
 ******************************/
function threeOfAKind(cards){
    const numberOfAKind = HandValueUtilities.numberOfAKind(cards);
    const indexOfThree = numberOfAKind.findIndex(counts => counts == 3);

    if(indexOfThree == -1){
        return []
    }
    else if(indexOfThree == 0){
        return [...cards.slice(indexOfThree, indexOfThree+3), cards[3], cards[4]]
    }
    else if(indexOfThree == 1){
        return [...cards.slice(indexOfThree, indexOfThree+3), cards[0], cards[4]]
    }
    else {
        return [...cards.slice(indexOfThree, indexOfThree+3), cards[0], cards[1]]
    }
}

/************************
 *  Straight
 ******************************/
function straightCards(cards){
    //corner case for the ['A', '2', '3', '4', '5']

    return cards.reduce((prev1, e, index1)=>{
        let straightCards = cards.reduce((prev2,card, index2)=>{
            //skip the element if it has been checked as the start of the straight
            if(index2 < index1){
                return []
            }

            //initalize the first number of the straight
            if(index1 == index2){
                prev2.push(card);
                return prev2
            }
            else if(card.number == prev2[prev2.length-1].number - 1){
                prev2.push(card);
                return prev2
            }
            else{
                return prev2
            }
        },[]);
        
        if(straightCards.length == 4 && cards[0].number == 14){
            straightCards.push(cards[0])
        }

        if(straightCards.length >= 5 && straightCards.length > prev1.length){
            return straightCards;
        }
        else if(prev1.length != 0){
            return prev1
        }
        else{
            return []
        }
        
    }, []).slice(0, 5);

}

function straight(cards){
    return straightCards(cards).slice(0, 5);
}

/************************
 *  Flush
 ******************************/

function flushCards(cards){
    const countsOfSuit = HandValueUtilities.numberOfASuit(cards);
    const suitOfFlush = countsOfSuit.reduce((prev, counts, index)=>{
        if(counts >= 5){
            return index
        }
        else{
            return prev
        } 
    }, -1)

    if(suitOfFlush == -1){
        return []
    }
    else{
        return cards.filter((card)=>{
            return card.suit == suitOfFlush
        })
    }

}

function flush(cards){
    return flushCards(cards).slice(0, 5);
}

/************************
 *  Fullhouse
 ******************************/
 function fullHouse(cards){
    const numberOfAKind = HandValueUtilities.numberOfAKind(cards);
    const indexOfThree = numberOfAKind.findIndex(counts => counts == 3);
    const indexOfTwo = numberOfAKind.findIndex(counts => counts == 2);

    if (indexOfThree != -1 && indexOfTwo != -1){
        if(indexOfThree < indexOfTwo){
            return [...cards.slice(indexOfThree, indexOfThree+3), ...cards.slice(indexOfTwo, indexOfTwo+2)];
        }
        else if(indexOfThree > indexOfTwo){
            return [ ...cards.slice(indexOfTwo, indexOfTwo+2), ...cards.slice(indexOfThree, indexOfThree+3)];
        }
    }
    else{
        return []
    }

}


/************************
 *  Four of A Kind
 ******************************/
function fourOfAKind(cards){
    const numberOfAKind = HandValueUtilities.numberOfAKind(cards);
    const indexOfTheKind = numberOfAKind.findIndex(counts => counts == 4);
    if(indexOfTheKind == -1){
        return [];
    }
    else if(indexOfTheKind == 0){
        return [...cards.slice(indexOfTheKind, indexOfTheKind+4), cards[indexOfTheKind+4]];
    }
    else{
        return [...cards.slice(indexOfTheKind, indexOfTheKind+4), cards[0]];
    }
}

/************************
 *  Flush Straight
 ******************************/
function flushStraight(cards){
    const straightCard = straightCards(cards);

    for(let i = 0; i <= straightCard.length - 5; i++){
        const flushStraightCards = flushCards(straightCard.slice(i, i+5))
        if(flushStraightCards.length == 5){
            return flushStraightCards
        }
    }
    
    return [];
}


const HandValueEvaluate = {
    flushStraight,
    fourOfAKind,
    fullHouse,
    flush,
    straight,
    threeOfAKind,
    twoPair,
    pair,
    high
}

/***************
 *   flushStraight: 8
 *   fourOfAKind: 7
 *   fullHouse: 6
 *   flush: 5
 *   straight: 4
 *   threeOfAKind: 3
 *   twoPair: 2
 *   pair: 1
 *   high: 0
 */

function HandValueGenerate(cards){

    let best5;

    if((best5 = HandValueEvaluate.flushStraight(cards)).length == 5){
        return {
            rank: 8,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.fourOfAKind(cards)).length == 5){
        return {
            rank: 7,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.fullHouse(cards)).length == 5){
        return {
            rank: 6,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.flush(cards)).length == 5){
        return {
            rank: 5,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.straight(cards)).length == 5){
        return {
            rank: 4,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.threeOfAKind(cards)).length == 5){
        return {
            rank: 3,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.twoPair(cards)).length == 5){
        return {
            rank: 2,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.pair(cards)).length == 5){
        return {
            rank: 1,
            best5: best5
        };
    }
    else if((best5 = HandValueEvaluate.high(cards)).length == 5){
        return {
            rank: 0,
            best5: best5
        };
    }
}

function cardsCompare(cards1, cards2){
    if(cards1.rank == cards2.rank){
        if(cards1.best5.every((card, index) => card.number === cards2.best5[index])){
            // They have same hand value
            return 0;
        }
        else{
            let indexOfComparison = cards1.best5.findIndex((card, index) => {card.number != cards2.best5[index]});
            if(cards1.best5[indexOfComparison] > cards2.best5[indexOfComparison] ){
                //player 1 has a greater hand
                return 1;
            }
            else{
                //player 2 has a greater hand
                return -1;
            }
        }
    }
    else if(cards1.rank > cards2.rank){
        return 1;
    }
    else{
        return -1;
    }
}

function generateRank(cards){
    HandValueGenerate(cardsSort(cards))
}

export {cardsCompare, generateRank}
/************************
 * code for testing!
 ******************************/


 


function cardsShow(cards){
    
   
    console.log( cards.reduce((prev,e,i)=>{
        return [...prev, Object.keys(suits).find(key=>(cards[i].suit == Suits[key])) + cards[i].number.toString()]
    },[]).join(" "))
}

