import mongoose from './connection.js'

const UserSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    socketID: String,
    confirmationCode: String,
    isVerified: Boolean,
    forgotCode: String,
    avatar: Buffer
})

const User = mongoose.model('User', UserSchema)



export{User}