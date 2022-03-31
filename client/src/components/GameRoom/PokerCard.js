import {
    S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14,
    H2, H3, H4, H5, H6, H7, H8, H9, H10, H11, H12, H13, H14,
    C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13, C14,
    D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14,
    Back, Empty
} from '../../assets/img/pokers/index'

function cardIndex(card){
    const cardIndex = []
    if(card){
        switch(card.suit){
            case 0:
                cardIndex.push('S');
                break;
            case 1:
                cardIndex.push('H');
                break;
            case 2:
                cardIndex.push('C');
                break
            case 3:
                cardIndex.push('D');
                break;
        }

        cardIndex.push(card.number)
        return cardIndex.join('')
    }
    else{
        return '';
    }
}

const PokerCard = ({card, empty}) =>{
    const chooseCards = (card)=>{
        switch(card){
            case 'S2':
                return S2;
            case 'S3':
                return S3;
            case 'S4':
                return S4;
            case 'S5':
                return S5;
            case 'S6':
                return S6;
            case 'S7':
                return S7;   
            case 'S8':
                return S8;
            case 'S9':
                return S9;
            case 'S10':
                return S10;
            case 'S11':
                return S11;
            case 'S12':
                return S12;
            case 'S13':
                return S13;   
            case 'S14':
                return S14;        
            case 'H2':
                return H2;
            case 'H3':
                return H3;
            case 'H4':
                return H4;
            case 'H5':
                return H5;
            case 'H6':
                return H6;
            case 'H7':
                return H7;   
            case 'H8':
                return H8;
            case 'H9':
                return H9;
            case 'H10':
                return H10;
            case 'H11':
                return H11;
            case 'H12':
                return H12;
            case 'H13':
                return H13;   
            case 'H14':
                return H14;
            case 'C2':
                return C2;
            case 'C3':
                return C3;
            case 'C4':
                return C4;
            case 'C5':
                return C5;
            case 'C6':
                return C6;
            case 'C7':
                return C7;   
            case 'C8':
                return C8;
            case 'C9':
                return C9;
            case 'C10':
                return C10;
            case 'C11':
                return C11;
            case 'C12':
                return C12;
            case 'C13':
                return C13;   
            case 'C14':
                return C14; 
            case 'D2':
                return D2;
            case 'D3':
                return D3;
            case 'D4':
                return D4;
            case 'D5':
                return D5;
            case 'D6':
                return D6;
            case 'D7':
                return D7;   
            case 'D8':
                return D8;
            case 'D9':
                return D9;
            case 'D10':
                return D10;
            case 'D11':
                return D11;
            case 'D12':
                return D12;
            case 'D13':
                return D13;   
            case 'D14':
                return D14;
            default:
                return Back;
        }
    }

        return(
            <img
                src = {empty ? Empty : chooseCards(cardIndex(card))}
                style = {Style.card}
                alt = 'poker'
            />
        )
}

const Style = {
    card: {
        height: 100,
        borderRadius: 8
    }
}

export default PokerCard