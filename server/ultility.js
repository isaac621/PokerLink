
function swap(arr, index1, index2){
    if(index1 == index2){
        return arr;
    }
    return arr.map((e,i)=>{
        if(i === index1) return arr[index2];
        if(i === index2) return arr[index1];
        return e
    })
}

function generateRoomID(length){
    let string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'


    const roomID = [];
    for(let i =0; i< length; i++){
        roomID.push(string[Math.floor(Math.random()*string.length)])
    }

    return roomID.join('')
}

function sleep(duration){
    return new Promise((resolve)=>{
        setTimeout(resolve, duration)
    })
}

export {swap, generateRoomID, sleep}