import express from 'express';
import { connectDb } from './DB/connectDB.js';
import dotenv from 'dotenv'
import authroutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000
app.use(express.json())
app.use(cookieParser())

app.get('/' , (req , res)=>{
    res.send("hey there")
})

app.use('/api/auth',authroutes)

app.listen(PORT , ()=>{
    connectDb()
    console.log(`server is running on ${PORT}`);
})
