import 'dotenv/config'
import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
  console.log("Connection is open....")
})

export default mongoose