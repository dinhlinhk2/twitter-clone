const jwt = require('jsonwebtoken')

const verifyRefreshToken = (req, res, next) => {
    const token = req.cookies.refreshToken
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json("RefreshToken is invalid")
            }
            req.user = user
            next()
        })
    }
    else {
        return res.status(403).json("You are not authenticated")
    }
}

module.exports = verifyRefreshToken