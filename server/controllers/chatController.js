import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"

export default {
    async getUserConversations(req, res){
        try{
            const { userId } = req.params
            const conversations = await Conversation.find({ members: { $in: [userId] }}).select('members')
            res.status(200).json(conversations)
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async getConversation(req, res){
        try{
            const { conversationId } = req.params
            const conversation = await Conversation.findById(conversationId).select('members')
            return res.status(200).json(conversation)
        }
        catch(error){
            console.log(error)
            if(error.kind === 'ObjectId'){
                return res.status(403).send('Wrong ID')
            }
            res.status(403).send('Forbidden')
        }
    },
    async getMessages(req, res){
        try{
            const { conversationId } = req.params
            const messages = await Message.find({ conversationId: conversationId }).sort({ createdAt: 'asc' })
            res.status(200).json(messages)
        }
        catch(error){
            console.log(error)
            if(error.kind === 'ObjectId'){
                return res.status(403).send('Wrong ID')
            }
            res.status(403).send('Forbidden')
        }
    },
    async addConversation(req, res){
        try{
            const { fromId, toId } = req.body
            const conversation = await Conversation.findOne({ members: { $all: [fromId, toId] }})
            if(!conversation){
                const newConversation = await Conversation.create({ members: [fromId, toId]})
                return res.status(200).send(newConversation._id)
            }
            return res.status(200).send(conversation._id)
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async addMessage(req, res){
        try{
            const { conversationId, sender, content } = req.body
            await Message.create({ conversationId: conversationId, sender: sender, content: content })
            res.status(200).send('Success')
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
}