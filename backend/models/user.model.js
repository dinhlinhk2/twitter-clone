const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        requred: true,
        minlength: 4
    },
    email: {
        type: String,
        requred: true,
        unique: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    profileImg: {
        type: String,
        default: ''
    },
    coverImg: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    }


}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)