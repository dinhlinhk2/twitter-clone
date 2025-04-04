const Post = require('../models/post.model')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const cloudinary = require('../lib/cloudinary')
const postController = {
    createPost: async (req, res) => {
        const { text } = req.body
        let { img } = req.body
        const userId = req.user.id
        try {
            const user = await User.findById(userId)
            if (!user) return res.status(404).json({ message: 'User not found' })
            if (!text && !img) return res.status(403).json({ message: 'Post must have text or img' })
            if (img) {
                const uploadres = await cloudinary.uploader.upload(img)
                img = uploadres.secure_url
            }
            const newPost = new Post({
                user: userId,
                text: text,
                img: img,
            })
            await newPost.save()
            res.status(201).json(newPost)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            if (!post) return res.status(403).json({ message: 'Post is not found' })
            if (post.user.toString() !== req.user.id.toString()) return res.status(404).json({ message: 'You are not authorized to delete' })
            if (post.img) {
                await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0])
            }
            await Post.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Delete success' })
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    commentPost: async (req, res) => {
        const { text } = req.body
        const postId = req.params.id
        try {
            if (!text) return res.status(403).json({ message: 'Text field is required' })
            const post = await Post.findById(postId)
            if (!post) return res.status(403).json({ message: 'Post is not found' })
            const comment = { text, user: req.user.id }
            post.comments.push(comment)
            await post.save()
            res.status(200).json(post.comments)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    likePost: async (req, res) => {
        try {
            const userId = req.user.id
            const postId = req.params.id
            const post = await Post.findById(postId)
            if (!post) return res.status(403).json({ message: 'Post is not found' })
            const isLike = post.likes.includes(userId)
            if (isLike) {
                //unlike
                await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
                await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
                const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())

                res.status(200).json(updatedLikes)
            } else {
                //like
                // const postUpdate = await Post.updateOne(
                //     { _id: postId },
                //     { $push: { likes: userId } },
                //     { new: true }
                // );
                await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } }, { new: true })
                post.likes.push(userId);
                await post.save()
                const newNotification = new Notification({
                    type: 'like',
                    from: userId,
                    to: post.user
                })
                await newNotification.save()
                res.status(200).json(post.likes)
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    getAllPost: async (req, res) => {
        try {
            const post = await Post.find().sort({ createAt: -1 }).populate({
                path: 'user',
                select: '-password'
            }).populate({
                path: "comments.user",
                select: '-password'
            })
            if (post.length === 0) return res.status(200).json([])
            res.status(200).json(post)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    getLikePost: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user) return res.status(403).json({ message: 'User not found' })
            const likepost = await Post.find({ _id: { $in: user.likedPosts } }).populate({
                path: 'user',
                select: '-password'
            }).populate({
                path: 'comments.user',
                select: '-password'
            })

            res.status(200).json(likepost)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    getFollowingPost: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            if (!user) return res.status(403).json('User not found')
            const following = user.following
            const followPost = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
                path: 'user',
                select: '-password'
            }).populate({
                path: 'comments.user',
                select: '-password'
            })
            res.status(200).json(followPost)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    getUserPost: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.params.username })
            if (!user) return res.status(403).json('User not found')
            const userPost = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
                path: 'user',
                select: '-password'
            }).populate({
                path: 'comments.user',
                select: '-password'
            })
            res.status(200).json(userPost)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }
}

module.exports = postController