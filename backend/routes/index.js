const authRoute = require('./auth.route')
const userRoute = require('./user.route')
const postRoute = require('./post.route')

const Route = (app) => {
    app.use('/v1/auth', authRoute)
    app.use('/v1/user', userRoute)
    app.use('/v1/post', postRoute)
}

module.exports = Route