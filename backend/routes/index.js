const authRoute = require('./auth.route')
const userRoute = require('./user.route')

const Route = (app) => {
    app.use('/v1/auth', authRoute)
    app.use('/v1/user', userRoute)
}

module.exports = Route