import mongoose from "mongoose"

const dbconnect=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`mngodb connected !! DB HOST: ${connectionInstance.connection.host}`)
    }
    catch(err){
        console.log('mongodb connection error',err)
        process.exit(1)
    }
}
export default dbconnect