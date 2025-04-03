const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const bcrypt = require('bcryptjs')
const cloudinary = require('../lib/cloudinary')

const userController = {
    getUsername: async (req, res) => {
        // const { username } = req.params
        try {
            const user = await User.findOne({ username: req.params.username }).select('-password')
            if (!user) {
                return res.status(403).json({ message: 'User is invalid' })
            }
            res.status(200).json(user)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    followUser: async (req, res) => {
        const { id } = req.params
        try {
            const userToFollow = await User.findById(id)
            const currentUser = await User.findById(req.user.id)
            if (id === req.user.id) {
                return res.status(400).json({ message: 'You can not follow yourself ' })
            }
            if (!userToFollow || !currentUser) {
                return res.status(403).json({ message: 'User not found' })
            }
            const isFollow = currentUser.following.includes(id)
            if (isFollow) {
                // unfollow
                await User.findByIdAndUpdate(id, { $pull: { followers: req.user.id } })
                await User.findByIdAndUpdate(req.user.id, { $pull: { following: id } })
                res.status(200).json({ message: "UnFollow Success" })
            } else {
                //follow
                await User.findByIdAndUpdate(id, { $push: { followers: req.user.id } })
                await User.findByIdAndUpdate(req.user.id, { $push: { following: id } })

                const newNotification = new Notification({
                    type: 'follow',
                    from: req.user.id,
                    to: userToFollow._id
                })
                await newNotification.save()

                res.status(200).json({ message: "Follow Sucess" })
            }

        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getSuggestedUser: async (req, res) => {
        try {
            const userId = req.user.id
            const userFollowMe = await User.findById(userId).select('following')

            const users = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: userId }
                    }
                },
                {
                    $sample: { size: 10 } // lọc 10 ngẫu nhiên
                }
            ])
            // lọc ra các user chưa follow
            const filterUsers = users.filter(user => !userFollowMe.following.includes(user._id))
            const suggestedUsers = filterUsers.slice(0, 4)
            suggestedUsers.forEach(user => user.password = null)
            res.status(200).json(suggestedUsers)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    },
    update: async (req, res) => {
        const { username, fullName, email, currentPass, NewPass, bio, link } = req.body
        let { profileImg, coverImg } = req.body
        const userId = req.user.id
        try {
            let user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            if ((!NewPass && currentPass) || (NewPass && !currentPass)) {
                return res.status(400).json({ error: 'Please provider bold currentPass and new pass' })
            }
            if (currentPass && NewPass) {
                const isPass = await bcrypt.compare(currentPass, user.password)
                if (!isPass) return res.status(404).json({ message: 'Current password is incorrect' })
                if (NewPass.length < 4) return res.status(403).json({ message: 'Password must be at least 4' })

                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(NewPass, salt)
            }
            if (profileImg) {
                if (user.profileImg) {
                    await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
                }
                const uploadRes = await cloudinary.uploader.upload(profileImg)
                profileImg = uploadRes.secure_url
            }
            if (coverImg) {
                if (user.coverImg) {
                    await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
                }
                const uploadRes = await cloudinary.uploader.upload(coverImg)
                coverImg = uploadRes.secure_url
            }
            user.username = username || user.username
            user.fullName = fullName || user.fullName
            user.email = email || user.email
            user.profileImg = profileImg || user.profileImg
            user.coverImg = coverImg || user.coverImg
            user.email = email || user.email
            user.bio = bio || user.bio
            user.link = link || user.link
            user = await user.save()
            user.password = null
            res.status(200).json(user)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)

        }
    }
}

module.exports = userController