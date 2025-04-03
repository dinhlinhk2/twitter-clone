const authRoute = require('./auth.route')
const userRoute = require('./user.route')
const postRoute = require('./post.route')
const notificationRoute = require('./notification.route')

const Route = (app) => {
    app.use('/v1/auth', authRoute)
    app.use('/v1/user', userRoute)
    app.use('/v1/post', postRoute)
    app.use('/v1/notification', notificationRoute)
}

module.exports = Route