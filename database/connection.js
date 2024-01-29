import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default async function connect(){
    //creating Mengo Memory server
    const MongoServer = await MongoMemoryServer.create();
    //getting the url
    const mongoUri = MongoServer.getUri()
    
    //Connecting to the url
    await mongoose.connect(mongoUri)
    console.log(`mongoDB successfully connected with ${mongoUri}`)
}