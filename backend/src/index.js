const express = require('express')
const cors = require('cors')
const cookie = require('cookie-parser')
const dotenv = require('dotenv')
const Route = require('./routes/index')
const connectDB = require('./lib/db')
const path = require('path')
dotenv.config()

const port = process.env.PORT || 5000
const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}))
app.use(cookie())

Route(app)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
    });
}

app.listen(port, () => {
    console.log("Server is running!");
    connectDB()
})

