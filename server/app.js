import dotenv from "dotenv"
dotenv.config()

import express, { json } from "express"
import { createServer } from "http"
import mongoose from "mongoose"
import morgan from "morgan"
import path from "path"
import fs from "fs"

import authRouter from "./routes/authRouter.js"
import postRouter from "./routes/postRouter.js"
import userRouter from "./routes/userRouter.js"
import chatRouter from "./routes/chatRouter.js"
import passport from "./config/passport.js"
import socket from "./config/socket.js"

const logStream = fs.createWriteStream(`./logs/log_${new Date().toLocaleDateString()}.log`, { flags: 'a' })
const app = express()
const server = createServer(app)

mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATABASE_KEY)
    .then(() => {
        console.log('Connected to database')
        socket(server)
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}/`)
        })
    })
    .catch((error) => {
        console.log(error)
    })

passport()

app.use(morgan('combined', { stream: logStream }))
app.use(json())

app.use('/api/auth/', authRouter)
app.use('/api/post/', postRouter)
app.use('/api/user/', userRouter)
app.use('/api/chat/', chatRouter)
app.get('/api/getImage/:imageName', (req, res) => {
    const { imageName } = req.params
    res.status(200).sendFile(path.resolve('Images', imageName))
})

