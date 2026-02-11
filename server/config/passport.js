import dotenv from "dotenv"
dotenv.config()

import { Strategy as LocalStratrgy } from "passport-local"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import { compare } from "bcrypt"
import passport from "passport"
import User from "../models/User.js"

export default () => {
    const config = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN,
    }

    passport.use(new LocalStratrgy({ usernameField: 'login' }, async (login, password, done) => {
        try{
            const user = await User.findOne({ login: login })
            if(!user){
                return done(null, false, { message: "Wrong login" })
            }
            else{
                const isValid = await compare(password, user.password)
                if(isValid){
                    return done(null, { id: user._id, login: user.login, avatarName: user.avatarName, fullname: user.fullname })
                }
                else{
                    return done(null, false, { message: "Wrong password" })
                }
            }
        }
        catch(error){
            console.log(error)
            return done(error)
        }
    }))

    passport.use(new JWTStrategy(config, async (payload, done) => {
        try{
            const user = await User.findOne({ login: payload.login })
            if(user){
                return done(null, { id: user._id, login: user.login, avatarName: user.avatarName, fullname: user.fullname })
            }
            else{
                return done(null, false, { massage: "Invalid token"})
            }
        }
        catch(error){
            console.log(error)
            return done(error)
        }
    }))
}