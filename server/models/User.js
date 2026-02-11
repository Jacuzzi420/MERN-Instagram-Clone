import mongoose from "mongoose"
import { genSalt, hash } from "bcrypt"

const UserSchema = mongoose.Schema({
    login: {
        type: String,
        unique: true,
    },
    avatarName: String,
    fullname: String,
    password: String,
}, {
    timestamps: true,
})

UserSchema.statics.register = async (login, fullname, password) => {
    try{
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        await User.create({ login: login, avatarName: '', fullname: fullname, password: hashedPassword })
    }
    catch(error){
        throw new Error(error)
    }
}

UserSchema.statics.getPassword = async (password) => {
    try{
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        return hashedPassword
    }
    catch(error){
        throw new Error(error)
    }
}

const User = mongoose.model('User', UserSchema)

export default User