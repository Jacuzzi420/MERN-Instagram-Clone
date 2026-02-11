import pagination from "mongoose-paginate-v2"
import mongoose from "mongoose"

const LikeSchema = mongoose.Schema({
    person: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
})

const CommentSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    content: String,
})

const PostSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    imageName: String,
    likes: [LikeSchema],
    comments: [CommentSchema],
}, {
    timestamps: true,
})

PostSchema.plugin(pagination)

const Post = mongoose.model('Post', PostSchema)

export default Post