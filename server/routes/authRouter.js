import { Router } from "express"
import passport from "passport"
import Controller from "../controllers/authController.js"

const api = Router()

api.post('/register', Controller.register)
api.post('/login', passport.authenticate('local', { session: false }), Controller.login)
api.post('/refresh', Controller.refresh)
api.delete('/logout', passport.authenticate('jwt', { session: false }), Controller.logout)
api.get('/verify', passport.authenticate('jwt', { session: false }), Controller.verify)

export default api