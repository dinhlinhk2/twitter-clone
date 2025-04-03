const mongodb = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongodb.connect(process.env.MONGODB_URL)
        console.log(`Connected Success ${conn.connection.host}`);

    } catch (error) {
        console.log("Connect Error", error);

    }
}

module.exports = connectDB