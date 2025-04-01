const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const generateToken = require('../lib/utils')

const authController = {
    register: async (req, res) => {
        const { email, username, fullName, password } = req.body
        try {
            if (!username || !fullName || !password || !email) {
                return res.status(400).json({ message: "All fields are required!" })
            }
            if (password.length < 4) {
                return res.status(404).json({ message: "Password must be at least 4" })
            }
            const userexsit = await User.findOne({ username })
            if (userexsit) {
                return res.status(404).json({ message: "Username is already taken" })
            }
            const emailexsit = await User.findOne({ email })
            if (emailexsit) {
                return res.status(404).json({ message: "Email is already taken" })
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(password, salt)
            const newUser = await new User({
                fullName,
                username,
                password: hashedPass,
                email
            })
            const user = await newUser.save()
            const token = await generateToken(user)
            res.cookie('refreshToken', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV !== 'development'
            })
            // const { password, ...others } = user._doc
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
            console.log("error", error);
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body
        try {
            if (!username || !password) {
                return res.status(400).json("All fields are required")
            }
            const userexsit = await User.findOne({ username })
            if (!userexsit) {
                return res.status(404).json("Don't have username")
            }
            const validPass = await bcrypt.compare(password, userexsit.password)
            if (!validPass) {
                return res.status(403).json("Password wrong!")
            }
            if (userexsit || validPass) {
                const refreshToken = generateToken(userexsit)
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    secure: process.env.NODE_ENV !== 'development'
                })
            }
            const userWithoutPassword = await User.findById(userexsit._id).select('-password');
            const userObject = userWithoutPassword.toObject();
            res.status(200).json(userObject)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    logout: async (req, res) => {
        try {
            res.cookie('refreshToken', '', { maxAge: 0 })
            res.status(200).json({ message: 'Logout Success' })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            const { password, ...others } = user._doc
            res.status(200).json(others)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = authController