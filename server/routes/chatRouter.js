import { Router } from "express"
import passport from "passport"
import Controller from "../controllers/chatController.js"

const api = Router()

api.get('/getUserConversations/:userId', passport.authenticate('jwt', { session: false }), Controller.getUserConversations)
api.get('/getConversation/:conversationId', passport.authenticate('jwt', { session: false }), Controller.getConversation)
api.get('/getMessages/:conversationId', passport.authenticate('jwt', { session: false }), Controller.getMessages)
api.post('/addConversation', passport.authenticate('jwt', { session: false }), Controller.addConversation)
api.post('/addMessage', passport.authenticate('jwt', { session: false }), Controller.addMessage)

export default api