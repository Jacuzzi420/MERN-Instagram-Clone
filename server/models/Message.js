import mongoose from "mongoose"

const MessageSchema = mongoose.Schema({
    conversationId: String,
    sender: String,
    content: String,
}, {
    timestamps: true,
})

const Message = mongoose.model('Message', MessageSchema)

export default Message