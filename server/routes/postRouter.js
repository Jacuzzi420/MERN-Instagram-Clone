import { Router } from "express"
import passport from "passport"
import Controller from "../controllers/postController.js"
import upload from "../config/multer.js"

const api = Router()

api.post('/createPost', passport.authenticate('jwt', { session: false }), upload.single('image'), Controller.createPost)
api.post('/commentPost/:postId', passport.authenticate('jwt', { session: false }), Controller.commentPost)
api.put('/likePost/:postId', passport.authenticate('jwt', { session: false }), Controller.likePost)
api.get('/getUserPosts/:userId', passport.authenticate('jwt', { session: false }), Controller.getUserPosts)
api.get('/getPosts', passport.authenticate('jwt', { session: false }), Controller.getPosts)

export default api