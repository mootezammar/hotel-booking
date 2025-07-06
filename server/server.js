import express from 'express'
import "dotenv/config"
import cors from "cors"
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebHooks from './controllers/clerkWebHooks.js'

connectDB()

const app = express()
app.use(cors())

//middlewares
app.use(express.json())
app.use(clerkMiddleware())


//api to listen clerk webhooks
app.use('/api/clerk', clerkWebHooks)

app.get('/',(req,res)=>res.send("api is working"));


const PORT = process.env.PORT || 3000


app.listen(PORT, () => console.log(`Serveur running on port ${PORT}`))