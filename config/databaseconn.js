import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export function DBConnect(){
const db=mongoose.connect(process.env.mongo_connection, {
   
    serverSelectionTimeoutMS: 30000
}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
});

}