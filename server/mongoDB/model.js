import mongoose, { db } from './connection.js'

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
    },
    email: String,
    password: String,
    socketID: String,
    confirmationCode: String,
    isVerified: Boolean,
    forgotCode: String,
    avatar: Buffer,
    isGaming: Boolean,
    roomID: String,
})

const AdminSchema = new mongoose.Schema({
    userName: String,
    password: String,
})

const User = mongoose.model('User', UserSchema)
const Admin = mongoose.model('Admin', AdminSchema)



export{User, Admin}