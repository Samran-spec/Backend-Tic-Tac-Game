import express from 'express'
import cors from 'cors'
import connect from './database/connection.js'
import {startNewGame} from './controllers/gameController.js'

export const app = express()
app.use(express.json());
app.use(cors())

const port = 5000

//api end-point 
app.post('/new-game', startNewGame);
//we only listen to the port if the database connection is succeful and connect() is a helper function in the /database/connection.js
connect().then(()=>{
    app.listen(port, ()=>{
        console.log(`connected to server on port ${port}`)
    })
}).catch((err)=>{
    console.log("fail to connect to MongoServer")
})