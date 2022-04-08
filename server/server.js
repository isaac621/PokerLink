import { Server } from "socket.io";
import socketInit from "./socket/socket.js";
import express, { json } from 'express'
import { createServer } from "http";
import bcrypt from 'bcrypt'

import 'dotenv/config'
import jwt from 'jsonwebtoken'
import cors from 'cors';
import { Admin, User} from "./mongoDB/model.js";
import { sendConfirmationEmail, sendForgotPasswordEmail } from "./mail/mail.js";
import {generateRoomID} from "./ultility.js"
import multer from 'multer'
import fs from 'fs'
import mongoose from "mongoose";
import { db } from "./mongoDB/connection.js";

const storage = multer.memoryStorage()

const upload = multer({storage: storage})
const app = express()
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
})

const games = {};


socketInit(io, games)

httpServer.listen(3001);

async function resetDB(){
  const res = await User.updateMany({}, {isGaming: false, roomID: null})

}
resetDB()


app.use(express.json())
app.use(cors())



app.post('/validation/email',  (req, res)=>{
   User.find({email: req.body.email}, (err, results)=>{
    if(results.length > 0){
      res.json({
        validation: false,
        error: 'This email has been used'
      })
    }
    else{
      res.json({
        validation: true,
      })
    }
})
})

app.post('/validation/userName', (req, res)=>{
   User.find({userName:req.body.userName}, (err, results)=>{
    if(results.length > 0){
      res.json({
        validation: false,
        error: 'This userName has been used'
      })
    }
    else{
      res.json({
        validation: true,
      })
    }
})
})


app.post('/signUp', async (req, res)=>{
  const {userName, password, email} = req.body;

  const confirmationCode = generateRoomID(12)
  try{
    const hashedPassword = await bcrypt.hash(password, 10)
    User.create({
      userName,
      email,
      password: hashedPassword,
      avatar: fs.readFileSync('./static/defaultAvatar.png'),
      confirmationCode: confirmationCode,
      isVerified: false
    })
    console.log('userCreated')
    
    sendConfirmationEmail(userName, email, confirmationCode)
    res.status(201).send()
  }
  catch{
    res.status(500).send()
  }

})

app.post('/update/socketID', authenticateToken , async(req, res)=>{
   if(req.user!=null){
  
     req.user.socketID = req.body.socketID
     await req.user.save()
     
     res.send()
   }
   else{
     res.sendStatus(400)
   }
})

app.post('/game/gameInfo', authenticateToken, (req, res)=>{
  if(req.user.roomID){
    games[req.user.roomID].players = games[req.user.roomID].players.map((player)=>{
      
      if(player.id.equals(req.user._id)){
      
        player.socketID = req.body.socketID
       io.sockets.sockets.get(req.body.socketID).join(req.user.roomID);
        
      }
      return player
    })

    res.json(games[req.user.roomID].sendReconnectRoomInfo(req.body.socketID))
    return
 }

 res.send()
})

app.post('/login', async (req, res)=>{
  console.log('login')
  const {userName, password} = req.body
  const user = await User.findOne({userName: userName})
  if(user==null){
    res.status(400).json({message: 'Cannot find user'})
  }
  try{
    if(await bcrypt.compare(password, user.password)){
      const payload = {
        id: user.id
      }
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
      res.json({accessToken: accessToken, message: 'Login Successfully'})
    }
    else{
      res.status(403).json({message: 'wrong password'})
    }
  }
  catch{
    res.status(500).send()
  }
  //res.sendStatus(200)
})




app.post('/authenticate', authenticateToken, (req, res)=>{
  res.sendStatus(200)
})

app.post('/admin/authenticate', authenticateAdminToken, (req, res)=>{
  
  res.sendStatus(200)
})

app.get('/auth/confirm/:confirmationCode', (req, res)=>{
  User.findOne({confirmationCode: req.params.confirmationCode})
  .then((user)=>{
    if(user == null){
      return res.status(404).send({message: "Invalid code"});
    }

    user.isVerified = true;
    user.confirmationCode = undefined;
    user.save((err)=>{
      if(err){
        res.status(500).send({message: err});
        return
      }
    })
    res.send({message: "Verification has done successfully"})
  })
})

