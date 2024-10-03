import mongoose from "mongoose";


export const connectDb = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongoDB connected: ${conn.connection.host}`);
    }catch(err){
        console.log(`error connection to mongodb`, err.message);
        process.exit(1); // 1 is failure , 0 status code is success
    }
}