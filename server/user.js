const PlayerStatus = {
    idle: 0,
    gaming: 1,
    offline: 2
}

function create_user(id, email, username, password, gender, profilePicture){
    return {
        id: id,
        email: email,
        username: username,
        password: password,
        gender: gender,
        profilePicture: profilePicture,
        lastLogin: '',
        status: PlayerStatus.offline,
        verified: false
    }
}