app.get('/auth/forgot/:userName', (req, res)=>{
  User.findOne({userName: req.params.userName}).then((user)=>{
    if(user==null){
      return res.status(401).send({message: "User does not exist"})
    }
    const forgotCode = generateRoomID(12);
    user.forgotCode = forgotCode
    user.save()
    sendForgotPasswordEmail(user.userName, user.email, forgotCode);
    return res.send({message: "Reset Message has been sent"});
  }).catch(err=>res.sendStatus(500))
})

app.post('/auth/reset/', (req, res)=>{
  const {forgotCode, password} = req.body
  User.findOne({forgotCode: forgotCode})
  .then(async (user)=>{
    if(user == null){
      return res.status(404).send({message: "Invalid code"});
    }
    try{
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword;
      user.forgotCode = undefined;
      user.save((err)=>{
        if(err){
          return res.status(500).send({message: err});
        }
      })
    }
    catch{
      return res.status(500).send({message: err});
    }
    res.send({message: "Password has been resetted"})
  })
})



app.post('/upload/avatar', authenticateToken, upload.single('avatar'), async(req, res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    console.log('done')
    res.send({message: 'Upload Successfully'})
})

app.get('/users/avatar', authenticateToken, async(req,res)=>{

  if(req.user.avatar){
    res.set('Content-Type', 'image/png')
    res.send(req.user.avatar)
  }
  else{
    res.sendStatus(500)
  }
})

app.get('/users/avatar/:id', authenticateToken, async(req, res)=>{
  const user = await User.findById(req.params.id)
  if(user.avatar){
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  }
  else{
    res.sendStatus(500)
  }
})

app.get('/users/info', authenticateToken, async(req, res)=>{
  res.json(req.user)
})

app.post('/admin/login', async (req, res)=>{
  
  const {userName, password} = req.body
  const user = await Admin.findOne({userName: userName})
  if(user==null){
    res.status(400).send({message: "Cannot find user"})
  }
  try{
    if(await bcrypt.compare(password, user.password)){
      const payload = {
        id: user.id
      }
      const accessToken = jwt.sign(payload, process.env.ADMIN_ACCESS_TOKEN_SECRET)
      res.json({accessToken: accessToken, message: 'Login Successfully'})
    }
    else{
      res.send({message: 'wrong password'})
    }
  }
  catch{
    res.status(500).send()
  }
  //res.sendStatus(200)
})

app.post('/admin/search', authenticateAdminToken, async(req, res)=>{
  res.send(await User.find(req.body));

})

app.post('/admin/getUser/:id', authenticateAdminToken, async(req, res)=>{
  res.send(await User.findById(req.params.id))
})

app.get('/admin/getUser/avatar/:id', authenticateAdminToken, async(req, res)=>{
  const user = await User.findById(req.params.id)
  if(user && user.avatar){
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  }
  else{
    res.sendStatus(500)
  }
})


app.post('/admin/update/user', authenticateAdminToken, upload.single('avatar'), async(req, res)=>{
  try{
    const user= await User.findById(req.body._id);
    if(req.file != null){
      console.log('avatarUpdated')
      user.avatar = req.file.buffer
    }
    user.userName = req.body.userName
    user.isVerified = req.body.isVerified
    await user.save()
    console.log('updated')
    res.send({message: 'Update Successfully'})
  }
  catch{
    res.status(401).send({message: 'Username has been used'})
  }
})

app.post('/admin/resetPassword/:id',authenticateAdminToken, async(req,res)=>{
  const user = await User.findById(req.params.id)
  if(user == null){
    res.status(401).send({message: "User not found"})
  }
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    user.password = hashedPassword
    await user.save()
    res.send({message: 'Password has been resetted'})
  }
  catch{
    res.status(500).send({message: "Server Error"})
  }
})


app.get('/game/gameState', authenticateToken, (req, res)=>{
  const userState = req.user.isGaming
  if(userState){
    if(games[req.user.roomID].started){
      res.json({path:'/gameRoom'})
    }
    else{
      res.json({path:'/waitingRoom'})
    }
  }
  else{
    res.json({path:'/lobby'})
  }


})

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if(token == null) return res.status(401).send({message: 'Please login'})

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, user)=>{
    
    if(err) return res.sendStatus(403)
    req.user = await User.findById(user.id)
    next()
  })
  
}

function authenticateAdminToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if(token == null) return res.status(401).send({message: 'Please login'})

  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, async(err, user)=>{
    
    if(err) return res.sendStatus(403)
    req.admin = await Admin.findById(user.id)
    next()
  })
  
}