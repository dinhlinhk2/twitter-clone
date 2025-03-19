const express = require('express')
const cors = require('cors')
const cookie = require('cookie-parser')
const dotenv = require('dotenv')
const Route = require('./routes/index')
const connectDB = require('./lib/db')

dotenv.config()
const port = process.env.PORT || 5000
const app = express()
app.use(express())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    credentials: true
}))
app.use(cookie())

Route(app)
app.listen(port, () => {
    console.log("Server is running!");
    connectDB()
})