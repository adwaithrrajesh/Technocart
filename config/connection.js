const mongoose = require('mongoose')
const url = 'mongodb://localhost/Technocart'
module.exports = async function connection(){
    try{

        mongoose.connect(
            url,
            (err, data) => {
                if (err)
                    return new Error('Unable to connect to the database')
                console.log('Database connected successfully')
            }
        )
    }
    catch(err){
        console.log(err)
    }
}