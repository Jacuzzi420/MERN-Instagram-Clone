import mongoose from "mongoose"

const TokenSchema = mongoose.Schema({
    token: String,
    userId: String,
}, {
    timestamps: true,
})

const Token = mongoose.model('Token', TokenSchema)

export default Token