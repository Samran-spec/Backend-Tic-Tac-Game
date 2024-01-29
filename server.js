import express from 'express'
import cors from 'cors'

export const app = express()
app.use(express.json());
app.use(cors())

const port = process.env.port

app.listen(port, ()=>{
    console.log("connected to server")
})