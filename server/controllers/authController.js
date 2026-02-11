import dotenv from "dotenv"
dotenv.config()

import User from "../models/User.js"
import Token from "../models/Token.js"
import jwt from "jsonwebtoken"

export default {
    async register(req, res){
        try{
            const { login, fullname, password } = req.body
            await User.register(login, fullname, password)
            res.status(200).send('Success')
        }
        catch(error){
            res.status(403).send('Forbidden')
        }
    },
    async login(req, res){
        try{
            const { id, login, avatarName, fullname } = req.user
            const payload = { id: id, login: login, avatarName: avatarName, fullname: fullname }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' })
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN)
            const token = await Token.findOne({ userId: id })
            if(token){
                await token.delete()
            }
            Token.create({ token: refreshToken, userId: id })
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async refresh(req, res){
        try{
            const { refreshToken } = req.body
            const token = await Token.findOne({ token: refreshToken })
            if(!token){
                return res.status(403).send('Forbidden')
            }
            const { id, login, avatarName, fullname } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
            const payload = { id: id, login: login, avatarName: avatarName, fullname: fullname }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' })
            res.status(200).json({ accessToken: accessToken })
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async logout(req, res){
        try{
            const { refreshToken } = req.body
            const token = await Token.findOne({ token: refreshToken })
            await token.delete()
            res.status(200).send('Success')
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    verify(req, res){
        res.status(200).send('Authorized')
    },
}