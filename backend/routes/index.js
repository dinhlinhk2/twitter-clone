const authRoute = require('./auth.route')

const Route = (app) => {
    app.use('/v1/auth', authRoute)
}

module.exports = Route