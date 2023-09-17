const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB
module.exports = async () => {
    try {
        mongoose.connect(
            url,
            (err, data) => {
                if (err)
                    return new Error('Unable to connect to the database')
                console.log('Database connected successfully')
            }
        )
    }
    catch (err) {
        console.log(err)
    }
}