import { Router } from "express"
import passport from "passport"
import Controller from "../controllers/userController.js"
import upload from "../config/multer.js"

const api = Router()

api.get('/getUsers', passport.authenticate('jwt', { session: false }), Controller.getUsers)
api.get('/getUser/:username', passport.authenticate('jwt', { session: false }), Controller.getUser)
api.get('/getUserById/:userId', passport.authenticate('jwt', { session: false }), Controller.getUserById)
api.put('/changeUser', upload.single('avatar'), Controller.changeUser)

export default api