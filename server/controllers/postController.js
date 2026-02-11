import Post from "../models/Post.js"

export default {
    async createPost(req, res){
        try{
            const { creator } = req.body
            const { filename } = req.file
            await Post.create({ creator: creator, imageName: filename, likes: [], comments: [] })
            res.status(200).send('Success')
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async commentPost(req, res){
        try{
            const { postId } = req.params
            const { username, content } = req.body
            const post = await Post.findById(postId)
            await post.updateOne({ $push: { comments: { creator: username, content: content }}})
            return res.status(200).send('Success')
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async likePost(req, res){
        try{
            const { postId } = req.params
            const { userId } = req.body
            const post = await Post.findById(postId)
            if(!post.likes.some(({ person }) => person == userId)){
                await post.updateOne({ $push: { likes: { person: userId }}})
                return res.status(200).send('Success')
            }
            await post.updateOne({ $pull: { likes: { person: userId }}})
            return res.status(200).send('Success')
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async getUserPosts(req, res){
        try{
            const { userId } = req.params
            const posts = await Post.find({ creator: userId }).populate({ path: 'creator', select: 'login avatarName' }).populate({ path: 'likes', populate: { path: 'person', select: 'login' }}).populate({ path: 'comments', populate: { path: 'creator', select: 'login' }}).sort({ createdAt: -1 })
            res.status(200).json(posts)
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
    async getPosts(req, res){
        try{
            const posts = await Post.paginate({}, {
                sort: { createdAt: -1 },
                populate: [{ path: 'creator', select: 'login avatarName' }, { path: 'likes', populate: { path: 'person', select: 'login' }}, { path: 'comments', populate: { path: 'creator', select: 'login' }}],
                limit: 10,
                page: req.query.page || 1,
            })
            res.status(200).json(posts)
        }
        catch(error){
            console.log(error)
            res.status(403).send('Forbidden')
        }
    },
}