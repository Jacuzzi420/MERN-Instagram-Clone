import dotenv from "dotenv"
dotenv.config()

import User from "../models/User.js"
import jwt from "jsonwebtoken"

export default {
    async getUsers(req, res){
        try{
            const users = await User.find({}).select('login fullname avatarName')
            res.status(200).json(users)
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async getUser(req, res){
        try{
            const { username } = req.params
            const user = await User.findOne({ login: username }).select('-password')
            res.status(200).json(user)
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async getUserById(req, res){
        try{
            const { userId } = req.params
            const user = await User.findById(userId).select('login avatarName')
            res.status(200).json(user)
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async changeUser(req, res){
        try{
            const token = req.headers.authorization.split(' ')[1]
            const { username, fullname, password } = req.body
            const filename = req.file ? req.file.filename : false
            const { login } = jwt.verify(token, process.env.ACCESS_TOKEN)
            const user = await User.findOne({ login: login })
            username ? user.login = username : undefined
            filename ? user.avatarName = filename : undefined
            fullname ? user.fullname = fullname : undefined
            password ? user.password = await User.getPassword(password) : undefined
            await user.save()
            res.status(200).send('Success')
        }
        catch(error){
            console.log(error)
            if(error.code === 11000){
                return res.status(403).send('Username already exist')
            }
            res.status(403).send('Forbidden')
        }
    },
}